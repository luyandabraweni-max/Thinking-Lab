import type { Account, Learner } from "@tl/data";
import { Button, Card } from "@tl/ui";
import { VoiceField } from "@tl/voice/react";
import { useEffect, useState } from "react";
import { useServices } from "../../platform";
import { useLoad } from "./use-load";

const when = (iso: string) => new Date(iso).toLocaleString("en-ZA", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

/** The team's conversation about a learner. Messages to the learner stay visible to the whole team and family. */
export function Messages({ me, learner }: { me: Account; learner: Learner }) {
  const { store, syncNow } = useServices();
  const s = store.as(me);
  const [list, reload] = useLoad(() => s.messages(learner.id), [store, me, learner.id]);
  const [text, setText] = useState(""), [toLearner, setToLearner] = useState(false), [error, setError] = useState("");
  useEffect(() => { void s.markRead(learner.id); }, [list]); // eslint-disable-line react-hooks/exhaustive-deps

  const send = async () => {
    try { await s.send(learner.id, text, toLearner ? "learner" : "team"); setText(""); setError(""); reload(); void syncNow().catch(() => {}); }
    catch (e) { setError((e as Error).message); }
  };
  return (
    <div className="tl-stack">
      <ol className="tl-stack" style={{ listStyle: "none", padding: 0, margin: 0 }} aria-label="Messages">
        {(list ?? []).map(m => (
          <li key={m.id}><Card as="article">
            <p className="tl-muted"><b>{m.fromName}</b> · {when(m.createdAt)}{m.audience === "learner" ? ` · to ${learner.nickname}` : ""}{m.fromRole === "learner" ? " · from the learner" : ""}</p>
            <p>{m.body}</p>
          </Card></li>))}
      </ol>
      {list && !list.length ? <p className="tl-muted">No messages yet.</p> : null}
      <form className="tl-stack" onSubmit={e => { e.preventDefault(); void send(); }}>
        <VoiceField label="Your message" value={text} onChange={setText} kind="long" error={error} />
        <label className="tl-row"><input type="checkbox" checked={toLearner} onChange={e => setToLearner(e.target.checked)} /> Send to {learner.nickname} too (they see it at their next session)</label>
        <div className="tl-row"><Button type="submit" variant="primary" disabled={!text.trim()}>Send</Button></div>
      </form>
    </div>
  );
}
