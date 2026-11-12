"use strict";

// =====================================================================
// NEURODIVERGENT SUPPORTS: My way, plan, talk board, scanning, reading ruler,
// word highlighting, movement breaks, battery check-in, Support Passport, child feedback
// =====================================================================
const icon = e => `<span class="em" aria-hidden="true">${e}</span>`;
function logVoice(kind, what) { S.voice.push({ kind, what, where: currentTitle(), at: new Date() }); }
function currentTitle() { const h = $main.querySelector("h1, h2"); return h ? h.textContent.trim().slice(0, 80) : ""; }

// ---------- 1. My way ----------
function applyMyWay() {
  const m = S.my;
  root.toggleAttribute("data-calm", !!m.calm); updateMotion();
  root.toggleAttribute("data-grey", !!m.grey);
  if (m.palette && m.palette !== "standard") root.setAttribute("data-palette", m.palette); else root.removeAttribute("data-palette");
  root.toggleAttribute("data-plain", !!m.plain);
  root.toggleAttribute("data-spacing", !!m.spacing);
  root.toggleAttribute("data-pictures", m.how === "pictures");
  S.autoRead = m.how === "listen";
  ruler(m.ruler); scanning(m.scan);
}
function openMyWay() {
  const m = S.my;
  const opt = (key, val, label, em) => `<button class="choice" data-mw="${key}:${val}" aria-pressed="${String(m[key]) === String(val)}">${em ? icon(em) : ""}<span class="lbl">${label}</span></button>`;
  const tog = (key, label, em) => `<button class="choice" data-mt="${key}" aria-pressed="${!!m[key]}">${icon(em)}<span class="lbl">${label}</span></button>`;
  const draw = () => {
    overlay(`<div class="card myway">
        <h2>My way</h2>
        <p class="muted">Choose what helps you. You can change it any time.</p>
        <p class="eyebrow">How I like to learn</p>
        <div class="choices">${opt("how", "read", "I read it myself", "📖")}${opt("how", "listen", "Read it to me", "👂")}${opt("how", "pictures", "Pictures help me", "🖼️")}</div>
        <p class="eyebrow">My screen</p>
        <div class="choices"><button class="choice" data-low aria-pressed="${lowStim()}">${icon("🌙")}<span class="lbl">Low stimulation: grey, calm, still and quiet</span></button>${tog("calm", "Calm screen", "🍃")}${tog("grey", "Grey screen (no colours)", "🔘")}${tog("plain", "Plain words", "💬")}${tog("spacing", "More space between letters", "↔️")}${tog("ruler", "Reading ruler", "📏")}${tog("highlight", "Light up words as they are read", "✨")}${tog("captions", "Show the words when it talks", "💬")}${hasSigns() ? tog("sign", "Sign language videos", "🤟") : ""}</div>
        <p class="eyebrow">Colours I can see best</p>
        <div class="choices">${opt("palette", "standard", "Usual colours", "🎨")}${opt("palette", "redgreen", "Red and green look alike", "👁️")}${opt("palette", "blueyellow", "Blue and yellow look alike", "👁️")}</div>
        <p class="eyebrow">Sound</p>
        <div class="choices">${`<button class="choice" data-mq aria-pressed="${!S.quiet}">${icon(S.quiet ? "🔇" : "🔊")}<span class="lbl">${S.quiet ? "Sound is off" : "Sound is on"}</span></button>`}${opt("vol", "0.5", "Quiet voice", "🔈")}${opt("vol", "0.8", "Medium voice", "🔉")}${opt("vol", "1", "Loud voice", "🔊")}</div>
        <div class="choices">${opt("speed", "slow", "Slower voice", "🐢")}${opt("speed", "normal", "Normal voice", "🙂")}${opt("speed", "fast", "Faster voice", "🐇")}</div>
        <p class="eyebrow">My favourite topic (for maths stories)</p>
        <div class="choices">${opt("theme", "soccer", "Soccer", "⚽")}${opt("theme", "animals", "Animals", "🐾")}${opt("theme", "space", "Space", "🚀")}${opt("theme", "music", "Music", "🎵")}${opt("theme", "cars", "Cars", "🚗")}${opt("theme", "none", "No topic", "➖")}</div>
        <div class="row"><button class="btn primary" id="mwDone" data-focus>Done</button><button class="btn" id="mwPass">My Support Passport</button><button class="btn" id="mwTell">Tell us something</button></div>
      </div>`);
    $layer.querySelectorAll("[data-mw]").forEach(b => b.onclick = () => { const [k, v] = b.dataset.mw.split(":"); m[k] = v; applyMyWay(); draw(); const again = $layer.querySelector(`[data-mw="${k}:${v}"]`); if (again) again.focus(); });
    $layer.querySelectorAll("[data-mt]").forEach(b => b.onclick = () => { const k = b.dataset.mt; m[k] = !m[k]; applyMyWay(); draw(); const again = $layer.querySelector(`[data-mt="${k}"]`); if (again) again.focus(); });
    $layer.querySelector("[data-low]").onclick = () => { const on = !lowStim(); m.grey = m.calm = S.motion = S.quiet = on; if (on) stopSpeaking(); applySettings(); draw(); $layer.querySelector("[data-low]").focus(); };
    $layer.querySelector("[data-mq]").onclick = () => { S.quiet = !S.quiet; if (S.quiet) stopSpeaking(); draw(); $layer.querySelector("[data-mq]").focus(); };
    document.getElementById("mwDone").onclick = () => { closeLayer(); logVoice("my way", describeMyWay()); refreshBar(); };
    document.getElementById("mwPass").onclick = () => { closeLayer(); passportStart(); };
    document.getElementById("mwTell").onclick = () => openTellUs();
  };
  setSay("My way. Choose what helps you. You can change it any time.");
  draw();
}
// Low stimulation is one tap for sensory-sensitive learners: greyscale, calm screen, no movement and no sound together
const lowStim = () => !!(S.my.grey && S.my.calm && S.motion && S.quiet);
function describeMyWay() {
  const m = S.my, out = [{ read: "reads it", listen: "listens", pictures: "pictures help" }[m.how]];
  if (m.calm) out.push("calm screen"); if (m.grey) out.push("grey screen"); if (m.palette && m.palette !== "standard") out.push(PALETTES[m.palette].toLowerCase()); if (m.plain) out.push("plain words"); if (m.spacing) out.push("more spacing"); if (m.ruler) out.push("reading ruler"); if (m.captions) out.push("captions");
  if (S.quiet) out.push("sound off"); if (m.theme && m.theme !== "none") out.push("topic: " + m.theme);
  return out.join(", ");
}
let barMode = "child";
function refreshBar() { bar(barMode); }

