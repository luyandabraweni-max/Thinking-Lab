import { ALL_LEVELS, AREAS, areaOf, CATALOGUE, DEFAULT_LEVEL, levelName, type Area, type Cohort } from "@tl/content";

// The adaptation layer, ported from the live app (js/core/adapt.js) as pure functions: everything comes in as
// arguments, so the same rules run on the device during a session and anywhere else that needs them.
// It responds to what the learner does, not to a label. Every threshold is PROVISIONAL until specialists review it
// (docs/adaptation-rules.md). Changes for the learner are gentle and undoable; level changes are only ever suggested.
export const ADAPT = {
  window: 3, minQs: 6, helpShare: 0.6, skips: 3, breakDays: 2, breakEvery: 4,
  easierOf: 6, easierMin: 3, quickMs: 3000, quickMin: 2,
  moreQs: 8, moreShare: 0.8, lessQs: 6, lessShare: 0.5, minDays: 2, snoozeDays: 14
} as const;
export type Rule = "sooner" | "shorter" | "breaks" | "fewer";
export const ADAPT_NAMES: Record<Rule, string> = { sooner: "Help is offered sooner", shorter: "Shorter lessons (3 questions)", breaks: `A break is offered every ${ADAPT.breakEvery} questions`, fewer: "Questions start with 2 choices" };

export type Status = "alone" | "support" | "notyet" | "open";
/** e: chose "make it easier"; a: started with fewer choices; s: moved on without an answer; b: chose a break; q: quick wrong answers. */
export interface Flags { e?: 1; a?: 1; s?: 1; b?: 1; q?: number }
/** One answered question: [date, activity id, status, answer mode, hints, what the learner said, support flags]. */
export type Row = [date: string, id: string, status: Status, mode: string, hints: number, reflection: string, flags?: Flags];

/** What happened on one question during a session. */
export interface ItemRecord {
  open?: boolean; movedOn?: boolean; firstMatched?: boolean | null; latestMatched?: boolean | null; hints?: number;
  exampleOpened?: boolean; easier?: boolean; autoEasier?: boolean; adapt?: "break"; quick?: number; mode?: string;
}

export function statusOf(it: ItemRecord): Status {
  if (it.open) return it.movedOn ? "notyet" : "open";
  if (it.movedOn || !it.latestMatched) return "notyet";
  if (it.firstMatched && !it.hints && !it.exampleOpened && !it.easier) return "alone";
  return "support";
}
export function rowFlags(it: ItemRecord): Flags | undefined {
  const f: Flags = {};
  if (it.easier && !it.autoEasier) f.e = 1;
  if (it.autoEasier) f.a = 1;
  if (it.movedOn) f.s = 1;
  if (it.adapt === "break") f.b = 1;
  if (it.quick) f.q = it.quick;
  return Object.keys(f).length ? f : undefined;
}
export const today = () => new Date().toISOString().slice(0, 10);
export function toRow(it: ItemRecord, id: string, reflection = "", date = today()): Row {
  const r: Row = [date, id, statusOf(it), it.mode ?? "tap", it.hints ?? 0, reflection], f = rowFlags(it);
  if (f) r.push(f);
  return r;
}

const flagsOf = (r: Row): Flags => r[6] ?? {};
const unitOf = (id: string) => CATALOGUE.find(u => u.id === id);
const inArea = (r: Row, a: Area, level?: number) => { const u = unitOf(r[1]); return !!u && areaOf(u.subject) === a && (level === undefined || u.grade === level); };
/** Answered questions from the last n session days (open-ended ideas have no right answer, so they don't count). */
function recentRows(rows: Row[], n: number) {
  const qs = rows.filter(r => r[2] !== "open"), days = [...new Set(qs.map(r => r[0]))].sort().slice(-n);
  return qs.filter(r => days.includes(r[0]));
}

