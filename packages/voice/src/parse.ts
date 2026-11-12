// Turning what was said into what goes in the form. Pure functions, so they are easy to test and to extend
// for other languages.

export type Command = "next" | "back" | "save" | "clear" | "repeat" | "stop" | "yes" | "no";
const COMMANDS: [Command, RegExp][] = [
  ["next", /^(next( one| question)?|skip( it| this)?|go on)$/],
  ["back", /^(back|go back|previous( one| question)?)$/],
  ["save", /^(save( it| this| the form)?|done|finish(ed)?|submit)$/],
  ["clear", /^(clear( it| that)?|delete( it| that)?|start (it )?again|rub (it|that) out)$/],
  ["repeat", /^(repeat( that)?|say (it|that) again|read it again|what|pardon|sorry)$/],
  ["stop", /^(stop|cancel|stop listening)$/],
  ["yes", /^(yes|yeah|yep|correct|that's (right|correct)|right)$/],
  ["no", /^(no|nope|wrong|that's wrong|not right)$/]
];
const clean = (s: string) => s.toLowerCase().replace(/[.,!?]/g, "").replace(/\s+/g, " ").trim();
/** A spoken command, only when the whole utterance is the command (so "next Tuesday" stays an answer). */
export function command(said: string): Command | null {
  const s = clean(said);
  return COMMANDS.find(([, re]) => re.test(s))?.[0] ?? null;
}

const UNITS: Record<string, number> = { zero: 0, oh: 0, one: 1, a: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12,
  thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19 };
const TENS: Record<string, number> = { twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90 };
/** "two hundred and fifty" → 250, "twenty three" → 23. Null if the words aren't a whole number. */
export function wordsToNumber(words: string): number | null {
  const parts = clean(words).replace(/-/g, " ").split(" ").filter(w => w && w !== "and");
  if (!parts.length) return null;
  let total = 0, cur = 0;
  for (const w of parts) {
    if (/^\d+$/.test(w)) cur += Number(w);
    else if (w in UNITS) cur += UNITS[w]!;
    else if (w in TENS) cur += TENS[w]!;
    else if (w === "hundred") cur = (cur || 1) * 100;
    else if (w === "thousand") { total += (cur || 1) * 1000; cur = 0; }
    else return null;
  }
  return total + cur;
}

const NUMBER_WORDS = [...Object.keys(UNITS), ...Object.keys(TENS), "hundred", "thousand", "and"].filter(w => w !== "a" && w !== "oh");
const numberRun = new RegExp(`\\b((?:(?:${NUMBER_WORDS.join("|")}|\\d+)[\\s-]*)+)\\b`, "gi");
const UNIT_WORDS: [RegExp, string][] = [
  [/\bmilligrams?\b|\bmilligrammes?\b|\bmgs?\b/gi, "mg"], [/\bmicrograms?\b|\bmcg\b/gi, "mcg"], [/\bmillilit(?:re|er)s?\b|\bmls?\b/gi, "ml"],
  [/\bgrams?\b/gi, "g"], [/\btablets?\b/gi, "tablet"], [/\bcapsules?\b/gi, "capsule"], [/\bdrops?\b/gi, "drop"], [/\bpuffs?\b/gi, "puff"]
];
/** "fifteen milligrams" → "15 mg", "half a tablet" → "½ tablet", "two drops" → "2 drops". */
export function normaliseDose(said: string): string {
  let s = said.trim().replace(/\bhalf an?\b/gi, "½").replace(/\bone and a half\b/gi, "1½").replace(/\bpoint\b/gi, ".");
  s = s.replace(numberRun, m => { const n = wordsToNumber(m); return n === null ? m : `${n} `; }).replace(/(\d)\s*\.\s*(\d)/g, "$1.$2");
  for (const [re, unit] of UNIT_WORDS) s = s.replace(re, unit);
  s = s.replace(/\s+/g, " ").trim();
  // Plurals for countable units: "2 drop" → "2 drops", but "1 tablet" and "½ tablet" stay singular.
  return s.replace(/\b(\d+(?:\.\d+)?) (tablet|capsule|drop|puff)\b/g, (m, n: string, u: string) => (Number(n) === 1 ? m : `${n} ${u}s`));
}

// Numbers speech recognition easily confuses: "fifteen" and "fifty" sound alike. For a dose, that's dangerous.
const SOUND_ALIKE: Record<number, number> = { 13: 30, 14: 40, 15: 50, 16: 60, 17: 70, 18: 80, 19: 90, 30: 13, 40: 14, 50: 15, 60: 16, 70: 17, 80: 18, 90: 19 };
/** For each number in a dose that has a sound-alike, the pair to check with the person: "15 mg" → [[15, 50]]. */
export function soundAlikes(dose: string): [number, number][] {
  return [...dose.matchAll(/\b(\d+)\b/g)].map(m => Number(m[1])).filter(n => n in SOUND_ALIKE).map(n => [n, SOUND_ALIKE[n]!]);
}
/** "15" → "one five", so the person can confirm digit by digit. */
export const digits = (n: number) => String(n).split("").map(d => ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"][Number(d)]).join(" ");

export type FieldKind = "text" | "name" | "dose" | "long";
/** What goes in a field of this kind, from what was said. */
export function forField(kind: FieldKind, said: string): string {
  const s = said.trim();
  if (!s) return "";
  if (kind === "dose") return normaliseDose(s);
  if (kind === "name") return s.replace(/\b\p{L}/gu, c => c.toUpperCase());
  return s.charAt(0).toUpperCase() + s.slice(1);
}
