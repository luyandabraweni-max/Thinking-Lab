"use strict";

// ---------- Invention Workshop (Creativity and Metacognition: designing, testing, improving) ----------
// Get water from the river to the garden. Many designs work. The learner builds, tests, sees exactly where and why the
// water stops, improves it, then meets a new constraint and names their invention. Records how many tests, whether
// they revise after a failure, how many different designs they try, and how they judge their own invention.
const IW_PARTS = {
  pipe: { name: "Pipe", cost: 3, speed: 3, does: "Carries water along flat ground and across gaps.", ok: ["flat", "ditch"] },
  gutter: { name: "Gutter", cost: 1, speed: 3, does: "An open channel. Cheap, but only on flat ground.", ok: ["flat"] },
  bucket: { name: "Buckets", cost: 1, speed: 1, does: "People carry water anywhere. Slow and tiring.", ok: ["flat", "ditch", "uphill"] },
  pump: { name: "Pump", cost: 6, speed: 3, does: "Pushes water uphill or along. Needs power.", ok: ["flat", "uphill"], power: true },
  screw: { name: "Water screw", cost: 4, speed: 2, does: "A turning screw that lifts water up a slope. Needs power.", ok: ["uphill"], power: true }
};
const IW_POWER = { none: { name: "No power", cost: 0 }, crank: { name: "Hand crank", cost: 1, slow: true }, windmill: { name: "Windmill", cost: 5, wind: true }, solar: { name: "Solar panel", cost: 8 } };
const IW_WHY = {
  ditch: { gutter: "The gutter is open underneath, so the water pours into the ditch.", pump: "A pump can't hold water up across a gap. Something has to carry it over.", screw: "A water screw only lifts water up a slope. It can't cross a gap." },
  uphill: { pipe: "Water won't flow uphill by itself. It runs back down!", gutter: "Water won't flow uphill in a gutter. It runs back down!" },
  flat: { screw: "A water screw lifts water up slopes. On flat ground it just spins." }
};
const IW_TERRAIN = { flat: "flat ground", ditch: "a ditch", uphill: "a slope going up" };
// Follows the water from the river: the first part that can't do its job (or has no power) stops it, with the reason.
function iwTest(segs, parts, power, rules) {
  for (let i = 0; i < segs.length; i++) {
    const id = parts[i], p = IW_PARTS[id];
    if (!p) return { at: i, why: "There's a gap here, so the water spills out." };
    if (rules.noBuckets && id === "bucket") return { at: i, why: "No buckets this time. The water has to flow by itself." };
    if (!p.ok.includes(segs[i])) return { at: i, why: (IW_WHY[segs[i]] || {})[id] || `The ${p.name.toLowerCase()} can't cross ${IW_TERRAIN[segs[i]]}.` };
    if (p.power && power === "none") return { at: i, why: `The ${p.name.toLowerCase()} needs power. Nothing is turning it.` };
    if (p.power && power === "windmill" && rules.noWind) return { at: i, why: "There's no wind today, so the windmill doesn't turn." };
  }
  const cost = parts.reduce((s, id) => s + IW_PARTS[id].cost, 0) + (parts.some(id => IW_PARTS[id].power) ? IW_POWER[power].cost : 0);
  if (rules.budget && cost > rules.budget) return { at: -1, why: `It works, but it costs ${cost} coins. The budget is ${rules.budget}.`, cost };
  const slow = parts.some(id => id === "bucket") || (power === "crank" && parts.some(id => IW_PARTS[id].power));
  return { ok: true, cost, speed: Math.min(...parts.map(id => IW_PARTS[id].speed)) - (slow && power === "crank" ? 1 : 0) };
}
const IW_ICON = {
  pipe: '<rect x="4" y="15" width="32" height="10" rx="3" fill="var(--muted)" stroke="var(--ink)" stroke-width="2"/><path d="M8 15 V25 M32 15 V25" stroke="var(--ink)" stroke-width="2"/>',
  gutter: '<path d="M4 14 Q20 34 36 14" fill="none" stroke="var(--ink)" stroke-width="6" stroke-linecap="round"/><path d="M4 14 Q20 34 36 14" fill="none" stroke="var(--gold-soft)" stroke-width="2.5" stroke-linecap="round"/>',
  bucket: '<path d="M10 14 H30 L27 34 H13 Z" fill="var(--shape-b)" stroke="var(--ink)" stroke-width="2" stroke-linejoin="round"/><path d="M10 14 Q20 2 30 14" fill="none" stroke="var(--ink)" stroke-width="2"/>',
  pump: '<rect x="11" y="14" width="18" height="20" rx="3" fill="var(--shape-a)" stroke="var(--ink)" stroke-width="2"/><path d="M20 14 V5 H32" stroke="var(--ink)" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="20" cy="24" r="4" fill="var(--surface)" stroke="var(--ink)" stroke-width="1.5"/>',
  screw: '<g transform="rotate(-30 20 20)"><rect x="17" y="3" width="6" height="34" rx="2" fill="var(--muted)" stroke="var(--ink)" stroke-width="1.5"/><path d="M12 8 L28 12 M12 15 L28 19 M12 22 L28 26 M12 29 L28 33" stroke="var(--ink)" stroke-width="2.5" stroke-linecap="round"/></g>',
  none: '<circle cx="20" cy="20" r="12" fill="none" stroke="var(--muted)" stroke-width="2" stroke-dasharray="4 3"/>',
  crank: '<circle cx="20" cy="20" r="11" fill="none" stroke="var(--ink)" stroke-width="3"/><path d="M20 20 L29 11 L34 15" stroke="var(--ink)" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="20" cy="20" r="3" fill="var(--ink)"/>',
  windmill: '<path d="M20 20 L20 38" stroke="var(--ink)" stroke-width="3"/><g class="iw-blades" fill="var(--surface)" stroke="var(--ink)" stroke-width="1.6"><path d="M20 20 L14 3 L22 5 Z"/><path d="M20 20 L37 14 L35 22 Z"/><path d="M20 20 L26 37 L18 35 Z"/><path d="M20 20 L3 26 L5 18 Z"/></g><circle cx="20" cy="20" r="2.5" fill="var(--ink)"/>',
  solar: '<path d="M6 26 L14 8 H34 L26 26 Z" fill="var(--shape-c)" stroke="var(--ink)" stroke-width="2" stroke-linejoin="round"/><path d="M10 17 H30 M20 8 L16 26" stroke="var(--surface)" stroke-width="1.5"/><path d="M20 26 V36 M14 36 H26" stroke="var(--ink)" stroke-width="2.5"/>'
};
const iwIcon = (id, px) => `<svg width="${px}" height="${px}" viewBox="0 0 40 40" aria-hidden="true">${IW_ICON[id]}</svg>`;
const IW_GROUND = { flat: "M0 44 H80", ditch: "M0 34 H22 Q40 70 58 34 H80", uphill: "M0 52 L80 18" };
const IW_LEVELS = {
  younger: { segs: ["flat", "ditch", "flat"], parts: ["pipe", "gutter", "bucket"], power: false,
    tasks: [{ title: "Get water to the garden", rules: {} }, { title: "Make it flow by itself", say: "Carrying buckets is slow and tiring. Can you make the water flow all the way by itself?", rules: { noBuckets: true } }] },
  older: { segs: ["flat", "uphill", "ditch", "uphill"], parts: ["pipe", "gutter", "bucket", "pump", "screw"], power: true,
    tasks: [{ title: "Get water to the garden", rules: {} }, { title: "No wind, small budget", say: "The wind has stopped, and you only have 20 coins. Can you still get water to the garden, with no buckets?", rules: { noWind: true, budget: 20, noBuckets: true } }] }
};

