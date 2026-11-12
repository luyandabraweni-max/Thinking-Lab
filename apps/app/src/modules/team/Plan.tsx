import { canEditPlan, type Account, type Goal, type Learner, type Observation } from "@tl/data";
import { Button, Card, Field } from "@tl/ui";
import { VoiceField } from "@tl/voice/react";
import { useState } from "react";
import { useServices } from "../../platform";
import { useLoad } from "./use-load";

// The learner's support plan (Individual Support Plan): goals the team sets, what they observe, and their notes.
// Ported from the live portal (js/portal/team.js and specialist.js). This describes activities, not ability.
const LEVEL_TEXT: Record<Observation["level"], string> = { notyet: "Not yet", support: "With support", alone: "On their own" };
const LEVEL_MARK: Record<Observation["level"], string> = { notyet: "○", support: "◐", alone: "●" };
const STATUS: Record<Goal["status"], string> = { todo: "Not started", doing: "Working on it", done: "Achieved" };
const AREAS = ["Communication and Expression", "Logical and Analytical Thinking", "Inquiry and Systems Thinking", "Creativity and Metacognition", "Communication", "Personal care and daily living", "Social and emotional", "Mathematics", "Language and literacy", "Life skills", "Occupational skills"];
const day = (iso: string) => new Date(iso).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" });

