// The Thinking Lab games and their briefs (docs/thinking-lab-games.md), carried over from js/screens/lab-home.js and
// js/activities/exercise.js. Drafts for specialist review: each records how the learner worked, not only the answer.
export type GameId = "light" | "rule" | "story" | "invent" | "literal" | "veld" | "describe" | "sure";
export interface GameInfo { id: GameId; name: string; pic: string; cat: string; domain: string; intention: string; purpose: string; parent: string; teacher: string }

const list: GameInfo[] = [
  { id: "light", name: "Light the Village", pic: "☀️", cat: "Planning", domain: "Logical and Analytical Thinking", intention: "Today I am practising planning before I act.", purpose: "Plan a path for light using mirrors, then test and adjust.",
    parent: "planned where to put mirrors so sunlight reached every hut, which builds planning and spatial thinking.", teacher: "Shows whether the learner plans before testing (mirrors placed before the first shine) or works by trying and adjusting, and how many tests it took." },
  { id: "rule", name: "The Secret Rule Machine", pic: "⚙️", cat: "Investigation", domain: "Inquiry and Systems Thinking", intention: "Today I am practising finding a hidden rule by testing ideas.", purpose: "Investigate by testing, notice what changes, and check an idea.",
    parent: "discovered a machine's secret rule by testing objects, the way scientists find out how things work.", teacher: "Shows how the learner investigates: number of tests, fair tests (one change at a time), and whether a wrong guess sends them back to gather evidence." },
  { id: "story", name: "Story Weaver", pic: "📖", cat: "Storytelling", domain: "Communication and Expression", intention: "Today I am practising telling a story my way.", purpose: "Tell a story with a beginning, middle and end, and name feelings.",
    parent: "made their own picture story, choosing what happens and how the characters feel.", teacher: "No right answer. Shows how the learner prefers to express themselves (choosing, typing, drawing or speaking), and how they name feelings and take another point of view." },
  { id: "invent", name: "Invention Workshop", pic: "🛠️", cat: "Design and Improvement", domain: "Creativity and Metacognition", intention: "Today I am practising designing something, testing it and making it better.", purpose: "Design a solution, test it, improve it, and judge it.",
    parent: "designed a way to carry water to a garden, tested it and made it better, like an engineer.", teacher: "Shows how the learner responds to a failed test (revises one part or starts over), how many designs they try, and how they judge their own invention." },
  { id: "literal", name: "The Literal Robot", pic: "🤖", cat: "Sequencing and Debugging", domain: "Logical and Analytical Thinking", intention: "Today I am practising giving exact instructions in the right order.", purpose: "Sequence steps precisely and debug them when they go wrong.",
    parent: "gave a robot step-by-step instructions and fixed them when the robot got muddled, an early step in coding.", teacher: "Shows how the learner sequences and debugs: runs needed, whether they fix one step or start again, and extra steps added." },
  { id: "veld", name: "Veld Balance", pic: "🌾", cat: "Systems Thinking", domain: "Inquiry and Systems Thinking", intention: "Today I am practising thinking about how one change affects everything else.", purpose: "Predict and explain ripple effects in a living system.",
    parent: "predicted what happens in a veld when the rain or the animals change, which builds systems thinking.", teacher: "Shows whether the learner predicts effects one or two steps away, and in the open experiment, how they explore (runs, one change at a time)." },
  { id: "describe", name: "Describe It", pic: "💬", cat: "Precise Communication", domain: "Communication and Expression", intention: "Today I am practising saying exactly what I mean, and listening carefully.", purpose: "Describe precisely so someone else can find it, and follow a description.",
    parent: "described creatures so a robot could find them, and found creatures from the robot's clues.", teacher: "Shows how precise the learner's descriptions are (clues used compared with the fewest needed, clues that didn't fit) and how they follow a description." },
  { id: "sure", name: "How Sure Am I?", pic: "🤔", cat: "Knowing What You Know", domain: "Creativity and Metacognition", intention: "Today I am practising noticing how sure I am.", purpose: "Judge confidence before seeing the answer, and reflect on it.",
    parent: "solved puzzles and optical illusions, and noticed how sure they felt before seeing the answer.", teacher: "Shows how well the learner's confidence matches being right (the Sure-o-meter), a view of self-awareness. Illusions show how they respond when certainty is wrong." }
];
export const GAME_LIST = list;
export const GAMES = Object.fromEntries(list.map(g => [g.id, g])) as Record<GameId, GameInfo>;
export const THINK: Record<GameId, string> = { light: "Where does the light need to turn?", rule: "What do all the YES things have in common?", story: "How would you feel if you were in the story?", invent: "What could make it even better?",
  literal: "What will Bolt do with that step?", veld: "What changes first, and what does that change next?", describe: "What makes yours different from the others?", sure: "How do you know?" };

