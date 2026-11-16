// Veld Balance (Inquiry and Systems Thinking: cause and effect in a system), ported from js/activities/veld.js.
// A living veld: rain grows grass, springbok eat grass, cheetahs eat springbok. The model was tuned so the veld starts
// in balance and each change has a clear, explainable ripple.
export interface Pop { grass: number; buck: number; cheetah: number }
export type Rain = 0 | 1 | 2;
export type Trend = "more" | "fewer" | "same";
export interface VeldQ { change: string; rain: Rain; set: Partial<Pop>; ask: keyof Pop; why: string }

export const VELD_START: Pop = { grass: 24, buck: 24, cheetah: 4 };
export function veldStep(s: Pop, rain: Rain): Pop {
  const fed = s.buck ? Math.min(1, s.grass / (s.buck * 1.5)) : 1;
  const grow = [-8, 18, 30][rain]! * (rain ? 1 - s.grass / 120 : 1);
  const grass = Math.max(0, Math.min(100, Math.round(s.grass + grow - Math.min(s.grass, s.buck * 0.6))));
  const births = Math.round(s.buck * 0.25 * fed), starve = fed < 0.6 ? Math.round(s.buck * (0.6 - fed)) : 0;
  const buck = Math.max(0, s.buck + births - Math.min(s.buck, s.cheetah) - starve);
  const prey = s.buck / Math.max(1, s.cheetah);
  const cheetah = Math.max(0, s.cheetah + (prey >= 7 && s.cheetah > 0 ? 1 : 0) - (prey < 3 ? Math.ceil(s.cheetah / 3) : 0));
  return { grass, buck, cheetah };
}
export function veldRun(start: Pop, rain: Rain, n: number) { const out = [start]; for (let i = 0; i < n; i++) out.push(veldStep(out[i]!, rain)); return out; }
// More, fewer or about the same: the biggest change from the start, so a boom that settles back still counts.
export function veldTrend(series: Pop[], key: keyof Pop): Trend {
  const s0 = Math.max(1, series[0]![key]); let best = 0;
  series.forEach(s => { const d = (s[key] - series[0]![key]) / s0; if (Math.abs(d) > Math.abs(best)) best = d; });
  return best > 0.15 ? "more" : best < -0.15 ? "fewer" : "same";
}
export const VELD_NAMES: Record<keyof Pop, string> = { grass: "grass", buck: "springbok", cheetah: "cheetahs" };
export const VELD_QS: Record<"younger" | "older", VeldQ[]> = {
  younger: [
    { change: "The rain stops for a long time.", rain: 0, set: {}, ask: "buck", why: "With no rain, the grass dries up. The springbok have nothing to eat, so there are fewer of them." },
    { change: "The cheetahs move far away.", rain: 1, set: { cheetah: 0 }, ask: "buck", why: "With no cheetahs hunting them, more springbok survive, so there are more of them, until the grass runs short." }
  ],
  older: [
    { change: "The rain stops for a long time.", rain: 0, set: {}, ask: "cheetah", why: "No rain, so less grass. Fewer springbok can find food. Then the cheetahs go hungry, so there are fewer cheetahs, a few seasons later." },
    { change: "The cheetahs move far away.", rain: 1, set: { cheetah: 0 }, ask: "grass", why: "Without cheetahs, the springbok herd grows. More springbok eat more grass, so there is less grass. One change rippled two steps away." },
    { change: "Lots of rain falls every season.", rain: 2, set: {}, ask: "cheetah", why: "More rain grows more grass. More springbok can be fed, and more springbok means more food for cheetahs." }
  ]
};
export const VB_TREND: Record<Trend, [string, string]> = { more: ["⬆️", "More"], fewer: ["⬇️", "Fewer"], same: ["➡️", "About the same"] };
// The veld, drawn from the numbers: grass tufts, springbok and cheetahs (each shape stands for some animals).
export function veldScene(s: Pop, rain: Rain) {
  const at = (i: number, y0: number, h: number): [number, number] => [14 + ((i * 0.618034) % 1) * 290, y0 + ((i * 0.7548777) % 1) * h]; // golden-ratio spread: even, never clumped
  const tufts = Array.from({ length: Math.round(s.grass / 3) }, (_, i) => { const [x, y] = at(i, 116, 26); return `<path d="M${x} ${y} l-4 -9 M${x} ${y} l0 -11 M${x} ${y} l4 -9" stroke="var(--leaf)" stroke-width="2.4" stroke-linecap="round"/>`; }).join("");
  const bucks = Array.from({ length: Math.min(14, Math.ceil(s.buck / 3)) }, (_, i) => { const [x, y] = at(i + 1, 90, 30); return `<use href="#vbBuck" x="${x - 18}" y="${y - 20}" width="36" height="28"/>`; }).join("");
  const cats = Array.from({ length: Math.min(8, s.cheetah) }, (_, i) => { const [x, y] = at(i + 20, 96, 28); return `<use href="#vbCat" x="${x - 20}" y="${y - 16}" width="40" height="28"/>`; }).join("");
  const sky = rain === 0 ? '<circle cx="270" cy="32" r="20" fill="var(--gold)" stroke="var(--ink)" stroke-width="1.5"/>'
    : `<g fill="var(--surface)" stroke="var(--ink)" stroke-width="1.5"><ellipse cx="80" cy="30" rx="34" ry="14"/><ellipse cx="${rain === 2 ? 200 : 250}" cy="26" rx="30" ry="12"/></g>${rain === 2 ? `<g stroke="var(--shape-c)" stroke-width="2" stroke-linecap="round">${Array.from({ length: 14 }, (_, i) => `<path d="M${50 + i * 13} ${48 + (i % 3) * 6} l-4 10"/>`).join("")}</g>` : '<circle cx="290" cy="28" r="14" fill="var(--gold)" stroke="var(--ink)" stroke-width="1.5"/>'}`;
  return `<svg class="vb-scene" viewBox="0 0 320 150" aria-hidden="true"><defs>
      <symbol id="vbBuck" viewBox="0 0 28 22"><ellipse cx="13" cy="11" rx="9" ry="5" fill="var(--gold-soft)" stroke="var(--ink)" stroke-width="1.4"/><path d="M8 15 v6 M17 15 v6" stroke="var(--ink)" stroke-width="1.6"/><circle cx="23" cy="7" r="3.5" fill="var(--gold-soft)" stroke="var(--ink)" stroke-width="1.4"/><path d="M22 4 q-1 -4 1 -4 M25 4 q1 -4 3 -3" stroke="var(--ink)" stroke-width="1.3" fill="none"/></symbol>
      <symbol id="vbCat" viewBox="0 0 32 22"><ellipse cx="15" cy="11" rx="11" ry="5" fill="var(--gold)" stroke="var(--ink)" stroke-width="1.4"/><circle cx="27" cy="8" r="4" fill="var(--gold)" stroke="var(--ink)" stroke-width="1.4"/><path d="M8 15 v6 M20 15 v6" stroke="var(--ink)" stroke-width="1.6"/><path d="M4 10 q-4 -2 -3 -7" stroke="var(--ink)" stroke-width="1.6" fill="none"/><g fill="var(--ink)"><circle cx="11" cy="9" r="1"/><circle cx="16" cy="12" r="1"/><circle cx="20" cy="9" r="1"/></g></symbol></defs>
    <rect width="320" height="150" fill="var(--sky)"/>${sky}<path d="M0 84 Q80 72 160 82 T320 78 V150 H0 Z" fill="${rain === 0 ? "var(--gold-soft)" : "var(--ok-soft)"}"/>${tufts}${bucks}${cats}</svg>`;
}
// One small chart per population, each with its own line style and marker, so colour is never needed.
export function veldCharts(series: Pop[], n: number) {
  const W2 = 180, H = 40, row = (key: keyof Pop, max: number, style: string, mark: string) => {
    const pts = series.map((s, i): [number, number] => [6 + i * (W2 - 12) / Math.max(1, n - 1), H - 4 - (s[key] / max) * (H - 8)]);
    const m = pts.map(([x, y]) => mark === "c" ? `<circle cx="${x}" cy="${y}" r="2.6"/>` : mark === "s" ? `<rect x="${x - 2.4}" y="${y - 2.4}" width="4.8" height="4.8"/>` : `<path d="M${x} ${y - 3} l3 5 h-6 z"/>`).join("");
    return `<div class="vb-row"><span class="vb-lbl">${{ grass: "🌾 Grass", buck: "🦌 Springbok", cheetah: "🐆 Cheetahs" }[key]}</span>
      <svg viewBox="0 0 ${W2} ${H}" aria-hidden="true"><polyline points="${pts.map(p => p.join(",")).join(" ")}" fill="none" stroke="var(--ink)" stroke-width="2" stroke-dasharray="${style}"/><g fill="var(--ink)">${m}</g></svg>
      <b class="vb-num">${series[series.length - 1]![key]}</b></div>`;
  };
  return `<div class="vb-charts">${row("grass", 100, "", "c")}${row("buck", 50, "6 3", "s")}${row("cheetah", 10, "2 3", "t")}</div>`;
}
export const veldSummary = (s: Pop, season: number) => `Season ${season}: grass ${s.grass} out of 100, ${s.buck} springbok, ${s.cheetah} cheetah${s.cheetah === 1 ? "" : "s"}.`;
