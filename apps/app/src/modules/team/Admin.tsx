import type { Account } from "@tl/data";
import { Card } from "@tl/ui";
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
        <thead><tr><th scope="col">Name</th><th scope="col">Role</th><th scope="col">Learners</th><th scope="col">Safeguarding lead</th></tr></thead>
        <tbody>{o.staff.map(s => (
          <tr key={s.id}><th scope="row">{s.name}<div className="note">{s.email}</div></th><td>{s.profession ?? ""}</td><td>{s.learners}</td>
            <td><label className="row" htmlFor={`dsl-${s.id}`}><input type="checkbox" id={`dsl-${s.id}`} checked={s.lead} aria-label={`${s.name} is a safeguarding lead`}
              onChange={e => { const on = e.target.checked; void api.setLead(s.id, on).then(() => { setMsg(`${s.name} ${on ? "is now a safeguarding lead and receives concerns" : "is no longer a safeguarding lead"}.`); reload(); }, (err: Error) => setMsg(err.message)); }} />
              <span aria-hidden="true">Lead</span></label></td></tr>))}</tbody>
      </table></div> : <p className="tl-muted">No staff yet.</p>}
      <p className="note" role="status">{msg}</p>
    </section>
  );
}
