import type { Row } from "@tl/adaptation";

// Development over time (ported from js/portal/charts.js and developmentHtml in js/portal/team.js).
// Counts activities, not marks: "not yet" is part of learning. It describes activities, not ability.
export const CHART_KINDS = [["alone", "Shown without support"], ["support", "Shown with support"], ["notyet", "Not yet shown"], ["open", "Idea shared"]] as const;
export type ChartKind = (typeof CHART_KINDS)[number][0];
export type Week = { week: string } & Record<ChartKind, number>;
export const CHART_WEEKS = 8;

/** The Monday of the week an ISO date falls in. */
export function weekStart(iso: string) {
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number), t = new Date(Date.UTC(y!, m! - 1, d));
  t.setUTCDate(t.getUTCDate() - (t.getUTCDay() + 6) % 7);
  return t.toISOString().slice(0, 10);
}
export const weekTotal = (w: Week) => CHART_KINDS.reduce((n, [k]) => n + w[k], 0);

/** The most recent weeks that had any activity, oldest first. */
export function weeklyCounts(rows: Row[], weeks = CHART_WEEKS): Week[] {
  const by: Record<string, Week> = {};
  for (const r of rows) {
    const w = weekStart(r[0]), x = (by[w] ??= { week: w, alone: 0, support: 0, notyet: 0, open: 0 });
    if (r[2] in x) x[r[2] as ChartKind]++;
  }
  return Object.values(by).sort((a, b) => a.week.localeCompare(b.week)).slice(-weeks);
}

/** For each domain and month: how many activities, and how many done on their own. */
export function domainMonths(rows: Row[], domainOf: (id: string) => string | undefined, domains: readonly string[]) {
  const months = [...new Set(rows.filter(r => domainOf(r[1])).map(r => r[0].slice(0, 7)))].sort();
  const cells = domains.map(d => ({ domain: d, months: months.map(m => {
    const rs = rows.filter(r => r[0].startsWith(m) && domainOf(r[1]) === d);
    return { month: m, total: rs.length, alone: rs.filter(r => r[2] === "alone").length };
  }) }));
  return { months, cells };
}
const SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const monthName = (m: string) => `${SHORT[Number(m.slice(5, 7)) - 1]} ${m.slice(0, 4)}`;
export const shortDate = (iso: string) => `${Number(iso.slice(8, 10))} ${SHORT[Number(iso.slice(5, 7)) - 1]}`;

export interface TimelineEvent { date: string; icon: string; text: string }
export interface TimelineInput {
  rows: Row[];
  goals: { id: string; text: string }[];
  observations: { goalId: string; level: "notyet" | "support" | "alone"; note: string; at: string }[];
  changes: { date: string; text: string; by: string }[];
  notes: { at: string; by: string; body: string }[]; // already filtered for the viewer
  health?: { at: string; text: string }[]; // only when the viewer may see health records
}
const LEVEL = { notyet: "not yet", support: "with support", alone: "on their own" };

/** Everything that happened, newest first. */
export function timeline(t: TimelineInput, limit = 25): TimelineEvent[] {
  const goal = (id: string) => t.goals.find(g => g.id === id)?.text ?? "a goal";
  const days = [...new Set(t.rows.map(r => r[0]))];
  return ([] as TimelineEvent[]).concat(
    t.observations.map(o => ({ date: o.at.slice(0, 10), icon: "◐", text: `Goal "${goal(o.goalId)}": ${LEVEL[o.level]}${o.note ? `. ${o.note}` : ""}` })),
    t.changes.map(c => ({ date: c.date.slice(0, 10), icon: "⚙️", text: `${c.text} (${c.by})` })),
    t.notes.map(n => ({ date: n.at.slice(0, 10), icon: "📝", text: `${n.by}: ${n.body}` })),
    (t.health ?? []).map(h => ({ date: h.at.slice(0, 10), icon: "💊", text: h.text })),
    days.map(d => { const n = t.rows.filter(r => r[0] === d).length; return { date: d, icon: "🧠", text: `Session: ${n} activit${n === 1 ? "y" : "ies"}` }; })
  ).sort((a, b) => b.date.localeCompare(a.date)).slice(0, limit);
}
