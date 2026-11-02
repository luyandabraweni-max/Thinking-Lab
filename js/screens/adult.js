"use strict";

// ---------- Adult view: the learner's voice ----------
function learnerVoiceHtml() {
  const v = S.voice || [];
  const fmt = x => `<li><b>${esc(x.kind)}</b>: ${esc(x.what)}${x.where ? ` <span class="muted">(${esc(x.where)})</span>` : ""}</li>`;
  return `<h2>The learner's voice</h2>
      <p class="note">What the learner chose or told us. These are the learner's own choices, not observations.</p>
      ${S.battery.length ? `<p>Battery check-ins: ${S.battery.map(b => esc(b.level)).join(", ")}</p>` : ""}
      ${v.length ? `<ul class="plain">${v.map(fmt).join("")}</ul>` : '<p class="muted">Nothing yet.</p>'}
      ${S.passport && Object.keys(S.passport).length ? `<details class="passage"><summary>Support Passport</summary>${passportHtml()}</details>` : ""}`;
}
function learnerVoiceLines() {
  const out = [];
  if (S.battery.length) out.push("Battery check-ins: " + S.battery.map(b => b.level).join(", "));
  (S.voice || []).forEach(x => out.push(`Learner's voice, ${x.kind}: ${x.what}${x.where ? " (" + x.where + ")" : ""}`));
  if (S.passport) PASS.forEach(([key, title]) => { if ((S.passport[key] || []).length) out.push(`Passport, ${title} ${S.passport[key].join("; ")}`); });
  return out;
}

// ---------- Goodbye ----------
function goodbye() {
  planDone("finish");
  inGame = false; bar("child");
  const played = S.played.map(id => EXERCISES.find(x => x.id === id).name).concat(S.learned.map(id => UNITS.find(u => u.id === id).title));
  if (!played.length) { thanks(W("Thank you for coming. You can give the tablet back to the grown-up.", "Thank you for coming. You can hand the device back.")); return; }
  const opts = played.concat(["Nothing really", "Not sure"]);
  reflectSimple("What did you like?", opts, a => { S.liked = a; reflectSimple("What was tricky?", played.concat(["Nothing was tricky", "Not sure"]), b => { S.tricky = b; thanks(W("Thank you for playing! You can give the tablet back to the grown-up.", "Thank you for taking part. You can hand the device back."), sessionSummary()); }); });
}
function reflectSimple(q, options, done) {
  const text = q + " Choose one.";
  currentReturnSay = currentSay = text;
  render(`<section class="card"><h2>${esc(q)}</h2><div class="choices">${options.map((o, i) => `<button class="choice" data-g="${i}"${i === 0 ? " data-focus" : ""}><span class="lbl">${esc(o)}</span></button>`).join("")}</div></section>`);
  setSay(text);
  on("[data-g]", e => done(options[+e.currentTarget.dataset.g]));
}
function sessionSummary() {
  const ids = S.played, lines = [];
  if (ids.some(i => ["pattern", "memory", "sort"].includes(i))) lines.push("practised careful thinking.");
  if (ids.some(i => ["vetkoek", "robot"].includes(i))) lines.push("solved interesting problems.");
  if (ids.some(i => ["paint", "kraal", "comic"].includes(i))) lines.push("explored new ideas.");
  if (S.learned.length) lines.push("strengthened your thinking in a lesson.");
  if (S.obs.some(o => o.items.some(it => it.hints > 0 || it.checks > 1))) lines.push("showed persistence.");
  if (S.obs.some(o => o.reflection && o.reflection !== "Not sure")) lines.push("reflected on your learning.");
  return lines;
}
function thanks(text, summary) {
  S.inExercise = false; bar("child");
  const sum = summary && summary.length ? summary : null;
  const spoken = (sum ? "Today you " + sum.join(" ") + " Thank you for learning with us today. " : "") + text;
  currentReturnSay = currentSay = spoken;
  render(`<section class="card" style="text-align:center;align-items:center">${faceSvg("happy")}
      ${sum ? `<div style="text-align:left;align-self:stretch"><h2>Today you:</h2><ul class="plain">${sum.map(l => `<li>${esc(l)}</li>`).join("")}</ul><p style="margin-top:10px">Thank you for learning with us today.</p></div>` : ""}
      <h1>${esc(text)}</h1><p class="muted">Adult: hold the Grown-up button to see the session notes.</p></section>`);
  setSay(spoken);
}

