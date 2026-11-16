import type { IntakeValue } from "@tl/data";
import { ABOUT, CONCERN, DAILY, DAILY_AREAS, HEALTH, MILESTONES, SAFETY, SAFETY_FOLLOW_UP, SENSES, SERVICES_Q, STORY, VOICE, type Section } from "./bank";

// The intake's calculation pages, as pure functions: the clinical summary and triage (page 11), "How to support me"
// (page 12) and the review baseline (page 13). They order what the family reported and prompt the team with questions.
// Nothing here is a finding, a screening result or a score: the pack forbids a total, and clinical judgement overrides
// every line.

export type Data = Record<string, IntakeValue>;
export const text = (d: Data, k: string) => { const v = d[k]; return typeof v === "string" ? v.trim() : ""; };
export const scoreOf = (label: string) => CONCERN.find(([l]) => l === label)?.[1] ?? null;
const scored = (n: number | null): n is number => n !== null && n >= 0;
export const rowsOf = (d: Data, table: string): Record<string, string>[] => Object.entries(d).filter(([k, v]) => k.startsWith(`${table}:`) && typeof v === "object" && !v.removed)
  .map(([k, v]): Record<string, string> => ({ ...(v as Record<string, string>), id: k.slice(table.length + 1) })).sort((a, b) => (a.at ?? "").localeCompare(b.at ?? ""));

// ---------- Ratings ----------
export interface AreaRow { area: string; rated: number; significant: number; average: number | null; highest: number | null }
export function areaAverages(d: Data): AreaRow[] {
  return DAILY_AREAS.map(area => {
    const xs = DAILY.filter(i => i.area === area).map(i => scoreOf(text(d, `d${i.n}c`))).filter(scored);
    return { area, rated: xs.length, significant: xs.filter(x => x >= 3).length,
      average: xs.length ? Math.round((xs.reduce((a, b) => a + b, 0) / xs.length) * 100) / 100 : null, highest: xs.length ? Math.max(...xs) : null };
  });
}
/** The highest reported impact at home: by the level the family chose, with their stated priorities lifted above items of the same level. */
export function topDaily(d: Data, max = 12) {
  return DAILY.map(i => ({ ...i, score: scoreOf(text(d, `d${i.n}c`)), top: text(d, `d${i.n}p`) === "Yes, a top priority for us" }))
    .filter(i => scored(i.score) && i.score > 0)
    .sort((a, b) => b.score! - a.score! || Number(b.top) - Number(a.top) || a.n - b.n).slice(0, max)
    .map(i => ({ ...i, level: text(d, `d${i.n}c`), often: text(d, `d${i.n}f`), where: text(d, `d${i.n}w`), words: text(d, `d${i.n}t`) }));
}
export function topSenses(d: Data, max = 5) {
  return SENSES.map((sense, i) => ({ sense, i, score: scoreOf(text(d, `e${i}c`)) })).filter(x => scored(x.score) && x.score > 0)
    .sort((a, b) => b.score! - a.score! || a.i - b.i).slice(0, max)
    .map(x => ({ ...x, pattern: text(d, `e${x.i}p`), level: text(d, `e${x.i}c`), where: text(d, `e${x.i}w`), helps: text(d, `e${x.i}h`) }));
}
export const milestonesLate = (d: Data) => MILESTONES.filter((_, i) => ["Later than this", "Not yet"].includes(text(d, `m${i}`))).length;
/** Safety answers that need a private conversation before or at the first appointment. */
export function safetyFollowUps(d: Data) {
  return SAFETY_FOLLOW_UP.filter(k => { const v = text(d, k); return v && (k === "s5" ? v !== "Yes" : v !== "No"); });
}
export const immediateDanger = (d: Data) => text(d, "s1") === "Yes";

// ---------- What is still missing ----------
const keysOf = (secs: Section[]) => secs.flatMap(s => s.questions.map(q => q.key));
export function completeness(d: Data) {
  const share = (keys: string[]) => ({ answered: keys.filter(k => text(d, k)).length, total: keys.length });
  return [
    ["About", share(keysOf(ABOUT))], ["Our Story", share(keysOf(STORY))], ["In My Own Words", share(keysOf(VOICE))],
    ["Early Years and Health", share([...keysOf(HEALTH), ...MILESTONES.map((_, i) => `m${i}`)])], ["Safety and Wellbeing", share(keysOf(SAFETY))],
    ["Reports and Services", share(SERVICES_Q.map(q => q.key))], ["Daily Life Profile, areas rated", share(DAILY.map(i => `d${i.n}c`))], ["Sensory Profile, senses rated", share(SENSES.map((_, i) => `e${i}c`))]
  ] as [string, { answered: number; total: number }][];
}
const voiceBlank = (d: Data) => !keysOf(VOICE).some(k => text(d, k));