export interface Adaptations { sooner?: string; shorter?: string; breaks?: string; fewer: Partial<Record<Area, string>> }
/** What the platform changes for the learner, each with the reason an adult will see. */
export function adaptFor(rows: Row[]): Adaptations {
  const recent = recentRows(rows, ADAPT.window), out: Adaptations = { fewer: {} };
  const helped = recent.filter(r => r[4] > 0 || flagsOf(r).e || flagsOf(r).s).length;
  if (recent.length >= ADAPT.minQs && helped / recent.length >= ADAPT.helpShare) out.sooner = `help was used on ${helped} of the last ${recent.length} questions`;
  const skips = recent.filter(r => flagsOf(r).s).length, breakDays = new Set(recent.filter(r => flagsOf(r).b).map(r => r[0])).size;
  if (skips >= ADAPT.skips) out.shorter = `moved on without an answer ${skips} times in recent sessions`;
  if (breakDays >= ADAPT.breakDays) out.breaks = `chose a break on ${breakDays} recent days`;
  for (const a of Object.keys(AREAS) as Area[]) {
    const ar = rows.filter(r => r[2] !== "open" && inArea(r, a)).slice(-ADAPT.easierOf), n = ar.filter(r => flagsOf(r).e).length;
    if (n >= ADAPT.easierMin) out.fewer[a] = `chose "make it easier" on ${n} of the last ${ar.length} ${AREAS[a][0].toLowerCase()} questions`;
  }
  return out;
}
/** Removes the rules an adult switched off for this learner. */
export function withoutOff(a: Adaptations, off: Partial<Record<Rule, boolean>> = {}): Adaptations {
  const out: Adaptations = { ...a, fewer: off.fewer ? {} : a.fewer };
  for (const k of ["sooner", "shorter", "breaks"] as const) if (off[k]) delete out[k];
  return out;
}
export interface AdaptSettings { auto: boolean; off?: Partial<Record<Rule, boolean>> }
/** During a session: earlier sessions plus today's work. Nothing changes when an adult turned automatic changes off. */
export const adaptLive = (rows: Row[], s: AdaptSettings): Adaptations => (s.auto ? withoutOff(adaptFor(rows), s.off) : { fewer: {} });
/** For adults: each change that is on now, with its reason. */
export function adaptList(rows: Row[], off?: AdaptSettings["off"]): [string, string][] {
  const a = withoutOff(adaptFor(rows), off), out: [string, string][] = [];
  for (const k of ["sooner", "shorter", "breaks"] as const) if (a[k]) out.push([ADAPT_NAMES[k], a[k]!]);
  for (const [ar, why] of Object.entries(a.fewer) as [Area, string][]) out.push([`${ADAPT_NAMES.fewer} in ${AREAS[ar][0].toLowerCase()}`, why]);
  return out;
}

export interface LevelSuggestion { key: string; area: Area; to: number; text: string; why: string }
export interface LearnerLevels { rows: Row[]; cohort: Cohort; level?: number; levels?: Partial<Record<Area, number>>; decisions?: Record<string, { d: "yes" | "no"; at: number }> }
/** A change of level in one learning area, with its evidence. Never applied without an adult choosing it. */
export function levelSuggestions(L: LearnerLevels, now = Date.now()): LevelSuggestion[] {
  const out: LevelSuggestion[] = [], dec = L.decisions ?? {};
  const nearest = (a: Area, g: number, step: number) => {
    for (let i = ALL_LEVELS.indexOf(g) + step; i >= 0 && i < ALL_LEVELS.length; i += step) if (CATALOGUE.some(u => u.grade === ALL_LEVELS[i] && areaOf(u.subject) === a)) return ALL_LEVELS[i]!;
    return null;
  };
  for (const a of Object.keys(AREAS) as Area[]) {
    const g = L.levels?.[a] ?? L.level ?? DEFAULT_LEVEL[L.cohort], name = AREAS[a][0].toLowerCase();
    const ar = L.rows.filter(r => r[2] !== "open" && inArea(r, a, g));
    if (new Set(ar.map(r => r[0])).size < ADAPT.minDays) continue;
    const more = ar.slice(-ADAPT.moreQs), alone = more.filter(r => r[2] === "alone").length, up = nearest(a, g, 1);
    if (more.length >= ADAPT.moreQs && alone / more.length >= ADAPT.moreShare && up !== null)
      out.push({ key: `up:${a}:${g}`, area: a, to: up, text: `Ready for more in ${name}: try ${levelName(up)}`, why: `${alone} of the last ${more.length} ${name} questions at ${levelName(g)} were answered without support, on different days.` });
    const less = ar.slice(-ADAPT.lessQs), hard = less.filter(r => r[2] === "notyet" || flagsOf(r).e).length, down = nearest(a, g, -1);
    if (less.length >= ADAPT.lessQs && hard / less.length >= ADAPT.lessShare && down !== null)
      out.push({ key: `down:${a}:${g}`, area: a, to: down, text: `${AREAS[a][0]} may be too hard right now: try ${levelName(down)}`, why: `On ${hard} of the last ${less.length} ${name} questions at ${levelName(g)}, the answer wasn't shown yet or the learner asked for it to be made easier.` });
  }
  return out.filter(s => !dec[s.key] || (dec[s.key]!.d === "no" && now - dec[s.key]!.at > ADAPT.snoozeDays * 864e5));
}
/** The support used on one question, in words for adults. */
export function supportText(r: Row) {
  const f = flagsOf(r);
  return [r[4] ? `${r[4]} hint${r[4] > 1 ? "s" : ""}` : "", f.e ? "made easier" : "", f.a ? "started with fewer choices" : "", f.s ? "moved on" : "", f.b ? "took a break" : "", f.q ? "answered very quickly" : ""].filter(Boolean).join(", ") || "None";
}
