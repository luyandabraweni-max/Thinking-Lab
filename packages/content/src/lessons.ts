import { areaOf, type Area } from "./curriculum";
import type { CatalogueEntry } from "./types";

// Which lessons a learner sees. Most lessons are the shared CAPS-aligned set. Some curricula (Cambridge, IB, CAPS for SID) have their own
// lessons: where those exist for an area and level, the learner sees only them; until they are written, the CAPS
// lessons for that grade stand in. From Grade 10, CAPS and IEB learners take Mathematics or Mathematical Literacy.

/** The curricula a family can choose. Stored as these names. */
export const CURRICULA = ["CAPS", "IEB", "Cambridge", "IB", "CAPS-SID", "D-CAPS", "NCF", "Other"] as const;
export const CURRICULUM_NAME: Record<string, string> = {
  CAPS: "CAPS (public schools)", IEB: "IEB (independent schools)", Cambridge: "Cambridge (IGCSE and international)",
  IB: "IB (International Baccalaureate)", "CAPS-SID": "CAPS for SID (severe intellectual disability)",
  "D-CAPS": "D-CAPS (differentiated)", NCF: "NCF (early years)", Other: "Other or not sure"
};
/** Curricula with lessons of their own (the rest use the shared set). */
const OWN = new Set(["Cambridge", "IB", "CAPS-SID"]);
/** Curricula taught at a functional level rather than by grade: the learner sees all of its lessons up to their level, and
 * CAPS lessons never stand in (CAPS for SID: a Grade 6 learner still works on the Foundation Phase lessons). */
const FUNCTIONAL = new Set(["CAPS-SID"]);
/** Whether a curriculum has lessons of its own (Mathematical Literacy is a choice only in the CAPS-aligned set). */
export const hasOwnLessons = (curriculum?: string | null) => !!curriculum && OWN.has(curriculum);
/** A short name for sentences: "CAPS for SID lessons are on their way". */
export const curriculumShort = (curriculum: string) => (curriculum === "CAPS-SID" ? "CAPS for SID" : curriculum);

export interface LessonChoice { curriculum?: string | null; maths?: "maths" | "lit" | null }
const takesMaths = (u: CatalogueEntry, maths?: "maths" | "lit" | null) =>
  u.subject === "Advanced Programme Mathematics" ? maths !== "lit" // an extra subject for those who take Mathematics
  : !maths || u.grade < 10 || u.grade > 12 || !(u.subject === "Mathematical Literacy" || u.subject === "Mathematics") || (u.subject === "Mathematical Literacy") === (maths === "lit");

/** The lessons for one learning area at one level, and whether they are CAPS lessons standing in for the learner's own. */
export function lessonsIn(all: CatalogueEntry[], area: Area, grade: number, c: LessonChoice): { units: CatalogueEntry[]; standIn: boolean } {
  const inBand = (u: CatalogueEntry) => u.upTo !== undefined && grade >= u.grade && grade <= u.upTo;
  if (c.curriculum && FUNCTIONAL.has(c.curriculum))
    return { units: all.filter(u => u.curriculum === c.curriculum && areaOf(u.subject) === area && (u.upTo !== undefined ? inBand(u) : u.grade <= grade)), standIn: false };
  const here = all.filter(u => areaOf(u.subject) === area && (u.grade === grade || inBand(u)));
  const shared = here.filter(u => !u.curriculum);
  if (hasOwnLessons(c.curriculum)) {
    const own = here.filter(u => u.curriculum === c.curriculum);
    return own.length ? { units: own, standIn: false } : { units: shared, standIn: shared.length > 0 };
  }
  return { units: here.filter(u => (!u.curriculum || u.curriculum === c.curriculum) && takesMaths(u, c.maths)), standIn: false };
}
