import { useRef, useState } from "react";
import { Art, Feedback, Icon, LabHead, newRec, Think, type GameItem, type GameProps, type LabRun } from "../../kit";
import { HS_CONF, HS_PUZZLES, HS_SETS, sureMeter, type Conf } from "./logic";

// Records each answer with its confidence: how well confidence matches being right is a view of self-awareness.
export function SureGame({ run, onFinish }: GameProps) {
  const list = HS_SETS[run.band];
  const [pi, setPi] = useState(0), [items, setItems] = useState<GameItem[]>([]), [meter, setMeter] = useState(false);
  const next = (rec: GameItem) => { setItems(xs => [...xs, rec]); if (pi + 1 < list.length) setPi(pi + 1); else setMeter(true); };
  if (meter) return <Meter run={run} items={items} onFinish={onFinish} />;
  return <Puzzle key={pi} run={run} id={list[pi]!} step={`Puzzle ${pi + 1} of ${list.length}`} last={pi + 1 === list.length} onNext={next} />;
}

function Puzzle({ run, id, step, last, onNext }: { run: LabRun; id: string; step: string; last: boolean; onNext: (rec: GameItem) => void }) {
  const P = HS_PUZZLES[id]!, rec = useRef(newRec(P.q, { mode: "answered then rated" }));
  const [picked, setPicked] = useState<number | null>(null), [conf, setConf] = useState<Conf | null>(null);
  const shown = conf !== null, right = picked === P.answer;
  const rate = (c: Conf) => {
    Object.assign(rec.current, { conf: c, checks: 1, firstMatched: right, latestMatched: right, illusion: !!P.illusion });
    setConf(c); run.say((right ? "Right! " : "Not this time. ") + P.why);
  };
  return (
    <section className="card">
      <LabHead run={run} step={step} />
      <h2>{P.q}</h2>
      {P.art ? <><div className={`hs-stage${shown ? " revealed" : ""}${run.reduceMotion ? " still" : ""}`}><Art svg={P.art()} /></div><p className="sr">{P.sr}</p></> : null}
      <div className="choices">{P.opts.map((t, i) => (
        <button key={t} className={`choice${shown && i === P.answer ? " hs-right" : ""}`} aria-pressed={picked === i} disabled={shown}
          onClick={() => { setPicked(i); run.say("How sure are you? Just guessing, fairly sure, or very sure?"); }}>
          {P.pics ? <span className="opt-pic"><Art svg={P.pics[i]!} /></span> : null}<span className="lbl">{t}{shown && i === P.answer ? " (the answer)" : ""}</span>
        </button>))}
      </div>
      {picked !== null && !shown ? <><h3>How sure are you?</h3><div className="choices hs-conf">{HS_CONF.map(([c, e, l]) => <button key={c} className="choice" onClick={() => rate(c)}><Icon e={e} /><span className="lbl">{l}</span></button>)}</div></> : null}
      {shown ? <>
        <Feedback done={right} text={`${right ? "Right!" : "Not this time."} You said: ${HS_CONF.find(c => c[0] === conf)![2].toLowerCase()}. ${P.why}`} />
        <div className="row"><button className="btn primary" autoFocus onClick={() => onNext(rec.current)}>{last ? "See my Sure-o-meter" : "Next puzzle"}</button></div>
      </> : <>
        <Think run={run} acted={picked !== null} />
        <div className="row"><button className="btn quiet" onClick={() => { rec.current.movedOn = true; onNext(rec.current); }}>Move on without an answer</button></div>
      </>}
    </section>
  );
}

function Meter({ run, items, onFinish }: { run: LabRun; items: GameItem[]; onFinish: GameProps["onFinish"] }) {
  const { rated, rows, tricked, msg } = sureMeter(items as { conf?: Conf; firstMatched?: boolean | null; illusion?: boolean }[]);
  return (
    <section className="card">
      <LabHead run={run} step="My Sure-o-meter" />
      <h2>My Sure-o-meter</h2>
      <div className="hs-meter">{rows.map(r => (
        <div key={r.id} className="hs-mrow"><span className="hs-mlbl"><Icon e={r.e} /> {r.l}</span>
          <span className="hs-dots" aria-hidden="true">{rated.filter(i => i.conf === r.id).map((i, k) => <span key={k} className={`hs-dot${i.firstMatched ? " ok" : ""}`}>{i.firstMatched ? "✓" : "✗"}</span>)}{r.n ? null : <span className="muted">none</span>}</span>
          <span className="hs-mnum">{r.n ? `right ${r.right} of ${r.n}` : ""}</span></div>))}
      </div>
      {msg.map(m => <p key={m}>{m}</p>)}
      <div className="row"><button className="btn primary" autoFocus onClick={() => onFinish({ items,
        extra: `Sure-o-meter: ${rows.map(x => `${x.l.toLowerCase()} ${x.right}/${x.n}`).join(", ")}. Very sure but tricked by an illusion: ${tricked}.`,
        reflect: { q: "What did you learn about your thinking?", options: ["My eyes can trick me", "When I'm sure, I'm usually right", "My guesses can be right too", "I'm not sure"] } })}>Carry on</button></div>
    </section>
  );
}