export function Goals({ me, learner }: { me: Account; learner: Learner }) {
  const { store, syncNow } = useServices(), s = store.as(me), team = canEditPlan(me, learner);
  const [data, reload] = useLoad(async () => ({ goals: await s.goals(learner.id), obs: await s.observations(learner.id), notes: team ? [] : await s.notes(learner.id) }), [store, me, learner.id]);
  const [text, setText] = useState(""), [area, setArea] = useState(AREAS[0]!), [target, setTarget] = useState(""), [error, setError] = useState(""), [said, setSaid] = useState("");
  const done = (msg: string) => { setSaid(msg); reload(); void syncNow().catch(() => {}); };
  return (
    <div className="tl-stack">
      <p role="status" className="tl-muted">{said}</p>
      {data?.goals.length ? <ul className="goal-list">{data.goals.map(g => (
        <li key={g.id} className="goal-item"><div>
          <b>{g.text}</b>
          <div className="note">{g.area}{g.target ? ` · target ${day(g.target)}` : ""} · <span className={`status st-${g.status === "done" ? "alone" : g.status === "doing" ? "support" : "notyet"}`}>{STATUS[g.status]}</span></div>
          <Marks obs={data.obs.filter(o => o.goalId === g.id)} />
          {team ? <AddObservation goal={g} onSave={async (level, note) => { await s.observe(learner.id, g.id, level, note); done("Observation saved."); }} /> : null}
        </div>
        {team ? <><label className="tl-visually-hidden" htmlFor={`gs-${g.id}`}>Status of: {g.text}</label>
          <select id={`gs-${g.id}`} value={g.status} onChange={e => void s.setGoalStatus(learner.id, g.id, e.target.value as Goal["status"]).then(() => done("Status changed."))}>
            {(Object.keys(STATUS) as Goal["status"][]).map(k => <option key={k} value={k}>{STATUS[k]}</option>)}</select></> : null}
        </li>))}</ul> : <p className="tl-muted">No goals yet.{team ? "" : ` ${learner.nickname}'s teachers and specialists set them.`}</p>}
      {team ? <Card>
        <h2>Add a goal</h2>
        <form className="tl-stack" onSubmit={e => { e.preventDefault(); s.addGoal(learner.id, { text, area, target }).then(() => { setText(""); setTarget(""); setError(""); done("Goal added."); }, (err: Error) => setError(err.message)); }}>
          <VoiceField label="Goal" value={text} onChange={setText} hint="Small and observable, for example: follows a 3-step plan without reminders." error={error} required />
          <div className="tl-field"><label htmlFor="gArea">Area</label><select id="gArea" value={area} onChange={e => setArea(e.target.value)}>{AREAS.map(a => <option key={a}>{a}</option>)}</select></div>
          <div className="tl-field"><label htmlFor="gTarget">Target date (optional)</label><input id="gTarget" type="date" value={target} onChange={e => setTarget(e.target.value)} /></div>
          <div className="tl-row"><Button type="submit" variant="primary">Add goal</Button></div>
        </form>
      </Card> : null}
      {!team && data?.notes.length ? <><h2>Notes from {learner.nickname}'s specialists</h2>{data.notes.map(n => <div key={n.id} className="obs-item"><b>{n.authorName}</b> · {day(n.createdAt)}<div>{n.body}</div></div>)}</> : null}
      <p className="note">This describes activities, not ability. It is not a diagnosis or an assessment.</p>
    </div>
  );
}

function Marks({ obs }: { obs: Observation[] }) {
  if (!obs.length) return <div className="goal-obs"><span className="note">No observations yet.</span></div>;
  const last = obs[obs.length - 1]!;
  return (
    <div className="goal-obs">
      <span className="goal-marks" role="img" aria-label={`Observations: ${obs.map(o => `${day(o.at)} ${LEVEL_TEXT[o.level]}`).join(", ")}`}>{obs.map(o => <span key={o.id} className={`gm gm-${o.level}`} aria-hidden="true">{LEVEL_MARK[o.level]}</span>)}</span>
      <span className="note">Latest, {day(last.at)}: {LEVEL_TEXT[last.level]}{last.note ? `: ${last.note}` : ""}</span>
    </div>
  );
}

function AddObservation({ goal, onSave }: { goal: Goal; onSave: (level: Observation["level"], note: string) => Promise<void> }) {
  const [level, setLevel] = useState<Observation["level"]>("support"), [note, setNote] = useState("");
  return (
    <details className="goal-add"><summary>Add an observation</summary>
      <fieldset><legend>How did it go?</legend>{(Object.keys(LEVEL_TEXT) as Observation["level"][]).map(k =>
        <label key={k} className="consent" htmlFor={`go-${goal.id}-${k}`}><input type="radio" name={`go-${goal.id}`} id={`go-${goal.id}-${k}`} checked={level === k} onChange={() => setLevel(k)} /><span>{LEVEL_MARK[k]} {LEVEL_TEXT[k]}</span></label>)}</fieldset>
      <Field label="What you saw (optional)" value={note} onChange={setNote} multiline />
      <div className="tl-row"><Button small variant="primary" onClick={() => void onSave(level, note).then(() => setNote(""))}>Save observation</Button></div>
    </details>
  );
}

export function Notes({ me, learner }: { me: Account; learner: Learner }) {
  const { store, syncNow } = useServices(), s = store.as(me);
  const [notes, reload] = useLoad(() => s.notes(learner.id), [store, me, learner.id]);
  const [body, setBody] = useState(""), [share, setShare] = useState(false), [error, setError] = useState("");
  return (
    <div className="tl-stack">
      <form className="tl-stack" onSubmit={e => { e.preventDefault(); s.addNote(learner.id, body, share).then(() => { setBody(""); setShare(false); setError(""); reload(); void syncNow().catch(() => {}); }, (err: Error) => setError(err.message)); }}>
        <VoiceField label="New note" value={body} onChange={setBody} kind="long" error={error} />
        <label className="tl-row"><input type="checkbox" checked={share} onChange={e => setShare(e.target.checked)} /> Share this note with the family</label>
        <div className="tl-row"><Button type="submit" variant="primary" disabled={!body.trim()}>Save note</Button></div>
      </form>
      <p className="note">Write facts and observations. Don't record anything you wouldn't want the family to read: they can ask to see everything held about their child.</p>
      {notes?.length ? notes.map(n => <div key={n.id} className="obs-item"><b>{n.authorName}</b> · {day(n.createdAt)} · {n.shareFamily ? "shared with family" : "specialists only"}<div>{n.body}</div></div>) : <p className="tl-muted">No notes yet.</p>}
    </div>
  );
}
