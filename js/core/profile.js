"use strict";

// ---------- Learner profile ----------
// Age groups are provisional (to be confirmed with specialists). Age only sets wording and look;
// challenge and answer style are chosen separately, because age is not a proxy for ability.
const COHORTS = { "3-6": "3 to 6 years", "7-12": "7 to 12 years", "13-18": "13 to 18 years", "19-25": "19 to 25 years" };
// Learn levels per age group. -1 = early years (NCF), 0 = Grade R, 1 to 12 = grades, 13 = adult learning.
const COHORT_GRADES = { "3-6": [-1, 0], "7-12": [1, 2, 3, 4, 5, 6, 7], "13-18": [7, 8, 9, 10, 11, 12], "19-25": [13] };
const DEFAULT_GRADE = { "3-6": 0, "7-12": 5, "13-18": 9, "19-25": 13 };
const ALL_LEVELS = [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
function gradeName(g) { return g === -1 ? "Early years" : g === 0 ? "Grade R" : g === 13 ? "Adult learning" : "Grade " + g; }
function cohortGrades() { return COHORT_GRADES[S.cohort] || [4, 5, 6]; }
// The usual level. It starts from the age group but can be any level, because age is not a proxy for level.
function curGrade() { return ALL_LEVELS.includes(S.grade) ? S.grade : (DEFAULT_GRADE[S.cohort] ?? cohortGrades()[0]); }

// Learning areas group subject names that change between phases, so a learner can work at a different
// level in each area (for example D-CAPS: Foundation Phase maths, higher in Life Skills).
const AREAS = {
  maths: ["Maths", ["Mathematics", "Mathematical Literacy", "Exploring Mathematics"]],
  language: ["Language", ["English Home Language", "English", "Communication"]],
  life: ["Life skills", ["Life Skills", "Life Orientation", "Life and work skills", "Identity and Belonging", "Well-being"]],
  science: ["Science and technology", ["Natural Sciences and Technology", "Natural Sciences", "Life Sciences", "Knowledge and Understanding of the World", "Information and Communication Technology"]],
  creative: ["Creativity", ["Creativity"]]
};
const areaOf = subject => Object.keys(AREAS).find(a => AREAS[a][1].includes(subject)) || "life";
const levelFor = area => S.levels[area] ?? curGrade();
const PALETTES = { standard: "Usual colours", redgreen: "Red-green safe colours", blueyellow: "Blue-yellow safe colours" };
const levelOptions =sel => ALL_LEVELS.map(g => `<option value="${g}"${sel === g ? " selected" : ""}>${gradeName(g)}</option>`).join("");
const myUnits =() => UNITS.filter(u => u.grade === levelFor(areaOf(u.subject)));
function curriculumName(g) { return g === -1 ? "NCF aligned" : g === 13 ? "GETCA and life and work skills" : "CAPS aligned"; }
const LEVEL = { younger: "Gentler", older: "More challenging" };
const adultish = () => S.cohort === "13-18" || S.cohort === "19-25";
const W = (kid, grown) => adultish() ? grown : kid;   // respectful wording for older learners
const gameWord = () => W("game", "activity"), gamesWord = () => W("games", "activities");