// ---------- 2. My plan today ----------
const PLAN_STEPS = { lesson: ["📚", "A lesson"], lab: ["🧪", "Thinking Lab"], skill: ["🛠️", "A skill"], brk: ["🌿", "A break"], avatar: ["🎨", "My character"], passport: ["🪪", "My passport"], finish: ["🏁", "Finish"] };
// A plan step: a kind of activity ("lesson"), or a particular game ("x:light") or lesson ("u:<unit id>") an adult chose.
function planStepInfo(k) {
  if (k.startsWith("x:")) { const x = EXERCISES.find(e => e.id === k.slice(2)); return x ? [x.pic, x.name] : PLAN_STEPS.lab; }
  if (k.startsWith("u:")) { const u = UNITS.find(e => e.id === k.slice(2)); return u ? ["📚", u.title] : PLAN_STEPS.lesson; }
  return PLAN_STEPS[k] || PLAN_STEPS.finish;
}
function planHtml() {
  if (!S.plan) return `<p class="muted">You can make a plan for today, so you know what comes next.</p><div class="row"><button class="btn" id="planMake">Make my plan</button></div>`;
  return `${S.planBy ? `<p class="note">${icon("🧑‍🏫")} ${esc(S.planBy)} made this plan for you.</p>` : ""}<ol class="plan-strip" aria-label="My plan today">${S.plan.map((k, i) => `<li class="${i < S.planStep ? "done" : i === S.planStep ? "now" : ""}"${i === S.planStep ? ' aria-current="step"' : ""}>${icon(planStepInfo(k)[0])}<span><span class="sr">${i < S.planStep ? "Done: " : i === S.planStep ? "Now: " : "Later: "}</span>${esc(planStepInfo(k)[1])}</span></li>`).join("")}</ol>
      <div class="row">${S.planStep < S.plan.length ? `<button class="btn primary" id="planGo">Start: ${esc(planStepInfo(S.plan[S.planStep])[1])}</button>` : `<p>You finished your plan.</p>`}<button class="btn quiet" id="planMake">Change my plan</button></div>`;
}
function wirePlan() {
  on("#planMake", openPlanner);
  on("#planGo", () => {
    const k = S.plan[S.planStep], x = k.startsWith("x:") && EXERCISES.find(e => e.id === k.slice(2)), u = k.startsWith("u:") && UNITS.find(e => e.id === k.slice(2));
    if (x) { needsBattery() ? batteryCheck(() => startExercise(x)) : startExercise(x); return; }
    if (u) { needsBattery() ? batteryCheck(() => unitIntro(u)) : unitIntro(u); return; }
    ({ lesson: () => needsBattery() ? batteryCheck(learnHome) : learnHome(), lab: () => needsBattery() ? batteryCheck(labHome) : labHome(), skill: () => needsBattery() ? batteryCheck(skillsHome) : skillsHome(), brk: () => breakScreen("Time for your break. Stay as long as you like."), avatar: () => avatarBuilder(), passport: passportStart, finish: goodbye })[k](); });
}
// A step is done by its kind, or by the particular game or lesson it names.
function planDone(kind, id) { if (!S.plan) return; const k = S.plan[S.planStep]; if (k === kind || (id && k === { lab: "x:", lesson: "u:" }[kind] + id)) S.planStep++; }
function openPlanner() {
  let pick = [];
  const draw = () => {
    overlay(`<div class="card"><h2>Make my plan</h2><p class="muted">Tap the things you want to do, in order. Up to 5.</p>
        <div class="choices">${Object.entries(PLAN_STEPS).map(([k, v]) => `<button class="choice" data-pl="${k}">${icon(v[0])}<span class="lbl">${v[1]}</span></button>`).join("")}</div>
        <ol class="plan-strip" aria-label="Your plan so far">${pick.length ? pick.map(k => `<li>${icon(PLAN_STEPS[k][0])}<span>${PLAN_STEPS[k][1]}</span></li>`).join("") : '<li class="muted">Nothing yet</li>'}</ol>
        <div class="row"><button class="btn primary" id="plSave"${pick.length ? "" : " disabled"}>Save my plan</button>${pick.length ? '<button class="btn" id="plUndo">Take the last one off</button>' : ""}<button class="btn quiet" id="plClose">Close</button></div></div>`);
    $layer.querySelectorAll("[data-pl]").forEach(b => b.onclick = () => { if (pick.length < 5) pick.push(b.dataset.pl); draw(); const again = $layer.querySelector(`[data-pl="${b.dataset.pl}"]`); if (again) again.focus(); });
    const u = document.getElementById("plUndo"); if (u) u.onclick = () => { pick.pop(); draw(); };
    document.getElementById("plSave").onclick = () => { S.plan = pick.slice(); S.planStep = 0; S.planBy = null; logVoice("plan", pick.map(k => PLAN_STEPS[k][1]).join(", ")); closeLayer(); home(); };
    document.getElementById("plClose").onclick = closeLayer;
  };
  setSay("Make my plan. Tap the things you want to do, in order.");
  draw();
}
