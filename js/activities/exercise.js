"use strict";

// ---------- Exercise wrapper ----------
let activeEx = null;
const SPEC = {
  // Activity Blueprints. Pattern Detective follows the agreed model; the rest are drafts for specialist review.
  pattern: { intention: "Today I am practising finding a repeating part and using it in a new pattern.", purpose: "Notice a repeating rule and continue it.",
    parent: "practised spotting and continuing patterns, a skill used in maths and reading.", teacher: "Shows how the learner finds a rule, and whether they get there alone, with hints or with the example." },
  vetkoek: { intention: "Today I am practising sharing things fairly.", purpose: "Share a set of objects fairly, including parts of a whole.",
    parent: "practised sharing things fairly, which builds early understanding of division and fractions.", teacher: "Shows whether the learner shares by dealing one at a time, by counting first, or by trial and correction, and when cutting into parts makes sense to them." },
  comic: { intention: "Today I am practising telling a story in order.", purpose: "Put events in order and express an ending.",
    parent: "put a short picture story in order and chose or drew an ending, which supports reading and telling stories.", teacher: "Shows how the learner reasons about sequence, whether they use pictures or words, and how they express an open-ended idea." },
  memory: { intention: "Today I am practising remembering where things are.", purpose: "Hold and recall the position of pictures.",
    parent: "practised remembering where things were, which helps with following steps and finding things.", teacher: "Shows how many turns the learner needed, whether they used a strategy, and whether they finished alone or with hints." },
  paint: { intention: "Today I am practising finding out what happens, by trying and checking.", purpose: "Explore, predict and test how colours combine.",
    parent: "found things out by trying, guessing and checking, the way scientists work.", teacher: "Shows whether the learner explores before answering, makes predictions, and tests them." },
  robot: { intention: "Today I am practising planning steps before I start.", purpose: "Plan and adjust a sequence of steps to reach a goal.",
    parent: "practised planning steps in order, a skill used in daily routines and problem-solving.", teacher: "Shows whether the learner plans ahead or works step by step, and how they recover after a mistake." },
  sort: { intention: "Today I am practising sorting things in more than one way.", purpose: "Sort by a rule, then switch when the rule changes.",
    parent: "sorted things in different ways and switched when the rule changed, which builds flexible thinking.", teacher: "Shows how the learner adapts when a rule changes, and which features they notice first." },
  kraal: { intention: "Today I am practising making up something new and explaining my idea.", purpose: "Generate an original idea and link its parts to a purpose.",
    parent: "invented a new animal and said what makes it special, which builds imagination and explaining.", teacher: "There is no right answer. Shows how the learner generates an idea and whether they link parts to a purpose." }
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
          ${x.id === "pattern" ? '<button class="btn" id="xExample">Show me an example</button>' : ""}
          <button class="btn quiet" id="xBack">Back to ${gamesWord()}</button>
        </div>
      </section>`);
  setSay(text);
  const run = { x, exampleOpened: false, acted: false }; thinkRun = run;
  on("#xBack", labHome);
  on("#xExample", () => { run.exampleOpened = true; inGame = true; patternExample(() => GAMES[x.id](run)); });
  on("#xBegin", () => { inGame = true; GAMES[x.id](run); });
}

function statusOf(item) {
  if (item.open) return item.movedOn ? "notyet" : "open";
  if (item.movedOn || !item.latestMatched) return "notyet";
  if (item.firstMatched && item.hints === 0 && !item.exampleOpened) return "alone";
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
  planDone("lab"); wireTell();
  on("#fHome", () => needsBattery() ? batteryCheck(labHome) : labHome());
}
