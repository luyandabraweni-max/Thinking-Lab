import { canChangeConsent, type Account, type Learner, type TeamInvite } from "@tl/data";
import { Button, Card, Field, More, Notice } from "@tl/ui";
import { useState } from "react";
import { addDeviceLearner, PICTURES, useServices } from "../../platform";
import { useLoad } from "./use-load";

const CONSENTS: [keyof Pick<Learner["consent"], "share" | "support" | "health">, string][] = [
  ["share", "Share with the teachers and specialists on the team"],
  ["support", "Record support needs"],
  ["health", "Share medicines and health records with the people I choose below"]
];

/** Consent and who sees what: the family decides. Team members see who else is on the team. */
export function Sharing({ me, learner, onChanged, onDeleted }: { me: Account; learner: Learner; onChanged: () => void; onDeleted?: () => void }) {
  const { store, syncNow } = useServices();
  const s = store.as(me), family = canChangeConsent(me, learner);
  const [people] = useLoad(async () => Promise.all(learner.team.map(async t => ({ t, a: await store.account(t.userId) }))), [store, learner]);
  const done = () => { onChanged(); void syncNow().catch(() => {}); };
  return (
    <div className="tl-stack">
      <h2>Consent</h2>
      {family ? CONSENTS.map(([k, label]) => (
        <label key={k} className="tl-row"><input type="checkbox" checked={learner.consent[k]} onChange={e => void s.setConsent(learner.id, { [k]: e.target.checked }).then(done)} /> {label}</label>))
        : <p className="tl-muted">Only {learner.nickname}'s family can change consent. Health records shared: {learner.consent.health ? "yes" : "no"}.</p>}
      <p className="tl-muted">Under {learner.consent.law}. Every change is recorded with the date and who made it.</p>
      <h2>The team</h2>
      {(people ?? []).map(({ t, a }) => (
        <Card key={t.userId} as="article">
          <p><b>{a?.name ?? "Team member"}</b>{a?.profession ? `, ${a.profession}` : ""}</p>
          {family ? <label className="tl-row"><input type="checkbox" checked={t.healthAccess} disabled={!learner.consent.health}
            onChange={e => void s.setHealthAccess(learner.id, t.userId, e.target.checked).then(done)} /> Can see medicines and health records</label>
            : <p className="tl-muted">{t.healthAccess && learner.consent.health ? "Can see health records" : "Doesn't see health records"}</p>}
          {family ? <RemoveMember me={me} learner={learner} userId={t.userId} name={a?.name ?? "this person"} onDone={done} /> : null}
        </Card>))}
      {people && !people.length ? <p className="tl-muted">Nobody else on the team yet.</p> : null}
      {family ? <AddToTeam me={me} learner={learner} onAdded={done} /> : null}
      <OpenOnDevice me={me} learner={learner} />
      {family && onDeleted ? <DeleteProfile me={me} learner={learner} onDeleted={onDeleted} /> : null}
    </div>
  );
}

/** The family adds a teacher or specialist by email: at once if they have an account, otherwise when they register. */
function AddToTeam({ me, learner, onAdded }: { me: Account; learner: Learner; onAdded: () => void }) {
  const { team } = useServices();
  const api = team(me), name = learner.nickname;
  const [email, setEmail] = useState(""), [msg, setMsg] = useState(""), [error, setError] = useState(""), [busy, setBusy] = useState(false), [n, setN] = useState(0);
  const [invites] = useLoad<TeamInvite[]>(() => api.invites(learner.id).catch(() => []), [learner.id, n]);
  const add = async () => {
    setBusy(true); setError(""); setMsg("");
    try {
      const e = email.trim().toLowerCase(), r = await api.add(learner.id, e);
      setMsg(r === "added" ? `Added to ${name}'s team.` : `Invitation saved. Ask them to register with ${e}: they join ${name}'s team then.`);
      setEmail(""); setN(x => x + 1); onAdded();
    } catch (err) { setError((err as Error).message); } finally { setBusy(false); }
  };
  return (
    <Card as="section">
      <h3>Add a teacher or specialist</h3>
      <form className="tl-stack" onSubmit={e => { e.preventDefault(); void add(); }}>
        <Field label="Their email address" type="email" value={email} onChange={setEmail} autoComplete="off" required />
        <div className="tl-row"><Button type="submit" variant="primary" disabled={busy || !email.trim()}>Add to team</Button>
          <More label="How this works">If they already have a teacher or specialist account, they join straight away. If not, they join when they register with this email. No email is sent: let them know. They don't see health records until you switch that on.</More></div>
      </form>
      {!learner.consent.share ? <Notice>They see {name} only while "Share with the teachers and specialists on the team" is ticked.</Notice> : null}
      <p role="status" aria-live="polite">{msg}</p>
      {error ? <p className="tl-error" role="alert">{error}</p> : null}
      {invites?.length ? <><h4>Waiting to register</h4><ul className="plain">{invites.map(i => <li key={i.email}>{i.email}{" "}
        <Button small variant="quiet" aria-label={`Cancel the invitation for ${i.email}`} onClick={() => void api.cancel(learner.id, i.email).then(() => { setMsg(`Invitation for ${i.email} cancelled.`); setN(x => x + 1); })}>Cancel</Button></li>)}</ul></> : null}
    </Card>);
}

/** Taking someone off the child's team, with a second press to confirm. */
function RemoveMember({ me, learner, userId, name, onDone }: { me: Account; learner: Learner; userId: string; name: string; onDone: () => void }) {
  const { team } = useServices();
  const [sure, setSure] = useState(false), [error, setError] = useState("");
  if (!sure) return <div className="tl-row"><Button small variant="quiet" onClick={() => setSure(true)}>Remove from team</Button></div>;
  return (
    <div className="tl-stack">
      <p>Remove {name}? They will no longer see {learner.nickname}.</p>
      <div className="tl-row">
        <Button small variant="primary" onClick={() => void team(me).remove(learner.id, userId).then(onDone, (e: Error) => setError(e.message))}>Remove</Button>
        <Button small variant="quiet" onClick={() => setSure(false)}>Keep</Button>
      </div>
      {error ? <p className="tl-error" role="alert">{error}</p> : null}
    </div>);
}

/** The family deletes the child's profile and everything about them (POPIA: the right to deletion). */
function DeleteProfile({ me, learner, onDeleted }: { me: Account; learner: Learner; onDeleted: () => void }) {
  const { deleteLearner } = useServices();
  const [open, setOpen] = useState(false), [typed, setTyped] = useState(""), [error, setError] = useState(""), [busy, setBusy] = useState(false);
  const name = learner.nickname;
  if (!open) return <div className="tl-row"><Button variant="quiet" onClick={() => setOpen(true)}>Delete {name}'s profile</Button></div>;
  return (
    <Card as="section">
      <h2>Delete {name}'s profile?</h2>
      <p>This deletes everything about {name} from 2to.iQ: their progress, goals, notes, messages, reports, settings, character and health records. Teachers and therapists lose access. <b>It can't be undone.</b></p>
      <div className="tl-field"><label htmlFor="delName">To confirm, type {name}</label>
        <input id="delName" autoComplete="off" value={typed} onChange={e => setTyped(e.target.value)} /></div>
      {error ? <p className="tl-error" role="alert">{error}</p> : null}
      <div className="tl-row">
        <Button variant="primary" disabled={busy || typed.trim().toLowerCase() !== name.toLowerCase()}
          onClick={() => { setBusy(true); setError(""); deleteLearner(me, learner.id).then(onDeleted, (e: Error) => setError(e.message)).finally(() => setBusy(false)); }}>Delete for ever</Button>
        <Button variant="quiet" onClick={() => { setOpen(false); setTyped(""); }}>Keep {name}'s profile</Button>
      </div>
    </Card>);
}

/** An adult sets up this device for the learner, with a picture password the learner will remember. */
function OpenOnDevice({ me, learner }: { me: Account; learner: Learner }) {
  const { store } = useServices();
  const [pics, setPics] = useState<number[]>([]), [msg, setMsg] = useState("");
  const pick = async (i: number) => {
    const next = [...pics, i];
    if (next.length < 3) return setPics(next);
    await addDeviceLearner(store.kv, { learnerId: learner.id, nickname: learner.nickname, adultId: me.id }, next);
    setPics([]);
    setMsg(`Done. ${learner.nickname}'s pictures are ${next.map(n => PICTURES[n]![1]).join(", then ")}. Help them remember. To give them the device now, use "Hand over to ${learner.nickname}" on your home screen.`);
  };
  return (
    <Card>
      <h2>Use this device for {learner.nickname}</h2>
      <p>Choose three pictures, in order, as {learner.nickname}'s picture password on this device.</p>
      <p role="status" aria-live="polite">{pics.length ? `${pics.length} of 3 chosen.` : msg}</p>
      <div className="tl-row" role="group" aria-label="Pictures">
        {PICTURES.map(([em, name], i) => <Button key={name} aria-label={name} onClick={() => void pick(i)}><span aria-hidden="true" style={{ fontSize: "1.6rem" }}>{em}</span></Button>)}
      </div>
      {msg ? <Notice tone="ok">Keep the picture password private between you and {learner.nickname}.</Notice> : null}
    </Card>
  );
}
