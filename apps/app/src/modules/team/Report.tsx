import { fromAttempt } from "@tl/adaptation";
import { CATALOGUE, COHORTS, cohortFor } from "@tl/content";
import { canEditPlan, type Account, type Learner } from "@tl/data";
import { buildReport, reportFileName, reportToDocx, reportToPdf, type ActivityInfo, type ReportModel, type ReportOptions } from "@tl/reports";
import { useState } from "react";
import { useServices } from "../../platform";
import { curriculumLink, GAMES, HOME_IDEA, type GameId } from "../thinking-lab";
import { useLoad } from "./use-load";

// Reports (ported from js/reports/report.js): preview on screen, then download as PDF or Word. Made on this device;
// nothing is uploaded. Health and medication are never in a report.
function activity(id: string): ActivityInfo | undefined {
  const g = GAMES[id as GameId];
  if (g) return { name: g.name, domain: g.domain, cat: g.cat, parent: g.parent, homeIdea: HOME_IDEA[g.id], curriculum: cohort => curriculumLink(g.id, cohort) };
  const u = CATALOGUE.find(x => x.id === id);
  return u ? { name: u.title, domain: u.domain, cat: u.subject, curriculum: () => `${u.caps}.` } : undefined;
}
function download(bytes: Uint8Array, type: string, filename: string) {
  const url = URL.createObjectURL(new Blob([bytes as BlobPart], { type })), a = document.createElement("a");
  a.href = url; a.download = filename; a.rel = "noopener"; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

export function Report({ me, learner }: { me: Account; learner: Learner }) {
  const { store } = useServices(), s = store.as(me), team = canEditPlan(me, learner);
  const [opts, setOpts] = useState<ReportOptions>({ kind: team ? "specialist" : "family", history: false });
  const [msg, setMsg] = useState("");
  const [data] = useLoad(async () => ({ rows: (await s.attempts(learner.id)).map(fromAttempt), goals: await s.goals(learner.id), notes: await s.notes(learner.id) }), [store, me, learner.id]);
  if (!data) return <p>Loading…</p>;
  const cohort = cohortFor(learner.cohort);
  const rep = buildReport({
    learner: { nickname: learner.nickname, cohort, cohortLabel: COHORTS[cohort], curriculum: learner.curriculum, level: learner.level },
    rows: data.rows, goals: data.goals.map(g => ({ text: g.text, area: g.area, status: g.status, target: g.target || null })),
    notes: data.notes.map(n => ({ at: n.createdAt, by: n.authorName, body: n.body, shareFamily: n.shareFamily })),
    by: { name: me.name, role: me.role, profession: me.profession }, activity
  }, opts);
  const save = (ext: "pdf" | "docx") => {
    const f = reportFileName(learner.nickname, opts.kind, ext);
    download(ext === "pdf" ? reportToPdf(rep) : reportToDocx(rep), ext === "pdf" ? "application/pdf" : "application/vnd.openxmlformats-officedocument.wordprocessingml.document", f);
    setMsg(`Downloaded ${f}. Check your downloads folder.`);
  };
  return (
    <div className="tl-stack">
      <div className="fields report-opts">
        {team ? <div className="tl-field"><label htmlFor="rKind">Type of report</label>
          <select id="rKind" value={opts.kind} onChange={e => setOpts({ ...opts, kind: e.target.value as ReportOptions["kind"] })}>
            <option value="specialist">Learning report (full evidence)</option><option value="family">Family summary (plain language)</option></select></div> : null}
        {opts.kind === "specialist" ? <label className="tl-row"><input type="checkbox" checked={!!opts.history} onChange={e => setOpts({ ...opts, history: e.target.checked })} /> Include every session</label> : null}
      </div>
      <div className="tl-row">
        <button className="btn primary" onClick={() => save("pdf")}><span className="em" aria-hidden="true">📄</span><span>Download PDF</span></button>
        <button className="btn" onClick={() => save("docx")}><span className="em" aria-hidden="true">📝</span><span>Download Word</span></button>
      </div>
      <p className="note" role="status">{msg}</p>
      <p className="note">PDF is best for sending and printing. Word is best if you need to add to it or edit it. Both are made on this device; nothing is uploaded. The report contains information about a child, so share it only with people who support them.</p>
      <h2>Preview</h2>
      <ReportPaper rep={rep} />
    </div>
  );
}

function ReportPaper({ rep }: { rep: ReportModel }) {
  return (
    <article className="report-paper">
      <h2 className="rp-title">{rep.title}</h2><p className="muted">{rep.subtitle}</p>
      <table className="hist rp-meta"><tbody>{rep.meta.map(([k, v]) => <tr key={k}><th scope="row">{k}</th><td>{v}</td></tr>)}</tbody></table>
      {rep.sections.map(sec => (
        <section key={sec.heading}><h3>{sec.heading}</h3>
          {(sec.paras ?? []).map(p => <p key={p}>{p}</p>)}
          {sec.bullets?.length ? <ul className="plain">{sec.bullets.map(b => <li key={b}>{b}</li>)}</ul> : null}
          {sec.table?.rows.length ? <div className="tablewrap" tabIndex={0} role="region" aria-label={sec.heading}><table className="hist">
            <thead><tr>{sec.table.head.map(h => <th key={h} scope="col">{h}</th>)}</tr></thead>
            <tbody>{sec.table.rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>)}</tbody></table></div> : null}
        </section>))}
      <p className="note">{rep.footer}</p><p className="note">{rep.pageNote}</p>
    </article>
  );
}
