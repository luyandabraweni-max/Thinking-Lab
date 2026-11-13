import type { Account } from "@tl/data";
import { Button, Card } from "@tl/ui";
import { useEffect, useState } from "react";
import { useServices } from "../../platform";
import { PHASE_NAME } from "./bank";
import * as R from "./rules";

// The class and caseload tracker (page 13): one row per learner, so the support team can see a whole class or
// caseload at once and act on the ones that need it this week. The risk band works itself out from each learner's
// profile. Safeguarding and attendance override everything else, because they do.

const ORDER: R.Risk[] = ["critical", "high", "moderate", "low", "unrated"];
interface Row { id: string; name: string; level: string; phase: string; stage: string; support: string; rate: number | null; safeguarding: boolean; critical: number; isp: string; last: string; next: string; owner: string; risk: R.Risk }

export function SupportTracker({ me, onOpen, onBack }: { me: Account; onOpen: (learnerId: string) => void; onBack: () => void }) {
  const { store } = useServices();
  const [rows, setRows] = useState<Row[]>(), [error, setError] = useState("");
  useEffect(() => {
    let live = true;
    (async () => {
      const s = store.as(me), all = await s.schoolProfiles(), when = new Date().toISOString().slice(0, 10);
      return Promise.all(all.map(async ({ learner: L, profile: p }) => {
        const phase = R.phaseOf(p, L.level), concerns = (await s.concernsOnDevice(L.id)).length, al = R.alerts(p, phase, L.level, when);
        const reviews = Object.values(p.plan).filter(r => !r.removed && r.review >= when).map(r => r.review).sort();
        return { id: L.id, name: L.nickname, level: L.level, phase: phase ? PHASE_NAME[phase] : "Not set", stage: p.answers.siasStage ?? "", support: p.answers.supportLevel ?? "",
          rate: R.attendanceRate(p), safeguarding: !!concerns || al.some(a => a.safeguarding && a.status === "action"), critical: R.counts(p, R.itemsFor(phase)).critical,
          isp: p.answers.isp ?? "", last: p.answers.reviewDate ?? "", next: reviews[0] ?? "", owner: p.answers.keyContact ?? "", risk: R.riskOf(p, phase, L.level, concerns, when) };
      }));
    })().then(r => { if (live) setRows(r.sort((a, b) => ORDER.indexOf(a.risk) - ORDER.indexOf(b.risk) || a.name.localeCompare(b.name))); }, (e: Error) => { if (live) setError(e.message); });
    return () => { live = false; };
  }, [store, me]);

  const n = (f: (r: Row) => boolean) => rows?.filter(f).length ?? 0;
  return (
    <Card>
      <div className="tl-row"><Button variant="quiet" onClick={onBack}>All learners</Button></div>
      <h1>Support tracker</h1>
      <p className="tl-muted">One row for each learner whose school profile you keep. The risk band works itself out from each profile: safeguarding and attendance override everything else. It orders the team's work. It is not a measure of the child.</p>
      {error ? <p className="tl-error">{error}</p> : !rows ? <p>Loading…</p> : !rows.length ? <p className="tl-muted">No profiles yet. A learner appears here once their family has shared them with you and agreed to support needs being recorded.</p> : <>
        <div className="pf-scroll"><table className="pf-table"><tbody>
          <tr><th scope="row">Learners on this tracker</th><td>{rows.length}</td></tr>
          <tr><th scope="row">Critical, act this week</th><td>{n(r => r.risk === "critical")}</td></tr>
          <tr><th scope="row">High, act this term</th><td>{n(r => r.risk === "high")}</td></tr>
          <tr><th scope="row">Moderate, monitor and plan</th><td>{n(r => r.risk === "moderate")}</td></tr>
          <tr><th scope="row">Safeguarding concerns open</th><td>{n(r => r.safeguarding)}</td></tr>
          <tr><th scope="row">Attendance below 90 per cent</th><td>{n(r => r.rate !== null && r.rate < 90)}</td></tr>
          <tr><th scope="row">High or very high support with no Individual Support Plan</th><td>{n(r => /Level [34]/.test(r.support) && r.isp !== "Yes")}</td></tr>
        </tbody></table></div>
        <div className="pf-scroll"><table className="pf-table">
          <thead><tr>{["Learner", "Risk band", "Phase", "SIAS stage", "Support level", "Attendance", "Safeguarding concern open?", "Critical observations", "Individual Support Plan?", "Last review", "Next review", "Who owns this learner"].map(h => <th key={h} scope="col">{h}</th>)}</tr></thead>
          <tbody>{rows.map(r => (
            <tr key={r.id}>
              <th scope="row"><Button small variant="quiet" onClick={() => onOpen(r.id)}>{r.name}</Button><div className="note">{r.level}</div></th>
              <td className={r.risk === "critical" ? "pf-worse" : r.risk === "high" ? "pf-row pf-watch" : ""}><b>{R.RISK_NAME[r.risk]}</b></td>
              <td>{r.phase}</td><td>{r.stage}</td><td>{r.support}</td><td>{r.rate === null ? "" : `${r.rate}%`}</td><td>{r.safeguarding ? "Yes" : "No"}</td>
              <td>{r.critical}</td><td>{r.isp}</td><td>{r.last}</td><td>{r.next}</td><td>{r.owner}</td>
            </tr>))}</tbody></table></div>
      </>}
    </Card>
  );
}
