import type { Row } from "@tl/adaptation";
import type { ActivityInfo } from "./types";

// Strength signals, then the agreed levels: Early, Growing, Consistent (pending expert review). From js/screens/dashboard.js.
const modeGroup = (m: string) => (({ choose: "choose", chose: "choose", predicted: "choose", listened: "choose", "answered then rated": "choose", "tested objects": "choose", described: "choose",
  build: "build", "placed mirrors": "build", "built a program": "build", designed: "build", drew: "draw" }) as Record<string, string>)[m] ?? null;

export interface Strength { key: string; label: string; suggestion: string; level: "Early" | "Growing" | "Consistent"; evidence: string; rows: Row[] }
export function strengths(rows: Row[], activity: (id: string) => ActivityInfo | undefined): Strength[] {
  const sig: Record<string, { key: string; label: string; suggestion: string; rows: Row[] }> = {};
  const add = (key: string, label: string, suggestion: string, row: Row) => { (sig[key] ??= { key, label, suggestion, rows: [] }).rows.push(row); };
  for (const r of rows) {
    const x = activity(r[1]); if (!x) continue;
    if (r[2] === "alone") add(`dom:${x.domain}`, `Works independently in ${x.domain}`, `Offer a more challenging level in ${x.domain}`, r);
    if (r[2] === "support" && r[4] > 0) add("hints", "Makes good use of hints", "Keep hints visible and offer the first one early", r);
    if (r[2] === "open") add("ideas", "Shares original ideas", "Offer open-ended choices, like drawing an answer", r);
    const g = modeGroup(r[3]);
    if (g && (r[2] === "alone" || r[2] === "support")) add(`mode:${g}`, `Succeeds when ${g === "draw" ? "drawing" : g === "build" ? "building answers step by step" : "choosing from pictures"}`, `Offer ${g === "draw" ? "the drawing answer" : g === "build" ? "the build-it answer" : "picture choices"} first`, r);
  }
  const order = ["Consistent", "Growing", "Early"];
  return Object.values(sig).map(s => {
    const sessions = new Set(s.rows.map(r => r[0])).size, acts = new Set(s.rows.map(r => r[1])).size;
    const level: Strength["level"] = sessions >= 5 && acts >= 2 ? "Consistent" : sessions >= 3 && sessions >= 2 ? "Growing" : "Early";
    return { ...s, level, evidence: `${s.rows.length} time${s.rows.length > 1 ? "s" : ""} in ${sessions} session${sessions > 1 ? "s" : ""}, across ${acts} activit${acts > 1 ? "ies" : "y"}` };
  }).sort((a, b) => order.indexOf(a.level) - order.indexOf(b.level) || b.rows.length - a.rows.length);
}
