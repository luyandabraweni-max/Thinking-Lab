"use strict";

// ---------- Shapes ----------
function shape(kind, opts) {
  opts = opts || {};
  const size = opts.size || 56, col = opts.color || ({ circle: "var(--shape-a)", square: "var(--shape-b)", triangle: "var(--shape-c)", diamond: "var(--shape-d)" }[kind] || "var(--shape-a)");
  const s = opts.small ? 0.62 : 1;
  const c = 28, r = 20 * s;
  const outline = fill =>
    kind === "circle" ? `<circle cx="${c}" cy="${c}" r="${r}" fill="${fill}"/>`
    : kind === "square" ? `<rect x="${c - r}" y="${c - r}" width="${2 * r}" height="${2 * r}" rx="4" fill="${fill}"/>`
    : kind === "triangle" ? `<path d="M${c} ${c - r - 2} L${c + r + 2} ${c + r} L${c - r - 2} ${c + r} Z" fill="${fill}"/>`
    : kind === "diamond" ? `<path d="M${c} ${c - r - 4} L${c + r + 2} ${c} L${c} ${c + r + 4} L${c - r - 2} ${c} Z" fill="${fill}"/>` : "";
  // opts.texture: texture names drawn over the colour, so colour is never the only cue
  const tex = textures(opts.texture);
  const p = outline(col) + tex.urls.map(outline).join("");
  return `<svg width="${size}" height="${size}" viewBox="0 0 56 56" role="img" aria-label="${opts.label || kind}">${tex.defs}${p}</svg>`;
}

// ---------- Textures (patterns that stand in for colour in greyscale) ----------
const TEXTURE = {
  stripes: '<path d="M-2 2 L2 -2 M0 8 L8 0 M6 10 L10 6" stroke="var(--ink)" stroke-opacity="0.55" stroke-width="1.4"/>',
  dots: '<circle cx="4" cy="4" r="1.3" fill="var(--ink)" fill-opacity="0.6"/>',
  lines: '<path d="M0 6.5 H8" stroke="var(--ink)" stroke-opacity="0.55" stroke-width="1.2"/>',
  rings: '<circle cx="0" cy="0" r="1.8" fill="none" stroke="var(--ink)" stroke-opacity="0.55" stroke-width="0.9"/><circle cx="8" cy="8" r="1.8" fill="none" stroke="var(--ink)" stroke-opacity="0.55" stroke-width="0.9"/>'
};
let textureId = 0;
function textures(names) {
  if (!names || !names.length) return { defs: "", urls: [] };
  const ids = names.map(n => [n, "tx" + (++textureId)]);
  return {
    defs: `<defs>${ids.map(([n, id]) => `<pattern id="${id}" width="8" height="8" patternUnits="userSpaceOnUse">${TEXTURE[n]}</pattern>`).join("")}</defs>`,
    urls: ids.map(([, id]) => `url(#${id})`)
  };
}
const NAME = { circle: "circle", square: "square", triangle: "triangle", diamond: "diamond" };