function gameInvent(run) {
  labStart(run);
  const lv = IW_LEVELS[S.band === "older" ? "older" : "younger"], items = [], designs = new Set(); let ti = 0;
  const parts = lv.segs.map(() => null); let power = "none";
  const doTask = () => {
    const task = lv.tasks[ti], rec = newRec(task.title, { tests: 0, revisions: 0, mode: "designed" });
    const o = { hint: 0, hints: [W("Look at each piece of ground. What could carry water over it?", "Check each section: flat, gap or slope. Which parts can handle it?"),
      lv.power ? "Slopes need something that lifts water, and lifting needs power." : "A gap needs something closed, so the water can't fall out.",
      `One way: ${lv.segs.map((sg, i) => `${IW_TERRAIN[sg]}: ${IW_PARTS[{ flat: "pipe", ditch: "pipe", uphill: "screw" }[sg]].name.toLowerCase()}`).join("; ")}${lv.power ? "; power: hand crank" : ""}.`] };
    let sel = parts.findIndex(p => !p), result = null, wet = -1, busy = false, done = false, failedLast = false, fb = "";
    if (sel < 0) sel = 0;
    const say = task.say || `${run.x.name}. Get water from the river to the garden. Choose a part for each piece of ground, then test it.`;
    const draw = () => {
      currentReturnSay = currentSay = fb || say;
      const cost = parts.reduce((s, id) => s + (id ? IW_PARTS[id].cost : 0), 0) + (parts.some(id => id && IW_PARTS[id].power) ? IW_POWER[power].cost : 0);
      const slot = (sg, i) => {
        const flows = result && (result.ok || result.at < 0 || i < result.at), stops = result && !result.ok && i === result.at; // at -1: works, but over budget
        const state = result && i <= wet ? (flows ? " wet" : "") + (stops ? " stop" : "") : "";
        return `<button class="iw-slot${sel === i ? " sel" : ""}${state}" data-slot="${i}" aria-pressed="${sel === i}" aria-label="Part ${i + 1}, over ${IW_TERRAIN[sg]}: ${parts[i] ? IW_PARTS[parts[i]].name : "empty"}"${busy || done ? " disabled" : ""}>
            <svg viewBox="0 0 80 60" aria-hidden="true"><path class="iw-ground" d="${IW_GROUND[sg]}"/><path class="iw-water" d="${IW_GROUND[sg]}"/></svg>
            <span class="iw-part">${parts[i] ? iwIcon(parts[i], 34) : '<span class="iw-empty">?</span>'}</span></button>`;
      };
      render(`<section class="card">${labHead(run, `${ti + 1} of ${lv.tasks.length}`)}
          <h2>${esc(task.title)}</h2>
          ${task.say ? `<p class="lead">${esc(task.say)}</p>` : ""}
          <div class="iw-line"><span class="iw-end" aria-hidden="true">🏞️<small>River</small></span>${lv.segs.map(slot).join("")}<span class="iw-end" aria-hidden="true">🌻<small>Garden</small></span></div>
          <p class="sr">From the river to the garden: ${lv.segs.map((sg, i) => `${IW_TERRAIN[sg]} with ${parts[i] ? "a " + IW_PARTS[parts[i]].name.toLowerCase() : "nothing yet"}`).join(", then ")}.</p>
          ${busy || done ? "" : `<p class="eyebrow">Parts for ${esc(IW_TERRAIN[lv.segs[sel]])} (part ${sel + 1})</p>
          <div class="iw-tray">${lv.parts.map(id => `<button class="choice iw-card" data-part="${id}" aria-pressed="${parts[sel] === id}">${iwIcon(id, 36)}<span class="lbl"><b>${IW_PARTS[id].name}</b> · ${IW_PARTS[id].cost} coin${IW_PARTS[id].cost > 1 ? "s" : ""}<br><small>${esc(IW_PARTS[id].does)}</small></span></button>`).join("")}</div>
          ${lv.power ? `<p class="eyebrow">Power</p><div class="iw-tray">${Object.entries(IW_POWER).map(([id, p]) => `<button class="choice iw-card" data-power="${id}" aria-pressed="${power === id}">${iwIcon(id, 30)}<span class="lbl"><b>${p.name}</b>${p.cost ? ` · ${p.cost} coins` : ""}</span></button>`).join("")}</div>` : ""}`}
          <p class="iw-cost">${icon("🪙")} Cost: <b>${cost}</b> coins${task.rules.budget ? ` (budget ${task.rules.budget})` : ""}</p>
          ${thinkPrompt()}${hintHtml(o)}
          ${fb ? `<div class="feedback${done ? "" : " gentle"}" role="status">${esc(fb)}</div>` : ""}
          ${done ? `<div class="row"><button class="btn primary" id="iwNext" data-focus>${ti + 1 < lv.tasks.length ? "Next challenge" : "Name my invention"}</button></div>`
            : labRow(o, ["iwTest", `${icon("💧")}<span>Test it</span>`, busy])}
        </section>`);
      on("[data-slot]", e => { sel = +e.currentTarget.dataset.slot; draw(); const b = $main.querySelector(`[data-slot="${sel}"]`); if (b) b.focus({ preventScroll: true }); });
      on("[data-part]", e => {
        parts[sel] = e.currentTarget.dataset.part; run.acted = true; result = null; wet = -1; fb = "";
        if (failedLast) { rec.revisions++; failedLast = false; }
        const next = parts.findIndex(p => !p); if (next >= 0) sel = next;
        draw(); const b = $main.querySelector(next >= 0 ? `[data-slot="${sel}"]` : "#iwTest"); if (b) b.focus({ preventScroll: true });
      });
      on("[data-power]", e => { power = e.currentTarget.dataset.power; result = null; fb = ""; if (failedLast) { rec.revisions++; failedLast = false; } draw(); });
      on("#iwTest", () => {
        const r = iwTest(lv.segs, parts, power, task.rules); rec.tests++; rec.checks++; run.acted = true; designs.add(parts.join("+") + "|" + power);
        if (rec.firstMatched === null) rec.firstMatched = !!r.ok; rec.latestMatched = !!r.ok;
        result = r; busy = true; fb = "";
        const reach = r.ok ? lv.segs.length - 1 : r.at < 0 ? lv.segs.length - 1 : r.at;
        playFrames(run, reach + 1, 650, i => { wet = i; draw(); }, () => {
          busy = false; wet = reach;
          if (r.ok) { done = true; fb = `Water reached the garden! It cost ${r.cost} coins${r.speed <= 1 ? ", but it's slow" : r.speed >= 3 ? ", and it flows fast" : ""}.${rec.tests === 1 ? " It worked first time." : " You tested, found the problem and fixed it."}`; }
          else { failedLast = true; fb = r.at >= 0 ? `The water stopped at part ${r.at + 1}. ${r.why}` : r.why; }
          draw(); speakNow(fb);
        });
      });
      on("#iwNext", () => { items.push(rec); ti++; ti < lv.tasks.length ? doTask() : nameIt(); });
      on("#lkSkip", () => { rec.movedOn = true; items.push(rec); ti++; ti < lv.tasks.length ? doTask() : nameIt(); });
      wireHints(o, rec, draw);
    };
    labSay(say); draw();
  };
  // Open-ended: the learner names the invention and judges what makes it good. There is no right answer.
  const nameIt = () => {
    const rec = newRec("Name my invention", { open: true, mode: "named and judged" }), goods = ["It's cheap", "Water flows fast", "It needs no electricity", "It's easy to fix", "It uses the wind or sun", "I'd make it even better next time"];
    const names = ["The Water Wonder", "Garden Helper 3000", "The River Runner"]; let name = null, chosen = [];
    const draw = () => {
      currentReturnSay = currentSay = "Name your invention, and choose what is good about it.";
      render(`<section class="card">${labHead(run, "Your invention")}<h2>Name your invention</h2>
          <div class="choices">${names.map(n => `<button class="choice" data-nm="${esc(n)}" aria-pressed="${name === n}"><span class="lbl">${esc(n)}</span></button>`).join("")}</div>
          <label for="iwName" class="sw-type">Or type your own name<input id="iwName" maxlength="40" value="${name && !names.includes(name) ? esc(name) : ""}"></label>
          <h3>What is good about it? Choose any.</h3>
          <div class="choices">${goods.map((g, i) => `<button class="choice" data-gd="${i}" aria-pressed="${chosen.includes(i)}"><span class="lbl">${esc(g)}</span></button>`).join("")}</div>
          <div class="row"><button class="btn primary" id="iwDone">That's my invention</button></div></section>`);
      const inp = document.getElementById("iwName"); inp.addEventListener("input", () => { if (inp.value.trim()) name = inp.value.trim(); });
      on("[data-nm]", e => { name = e.currentTarget.dataset.nm; draw(); });
      on("[data-gd]", e => { const i = +e.currentTarget.dataset.gd; chosen = chosen.includes(i) ? chosen.filter(x => x !== i) : chosen.concat(i); draw(); const b = $main.querySelector(`[data-gd="${i}"]`); if (b) b.focus({ preventScroll: true }); });
      on("#iwDone", () => { rec.latestMatched = true; rec.choice = name || "No name"; rec.judged = chosen.map(i => goods[i]); items.push(rec);
        labReflect(run, W("What did you do when the water stopped?", "What did you do when a design failed?"), ["I changed one part", "I changed lots of parts", "I used a hint", "It never stopped"],
          r => finishExercise(run, items, r, null, `Invention: "${rec.choice}". Judged it: ${rec.judged.join(", ") || "no qualities chosen"}. Tests: ${items.filter(i => i.tests != null).map(i => i.tests).join(", ")}. Revisions after a failed test: ${items.reduce((s, i) => s + (i.revisions || 0), 0)}. Different designs tried: ${designs.size}.`)); });
    };
    labSay("Name your invention, and choose what is good about it."); draw();
  };
  doTask();
}
