import { pick } from "../../kit";

// Describe It (Communication and Expression: saying exactly what you mean), ported from js/activities/describe.js.
// Bolt can't see the picture. The learner chooses clues so Bolt can find their Blip among look-alikes; then they swap
// and the learner follows Bolt's clues.
export type Feature = "body" | "eyes" | "hat" | "skin";
export interface Blip { body: "round" | "tall"; eyes: 1 | 2 | 3; hat: "hat" | "none"; skin: "spots" | "stripes" | "plain" }
export interface Clue { k: Feature; v: string | number; t: string; f: (c: Blip) => boolean }

export const DI_FEATURES: Record<Feature, [string | number, string][]> = {
  body: [["round", "is round"], ["tall", "is tall"]],
  eyes: [[1, "has one eye"], [2, "has two eyes"], [3, "has three eyes"]],
  hat: [["hat", "wears a hat"], ["none", "has no hat"]],
  skin: [["spots", "has spots"], ["stripes", "has stripes"], ["plain", "has no pattern"]]
};
// The same clue said as a "not", which older learners hear from Bolt.
export const DI_NOT: Record<string, string> = { "hat:none": "does NOT wear a hat", "skin:plain": "does NOT have spots or stripes", "body:round": "is NOT tall", "body:tall": "is NOT round" };
export const diClues = (): Clue[] => (Object.entries(DI_FEATURES) as [Feature, [string | number, string][]][]).flatMap(([k, vs]) => vs.map(([v, t]) => ({ k, v, t, f: (c: Blip) => c[k] === v })));
export const diName = (c: Blip) => `a ${c.body} Blip with ${["one eye", "two eyes", "three eyes"][c.eyes - 1]}, ${c.hat === "hat" ? "a hat" : "no hat"} and ${c.skin === "plain" ? "no pattern" : c.skin}`;
// The fewest true clues that pick out the target from the others.
export function diMinClues(target: Blip, all: Blip[]): Clue[] {
  const mine = diClues().filter(c => c.f(target));
  for (let n = 1; n <= mine.length; n++) {
    const combos: Clue[][] = n === 1 ? mine.map(c => [c]) : mine.flatMap((a, i) => n === 2 ? mine.slice(i + 1).map(b => [a, b]) : mine.slice(i + 1).flatMap((b, j) => mine.slice(i + j + 2).map(d => [a, b, d])));
    const hit = combos.find(cs => all.filter(c => cs.every(x => x.f(c))).length === 1); if (hit) return hit;
  }
  return mine;
}
export function diMake(n: number, older: boolean, minNeeded: number) {
  for (let tries = 0; tries < 400; tries++) {
    const set: Blip[] = [];
    while (set.length < n) {
      const c: Blip = { body: pick(["round", "tall"] as const), eyes: pick(older ? [1, 2, 3] as const : [1, 2] as const), hat: pick(["hat", "none"] as const), skin: pick(older ? ["spots", "stripes", "plain"] as const : ["spots", "plain"] as const) };
      if (!set.some(d => d.body === c.body && d.eyes === c.eyes && d.hat === c.hat && d.skin === c.skin)) set.push(c);
    }
    const target = pick(set);
    if (diMinClues(target, set).length >= minNeeded) return { set, target };
  }
  return null;
}
let diId = 0;
export function blip(c: Blip, px: number) {
  const id = "di" + (++diId), body = c.body === "round" ? '<circle cx="20" cy="23" r="14"/>' : '<rect x="10" y="9" width="20" height="29" rx="10"/>';
  const top = 9, ey = c.body === "round" ? 20 : 17, xs = ({ 1: [20], 2: [15, 25], 3: [13, 20, 27] } as Record<number, number[]>)[c.eyes]!;
  const skin = c.skin === "spots" ? '<g fill="var(--ink)" opacity="0.55"><circle cx="13" cy="30" r="2"/><circle cx="26" cy="31" r="2.2"/><circle cx="20" cy="35" r="1.8"/><circle cx="29" cy="25" r="1.6"/></g>'
    : c.skin === "stripes" ? '<g stroke="var(--ink)" stroke-width="2" opacity="0.55"><path d="M4 28 H36 M4 33 H36"/></g>' : "";
  return `<svg width="${px}" height="${px}" viewBox="0 0 40 42" aria-hidden="true"><defs><clipPath id="${id}">${body}</clipPath></defs>
    <g fill="var(--shape-d)" stroke="var(--ink)" stroke-width="1.8">${body}</g><g clip-path="url(#${id})">${skin}</g>
    ${xs.map(x => `<circle cx="${x}" cy="${ey}" r="3.2" fill="var(--surface)" stroke="var(--ink)" stroke-width="1.2"/><circle cx="${x}" cy="${ey + 0.6}" r="1.4" fill="var(--ink)"/>`).join("")}
    <path d="M16 ${ey + 7} Q20 ${ey + 10} 24 ${ey + 7}" stroke="var(--ink)" stroke-width="1.4" fill="none" stroke-linecap="round"/>
    ${c.hat === "hat" ? `<g fill="var(--ink)"><rect x="12" y="${top - 2}" width="16" height="3" rx="1"/><rect x="15" y="${top - 9}" width="10" height="8" rx="1.5"/></g><rect x="15" y="${top - 4}" width="10" height="2" fill="var(--gold)"/>` : ""}</svg>`;
}
