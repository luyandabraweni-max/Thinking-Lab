"use strict";

// ---------- Share the Vetkoek ----------
function vkSvg(frac, size) {
  // frac: 1, 0.5, 0.25
  size = size || 46;
  const body = '<ellipse cx="24" cy="26" rx="19" ry="13" fill="var(--gold)"/><ellipse cx="24" cy="23" rx="15" ry="8" fill="var(--gold-soft)" opacity="0.55"/>';
  if (frac === 1) return `<svg width="${size}" height="${size}" viewBox="0 0 48 48" role="img" aria-label="a vetkoek">${body}</svg>`;
  if (frac === 0.5) return `<svg width="${size * 0.7}" height="${size}" viewBox="0 0 26 48" role="img" aria-label="half a vetkoek"><path d="M24 13 A19 13 0 0 0 24 39 Z" fill="var(--gold)"/></svg>`;
  return `<svg width="${size * 0.6}" height="${size * 0.7}" viewBox="0 0 24 30" role="img" aria-label="a quarter of a vetkoek"><path d="M22 4 L22 26 A19 13 0 0 1 4 18 Z" fill="var(--gold)"/></svg>`;
}
const FR = { 1: "1", 0.5: "½", 0.25: "¼", 0.75: "¾", 2: "2", 3: "3", 1.5: "1½" };
function fracWord(v) { return FR[v] || String(v); }
function gameVetkoek(run) {
  const steps = S.band === "older"
    ? [{ n: 12, friends: 4, title: "12 vetkoek, 4 friends", choices: [2, 3, 4, 1] }, { n: 3, friends: 4, title: "3 vetkoek, 4 friends", choices: [0.75, 0.5, 1, 0.25] }]
    : [{ n: 6, friends: 3, title: "6 vetkoek, 3 friends", choices: [2, 1, 3, 6] }, { n: 2, friends: 4, title: "2 vetkoek, 4 friends", choices: [0.5, 1, 2, 0.25] }];
  const friends = ["Thandi", "Sipho", "Lerato", "Ayanda"];
  const results = []; let si = 0;
  activeEx = { abort: () => {} };
  const doStep = () => {
    const st = steps[si];
    const target = st.n / st.friends;
    const rec = { title: st.title, checks: 0, hints: 0, firstMatched: null, latestMatched: false, movedOn: false, mode: S.answer === "build" ? "share" : "number", moves: 0, exampleOpened: false };
    let basket = Array(st.n).fill(1), plates = Array.from({ length: st.friends }, () => []), mode = S.answer === "build" ? "share" : "num", pickedNum = null, hint = 0, fb = "";
    const sum = a => a.reduce((x, y) => x + y, 0);
    const draw = () => {
      const say = `${st.n} vetkoek, ${st.friends} friends. How can everyone get the same?`;
      currentReturnSay = currentSay = say;
      render(`
          <section class="card">
            <p class="eyebrow">Share the Vetkoek · ${si + 1} of ${steps.length}</p>
            <h2>Sprout has ${st.n} vetkoek for ${st.friends} friends. Share them fairly.</h2>
            <p class="muted">How can everyone get the same?</p>
            <div class="row" role="group" aria-label="How do you want to answer?">
              <button class="btn small" id="mShare" aria-pressed="${mode === "share"}">Share on the plates</button>
              <button class="btn small" id="mNum" aria-pressed="${mode === "num"}">Tap how much each friend gets</button>
            </div>
            ${mode === "share" ? `
              <div><p class="note">The basket. Tap a plate to give that friend one piece.</p>
              <div class="basket" aria-label="Basket">${basket.length ? basket.map(f => `<span>${vkSvg(f, 40)}</span>`).join("") : '<span class="muted">The basket is empty.</span>'}</div></div>
              <div class="row"><button class="btn small" id="vCut"${basket.some(f => f > 0.25) ? "" : " disabled"}>Cut the basket pieces in half</button></div>
              <div class="plates">${plates.map((p, i) => `<div style="display:flex;flex-direction:column;gap:6px;align-items:center"><button class="plate" data-pl="${i}" aria-label="${friends[i]}'s plate, ${p.length} pieces. Tap to give one more">${p.map(f => `<span class="vk">${vkSvg(f, 34)}</span>`).join("")}<span class="who">${friends[i]}</span></button><button class="btn small quiet" data-back="${i}"${p.length ? "" : " disabled"}>Take one back</button></div>`).join("")}</div>`
          : `<p>Each friend gets...</p><div class="choices">${st.choices.map((c, i) => `<button class="choice" data-c="${i}" aria-pressed="${pickedNum === i}"><span class="lbl" style="font-size:1.4rem">${fracWord(c)}</span><span class="note">${c < 1 ? "of a vetkoek" : c === 1 ? "vetkoek" : "vetkoek"}</span></button>`).join("")}</div>`}
            ${thinkPrompt()}${hint ? `<div class="hint">${hint >= 2 ? `Each friend gets ${fracWord(target)} ${target < 1 ? "of a vetkoek" : "vetkoek"}. Can you share it that way?` : (target < 1 ? "There aren't enough to give each friend a whole one. Try cutting them." : "Give one to each friend, then go round again.")}</div>` : ""}
            ${fb ? `<div class="feedback gentle">${esc(fb)}</div>` : ""}
            <div class="row">
              <button class="btn primary" id="vCheck">Check if it's fair</button>
              <button class="btn" id="vHint"${hint >= 2 ? " disabled" : ""}>Use a hint</button>
              <button class="btn quiet" id="vSkip">Move on without an answer</button>
            </div>
          </section>`);
      on("#mShare", () => { mode = "share"; rec.mode = "share"; draw(); });
      on("#mNum", () => { mode = "num"; rec.mode = "number"; draw(); });
      on("#vCut", () => { basket = basket.flatMap(f => f > 0.25 ? [f / 2, f / 2] : [f]); rec.moves++; draw(); });
      on("[data-back]", e => { const i = +e.currentTarget.dataset.back; if (!plates[i].length) return; basket.push(plates[i].pop()); rec.moves++; fb = ""; draw(); });
      on("[data-pl]", e => { if (!basket.length) { fb = "The basket is empty. Check if it's fair."; draw(); return; } const i = +e.currentTarget.dataset.pl; basket.sort((a, b) => b - a); plates[i].push(basket.shift()); rec.moves++; fb = ""; draw(); });
      on("[data-c]", e => { pickedNum = +e.currentTarget.dataset.c; fb = ""; draw(); });
      on("#vHint", () => { hint = Math.min(2, hint + 1); rec.hints = hint; draw(); });
      on("#vSkip", () => { rec.movedOn = true; done(); });
      on("#vCheck", () => {
        let ok;
        if (mode === "share") {
          if (basket.length) { fb = "There are still pieces in the basket."; draw(); speak(fb); return; }
          ok = plates.every(p => Math.abs(sum(p) - target) < 1e-9);
        } else {
          if (pickedNum === null) { fb = "Tap how much each friend gets first."; draw(); speak(fb); return; }
          ok = Math.abs(st.choices[pickedNum] - target) < 1e-9;
        }
        rec.checks++;
        if (rec.firstMatched === null) rec.firstMatched = ok;
        rec.latestMatched = ok;
        if (ok) { speak("Everyone got the same. You checked each plate."); done("Everyone got the same. You checked each plate."); }
        else { fb = "Not everyone has the same yet. You can move pieces, or use a hint."; draw(); speak(fb); }
      });
    };
    const done = (praise) => {
      results.push(rec); si++;
      if (si < steps.length) {
        if (praise) { render(`<section class="card"><div class="feedback">${esc(praise)}</div><div class="row"><button class="btn primary" id="nGo" data-focus>Next</button></div></section>`); on("#nGo", doStep); }
        else doStep();
      } else reflect(run, "How did you share?", ["One at a time", "Counted first", "Tried and fixed it", "Not sure"], r => finishExercise(run, results, r, "You thought about how to make it fair. Thank you for sharing your thinking."));
    };
    draw();
  };
  doStep();
}
