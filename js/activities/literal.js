"use strict";

// ---------- The Literal Robot (Logical and Analytical Thinking: sequencing and debugging) ----------
// The learner puts instruction cards in order and Bolt does exactly what they say, even when it's silly. A step that
// comes before what it needs goes wrong in a funny way, and the learner fixes the program. Records how many runs and
// edits it took, and whether the learner changes one step or starts again: an early view of debugging.
// Cards: gives = what it makes true; needs = what must be true first, with what Bolt does if it isn't;
// silly = always goes wrong; extra = harmless but not needed. Any order that reaches the goal with nothing silly works.
const LITERAL_TASKS = {
  younger: [
    { title: "Make a sandwich", goal: ["done"], order: ["bread", "open", "spread", "close"], cards: [
      { id: "bread", t: "Take two slices of bread", pic: "🍞", did: "Bolt takes two slices of bread.", gives: ["bread"] },
      { id: "open", t: "Open the peanut butter jar", pic: "🫙", did: "Bolt opens the jar.", gives: ["open"] },
      { id: "spread", t: "Spread peanut butter on the bread", pic: "🔪", did: "Bolt spreads peanut butter on the bread.", gives: ["spread"],
        needs: { bread: "Bolt spreads peanut butter on the table. There is no bread yet!", open: "Bolt rubs the closed jar on the bread. Nothing comes out!" } },
      { id: "close", t: "Put the two slices together", pic: "🥪", did: "Bolt puts the slices together. A sandwich!", gives: ["done"], needs: { spread: "Bolt squashes two plain slices together. That's just bread!" } },
      { id: "dance", t: "Do a happy dance", pic: "💃", did: "Bolt does a happy dance. Not needed, but fun!", extra: true }] },
    { title: "Go out in the rain", goal: ["coat", "out", "umbrella"], order: ["coat", "door", "walk", "umbrella"], cards: [
      { id: "coat", t: "Put on your raincoat", pic: "🧥", did: "Bolt puts on the raincoat.", gives: ["coat"] },
      { id: "door", t: "Open the front door", pic: "🚪", did: "Bolt opens the door.", gives: ["door"] },
      { id: "walk", t: "Walk outside", pic: "🚶", did: "Bolt walks outside.", gives: ["out"], needs: { door: "Bolt walks into the closed door. Bonk!", coat: "Bolt walks out with no raincoat. Soaking wet!" } },
      { id: "umbrella", t: "Open the umbrella", pic: "☂️", did: "Bolt opens the umbrella. Nice and dry!", gives: ["umbrella"], needs: { out: "Bolt opens the umbrella inside. It gets stuck in the doorway!" } },
      { id: "boots", t: "Put on gumboots", pic: "👢", did: "Bolt puts on gumboots. Good thinking!", extra: true }] }
  ],
  older: [
    { title: "Plant a bean", goal: ["covered", "watered", "sun"], order: ["soil", "hole", "bean", "cover", "water", "sun"], cards: [
      { id: "soil", t: "Fill the pot with soil", pic: "🪴", did: "Bolt fills the pot with soil.", gives: ["soil"] },
      { id: "hole", t: "Push a finger in to make a hole", pic: "👉", did: "Bolt makes a neat hole.", gives: ["hole"], needs: { soil: "Bolt pokes the bottom of an empty pot. There's no soil yet!" } },
      { id: "bean", t: "Drop the bean into the hole", pic: "🫘", did: "Bolt drops the bean in.", gives: ["bean"], needs: { hole: "Bolt drops the bean on top. A bird swoops down and eats it!" } },
      { id: "cover", t: "Cover the bean with soil", pic: "🤲", did: "Bolt covers the bean.", gives: ["covered"], needs: { bean: "Bolt covers the hole, but the bean is still in the packet!" } },
      { id: "water", t: "Water the pot", pic: "💧", did: "Bolt waters the pot.", gives: ["watered"], needs: { soil: "Bolt pours water into an empty pot. It runs out of the bottom!", covered: "Bolt waters the open hole. The bean floats away!" } },
      { id: "sun", t: "Put the pot on a sunny windowsill", pic: "☀️", did: "Bolt puts the pot in the sun.", gives: ["sun"] },
      { id: "dark", t: "Put the pot in a dark cupboard", pic: "🗄️", silly: "Bolt shuts the pot in a dark cupboard. Beans need light to grow!" }] },
    { title: "Make a cup of tea", goal: ["ready"], order: ["fill", "boil", "bag", "pour", "out"], cards: [
      { id: "fill", t: "Fill the kettle with water", pic: "🚰", did: "Bolt fills the kettle.", gives: ["water"] },
      { id: "boil", t: "Switch the kettle on until it boils", pic: "⚡", did: "Bolt boils the water.", gives: ["hot"], needs: { water: "Bolt boils an empty kettle. It smells like burning!" } },
      { id: "bag", t: "Put a teabag in the cup", pic: "🍵", did: "Bolt puts a teabag in the cup.", gives: ["bag"] },
      { id: "pour", t: "Pour the hot water into the cup", pic: "🫖", did: "Bolt pours. The tea turns brown.", gives: ["tea"],
        needs: { water: "Bolt tips the empty kettle. Nothing comes out!", hot: "Bolt pours cold water. Brrr, cold tea!", bag: "Bolt pours hot water into an empty cup. That's just hot water!" } },
      { id: "out", t: "Take the teabag out", pic: "🥄", did: "Bolt takes the teabag out. Tea is ready!", gives: ["ready"], needs: { tea: "Bolt takes a dry teabag out of the cup. There's no tea yet!" } },
      { id: "milk", t: "Add a little milk", pic: "🥛", did: "Bolt adds milk. Some people like it that way!", extra: true },
      { id: "kettlebag", t: "Put the teabag in the kettle", pic: "🫗", silly: "Bolt puts the teabag in the kettle. Now the kettle needs a big wash!" }] }
  ]
};
// Runs a program exactly as written: each step either works, goes wrong in a funny way, or is a harmless extra.
function literalRun(task, plan) {
  const have = new Set(), events = [];
  plan.forEach(id => {
    const card = task.cards.find(c => c.id === id);
    if (card.silly) { events.push({ id, ok: false, text: card.silly }); return; }
    const missing = Object.keys(card.needs || {}).find(k => !have.has(k));
    if (missing) { events.push({ id, ok: false, text: card.needs[missing] }); return; }
    (card.gives || []).forEach(g => have.add(g));
    events.push({ id, ok: true, extra: !!card.extra, text: card.did });
  });
  const reached = task.goal.every(g => have.has(g));
  return { events, ok: reached && events.every(e => e.ok), reached };
}
const BOLT = mood => `<svg class="lr-bolt ${mood}" viewBox="0 0 120 120" aria-hidden="true">
    <line x1="60" y1="14" x2="60" y2="28" stroke="var(--ink)" stroke-width="3"/><circle cx="60" cy="12" r="6" fill="var(--gold)" stroke="var(--ink)" stroke-width="2"/>
    <rect x="28" y="28" width="64" height="48" rx="14" fill="var(--shape-c)" stroke="var(--ink)" stroke-width="3"/>
    <rect x="38" y="38" width="44" height="28" rx="8" fill="var(--surface)" stroke="var(--ink)" stroke-width="2"/>
    ${mood === "oops" ? '<path d="M44 46 l6 6 M50 46 l-6 6 M70 46 l6 6 M76 46 l-6 6" stroke="var(--ink)" stroke-width="2.6" stroke-linecap="round"/><ellipse cx="60" cy="60" rx="5" ry="4" fill="var(--ink)"/>'
      : '<circle cx="48" cy="50" r="4.5" fill="var(--ink)"/><circle cx="72" cy="50" r="4.5" fill="var(--ink)"/><path d="M50 58 Q60 66 70 58" stroke="var(--ink)" stroke-width="3" fill="none" stroke-linecap="round"/>'}
    <rect x="38" y="80" width="44" height="26" rx="8" fill="var(--shape-c)" stroke="var(--ink)" stroke-width="3"/>
    <path d="M28 86 L14 ${mood === "happy" ? 70 : 96}" stroke="var(--ink)" stroke-width="5" stroke-linecap="round"/><path d="M92 86 L106 ${mood === "happy" ? 70 : 96}" stroke="var(--ink)" stroke-width="5" stroke-linecap="round"/>
    <rect x="42" y="106" width="12" height="10" rx="3" fill="var(--ink)"/><rect x="66" y="106" width="12" height="10" rx="3" fill="var(--ink)"/></svg>`;

