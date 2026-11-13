import { useRef, useState } from "react";
import { Art, Icon, LabHead, LabRow, newRec, Think, useHints, usePlayFrames, type GameItem, type GameProps, type LabRun } from "../../kit";
import { IW_GROUND, IW_LEVELS, IW_PARTS, IW_POWER, IW_TERRAIN, iwIcon, iwTest, type PartId, type PowerId, type TestResult } from "./logic";

// Records how many tests, whether the learner revises after a failure, how many different designs they try, and how
// they judge their own invention. The design carries over from the first challenge to the second.
export function InventGame({ run, onFinish }: GameProps) {
  const { W } = run, lv = IW_LEVELS[run.band], items = useRef<GameItem[]>([]), designs = useRef(new Set<string>());
  const [ti, setTi] = useState(0), [naming, setNaming] = useState(false);
  const [parts, setParts] = useState<(PartId | null)[]>(() => lv.segs.map(() => null)), [power, setPower] = useState<PowerId>("none");
  const next = (rec: GameItem) => { items.current.push(rec); if (ti + 1 < lv.tasks.length) setTi(ti + 1); else setNaming(true); };
  if (naming) return <NameIt run={run} onDone={rec => {
    const its = [...items.current, rec];
    onFinish({ items: its, extra: `Invention: "${rec.choice}". Judged it: ${(rec.judged as string[]).join(", ") || "no qualities chosen"}. Tests: ${its.filter(i => i.tests != null).map(i => i.tests).join(", ")}. Revisions after a failed test: ${its.reduce((s, i) => s + ((i.revisions as number) || 0), 0)}. Different designs tried: ${designs.current.size}.`,
      reflect: { q: W("What did you do when the water stopped?", "What did you do when a design failed?"), options: ["I changed one part", "I changed lots of parts", "I used a hint", "It never stopped"] } });
  }} />;
  return <Challenge key={ti} run={run} ti={ti} parts={parts} setParts={setParts} power={power} setPower={setPower} onTested={d => designs.current.add(d)} onNext={next} />;
}

