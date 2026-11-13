// Levels and learning areas, carried over from the live app (js/core/profile.js).
// Age only sets wording and look; level is chosen separately, because age is not a proxy for ability.

export type Cohort = "3-6" | "7-12" | "13-18" | "19-25";
export const COHORTS: Record<Cohort, string> = { "3-6": "3 to 6 years", "7-12": "7 to 12 years", "13-18": "13 to 18 years", "19-25": "19 to 25 years" };
export const COHORT_LEVELS: Record<Cohort, number[]> = { "3-6": [-1, 0], "7-12": [1, 2, 3, 4, 5, 6, 7], "13-18": [7, 8, 9, 10, 11, 12], "19-25": [13] };
export const DEFAULT_LEVEL: Record<Cohort, number> = { "3-6": 0, "7-12": 5, "13-18": 9, "19-25": 13 };
export const ALL_LEVELS = [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
export const levelName = (g: number) => (g === -1 ? "Early years" : g === 0 ? "Grade R" : g === 13 ? "Adult learning" : `Grade ${g}`);
export const packOf = (g: number) => (g === -1 ? "early" : g === 13 ? "adult" : `grade-${g}`);
export const curriculumName = (g: number) => (g === -1 ? "NCF aligned" : g === 13 ? "GETCA and life and work skills" : "CAPS aligned");

// Learning areas group subject names that change between phases, so a learner can work at a different level in each.
export type Area = "maths" | "language" | "life" | "science" | "creative";
export const AREAS: Record<Area, [string, string[]]> = {
  maths: ["Maths", ["Mathematics", "Mathematical Literacy", "Exploring Mathematics"]],
  language: ["Language", ["English Home Language", "English", "Language and Literature", "Communication"]],
  life: ["Life skills", ["Life Skills", "Life Orientation", "Life and work skills", "Identity and Belonging", "Well-being"]],
  science: ["Science and technology", ["Natural Sciences and Technology", "Natural Sciences", "Life Sciences", "Combined Science", "Sciences", "Knowledge and Understanding of the World", "Information and Communication Technology"]],
  creative: ["Creativity", ["Creativity"]]
};
export const areaOf = (subject: string): Area => (Object.keys(AREAS) as Area[]).find(a => AREAS[a][1].includes(subject)) ?? "life";
/** The platform stores age groups as words; the curriculum model uses ranges. */
export const cohortFor = (c: "early" | "child" | "teen" | "adult"): Cohort => ({ early: "3-6", child: "7-12", teen: "13-18", adult: "19-25" } as const)[c];