// ---------- Flags to read before the first appointment ----------
export interface Flag { label: string; value: string; note: string; attention: boolean }
export function flags(d: Data, medicines: number | null): Flag[] {
  const allergies = rowsOf(d, "allergy"), allergyNone = text(d, "allergyNone");
  const fu = safetyFollowUps(d).length, late = milestonesLate(d);
  const f = (label: string, value: string, note: string, attention: boolean): Flag => ({ label, value: value || "Not answered", note, attention });
  return [
    f("Allergy or adverse reaction recorded", allergies.length ? `${allergies.length} recorded: ${allergies.map(a => a.cause).filter(Boolean).join(", ")}` : allergyNone === "Yes" ? "None known" : "NOT COMPLETED. Confirm before any food or medicine is given.", "Early Years and Health.", !allergies.length && allergyNone !== "Yes"),
    f("Medicines currently taken", medicines === null ? "Not visible to you" : `${medicines} listed`, "In Health. Review dose, timing and side effects.", false),
    f("Seizures or episodic events reported", text(d, "h4"), "A reported event needs characterising before any other conclusion.", text(d, "h4") === "Yes"),
    f("Loss of previously held skills reported", text(d, "l1"), "A Yes here warrants paediatric or neurological review as a priority.", text(d, "l1") === "Yes"),
    f("Milestones reported late or not yet reached", `${late} of ${MILESTONES.length}`, "A count on its own means nothing. Read which ones.", late > 0),
    f("Hearing tested by an audiologist", text(d, "v2"), "Hearing must be excluded before language, attention or social findings are interpreted.", text(d, "v2") !== "Done, result normal"),
    f("Reported to hear in quiet but not in noise", text(d, "v4"), "Standard audiometry can be normal here. Consider speech in noise testing.", text(d, "v4") === "Yes"),
    f("Vision tested", text(d, "v6"), "Uncorrected vision mimics a reading difficulty.", text(d, "v6") !== "Done, result normal"),
    f("Uses a communication device, pictures or signs", text(d, "k3"), "Ask the family to bring it. Never assess expressive language without it.", text(d, "k3") === "Yes"),
    f("Immediate safety concern reported today", text(d, "s1"), "Safety and Wellbeing.", text(d, "s1") !== "" && text(d, "s1") !== "No"),
    f("Safety answers needing follow up", String(fu), "Any count above zero needs a private conversation before or at the first appointment.", fu > 0),
    f("Family asked for a private conversation", text(d, "o21"), "Our Story.", text(d, "o21") === "Yes"),
    f("Caregiver coping", text(d, "s19"), "Struggling or At breaking point calls for support for the caregiver, not only the child.", ["Struggling", "At breaking point"].includes(text(d, "s19"))),
    f("Enough food, transport money and basic support at home", text(d, "s22"), "A No here is a social work referral.", text(d, "s22") === "No"),
    f("Barriers to attending appointments", text(d, "a30"), "Plan around this or the family will not come back.", !!text(d, "a30"))
  ];
}

// ---------- Home and school compared ----------
/** Matching areas in the school learner profile (the school's own observations, kept by the learner's team). */
export const SCHOOL_MATCH: [string, string[]][] = [
  ["Communication and language", ["Communication & language", "Early communication"]],
  ["Social connection", ["Social interaction", "Play & social participation"]],
  ["Attention, activity and organisation", ["Attention & task engagement", "Classroom routines & executive skills", "Study & organisation", "Executive functioning & independence"]],
  ["Learning", ["Curriculum access", "Emergent literacy & reading", "Writing", "Early numeracy", "Reading to learn", "Extended writing", "Mathematical reasoning"]],
  ["Feelings and regulation", ["Behaviour & emotional regulation", "Adolescent wellbeing & peer context"]],
  ["Behaviour and distress", ["Behaviour & emotional regulation"]],
  ["Movement and physical skills", ["Motor & written output"]],
  ["Daily living and independence", ["Adaptive independence"]],
  ["Taking part in life", ["Attendance & participation"]]
];
export function homeAndSchool(d: Data, school: Record<string, number> | null) {
  const home = areaAverages(d);
  return SCHOOL_MATCH.map(([area, domains]) => {
    const h = home.find(r => r.area === area)?.average ?? null;
    const xs = school ? domains.map(x => school[x]).filter((x): x is number => typeof x === "number") : [];
    const s = xs.length ? Math.round((xs.reduce((a, b) => a + b, 0) / xs.length) * 100) / 100 : null;
    const diff = h !== null && s !== null ? Math.round((h - s) * 100) / 100 : null;
    return { area, home: h, school: s, schoolDomains: domains.join(", "), diff,
      read: diff === null ? "Not enough information yet" : Math.abs(diff) >= 1 ? (diff > 0 ? "Much harder at home than school reports. Ask about masking and demand differences." : "Much harder at school than at home. Ask what differs in the demand.") : "Similar in both settings" };
  });
}

