"use strict";

// ---------- Child: Thinking Lab home ----------
const EXERCISES = [
  { id: "pattern", name: "Pattern Detective", cat: "Pattern Thinking", domain: "Logical and Analytical Thinking", ready: true },
  { id: "vetkoek", name: "Share the Vetkoek", cat: "Problem-Solving", domain: "Logical and Analytical Thinking", ready: true },
  { id: "comic", name: "Sprout's Comic", cat: "Communication", domain: "Communication and Expression", ready: true },
  { id: "memory", name: "Memory Match", cat: "Memory and Attention", domain: "Logical and Analytical Thinking", ready: true },
  { id: "paint", name: "Paint Pots", cat: "Inquiry and Exploration", domain: "Inquiry and Systems Thinking", ready: true },
  { id: "robot", name: "Robot Rescue", cat: "Planning and Organisation", domain: "Logical and Analytical Thinking", ready: true },
  { id: "sort", name: "Colour and Shape Sort", cat: "Flexible Thinking", domain: "Logical and Analytical Thinking", ready: true },
  { id: "kraal", name: "A New Animal for the Kraal", cat: "Creativity", domain: "Creativity and Metacognition", ready: true }
];
function labHome() {
  S.inExercise = false; activeEx = null; inGame = false;
  if (!S.need) S.need = "start";
  mark("lab", labHome); bar("child");
  if (!S.welcome) S.welcome = WELCOME[Math.floor(Math.random() * WELCOME.length)];
  const showWelcome = false;
  const text = (showWelcome ? S.welcome + " " : "") + `Thinking Lab. Choose ${W("a game", "an activity")}. When you are finished, choose I'm finished for today.`;
  currentReturnSay = currentSay = text;
  render(`
      <section style="display:flex;flex-direction:column;gap:16px">
        <div><p class="eyebrow">Thinking Lab</p>${showWelcome ? `<p class="lead">${esc(S.welcome)}</p>` : ""}<h1>Choose ${W("a game", "an activity")}</h1></div>
        <div class="grid">
          ${EXERCISES.map(x => `<button class="tile" data-x="${x.id}"${x.ready ? "" : ' aria-disabled="true"'}>
            <span class="pill">${x.ready ? (S.played.includes(x.id) ? W("Played", "Done") : W("Play", "Start")) : "Coming soon"}</span>
            <span class="t-name">${esc(x.name)}</span><span class="t-cat">${esc(x.cat)}</span><span class="t-dom">${esc(x.domain)}</span></button>`).join("")}
        </div>
        <div class="row"><button class="btn" id="hDone">I'm finished for today</button></div>
      </section>`);
  setSay(text);
  on("[data-x]", e => {
    const x = EXERCISES.find(z => z.id === e.currentTarget.dataset.x);
    if (!x.ready) { speakNow(`That ${gameWord()} is coming soon.`); return; }
    startExercise(x);
  });
  on("#hDone", goodbye);
}
