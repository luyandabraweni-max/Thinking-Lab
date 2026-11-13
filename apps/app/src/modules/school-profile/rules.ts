import type { ProfileRating, SchoolProfile } from "@tl/data";
import { CORE, PHASE_ITEMS, PHASE_NAME, PHASES, STRATEGIES, type Item, type Phase } from "./bank";

// The pack's calculation engine, as pure functions: the flag on each observation, the alerts on page 10, the ranked
// barriers and strategies on page 11, the plan summary on page 12, the tracker's risk band on page 13 and the domain
// averages on page 15. Every result is a prompt for a person to check something, never a conclusion or a diagnosis,
// and there is no total score: the pack forbids one.

export type Flag = "critical" | "watch" | "ok" | "blank";
export const FLAG_NAME: Record<Flag, string> = { critical: "CRITICAL", watch: "Watch", ok: "OK", blank: "Not yet rated" };

/** A rating counts once its impact is chosen; "Not observed yet" (-1) is not a zero. */
const scored = (n: number | null | undefined) => typeof n === "number" && n >= 0;
export function flagOf(r: ProfileRating | undefined): Flag {
  if (!r || (!scored(r.impact) && !scored(r.support))) return "blank";
  const i = scored(r.impact) ? r.impact! : 0, s = scored(r.support) ? r.support! : 0;
  if (i >= 3 || s >= 3) return "critical";
  if (i === 2 || s === 2) return "watch";
  return "ok";
}

/** The phase from the profile, or worked out from the learner's grade ("Grade 4", "Grade R", "Foundation level"). */
export function phaseOf(p: SchoolProfile, level: string): Phase | null {
  const chosen = PHASES.find(x => PHASE_NAME[x] === p.answers.phase);
  if (chosen) return chosen;
  const l = level.toLowerCase(), g = /grade\s*(r|\d+)/.exec(l);
  if (g) { const n = g[1] === "r" ? 0 : Number(g[1]); return n <= 3 ? "foundation" : n <= 6 ? "intermediate" : n <= 9 ? "senior" : n <= 12 ? "fet" : null; }
  if (/early|pre|ecd|creche|nursery/.test(l)) return "ecd";
  if (/foundation/.test(l)) return "foundation";
  return null;
}
/** Grade R, 1, 4, 7 and 10 start a phase: the years in which support most often falls away. */
export const firstYearOf = (level: string) => { const g = /grade\s*(r|\d+)/i.exec(level); return g ? ["r", "1", "4", "7", "10"].includes(g[1]!.toLowerCase()) : null; };

/** The observations that apply to this learner: the core page and their phase page. The other four are ignored. */
export const itemsFor = (phase: Phase | null): Item[] => [...CORE, ...(phase ? PHASE_ITEMS[phase] : [])];
export const domainsOf = (items: Item[]) => [...new Set(items.map(i => i.domain))];

export interface Counts { critical: number; watch: number; ok: number; blank: number; total: number; share: number }
export function counts(p: SchoolProfile, items: Item[]): Counts {
  const c = { critical: 0, watch: 0, ok: 0, blank: 0 };
  for (const it of items) c[flagOf(p.ratings[it.id])]++;
  const total = items.length;
  return { ...c, total, share: total ? Math.round(((total - c.blank) / total) * 100) : 0 };
}

export interface DomainRow { domain: string; critical: number; watch: number; ok: number; blank: number; highest: number | null }
export function byDomain(p: SchoolProfile, items: Item[]): DomainRow[] {
  return domainsOf(items).map(domain => {
    const its = items.filter(i => i.domain === domain), row: DomainRow = { domain, critical: 0, watch: 0, ok: 0, blank: 0, highest: null };
    for (const it of its) {
      const r = p.ratings[it.id];
      row[flagOf(r)]++;
      if (scored(r?.impact)) row.highest = Math.max(row.highest ?? 0, r!.impact!);
    }
    return row;
  });
}

/** Average impact per domain, leaving out what was not observed yet (page 15). */
export function domainAverages(p: SchoolProfile, items: Item[]): Record<string, number> {
  const out: Record<string, number> = {};
  for (const d of domainsOf(items)) {
    const xs = items.filter(i => i.domain === d).map(i => p.ratings[i.id]?.impact).filter(scored) as number[];
    if (xs.length) out[d] = Math.round((xs.reduce((a, b) => a + b, 0) / xs.length) * 100) / 100;
  }
  return out;
}

