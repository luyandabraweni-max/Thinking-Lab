import { esc } from "../../kit";

// The Secret Rule Machine (Inquiry and Systems Thinking: investigating), ported from js/activities/rule.js.
// The machine lights up for some objects and not others. The learner builds objects, tests them, works out the hidden
// rule, then proves it by predicting.
export interface Obj { shape: "circle" | "triangle" | "square" | "star"; fill: "solid" | "striped" | "dotted"; size: "big" | "small" }
export interface Rule { text: string; about: string; f: (o: Obj) => boolean }
export type MachineState = "idle" | "think" | "yes" | "no";

export const RM_SHAPES: [Obj["shape"], string][] = [["circle", "Circle"], ["triangle", "Triangle"], ["square", "Square"], ["star", "Star"]];
export const RM_FILLS: [Obj["fill"], string][] = [["solid", "Plain"], ["striped", "Stripes"], ["dotted", "Dots"]];
export const RM_SIZES: [Obj["size"], string][] = [["big", "Big"], ["small", "Small"]];
export const RM_RULES: Record<"younger" | "older", Rule[]> = {
  younger: [
    { text: "It is round", about: "its shape", f: (o: Obj) => o.shape === "circle" },
    { text: "It has stripes", about: "its pattern", f: (o: Obj) => o.fill === "striped" },
    { text: "It is big", about: "its size", f: (o: Obj) => o.size === "big" },
    { text: "It has dots", about: "its pattern", f: (o: Obj) => o.fill === "dotted" },
    { text: "It is a triangle", about: "its shape", f: (o: Obj) => o.shape === "triangle" }
  ],
  older: [
    { text: "It is big and has corners", about: "its size and its shape", f: (o: Obj) => o.size === "big" && o.shape !== "circle" },
    { text: "It is a star, or it has dots", about: "its shape or its pattern", f: (o: Obj) => o.shape === "star" || o.fill === "dotted" },
    { text: "It is small and has no stripes", about: "its size and its pattern", f: (o: Obj) => o.size === "small" && o.fill !== "striped" },
    { text: "It has corners but is not a square", about: "its shape only", f: (o: Obj) => o.shape === "triangle" || o.shape === "star" },
    { text: "It is round or it has stripes", about: "its shape or its pattern", f: (o: Obj) => o.shape === "circle" || o.fill === "striped" }
  ]
};
export const RM_ALL: Obj[] = RM_SHAPES.flatMap(([shape]) => RM_FILLS.flatMap(([fill]) => RM_SIZES.map(([size]) => ({ shape, fill, size }))));
export const rmSame = (a: Obj, b: Obj) => a.shape === b.shape && a.fill === b.fill && a.size === b.size;
export const rmDiff = (a: Obj, b: Obj) => (["shape", "fill", "size"] as const).filter(k => a[k] !== b[k]).length;
export const rmName = (o: Obj) => `${o.size} ${{ solid: "plain", striped: "striped", dotted: "dotted" }[o.fill]} ${o.shape}`;
let rmId = 0;
// An object, drawn so colour is never the only cue: each pattern also has its own texture.
export function rmToken(o: Obj, px: number, label?: string) {
  const id = "rm" + (++rmId), col = { solid: "var(--shape-a)", striped: "var(--shape-b)", dotted: "var(--shape-c)" }[o.fill];
  const fill = o.fill === "solid" ? col : `url(#${id})`, k = o.size === "big" ? 1 : 0.62, t = `translate(${20 - 20 * k} ${20 - 20 * k}) scale(${k})`;
  const shape = { circle: '<circle cx="20" cy="20" r="16"/>', triangle: '<path d="M20 3 L37 35 H3 Z"/>', square: '<rect x="5" y="5" width="30" height="30" rx="3"/>',
    star: '<path d="M20 2 L25 14 L38 15 L28 24 L31 37 L20 30 L9 37 L12 24 L2 15 L15 14 Z"/>' }[o.shape];
  return `<svg class="rm-tok" width="${px}" height="${px}" viewBox="0 0 40 40" ${label ? `role="img" aria-label="${esc(label)}"` : 'aria-hidden="true"'}>
    <defs>${o.fill === "striped" ? `<pattern id="${id}" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="6" height="6" fill="var(--surface)"/><rect width="3" height="6" fill="${col}"/></pattern>`
      : o.fill === "dotted" ? `<pattern id="${id}" width="7" height="7" patternUnits="userSpaceOnUse"><rect width="7" height="7" fill="var(--surface)"/><circle cx="3.5" cy="3.5" r="2.2" fill="${col}"/></pattern>` : ""}</defs>
    <g transform="${t}" fill="${fill}" stroke="var(--ink)" stroke-width="2" stroke-linejoin="round">${shape}</g></svg>`;
}
export const rmMachine = (o: Obj | null, state: MachineState) => `<svg class="rm-machine ${state}" viewBox="0 0 220 180" aria-hidden="true">
    <path d="M70 6 H150 L128 40 H92 Z" fill="var(--brand-soft)" stroke="var(--ink)" stroke-width="3" stroke-linejoin="round"/>
    <rect x="30" y="40" width="160" height="120" rx="18" fill="var(--brand)" stroke="var(--ink)" stroke-width="3"/>
    <rect x="52" y="58" width="74" height="74" rx="12" fill="var(--surface)" stroke="var(--ink)" stroke-width="3"/>
    ${o ? `<g transform="translate(59 65)">${rmToken(o, 60).replace('class="rm-tok"', 'class="rm-tok in"')}</g>` : ""}
    <g transform="translate(158 82)"><g class="gear g1"><circle r="14" fill="var(--gold)" stroke="var(--ink)" stroke-width="2.5"/><circle r="4" fill="var(--ink)"/><path d="M0 -20 V-12 M0 12 V20 M-20 0 H-12 M12 0 H20 M-14 -14 L-9 -9 M9 9 L14 14 M-14 14 L-9 9 M9 -9 L14 -14" stroke="var(--ink)" stroke-width="5"/></g></g>
    <g transform="translate(158 124)"><g class="gear g2"><circle r="10" fill="var(--gold-soft)" stroke="var(--ink)" stroke-width="2.5"/><circle r="3" fill="var(--ink)"/><path d="M0 -15 V-9 M0 9 V15 M-15 0 H-9 M9 0 H15" stroke="var(--ink)" stroke-width="4"/></g></g>
    <g transform="translate(186 26)"><g class="bulb"><g class="rays" stroke="var(--gold)" stroke-width="3" stroke-linecap="round"><path d="M0 -24 V-18 M-20 -14 L-15 -10 M20 -14 L15 -10 M-24 4 H-18 M24 4 H18"/></g>
      <circle r="14" cy="2" fill="${state === "yes" ? "var(--gold)" : "var(--line)"}" stroke="var(--ink)" stroke-width="3"/><rect x="-7" y="15" width="14" height="9" rx="2" fill="var(--muted)" stroke="var(--ink)" stroke-width="2"/></g></g>
    <rect x="52" y="140" width="74" height="16" rx="5" fill="var(--surface)" stroke="var(--ink)" stroke-width="2"/>
    <text x="89" y="152.5" text-anchor="middle" font-size="12" font-weight="700" fill="var(--ink)">${state === "yes" ? "YES!" : state === "no" ? "NO" : state === "think" ? "..." : "READY"}</text></svg>`;