// ---------- Prompts for the team ----------
export function prompts(d: Data, schoolRated: boolean | null): string[] {
  const out: string[] = [], sc = (n: number) => scoreOf(text(d, `d${n}c`)) ?? -1;
  if (text(d, "v2") !== "Done, result normal") out.push("Hearing has not been confirmed. Audiology should precede any conclusion about language, attention or social communication.");
  if (text(d, "v6") !== "Done, result normal") out.push("Vision has not been confirmed. Uncorrected vision can look exactly like a reading difficulty.");
  if (text(d, "v4") === "Yes") out.push("The family reports hearing in quiet but not in noise. Standard audiometry can be normal: consider speech in noise testing.");
  if (text(d, "l1") === "Yes") out.push("Loss of a previously held skill is reported. This warrants paediatric or neurological review as a priority.");
  if (text(d, "h4") === "Yes") out.push("Seizures or episodes are reported. Characterise them before any other conclusion.");
  if (milestonesLate(d)) out.push(`${milestonesLate(d)} milestones are reported later than usual or not yet reached. Read which ones; a count on its own means nothing.`);
  if (sc(97) >= 2 || sc(98) >= 2) out.push("Chewing, swallowing, coughing or choking is reported. Assess swallow safety as a priority.");
  if (sc(10) >= 2 || (text(d, "a7") && text(d, "a9") && text(d, "a7") !== text(d, "a9"))) out.push("Communication may be stronger in another language. Assess in every language used, and never diagnose from a second-language profile alone.");
  if (sc(58) >= 2) out.push("The family reports the person holds it together at school and falls apart at home. Explore masking, and what it costs.");
  if (safetyFollowUps(d).length) out.push("Safety answers need a private conversation before or at the first appointment.");
  if (["Struggling", "At breaking point"].includes(text(d, "s19"))) out.push("A caregiver is struggling. Offer support for the caregiver, not only for the child.");
  if (text(d, "s22") === "No") out.push("The family reports not enough food, transport money or basic support. Refer to a social worker.");
  if (text(d, "k3") === "Yes") out.push("The person uses a device, pictures or signs. Ask the family to bring it; never assess expressive language without it.");
  if (schoolRated === false) out.push("No school observations have been received. The assessment rests on a single setting until they arrive.");
  if (voiceBlank(d)) out.push("In My Own Words is blank. The person being assessed has not been heard from directly. Make a way for that to happen, whatever their communication profile.");
  return out;
}

// ---------- Page 12: How to support me ----------
/** One page for a teacher, a relief teacher, a new therapist or a coach. Health detail and emergency numbers stay with the family. */
export function supportSnapshot(d: Data, nickname: string): Record<string, string> {
  const t = (k: string) => text(d, k);
  const senses = topSenses(d, 3).map(s => `${s.sense}: ${[s.pattern, s.helps && `helps: ${s.helps}`].filter(Boolean).join(", ")}`).join("\n");
  const areas = topDaily(d, 50).filter(i => i.top).slice(0, 3).map(i => i.text).join("\n") || t("o10");
  const device = [t("k3"), t("k4")].filter(Boolean).join(". ");
  const out: Record<string, string> = {
    "My name": nickname, "My age": t("a1"), "Where I am": [t("a13"), t("a14")].filter(Boolean).join(", "), "The language I do best in": t("a7"),
    "What I am good at": t("o2"), "What I enjoy": t("o1"), "What I say I am good at": t("w3"), "What people often get wrong about me": t("o5"),
    "How I communicate best": t("k1"), "Do I use a device, pictures or signs?": device, "How I tell you I need a break": t("k5"), "How to talk to me": t("k8"),
    "What helps me at school": t("w13"), "What has worked best so far": t("r1"), "What does not work": t("r2"),
    "My senses, the three that affect me most": senses, "The first signs that I am becoming overloaded": t("x3"), "What helps me recover, and how long it takes": t("x4"),
    "What I say helps me feel calm": t("w25"), "What makes it worse, please avoid this": t("x5"), "What I need people to stop doing": t("w27"),
    "What I always need with me": t("x6"), "Please never do this": t("x7"), "The three areas we are working on first": areas, "The one thing I most want to be easier": t("w30"),
    "Medical information to be aware of": "Ask the family", "How I show that I am in pain or unwell": t("h8"), "In an emergency, call": "Ask the family"
  };
  return Object.fromEntries(Object.entries(out).filter(([, v]) => v));
}
