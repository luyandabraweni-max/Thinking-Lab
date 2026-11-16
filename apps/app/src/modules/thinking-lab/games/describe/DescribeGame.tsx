import { useRef, useState } from "react";
import { Art, Feedback, Icon, LabHead, LabRow, newRec, Think, useHints, type GameItem, type GameProps, type LabRun } from "../../kit";
import { BOLT } from "../bolt";
import { blip, diClues, diMake, diMinClues, diName, DI_NOT } from "./logic";

// Records how precise the learner's descriptions are (clues used compared with the fewest needed, and clues that
// didn't fit) and how they follow a description.
export function DescribeGame({ run, onFinish }: GameProps) {
  const { W } = run, older = run.band === "older", rounds = older ? ["tell", "tell", "listen", "listen"] as const : ["tell", "tell", "listen"] as const;
  const items = useRef<GameItem[]>([]), [ri, setRi] = useState(0);
  const next = (rec: GameItem) => {
    items.current.push(rec);
    if (ri + 1 < rounds.length) return setRi(ri + 1);
    const its = items.current;
    onFinish({ items: its, extra: `Clues used compared with fewest needed: ${its.filter(i => i.mode === "described").map(i => `${i.clues}/${i.fewest}`).join(", ")}. Clues that didn't fit: ${its.reduce((s, i) => s + ((i.wrongClues as number) || 0), 0)}.`,
      reflect: { q: W("Which was easier?", "Which did you find easier?"), options: ["Telling Bolt", "Listening to Bolt", "Both were fine", "I'm not sure"] } });
  };
  const kind = rounds[ri]!;
  return <Round key={ri} run={run} kind={kind} label={kind === "tell" ? `Describe a Blip ${ri + 1}` : `Find Bolt's Blip ${ri + 1 - rounds.indexOf("listen")}`} step={`${ri + 1} of ${rounds.length}`} last={ri + 1 === rounds.length} onNext={next} />;
}

function Round({ run, kind, label, step, last, onNext }: { run: LabRun; kind: "tell" | "listen"; label: string; step: string; last: boolean; onNext: (rec: GameItem) => void }) {
  const { W } = run, older = run.band === "older";
  const [{ set, target, need, said }] = useState(() => { // a new set of Blips once per round
    const m = diMake(older ? 6 : 4, older, older ? 2 : kind === "tell" ? 2 : 1)!, nd = diMinClues(m.target, m.set);
    // Bolt's clues when the learner listens: the fewest that work, and for older learners one put as a "not".
    return { ...m, need: nd, said: kind === "listen" ? nd.map((c, i) => (older && i === nd.length - 1 && DI_NOT[`${c.k}:${c.v}`]) || c.t) : [] };
  });
  const clues = diClues().filter(c => older || c.k !== "eyes" || c.v !== 3).filter(c => older || c.k !== "skin" || c.v !== "stripes");
  const rec = useRef(newRec(label, { mode: kind === "tell" ? "described" : "listened", tells: 0, wrongClues: 0, clues: 0, fewest: need.length }));
  const hints = useHints(kind === "tell"
    ? ["What makes your Blip different from the others?", "Look at the Blips most like yours. What is different about yours?", `Try telling Bolt: "It ${need[0]!.t}."`]
    : ["Check one clue at a time.", "Rule out every Blip that doesn't match the first clue. Then check the next clue."], run, n => { rec.current.hints = n; });
  const [chosen, setChosen] = useState<number[]>([]), [fb, setFb] = useState(""), [done, setDone] = useState(false), [picked, setPicked] = useState<number | null>(null), [acted, setActed] = useState(false);

  const tell = () => {
    const r = rec.current, cs = chosen.map(i => clues[i]!), matches = set.filter(c => cs.every(x => x.f(c))), wrong = cs.filter(x => !x.f(target));
    r.tells = (r.tells as number) + 1; r.checks++; r.clues = cs.length; r.wrongClues = (r.wrongClues as number) + wrong.length;
    const ok = matches.length === 1 && matches[0] === target;
    if (r.firstMatched === null) r.firstMatched = ok; r.latestMatched = ok;
    const msg = ok ? `Found it! ${cs.length <= need.length ? W("Your clues were just right.", "Exactly enough clues: precise.") : `You used ${cs.length} clues. ${need.length} would have been enough: "${need.map(c => c.t).join('" and "')}".`}`
      : wrong.length ? `Hmm. Look at your Blip again. Is it true that it ${wrong[0]!.t}? Check that clue.`
      : !matches.length ? "I can't find any Blip that matches all of those!" : `I can see ${matches.length} Blips that match. Which one? Tell me something more.`;
    setDone(ok); setFb(msg); run.say(msg);
  };
  const choose = (i: number) => {
    const r = rec.current, ok = set[i] === target; r.checks++; setActed(true); setPicked(i);
    if (r.firstMatched === null) r.firstMatched = ok; r.latestMatched = ok;
    const miss = need.find(c => !c.f(set[i]!));
    const msg = ok ? "That's the one! You followed every clue." : miss ? `Not that one: Bolt's Blip ${miss.t}, and that one doesn't. Try again.` : "Not that one. Check each clue again.";
    setDone(ok); setFb(msg); run.say(msg);
  };

  return (
    <section className="card">
      <LabHead run={run} step={step} />
      <h2>{kind === "tell" ? W("Help Bolt find your Blip", "Describe your Blip so Bolt can find it") : W("Find the Blip Bolt is thinking of", "Follow Bolt's description")}</h2>
      <div className="lr-stage"><div className="lr-robot"><Art svg={BOLT(done ? "happy" : "idle")} /></div>
        <div className="lr-bubble" role="status">{kind === "listen" ? `It ${said.join(", and it ")}.` : fb || "I can't see your Blip! Tell me about it."}</div></div>
      <div className="di-grid">{set.map((c, i) => kind === "listen"
        ? <button key={i} className={`di-blip${picked === i ? (c === target ? " right" : " wrong") : ""}`} aria-label={diName(c)} disabled={done} onClick={() => choose(i)}><Art svg={blip(c, 72)} /></button>
        : <div key={i} className={`di-blip${c === target ? " mine" : ""}`} role="img" aria-label={`${c === target ? "Your Blip: " : ""}${diName(c)}`}><Art svg={blip(c, 72)} />{c === target ? <span className="di-tag">Yours</span> : null}</div>)}
      </div>
      {kind === "tell" && !done ? <><h3>Your clues for Bolt</h3><div className="choices di-clues">{clues.map((c, i) =>
        <button key={c.t} className="choice" aria-pressed={chosen.includes(i)} onClick={() => { setChosen(ch => ch.includes(i) ? ch.filter(x => x !== i) : [...ch, i]); setActed(true); }}><span className="lbl">It {c.t}</span></button>)}</div></> : null}
      <Think run={run} acted={acted} />
      {hints.box}
      {kind === "listen" ? <Feedback text={fb} done={done} /> : null}
      {done ? <div className="row"><button className="btn primary" autoFocus onClick={() => onNext(rec.current)}>{last ? "Finish" : "Next one"}</button></div>
        : <LabRow main={kind === "tell" ? { id: "diTell", label: <><Icon e="💬" /><span>Tell Bolt</span></>, onClick: tell, disabled: !chosen.length } : undefined} hints={hints}
            onSkip={() => { rec.current.movedOn = true; onNext(rec.current); }} />}
    </section>
  );
}
