"use strict";

// ---------- Reports ----------
// One report model feeds the on-screen preview, the PDF and the Word file, so all three always match.
const REPORT_DOMAINS = ["Communication and Expression", "Logical and Analytical Thinking", "Inquiry and Systems Thinking", "Creativity and Metacognition"];
const GOAL_STATUS = { todo: "Not started", doing: "Working on it", done: "Achieved" };
const fullDate = d => { const [y, m, dd] = d.split("-").map(Number); return `${dd} ${["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][m - 1]} ${y}`; };
const todayIso = () => new Date().toISOString().slice(0, 10);

// kind: "family" (plain language, for parents and carers) or "specialist" (full evidence, for teachers and therapists).
// opts.support: include support needs (only offered when the guardian has consented). opts.history: include every session.
function buildReport(L, kind, by, opts) {
  opts = opts || {};
  const rows = L.rows || [], dates = [...new Set(rows.map(r => r[0]))].sort(), acts = [...new Set(rows.map(r => r[1]))].filter(id => exById(id));
  const ss = strengths({ code: L.nickname, rows: rows.filter(r => exById(r[1])) });
  const name = L.nickname, sections = [];
  const period = dates.length ? `${fullDate(dates[0])} to ${fullDate(dates[dates.length - 1])}` : "No sessions yet";
  const sharedNotes = (L.notes || []).filter(n => kind === "specialist" || n.shareFamily);
  sections.push({ heading: "Summary", paras: [dates.length
    ? `Between ${fullDate(dates[0])} and ${fullDate(dates[dates.length - 1])}, ${name} took part in ${dates.length} session${dates.length > 1 ? "s" : ""} and tried ${acts.length} different activit${acts.length === 1 ? "y" : "ies"}.`
    : `${name} has not done any sessions yet. This report will fill in as they use Thinking Lab.`] });
  if (kind === "family") {
    const top = ss.filter(s => s.level !== "Early").slice(0, 3);
    sections.push({ heading: "What went well", bullets: top.length ? top.map(s => s.label + ".") : [], paras: top.length ? [] : ["It's early days. Patterns will show after a few more sessions."] });
    sections.push({ heading: `What ${name} explored`, bullets: acts.map(a => { const x = exById(a); return `${x.name}: ${SPEC[a] && SPEC[a].parent ? `${name} ${SPEC[a].parent}` : x.cat || "a lesson"}`; }) });
    const fav = rows.reduce((m, r) => (m[r[1]] = (m[r[1]] || 0) + 1, m), {}), most = Object.keys(fav).filter(k => HOME_IDEA[k]).sort((a, b) => fav[b] - fav[a])[0];
    if (most) sections.push({ heading: "One idea for home", paras: [HOME_IDEA[most]] });
  } else {
    sections.push({ heading: "Strengths and preferences", paras: ss.length ? ["Levels follow the draft rule: Early (1 to 2 sessions), Growing (3 or more sessions on 2 or more days), Consistent (5 or more sessions on 3 or more days, across 2 or more activities)."] : ["No observations yet."],
      table: { head: ["Level", "Strength", "Evidence", "Suggestion"], rows: ss.map(s => [s.level, s.label, s.evidence, s.level === "Early" ? "No change yet" : s.suggestion]), widths: [0.8, 2, 2, 2.2] } });
    const dc = d => rows.filter(r => exById(r[1]) && exById(r[1]).domain === d).length;
    sections.push({ heading: "Activities by thinking domain", paras: ["A low number shows where to offer something new, not a weakness."], table: { head: ["Domain", "Activities completed"], rows: REPORT_DOMAINS.map(d => [d, String(dc(d))]), widths: [3, 1] } });
  }
  const goals = L.goals || [];
  if (goals.length) sections.push({ heading: "Individual support goals", table: { head: ["Goal", "Area", "Status", "Target date"], rows: goals.map(g => [g.text, g.area, GOAL_STATUS[g.status], g.target ? fullDate(g.target) : "Not set"]), widths: [3, 1.6, 1.1, 1.2] } });
  const prefs = describePrefs(L);
  const helps = [L.supports ? `What helps: ${L.supports}` : null, prefs ? `Screen and sound settings that help: ${prefs}` : null, opts.support && L.consent && L.consent.support && L.supportNeeds ? `Support needs (shared with the guardian's consent): ${L.supportNeeds}` : null].filter(Boolean);
  if (helps.length) sections.push({ heading: "Supports", bullets: helps });
  if (acts.some(a => CAPS_LINK[a])) sections.push({ heading: "Curriculum links (proposed)", paras: ["Draft links awaiting specialist confirmation. Thinking Lab does not replace the school's curriculum."], bullets: acts.filter(a => CAPS_LINK[a]).map(a => `${exById(a).name}: ${curriculumLink(a, L.cohort)}`) });
  if (kind === "specialist" && opts.history && rows.length) sections.push({ heading: "Session history", table: { head: ["Date", "Activity", "What was observed", "Answered by", "Hints"], rows: rows.filter(r => exById(r[1])).slice().reverse().map(r => [fullDate(r[0]), exById(r[1]).name, STATUS_TEXT[r[2]], MODE_TEXT[r[3]] || r[3], String(r[4])]), widths: [1.4, 1.6, 1.8, 1.6, 0.6] } });
  if (sharedNotes.length) sections.push({ heading: kind === "family" ? "Notes from specialists" : "Notes", table: { head: ["Date", "From", "Note"], rows: sharedNotes.map(n => [fullDate(n.date), n.by + (kind === "specialist" && !n.shareFamily ? " (not shared with family)" : ""), n.text]), widths: [1.2, 1.4, 4] } });
  return {
    title: kind === "family" ? `Family summary for ${name}` : `Learning report for ${name}`,
    subtitle: "2to.iQ Thinking Lab",
    meta: [["Learner", name], ["Age group", COHORTS[L.cohort] || "-"], ["Curriculum", [L.curriculum, L.level].filter(Boolean).join(", ") || "Not set"], ["Period", period], ["Prepared by", `${by.name} (${by.role === "parent" ? "parent or guardian" : by.profession || "specialist"})`], ["Date", fullDate(todayIso())]],
    sections,
    footer: "These are observations of activities, not a diagnosis, a label or proof of mastery. Help from a person is not recorded. Curriculum links are drafts awaiting specialist confirmation.",
    pageNote: "Confidential: about a child. Share only with people who support them."
  };
}
function reportHtml(rep) {
  const table = t => `<div class="tablewrap" tabindex="0" role="region" aria-label="Table"><table class="hist"><thead><tr>${t.head.map(h => `<th scope="col">${esc(h)}</th>`).join("")}</tr></thead><tbody>${t.rows.map(r => `<tr>${r.map(c => `<td>${esc(c)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
  return `<article class="report-paper">
      <h2 class="rp-title">${esc(rep.title)}</h2><p class="muted">${esc(rep.subtitle)}</p>
      <table class="hist rp-meta"><tbody>${rep.meta.map(([k, v]) => `<tr><th scope="row">${esc(k)}</th><td>${esc(v)}</td></tr>`).join("")}</tbody></table>
      ${rep.sections.map(s => `<section><h3>${esc(s.heading)}</h3>${(s.paras || []).map(p => `<p>${esc(p)}</p>`).join("")}${s.bullets && s.bullets.length ? `<ul class="plain">${s.bullets.map(b => `<li>${esc(b)}</li>`).join("")}</ul>` : ""}${s.table && s.table.rows.length ? table(s.table) : ""}</section>`).join("")}
      <p class="note">${esc(rep.footer)}</p><p class="note">${esc(rep.pageNote)}</p></article>`;
}
function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob), a = document.createElement("a");
  a.href = url; a.download = filename; a.rel = "noopener"; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}
const reportFileName = (L, kind, ext) => `ThinkingLab-${kind === "family" ? "family-summary" : "report"}-${L.nickname.replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-|-$/g, "") || "learner"}-${todayIso()}.${ext}`;

// Choose the report type and what to include, preview it, then download as PDF or Word.
function reportScreen(L, by, back) {
  const st = { kind: by.role === "parent" ? "family" : "specialist", support: false, history: false };
  const canSupport = !!(L.consent && L.consent.support && L.supportNeeds);
  const draw = () => {
    const rep = buildReport(L, st.kind, by, st);
    render(`
      <section class="card">
        ${portalHead()}
        <p class="eyebrow">Report</p>
        <h1>Download a report for ${esc(L.nickname)}</h1>
        <div class="fields report-opts">
          ${by.role === "specialist" ? `<label for="rKind">Type of report<select id="rKind"><option value="specialist"${st.kind === "specialist" ? " selected" : ""}>Learning report (full evidence)</option><option value="family"${st.kind === "family" ? " selected" : ""}>Family summary (plain language)</option></select></label>` : ""}
          ${canSupport ? `<label class="row" for="rSupport" style="flex-direction:row"><input type="checkbox" id="rSupport"${st.support ? " checked" : ""}> Include support needs</label>` : ""}
          ${st.kind === "specialist" ? `<label class="row" for="rHistory" style="flex-direction:row"><input type="checkbox" id="rHistory"${st.history ? " checked" : ""}> Include every session</label>` : ""}
        </div>
        <div class="row">
          <button class="btn primary" id="rPdf">${icon("📄")}<span>Download PDF</span></button>
          <button class="btn" id="rDocx">${icon("📝")}<span>Download Word</span></button>
          <button class="btn quiet" id="rBack">Back</button>
        </div>
        <p class="note" id="rMsg" role="status"></p>
        <p class="note">PDF is best for sending and printing. Word is best if you need to add to it or edit it. Both are made on this device; nothing is uploaded. The report contains information about a child, so share it only with people who support them.</p>
        <h2>Preview</h2>
        ${reportHtml(rep)}
      </section>`);
    const kindSel = document.getElementById("rKind"); if (kindSel) kindSel.onchange = () => { st.kind = kindSel.value; draw(); };
    const sup = document.getElementById("rSupport"); if (sup) sup.onchange = () => { st.support = sup.checked; draw(); };
    const his = document.getElementById("rHistory"); if (his) his.onchange = () => { st.history = his.checked; draw(); };
    const done = f => { document.getElementById("rMsg").textContent = `Downloaded ${f}. Check your downloads folder.`; };
    on("#rPdf", () => { const f = reportFileName(L, st.kind, "pdf"); downloadBlob(reportToPdf(buildReport(L, st.kind, by, st)), f); done(f); });
    on("#rDocx", () => { const f = reportFileName(L, st.kind, "docx"); downloadBlob(reportToDocx(buildReport(L, st.kind, by, st)), f); done(f); });
    on("#rBack", back);
    wirePortalHead();
  };
  draw();
}