// ---------- Adult view ----------
function openAdult() {
  stopSpeaking(); closeLayer(); bar("adult");
  const mins = S.started ? Math.max(1, Math.round((Date.now() - S.started) / 60000)) : 0;
  const needText = { start: "Start playing", break: "A quiet break first", help: "Help from a grown-up" }[S.need] || "Not chosen";
  const obsHtml = S.obs.length ? S.obs.map(o => `
      <div class="obs-item">
        <b>${esc(o.ex)}</b> · ${esc(o.cat)} · ${esc(o.domain)}${o.exampleOpened ? " · example opened" : ""}
        <div class="obs">${o.items.map(it => { const st = statusOf(it); return `<div><span class="status st-${st}">${STATUS_TEXT[st]}</span> ${esc(it.title)}${it.open ? "" : ": " + (it.movedOn ? "moved on" : (it.latestMatched ? "matched" : "not matched"))} · checks ${it.checks} · hints ${it.hints}${it.mode ? " · answered by " + esc(it.mode) : ""}${it.moves ? " · moves " + it.moves : ""}</div>`; }).join("")}</div>
        <div>Learner said what helped: <b>${esc(o.reflection)}</b></div>
        ${o.id && SPEC[o.id] ? `<div class="note">What this shows: ${esc(SPEC[o.id].teacher)}${o.id === "pattern" ? "" : " (draft, awaiting specialist review)"}</div>` : ""}
        ${o.id && CAPS_LINK[o.id] ? `<div class="note">Curriculum link (proposed): ${esc(curriculumLink(o.id, S.cohort))}</div>` : ""}
        ${o.feedback ? `<div class="note">Feedback the learner saw: ${esc(o.feedback)}</div>` : ""}
        ${o.extra ? `<div>${esc(o.extra)}</div>` : ""}
      </div>`).join("") : '<p class="muted">No games finished yet.</p>';
  render(`
      <section class="card">
        <p class="eyebrow">Grown-up view · session notes</p>
        <h1>Learner ${esc(S.code)}</h1>
        <p class="note">Age group ${COHORTS[S.cohort]} · ${LEVEL[S.band]} · answers by ${S.answer === "build" ? "building step by step" : "choosing pictures"}${S.assisted ? " · points while an adult taps" : ""} · about ${mins} minute(s) so far · ${S.declined ? "chose not to take part" : "what they needed at the start: " + esc(needText)}</p>
        <p class="note">These are task observations, not a diagnosis or proof of mastery. Help from a person is not recorded.</p>
        <div class="obs">${obsHtml}</div>
        ${S.liked ? `<p>Liked: <b>${esc(S.liked)}</b> · Tricky: <b>${esc(S.tricky || "-")}</b></p>` : ""}
        ${learnerVoiceHtml()}
        <label for="aNotes" style="display:flex;flex-direction:column;gap:6px;font-family:var(--font-display)">Your notes (no names)
          <textarea id="aNotes" rows="5">${esc(S.adultNotes)}</textarea></label>
        <div class="row">
          <button class="btn" id="aCopy">Copy session notes</button>
          <button class="btn" id="aBack">Back to the learner's screen</button>
          <button class="btn" id="aDash">Demo dashboard</button>
          <button class="btn primary" id="aEnd">End session and clear</button>
        </div>
        <p class="note" id="aMsg"></p>
      </section>`);
  const ta = document.getElementById("aNotes");
  ta.addEventListener("input", () => { S.adultNotes = ta.value; });
  on("#aDash", dashboard);
  on("#aBack", () => { if (S.played.length || S.need) home(); else assent(); });
  on("#aCopy", async () => {
    const lines = [`2to.iQ try-out · Learner ${S.code} · age group ${COHORTS[S.cohort]} · ${LEVEL[S.band]} · answers by ${S.answer}${S.assisted ? " (adult taps)" : ""} · ${new Date().toISOString().slice(0, 10)}`];
    S.obs.forEach(o => { lines.push(`${o.ex} (${o.cat}; ${o.domain})${o.exampleOpened ? " [example opened]" : ""}`); o.items.forEach(it => lines.push(`  - ${it.title}: ${STATUS_TEXT[statusOf(it)]}; checks ${it.checks}; hints ${it.hints}; answered by ${it.mode}`)); lines.push(`  Learner said what helped: ${o.reflection}`); if (o.extra) lines.push("  " + o.extra); });
    S.obs.forEach(o => { if (o.id && CAPS_LINK[o.id]) lines.push(`Curriculum link for ${o.ex} (proposed): ${curriculumLink(o.id, S.cohort)}`); });
    learnerVoiceLines().forEach(l => lines.push(l));
    if (S.liked) lines.push(`Liked: ${S.liked}. Tricky: ${S.tricky}.`);
    if (S.adultNotes) lines.push("Notes: " + S.adultNotes);
    const txt = lines.join("\n");
    try { await navigator.clipboard.writeText(txt); document.getElementById("aMsg").textContent = "Copied. Paste it into your notes."; }
    catch (e) { ta.value = txt + (S.adultNotes ? "" : ""); ta.select(); document.getElementById("aMsg").textContent = "Copy didn't work here. The notes are selected in the box, so copy them yourself."; }
  });
  on("#aEnd", () => {
    overlay(`<div class="card"><h2>End this session?</h2><p>${S.demoLearner != null ? "This made-up session will be added to " + esc(S.code) + "'s demo history. The notes on this screen will then be cleared." : "All notes on this screen will be cleared. Copy them first if you need them."}</p>
        <div class="row"><button class="btn" id="xNo" data-focus>Keep the session</button><button class="btn primary" id="xYes">End and clear</button></div></div>`);
    document.getElementById("xNo").onclick = closeLayer;
    document.getElementById("xYes").onclick = () => {
      closeLayer();
      const demoI = S.demoLearner, added = addSessionToDemo();
      const keep = { grade: S.grade, lessonLen: S.lessonLen, cohort: S.cohort, band: S.band, answer: S.answer, assisted: S.assisted, autoRead: S.autoRead, theme: S.theme, contrast: S.contrast, motion: S.motion, font: S.font, textSize: S.textSize };
      Object.assign(S, { code: demoI != null ? "T01" : nextCode(S.code), demoLearner: null, started: null, need: null, played: [], learned: [], avatar: null, welcome: null, my: { how: "read", calm: false, plain: false, spacing: false, ruler: false, highlight: true, vol: "1", speed: "normal", theme: "none", scan: false, scanSpeed: "medium" }, plan: null, planStep: 0, battery: [], voice: [], passport: null, lastBattery: null, obs: [], liked: null, tricky: null, adultNotes: "", declined: false }, keep);
      if (demoI != null) { learnerPage(demoI, "teacher"); if (added) { const m = document.createElement("p"); m.className = "feedback"; m.setAttribute("role", "status"); m.textContent = `Today's session was added: ${added} new record${added > 1 ? "s" : ""} in the history below.`; $main.querySelector(".card").insertBefore(m, $main.querySelector("[role=tablist]")); } }
      else setup();
    };
  });
}
function nextCode(c) { const m = /^(\D*)(\d+)$/.exec(c || ""); if (!m) return "T01"; const n = String(+m[2] + 1).padStart(m[2].length, "0"); return m[1] + n; }
