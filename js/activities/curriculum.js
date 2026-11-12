"use strict";

// ---------- Curriculum links (Version A, proposed, awaiting specialist confirmation) ----------
// Ages 3-4: NCF birth to four. Ages 5-18: CAPS (IEB schools also follow CAPS). 19-25: no school curriculum, domains only.
const CAPS_LINK = {
  light: "Mathematics: Space and Shape (position and direction); Natural Sciences and Technology: Energy and Change (light travels in straight lines and reflects)",
  rule: "Mathematics: Data Handling (sorting and classifying by properties); Natural Sciences: the scientific process (fair tests)",
  story: "Home Language: listening and speaking, and writing and presenting (stories); Life Skills: Personal and Social Well-being (feelings)",
  invent: "Technology: the design process (investigate, design, make, evaluate) and Systems and Control; Natural Sciences: Matter and Materials",
  literal: "Mathematics: Patterns, Functions and Algebra (following and writing steps); Technology: algorithms and coding (to confirm)",
  veld: "Natural Sciences and Technology: Life and Living (food chains and ecosystems); Social Sciences Geography: weather and climate",
  describe: "Home Language: listening and speaking (describing, and following a description); Mathematics: properties of shapes",
  sure: "No direct content area: thinking about thinking, used across subjects; Mathematics: number patterns and comparing lengths"
};
const NCF_LINK = { light: "Exploring mathematics; Knowledge and understanding of the world", rule: "Exploring mathematics; Knowledge and understanding of the world", story: "Communication; Creativity; Identity and belonging",
  invent: "Knowledge and understanding of the world; Creativity", literal: "Communication; Exploring mathematics", veld: "Knowledge and understanding of the world", describe: "Communication", sure: "Well-being; Exploring mathematics" };
function curriculumLink(id, cohort) {
  const unit = typeof UNITS !== "undefined" && UNITS.find(u => u.id === id); if (unit) return unit.caps + ".";
  if (!CAPS_LINK[id]) return "";
  if (cohort === "3-6") return `NCF birth to four (ages 3 to 4): ${NCF_LINK[id]}. CAPS Grade R (ages 5 to 6): ${CAPS_LINK[id]}.`;
  if (cohort === "7-12") return `CAPS Foundation and Intermediate Phase: ${CAPS_LINK[id]}.`;
  if (cohort === "13-18") return `CAPS Senior and FET Phase (IEB schools also follow CAPS). Related area: ${CAPS_LINK[id]}. Subject names change in older phases; to confirm with specialists.`;
  return "No school curriculum after 18. Linked to the four 2to.iQ domains only.";
}

// ---------- Thinking prompts and educational feedback (Content Library, sections 3, 6 and 8) ----------
const THINK = { light: "Where does the light need to turn?", rule: "What do all the YES things have in common?", story: "How would you feel if you were in the story?", invent: "What could make it even better?",
  literal: "What will Bolt do with that step?", veld: "What changes first, and what does that change next?", describe: "What makes yours different from the others?", sure: "How do you know?" };
let thinkRun = null;
function thinkPrompt() {
  if (!thinkRun || !thinkRun.acted || !THINK[thinkRun.x.id]) return "";
  return `<p class="think"><span class="eyebrow">Something to think about</span><br>${esc(THINK[thinkRun.x.id])}</p>`;
}
document.getElementById("main").addEventListener("click", e => {
  if (!inGame || !thinkRun) return;
  const b = e.target.closest("button"); if (!b) return;
  if (/Hint|Skip|Read|Begin|Example|Back/i.test(b.id || "")) return;
  thinkRun.acted = true;
}, true);
function matchedFeedback(run, items) {
  const its = items || [];
  if (its.some(i => i.open)) return ["You explored new possibilities.", "New idea explored."];
  if (its.length && its.every(i => i.movedOn)) return ["You worked through something difficult.", "Challenge explored."];
  if (its.some(i => i.hints > 0 && i.latestMatched)) return ["You stayed with the challenge.", "Strong persistence."];
  if (its.some(i => i.checks > 1 && i.latestMatched)) return ["You tried a different approach when your first idea did not work.", "New strategy discovered."];
  if (its.some(i => i.movedOn)) return ["You kept trying.", "Learning continued."];
  return ["You looked carefully before deciding.", "Careful observation."];
}
const WELCOME = ["Welcome back.", "We're glad you're here.", "Let's discover something new together.", "Today is another opportunity to explore.", "There are many ways to think.",
  "Your ideas matter here.", "Every learner thinks differently, and that is something to celebrate.", "Learning begins with curiosity.", "Let's see what you discover today."];
