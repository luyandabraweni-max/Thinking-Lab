"use strict";

// ---------- Child safeguarding (docs/system-design.md, section 13) ----------
// A child can say they feel unsafe from the talk board, Tell us or Help. The app answers kindly, points to a trusted
// adult and a free child helpline, and records a concern for the adult running the session and the safeguarding lead.
// It never investigates, judges or reports on its own, and it does not tell the family automatically.
const HELPLINES = {
  ZA: ["Childline South Africa", "116", "Free from any phone, day or night."],
  EU: ["Child helpline", "116 111", "Free in every EU country."]
};
// Lessons about body safety, bullying and relationships end with "Who can help me?"
const SAFEGUARDING_UNITS = ["ey-safe", "gr-body", "g1-homesafe", "g2-bully", "g3-feelings", "g3-safety", "l4-body", "l5-relationships", "l6-peer", "g8-decisions", "g11-relationships"];
const UNSAFE = "I feel unsafe";

// The learner's country comes from their portal guardian or specialist. Unknown: show both helplines.
function learnerCountry() {
  const L = S.portalLearner ? portalLearner(S.portalLearner) : null; if (!L) return null;
  const acc = PORTAL.accounts.find(a => a.id === L.guardianId) || PORTAL.accounts.find(a => L.specialists.includes(a.id));
  return acc ? acc.country : null;
}
function helplinesHtml() {
  const c = learnerCountry(), lines = c === "ZA" ? [HELPLINES.ZA] : c ? [HELPLINES.EU] : [HELPLINES.ZA, HELPLINES.EU];
  return `<ul class="helplines">${lines.map(([n, num, note]) => `<li><span class="hl-name">${esc(n)}${lines.length > 1 ? (n === HELPLINES.ZA[0] ? "" : " (Europe)") : ""}</span><span class="hl-num">${esc(num)}</span><span class="note">${esc(note)}</span></li>`).join("")}</ul>`;
}
function helplineSpoken() {
  const c = learnerCountry();
  return c === "ZA" || !c ? "You can also phone Childline on 1 1 6. It's free, any time." : "You can also phone the child helpline on 1 1 6, 1 1 1. It's free.";
}
function feelUnsafe(where) {
  const at = new Date();
  S.concerns = S.concerns || []; S.concerns.push({ at, where });
  const L = S.portalLearner ? portalLearner(S.portalLearner) : null;
  if (L) { L.concerns = L.concerns || []; L.concerns.push({ id: newId("c"), date: todayIso(), time: at.toTimeString().slice(0, 5), where, status: "open", action: "" }); }
  const say = W("Thank you for telling us. You did the right thing, and you are not in trouble. Please tell a grown-up you trust, like a teacher or someone in your family.",
    "Thank you for telling us. You did the right thing. Please talk to an adult you trust, like a teacher, counsellor or family member.");
  overlay(`<div class="card safety-card" role="alertdialog" aria-labelledby="sfTitle" aria-describedby="sfText">
      <span class="safety-ic" aria-hidden="true">🛟</span>
      <h2 id="sfTitle">Thank you for telling us</h2>
      <p id="sfText">${esc(say)}</p>
      ${helplinesHtml()}
      <div class="row"><button class="btn primary" id="sfHelp" data-focus>${icon("🙋")}<span>Show a grown-up</span></button><button class="btn" id="sfClose">Close</button></div>
    </div>`);
  speakNow(`${say} ${helplineSpoken()}`);
  document.getElementById("sfHelp").onclick = () => {
    overlay(`<div class="card" style="text-align:center"><p class="eyebrow">Show this to a grown-up you trust</p><h1>I feel unsafe. I need to talk to someone.</h1>
        <div class="row" style="justify-content:center"><button class="btn primary" id="sfDone" data-focus>Done</button></div></div>`);
    speakNow("I feel unsafe. I need to talk to someone.");
    document.getElementById("sfDone").onclick = closeLayer;
  };
  document.getElementById("sfClose").onclick = closeLayer;
}
// "Who can help me?" at the end of sensitive lessons.
function safetyNote(u) {
  if (!SAFEGUARDING_UNITS.includes(u.id)) return "";
  return `<div class="safety-note"><h2>Who can help me?</h2><p>If anything ever makes you feel unsafe or worried, tell a grown-up you trust. You can keep telling until someone helps.</p>${helplinesHtml()}
      <div class="row"><button class="btn" id="sfUnsafe">${icon("🛟")}<span>${UNSAFE}</span></button></div></div>`;
}
// For the adult running the session (Grown-up view): shown first, never hidden behind other notes.
function concernsAdultHtml() {
  if (!S.concerns || !S.concerns.length) return "";
  return `<div class="safety-alert" role="alert"><h2>${icon("🛟")} Safeguarding: the learner said they feel unsafe</h2>
      <ul class="plain">${S.concerns.map(c => `<li>${c.at.toTimeString().slice(0, 5)} · from the ${esc(c.where)}</li>`).join("")}</ul>
      <p>Stay calm and listen. Don't ask leading questions or promise to keep a secret. Follow your organisation's child protection policy and tell its designated safeguarding lead today.
      In South Africa, teachers, social workers and health workers must report suspected abuse (Children's Act, section 110).</p>
      ${S.portalLearner ? `<p class="note">A concern record has been added for this learner's safeguarding lead. It is not shared with the family automatically.</p>` : ""}</div>`;
}
