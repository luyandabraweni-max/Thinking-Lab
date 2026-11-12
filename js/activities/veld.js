"use strict";

// ---------- Veld Balance (Inquiry and Systems Thinking: cause and effect in a system) ----------
// A living veld: rain grows grass, springbok eat grass, cheetahs eat springbok. The learner predicts what one change
// will do, watches the seasons ripple through the system, then experiments with their own veld. Records predictions,
// and in the open experiment, how many runs and whether they change one thing at a time.
// The model was tuned so the veld starts in balance and each change has a clear, explainable ripple.
const VELD_START = { grass: 24, buck: 24, cheetah: 4 };
function veldStep(s, rain) {
  const fed = s.buck ? Math.min(1, s.grass / (s.buck * 1.5)) : 1;
  const grow = [-8, 18, 30][rain] * (rain ? 1 - s.grass / 120 : 1);
  const grass = Math.max(0, Math.min(100, Math.round(s.grass + grow - Math.min(s.grass, s.buck * 0.6))));
  const births = Math.round(s.buck * 0.25 * fed), starve = fed < 0.6 ? Math.round(s.buck * (0.6 - fed)) : 0;
  const buck = Math.max(0, s.buck + births - Math.min(s.buck, s.cheetah) - starve);
  const prey = s.buck / Math.max(1, s.cheetah);
  const cheetah = Math.max(0, s.cheetah + (prey >= 7 && s.cheetah > 0 ? 1 : 0) - (prey < 3 ? Math.ceil(s.cheetah / 3) : 0));
  return { grass, buck, cheetah };
}
function veldRun(start, rain, n) { const out = [start]; for (let i = 0; i < n; i++) out.push(veldStep(out[i], rain)); return out; }
// More, fewer or about the same: the biggest change from the start, so a boom that settles back still counts.
function veldTrend(series, key) {
  const s0 = Math.max(1, series[0][key]); let best = 0;
  series.forEach(s => { const d = (s[key] - series[0][key]) / s0; if (Math.abs(d) > Math.abs(best)) best = d; });
  return best > 0.15 ? "more" : best < -0.15 ? "fewer" : "same";
}
const VELD_NAMES = { grass: "grass", buck: "springbok", cheetah: "cheetahs" };
const VELD_QS = {
  younger: [
    { change: "The rain stops for a long time.", rain: 0, set: {}, ask: "buck", why: "With no rain, the grass dries up. The springbok have nothing to eat, so there are fewer of them." },
    { change: "The cheetahs move far away.", rain: 1, set: { cheetah: 0 }, ask: "buck", why: "With no cheetahs hunting them, more springbok survive, so there are more of them, until the grass runs short." }
  ],
  older: [
    { change: "The rain stops for a long time.", rain: 0, set: {}, ask: "cheetah", why: "No rain, so less grass. Fewer springbok can find food. Then the cheetahs go hungry, so there are fewer cheetahs, a few seasons later." },
    { change: "The cheetahs move far away.", rain: 1, set: { cheetah: 0 }, ask: "grass", why: "Without cheetahs, the springbok herd grows. More springbok eat more grass, so there is less grass. One change rippled two steps away." },
    { change: "Lots of rain falls every season.", rain: 2, set: {}, ask: "cheetah", why: "More rain grows more grass. More springbok can be fed, and more springbok means more food for cheetahs." }
  ]
};
const VB_TREND = { more: ["⬆️", "More"], fewer: ["⬇️", "Fewer"], same: ["➡️", "About the same"] };
// The veld, drawn from the numbers: grass tufts, springbok and cheetahs (each shape stands for some animals).
function veldScene(s, rain) {
  const at = (i, y0, h) => [14 + ((i * 0.618034) % 1) * 290, y0 + ((i * 0.7548777) % 1) * h]; // golden-ratio spread: even, never clumped
  const tufts = Array.from({ length: Math.round(s.grass / 3) }, (_, i) => { const [x, y] = at(i, 116, 26); return `<path d="M${x} ${y} l-4 -9 M${x} ${y} l0 -11 M${x} ${y} l4 -9" stroke="var(--leaf)" stroke-width="2.4" stroke-linecap="round"/>`; }).join("");
  const bucks = Array.from({ length: Math.min(14, Math.ceil(s.buck / 3)) }, (_, i) => { const [x, y] = at(i + 1, 90, 30); return `<use href="#vbBuck" x="${x - 18}" y="${y - 20}" width="36" height="28"/>`; }).join("");
  const cats = Array.from({ length: Math.min(8, s.cheetah) }, (_, i) => { const [x, y] = at(i + 20, 96, 28); return `<use href="#vbCat" x="${x - 20}" y="${y - 16}" width="40" height="28"/>`; }).join("");
  const sky = rain === 0 ? '<circle cx="270" cy="32" r="20" fill="var(--gold)" stroke="var(--ink)" stroke-width="1.5"/>'
    : `<g fill="var(--surface)" stroke="var(--ink)" stroke-width="1.5"><ellipse cx="80" cy="30" rx="34" ry="14"/><ellipse cx="${rain === 2 ? 200 : 250}" cy="26" rx="30" ry="12"/></g>${rain === 2 ? `<g stroke="var(--shape-c)" stroke-width="2" stroke-linecap="round">${Array.from({ length: 14 }, (_, i) => `<path d="M${50 + i * 13} ${48 + (i % 3) * 6} l-4 10"/>`).join("")}</g>` : '<circle cx="290" cy="28" r="14" fill="var(--gold)" stroke="var(--ink)" stroke-width="1.5"/>'}`;
  return `<svg class="vb-scene" viewBox="0 0 320 150" aria-hidden="true"><defs>
      <symbol id="vbBuck" viewBox="0 0 28 22"><ellipse cx="13" cy="11" rx="9" ry="5" fill="var(--gold-soft)" stroke="var(--ink)" stroke-width="1.4"/><path d="M8 15 v6 M17 15 v6" stroke="var(--ink)" stroke-width="1.6"/><circle cx="23" cy="7" r="3.5" fill="var(--gold-soft)" stroke="var(--ink)" stroke-width="1.4"/><path d="M22 4 q-1 -4 1 -4 M25 4 q1 -4 3 -3" stroke="var(--ink)" stroke-width="1.3" fill="none"/></symbol>
      <symbol id="vbCat" viewBox="0 0 32 22"><ellipse cx="15" cy="11" rx="11" ry="5" fill="var(--gold)" stroke="var(--ink)" stroke-width="1.4"/><circle cx="27" cy="8" r="4" fill="var(--gold)" stroke="var(--ink)" stroke-width="1.4"/><path d="M8 15 v6 M20 15 v6" stroke="var(--ink)" stroke-width="1.6"/><path d="M4 10 q-4 -2 -3 -7" stroke="var(--ink)" stroke-width="1.6" fill="none"/><g fill="var(--ink)"><circle cx="11" cy="9" r="1"/><circle cx="16" cy="12" r="1"/><circle cx="20" cy="9" r="1"/></g></symbol></defs>
    <rect width="320" height="150" fill="var(--sky)"/>${sky}<path d="M0 84 Q80 72 160 82 T320 78 V150 H0 Z" fill="${rain === 0 ? "var(--gold-soft)" : "var(--ok-soft)"}"/>${tufts}${bucks}${cats}</svg>`;
}
// One small chart per population, each with its own line style and marker, so colour is never needed.
function veldCharts(series, n) {
  const W2 = 180, H = 40, row = (key, max, style, mark) => {
    const pts = series.map((s, i) => [6 + i * (W2 - 12) / Math.max(1, n - 1), H - 4 - (s[key] / max) * (H - 8)]);
    const m = pts.map(([x, y]) => mark === "c" ? `<circle cx="${x}" cy="${y}" r="2.6"/>` : mark === "s" ? `<rect x="${x - 2.4}" y="${y - 2.4}" width="4.8" height="4.8"/>` : `<path d="M${x} ${y - 3} l3 5 h-6 z"/>`).join("");
    return `<div class="vb-row"><span class="vb-lbl">${{ grass: "🌾 Grass", buck: "🦌 Springbok", cheetah: "🐆 Cheetahs" }[key]}</span>
      <svg viewBox="0 0 ${W2} ${H}" aria-hidden="true"><polyline points="${pts.map(p => p.join(",")).join(" ")}" fill="none" stroke="var(--ink)" stroke-width="2" stroke-dasharray="${style}"/><g fill="var(--ink)">${m}</g></svg>
      <b class="vb-num">${series[series.length - 1][key]}</b></div>`;
  };
  return `<div class="vb-charts">${row("grass", 100, "", "c")}${row("buck", 50, "6 3", "s")}${row("cheetah", 10, "2 3", "t")}</div>`;
}
const veldSummary = (s, season) => `Season ${season}: grass ${s.grass} out of 100, ${s.buck} springbok, ${s.cheetah} cheetah${s.cheetah === 1 ? "" : "s"}.`;

