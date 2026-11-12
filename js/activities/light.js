"use strict";

// ---------- Light the Village (Logical and Analytical Thinking: planning) ----------
// Place mirrors so one beam of sunlight reaches every hut's lamp. Records whether the learner plans the mirrors
// before shining the light, or works by trying and adjusting, and how they change a plan that didn't work.
// Each puzzle lists one solution (fix) for the hints; any arrangement that lights every hut counts.
const LIGHT_PUZZLES = {
  younger: [
    { n: 4, from: [0, -1], dir: [0, 1], lamps: [[3, 2]], rocks: [], fix: [[0, 2, "\\"]], title: "One turn" },
    { n: 4, from: [4, 0], dir: [-1, 0], lamps: [[2, 1], [0, 3]], rocks: [[0, 0]], fix: [[2, 0, "/"], [2, 3, "/"]], title: "Two huts" }
  ],
  older: [
    { n: 6, from: [5, -1], dir: [0, 1], lamps: [[1, 2], [1, 4], [4, 5]], rocks: [[5, 3], [3, 3]], fix: [[5, 1, "/"], [1, 1, "/"], [1, 5, "\\"]], title: "Around the hill" },
    { n: 6, from: [-1, 2], dir: [1, 0], lamps: [[2, 3], [4, 4], [5, 1]], rocks: [[3, 2], [0, 4]], fix: [[2, 2, "\\"], [2, 4, "\\"], [5, 4, "/"]], title: "The long road" }
  ]
};
// Follows the beam: a "/" mirror turns it (dr, dc) -> (-dc, -dr), a "\" mirror (dr, dc) -> (dc, dr). Rocks stop it.
function lightTrace(pz, mirrors) {
  let [r, c] = pz.from, [dr, dc] = pz.dir, stop = "out";
  const path = [[r, c]], lit = new Set();
  for (let k = 0; k < 4 * pz.n * pz.n; k++) {
    r += dr; c += dc; path.push([r, c]);
    if (r < 0 || c < 0 || r >= pz.n || c >= pz.n) break;
    if (pz.rocks.some(x => x[0] === r && x[1] === c)) { stop = "rock"; break; }
    if (pz.lamps.some(x => x[0] === r && x[1] === c)) lit.add(r + "," + c);
    const m = mirrors[r + "," + c];
    if (m === "/") [dr, dc] = [-dc, -dr]; else if (m === "\\") [dr, dc] = [dc, dr];
  }
  return { path, lit, stop, all: lit.size === pz.lamps.length };
}
const LT_SUN = '<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="9" fill="var(--gold)" stroke="var(--ink)" stroke-width="1.2"/><path d="M20 3v5M20 32v5M3 20h5M32 20h5M8 8l3.5 3.5M28.5 28.5L32 32M8 32l3.5-3.5M28.5 11.5L32 8" stroke="var(--gold)" stroke-width="3" stroke-linecap="round"/></svg>';
const LT_HUT = '<svg viewBox="0 0 40 40" aria-hidden="true"><g class="rays" stroke="var(--gold)" stroke-width="2.4" stroke-linecap="round"><path d="M20 1v4M5 8l3 3M35 8l-3 3"/></g><path d="M5 20 L20 7 L35 20 Z" fill="var(--shape-b)" stroke="var(--ink)" stroke-width="1.5" stroke-linejoin="round"/><rect x="9" y="20" width="22" height="15" rx="2" fill="var(--surface)" stroke="var(--ink)" stroke-width="1.5"/><rect class="lamp" x="16" y="24" width="8" height="8" rx="1.5" fill="var(--line)" stroke="var(--ink)" stroke-width="1.2"/></svg>';
const LT_ROCK = '<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M5 32 Q4 22 12 17 Q18 9 27 13 Q36 16 36 26 Q37 32 30 33 H10 Q5 33 5 32 Z" fill="var(--muted)" stroke="var(--ink)" stroke-width="1.2"/><path d="M13 20 Q18 15 24 17" stroke="var(--surface)" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.6"/></svg>';
const LT_MIRROR = m => `<svg viewBox="0 0 40 40" aria-hidden="true">${m === "/" ? '<line x1="7" y1="33" x2="33" y2="7" stroke="var(--ink)" stroke-width="6" stroke-linecap="round"/><line x1="9" y1="31" x2="31" y2="9" stroke="var(--surface)" stroke-width="2" stroke-linecap="round"/>'
  : '<line x1="7" y1="7" x2="33" y2="33" stroke="var(--ink)" stroke-width="6" stroke-linecap="round"/><line x1="9" y1="9" x2="31" y2="31" stroke="var(--surface)" stroke-width="2" stroke-linecap="round"/>'}</svg>`;

