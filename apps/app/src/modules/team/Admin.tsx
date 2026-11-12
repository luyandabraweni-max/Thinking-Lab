import type { Account, OrgAdmin, StaffInvite } from "@tl/data";
import { Button, Card, Field } from "@tl/ui";
import { useState } from "react";
import { useServices } from "../../platform";
import { useLoad } from "./use-load";

/**
 * The organisation admin's home (ported from js/portal/admin.js): totals and staff, and who the safeguarding lead is.
 * Never an individual learner's records: those belong to the family and the specialists they chose.
 */
export function AdminHome({ me }: { me: Account }) {
  const services = useServices(), api = services.admin(me);
  const [o, reload, error] = useLoad(() => api.overview(), [services, me]);
  const [msg, setMsg] = useState("");
  if (error) return <Card><p className="tl-error">{error}</p></Card>;
  if (!o) return <Card><p>Loading…</p></Card>;
  const leads = o.staff.filter(s => s.lead);
  return (
    <section className="card">
      <p className="eyebrow">School admin</p>
      <h1>{o.name}</h1>
      {leads.length ? null : <div className="safety-alert" role="alert"><h2><span aria-hidden="true">🛟</span> No safeguarding lead</h2><p>Choose at least one designated safeguarding lead below. Until you do, nobody receives a learner's "I feel unsafe" concern.</p></div>}
      <div className="stats">
        <div className="stat"><b>{o.staff.length}</b><span>staff</span></div>
        <div className="stat"><b>{o.learners}</b><span>learners</span></div>
        <div className="stat"><b>{o.active30}</b><span>active in the last 30 days</span></div>
        <div className="stat"><b>{o.openConcerns}</b><span>safeguarding concern{o.openConcerns === 1 ? "" : "s"} still open</span></div>
      </div>
      <p className="note">Totals only. As school admin you don't see learners' names, progress or notes: families share those with the specialists they choose.{o.openConcerns ? " Open concerns are handled by your safeguarding lead." : ""}</p>
      <h2>Staff</h2>
      {o.staff.length ? <div className="tablewrap" tabIndex={0} role="region" aria-label="Staff"><table className="hist">
        <thead><tr><th scope="col">Name</th><th scope="col">Role</th><th scope="col">Learners</th><th scope="col">Safeguarding lead</th><th scope="col"><span className="tl-visually-hidden">Remove</span></th></tr></thead>
        <tbody>{o.staff.map(s => (
          <tr key={s.id}><th scope="row">{s.name}<div className="note">{s.email}</div></th><td>{s.profession ?? ""}</td><td>{s.learners}</td>
            <td><label className="row" htmlFor={`dsl-${s.id}`}><input type="checkbox" id={`dsl-${s.id}`} checked={s.lead} aria-label={`${s.name} is a safeguarding lead`}
              onChange={e => { const on = e.target.checked; void api.setLead(s.id, on).then(() => { setMsg(`${s.name} ${on ? "is now a safeguarding lead and receives concerns" : "is no longer a safeguarding lead"}.`); reload(); }, (err: Error) => setMsg(err.message)); }} />
              <span aria-hidden="true">Lead</span></label></td>
            <td><Button small variant="quiet" aria-label={`Remove ${s.name} from ${o.name}`} onClick={() => {
              if (!confirm(`Remove ${s.name} from ${o.name}? Learners that families shared with them personally stay shared.`)) return;
              void api.removeStaff(s.id).then(() => { setMsg(`${s.name} is no longer staff at ${o.name}.`); reload(); }, (err: Error) => setMsg(err.message)); }}>Remove</Button></td></tr>))}</tbody>
      </table></div> : <p className="tl-muted">No staff yet.</p>}
      <p className="note" role="status">{msg}</p>
      <AddStaff api={api} org={o.name} invites={o.invites} onChange={(m: string) => { setMsg(m); reload(); }} />
    </section>
  );
}

const ROLE: Record<StaffInvite["role"], string> = { teacher: "Teacher", specialist: "Specialist or therapist" };

function AddStaff({ api, org, invites, onChange }: { api: OrgAdmin; org: string; invites: StaffInvite[]; onChange: (msg: string) => void }) {
  const [email, setEmail] = useState(""), [role, setRole] = useState<StaffInvite["role"]>("teacher"), [error, setError] = useState(""), [busy, setBusy] = useState(false);
  const add = async () => {
    setBusy(true); setError("");
    try {
      const r = await api.addStaff(email, role), e = email.trim().toLowerCase();
      setEmail("");
      onChange(r === "added" ? `${e} already had an account and is now staff at ${org}.`
        : `Invitation saved for ${e}. Ask them to open Thinking Lab and register with this email address: they'll join ${org} automatically.`);
    } catch (err) { setError((err as Error).message); } finally { setBusy(false); }
  };
  return (
    <>
      <h2>Add staff</h2>
      <p className="note">Enter a colleague's work email. If they already use Thinking Lab, they join straight away. If not, they join when they register with that email. We don't send them an email: tell them yourself.</p>
      <form className="tl-stack" onSubmit={e => { e.preventDefault(); void add(); }}>
        <Field label="Their email address" value={email} onChange={setEmail} type="email" autoComplete="off" error={error} />
        <div className="tl-field"><label htmlFor="stRole">Their role</label>
          <select id="stRole" value={role} onChange={e => setRole(e.target.value as StaffInvite["role"])}>{(Object.keys(ROLE) as StaffInvite["role"][]).map(k => <option key={k} value={k}>{ROLE[k]}</option>)}</select></div>
        <div className="tl-row"><Button type="submit" variant="primary" disabled={busy || !email.trim()}>Add to {org}</Button></div>
      </form>
      {invites.length ? <><h3>Waiting to register</h3><ul className="plain">{invites.map(i => <li key={i.email}>{i.email} · {ROLE[i.role]}{" "}
        <Button small variant="quiet" aria-label={`Cancel the invitation for ${i.email}`} onClick={() => void api.cancelInvite(i.email).then(() => onChange(`Invitation for ${i.email} cancelled.`), (err: Error) => onChange(err.message))}>Cancel</Button></li>)}</ul></> : null}
    </>
  );
}