function gameVeld(run) {
  labStart(run);
  const qs = VELD_QS[S.band === "older" ? "older" : "younger"], items = [], SEASONS = 8; let qi = 0;
  const meet = () => {
    labSay(`${run.x.name}. This is the veld. When it rains, grass grows. Springbok eat the grass. Cheetahs hunt springbok. Everything is connected. Let's see what happens when one thing changes.`);
    render(`<section class="card">${labHead(run, "Meet the veld")}<h2>Everything is connected</h2>
        ${veldScene(VELD_START, 1)}
        <ol class="vb-chain" aria-label="Who needs what"><li>${icon("🌧️")}<span>Rain</span></li><li>${icon("🌾")}<span>Grass</span></li><li>${icon("🦌")}<span>Springbok</span></li><li>${icon("🐆")}<span>Cheetahs</span></li></ol>
        <p>${W("Rain makes grass grow. Springbok eat grass. Cheetahs eat springbok.", "Rain grows grass, springbok graze it, and cheetahs hunt springbok. Right now the veld is in balance.")}</p>
        <p class="sr">${veldSummary(VELD_START, 0)}</p>
        <div class="row"><button class="btn primary" id="vbGo" data-focus>Let's see</button></div></section>`);
    on("#vbGo", () => { run.acted = true; predict(); });
  };
  const predict = () => {
    const q = qs[qi], rec = newRec(`What if: ${q.change}`, { mode: "predicted" }), start = Object.assign({}, VELD_START, q.set), series = veldRun(start, q.rain, SEASONS), answer = veldTrend(series, q.ask);
    const o = { hint: 0, hints: [W("Follow the chain: rain, then grass, then springbok, then cheetahs.", "Follow the chain step by step from what changed."), `Start with what changes first. What does that do to the next thing in the chain?`, q.why.split(". ")[0] + "."] };
    let guess = null, shown = 0;
    const ask = `${q.change} What will happen to the ${VELD_NAMES[q.ask]}?`;
    const draw = (watching) => {
      currentReturnSay = currentSay = ask;
      const part = series.slice(0, shown + 1), now = part[part.length - 1];
      render(`<section class="card">${labHead(run, `Question ${qi + 1} of ${qs.length}`)}
          <h2>${esc(q.change)}</h2>
          ${veldScene(now, q.rain)}
          ${guess ? veldCharts(part, SEASONS + 1) : ""}
          <p class="sr" role="status">${guess ? veldSummary(now, shown) : ""}</p>
          ${guess ? "" : `<h3>${W("What will happen to the", "Predict: what happens to the")} ${VELD_NAMES[q.ask]}?</h3>
            <div class="choices">${Object.entries(VB_TREND).map(([k, [e, l]]) => `<button class="choice" data-t="${k}">${icon(e)}<span class="lbl">${l}</span></button>`).join("")}</div>
            ${thinkPrompt()}${hintHtml(o)}${labRow(o, null)}`}
          ${guess && !watching ? `<div class="feedback${guess === answer ? "" : " gentle"}" role="status">${guess === answer ? "Your prediction was right!" : `It turned out ${VB_TREND[answer][1].toLowerCase()}, not ${VB_TREND[guess][1].toLowerCase()}.`} ${esc(q.why)}</div>
            <div class="row"><button class="btn primary" id="vbNext" data-focus>${qi + 1 < qs.length ? "Next question" : "Make your own veld"}</button><button class="btn" id="vbAgain">Watch it again</button></div>` : ""}
        </section>`);
      on("[data-t]", e => {
        guess = e.currentTarget.dataset.t; rec.prediction = guess; rec.checks = 1; rec.firstMatched = rec.latestMatched = guess === answer; run.acted = true;
        watch();
      });
      on("#vbAgain", watch);
      on("#vbNext", () => { items.push(rec); qi++; qi < qs.length ? predict() : sandbox(); });
      on("#lkSkip", () => { rec.movedOn = true; items.push(rec); qi++; qi < qs.length ? predict() : sandbox(); });
      wireHints(o, rec, () => draw(false));
    };
    const watch = () => { speakNow("Watch the seasons go by."); playFrames(run, SEASONS + 1, 900, i => { shown = i; draw(true); }, () => { shown = SEASONS; draw(false); speakNow((guess === answer ? "Your prediction was right! " : "") + q.why); }); };
    labSay(ask + " More, fewer, or about the same?"); draw(false);
  };
  // The open experiment: no right answer. It records how the learner explores.
  const sandbox = () => {
    const rec = newRec("My own veld", { open: true, runs: 0, fairRuns: 0, mode: "experimented" });
    const set = { rain: 1, cheetah: 4, buck: 24 }, opts = { rain: [[0, "No rain"], [1, "Some rain"], [2, "Lots of rain"]], cheetah: [[0, "None"], [4, "A few"], [8, "Many"]], buck: [[10, "A few"], [24, "Some"], [40, "Many"]] };
    let last = null, series = null, shown = 0, busy = false;
    const draw = () => {
      currentReturnSay = currentSay = "Make your own veld. Choose the rain, the cheetahs and the springbok, then watch what happens.";
      const now = series ? series[shown] : Object.assign({ grass: VELD_START.grass }, set);
      const group = (k, label) => `<p class="eyebrow">${label}</p><div class="rm-pick" role="group" aria-label="${label}">${opts[k].map(([v, l]) => `<button class="choice" data-sk="${k}" data-sv="${v}" aria-pressed="${set[k] === v}"${busy ? " disabled" : ""}><span class="lbl">${l}</span></button>`).join("")}</div>`;
      render(`<section class="card">${labHead(run, "Your own veld")}
          <h2>${W("Make your own veld", "Run your own experiment")}</h2>
          ${veldScene(now, set.rain)}
          ${series ? veldCharts(series.slice(0, shown + 1), SEASONS + 1) : ""}
          <p class="sr" role="status">${series ? veldSummary(now, shown) : ""}</p>
          ${group("rain", "Rain")}${group("cheetah", "Cheetahs")}${group("buck", "Springbok")}
          ${thinkPrompt()}
          <div class="row"><button class="btn primary" id="vbRun"${busy ? " disabled" : ""}>${icon("▶️")}<span>Watch ${SEASONS} seasons</span></button><button class="btn" id="vbDone"${busy ? " disabled" : ""}>I've finished exploring</button></div>
        </section>`);
      on("[data-sk]", e => { set[e.currentTarget.dataset.sk] = +e.currentTarget.dataset.sv; series = null; draw(); const b = $main.querySelector(`[data-sk="${e.currentTarget.dataset.sk}"][data-sv="${e.currentTarget.dataset.sv}"]`); if (b) b.focus({ preventScroll: true }); });
      on("#vbRun", () => {
        rec.runs++; run.acted = true; if (last && ["rain", "cheetah", "buck"].filter(k => last[k] !== set[k]).length === 1) rec.fairRuns++; last = Object.assign({}, set);
        series = veldRun({ grass: VELD_START.grass, buck: set.buck, cheetah: set.cheetah }, set.rain, SEASONS); busy = true;
        playFrames(run, SEASONS + 1, 700, i => { shown = i; draw(); }, () => { busy = false; draw(); speakNow(veldSummary(series[SEASONS], SEASONS)); });
      });
      on("#vbDone", () => { rec.latestMatched = rec.runs > 0; if (!rec.runs) rec.movedOn = true; items.push(rec); wrapUp(); });
    };
    labSay(W("Now make your own veld! Choose the rain, the cheetahs and the springbok, then watch what happens.", "Your turn to experiment. Set up a veld, predict what will happen, then watch.")); draw();
  };
  const wrapUp = () => labReflect(run, W("What surprised you?", "What surprised you most?"), ["One change affected everything", "What happened to the grass", "What happened to the animals", "Nothing surprised me"],
    r => finishExercise(run, items, r, null, `Predictions right: ${items.filter(i => i.prediction && i.firstMatched).length} of ${items.filter(i => i.prediction).length}. Experiment runs: ${items[items.length - 1].runs || 0}, changing one thing at a time on ${items[items.length - 1].fairRuns || 0}.`));
  meet();
}
