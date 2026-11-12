import { ADAPT, adaptLive, toRow, type AdaptSettings, type Row } from "@tl/adaptation";
import { BreakScreen } from "../wellbeing";
import { areaOf, levelName, type Question, type Unit, type WordHelp } from "@tl/content";
import { matchSpoken, spokenNumber } from "@tl/voice";
import { useVoice } from "@tl/voice/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { SafetyNote } from "../safety";
import { DrawPad, matchedFeedback, newRec, toAttempts, type GameItem } from "../thinking-lab";
import { check, passageParts, pickQuestions, shuffle, twoChoices, type Answer } from "./logic";

// A lesson, ported from js/learn/lesson.js: Learn, Example, Practice, Reflect. Nothing is timed. The adaptation rules
// (docs/adaptation-rules.md) shape how questions start, and the learner can undo each change on the spot.
export interface LessonProps {
  unit: Unit; words?: WordHelp; older: boolean; history: Row[]; country: "ZA" | "EU" | null;
  onSave: (attempts: ReturnType<typeof toAttempts>) => Promise<void>; onUnsafe: (where: string) => void; onBack: () => void;
  /** Reads aloud (and captions) when the learner wants it. */
  say?: (text: string) => void;
  /** What the adults around the learner set: automatic changes on or off, and rules switched off. */
  adapt?: AdaptSettings;
  /** The learner can answer by speaking (set in My way, after a grown-up agreed). */
  voiceAnswers?: boolean;
  /** The learner chose a short lesson (for example when their energy is low). */
  short?: boolean;
}
const noSay = () => {};
const STEPS = ["Learn", "Example", "Practice", "Reflect"];
const Html = ({ html }: { html: string }) => <div dangerouslySetInnerHTML={{ __html: html }} />; // reviewed lesson content from this repo only
const Ic = ({ e }: { e: string }) => <span className="em" aria-hidden="true">{e}</span>;

function StepStrip({ active }: { active: number }) {
  return <ol className="stepstrip" aria-label="Lesson steps">{STEPS.map((n, i) =>
    <li key={n} className={i < active ? "done" : i === active ? "now" : ""} aria-current={i === active ? "step" : undefined}><span className="sr">{i < active ? "Done: " : i === active ? "Now: " : "Next: "}</span>{n}</li>)}</ol>;
}
function WordHelpBox({ words }: { words?: WordHelp }) {
  if (!words) return null;
  return (
    <details className="keywords"><summary>What does this mean?</summary>
      {words.words ? <ul className="kw">{words.words.map(w => <li key={w[1]}><span className="kw-pic" aria-hidden="true">{w[0]}</span><span><b>{w[1]}</b>: {w[2]}</span></li>)}</ul> : null}
      {words.phrases ? <><p className="eyebrow">In plain words</p><ul className="plain">{words.phrases.map(p => <li key={p[0]}><b>"{p[0]}"</b> means {p[1]}.</li>)}</ul></> : null}
    </details>
  );
}
function Passage({ html, start = 2 }: { html: string; start?: number }) {
  const parts = passageParts(html), [shown, setShown] = useState(start), n = Math.min(shown, parts.length);
  return <>
    <div className="passage-text parts">{parts.slice(0, n).map((p, i) => <div className="part" key={i}><Html html={p.html} /></div>)}</div>
    {n < parts.length ? <div className="row"><button className="btn" onClick={() => setShown(shown + 2)}>Show the next part ({n} of {parts.length})</button></div> : null}
  </>;
}

type Step = { at: "intro" } | { at: "learn"; i: number } | { at: "example"; shown: number } | { at: "question"; qi: number } | { at: "reflect" } | { at: "draw" } | { at: "done"; reflection: string };

