"use strict";

// ---------- Robot Rescue (Planning and Organisation) ----------
const DIRS = { up: [-1, 0, "↑", "Up"], down: [1, 0, "↓", "Down"], left: [0, -1, "←", "Left"], right: [0, 1, "→", "Right"] };
function robotSim(pz, plan) {
  let [r, c] = pz.start; const path = [[r, c]];
  for (let i = 0; i < plan.length; i++) {
    const d = DIRS[plan[i]]; const nr = r + d[0], nc = c + d[1];
    if (nr < 0 || nc < 0 || nr >= pz.n || nc >= pz.n || pz.rocks.some(k => k[0] === nr && k[1] === nc)) return { path, bump: i, at: [r, c] };
    r = nr; c = nc; path.push([r, c]);
  }
  return { path, bump: -1, at: [r, c], ok: r === pz.goal[0] && c === pz.goal[1] };
}
function robotSolve(pz) {
  const key = p => p.join(","), seen = new Set([key(pz.start)]), q = [[pz.start, []]];
  while (q.length) {
    const [p, plan] = q.shift();
    if (p[0] === pz.goal[0] && p[1] === pz.goal[1]) return plan;
    for (const d of Object.keys(DIRS)) {
      const np = [p[0] + DIRS[d][0], p[1] + DIRS[d][1]];
      if (np[0] < 0 || np[1] < 0 || np[0] >= pz.n || np[1] >= pz.n || pz.rocks.some(k => k[0] === np[0] && k[1] === np[1]) || seen.has(key(np))) continue;
      seen.add(key(np)); q.push([np, plan.concat(d)]);
    }
  }
  return [];
}
const robotIcon = '<svg viewBox="0 0 40 40" aria-hidden="true"><rect x="9" y="12" width="22" height="18" rx="5" fill="var(--shape-c)"/><circle cx="16" cy="20" r="2.6" fill="var(--surface)"/><circle cx="24" cy="20" r="2.6" fill="var(--surface)"/><path d="M20 12 V7" stroke="var(--ink)" stroke-width="2"/><circle cx="20" cy="6" r="2" fill="var(--gold)"/><rect x="12" y="30" width="5" height="4" rx="1" fill="var(--ink)"/><rect x="23" y="30" width="5" height="4" rx="1" fill="var(--ink)"/></svg>';
const friendIcon = '<svg viewBox="0 0 40 40" aria-hidden="true"><ellipse cx="20" cy="24" rx="12" ry="10" fill="var(--gold)"/><circle cx="16" cy="22" r="1.8" fill="var(--ink)"/><circle cx="24" cy="22" r="1.8" fill="var(--ink)"/><path d="M17 27 Q20 29 23 27" stroke="var(--ink)" stroke-width="1.5" fill="none"/><path d="M20 14 Q26 5 32 7 Q28 13 20 14" fill="var(--leaf)"/></svg>';
const rockIcon = '<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M5 32 Q4 22 12 17 Q18 9 27 13 Q36 16 36 26 Q37 32 30 33 H10 Q5 33 5 32 Z" fill="var(--muted)"/><path d="M13 20 Q18 15 24 17" stroke="var(--surface)" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.6"/></svg>';
function gameRobot(run) {
  const puzzles = S.band === "older"
    ? [{ n: 5, start: [4, 0], goal: [0, 4], rocks: [[2, 0], [2, 1], [2, 3], [0, 1]], title: "Around the rocks" }, { n: 5, start: [0, 0], goal: [4, 2], rocks: [[1, 1], [2, 1], [3, 1], [3, 3]], title: "The long way round" }]
    : [{ n: 3, start: [1, 0], goal: [1, 2], rocks: [], title: "Straight across" }, { n: 3, start: [2, 0], goal: [0, 1], rocks: [], title: "Up and over" }];
  const results = []; let pi = 0;
  activeEx = { abort: () => {} };
  const doPuzzle = () => {
    const pz = puzzles[pi], best = robotSolve(pz);
    const rec = newRec(pz.title, { bumps: 0, moves: 0 });
    let plan = [], pos = pz.start.slice(), hint = 0, fb = "", running = false, picked = null;
    // Choose mode: the shortest plan plus two plans that do not reach the friend
    const wrongs = [];
    const variants = [best.slice(0, -1), best.slice().reverse().map(d => ({ up: "down", down: "up", left: "right", right: "left" })[d]), best.map(d => d === "up" ? "right" : d === "right" ? "up" : d), best.concat(best[best.length - 1])];
    for (const v of variants) if (v.length && !robotSim(pz, v).ok && !wrongs.some(w => w.join() === v.join()) && wrongs.length < 2) wrongs.push(v);
    const planOpts = shuffle([best].concat(wrongs));
    const pathDots = hintLevel => hintLevel >= 2 ? robotSim(pz, best).path.slice(1, -1) : [];
    const where = (r, c) => `row ${r + 1}, column ${c + 1}`;
    const draw = () => {
      const say = "Robot Rescue. Plan the steps to get the robot to its friend, then press Go. What is the first step?";
      currentReturnSay = currentSay = say;
      const dots = pathDots(hint);
      const board = `<div class="board" style="grid-template-columns:repeat(${pz.n}, 1fr)" aria-hidden="true">${Array.from({ length: pz.n * pz.n }, (_, i) => {
        const r = Math.floor(i / pz.n), c = i % pz.n;
        const isR = pos[0] === r && pos[1] === c, isG = pz.goal[0] === r && pz.goal[1] === c, isK = pz.rocks.some(k => k[0] === r && k[1] === c), isD = dots.some(d => d[0] === r && d[1] === c);
        return `<div class="cellb">${isR ? robotIcon : isG ? friendIcon : isK ? rockIcon : isD ? '<span class="dot"></span>' : ""}</div>`;
      }).join("")}</div>
          <p class="sr">The robot is at ${where(pos[0], pos[1])}. Its friend is at ${where(pz.goal[0], pz.goal[1])}.${pz.rocks.length ? " Rocks are at " + pz.rocks.map(k => where(k[0], k[1])).join("; ") + "." : " There are no rocks."}</p>`;
      const planChips = plan.length ? plan.map((d, i) => `<span class="chip" aria-label="Step ${i + 1}: ${DIRS[d][3]}">${DIRS[d][2]}</span>`).join("") : '<span class="muted">No steps yet.</span>';
      render(`
          <section class="card">
            <p class="eyebrow">Robot Rescue · ${pi + 1} of ${puzzles.length}</p>
            <h2>Plan the way to the robot's friend</h2>
            ${board}
            <div class="row" role="group" aria-label="How do you want to answer?">
              <button class="btn small" id="rModeB" aria-pressed="${rec.mode === "build"}">Build the steps</button>
              <button class="btn small" id="rModeC" aria-pressed="${rec.mode === "choose"}">Choose a plan</button>
            </div>
            ${rec.mode === "build" ? `
              <div><p class="eyebrow">Your plan</p><div class="plan" aria-live="polite">${planChips}</div></div>
              <div class="row arrows">${Object.keys(DIRS).map(d => `<button class="btn" data-dir="${d}"${running ? " disabled" : ""}><span aria-hidden="true">${DIRS[d][2]}</span> ${DIRS[d][3]}</button>`).join("")}</div>
              <div class="row"><button class="btn small" id="rUndo"${plan.length && !running ? "" : " disabled"}>Remove last step</button><button class="btn small" id="rClear"${plan.length && !running ? "" : " disabled"}>Clear the plan</button></div>`
          : `<div class="choices">${planOpts.map((p, i) => `<button class="choice" data-rp="${i}" aria-pressed="${picked === i}" aria-label="Plan: ${p.map(d => DIRS[d][3]).join(", ")}"><span class="lbl" style="font-size:1.3rem;letter-spacing:0.1em">${p.map(d => DIRS[d][2]).join(" ")}</span></button>`).join("")}</div>`}
            ${thinkPrompt()}${hint ? `<div class="hint">${hint >= 2 ? "The dots show one safe way. Follow them." : "Start at the robot. Which way is its friend? Trace the way with your finger first."}</div>` : ""}
            ${fb ? `<div class="feedback gentle">${esc(fb)}</div>` : ""}
            ${actionRow({ check: "rGo", checkLabel: "Go!", hint: "rHint", skip: "rSkip" }, hint)}
          </section>`);
      on("#rModeB", () => { rec.mode = "build"; picked = null; draw(); });
      on("#rModeC", () => { rec.mode = "choose"; plan = []; draw(); });
      on("[data-dir]", e => { plan.push(e.currentTarget.dataset.dir); rec.moves++; pos = pz.start.slice(); fb = ""; draw(); });
      on("#rUndo", () => { plan.pop(); pos = pz.start.slice(); fb = ""; draw(); });
      on("#rClear", () => { plan = []; pos = pz.start.slice(); fb = ""; draw(); });
      on("[data-rp]", e => { picked = +e.currentTarget.dataset.rp; pos = pz.start.slice(); fb = ""; draw(); });
      on("#rHint", () => { hint = Math.min(2, hint + 1); rec.hints = hint; draw(); });
      on("#rSkip", () => { rec.movedOn = true; next(); });
      on("#rGo", () => {
        if (running) return;
        const p = rec.mode === "build" ? plan : (picked === null ? null : planOpts[picked]);
        if (!p || !p.length) { fb = rec.mode === "build" ? "Add some steps first." : "Choose a plan first."; draw(); speak(fb); return; }
        rec.checks++;
        const res = robotSim(pz, p);
        const finish = () => {
          running = false; pos = res.at.slice();
          if (rec.firstMatched === null) rec.firstMatched = !!res.ok;
          rec.latestMatched = !!res.ok;
          if (res.ok) { const t = "The robot reached its friend. Your plan worked."; speak(t); next(t); return; }
          if (res.bump >= 0) { rec.bumps++; fb = `The robot bumped into something at step ${res.bump + 1}. You can change that step and try again.`; }
          else fb = "The robot stopped before reaching its friend. You can add or change steps.";
          draw(); speak(fb);
        };
        if (reduceMotion()) { finish(); return; }
        running = true; let i = 0;
        const tick = () => { pos = res.path[i].slice(); draw(); i++; if (i < res.path.length) setTimeout(tick, 450); else setTimeout(finish, 350); };
        tick();
      });
    };
    const next = (praise) => {
      results.push(rec); pi++;
      if (pi < puzzles.length) { if (praise) praiseThen(praise, "Next puzzle", doPuzzle); else doPuzzle(); }
      else {
        const fin = () => reflect(run, "How did you plan?", ["Planned all the steps first", "One step at a time", "Tried, then fixed it", "Not sure"], r =>
          finishExercise(run, results, r, "You planned the robot's way step by step. Thank you for helping the robot."));
        if (praise) praiseThen(praise, "Next", fin); else fin();
      }
    };
    draw();
  };
  doPuzzle();
}