export interface Barrier { item: Item; rating: ProfileRating; strategies: typeof STRATEGIES }
/** The barriers, highest impact first, then by support needed; each matched to the first three strategies for its domain (page 11). */
export function barriers(p: SchoolProfile, items: Item[], max = 15): Barrier[] {
  return items.map(item => ({ item, rating: p.ratings[item.id]! }))
    .filter(b => b.rating && (flagOf(b.rating) === "critical" || flagOf(b.rating) === "watch"))
    .sort((a, b) => (b.rating.impact ?? 0) - (a.rating.impact ?? 0) || (b.rating.support ?? 0) - (a.rating.support ?? 0))
    .slice(0, max)
    .map(b => ({ ...b, strategies: STRATEGIES.filter(s => s.domain === b.item.domain).slice(0, 3) }));
}

// ---------- Page 10: alerts ----------
export type AlertStatus = "action" | "clear" | "info";
export const ALERT_STATUS: Record<AlertStatus, string> = { action: "ACTION NEEDED", clear: "Clear", info: "Not enough information" };
export interface Alert { key: string; check: string; status: AlertStatus; seeing: string; todo: string; safeguarding?: boolean }

const num = (s: string | undefined) => (s && s.trim() !== "" && !isNaN(Number(s)) ? Number(s) : null);
export function attendanceRate(p: SchoolProfile) {
  const absent = num(p.answers.daysAbsent), days = num(p.answers.schoolDays);
  return absent !== null && days ? Math.round(((days - absent) / days) * 1000) / 10 : null;
}
const daysUntil = (iso: string | undefined, today: string) => (iso ? Math.round((Date.parse(iso) - Date.parse(today)) / 86400000) : null);
const HIGH_SUPPORT = ["Level 3, high support", "Level 4, very high support"];
const SNA1_DONE = ["SNA 1 completed by the teacher", "SNA 2 completed by the SBST", "SNA 3 / DBE 120 submitted to the DBST", "Individual Support Plan in place", "District support allocated", "Placement under review"];
const COMMS_DOMAINS = ["Communication & language", "Early communication"];
const WELLBEING_DOMAINS = ["Wellbeing & safeguarding", "Adolescent wellbeing & peer context"];
const voiceBlank = (p: SchoolProfile) => !Object.values(p.voice).some(v => v && v.trim());

