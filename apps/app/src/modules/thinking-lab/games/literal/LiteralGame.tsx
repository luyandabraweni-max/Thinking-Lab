import { useRef, useState } from "react";
import { Art, Icon, LabHead, LabRow, newRec, shuffle, Think, useHints, usePlayFrames, type GameItem, type GameProps, type LabRun } from "../../kit";
import { BOLT } from "../bolt";
import { LITERAL_TASKS, literalRun, type RunEvent } from "./logic";

// The learner puts instruction cards in order and Bolt does exactly what they say, even when it's silly.
// Records how many runs and edits it took, and whether the learner changes one step or starts again.
export function LiteralGame({ run, onFinish }: GameProps) {
  const { W } = run, tasks = LITERAL_TASKS[run.band], items = useRef<GameItem[]>([]);
  const [ti, setTi] = useState(0);
  const next = (rec: GameItem) => {
    items.current.push(rec);
    if (ti + 1 < tasks.length) return setTi(ti + 1);
    onFinish({ items: items.current, extra: `Runs per job: ${items.current.map(i => i.runs).join(", ")}. Started again: ${items.current.reduce((n, i) => n + (i.restarts as number), 0)} time(s).`,
      reflect: { q: W("When Bolt got it wrong, what did you do?", "When the program went wrong, what did you do?"), options: ["I found the wrong step and fixed it", "I started again", "I used a hint", "Bolt got it right first time"] } });
  };
  return <Job key={ti} run={run} ti={ti} count={tasks.length} onNext={next} />;
}

function Job({ run, ti, count, onNext }: { run: LabRun; ti: number; count: number; onNext: (rec: GameItem) => void }) {
  const { W } = run, task = LITERAL_TASKS[run.band][ti]!, cardOf = (id: string) => task.cards.find(c => c.id === id)!;
  const [tray] = useState(() => shuffle(task.cards.map(c => c.id))); // shuffled once per job
  const rec = useRef(newRec(task.title, { runs: 0, edits: 0, restarts: 0, mode: "built a program" }));
  const hints = useHints([W("What has to happen first, before anything else?", "Which step must come before all the others?"),
    `The first step is: "${cardOf(task.order[0]!).t}".`, `One order that works: ${task.order.map((id, i) => `${i + 1}. ${cardOf(id).t}`).join(". ")}.`], run, n => { rec.current.hints = n; });
  const [plan, setPlan] = useState<string[]>([]), [playing, setPlaying] = useState<{ events: RunEvent[]; at: number } | null>(null);
  const [done, setDone] = useState(false), [fb, setFb] = useState(""), [mood, setMood] = useState<"idle" | "oops" | "happy">("idle"), [acted, setActed] = useState(false);
  const play = usePlayFrames(run);
  const edit = (p: string[]) => { setPlan(p); rec.current.edits = (rec.current.edits as number) + 1; setActed(true); setFb(""); setMood("idle"); };

  const runIt = () => {
    const r = rec.current, result = literalRun(task, plan);
    r.runs = (r.runs as number) + 1; r.checks++; setActed(true);
    if (r.firstMatched === null) r.firstMatched = result.ok; r.latestMatched = result.ok;
    play(result.events.length, 1700, i => { setPlaying({ events: result.events, at: i }); setMood(result.events[i]!.ok ? "idle" : "oops"); run.say(result.events[i]!.text); }, () => {
      const wrong = result.events.findIndex(e => !e.ok);
      let msg: string;
      if (result.ok) { setDone(true); setMood("happy"); msg = r.runs === 1 ? W("Bolt did it! Your instructions were exact.", "It worked first time. Precise instructions.") : W("Bolt did it! You found the problem and fixed it.", "It works now. You debugged the program."); }
      else if (wrong >= 0) { setMood("oops"); msg = `Step ${wrong + 1} went wrong. Bolt did exactly what it said. Can you fix the instructions?`; }
      else { setMood("oops"); msg = W("Bolt finished, but the job isn't done yet. Is a step missing?", "The program ran, but the job isn't finished. Something is missing."); }
      setPlaying(null); setFb(msg); run.say(msg);
    });
  };

  const ev = playing?.events, cur = playing ? playing.at : -1;
  const said = playing && cur >= 0 ? ev![cur]!.text : fb;
  return (
    <section className="card">
      <LabHead run={run} step={`${ti + 1} of ${count}`} />
      <h2>{task.title}</h2>
      <div className="lr-stage"><div className="lr-robot"><Art svg={BOLT(mood)} /></div>
        <div className="lr-bubble" role="status">{said || W("Tell me what to do, one step at a time. I'll do EXACTLY what you say!", "Give me instructions. I follow them exactly, word for word.")}</div></div>
      <h3 className="lr-h">Bolt's instructions</h3>
      {plan.length ? <ol className="lr-plan">{plan.map((id, i) => {
        const c = cardOf(id), e = ev && i <= cur ? ev[i] : null, cls = e ? (e.ok ? (e.extra ? " extra" : " did") : " oops") : i === cur + 1 && playing ? " next" : "";
        return <li key={id} className={`lr-step${cls}`}><span className="lr-pic" aria-hidden="true">{c.pic}</span><span className="lr-t">{c.t}{e && !e.ok ? <span className="sr"> (went wrong)</span> : null}</span>
          {playing || done ? null : <span className="lr-tools">
            <button className="btn small" aria-label={`Move step ${i + 1} up`} disabled={i === 0} onClick={() => { const p = [...plan]; [p[i - 1], p[i]] = [p[i]!, p[i - 1]!]; edit(p); }}>↑</button>
            <button className="btn small" aria-label={`Take out step ${i + 1}: ${c.t}`} onClick={() => edit(plan.filter((_, k) => k !== i))}>✕</button></span>}</li>;
      })}</ol> : <p className="muted">No instructions yet. Tap a card below.</p>}
      {playing || done ? null : <><h3 className="lr-h">Instruction cards</h3><div className="lr-tray">{tray.map(id =>
        <button key={id} className="choice lr-card" disabled={plan.includes(id)} onClick={() => edit([...plan, id])}><span className="opt-pic" aria-hidden="true">{cardOf(id).pic}</span><span className="lbl">{cardOf(id).t}</span></button>)}</div></>}
      <Think run={run} acted={acted} />
      {hints.box}
      {done ? <div className="row"><button className="btn primary" autoFocus onClick={() => { rec.current.extras = plan.filter(id => cardOf(id).extra).length; onNext(rec.current); }}>{ti + 1 < count ? "Next job" : "Finish"}</button></div>
        : playing ? null : <LabRow main={{ id: "lrRun", label: <><Icon e="▶️" /><span>Run the instructions</span></>, onClick: runIt, disabled: !plan.length }} hints={hints}
            extra={plan.length ? <button className="btn" onClick={() => { setPlan([]); rec.current.restarts = (rec.current.restarts as number) + 1; setFb(""); setMood("idle"); }}>Start again</button> : null}
            onSkip={() => { rec.current.movedOn = true; onNext(rec.current); }} />}
    </section>
  );
}
