"use strict";

// ---------- Memory Match (Memory and Attention) ----------
const MEM_KINDS = [
  ["circle", "circle", "var(--shape-a)"], ["square", "square", "var(--shape-b)"], ["triangle", "triangle", "var(--shape-c)"],
  ["diamond", "diamond", "var(--shape-d)"], ["star", "star", "var(--leaf)"], ["heart", "heart", "var(--soil)"]
];
function memIcon(k, size) {
  const def = MEM_KINDS.find(m => m[0] === k), col = def[2];
  let p;
  if (k === "star") p = `<path d="M28 7 L33.5 21 L48 21.5 L36.5 30.5 L40.5 45 L28 36.5 L15.5 45 L19.5 30.5 L8 21.5 L22.5 21 Z" fill="${col}"/>`;
  else if (k === "heart") p = `<path d="M28 46 C10 34 8 22 15 16 C21 11 27 15 28 20 C29 15 35 11 41 16 C48 22 46 34 28 46 Z" fill="${col}"/>`;
  else return shape(k, { size: size || 52, label: def[1] });
  return `<svg width="${size || 52}" height="${size || 52}" viewBox="0 0 56 56" role="img" aria-label="${def[1]}">${p}</svg>`;
}
function gameMemory(run) {
  const nPairs = S.band === "older" ? 6 : 3;
  const kinds = MEM_KINDS.slice(0, nPairs).map(m => m[0]);
  const cards = shuffle(kinds.concat(kinds));
  const rec = newRec(`${nPairs} pairs`, { mode: "tap", moves: 0 });
  let up = [], matched = new Set(), hint = 0, glow = [], fb = "";
  activeEx = { abort: () => {} };
  const draw = () => {
    const say = "Turn over two cards. Can you find the ones that match? Where did you see that one before?";
    currentReturnSay = currentSay = say;
    const mismatch = up.length === 2;
    render(`
        <section class="card">
          <p class="eyebrow">Memory Match · ${matched.size / 2} of ${nPairs} pairs found</p>
          <h2>Find the pairs</h2>
          <p class="muted">Turn over two cards at a time. Where did you see that one before?</p>
          <div class="mem" style="grid-template-columns:repeat(${nPairs === 3 ? 3 : 4}, minmax(0, 1fr))">${cards.map((k, i) => {
          const open = matched.has(i) || up.includes(i);
          return `<button class="memcard${open ? " open" : ""}${matched.has(i) ? " done" : ""}${glow.includes(i) ? " glow" : ""}" data-m="${i}" aria-label="${open ? "Card " + (i + 1) + ", " + k + (matched.has(i) ? ", matched" : "") : "Card " + (i + 1) + ", face down"}"${matched.has(i) || mismatch ? ' aria-disabled="true"' : ""}>${open ? memIcon(k, 52) : '<span aria-hidden="true" class="memback"></span>'}</button>`;
        }).join("")}</div>
          ${mismatch ? `<div class="feedback gentle">Not a pair this time. Have a good look, then turn them back.</div><div class="row"><button class="btn primary" id="mBack" data-focus>Turn them back</button></div>` : ""}
          ${thinkPrompt()}${hint ? `<div class="hint">${hint >= 2 ? "The two cards with the dotted line are a pair." : "Turn over one card, then think: where did you see its partner?"}</div>` : ""}
          ${fb ? `<div class="feedback gentle">${esc(fb)}</div>` : ""}
          <div class="row">
            <button class="btn" id="mHint"${hint >= 2 ? " disabled" : ""}>Use a hint</button>
            <button class="btn quiet" id="mSkip">Move on without an answer</button>
          </div>
        </section>`);
    on("[data-m]", e => {
      const i = +e.currentTarget.dataset.m;
      if (matched.has(i) || up.includes(i) || up.length === 2) return;
      up.push(i);
      if (up.length === 2) {
        rec.moves++; rec.checks++;
        if (cards[up[0]] === cards[up[1]]) {
          up.forEach(j => matched.add(j)); glow = glow.filter(j => !matched.has(j)); up = [];
          if (matched.size === cards.length) { rec.firstMatched = rec.hints === 0; rec.latestMatched = true; return done("You found all the pairs. You remembered where they were."); }
          speak("That's a pair.");
        }
      }
      draw();
    });
    on("#mBack", () => { up = []; draw(); });
    on("#mHint", () => {
      hint = Math.min(2, hint + 1); rec.hints = hint;
      if (hint === 2) { const left = cards.map((k, i) => i).filter(i => !matched.has(i)); const k = cards[left[0]]; glow = left.filter(i => cards[i] === k); }
      draw(); speak(hint >= 2 ? "The two cards with the dotted line are a pair." : "Turn over one card, then think: where did you see its partner?");
    });
    on("#mSkip", () => { rec.movedOn = true; done(); });
  };
  const done = (praise) => {
    if (praise) speak(praise);
    const go = () => reflect(run, "What helped you remember?", ["Saying the names in my head", "Remembering where they were", "Turning cards in order", "Not sure"], r =>
      finishExercise(run, [rec], r, "You kept looking and remembering. Thank you for trying Memory Match.", `Turns taken: ${rec.moves}. Pairs found: ${matched.size / 2} of ${nPairs}.`));
    if (praise) praiseThen(praise, "Next", go); else go();
  };
  draw();
}