// Pattern items. Tokens: {k: shape, small?: bool, color?: css} or {dots: n}
function T(k, extra) { return Object.assign({ k }, extra || {}); }
const PATTERNS = {
  younger: [
    { rep: 2, title: "Two-shape repeat", seq: [T("circle"), T("square"), T("circle"), T("square")], answer: [T("circle"), T("square")], palette: [T("circle"), T("square")] },
    { rep: 3, title: "Three-shape repeat", seq: [T("triangle"), T("triangle"), T("circle"), T("triangle"), T("triangle"), T("circle")], answer: [T("triangle"), T("triangle")], palette: [T("triangle"), T("circle")] },
    { rep: 3, title: "New shapes, same kind of rule", seq: [T("square"), T("diamond"), T("diamond"), T("square"), T("diamond"), T("diamond")], answer: [T("square"), T("diamond")], palette: [T("square"), T("diamond")] }
  ],
  older: [
    { rep: 3, title: "Three-part repeat", seq: [T("circle"), T("square"), T("triangle"), T("circle"), T("square"), T("triangle")], answer: [T("circle"), T("square")], palette: [T("circle"), T("square"), T("triangle")] },
    { rep: 2, title: "Two things change", seq: [T("circle"), T("circle", { small: true, color: "var(--shape-c)" }), T("circle"), T("circle", { small: true, color: "var(--shape-c)" })], answer: [T("circle"), T("circle", { small: true, color: "var(--shape-c)" })], palette: [T("circle"), T("circle", { small: true, color: "var(--shape-c)" })] },
    { rep: 0, title: "Growing pattern", seq: [T("dots", { n: 1 }), T("dots", { n: 3 }), T("dots", { n: 5 })], answer: [T("dots", { n: 7 }), T("dots", { n: 9 })], palette: [T("dots", { n: 6 }), T("dots", { n: 7 }), T("dots", { n: 8 }), T("dots", { n: 9 })] }
  ]
};
function tokKey(t) { return t.k === "dots" ? "d" + t.n : t.k + (t.small ? "-s" : "") + (t.color || ""); }
function tokLabel(t) { return t.k === "dots" ? t.n + " dots" : (t.small ? "small " : "") + NAME[t.k]; }
function tokSvg(t, size) {
  if (t.k === "dots") {
    const n = t.n, cols = Math.min(n, 5), rows = Math.ceil(n / 5), w = 14 * cols + 6, h = 14 * rows + 6;
    let d = ""; for (let i = 0; i < n; i++) d += `<circle cx="${10 + (i % 5) * 14}" cy="${10 + Math.floor(i / 5) * 14}" r="5" fill="var(--shape-a)"/>`;
    return `<svg width="${Math.max(w, 30)}" height="${Math.max(h, 30)}" viewBox="0 0 ${Math.max(w, 30)} ${Math.max(h, 30)}" role="img" aria-label="${n} dots">${d}</svg><span class="sr">${n}</span><span aria-hidden="true" style="font-family:var(--font-display);font-size:0.9rem">${n}</span>`;
  }
  return shape(t.k, { size: size || 56, small: t.small, color: t.color, label: tokLabel(t) });
}
function seqHtml(seq, glowUpto) {
  return `<div class="seq">${seq.map((t, i) => `<div class="cell${glowUpto && i < glowUpto ? " glow" : ""}">${tokSvg(t)}</div>`).join("")}<div class="cell" aria-hidden="true" style="font-size:1.6rem;color:var(--muted)">?</div></div>`;
}

function patternExample(next) {
  const text = "Here is an example. Circle, square, circle, square. The part that repeats is circle then square. So the next two are circle, square.";
  currentReturnSay = currentSay = text;
  const ex = [T("circle"), T("square"), T("circle"), T("square")];
  render(`
      <section class="card">
        <p class="eyebrow">Example</p>
        <h2>Look for the part that repeats</h2>
        <div class="seq">${ex.map((t, i) => `<div class="cell${i < 2 ? " glow" : ""}">${tokSvg(t)}</div>`).join("")}<div class="cell">${tokSvg(T("circle"))}</div><div class="cell">${tokSvg(T("square"))}</div></div>
        <p>Circle, then square, keeps happening. So the next two are circle, square.</p>
        <div class="row"><button class="btn primary" id="eGo" data-focus>Now I'll try</button></div>
      </section>`);
  setSay(text);
  on("#eGo", next);
}

