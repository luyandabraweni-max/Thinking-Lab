// Light the Village: place mirrors so one beam of sunlight reaches every hut's lamp (ported from js/activities/light.js).
// Each puzzle lists one solution (fix) for the hints; any arrangement that lights every hut counts.
export type Mirror = "/" | "\\";
export type Cell = [number, number];
export interface Puzzle { n: number; from: Cell; dir: Cell; lamps: Cell[]; rocks: Cell[]; fix: [number, number, Mirror][]; title: string }

export const LIGHT_PUZZLES: Record<"younger" | "older", Puzzle[]> = {
  younger: [
    { n: 4, from: [0, -1], dir: [0, 1], lamps: [[3, 2]], rocks: [], fix: [[0, 2, "\\"]], title: "One turn" },
    { n: 4, from: [4, 0], dir: [-1, 0], lamps: [[2, 1], [0, 3]], rocks: [[0, 0]], fix: [[2, 0, "/"], [2, 3, "/"]], title: "Two huts" }
  ],
  older: [
    { n: 6, from: [5, -1], dir: [0, 1], lamps: [[1, 2], [1, 4], [4, 5]], rocks: [[5, 3], [3, 3]], fix: [[5, 1, "/"], [1, 1, "/"], [1, 5, "\\"]], title: "Around the hill" },
    { n: 6, from: [-1, 2], dir: [1, 0], lamps: [[2, 3], [4, 4], [5, 1]], rocks: [[3, 2], [0, 4]], fix: [[2, 2, "\\"], [2, 4, "\\"], [5, 4, "/"]], title: "The long road" }
  ]
};
export interface Trace { path: Cell[]; lit: Set<string>; stop: "out" | "rock"; all: boolean }
/** Follows the beam: a "/" mirror turns it (dr, dc) to (-dc, -dr), a "\" mirror to (dc, dr). Rocks stop it. */
export function lightTrace(pz: Puzzle, mirrors: Record<string, Mirror>): Trace {
  let [r, c] = pz.from, [dr, dc] = pz.dir, stop: Trace["stop"] = "out";
  const path: Cell[] = [[r, c]], lit = new Set<string>();
  for (let k = 0; k < 4 * pz.n * pz.n; k++) {
    r += dr; c += dc; path.push([r, c]);
    if (r < 0 || c < 0 || r >= pz.n || c >= pz.n) break;
    if (pz.rocks.some(x => x[0] === r && x[1] === c)) { stop = "rock"; break; }
    if (pz.lamps.some(x => x[0] === r && x[1] === c)) lit.add(`${r},${c}`);
    const m = mirrors[`${r},${c}`];
    if (m === "/") [dr, dc] = [-dc, -dr]; else if (m === "\\") [dr, dc] = [dc, dr];
  }
  return { path, lit, stop, all: lit.size === pz.lamps.length };
}
export const where = (r: number, c: number) => `row ${r + 1}, column ${c + 1}`;
/** Tapping a square cycles: empty, then /, then \, then empty. */
export const nextMirror = (m: Mirror | undefined): Mirror | undefined => (m === undefined ? "/" : m === "/" ? "\\" : undefined);