export function alerts(p: SchoolProfile, phase: Phase | null, level: string, today = new Date().toISOString().slice(0, 10)): Alert[] {
  const items = itemsFor(phase), c = counts(p, items), a = p.answers, v = p.voice, out: Alert[] = [];
  const add = (x: Alert) => out.push(x);
  const voiceMissing = voiceBlank(p);
  const critIn = (domains: string[]) => items.filter(i => domains.includes(i.domain) && flagOf(p.ratings[i.id]) === "critical").length;
  const watchIn = (domains: string[]) => items.filter(i => domains.includes(i.domain) && flagOf(p.ratings[i.id]) === "watch").length;

  add(v.v16 ? { key: "unkind", check: "Learner reports someone is unkind to them", safeguarding: true, status: v.v16 === "No" ? "clear" : "action", seeing: `The learner's answer: ${v.v16}.${v.v17 ? ` ${v.v17}` : ""}`, todo: "Follow up with the learner today, privately. Record what was said, where and when. Apply the school's safeguarding procedure. Do not investigate it yourself." }
    : { key: "unkind", check: "Learner reports someone is unkind to them", safeguarding: true, status: "info", seeing: "The learner's own words have not been recorded.", todo: "Follow up with the learner today, privately. Record what was said, where and when. Apply the school's safeguarding procedure. Do not investigate it yourself." });
  add({ key: "unsafe", check: "Learner does not feel safe at school", safeguarding: true, status: !v.v18 ? "info" : v.v18 === "Yes" ? "clear" : "action", seeing: v.v18 ? `The learner's answer: ${v.v18}.` : "The learner's own words have not been recorded.", todo: "Treat as urgent. Find out what the learner means by it before deciding anything else." });
  add({ key: "adult", check: "Learner has no trusted adult at school", status: !v.v14 ? "info" : v.v14 === "Yes" ? "clear" : "action", seeing: v.v14 ? `The learner's answer: ${v.v14}.${v.v15 ? ` The adult: ${v.v15}.` : ""}` : "The learner's own words have not been recorded.", todo: "Name an adult, tell the learner who it is, and tell the adult. A support system the learner does not know about does not exist." });
  const wc = critIn(WELLBEING_DOMAINS), ww = watchIn(WELLBEING_DOMAINS);
  add({ key: "wellbeing", check: "A wellbeing or safeguarding observation is flagged critical", safeguarding: true, status: wc ? "action" : "clear", seeing: `${wc} critical and ${ww} watch in this domain.`, todo: "Read the evidence for those observations. Apply the safeguarding protocol." });
  const run = num(a.longestRun);
  add({ key: "absent3", check: "Three or more consecutive school days absent", status: run === null ? "info" : run >= 3 ? "action" : "clear", seeing: run === null ? "Not entered in the profile." : `Longest run: ${run} days.`, todo: "Policy requires the class teacher to report three consecutive school days of unexplained absence to the principal, who must then contact the parent." });
  add({ key: "absent10", check: "Ten or more consecutive school days absent", status: run === null ? "info" : run >= 10 ? "action" : "clear", seeing: run === null ? "Not entered in the profile." : `Longest run: ${run} days.`, todo: "At ten consecutive school days without a valid reason the learner's record may be cancelled in the class register. Escalate now and involve the district and social development where needed." });
  const rate = attendanceRate(p);
  add({ key: "rate", check: "Attendance has fallen below 90 per cent", status: rate === null ? "info" : rate < 90 ? "action" : "clear", seeing: rate === null ? "Enter days absent and school days in the profile." : `Attendance rate: ${rate}%.`, todo: "Look at the pattern, not just the total. Absence concentrated on particular days or before assessments is telling the school something a percentage hides." });
  add({ key: "isp", check: "High support need with no Individual Support Plan", status: !a.supportLevel || !a.isp ? "info" : HIGH_SUPPORT.includes(a.supportLevel) && a.isp !== "Yes" ? "action" : "clear", seeing: `Support level: ${a.supportLevel || "not entered"}. Individual Support Plan: ${a.isp || "not entered"}.`, todo: "Convene the SBST and open an Individual Support Plan. A high support rating without a plan is the gap that shows up later in a concession application." });
  add({ key: "sna1", check: "Critical concerns recorded but SNA 1 not completed", status: !c.critical ? "clear" : !a.siasStage ? "info" : SNA1_DONE.includes(a.siasStage) ? "clear" : "action", seeing: `${c.critical} critical observations recorded. SIAS stage: ${a.siasStage || "not entered"}.`, todo: "Complete SNA 1, recording what has already been tried at classroom level. Classroom level support must be documented before escalation." });
  add({ key: "eight", check: "Eight or more critical observations across the profile", status: c.critical >= 8 ? "action" : "clear", seeing: `${c.critical} observations are flagged critical.`, todo: "This is a whole-profile concern, not a subject problem. Take it to the SBST as one case and consider a referral to the DBST on DBE 120." });
  const first = a.firstYear || (firstYearOf(level) === null ? "" : firstYearOf(level) ? "Yes" : "No");
  add({ key: "firstYear", check: "Learner is in the first year of a phase with critical concerns open", status: !first ? "info" : first === "Yes" && c.critical ? "action" : "clear", seeing: `First year of the phase: ${first || "not entered"}. Critical observations: ${c.critical}.`, todo: "Transition years are where support quietly stops. Confirm in writing that every teacher has the support plan and that last year's adjustments carried over." });
  if (phase === "fet") add({ key: "dbe124", check: "FET learner with no examination accommodation application", status: !a.dbe124 ? "info" : a.dbe124 === "Yes" || a.dbe124 === "In progress" || a.dbe124 === "Not applicable" ? "clear" : "action", seeing: `Phase: ${PHASE_NAME.fet}. DBE 124 applied for: ${a.dbe124 || "not entered"}.`, todo: "Start the application now. Confirm this year's deadline with the district or assessment body, since deadlines differ and change. An accommodation used for the first time in the final examination usually fails, and a first application in Grade 12 is normally refused." });
  const due = daysUntil(a.concessionDue, today);
  add({ key: "deadline", check: "Concession deadline is within 60 days or has passed", status: due === null ? "info" : due <= 60 ? "action" : "clear", seeing: due === null ? "No deadline recorded in the profile." : due < 0 ? `The deadline passed ${-due} days ago.` : `${due} days to go.`, todo: "Check the evidence file is current. Assessment bodies commonly refuse reports older than two years." });
  add({ key: "plan", check: "No emergency or health plan recorded", status: !a.emergencyPlan ? "info" : a.emergencyPlan === "Yes" && !(a.planKept || "").trim() ? "action" : "clear", seeing: `Authorised health or emergency plan: ${a.emergencyPlan || "not entered"}.${a.planKept ? ` Kept: ${a.planKept}.` : ""}`, todo: "A relief teacher must be able to find this in under a minute. Record where the authorised plan is kept." });
  add({ key: "evacuate", check: "Learner needs help in an evacuation", status: !a.evacuation ? "info" : a.evacuation === "Yes" && !(a.evacuationStaff || "").trim() ? "action" : "clear", seeing: `Needs help to evacuate: ${a.evacuation || "not entered"}.${a.evacuationStaff ? ` Responsible: ${a.evacuationStaff}.` : ""}`, todo: "Name the responsible staff member in the school fire plan, and name a backup for when that person is absent." });
  const cc = critIn(COMMS_DOMAINS);
  add({ key: "language", check: "Not taught in the learner's strongest language, with communication barriers flagged", status: !a.strongestLang ? "info" : a.strongestLang === "No" && cc ? "action" : "clear", seeing: `Taught in strongest language: ${a.strongestLang || "not entered"}. Critical communication observations: ${cc}.`, todo: "Do not read a language difference as a disorder. Assess in the strongest language, or with an interpreter, before concluding anything about communication." });
  add({ key: "device", check: "Learner uses a device or system that staff may not know", status: !a.usesDevice ? "info" : a.usesDevice === "Yes" ? "action" : "clear", seeing: `Uses a device, signs or pictures: ${a.usesDevice || "not entered"}.${a.deviceSetup ? ` ${a.deviceSetup}` : ""}`, todo: "Confirm every teacher who sees this learner has been shown how it works, including relief staff. A system nobody can operate is not access." });
  add({ key: "consent", check: "Consent not yet in place", status: !a.consent ? "info" : a.consent.startsWith("Yes") || a.consent.startsWith("Consent given") ? "clear" : "action", seeing: `Consent status: ${a.consent || "not entered"}.`, todo: "Obtain consent from the parent or legal guardian before sharing anything outside the staff who teach this learner." });
  add({ key: "voice", check: "The learner's own views have not been recorded", status: voiceMissing ? "action" : "clear", seeing: voiceMissing ? "The learner's own words are blank." : "Recorded.", todo: "SIAS expects the learner's views to form part of the process. Find a method that suits their communication, including observation during play for a very young child." });
  add({ key: "unrated", check: "Large share of applicable observations still unrated", status: c.share < 80 ? "action" : "clear", seeing: `${c.share}% of applicable observations rated.`, todo: "Finish the observations before any decision about placement, referral or concession rests on this profile." });
  return out;
}