export function Lesson(props: LessonProps) {
  const { unit: u, words, history, onBack } = props;
  const [skipShort, setSkipShort] = useState(false);
  const short = !skipShort && (!!props.short || !!adaptLive(history, props.adapt ?? { auto: true }).shorter);
  const [qs, setQs] = useState<Question[]>(() => pickQuestions(u.questions, short));
  const [step, setStep] = useState<Step>({ at: "intro" }), [recs, setRecs] = useState<GameItem[]>([]);
  const [skips] = useState(() => new Set<string>()); // changes the learner undid this lesson ("fewer")
  const finish = (reflection: string) => { setStep({ at: "done", reflection }); void props.onSave(toAttempts(u.id, recs, reflection)); };
  // Read each screen aloud as it appears (questions read themselves, below).
  const say = props.say;
  useEffect(() => {
    if (!say) return;
    if (step.at === "intro") say(`${u.title}. ${u.intention} Press Begin when you are ready.`);
    else if (step.at === "learn") { const pg = u.lesson[step.i]!; say(`${pg.h}. ${pg.say}`); }
    else if (step.at === "example") say(step.shown === 1 ? `Worked example. ${u.example.q} ${u.example.steps[0]}` : u.example.steps[step.shown - 1]!);
    else if (step.at === "reflect") say(`${u.reflect.q} ${u.reflect.options.join(". ")}.`);
    else if (step.at === "done") say(u.done);
  }, [step, say, u]);

  if (step.at === "intro") return (
    <section className="card">
      <p className="eyebrow">{u.subject} · {levelName(u.grade)}</p>
      <h1>{u.title}</h1>
      <p className="lead">{u.intention}</p>
      <div className="preview"><p className="eyebrow">What will happen</p>
        <ol className="story">
          <li><Ic e="📖" /><span>First, you will read {u.lesson.length} short pages.</span></li>
          <li><Ic e="👀" /><span>Then you will see a worked example, one step at a time.</span></li>
          <li><Ic e="✏️" /><span>Then you will try {qs.length} questions. You can use hints, or move on.</span></li>
          <li><Ic e="💬" /><span>Then you will say how it went.</span></li>
          <li><Ic e="🏁" /><span>Then you can choose what to do next.</span></li>
        </ol>
        <p className="muted">Nothing is timed. You can take a break or stop at any time.</p></div>
      {qs.length < u.questions.length ? <p className="heads-up"><Ic e="🪶" /> This lesson is shorter today: {qs.length} questions. <button className="btn small" onClick={() => { setSkipShort(true); setQs(u.questions); }}>Do all {u.questions.length} questions</button></p> : null}
      <p className="note">Curriculum: {u.caps}</p>
      <div className="row"><button className="btn primary" autoFocus onClick={() => setStep({ at: "learn", i: 0 })}>Begin</button><button className="btn quiet" onClick={onBack}>Back to Learn</button></div>
    </section>);

  if (step.at === "learn") {
    const pg = u.lesson[step.i]!, isPassage = !!u.passage && pg.html === u.passage, i = step.i;
    return (
      <section className="card">
        <p className="eyebrow">{u.title} · Learn {i + 1} of {u.lesson.length}</p>
        <StepStrip active={0} />
        <h2>{pg.h}</h2>
        {isPassage ? <Passage key={i} html={pg.html} /> : <Html html={pg.html} />}
        <WordHelpBox words={words} />
        <div className="row">
          <button className="btn primary" autoFocus onClick={() => setStep(i + 1 < u.lesson.length ? { at: "learn", i: i + 1 } : { at: "example", shown: 1 })}>{i + 1 < u.lesson.length ? "Next" : "See a worked example"}</button>
          {i > 0 ? <button className="btn" onClick={() => setStep({ at: "learn", i: i - 1 })}>Back a page</button> : null}
        </div>
      </section>);
  }
  if (step.at === "example") {
    const ex = u.example, more = step.shown < ex.steps.length;
    return (
      <section className="card">
        <p className="eyebrow">{u.title} · Worked example</p>
        <StepStrip active={1} />
        <h2>{ex.q}</h2>
        <ol className="steps">{ex.steps.slice(0, step.shown).map(s => <li key={s}>{s}</li>)}</ol>
        <WordHelpBox words={words} />
        <div className="row">
          {more ? <button className="btn primary" autoFocus onClick={() => setStep({ at: "example", shown: step.shown + 1 })}>Show the next step</button>
            : <button className="btn primary" autoFocus onClick={() => setStep({ at: "question", qi: 0 })}>Now I'll try</button>}
          {more ? <button className="btn quiet" onClick={() => setStep({ at: "question", qi: 0 })}>Skip to the questions</button> : null}
        </div>
      </section>);
  }
  if (step.at === "question") return <QuestionView key={step.qi} {...props} q={qs[step.qi]!} qi={step.qi} count={qs.length} recs={recs} skips={skips}
    onDone={rec => { setRecs(r => [...r, rec]); setStep(step.qi + 1 < qs.length ? { at: "question", qi: step.qi + 1 } : { at: "reflect" }); }} />;
  if (step.at === "reflect") return (
    <section className="card">
      <p className="eyebrow">{u.title}</p>
      <StepStrip active={3} />
      <h2>{u.reflect.q}</h2>
      <div className="choices">{u.reflect.options.map((o, i) => <button key={o} className="choice" autoFocus={i === 0} onClick={() => finish(o)}><span className="lbl">{o}</span></button>)}</div>
      <div className="row"><button className="btn" onClick={() => setStep({ at: "draw" })}><Ic e="🎨" /><span>Draw how it went instead</span></button></div>
    </section>);
  if (step.at === "draw") return <DrawPad title="Draw how it went" note="Draw anything you like. There is no right answer." onDone={n => finish(n ? "Drew a picture" : "Chose to draw, left it blank")} />;
  const [fbText, achieve] = matchedFeedback(recs);
  return (
    <section className="card">
      <p className="eyebrow">{u.subject} · {levelName(u.grade)}</p>
      <h1 className="as-h2">{u.title}: done</h1>
      <ol className="stepstrip" aria-label="Lesson steps">{STEPS.map(n => <li key={n} className="done"><span className="sr">Done: </span>{n}</li>)}</ol>
      <p className="eyebrow">{achieve}</p>
      <div className="feedback" role="status">{fbText}</div>
      <p>{u.done}</p>
      <SafetyNote unitId={u.id} country={props.country} onUnsafe={() => props.onUnsafe("lesson")} />
      <div className="row"><button className="btn primary" autoFocus onClick={onBack}>Choose another lesson</button></div>
    </section>);
}

function QuestionView({ unit: u, words, history, say, adapt, voiceAnswers, q, qi, count, recs, skips, onDone }: LessonProps & { q: Question; qi: number; count: number; recs: GameItem[]; skips: Set<string>; onDone: (rec: GameItem) => void }) {
  const area = areaOf(u.subject), fewerKey = `fewer:${area}`;
  const today = new Date().toISOString().slice(0, 10);
  const rows = (): Row[] => [...history, ...recs.map(r => toRow(r, u.id, "", today))];
  // Adaptation: what the learner did earlier shapes how this question starts.
  const [ad] = useState(() => adaptLive(rows(), adapt ?? { auto: true }));
  const choosingType = q.type === "mcq" || q.type === "num";
  const allOpts = () => (q.type === "mcq" || q.type === "num") && q.options ? (q.type === "mcq" && q.fixed ? q.options.map((_, i) => i) : shuffle(q.options.map((_, i) => i))) : [];
  const rec = useRef(newRec(`Question ${qi + 1}`, { mode: q.type === "num" ? "chose" : q.type === "order" ? "ordered" : q.type === "sort" ? "sorted" : "chose" }));
  // Started with fewer choices by the adaptation rules (autoEasier), or made easier by the learner (easier).
  const [easy, setEasy] = useState(() => { const auto = choosingType && !!ad.fewer[area] && !skips.has(fewerKey) && allOpts().length > 2; return { easier: auto, auto }; });
  const [opts, setOpts] = useState<number[]>(() => (easy.auto ? twoChoices(q as Parameters<typeof twoChoices>[0], allOpts()) : allOpts()));
  const finish = () => { Object.assign(rec.current, { easier: easy.easier, autoEasier: easy.auto }); onDone(rec.current); };
  const typing = q.type === "num" && !q.options; // live app: number questions are chosen unless the learner prefers building answers
  const [ans, setAns] = useState<Answer>({ picked: null, typed: "", order: [], sortPlace: q.type === "sort" ? q.items.map(() => null) : [] });
  const [shuffled] = useState(() => (q.type === "order" ? shuffle(q.items.map((_, i) => i)) : []));
  const [sortPick, setSortPick] = useState<number | null>(null), [hint, setHint] = useState(0), [fb, setFb] = useState(""), [done, setDone] = useState(false);
  const [offer, setOffer] = useState<string | null>(ad.breaks && qi > 0 && qi % ADAPT.breakEvery === 0 ? `You have done ${qi} questions. Would a break help?` : null);
  const [onBreak, setOnBreak] = useState(false);
  const wrongs = useRef(0), offered = useRef(false), shownAt = useRef(0), slowTold = useRef(false);
  useEffect(() => { shownAt.current = Date.now(); }, []);
  // No answer for a while: a gentle offer of help (sooner when help is often used).
  useEffect(() => {
    if (done || offered.current) return;
    const t = setTimeout(() => { offered.current = true; setOffer("Take your time. Would anything help?"); }, ad.sooner ? 45000 : 90000);
    return () => clearTimeout(t);
  }, [done, ad.sooner]);

  // Answering by speaking: what was heard fills in the answer, and the learner still presses Check (nothing is recorded).
  const voice = useVoice(), [listening, setListening] = useState(false);
  const choices = q.type === "mcq" || q.type === "num" ? q.options : undefined;
  const canSpeak = !!voiceAnswers && !!voice.engine && voice.consent && ((!!choices && !typing) || typing);
  const sayAnswer = async () => {
    if (!voice.engine || listening) return;
    if (!(await voice.engine.permit())) return setFb("The microphone isn't allowed on this device. You can tap your answer instead.");
    setListening(true); setFb("Listening… say your answer.");
    try {
      const h = await voice.engine.listen({ lang: voice.lang, maxMs: 8000 }), heard = [h.text, ...h.alternatives].filter(Boolean);
      if (!heard.length) return setFb("I didn't hear anything. Try again, or tap your answer.");
      if (typing) {
        const n = heard.map(spokenNumber).find(x => x !== null);
        if (n) { setAns(a => ({ ...a, typed: n })); setFb(`I heard ${n}. Press Check my answer.`); } else setFb(`I heard "${heard[0]}". Say a number, or type it.`);
      } else {
        const i = choices ? matchSpoken(heard, choices, opts) : null;
        if (i !== null) { setAns(a => ({ ...a, picked: i })); setFb(`I heard "${choices![i]}". Press Check my answer, or choose another.`); }
        else setFb(`I heard "${heard[0]}". Try again, or tap your answer.`);
      }
    } catch { setFb("Listening didn't work this time. Tap your answer instead."); }
    finally { setListening(false); }
  };
  const takeHint = () => { const h = Math.min(q.hints.length, hint + 1); setHint(h); rec.current.hints = h; setFb(""); say?.(q.hints[h - 1]!); };
  useEffect(() => { say?.(q.q); }, [say, q]);
  useEffect(() => { if (fb) say?.(fb); }, [fb, say]);
  useEffect(() => { if (offer) say?.(offer); }, [offer, say]);
  const makeEasier = () => {
    setEasy(e => ({ ...e, easier: true }));
    if (choosingType && opts.length > 2) { setOpts(twoChoices(q as Parameters<typeof twoChoices>[0], opts)); setAns(a => ({ ...a, picked: null })); rec.current.mode = "chose (easier)"; }
    else if (q.type === "order") setAns(a => ({ ...a, order: [0] }));
    else if (q.type === "sort") setAns(a => { const sp = [...a.sortPlace]; let n = 0; q.items.forEach((_, i) => { if (n < 2 && sp[i] === null) { sp[i] = q.answer[i]!; n++; } }); return { ...a, sortPlace: sp }; });
  };
  const choose = (c: "break" | "easier" | "hint" | "keep") => { rec.current.adapt = c === "break" ? "break" : undefined; setOffer(null); if (c === "break") setOnBreak(true); if (c === "hint") takeHint(); if (c === "easier") makeEasier(); };
  const checkIt = () => {
    const r = rec.current;
    if (q.type === "mcq" && q.open) { if (ans.picked === null) return setFb("Choose an answer first."); Object.assign(r, { open: true, checks: r.checks + 1 }); setFb(q.explain); return setDone(true); }
    const res = check(q, ans, typing);
    if ("missing" in res) return setFb(res.missing);
    const ok = res.ok; r.checks++; if (r.firstMatched === null) r.firstMatched = ok; r.latestMatched = ok;
    const quick = !ok && Date.now() - shownAt.current < ADAPT.quickMs; shownAt.current = Date.now();
    if (quick) r.quick = (r.quick ?? 0) + 1; // a wrong answer within seconds of seeing the question
    const quickToday = rows().reduce((n, x) => n + (x[0] === today ? x[6]?.q ?? 0 : 0), 0) + (r.quick ?? 0);
    if (ok) { setFb(`Yes. ${q.explain}`); setDone(true); }
    else if (quick && !slowTold.current && quickToday >= ADAPT.quickMin) { wrongs.current++; slowTold.current = true; setFb("Take your time. Read the question again, then choose."); }
    else {
      wrongs.current++;
      if (wrongs.current >= (ad.sooner ? 1 : 2) && !offered.current) { offered.current = true; setFb(""); setOffer("This one is tricky. What would help?"); }
      else setFb(hint >= 3 ? "Not quite yet. That's fine. You can try again, or move on without an answer." : "Not quite yet. Have another look, or use a hint.");
    }
  };

  if (onBreak) return <BreakScreen text="Take a break" say={say ?? noSay} onReady={() => setOnBreak(false)} />;
  let body: ReactNode = null;
  if (choosingType && (q.type === "mcq" || q.options) && !typing) body = <div className={`choices${u.grade <= 0 ? " big" : ""}`}>{opts.map(i =>
    <button key={i} className="choice" aria-pressed={ans.picked === i} onClick={() => { setAns(a => ({ ...a, picked: i })); setFb(""); }}>
      {q.type === "mcq" && q.pics ? <span className="opt-pic" aria-hidden="true">{q.pics[i]}</span> : null}<span className="lbl">{q.options![i]}</span></button>)}</div>;
  else if (q.type === "num") body = <label htmlFor="qNum" style={{ display: "flex", flexDirection: "column", gap: 6, maxWidth: 260 }}>Your answer{q.unitLabel ? ` (${q.unitLabel})` : ""}
    <input id="qNum" inputMode="decimal" autoComplete="off" value={ans.typed} onChange={e => setAns(a => ({ ...a, typed: e.target.value }))} style={{ font: "inherit", padding: "12px 14px", borderRadius: 12, border: "2px solid var(--line)", background: "var(--surface)", color: "var(--ink)", minHeight: 48 }} /></label>;
  else if (q.type === "order") body = <>
    <p className="muted">Tap them in order, {q.orderLabel ?? "first to last"}.</p>
    <div className="choices">{shuffled.map(i => <button key={i} className="choice" aria-pressed={ans.order.includes(i)} disabled={ans.order.includes(i)} onClick={() => { setAns(a => ({ ...a, order: [...a.order, i] })); setFb(""); }}><span className="lbl">{q.items[i]}</span></button>)}</div>
    <div className="plan" aria-label="Your order">{ans.order.length ? ans.order.map((i, k) => <span key={k} className="chip" style={{ fontSize: "1rem", padding: "0 10px" }}>{k + 1}. {q.items[i]}</span>) : <span className="muted">Your order will show here.</span>}</div>
    {ans.order.length ? <button className="btn small" onClick={() => setAns(a => ({ ...a, order: a.order.slice(0, -1) }))}>Take the last one back</button> : null}
  </>;
  else if (q.type === "sort") body = <>
    <p className="muted">Tap a word, then tap the box it belongs in.</p>
    <div className="tray">{q.items.some((_, i) => ans.sortPlace[i] === null) ? q.items.map((t, i) => ans.sortPlace[i] === null ? <button key={i} className="choice" aria-pressed={sortPick === i} onClick={() => setSortPick(i)}><span className="lbl">{t}</span></button> : null) : <span className="muted">All sorted.</span>}</div>
    <div className="bins">{q.bins.map((b, bi) => <div key={b} className="bin"><button className="btn bin-head" disabled={sortPick === null} onClick={() => { if (sortPick === null) return; setAns(a => { const sp = [...a.sortPlace]; sp[sortPick] = bi; return { ...a, sortPlace: sp }; }); setSortPick(null); setFb(""); }}>{b}</button>
      <div className="bin-items">{q.items.map((t, i) => ans.sortPlace[i] === bi ? <button key={i} className="chip" style={{ fontSize: "0.95rem", padding: "0 10px" }} aria-label={`${t}, in ${b}. Tap to take it out`} onClick={() => setAns(a => { const sp = [...a.sortPlace]; sp[i] = null; return { ...a, sortPlace: sp }; })}>{t}</button> : null)}</div></div>)}</div>
  </>;
  const left = count - qi;
  return (
    <section className="card">
      <p className="eyebrow">{u.title} · Question {qi + 1} of {count}</p>
      <StepStrip active={2} />
      {left === 2 ? <p className="heads-up" role="status"><Ic e="⏭️" /> 2 more questions, then this lesson is finished.</p> : left === 1 && count > 1 ? <p className="heads-up" role="status"><Ic e="🏁" /> This is the last question.</p> : null}
      {u.passage ? <details className="passage"><summary>Show the text again</summary><Passage html={u.passage} start={99} /></details> : null}
      <h2>{q.q}</h2>
      {q.html ? <Html html={q.html} /> : null}
      {easy.auto && !done ? <p className="note"><Ic e="🪶" /> Two choices to start. <button className="btn small quiet" onClick={() => { skips.add(fewerKey); setOpts(allOpts()); setEasy({ easier: false, auto: false }); setAns(a => ({ ...a, picked: null })); }}>Show all the choices</button></p> : null}
      {body}
      <WordHelpBox words={words} />
      {offer ? <div className="checkin" role="group" aria-labelledby="ciTitle"><p id="ciTitle"><b>{offer}</b></p><div className="row">
        <button className="btn small" onClick={() => choose("break")}><Ic e="🌿" /><span>Take a break</span></button>
        <button className="btn small" onClick={() => choose("easier")}><Ic e="🪶" /><span>Make it easier</span></button>
        <button className="btn small" disabled={hint >= q.hints.length} onClick={() => choose("hint")}><Ic e="💡" /><span>Show me a hint</span></button>
        <button className="btn small" onClick={() => choose("keep")}><Ic e="➡️" /><span>Keep going</span></button></div></div> : null}
      {hint ? <div className="hint"><b>Hint {hint} of {q.hints.length}.</b> {q.hints[hint - 1]}</div> : null}
      {fb ? <div className={`feedback${done ? "" : " gentle"}`} role="status">{fb}</div> : null}
      <div className="row">
        {done ? <button className="btn primary" autoFocus onClick={finish}>{qi + 1 < count ? "Next question" : "Finish"}</button> : <>
          {canSpeak ? <button className="btn" disabled={listening} onClick={() => void sayAnswer()}><Ic e="🎤" /><span>{listening ? "Listening…" : "Say my answer"}</span></button> : null}
          <button className="btn primary" onClick={checkIt}>Check my answer</button>
          <button className="btn" disabled={hint >= q.hints.length} onClick={takeHint}>{hint ? "Another hint" : "Use a hint"}</button>
          <button className="btn quiet" onClick={() => { rec.current.movedOn = true; finish(); }}>Move on without an answer</button>
        </>}
      </div>
    </section>
  );
}