// For reports and families (ported from js/screens/dashboard.js and js/activities/curriculum.js).
export const HOME_IDEA: Record<GameId, string> = {
  light: "Shine a torch at a small mirror together and try to make the light land on a spot on the wall.",
  rule: "Play 'secret rule': sort spoons, socks or toys by a rule you keep secret, and let them work it out.",
  story: "Tell a story together, taking turns to say what happens next and how someone feels.",
  invent: "Build something from recycling that carries water from one cup to another, then make it better.",
  literal: "Ask for exact steps for a simple job, like making toast, and follow them exactly, even when it's funny.",
  veld: "Talk about a food chain you can see, like birds eating insects. What would happen if one disappeared?",
  describe: "Hide a small toy and describe it without saying its name. Can they find it? Then swap.",
  sure: "When someone says 'I'm sure', ask 'How do you know?' and check together."
};
// Curriculum links: proposed, awaiting specialist confirmation. Ages 3-4: NCF; 5-18: CAPS; 19-25: domains only.
const CAPS_LINK: Record<GameId, string> = {
  light: "Mathematics: Space and Shape (position and direction); Natural Sciences and Technology: Energy and Change (light travels in straight lines and reflects)",
  rule: "Mathematics: Data Handling (sorting and classifying by properties); Natural Sciences: the scientific process (fair tests)",
  story: "Home Language: listening and speaking, and writing and presenting (stories); Life Skills: Personal and Social Well-being (feelings)",
  invent: "Technology: the design process (investigate, design, make, evaluate) and Systems and Control; Natural Sciences: Matter and Materials",
  literal: "Mathematics: Patterns, Functions and Algebra (following and writing steps); Technology: algorithms and coding (to confirm)",
  veld: "Natural Sciences and Technology: Life and Living (food chains and ecosystems); Social Sciences Geography: weather and climate",
  describe: "Home Language: listening and speaking (describing, and following a description); Mathematics: properties of shapes",
  sure: "No direct content area: thinking about thinking, used across subjects; Mathematics: number patterns and comparing lengths"
};
const NCF_LINK: Record<GameId, string> = { light: "Exploring mathematics; Knowledge and understanding of the world", rule: "Exploring mathematics; Knowledge and understanding of the world", story: "Communication; Creativity; Identity and belonging",
  invent: "Knowledge and understanding of the world; Creativity", literal: "Communication; Exploring mathematics", veld: "Knowledge and understanding of the world", describe: "Communication", sure: "Well-being; Exploring mathematics" };
export function curriculumLink(id: GameId, cohort: string) {
  if (cohort === "3-6") return `NCF birth to four (ages 3 to 4): ${NCF_LINK[id]}. CAPS Grade R (ages 5 to 6): ${CAPS_LINK[id]}.`;
  if (cohort === "7-12") return `CAPS Foundation and Intermediate Phase: ${CAPS_LINK[id]}.`;
  if (cohort === "13-18") return `CAPS Senior and FET Phase (IEB schools also follow CAPS). Related area: ${CAPS_LINK[id]}. Subject names change in older phases; to confirm with specialists.`;
  return "No school curriculum after 18. Linked to the four 2to.iQ domains only.";
}
