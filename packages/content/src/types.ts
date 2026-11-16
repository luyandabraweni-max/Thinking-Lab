// The lesson format (docs/system-design.md, section 5). Lessons are data, exported from the live site by tools/export-content.mjs.
// Lesson html and passages come only from this repo's reviewed content, never from users.

export interface LessonPage { h: string; say: string; html: string }
interface QuestionBase { q: string; hints: string[]; explain: string; html?: string }
export interface ChoiceQuestion extends QuestionBase { type: "mcq"; options: string[]; answer: number; fixed?: boolean; pics?: string[]; open?: boolean }
export interface NumberQuestion extends QuestionBase { type: "num"; answer: string; options?: string[]; accept?: string[]; unitLabel?: string }
export interface OrderQuestion extends QuestionBase { type: "order"; items: string[]; orderLabel?: string }
export interface SortQuestion extends QuestionBase { type: "sort"; items: string[]; bins: string[]; answer: number[] }
export type Question = ChoiceQuestion | NumberQuestion | OrderQuestion | SortQuestion;

export interface Unit {
  id: string;
  grade: number; // -1 early years, 0 Grade R, 1 to 12 grades, 13 adult learning
  subject: string;
  title: string;
  topic: string;
  domain: string;
  category: string;
  caps: string;
  intention: string;
  prompt: string;
  lesson: LessonPage[];
  example: { q: string; steps: string[] };
  questions: Question[];
  reflect: { q: string; options: string[] };
  parent: string;
  teacher: string;
  done: string;
  passage?: string;
  /** Lessons written for one curriculum only, such as Cambridge IGCSE. No tag: the shared CAPS-aligned set. */
  curriculum?: string;
  /** Lessons for an age band rather than one grade (CAPS for SID work readiness): shown from `grade` up to this level. */
  upTo?: number;
}
export type CatalogueEntry = Pick<Unit, "id" | "grade" | "subject" | "title" | "topic" | "domain" | "category" | "caps" | "curriculum" | "upTo"> & { pack: string };
export interface WordHelp { words?: [string, string, string][]; phrases?: [string, string][] }
export interface Pack { level: string; units: Unit[]; words: Record<string, WordHelp> }
