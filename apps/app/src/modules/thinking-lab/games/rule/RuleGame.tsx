import { useRef, useState } from "react";
import { Art, Icon, LabHead, LabRow, newRec, pick, shuffle, Think, useHints, useLater, type GameItem, type GameProps, type LabRun } from "../../kit";
import { RM_ALL, RM_FILLS, RM_RULES, RM_SHAPES, RM_SIZES, rmDiff, rmMachine, rmName, rmSame, rmToken, type MachineState, type Obj, type Rule } from "./logic";

// Records how the learner investigates: how many tests, whether they change one thing at a time (a fair test), and
// whether a wrong guess sends them back to gather more evidence.
export function RuleGame({ run, onFinish }: GameProps) {
  const { W } = run, pool = RM_RULES[run.band];
  const [rules] = useState(() => shuffle(pool).slice(0, 2)), items = useRef<GameItem[]>([]), [ri, setRi] = useState(0);
  const next = (rec: GameItem) => {
    items.current.push(rec);
    if (ri + 1 < rules.length) return setRi(ri + 1);
    const its = items.current;
    onFinish({ items: its, extra: `Tests per machine: ${its.map(i => i.tests).join(", ")}. Fair tests (one change at a time): ${its.map(i => i.fairTests).join(", ")}. Guesses: ${its.map(i => i.guesses).join(", ")}.`,
      reflect: { q: W("How did you find the rule?", "How did you work out the rule?"), options: ["I changed one thing at a time", "I tried lots of different things", "I looked at what lit up", "I'm not sure"] } });
  };
  return <Machine key={ri} run={run} rule={rules[ri]!} pool={pool} ri={ri} count={rules.length} onNext={next} />;
}

