"use strict";

// ---------- Curriculum links (Version A, proposed, awaiting specialist confirmation) ----------
// Ages 3-4: NCF birth to four. Ages 5-18: CAPS (IEB schools also follow CAPS). 19-25: no school curriculum, domains only.
const CAPS_LINK = {
  pattern: "Mathematics: Patterns, Functions and Algebra",
  vetkoek: "Mathematics: Numbers, Operations and Relationships (sharing, early fractions)",
  comic: "Home Language: listening, speaking, reading and viewing (story sequence); Life Skills: Creative Arts",
  memory: "No direct content area; supports attention and memory used across subjects",
  paint: "Life Skills: Beginning Knowledge and Creative Arts; Natural Sciences and Technology: Matter and Materials (to confirm)",
  robot: "Mathematics: Space and Shape (position and direction)",
  sort: "Mathematics: Space and Shape (2D shapes) and Data Handling (sorting and classifying)",
  kraal: "Life Skills: Creative Arts and Beginning Knowledge (animals); Home Language: speaking"
};
const NCF_LINK = { pattern: "Exploring mathematics", vetkoek: "Exploring mathematics", comic: "Communication; Creativity", memory: "Well-being (attention), to confirm",
  paint: "Knowledge and understanding of the world; Creativity", robot: "Exploring mathematics", sort: "Exploring mathematics", kraal: "Creativity; Communication" };
function curriculumLink(id, cohort) {
  const unit = typeof UNITS !== "undefined" && UNITS.find(u => u.id === id); if (unit) return unit.caps + ".";
  if (!CAPS_LINK[id]) return "";
  if (cohort === "3-6") return `NCF birth to four (ages 3 to 4): ${NCF_LINK[id]}. CAPS Grade R (ages 5 to 6): ${CAPS_LINK[id]}.`;
  if (cohort === "7-12") return `CAPS Foundation and Intermediate Phase: ${CAPS_LINK[id]}.`;
  if (cohort === "13-18") return `CAPS Senior and FET Phase (IEB schools also follow CAPS). Related area: ${CAPS_LINK[id]}. Subject names change in older phases; to confirm with specialists.`;
  return "No school curriculum after 18. Linked to the four 2to.iQ domains only.";
}

// ---------- Thinking prompts and educational feedback (Content Library, sections 3, 6 and 8) ----------
const THINK = { pattern: "What did you notice first?", vetkoek: "How did you decide?", comic: "What caught your attention?", memory: "What helped you solve it?",
  paint: "What would happen if you tried something different?", robot: "What could you try next?", sort: "What looks different?", kraal: "Can you think of a different idea?" };
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
  return ["You looked carefully before deciding.", run.x.id === "pattern" ? "Pattern recognised." : "Careful observation."];
}
const WELCOME = ["Welcome back.", "We're glad you're here.", "Let's discover something new together.", "Today is another opportunity to explore.", "There are many ways to think.",
  "Your ideas matter here.", "Every learner thinks differently, and that is something to celebrate.", "Learning begins with curiosity.", "Let's see what you discover today."];
