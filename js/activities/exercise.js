"use strict";

// ---------- Exercise wrapper ----------
let activeEx = null;
const SPEC = {
  // Activity Blueprints: drafts for specialist review. Each game records how the learner worked, not only the answer.
  light: { intention: "Today I am practising planning before I act.", purpose: "Plan a path for light using mirrors, then test and adjust.",
    parent: "planned where to put mirrors so sunlight reached every hut, which builds planning and spatial thinking.", teacher: "Shows whether the learner plans before testing (mirrors placed before the first shine) or works by trying and adjusting, and how many tests it took." },
  rule: { intention: "Today I am practising finding a hidden rule by testing ideas.", purpose: "Investigate by testing, notice what changes, and check an idea.",
    parent: "discovered a machine's secret rule by testing objects, the way scientists find out how things work.", teacher: "Shows how the learner investigates: number of tests, fair tests (one change at a time), and whether a wrong guess sends them back to gather evidence." },
  story: { intention: "Today I am practising telling a story my way.", purpose: "Tell a story with a beginning, middle and end, and name feelings.",
    parent: "made their own picture story, choosing what happens and how the characters feel.", teacher: "No right answer. Shows how the learner prefers to express themselves (choosing, typing, drawing or speaking), and how they name feelings and take another point of view." },
  invent: { intention: "Today I am practising designing something, testing it and making it better.", purpose: "Design a solution, test it, improve it, and judge it.",
    parent: "designed a way to carry water to a garden, tested it and made it better, like an engineer.", teacher: "Shows how the learner responds to a failed test (revises one part or starts over), how many designs they try, and how they judge their own invention." },
  literal: { intention: "Today I am practising giving exact instructions in the right order.", purpose: "Sequence steps precisely and debug them when they go wrong.",
    parent: "gave a robot step-by-step instructions and fixed them when the robot got muddled, an early step in coding.", teacher: "Shows how the learner sequences and debugs: runs needed, whether they fix one step or start again, and extra steps added." },
  veld: { intention: "Today I am practising thinking about how one change affects everything else.", purpose: "Predict and explain ripple effects in a living system.",
    parent: "predicted what happens in a veld when the rain or the animals change, which builds systems thinking.", teacher: "Shows whether the learner predicts effects one or two steps away, and in the open experiment, how they explore (runs, one change at a time)." },
  describe: { intention: "Today I am practising saying exactly what I mean, and listening carefully.", purpose: "Describe precisely so someone else can find it, and follow a description.",
    parent: "described creatures so a robot could find them, and found creatures from the robot's clues.", teacher: "Shows how precise the learner's descriptions are (clues used compared with the fewest needed, clues that didn't fit) and how they follow a description." },
  sure: { intention: "Today I am practising noticing how sure I am.", purpose: "Judge confidence before seeing the answer, and reflect on it.",
    parent: "solved puzzles and optical illusions, and noticed how sure they felt before seeing the answer.", teacher: "Shows how well the learner's confidence matches being right (the Sure-o-meter), a view of self-awareness. Illusions show how they respond when certainty is wrong." }
};
function startExercise(x) {
  S.inExercise = true; inGame = false; activeX = x; mark("ex-" + x.id, () => startExercise(x)); bar("exercise");
  const intro = SPEC[x.id].intention;
  const text = x.name + ". " + intro + " Press Begin when you are ready.";
  currentReturnSay = currentSay = text;
  render(`
      <section class="card">
        <p class="eyebrow">${esc(x.cat)}</p>
        <h1>${esc(x.name)}</h1>
        <p class="lead">${esc(intro)}</p>
        <p class="muted">Nothing is timed. You can use a hint, or move on whenever you like.</p>
        <div class="row">
          <button class="btn primary" id="xBegin" data-focus>Begin</button>
          <button class="btn quiet" id="xBack">Back to ${gamesWord()}</button>
        </div>
      </section>`);
  setSay(text);
  const run = { x, exampleOpened: false, acted: false }; thinkRun = run;
  on("#xBack", labHome);
  on("#xBegin", () => { inGame = true; GAMES[x.id](run); });
}

function statusOf(item) {
  if (item.open) return item.movedOn ? "notyet" : "open";
  if (item.movedOn || !item.latestMatched) return "notyet";
  if (item.firstMatched && item.hints === 0 && !item.exampleOpened && !item.easier) return "alone";
  return "support";
}
const STATUS_TEXT = { alone: "Shown without support", support: "Shown with support", notyet: "Not yet shown", open: "Idea shared (open-ended)" };

function reflect(run, question, options, done) {
  const text = question + " " + options.join(". ") + ".";
  currentReturnSay = currentSay = text;
  render(`
      <section class="card">
        <p class="eyebrow">${esc(run.x.name)}</p>
        <h2>${esc(question)}</h2>
        <div class="choices">${options.map((o, i) => `<button class="choice" data-r="${i}"${i === 0 ? " data-focus" : ""}><span class="lbl">${esc(o)}</span></button>`).join("")}</div>
      </section>`);
  setSay(text);
  on("[data-r]", e => done(options[+e.currentTarget.dataset.r]));
}
function finishExercise(run, items, reflection, feedback, extra) {
  inGame = false;
  S.played.includes(run.x.id) || S.played.push(run.x.id);
  S.obs.push({ id: run.x.id, assisted: S.assisted, level: S.band, ex: run.x.name, cat: run.x.cat, domain: run.x.domain, items, reflection, exampleOpened: !!run.exampleOpened, extra: extra || "", at: new Date() });
  const [fbText, achieve] = matchedFeedback(run, items);
  S.obs[S.obs.length - 1].feedback = fbText;
  const text = achieve + " " + fbText + ` You can choose another ${gameWord()}.`;
  currentReturnSay = currentSay = text;
  render(`
      <section class="card">
        <h1 class="as-h2">${esc(run.x.name)}</h1>
        <p class="eyebrow">${esc(achieve)}</p>
        <div class="feedback">${esc(fbText)}</div>
        <p>${W("Thank you for playing.", "Thank you for taking part.")}</p>
        <div class="row"><button class="btn primary" id="fHome" data-focus>Choose another ${gameWord()}</button>${tellButton()}</div>
      </section>`);
  setSay(text);
  planDone("lab", run.x.id); wireTell();
  on("#fHome", () => needsBattery() ? batteryCheck(labHome) : labHome());
}
