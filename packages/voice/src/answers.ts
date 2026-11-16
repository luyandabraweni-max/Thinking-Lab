import { wordsToNumber } from "./parse";

// Answering lesson questions by speaking (ported from js/support/access.js). Only an extra way to answer.

/** A spoken number as the lessons write it: "twelve" → "12", "three point five" → "3,5", "R 20" → "20". */
export function spokenNumber(said: string): string | null {
  const t = said.toLowerCase().replace(/-/g, " ");
  const d = t.match(/-?\d+([.,]\d+)?/);
  if (d) return d[0].replace(".", ",");
  const [whole = "", frac = ""] = t.split(/\b(?:point|comma)\b/);
  const words = (s: string) => s.split(/\s+/).filter(w => w && wordsToNumber(w) !== null || w === "hundred" || w === "thousand").join(" ");
  const n = wordsToNumber(words(whole));
  if (n === null) return null;
  const f = frac.split(/\s+/).map(w => wordsToNumber(w)).filter((x): x is number => x !== null && x < 10).join("");
  return f ? `${n},${f}` : String(n);
}

const clean = (s: string) => ` ${s.toLowerCase().replace(/[^a-z0-9,]+/g, " ").trim()} `;
const sameNumber = (a: string, b: string) => a.toLowerCase().replace(/\s+/g, "").replace(/^r/, "").replace(/\./g, ",") === b;
const PLACES = [["first", "one", "a", "1"], ["second", "two", "b", "2"], ["third", "three", "c", "3"], ["fourth", "four", "d", "4"]];

/**
 * Which of the choices on screen the learner said: by its words, by its number, or by its place ("the first one",
 * "number two", "B"). `shown` is the order the choices appear in. Returns the choice's index, or null.
 */
export function matchSpoken(heard: string[], options: string[], shown: number[]): number | null {
  for (const h of heard) {
    const said = clean(h);
    let i = shown.find(k => clean(options[k]!) === said);
    if (i !== undefined) return i;
    i = shown.find(k => clean(options[k]!).trim() && said.includes(clean(options[k]!)));
    if (i !== undefined) return i;
    const num = spokenNumber(h);
    if (num !== null) { i = shown.find(k => sameNumber(options[k]!, num)); if (i !== undefined) return i; }
    const words = said.trim().split(" ");
    if (words.length <= 3) {
      const p = PLACES.findIndex(ws => ws.some(w => new RegExp(`\\b(the |number )?${w}( one)?\\b`).test(said.trim())));
      if (p >= 0 && shown[p] !== undefined) return shown[p]!;
    }
  }
  return null;
}
