import { Button, Card } from "@tl/ui";
import { VoiceField } from "@tl/voice/react";
import { lazy, Suspense, useEffect, useState, type ReactNode } from "react";
import { useServices, type DeviceLearner } from "../../platform";
import type { Row } from "@tl/adaptation";
import type { Unit, WordHelp } from "@tl/content";
import type { ConcernRow, LearnerSpace, Message } from "@tl/data";
import { UNSAFE, UnsafeDialog } from "../safety";
import type { GameId, LabRun } from "../thinking-lab";

// Lessons and games load when the learner opens them, so the app starts fast on low-end phones.
const LearnHome = lazy(() => import("../learning").then(m => ({ default: m.LearnHome })));
const Lesson = lazy(() => import("../learning").then(m => ({ default: m.Lesson })));
const LabHome = lazy(() => import("../thinking-lab").then(m => ({ default: m.LabHome })));
const Exercise = lazy(() => import("../thinking-lab").then(m => ({ default: m.Exercise })));
const Loading = () => <section className="card"><p role="status">Getting it ready…</p></section>;

const STICKERS = ["Thank you!", "That made me happy", "I'm proud", "Can you help me?"];

/** The learner's own space: lessons, the Thinking Lab, and messages from their team. */
const reducedMotion = () => document.documentElement.dataset.motion === "reduce" || !!globalThis.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

export function LearnerHome({ learner, onDone }: { learner: DeviceLearner; onDone: () => void }) {
  const { store } = useServices();
  const [space, setSpace] = useState<LearnerSpace>(), [inbox, setInbox] = useState<Message[]>([]), [text, setText] = useState(""), [note, setNote] = useState<ReactNode>("");
  const [screen, setScreen] = useState<"home" | "lab" | "learn" | GameId>("home");
  const [lesson, setLesson] = useState<{ unit: Unit; words?: WordHelp; history: Row[] } | null>(null), [unsafe, setUnsafe] = useState(false);
  const raiseConcern = (where: ConcernRow["where"]) => { setUnsafe(true); void space?.reportConcern(where); };
  const openLesson = async (id: string) => {
    if (!space) return;
    const [{ unit, words }, past] = await Promise.all([import("@tl/content").then(c => c.loadUnit(id)), space.history()]);
    setLesson({ unit, words, history: past.map((a): Row => [a.occurredAt.slice(0, 10), a.activityId, a.status, a.mode, a.hints, a.reflection, ...(a.flags ? [a.flags] : [])] as Row) });
  };
  useEffect(() => {
    void (async () => {
      const adult = await store.account(learner.adultId);
      if (!adult) return setNote("The grown-up who set up this device needs to sign in again.");
      const sp = await store.learnerSpace(adult, learner.learnerId);
      setSpace(sp); setInbox(await sp.inbox()); await sp.markRead();
    })().catch((e: Error) => setNote(e.message));
  }, [store, learner]);
  const older = space ? space.learner.cohort === "teen" || space.learner.cohort === "adult" : false;
  if (unsafe) return <UnsafeDialog older={older} country={null} onClose={() => setUnsafe(false)} />;
  if (space && lesson) return <Suspense fallback={<Loading />}><Lesson key={lesson.unit.id} {...lesson} older={older} country={null} onSave={a => space.record(a)} onUnsafe={() => raiseConcern("lesson")} onBack={() => setLesson(null)} /></Suspense>;
  if (space && screen === "learn") return <Suspense fallback={<Loading />}><LearnHome learner={space.learner} onPick={id => void openLesson(id)} onBack={() => setScreen("home")} /></Suspense>;
  if (space && screen !== "home") {
    const run: LabRun = { id: screen === "lab" ? "light" : (screen as GameId), band: older ? "older" : "younger", learnerName: space.learner.nickname, W: (kid, grown) => (older ? grown : kid), reduceMotion: reducedMotion(), say: () => {} };
    if (screen === "lab") return <Suspense fallback={<Loading />}><LabHome W={run.W} onPick={setScreen} onBack={() => setScreen("home")} /></Suspense>;
    return <Suspense fallback={<Loading />}><Exercise key={screen} run={run} onSave={a => space.record(a)} onBack={() => setScreen("lab")} /></Suspense>;
  }
  const reply = async (body: string) => { if (!space) return; await space.reply(body); setText(""); setInbox(await space.inbox()); setNote("Sent!"); };
  return (
    <Card>
      <h1>Hello, {learner.nickname}</h1>
      <div className="row"><Button variant="primary" onClick={() => setScreen("learn")}>Learn</Button><Button variant="primary" onClick={() => setScreen("lab")}>Thinking Lab</Button></div>
      <h2>Messages for you</h2>
      {inbox.length ? <ol className="tl-stack" style={{ listStyle: "none", padding: 0, margin: 0 }}>{inbox.map(m => <li key={m.id}><Card as="article"><p className="tl-muted"><b>{m.fromRole === "learner" ? "You" : m.fromName}</b></p><p>{m.body}</p></Card></li>)}</ol>
        : <p className="tl-muted">No messages yet.</p>}
      <div className="tl-row">{STICKERS.map(s => <Button key={s} onClick={() => void reply(s)}>{s}</Button>)}</div>
      <form className="tl-stack" onSubmit={e => { e.preventDefault(); void reply(text); }}>
        <VoiceField label="Or say something yourself" value={text} onChange={setText} kind="long" />
        <div className="tl-row"><Button type="submit" variant="primary" disabled={!text.trim()}>Send</Button></div>
      </form>
      <p role="status">{note}</p>
      <div className="tl-row"><Button onClick={onDone}>I'm done</Button><Button onClick={() => raiseConcern("home")}><span aria-hidden="true">🛟</span>{UNSAFE}</Button></div>
    </Card>
  );
}