function gameLiteral(run) {
  labStart(run);
  const tasks = LITERAL_TASKS[S.band === "older" ? "older" : "younger"], items = []; let ti = 0;
  const doTask = () => {
    const task = tasks[ti], cardOf = id => task.cards.find(c => c.id === id), tray = shuffle(task.cards.map(c => c.id));
    const rec = newRec(task.title, { runs: 0, edits: 0, restarts: 0, mode: "built a program" });
    const o = { hint: 0, hints: [W("What has to happen first, before anything else?", "Which step must come before all the others?"),
      `The first step is: "${cardOf(task.order[0]).t}".`, `One order that works: ${task.order.map((id, i) => `${i + 1}. ${cardOf(id).t}`).join(". ")}.`] };
    let plan = [], playing = null, done = false, fb = "", mood = "idle";
    const intro = `${run.x.name}: ${task.title}. Bolt does exactly what you say, nothing more and nothing less. Tap the cards to make Bolt's instructions, then run them.`;
    const draw = () => {
      const ev = playing ? playing.events : null, cur = playing ? playing.at : -1;
      const step = (id, i) => {
        const c = cardOf(id), e = ev && i <= cur ? ev[i] : null, cls = e ? (e.ok ? (e.extra ? " extra" : " did") : " oops") : i === cur + 1 && playing ? " next" : "";
        return `<li class="lr-step${cls}"><span class="lr-pic" aria-hidden="true">${c.pic}</span><span class="lr-t">${esc(c.t)}${e && !e.ok ? '<span class="sr"> (went wrong)</span>' : ""}</span>
          ${playing || done ? "" : `<span class="lr-tools"><button class="btn small" data-up="${i}" aria-label="Move step ${i + 1} up"${i === 0 ? " disabled" : ""}>↑</button><button class="btn small" data-out="${i}" aria-label="Take out step ${i + 1}: ${esc(c.t)}">✕</button></span>`}</li>`;
      };
      const said = playing && cur >= 0 ? ev[cur].text : fb;
      currentReturnSay = currentSay = said || intro;
      render(`<section class="card">
          ${labHead(run, `${ti + 1} of ${tasks.length}`)}
          <h2>${esc(task.title)}</h2>
          <div class="lr-stage"><div class="lr-robot">${BOLT(mood)}</div><div class="lr-bubble" role="status">${esc(said || W("Tell me what to do, one step at a time. I'll do EXACTLY what you say!", "Give me instructions. I follow them exactly, word for word."))}</div></div>
          <h3 class="lr-h">Bolt's instructions</h3>
          ${plan.length ? `<ol class="lr-plan">${plan.map(step).join("")}</ol>` : `<p class="muted">No instructions yet. Tap a card below.</p>`}
          ${playing || done ? "" : `<h3 class="lr-h">Instruction cards</h3><div class="lr-tray">${tray.map(id => `<button class="choice lr-card" data-add="${id}"${plan.includes(id) ? " disabled" : ""}><span class="opt-pic" aria-hidden="true">${cardOf(id).pic}</span><span class="lbl">${esc(cardOf(id).t)}</span></button>`).join("")}</div>`}
          ${thinkPrompt()}
          ${hintHtml(o)}
          ${done ? `<div class="row"><button class="btn primary" id="lrNext" data-focus>${ti + 1 < tasks.length ? "Next job" : "Finish"}</button></div>`
            : playing ? "" : labRow(o, ["lrRun", `${icon("▶️")}<span>Run the instructions</span>`, !plan.length], plan.length ? `<button class="btn" id="lrReset">Start again</button>` : "")}
        </section>`);
      on("[data-add]", e => { plan.push(e.currentTarget.dataset.add); rec.edits++; run.acted = true; fb = ""; mood = "idle"; draw(); const n = $main.querySelector("[data-add]:not([disabled])"); if (n) n.focus({ preventScroll: true }); });
      on("[data-up]", e => { const i = +e.currentTarget.dataset.up; [plan[i - 1], plan[i]] = [plan[i], plan[i - 1]]; rec.edits++; fb = ""; draw(); const b = $main.querySelector(`[data-up="${i - 1}"]`); if (b && !b.disabled) b.focus({ preventScroll: true }); });
      on("[data-out]", e => { plan.splice(+e.currentTarget.dataset.out, 1); rec.edits++; fb = ""; draw(); });
      on("#lrReset", () => { plan = []; rec.restarts++; fb = ""; mood = "idle"; draw(); });
      on("#lrRun", () => {
        const result = literalRun(task, plan); rec.runs++; rec.checks++; run.acted = true;
        if (rec.firstMatched === null) rec.firstMatched = result.ok; rec.latestMatched = result.ok;
        playing = { events: result.events, at: -1 };
        playFrames(run, result.events.length, 1700, (i, last) => {
          playing.at = i; mood = result.events[i].ok ? "idle" : "oops"; draw(); speakNow(result.events[i].text);
        }, () => {
          const wrong = result.events.findIndex(e => !e.ok);
          if (result.ok) { done = true; mood = "happy"; fb = rec.runs === 1 ? W("Bolt did it! Your instructions were exact.", "It worked first time. Precise instructions.") : W("Bolt did it! You found the problem and fixed it.", "It works now. You debugged the program."); }
          else if (wrong >= 0) { mood = "oops"; fb = `Step ${wrong + 1} went wrong. Bolt did exactly what it said. Can you fix the instructions?`; }
          else { mood = "oops"; fb = W("Bolt finished, but the job isn't done yet. Is a step missing?", "The program ran, but the job isn't finished. Something is missing."); }
          playing = null; draw(); speakNow(fb);
          const b = document.getElementById(done ? "lrNext" : "lrRun"); if (b) b.focus({ preventScroll: true });
        });
      });
      on("#lrNext", () => { rec.extras = plan.filter(id => cardOf(id).extra).length; items.push(rec); ti++; ti < tasks.length ? doTask() : wrapUp(); });
      on("#lkSkip", () => { rec.movedOn = true; items.push(rec); ti++; ti < tasks.length ? doTask() : wrapUp(); });
      wireHints(o, rec, draw);
    };
    labSay(intro); draw();
  };
  const wrapUp = () => labReflect(run, W("When Bolt got it wrong, what did you do?", "When the program went wrong, what did you do?"), ["I found the wrong step and fixed it", "I started again", "I used a hint", "Bolt got it right first time"],
    r => finishExercise(run, items, r, null, `Runs per job: ${items.map(i => i.runs).join(", ")}. Started again: ${items.reduce((n, i) => n + i.restarts, 0)} time(s).`));
  doTask();
}
