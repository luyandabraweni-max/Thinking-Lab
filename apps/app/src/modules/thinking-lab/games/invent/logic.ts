// Invention Workshop (Creativity and Metacognition: designing, testing, improving), ported from js/activities/invent.js.
// Get water from the river to the garden. Many designs work. Each test shows exactly where and why the water stops.
export type Terrain = "flat" | "ditch" | "uphill";
export type PartId = "pipe" | "gutter" | "bucket" | "pump" | "screw";
export type PowerId = "none" | "crank" | "windmill" | "solar";
export interface Part { name: string; cost: number; speed: number; does: string; ok: Terrain[]; power?: boolean }
export interface Rules { noBuckets?: boolean; noWind?: boolean; budget?: number }
export interface Level { segs: Terrain[]; parts: PartId[]; power: boolean; tasks: { title: string; say?: string; rules: Rules }[] }
export type TestResult = { ok?: undefined; at: number; why: string; cost?: number } | { ok: true; cost: number; speed: number };

export const IW_PARTS: Record<PartId, Part> = {
  pipe: { name: "Pipe", cost: 3, speed: 3, does: "Carries water along flat ground and across gaps.", ok: ["flat", "ditch"] },
  gutter: { name: "Gutter", cost: 1, speed: 3, does: "An open channel. Cheap, but only on flat ground.", ok: ["flat"] },
  bucket: { name: "Buckets", cost: 1, speed: 1, does: "People carry water anywhere. Slow and tiring.", ok: ["flat", "ditch", "uphill"] },
  pump: { name: "Pump", cost: 6, speed: 3, does: "Pushes water uphill or along. Needs power.", ok: ["flat", "uphill"], power: true },
  screw: { name: "Water screw", cost: 4, speed: 2, does: "A turning screw that lifts water up a slope. Needs power.", ok: ["uphill"], power: true }
};
export const IW_POWER: Record<PowerId, { name: string; cost: number; slow?: boolean; wind?: boolean }> = { none: { name: "No power", cost: 0 }, crank: { name: "Hand crank", cost: 1, slow: true }, windmill: { name: "Windmill", cost: 5, wind: true }, solar: { name: "Solar panel", cost: 8 } };
export const IW_WHY: Record<string, Record<string, string>> = {
  ditch: { gutter: "The gutter is open underneath, so the water pours into the ditch.", pump: "A pump can't hold water up across a gap. Something has to carry it over.", screw: "A water screw only lifts water up a slope. It can't cross a gap." },
  uphill: { pipe: "Water won't flow uphill by itself. It runs back down!", gutter: "Water won't flow uphill in a gutter. It runs back down!" },
  flat: { screw: "A water screw lifts water up slopes. On flat ground it just spins." }
};
export const IW_TERRAIN: Record<Terrain, string> = { flat: "flat ground", ditch: "a ditch", uphill: "a slope going up" };
// Follows the water from the river: the first part that can't do its job (or has no power) stops it, with the reason.
export function iwTest(segs: Terrain[], parts: (PartId | null)[], power: PowerId, rules: Rules): TestResult {
  for (let i = 0; i < segs.length; i++) {
    const id = parts[i], p = id ? IW_PARTS[id] : undefined;
    if (!id || !p) return { at: i, why: "There's a gap here, so the water spills out." };
    if (rules.noBuckets && id === "bucket") return { at: i, why: "No buckets this time. The water has to flow by itself." };
    if (!p.ok.includes(segs[i]!)) return { at: i, why: (IW_WHY[segs[i]!] || {})[id] || `The ${p.name.toLowerCase()} can't cross ${IW_TERRAIN[segs[i]!]}.` };
    if (p.power && power === "none") return { at: i, why: `The ${p.name.toLowerCase()} needs power. Nothing is turning it.` };
    if (p.power && power === "windmill" && rules.noWind) return { at: i, why: "There's no wind today, so the windmill doesn't turn." };
  }
  const ps = parts as PartId[]; // every part is in place once the loop above passes
  const cost = ps.reduce((s, id) => s + IW_PARTS[id].cost, 0) + (ps.some(id => IW_PARTS[id].power) ? IW_POWER[power].cost : 0);
  if (rules.budget && cost > rules.budget) return { at: -1, why: `It works, but it costs ${cost} coins. The budget is ${rules.budget}.`, cost };
  const slow = ps.some(id => id === "bucket") || (power === "crank" && ps.some(id => IW_PARTS[id].power));
  return { ok: true, cost, speed: Math.min(...ps.map(id => IW_PARTS[id].speed)) - (slow && power === "crank" ? 1 : 0) };
}
export const IW_ICON: Record<PartId | PowerId, string> = {
  pipe: '<rect x="4" y="15" width="32" height="10" rx="3" fill="var(--muted)" stroke="var(--ink)" stroke-width="2"/><path d="M8 15 V25 M32 15 V25" stroke="var(--ink)" stroke-width="2"/>',
  gutter: '<path d="M4 14 Q20 34 36 14" fill="none" stroke="var(--ink)" stroke-width="6" stroke-linecap="round"/><path d="M4 14 Q20 34 36 14" fill="none" stroke="var(--gold-soft)" stroke-width="2.5" stroke-linecap="round"/>',
  bucket: '<path d="M10 14 H30 L27 34 H13 Z" fill="var(--shape-b)" stroke="var(--ink)" stroke-width="2" stroke-linejoin="round"/><path d="M10 14 Q20 2 30 14" fill="none" stroke="var(--ink)" stroke-width="2"/>',
  pump: '<rect x="11" y="14" width="18" height="20" rx="3" fill="var(--shape-a)" stroke="var(--ink)" stroke-width="2"/><path d="M20 14 V5 H32" stroke="var(--ink)" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="20" cy="24" r="4" fill="var(--surface)" stroke="var(--ink)" stroke-width="1.5"/>',
  screw: '<g transform="rotate(-30 20 20)"><rect x="17" y="3" width="6" height="34" rx="2" fill="var(--muted)" stroke="var(--ink)" stroke-width="1.5"/><path d="M12 8 L28 12 M12 15 L28 19 M12 22 L28 26 M12 29 L28 33" stroke="var(--ink)" stroke-width="2.5" stroke-linecap="round"/></g>',
  none: '<circle cx="20" cy="20" r="12" fill="none" stroke="var(--muted)" stroke-width="2" stroke-dasharray="4 3"/>',
  crank: '<circle cx="20" cy="20" r="11" fill="none" stroke="var(--ink)" stroke-width="3"/><path d="M20 20 L29 11 L34 15" stroke="var(--ink)" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="20" cy="20" r="3" fill="var(--ink)"/>',
  windmill: '<path d="M20 20 L20 38" stroke="var(--ink)" stroke-width="3"/><g class="iw-blades" fill="var(--surface)" stroke="var(--ink)" stroke-width="1.6"><path d="M20 20 L14 3 L22 5 Z"/><path d="M20 20 L37 14 L35 22 Z"/><path d="M20 20 L26 37 L18 35 Z"/><path d="M20 20 L3 26 L5 18 Z"/></g><circle cx="20" cy="20" r="2.5" fill="var(--ink)"/>',
  solar: '<path d="M6 26 L14 8 H34 L26 26 Z" fill="var(--shape-c)" stroke="var(--ink)" stroke-width="2" stroke-linejoin="round"/><path d="M10 17 H30 M20 8 L16 26" stroke="var(--surface)" stroke-width="1.5"/><path d="M20 26 V36 M14 36 H26" stroke="var(--ink)" stroke-width="2.5"/>'
};
export const iwIcon = (id: PartId | PowerId, px: number) => `<svg width="${px}" height="${px}" viewBox="0 0 40 40" aria-hidden="true">${IW_ICON[id]}</svg>`;
export const IW_GROUND: Record<Terrain, string> = { flat: "M0 44 H80", ditch: "M0 34 H22 Q40 70 58 34 H80", uphill: "M0 52 L80 18" };
export const IW_LEVELS: Record<"younger" | "older", Level> = {
  younger: { segs: ["flat", "ditch", "flat"], parts: ["pipe", "gutter", "bucket"], power: false,
    tasks: [{ title: "Get water to the garden", rules: {} }, { title: "Make it flow by itself", say: "Carrying buckets is slow and tiring. Can you make the water flow all the way by itself?", rules: { noBuckets: true } }] },
  older: { segs: ["flat", "uphill", "ditch", "uphill"], parts: ["pipe", "gutter", "bucket", "pump", "screw"], power: true,
    tasks: [{ title: "Get water to the garden", rules: {} }, { title: "No wind, small budget", say: "The wind has stopped, and you only have 20 coins. Can you still get water to the garden, with no buckets?", rules: { noWind: true, budget: 20, noBuckets: true } }] }
};