interface LogEntry { o: Obj; yes: boolean; given?: boolean }
function Machine({ run, rule, pool, ri, count, onNext }: { run: LabRun; rule: Rule; pool: Rule[]; ri: number; count: number; onNext: (rec: GameItem) => void }) {
  const { W } = run, lights = rule.f;
  const [start] = useState(() => [pick(RM_ALL.filter(lights)), pick(RM_ALL.filter(o => !lights(o)))] as const);
  const rec = useRef(newRec(`Rule ${ri + 1}`, { tests: 0, fairTests: 0, guesses: 0, predictions: 0, mode: "tested objects" }));
  const hints = useHints([W("Change just one thing at a time, then see if the machine changes its mind.", "Change one feature at a time. That way you know what made the difference."),
    W("Look at everything that lit up. What do they all have?", "Compare what lit up with what stayed dark. What do only the YES objects share?"), `The rule is about ${rule.about}.`], run, n => { rec.current.hints = n; });
  const [log, setLog] = useState<LogEntry[]>(() => start.map(o => ({ o, yes: lights(o), given: true })));
  const [cur, setCur] = useState<Obj>({ shape: "square", fill: "solid", size: "big" }), [state, setState] = useState<MachineState>("idle"), [inMachine, setInMachine] = useState<Obj | null>(null);
  const [phase, setPhase] = useState<"test" | "guess" | "prove" | "done">("test"), [fb, setFb] = useState(""), [guessOpts, setGuessOpts] = useState<Rule[]>([]);
  const [proof, setProof] = useState<{ list: Obj[]; i: number; right: number } | null>(null), [acted, setActed] = useState(false);
  const lastTried = useRef<Obj>(start[1]), later = useLater();
  const remember = (e: LogEntry) => setLog(l => (l.some(x => rmSame(x.o, e.o)) ? l : [...l, e]));
  const say = (t: string) => { setFb(t); run.say(t); };

  const test = () => {
    const t = { ...cur }, r = rec.current; r.tests = (r.tests as number) + 1; setActed(true);
    if (rmDiff(lastTried.current, t) === 1) r.fairTests = (r.fairTests as number) + 1; // a fair test: one change from the last thing tried
    lastTried.current = t;
    setInMachine(t); setState("think"); setFb("");
    later(run.reduceMotion ? 0 : 1200, () => { const yes = lights(t); setState(yes ? "yes" : "no"); remember({ o: t, yes }); say(`The ${rmName(t)} ${yes ? "made it light up!" : "kept it dark."}`); });
  };
  const guess = (g: Rule) => {
    const r = rec.current; r.guesses = (r.guesses as number) + 1; r.checks++;
    const right = g === rule; if (r.firstMatched === null) r.firstMatched = right; r.latestMatched = right;
    if (right) {
      const fresh = shuffle(RM_ALL.filter(x => !log.some(e => rmSame(e.o, x))));
      const yesOne = fresh.find(lights), noOne = fresh.find(x => !lights(x));
      setProof({ list: shuffle([yesOne, noOne, fresh.find(x => x !== yesOne && x !== noOne)].filter((x): x is Obj => !!x)), i: 0, right: 0 });
      setPhase("prove"); setFb(""); run.say("Yes, that's the rule! Now prove it. Will the machine light up for this one?");
    } else {
      // Evidence, not just "wrong": an object the machine has already judged differently from the guessed rule.
      const counter = log.find(e => g.f(e.o) !== e.yes) ?? RM_ALL.map(x => ({ o: x, yes: lights(x) })).find(e => g.f(e.o) !== e.yes)!;
      remember(counter); setPhase("test");
      say(`Not quite. Look at the ${rmName(counter.o)}: ${counter.yes ? "it lights up" : "it stays dark"}, but that rule says it ${g.f(counter.o) ? "would light up" : "would stay dark"}. Test some more.`);
    }
  };
  const predict = (said: boolean) => {
    const pr = proof!, p = pr.list[pr.i]!, yes = lights(p), right = pr.right + (said === yes ? 1 : 0);
    rec.current.predictions = (rec.current.predictions as number) + 1;
    setLog(l => [...l, { o: p, yes }]); setInMachine(p); setState(yes ? "yes" : "no");
    let msg = said === yes ? `Right! The ${rmName(p)} ${yes ? "lights it up" : "keeps it dark"}.` : `This time the machine said ${yes ? "yes" : "no"}. The ${rmName(p)} ${yes ? "lights it up" : "keeps it dark"}.`;
    if (pr.i + 1 >= pr.list.length) { setPhase("done"); rec.current.proved = right; msg += ` You predicted ${right} of ${pr.list.length} correctly. ${right === pr.list.length ? "You cracked the rule!" : "You found the rule. Proving it helps you be sure."}`; }
    setProof({ ...pr, i: pr.i + 1, right }); say(msg);
  };

  const logList = (yes: boolean) => { const l = log.filter(e => e.yes === yes); return l.length ? <ul className="rm-log">{l.map(e => <li key={rmName(e.o)}><Art svg={rmToken(e.o, 44, rmName(e.o) + (e.given ? " (example)" : ""))} /></li>)}</ul> : <p className="muted">Nothing yet.</p>; };
  const picker = <K extends keyof Obj>(key: K, list: [Obj[K], string][]) => <div className="rm-pick" role="group" aria-label={{ shape: "Shape", fill: "Pattern", size: "Size" }[key]}>{list.map(([v, l]) =>
    <button key={v} className="choice rm-opt" aria-pressed={cur[key] === v} onClick={() => { setCur({ ...cur, [key]: v }); setFb(""); }}><Art svg={rmToken({ ...cur, [key]: v, size: key === "size" ? v as Obj["size"] : "big" }, 30)} /><span className="lbl">{l}</span></button>)}</div>;
  const p = proof && phase === "prove" ? proof.list[proof.i] : null;
  return (
    <section className="card">
      <LabHead run={run} step={`Machine ${ri + 1} of ${count}`} />
      <h2>{W("Find the secret rule", "Discover the hidden rule")}</h2>
      <div className="rm-top"><div className="rm-mach"><Art svg={rmMachine(inMachine, state)} /><p className="sr" role="status">{inMachine ? `The ${rmName(inMachine)} ${state === "yes" ? "made the machine light up." : state === "no" ? "did not make the machine light up." : "is in the machine."}` : ""}</p></div>
        <div className="rm-logs"><div><p className="eyebrow"><Icon e="💡" /> Lights up</p>{logList(true)}</div><div><p className="eyebrow"><Icon e="⚫" /> Stays dark</p>{logList(false)}</div></div></div>
      <Think run={run} acted={acted} />
      {phase === "test" ? <>
        <div className="rm-build">
          <div className="rm-preview"><Art svg={rmToken(cur, 96, `You are making a ${rmName(cur)}`)} /><p className="rm-cap">{rmName(cur)}</p></div>
          <div className="rm-pickers"><p className="eyebrow">Shape</p>{picker("shape", RM_SHAPES)}<p className="eyebrow">Pattern</p>{picker("fill", RM_FILLS)}<p className="eyebrow">Size</p>{picker("size", RM_SIZES)}</div>
        </div>
        {hints.box}
        {fb ? <div className="feedback gentle" role="status">{fb}</div> : null}
        <LabRow main={{ id: "rmTest", label: <><Icon e="⚙️" /><span>Put it in the machine</span></>, onClick: test, disabled: state === "think" }} hints={hints}
          extra={<button className="btn" disabled={state === "think"} onClick={() => { setGuessOpts(shuffle([rule, ...shuffle(pool.filter(r => r !== rule)).slice(0, 3)])); setPhase("guess"); setFb(""); }}><Icon e="💡" /><span>I know the rule</span></button>}
          onSkip={() => { rec.current.movedOn = true; onNext(rec.current); }} />
      </> : phase === "guess" ? <>
        <h3>What is the secret rule? The machine lights up when...</h3>
        <div className="choices">{guessOpts.map(g => <button key={g.text} className="choice" onClick={() => guess(g)}><span className="lbl">{g.text}</span></button>)}</div>
        <div className="row"><button className="btn quiet" onClick={() => setPhase("test")}>Test some more first</button></div>
      </> : p ? <>
        <h3>Prove it! Will the machine light up for this one?</h3>
        <div className="rm-proof"><Art svg={rmToken(p, 96, rmName(p))} /></div>
        {fb ? <div className="feedback gentle" role="status">{fb}</div> : null}
        <div className="row"><button className="btn primary" onClick={() => predict(true)}><Icon e="💡" /><span>It lights up</span></button><button className="btn primary" onClick={() => predict(false)}><Icon e="⚫" /><span>It stays dark</span></button></div>
      </> : <>
        {fb ? <div className="feedback" role="status">{fb}</div> : null}
        <div className="row"><button className="btn primary" autoFocus onClick={() => onNext(rec.current)}>{ri + 1 < count ? "Next machine" : "Finish"}</button></div>
      </>}
    </section>
  );
}
