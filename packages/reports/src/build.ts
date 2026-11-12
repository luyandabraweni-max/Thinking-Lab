import { strengths } from "./strengths";
import type { ReportInput, ReportModel, ReportOptions, ReportSection } from "./types";

// The report model, ported from js/reports/report.js. Health and medication are never included in any report.
const DOMAINS = ["Communication and Expression", "Logical and Analytical Thinking", "Inquiry and Systems Thinking", "Creativity and Metacognition"];
const GOAL_STATUS = { todo: "Not started", doing: "Working on it", done: "Achieved" };
const STATUS_TEXT: Record<string, string> = { alone: "Shown without support", support: "Shown with support", notyet: "Not yet shown", open: "Idea shared (open-ended)" };
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
export const fullDate = (d: string) => { const [y, m, dd] = d.slice(0, 10).split("-").map(Number); return `${dd} ${MONTHS[(m ?? 1) - 1]} ${y}`; };

export function buildReport(input: ReportInput, opts: ReportOptions): ReportModel {
  const { learner: L, rows, activity } = input, kind = opts.kind, name = L.nickname, today = opts.today ?? new Date().toISOString().slice(0, 10);
  const dates = [...new Set(rows.map(r => r[0]))].sort(), acts = [...new Set(rows.map(r => r[1]))].filter(id => activity(id));
  const ss = strengths(rows.filter(r => activity(r[1])), activity), sections: ReportSection[] = [];
  const period = dates.length ? `${fullDate(dates[0]!)} to ${fullDate(dates[dates.length - 1]!)}` : "No sessions yet";
  const notes = input.notes.filter(n => kind === "specialist" || n.shareFamily);
  sections.push({ heading: "Summary", paras: [dates.length
    ? `Between ${fullDate(dates[0]!)} and ${fullDate(dates[dates.length - 1]!)}, ${name} took part in ${dates.length} session${dates.length > 1 ? "s" : ""} and tried ${acts.length} different activit${acts.length === 1 ? "y" : "ies"}.`
    : `${name} has not done any sessions yet. This report will fill in as they use Thinking Lab.`] });
  if (kind === "family") {
    const top = ss.filter(s => s.level !== "Early").slice(0, 3);
    sections.push({ heading: "What went well", bullets: top.map(s => `${s.label}.`), paras: top.length ? [] : ["It's early days. Patterns will show after a few more sessions."] });
    sections.push({ heading: `What ${name} explored`, bullets: acts.map(a => { const x = activity(a)!; return `${x.name}: ${x.parent ? `${name} ${x.parent}` : x.cat || "a lesson"}`; }) });
    const count = rows.reduce<Record<string, number>>((m, r) => ((m[r[1]] = (m[r[1]] ?? 0) + 1), m), {});
    const most = Object.keys(count).filter(k => activity(k)?.homeIdea).sort((a, b) => count[b]! - count[a]!)[0];
    if (most) sections.push({ heading: "One idea for home", paras: [activity(most)!.homeIdea!] });
  } else {
    sections.push({ heading: "Strengths and preferences", paras: ss.length ? ["Levels follow the draft rule: Early (1 to 2 sessions), Growing (3 or more sessions on 2 or more days), Consistent (5 or more sessions on 3 or more days, across 2 or more activities)."] : ["No observations yet."],
      table: { head: ["Level", "Strength", "Evidence", "Suggestion"], rows: ss.map(s => [s.level, s.label, s.evidence, s.level === "Early" ? "No change yet" : s.suggestion]), widths: [0.8, 2, 2, 2.2] } });
    const inDomain = (d: string) => rows.filter(r => activity(r[1])?.domain === d).length;
    sections.push({ heading: "Activities by thinking domain", paras: ["A low number shows where to offer something new, not a weakness."], table: { head: ["Domain", "Activities completed"], rows: DOMAINS.map(d => [d, String(inDomain(d))]), widths: [3, 1] } });
  }
  if (input.goals.length) sections.push({ heading: "Individual support goals", table: { head: ["Goal", "Area", "Status", "Target date"], rows: input.goals.map(g => [g.text, g.area, GOAL_STATUS[g.status], g.target ? fullDate(g.target) : "Not set"]), widths: [3, 1.6, 1.1, 1.2] } });
  if (opts.support && L.supportConsent && L.supportNeeds) sections.push({ heading: "Supports", bullets: [`Support needs (shared with the guardian's consent): ${L.supportNeeds}`] });
  const linked = acts.filter(a => activity(a)?.curriculum?.(L.cohort));
  if (linked.length) sections.push({ heading: "Curriculum links (proposed)", paras: ["Draft links awaiting specialist confirmation. Thinking Lab does not replace the school's curriculum."], bullets: linked.map(a => `${activity(a)!.name}: ${activity(a)!.curriculum!(L.cohort)}`) });
  if (kind === "specialist" && opts.history && rows.length) sections.push({ heading: "Session history", table: { head: ["Date", "Activity", "What was observed", "Answered by", "Hints"],
    rows: rows.filter(r => activity(r[1])).slice().reverse().map(r => [fullDate(r[0]), activity(r[1])!.name, STATUS_TEXT[r[2]] ?? r[2], r[3], String(r[4])]), widths: [1.4, 1.6, 1.8, 1.6, 0.6] } });
  if (notes.length) sections.push({ heading: kind === "family" ? "Notes from specialists" : "Notes", table: { head: ["Date", "From", "Note"],
    rows: notes.map(n => [fullDate(n.at), n.by + (kind === "specialist" && !n.shareFamily ? " (not shared with family)" : ""), n.body]), widths: [1.2, 1.4, 4] } });
  const by = input.by;
  return {
    title: kind === "family" ? `Family summary for ${name}` : `Learning report for ${name}`,
    subtitle: "2to.iQ Thinking Lab",
    meta: [["Learner", name], ["Age group", L.cohortLabel], ["Curriculum", [L.curriculum, L.level].filter(Boolean).join(", ") || "Not set"], ["Period", period],
      ["Prepared by", `${by.name} (${by.role === "guardian" ? "parent or guardian" : by.profession || "specialist"})`], ["Date", fullDate(today)]],
    sections,
    footer: "These are observations of activities, not a diagnosis, a label or proof of mastery. Help from a person is not recorded. Curriculum links are drafts awaiting specialist confirmation.",
    pageNote: "Confidential: about a child. Share only with people who support them."
  };
}
export const reportFileName = (nickname: string, kind: ReportOptions["kind"], ext: "pdf" | "docx", today = new Date().toISOString().slice(0, 10)) =>
  `ThinkingLab-${kind === "family" ? "family-summary" : "report"}-${nickname.replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-|-$/g, "") || "learner"}-${today}.${ext}`;
