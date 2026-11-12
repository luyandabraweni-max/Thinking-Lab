import { Button, Card } from "@tl/ui";
import { VoiceField } from "@tl/voice/react";
import { useEffect, useState, type ReactNode } from "react";
import { useServices, type DeviceLearner } from "../../platform";
import type { LearnerSpace, Message } from "@tl/data";
import { Exercise, LabHome, type GameId, type LabRun } from "../thinking-lab";

const STICKERS = ["Thank you!", "That made me happy", "I'm proud", "Can you help me?"];

/** The learner's own space. For now: messages from their team, with quick replies or their own words. The games and lessons join here as they are ported. */
const reducedMotion = () => document.documentElement.dataset.motion === "reduce" || !!globalThis.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

export function LearnerHome({ learner, onDone }: { learner: DeviceLearner; onDone: () => void }) {
  const { store } = useServices();
  const [space, setSpace] = useState<LearnerSpace>(), [inbox, setInbox] = useState<Message[]>([]), [text, setText] = useState(""), [note, setNote] = useState<ReactNode>("");
  const [screen, setScreen] = useState<"home" | "lab" | GameId>("home");
  useEffect(() => {
    void (async () => {
      const adult = await store.account(learner.adultId);
      if (!adult) return setNote("The grown-up who set up this device needs to sign in again.");
      const sp = await store.learnerSpace(adult, learner.learnerId);
      setSpace(sp); setInbox(await sp.inbox()); await sp.markRead();
    })().catch((e: Error) => setNote(e.message));
  }, [store, learner]);
  if (space && screen !== "home") {
    const older = space.learner.cohort === "teen" || space.learner.cohort === "adult";
    const run: LabRun = { id: screen === "lab" ? "light" : screen, band: older ? "older" : "younger", learnerName: space.learner.nickname, W: (kid, grown) => (older ? grown : kid), reduceMotion: reducedMotion(), say: () => {} };
    if (screen === "lab") return <LabHome W={run.W} onPick={setScreen} onBack={() => setScreen("home")} />;
    return <Exercise key={screen} run={run} onSave={a => space.record(a)} onBack={() => setScreen("lab")} />;
  }
  const reply = async (body: string) => { if (!space) return; await space.reply(body); setText(""); setInbox(await space.inbox()); setNote("Sent!"); };
  return (
    <Card>
      <h1>Hello, {learner.nickname}</h1>
      <div className="row"><Button variant="primary" onClick={() => setScreen("lab")}>Thinking Lab</Button></div>
      <h2>Messages for you</h2>
      {inbox.length ? <ol className="tl-stack" style={{ listStyle: "none", padding: 0, margin: 0 }}>{inbox.map(m => <li key={m.id}><Card as="article"><p className="tl-muted"><b>{m.fromRole === "learner" ? "You" : m.fromName}</b></p><p>{m.body}</p></Card></li>)}</ol>
        : <p className="tl-muted">No messages yet.</p>}
      <div className="tl-row">{STICKERS.map(s => <Button key={s} onClick={() => void reply(s)}>{s}</Button>)}</div>
      <form className="tl-stack" onSubmit={e => { e.preventDefault(); void reply(text); }}>
        <VoiceField label="Or say something yourself" value={text} onChange={setText} kind="long" />
        <div className="tl-row"><Button type="submit" variant="primary" disabled={!text.trim()}>Send</Button></div>
      </form>
      <p role="status">{note}</p>
      <div className="tl-row"><Button onClick={onDone}>I'm done</Button></div>
    </Card>
  );
}