function Challenge({ run, ti, parts, setParts, power, setPower, onTested, onNext }: { run: LabRun; ti: number; parts: (PartId | null)[]; setParts: (p: (PartId | null)[]) => void; power: PowerId; setPower: (p: PowerId) => void; onTested: (design: string) => void; onNext: (rec: GameItem) => void }) {
  const { W } = run, lv = IW_LEVELS[run.band], task = lv.tasks[ti]!;
  const rec = useRef(newRec(task.title, { tests: 0, revisions: 0, mode: "designed" }));
  const hints = useHints([W("Look at each piece of ground. What could carry water over it?", "Check each section: flat, gap or slope. Which parts can handle it?"),
    lv.power ? "Slopes need something that lifts water, and lifting needs power." : "A gap needs something closed, so the water can't fall out.",
    `One way: ${lv.segs.map(sg => `${IW_TERRAIN[sg]}: ${IW_PARTS[sg === "uphill" ? "screw" : "pipe"].name.toLowerCase()}`).join("; ")}${lv.power ? "; power: hand crank" : ""}.`], run, n => { rec.current.hints = n; });
  const [sel, setSel] = useState(() => Math.max(0, parts.findIndex(p => !p))), [result, setResult] = useState<TestResult | null>(null), [wet, setWet] = useState(-1);
  const [busy, setBusy] = useState(false), [done, setDone] = useState(false), [fb, setFb] = useState(""), [acted, setActed] = useState(false);
  const failedLast = useRef(false), play = usePlayFrames(run);
  const revised = () => { if (failedLast.current) { rec.current.revisions = (rec.current.revisions as number) + 1; failedLast.current = false; } setResult(null); setWet(-1); setFb(""); };
  const cost = parts.reduce((s, id) => s + (id ? IW_PARTS[id].cost : 0), 0) + (parts.some(id => id && IW_PARTS[id].power) ? IW_POWER[power].cost : 0);

  const test = () => {
    const r = iwTest(lv.segs, parts, power, task.rules), x = rec.current;
    x.tests = (x.tests as number) + 1; x.checks++; setActed(true); onTested(`${parts.join("+")}|${power}`);
    if (x.firstMatched === null) x.firstMatched = !!r.ok; x.latestMatched = !!r.ok;
    setResult(r); setBusy(true); setFb("");
    const reach = r.ok || r.at < 0 ? lv.segs.length - 1 : r.at;
    play(reach + 1, 650, i => setWet(i), () => {
      setBusy(false); setWet(reach);
      let msg: string;
      if (r.ok) { setDone(true); msg = `Water reached the garden! It cost ${r.cost} coins${r.speed <= 1 ? ", but it's slow" : r.speed >= 3 ? ", and it flows fast" : ""}.${x.tests === 1 ? " It worked first time." : " You tested, found the problem and fixed it."}`; }
      else { failedLast.current = true; msg = r.at >= 0 ? `The water stopped at part ${r.at + 1}. ${r.why}` : r.why; }
      setFb(msg); run.say(msg);
    });
  };
  return (
    <section className="card">
      <LabHead run={run} step={`${ti + 1} of ${lv.tasks.length}`} />
      <h2>{task.title}</h2>
      {task.say ? <p className="lead">{task.say}</p> : <p className="muted">Choose a part for each piece of ground, then test it.</p>}
      <div className="iw-line"><span className="iw-end" aria-hidden="true">🏞️<small>River</small></span>{lv.segs.map((sg, i) => {
        const flows = result && (result.ok || result.at < 0 || i < result.at), stops = result && !result.ok && i === result.at; // at -1: works, but over budget
        const state = result && i <= wet ? (flows ? " wet" : "") + (stops ? " stop" : "") : "";
        const p = parts[i];
        return <button key={i} className={`iw-slot${sel === i ? " sel" : ""}${state}`} aria-pressed={sel === i} disabled={busy || done} onClick={() => setSel(i)}
          aria-label={`Part ${i + 1}, over ${IW_TERRAIN[sg]}: ${p ? IW_PARTS[p].name : "empty"}`}>
          <svg viewBox="0 0 80 60" aria-hidden="true"><path className="iw-ground" d={IW_GROUND[sg]} /><path className="iw-water" d={IW_GROUND[sg]} /></svg>
          <span className="iw-part">{p ? <Art svg={iwIcon(p, 34)} /> : <span className="iw-empty">?</span>}</span></button>;
      })}<span className="iw-end" aria-hidden="true">🌻<small>Garden</small></span></div>
      <p className="sr">From the river to the garden: {lv.segs.map((sg, i) => { const p = parts[i]; return `${IW_TERRAIN[sg]} with ${p ? `a ${IW_PARTS[p].name.toLowerCase()}` : "nothing yet"}`; }).join(", then ")}.</p>
      {busy || done ? null : <>
        <p className="eyebrow">Parts for {IW_TERRAIN[lv.segs[sel]!]} (part {sel + 1})</p>
        <div className="iw-tray">{lv.parts.map(id => <button key={id} className="choice iw-card" aria-pressed={parts[sel] === id} onClick={() => {
          const p = [...parts]; p[sel] = id; setParts(p); setActed(true); revised();
          const nxt = p.findIndex(x => !x); if (nxt >= 0) setSel(nxt);
        }}><Art svg={iwIcon(id, 36)} /><span className="lbl"><b>{IW_PARTS[id].name}</b> · {IW_PARTS[id].cost} coin{IW_PARTS[id].cost > 1 ? "s" : ""}<br /><small>{IW_PARTS[id].does}</small></span></button>)}</div>
        {lv.power ? <><p className="eyebrow">Power</p><div className="iw-tray">{(Object.entries(IW_POWER) as [PowerId, { name: string; cost: number }][]).map(([id, p]) =>
          <button key={id} className="choice iw-card" aria-pressed={power === id} onClick={() => { setPower(id); revised(); }}><Art svg={iwIcon(id, 30)} /><span className="lbl"><b>{p.name}</b>{p.cost ? ` · ${p.cost} coins` : ""}</span></button>)}</div></> : null}
      </>}
      <p className="iw-cost"><Icon e="🪙" /> Cost: <b>{cost}</b> coins{task.rules.budget ? ` (budget ${task.rules.budget})` : ""}</p>
      <Think run={run} acted={acted} />{hints.box}
      {fb ? <div className={`feedback${done ? "" : " gentle"}`} role="status">{fb}</div> : null}
      {done ? <div className="row"><button className="btn primary" autoFocus onClick={() => onNext(rec.current)}>{ti + 1 < lv.tasks.length ? "Next challenge" : "Name my invention"}</button></div>
        : <LabRow main={{ id: "iwTest", label: <><Icon e="💧" /><span>Test it</span></>, onClick: test, disabled: busy }} hints={hints} onSkip={() => { rec.current.movedOn = true; onNext(rec.current); }} />}
    </section>
  );
}

// Open-ended: the learner names the invention and judges what makes it good. There is no right answer.
const GOODS = ["It's cheap", "Water flows fast", "It needs no electricity", "It's easy to fix", "It uses the wind or sun", "I'd make it even better next time"];
const NAMES = ["The Water Wonder", "Garden Helper 3000", "The River Runner"];
function NameIt({ run, onDone }: { run: LabRun; onDone: (rec: GameItem) => void }) {
  const [name, setName] = useState<string | null>(null), [typed, setTyped] = useState(""), [chosen, setChosen] = useState<number[]>([]);
  return (
    <section className="card">
      <LabHead run={run} step="Your invention" />
      <h2>Name your invention</h2>
      <div className="choices">{NAMES.map(n => <button key={n} className="choice" aria-pressed={name === n} onClick={() => { setName(n); setTyped(""); }}><span className="lbl">{n}</span></button>)}</div>
      <label htmlFor="iwName" className="sw-type">Or type your own name<input id="iwName" maxLength={40} value={typed} onChange={e => { setTyped(e.target.value); if (e.target.value.trim()) setName(e.target.value.trim()); }} /></label>
      <h3>What is good about it? Choose any.</h3>
      <div className="choices">{GOODS.map((g, i) => <button key={g} className="choice" aria-pressed={chosen.includes(i)} onClick={() => setChosen(c => c.includes(i) ? c.filter(x => x !== i) : [...c, i])}><span className="lbl">{g}</span></button>)}</div>
      <div className="row"><button className="btn primary" onClick={() => onDone({ ...newRec("Name my invention", { open: true, mode: "named and judged" }), latestMatched: true, choice: name || "No name", judged: chosen.map(i => GOODS[i]!) })}>That's my invention</button></div>
    </section>
  );
}
