import type { Account, ConcernRecord } from "@tl/data";
import { Button, Card } from "@tl/ui";
import { useState } from "react";
import { useServices } from "../../platform";
import { useLoad } from "./use-load";

const when = (iso: string) => new Date(iso).toLocaleString("en-ZA", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

/**
 * For the designated safeguarding lead: concerns learners raised, shown first and never hidden behind anything else.
 * Never included in reports. On the server, every time this list is read is logged.
 */
export function SafeguardingPanel({ me }: { me: Account }) {
  const services = useServices(), api = services.safeguarding(me);
  const [list, reload, error] = useLoad(() => api.concerns(), [services, me]);
  if (error) return <p className="tl-error">Safeguarding concerns couldn't be loaded: {error}</p>;
  if (!list?.length && !me.safeguardingLead) return null;
  const open = (list ?? []).filter(c => c.status === "open"), done = (list ?? []).filter(c => c.status !== "open");
  return (
    <section className={open.length ? "safety-alert" : "tl-card"} role={open.length ? "alert" : undefined} aria-labelledby="sgTitle">
      <h2 id="sgTitle"><span aria-hidden="true">🛟</span> {open.length ? `Safeguarding: ${open.length} concern${open.length > 1 ? "s" : ""} to follow up` : "Safeguarding: nothing open"}</h2>
      <p>You see these because you are a designated safeguarding lead. Stay calm and listen. Don't ask leading questions or promise to keep a secret. Follow your organisation's child protection policy. The family isn't told automatically.</p>
      {open.map(c => <FollowUp key={c.id} c={c} onDone={async action => { await api.followUp(c.id, action); reload(); }} />)}
      {done.length ? <details><summary>Followed up ({done.length})</summary><ul className="plain">{done.map(c => <li key={c.id}>{c.nickname}, {when(c.raisedAt)}: {c.action || "No note"}</li>)}</ul></details> : null}
    </section>
  );
}

function FollowUp({ c, onDone }: { c: ConcernRecord; onDone: (action: string) => Promise<void> }) {
  const [action, setAction] = useState(""), [busy, setBusy] = useState(false), id = `sg-${c.id}`;
  return (
    <Card as="article">
      <p><b>{c.nickname}</b> said they feel unsafe · {when(c.raisedAt)} · from the {c.raisedFrom}</p>
      <div className="tl-field"><label htmlFor={id}>What you did</label><textarea id={id} value={action} maxLength={2000} onChange={e => setAction(e.target.value)} /></div>
      <div className="tl-row"><Button disabled={busy || !action.trim()} onClick={() => { setBusy(true); void onDone(action).finally(() => setBusy(false)); }}>Mark as followed up</Button></div>
    </Card>
  );
}