function gamePattern(run) {
  const items = PATTERNS[S.band];
  const results = [];
  let idx = 0;
  activeEx = { abort: () => {} };
  const doItem = () => {
    const it = items[idx];
    const rec = { title: it.title, checks: 0, hints: 0, firstMatched: null, latestMatched: false, movedOn: false, mode: S.answer === "build" ? "place" : "pair", exampleOpened: run.exampleOpened };
    let mode = S.answer === "build" ? "place" : "pair", picked = null, slots = [null, null], hintLevel = 0, fb = "";
    // Pair options: correct + 3 distractors built from the palette
    const pal = it.palette;
    const pairs = [];
    const key = p => p.map(tokKey).join("|");
    pairs.push(it.answer);
    for (const a of pal) for (const b of pal) { const p = [a, b]; if (pairs.length < 4 && !pairs.some(q => key(q) === key(p))) pairs.push(p); }
    const opts = shuffle(pairs.slice(0, 4));
    const draw = () => {
      const glow = hintLevel >= 2 ? it.rep : 0;
      const say = "Add the next two. What keeps happening again and again?";
      currentReturnSay = currentSay = say;
      render(`
          <section class="card">
            <p class="eyebrow">Pattern Detective · ${idx + 1} of ${items.length}</p>
            <h2>Add the next two</h2>
            ${seqHtml(it.seq, glow)}
            <p class="muted">What keeps happening again and again?</p>
            <div class="row" role="group" aria-label="How do you want to answer?">
              <button class="btn small" id="mPair" aria-pressed="${mode === "pair"}">Choose a pair</button>
              <button class="btn small" id="mPlace" aria-pressed="${mode === "place"}">Place shapes</button>
            </div>
            ${mode === "pair" ? `<div class="choices">${opts.map((p, i) => `<button class="choice" data-p="${i}" aria-pressed="${picked === i}" aria-label="${p.map(tokLabel).join(", ")}"><div class="row" style="justify-content:center;gap:6px">${p.map(t => tokSvg(t, 44)).join("")}</div></button>`).join("")}</div>`
            : `<div class="row" style="justify-content:center">${slots.map((s, i) => `<button class="slot${s ? " filled" : ""}" data-s="${i}" aria-label="${s ? "Space " + (i + 1) + ": " + tokLabel(s) + ". Tap to clear" : "Empty space " + (i + 1)}">${s ? tokSvg(s, 48) : ""}</button>`).join("")}</div>
                 <div class="choices">${pal.map((t, i) => `<button class="choice" data-t="${i}" aria-label="Add ${tokLabel(t)}">${tokSvg(t, 44)}</button>`).join("")}</div>`}
            ${thinkPrompt()}${hintLevel >= 1 ? `<div class="hint">${hintLevel >= 2 ? (it.rep ? "Look at the shapes with the dotted line. That part repeats." : "Count the dots. How many more each time?") : "Look for something that repeats."}</div>` : ""}
            ${fb ? `<div class="feedback gentle">${esc(fb)}</div>` : ""}
            <div class="row">
              <button class="btn primary" id="pCheck">Check my pattern</button>
              <button class="btn" id="pHint"${hintLevel >= 2 ? " disabled" : ""}>Use a hint</button>
              <button class="btn quiet" id="pSkip">Move on without an answer</button>
            </div>
          </section>`);
      on("#mPair", () => { mode = "pair"; rec.mode = "pair"; draw(); });
      on("#mPlace", () => { mode = "place"; rec.mode = "place"; draw(); });
      on("[data-p]", e => { picked = +e.currentTarget.dataset.p; fb = ""; draw(); });
      on("[data-s]", e => { slots[+e.currentTarget.dataset.s] = null; fb = ""; draw(); });
      on("[data-t]", e => { const t = pal[+e.currentTarget.dataset.t]; const i = slots.indexOf(null); if (i >= 0) { slots[i] = t; fb = ""; draw(); } });
      on("#pHint", () => { hintLevel = Math.min(2, hintLevel + 1); rec.hints = hintLevel; draw(); speak(hintLevel >= 2 ? (it.rep ? "Look at the shapes with the dotted line. That part repeats." : "Count the dots. How many more each time?") : "Look for something that repeats."); });
      on("#pSkip", () => { rec.movedOn = true; next(); });
      on("#pCheck", () => {
        const ans = mode === "pair" ? (picked === null ? null : opts[picked]) : (slots.includes(null) ? null : slots);
        if (!ans) { fb = mode === "pair" ? "Choose a pair first." : "Fill both spaces first."; draw(); speak(fb); return; }
        rec.checks++;
        const ok = key(ans) === key(it.answer);
        if (rec.firstMatched === null) rec.firstMatched = ok;
        rec.latestMatched = ok;
        if (ok) { const t = "You found the rule and used it."; speak(t); fb = ""; next(t); }
        else { fb = "Check the repeating order. You can change your choices or use a hint."; draw(); speak(fb); }
      });
    };
    const next = (praise) => {
      results.push(rec);
      idx++;
      if (idx < items.length) {
        if (praise) {
          render(`<section class="card"><div class="feedback">${esc(praise)}</div><div class="row"><button class="btn primary" id="nGo" data-focus>Next pattern</button></div></section>`);
          on("#nGo", doItem);
        } else doItem();
      } else {
        reflect(run, "What helped you decide?", ["Finding the repeating part", "Counting", "Trying different choices", "Not sure"], r => {
          finishExercise(run, results, r, "You looked carefully at the patterns. Well done for sticking with it.");
        });
      }
    };
    draw();
  };
  doItem();
}
