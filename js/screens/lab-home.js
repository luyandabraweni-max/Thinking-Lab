"use strict";

// ---------- Child: Thinking Lab home ----------
const EXERCISES = [
  { id: "light", name: "Light the Village", pic: "☀️", cat: "Planning", domain: "Logical and Analytical Thinking", ready: true },
  { id: "rule", name: "The Secret Rule Machine", pic: "⚙️", cat: "Investigation", domain: "Inquiry and Systems Thinking", ready: true },
  { id: "story", name: "Story Weaver", pic: "📖", cat: "Storytelling", domain: "Communication and Expression", ready: true },
  { id: "invent", name: "Invention Workshop", pic: "🛠️", cat: "Design and Improvement", domain: "Creativity and Metacognition", ready: true },
  { id: "literal", name: "The Literal Robot", pic: "🤖", cat: "Sequencing and Debugging", domain: "Logical and Analytical Thinking", ready: true },
  { id: "veld", name: "Veld Balance", pic: "🌾", cat: "Systems Thinking", domain: "Inquiry and Systems Thinking", ready: true },
  { id: "describe", name: "Describe It", pic: "💬", cat: "Precise Communication", domain: "Communication and Expression", ready: true },
  { id: "sure", name: "How Sure Am I?", pic: "🤔", cat: "Knowing What You Know", domain: "Creativity and Metacognition", ready: true }
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
            <span class="t-pic" aria-hidden="true">${x.pic}</span><span class="t-name">${esc(x.name)}</span><span class="t-cat">${esc(x.cat)}</span><span class="t-dom">${esc(x.domain)}</span></button>`).join("")}
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
