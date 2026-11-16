import type { ChoiceQuestion, NumberQuestion, Question } from "@tl/content";

// The lesson rules, ported from js/learn/lesson.js as pure functions.

/** Answers compare without spaces, case, a leading "R" for rand, or the decimal sign used. */
export const norm = (v: string | number | null | undefined) => String(v ?? "").toLowerCase().replace(/\s+/g, "").replace(/^r/, "").replace(/\./g, ",");

/** Shorter lessons: the first, middle and last question. */
export function pickQuestions<T>(qs: T[], short: boolean): T[] {
  if (!short || qs.length <= 3) return qs;
  return [0, Math.floor(qs.length / 2), qs.length - 1].map(i => qs[i]!);
}

export const shuffle = <T,>(a: readonly T[]): T[] => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j]!, b[i]!]; } return b; };
const rightIndex = (q: ChoiceQuestion | NumberQuestion) => (q.type === "mcq" ? q.answer : (q.options ?? []).findIndex(o => norm(o) === norm(q.answer)));
/** Two choices: the right answer and one other, in a random order. */
export function twoChoices(q: ChoiceQuestion | NumberQuestion, shown: number[]): number[] {
  const right = rightIndex(q), other = shown.find(i => i !== right) ?? (q.options ?? []).findIndex((_, i) => i !== right);
  return shuffle([right, other]);
}

export interface Answer { picked: number | null; typed: string; order: number[]; sortPlace: (number | null)[] }
/** "missing" when the learner hasn't answered yet (with what to tell them), otherwise right or wrong. */
export function check(q: Question, a: Answer, typing: boolean): { missing: string } | { ok: boolean } {
  if (q.type === "mcq" || (q.type === "num" && !typing)) {
    if (a.picked === null) return { missing: "Choose an answer first." };
    return { ok: q.type === "mcq" ? a.picked === q.answer : norm(q.options?.[a.picked]) === norm(q.answer) };
  }
  if (q.type === "num") {
    if (!a.typed.trim()) return { missing: "Type your answer first." };
    return { ok: [q.answer, ...(q.accept ?? [])].some(x => norm(x) === norm(a.typed)) };
  }
  if (q.type === "order") {
    if (a.order.length < q.items.length) return { missing: "Put all of them in order first." };
    return { ok: a.order.every((v, k) => q.items[v] === q.items[k]) }; // by wording, so two identical steps can go either way
  }
  if (a.sortPlace.some(v => v === null)) return { missing: "Sort all of them first." };
  return { ok: a.sortPlace.every((v, i) => v === q.answer[i]) };
}

/** Long texts are shown in short parts. Lesson html comes only from this repo's reviewed content. */
export function passageParts(html: string): { html: string; text: string }[] {
  const t = document.createElement("template"); t.innerHTML = html.trim();
  const box = t.content.querySelector(".passage-text");
  return box ? [...box.children].map(el => ({ html: el.outerHTML, text: (el.textContent ?? "").replace(/\s+/g, " ").trim() })).filter(p => p.text) : [];
}

/** A level name as the portal stores it ("Grade 9", "Grade R") to a level number, or null if it isn't one. */
export function levelFromName(name: string): number | null {
  if (/early years/i.test(name)) return -1;
  if (/grade r\b/i.test(name)) return 0;
  if (/adult/i.test(name)) return 13;
  const m = name.match(/grade\s*(\d+)/i);
  return m ? Number(m[1]) : null;
}