function gameLight(run) {
  labStart(run);
  const puzzles = LIGHT_PUZZLES[S.band === "older" ? "older" : "younger"], items = []; let pi = 0;
  const where = (r, c) => `row ${r + 1}, column ${c + 1}`;
  const doPuzzle = () => {
    const pz = puzzles[pi], mirrors = {}, N = pz.n + 2, at = (list, r, c) => list.some(x => x[0] === r && x[1] === c);
    const rec = newRec(pz.title, { shines: 0, changes: 0, mirrorsAtFirstShine: null, mode: "placed mirrors" });
    const o = { hint: 0, hints: [W("Follow the light from the sun with your finger. Where does it need to turn to reach a hut?", "Trace the beam from the sun. Where must it turn to reach each hut?"),
      `One mirror goes at ${where(pz.fix[0][0], pz.fix[0][1])}. It has a dashed edge now.`, "Every square with a dashed edge needs a mirror. Tap a mirror again to tilt it the other way."] };
    let shown = null, busy = false, done = false, fb = "";
    const intro = `${run.x.name}. ${W("Tap a square to put a mirror there. Tap it again to tilt it.", "Tap a square to place a mirror, and again to tilt it.")} Then shine the light. Can the sunlight reach ${pz.lamps.length > 1 ? "every hut" : "the hut"}?`;
    const ghosts = () => o.hint >= 3 ? pz.fix : o.hint === 2 ? [pz.fix[0]] : [];
    const draw = () => {
      const lit = shown && !busy ? shown.lit : new Set(), cells = [];
      for (let R = 0; R < N; R++) for (let C = 0; C < N; C++) {
        const r = R - 1, c = C - 1, key = r + "," + c;
        if (r < 0 || c < 0 || r >= pz.n || c >= pz.n) { cells.push(`<div class="lt-edge">${r === pz.from[0] && c === pz.from[1] ? LT_SUN : ""}</div>`); continue; }
        if (at(pz.lamps, r, c)) cells.push(`<div class="lt-cell lt-hut${lit.has(key) ? " lit" : ""}" role="img" aria-label="${where(r, c)}: a hut, lamp ${lit.has(key) ? "lit" : "not lit"}">${LT_HUT}</div>`);
        else if (at(pz.rocks, r, c)) cells.push(`<div class="lt-cell lt-rock" role="img" aria-label="${where(r, c)}: a rock">${LT_ROCK}</div>`);
        else {
          const m = mirrors[key], g = ghosts().some(f => f[0] === r && f[1] === c);
          cells.push(`<button class="lt-cell${g ? " ghost" : ""}" data-cell="${key}" aria-label="${where(r, c)}: ${m ? `mirror, tilted ${m === "/" ? "up to the right" : "down to the right"}` : "empty"}${g ? ". A mirror goes here" : ""}"${done || busy ? " disabled" : ""}>${m ? LT_MIRROR(m) : ""}</button>`);
        }
      }
      let beam = "";
      if (shown) {
        const pts = shown.path.map(([r, c]) => [c + 1.5, r + 1.5]); let len = 0;
        for (let i = 1; i < pts.length; i++) len += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
        beam = `<svg class="lt-light" viewBox="0 0 ${N} ${N}" aria-hidden="true"><polyline class="lt-beam${reduceMotion() ? "" : " go"}" style="--len:${len.toFixed(2)}" points="${pts.map(p => p.map(v => v.toFixed(2)).join(",")).join(" ")}"/></svg>`;
      }
      const sunSide = pz.dir[1] === 1 ? "left" : pz.dir[1] === -1 ? "right" : pz.dir[0] === 1 ? "top" : "bottom";
      currentReturnSay = currentSay = fb || intro;
      render(`<section class="card">
          ${labHead(run, `Village ${pi + 1} of ${puzzles.length}`)}
          <h2>${W("Can the sunlight reach every hut?", "Light every hut with one beam")}</h2>
          <p class="muted">${W("Mirrors turn the light. Rocks stop it.", "Mirrors turn the beam a quarter turn. Rocks stop it.")}</p>
          <div class="lt-wrap"><div class="lt-board" style="grid-template-columns:repeat(${N}, 1fr)">${cells.join("")}</div>${beam}</div>
          <p class="sr">The sun shines in from the ${sunSide} side, at ${where(Math.max(0, Math.min(pz.n - 1, pz.from[0])), Math.max(0, Math.min(pz.n - 1, pz.from[1])))}. Huts are at ${pz.lamps.map(l => where(l[0], l[1])).join("; ")}.${pz.rocks.length ? " Rocks are at " + pz.rocks.map(l => where(l[0], l[1])).join("; ") + "." : ""} ${Object.keys(mirrors).length} mirror${Object.keys(mirrors).length === 1 ? "" : "s"} placed.</p>
          ${thinkPrompt()}
          ${hintHtml(o)}
          ${fb ? `<div class="feedback${done ? "" : " gentle"}" role="status">${esc(fb)}</div>` : ""}
          ${done ? `<div class="row"><button class="btn primary" id="ltNext" data-focus>${pi + 1 < puzzles.length ? "Next village" : "Finish"}</button></div>`
            : labRow(o, ["ltShine", `${icon("☀️")}<span>Shine the light</span>`, busy], Object.keys(mirrors).length ? `<button class="btn" id="ltClear"${busy ? " disabled" : ""}>Take all the mirrors away</button>` : "")}
        </section>`);
      on("[data-cell]", e => {
        const k = e.currentTarget.dataset.cell, next = { "": "/", "/": "\\", "\\": "" }[mirrors[k] || ""]; // empty, then /, then \, then empty
        if (next) mirrors[k] = next; else delete mirrors[k];
        rec.changes++; run.acted = true; shown = null; fb = ""; draw();
        const again = $main.querySelector(`[data-cell="${k}"]`); if (again) again.focus({ preventScroll: true });
      });
      on("#ltClear", () => { Object.keys(mirrors).forEach(k => delete mirrors[k]); rec.changes++; shown = null; fb = ""; draw(); });
      on("#ltShine", () => {
        rec.shines++; rec.checks++; run.acted = true;
        if (rec.mirrorsAtFirstShine === null) rec.mirrorsAtFirstShine = Object.keys(mirrors).length;
        const t = lightTrace(pz, mirrors); shown = t; busy = true; fb = "";
        if (rec.firstMatched === null) rec.firstMatched = t.all; rec.latestMatched = t.all;
        draw();
        labTimer = setTimeout(() => {
          if (!labAlive(run)) return;
          busy = false;
          const end = t.stop === "rock" ? t.path[t.path.length - 1] : t.path[t.path.length - 2] || t.path[0];
          if (t.all) { done = true; fb = (pz.lamps.length > 1 ? "Every hut has light!" : "The hut has light!") + (rec.shines === 1 ? W(" You got it on your first try.", " First try.") : W(" You kept going until it worked.", " You tested and adjusted until it worked.")); }
          else fb = `The light reached ${t.lit.size} of ${pz.lamps.length} hut${pz.lamps.length > 1 ? "s" : ""}. ${t.stop === "rock" ? "It hit a rock" : "It left the village"} at ${where(end[0], end[1])}. ${W("Move a mirror and try again.", "Adjust a mirror and shine again.")}`;
          draw(); speakNow(fb);
          const b = document.getElementById(done ? "ltNext" : "ltShine"); if (b) b.focus({ preventScroll: true });
        }, reduceMotion() ? 0 : 1300);
      });
      on("#ltNext", () => { items.push(rec); pi++; pi < puzzles.length ? doPuzzle() : wrapUp(); });
      on("#lkSkip", () => { rec.movedOn = true; items.push(rec); pi++; pi < puzzles.length ? doPuzzle() : wrapUp(); });
      wireHints(o, rec, draw);
    };
    labSay(intro); draw();
  };
  const wrapUp = () => labReflect(run, W("How did you work it out?", "How did you approach it?"), [W("I planned the mirrors first", "I planned before shining"), "I tried, then fixed it", "The hints helped me", "I'm not sure"],
    r => finishExercise(run, items, r, null, `Shines per village: ${items.map(i => i.shines).join(", ")}. Mirrors placed before the first shine: ${items.map(i => i.mirrorsAtFirstShine ?? 0).join(", ")}.`));
  doPuzzle();
}