// ---------- Page 12: the plan summary ----------
export function planSummary(p: SchoolProfile, today = new Date().toISOString().slice(0, 10)) {
  const rows = Object.values(p.plan).filter(r => !r.removed);
  const decided = (r: { decision: string }) => r.decision && r.decision !== "Not yet reviewed";
  return {
    actions: rows.length,
    overdue: rows.filter(r => r.review && r.review < today && !decided(r)).length,
    helped: rows.filter(r => r.decision === "Continue as is" || r.decision === "Continue and strengthen").length,
    changed: rows.filter(r => r.decision === "Change the approach" || r.decision === "Stop").length,
    escalated: rows.filter(r => r.decision === "Escalate to the SBST" || r.decision === "Refer to the DBST").length
  };
}
export const isOverdue = (r: { review: string; decision: string }, today = new Date().toISOString().slice(0, 10)) => !!r.review && r.review < today && (!r.decision || r.decision === "Not yet reviewed");

// ---------- Page 13: the class and caseload tracker ----------
export type Risk = "critical" | "high" | "moderate" | "low" | "unrated";
export const RISK_NAME: Record<Risk, string> = { critical: "Critical, act this week", high: "High, act this term", moderate: "Moderate, monitor and plan", low: "Low, usual teaching is working", unrated: "Not yet rated" };
/** Safeguarding and attendance override everything else, because they do. */
export function riskOf(p: SchoolProfile, phase: Phase | null, level: string, concernsOpen = 0, today?: string): Risk {
  const al = alerts(p, phase, level, today), on = (k: string) => al.find(x => x.key === k)?.status === "action";
  const c = counts(p, itemsFor(phase));
  if (concernsOpen || al.some(x => x.safeguarding && x.status === "action") || on("absent3") || on("absent10")) return "critical";
  if (c.critical || on("rate") || on("isp") || planSummary(p, today).overdue) return "high";
  if (c.watch) return "moderate";
  return c.share >= 50 ? "low" : "unrated";
}

/** The change since the baseline in the latest review: negative is better (green), half a point or more worse is red. */
export function change(base: number | undefined, latest: number | undefined) {
  if (base === undefined || latest === undefined) return null;
  const d = Math.round((latest - base) * 100) / 100;
  return { d, tone: d < 0 ? "better" : d >= 0.5 ? "worse" : "same" } as const;
}

/** Average impact per domain for this learner's phase: what the intake's home and school comparison reads. */
export const domainAveragesFor = (p: SchoolProfile, level: string) => domainAverages(p, itemsFor(phaseOf(p, level)));
export const ratedCount = (p: SchoolProfile, level: string) => counts(p, itemsFor(phaseOf(p, level))).total - counts(p, itemsFor(phaseOf(p, level))).blank;
