"use strict";

// ---------- Child: assent ----------
function assent() {
  trail.length = 0; mark("assent", assent); inGame = false;
  bar("child");
  const text = W("Hello! We made some games, and we'd like to know what you think of them. You can play if you want to. You can stop whenever you like. We are checking the games, not you. Would you like to play?",
    "Hello. We are testing some thinking activities and would value your view of them. Taking part is your choice, and you can stop at any time. We are testing the activities, not you. Would you like to take part?");
  currentReturnSay = currentSay = text;
  render(`
      <section class="card">
        <div class="say"><p class="lead">${W("Hello! We made some games, and we'd like to know what you think of them.", "Hello. We are testing some thinking activities and would value your view of them.")}</p></div>
        <p>${W("You can play if you want to. You can stop whenever you like. There are no right or wrong answers. We are checking the games, not you.", "Taking part is your choice, and you can stop at any time. There are no right or wrong answers. We are testing the activities, not you.")}</p>
        <h2>${W("Would you like to play?", "Would you like to take part?")}</h2>
        <div class="choices">
          <button class="choice" id="aYes" data-focus>${faceSvg("happy")}<span class="lbl">${W("Yes, I'd like to play", "Yes, I'll take part")}</span></button>
          <button class="choice" id="aNo">${faceSvg("calm")}<span class="lbl">Not today</span></button>
        </div>
      </section>`);
  setSay(text);
  on("#aYes", feelings);
  on("#aNo", () => { S.declined = true; thanks(W("That's okay. Thank you for coming. You can give the tablet back to the grown-up.", "That's fine. Thank you for coming. You can hand the device back.")); });
}

// ---------- Child: feelings and needs (not stored) ----------
function faceSvg(kind) {
  const mouths = {
    happy: '<path d="M18 30 Q28 40 38 30" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round"/>',
    calm: '<path d="M19 32 Q28 36 37 32" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round"/>',
    unsure: '<path d="M19 33 Q24 30 28 33 Q32 36 37 33" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round"/>',
    tired: '<path d="M21 34 L35 34" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>',
    worried: '<path d="M19 36 Q28 29 37 36" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round"/>',
    cross: '<path d="M19 37 Q28 30 37 37" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M16 17 L24 20 M40 17 L32 20" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>'
  };
  const eyes = kind === "tired"
    ? '<path d="M17 23 Q21 25 25 23 M31 23 Q35 25 39 23" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round"/>'
    : '<circle cx="21" cy="23" r="2.6" fill="currentColor"/><circle cx="35" cy="23" r="2.6" fill="currentColor"/>';
  return `<svg width="56" height="56" viewBox="0 0 56 56" aria-hidden="true" style="color:var(--ink)"><circle cx="28" cy="28" r="25" fill="var(--gold-soft)" stroke="var(--gold)" stroke-width="2"/>${eyes}${mouths[kind] || mouths.calm}</svg>`;
}
function feelings() {
  mark("feelings", feelings); inGame = false;
  bar("child");
  const text = "How are you feeling? You can choose a picture, or skip this.";
  currentReturnSay = currentSay = text;
  const fs = [["happy", "Happy"], ["calm", "Calm"], ["unsure", "Not sure"], ["tired", "Tired"], ["worried", "Worried"], ["cross", "Cross"]];
  render(`
      <section class="card">
        <h1>How are you feeling?</h1>
        <p class="muted">You can choose a picture, or skip this.</p>
        <div class="faces">${fs.map(([k, l]) => `<button class="choice" data-f="${k}" aria-label="${l}">${faceSvg(k)}<span class="lbl">${l}</span></button>`).join("")}</div>
        <div class="row"><button class="btn quiet" id="fSkip" data-focus>Skip</button></div>
      </section>`);
  setSay(text);
  on("[data-f]", needs);
  on("#fSkip", needs);
}
function needs() {
  mark("needs", needs); inGame = false; bar("child");
  const text = W("Thank you for telling me. What would help you right now? Start playing, a quiet break first, or help from a grown-up?", "Thank you. What would help you right now? Start, a quiet break first, or help from someone?");
  currentReturnSay = currentSay = text;
  render(`
      <section class="card">
        <h1>What would help you right now?</h1>
        <div class="choices">
          <button class="choice" data-n="start" data-focus><span class="lbl">${W("Start playing", "Start")}</span></button>
          <button class="choice" data-n="break"><span class="lbl">A quiet break first</span></button>
          <button class="choice" data-n="help"><span class="lbl">${W("Help from a grown-up", "Help from someone")}</span></button>
        </div>
      </section>`);
  setSay(text);
  on("[data-n]", e => {
    const n = e.currentTarget.dataset.n;
    S.need = n; // shown to the adult during the session only
    if (n === "break") { home(); breakScreen("Take a quiet break first. Stay as long as you like."); }
    else if (n === "help") { home(); helpCard(); }
    else home();
  });
}
