"use strict";

// ---------- Paint Pots (Inquiry and Exploration) ----------
const PAINT = { red: "#B5584A", yellow: "#D9B44A", blue: "#4F7FB0", white: "#F4F1EA" };
const MIXES = { "red+yellow": ["orange", "#D98A3D"], "blue+yellow": ["green", "#6E9A52"], "blue+red": ["purple", "#7D5A94"], "red+white": ["pink", "#E3A6A0"], "blue+white": ["light blue", "#A9C4DE"], "white+yellow": ["cream", "#EFE3B8"] };
const mixOf = (a, b) => a === b ? [a, PAINT[a]] : MIXES[[a, b].sort().join("+")];
// Each paint has its own texture, and a mix shows both, so the game still works in greyscale or for colour-blind learners
const PAINT_TEX = { red: "stripes", yellow: "dots", blue: "lines", white: "rings" };
const paintTex = name => PAINT[name] ? [PAINT_TEX[name]] : Object.keys(MIXES).find(k => MIXES[k][0] === name).split("+").map(p => PAINT_TEX[p]);
const paintCol = name => PAINT[name] || Object.values(MIXES).find(m => m[0] === name)[1];
const potSvg = (name, size) => { const tex = textures(paintTex(name)), body = "M8 16 H40 L37 42 Q36 45 33 45 H15 Q12 45 11 42 Z"; return `<svg width="${size}" height="${size}" viewBox="0 0 48 48" aria-hidden="true">${tex.defs}<path d="${body}" fill="${paintCol(name)}" stroke="var(--ink)" stroke-opacity="0.35" stroke-width="1.5"/>${tex.urls.map(u => `<path d="${body}" fill="${u}"/>`).join("")}<rect x="6" y="11" width="36" height="7" rx="3" fill="var(--surface)" stroke="var(--ink)" stroke-opacity="0.35" stroke-width="1.5"/></svg>`; };
const swatch = name => { const tex = textures(paintTex(name)); return `<svg class="swatch" viewBox="0 0 44 44" aria-hidden="true">${tex.defs}<circle cx="22" cy="22" r="21" fill="${paintCol(name)}"/>${tex.urls.map(u => `<circle cx="22" cy="22" r="21" fill="${u}"/>`).join("")}</svg>`; };
const texNote = '<p class="note">Each paint has its own pattern. A mix shows the patterns of both paints.</p>';
function gamePaint(run) {
  const questions = S.band === "older"
    ? [{ predict: ["red", "blue"], options: ["purple", "green", "orange"], title: "Predict, then test: red and blue" }, { ask: "pink", ans: ["red", "white"], title: "Which two make pink?" }, { ask: "green", ans: ["blue", "yellow"], title: "Which two make green?" }]
    : [{ ask: "green", ans: ["blue", "yellow"], title: "Which two make green?" }, { ask: "orange", ans: ["red", "yellow"], title: "Which two make orange?" }];
  const results = []; const tried = [];
  activeEx = { abort: () => {} };
  // 1. Free exploration first: there is nothing to get wrong here.
  const explore = () => {
    let sel = [], last = null;
    const draw = () => {
      const say = "Paint Pots. Tap two pots, then press Mix to see what happens. Try as many as you like.";
      currentReturnSay = currentSay = say;
      render(`
          <section class="card">
            <p class="eyebrow">Paint Pots · explore</p>
            <h2>What happens when you mix two paints?</h2>
            <p class="muted">Tap two pots, then press Mix. Try as many as you like.</p>
            <div class="pots">${Object.keys(PAINT).map(c => `<button class="pot" data-pc="${c}" aria-pressed="${sel.includes(c)}">${potSvg(c, 56)}<span class="lbl">${c}</span></button>`).join("")}</div>
            <div class="bowl" aria-live="polite">${last ? `${swatch(last[3])}<span><b>${last[0]}</b> and <b>${last[1]}</b> make <b>${last[3]}</b>.</span>` : `<span class="muted">The mixing bowl is empty.</span>`}</div>
            <div class="row">
              <button class="btn primary" id="ppMix"${sel.length === 2 ? "" : " disabled"}>Mix</button>
              <button class="btn" id="ppReady">${tried.length ? "I'm ready for a question" : "Skip exploring"}</button>
            </div>
            ${texNote}
            ${tried.length ? `<p class="note">You have tried ${tried.length} mix${tried.length > 1 ? "es" : ""}.</p>` : ""}
          </section>`);
      on("[data-pc]", e => { const c = e.currentTarget.dataset.pc; sel = sel.includes(c) ? sel.filter(x => x !== c) : sel.concat(c).slice(-2); draw(); });
      on("#ppMix", () => { const m = mixOf(sel[0], sel[1]); last = [sel[0], sel[1], m[1], m[0]]; tried.push(sel.slice().sort().join("+")); speak(`${sel[0]} and ${sel[1]} make ${m[0]}.`); sel = []; draw(); });
      on("#ppReady", () => { qi = 0; ask(); });
    };
    draw();
  };
  let qi = 0;
  const ask = () => {
    const q = questions[qi];
    const rec = newRec(q.title, { tests: 0 });
    let sel = [], picked = null, hint = 0, fb = "", stage = q.predict ? "predict" : "answer", testShown = null;
    // Pair options for "choose" mode: the answer plus two others
    const allPairs = Object.keys(MIXES).map(k => k.split("+"));
    const pairOpts = q.ans ? shuffle([q.ans].concat(shuffle(allPairs.filter(p => p.slice().sort().join() !== q.ans.slice().sort().join())).slice(0, 2))) : [];
    const draw = () => {
      const say = q.predict ? `Before you mix: what do you think ${q.predict[0]} and ${q.predict[1]} will make?` : `Which two paints make ${q.ask}? What do you think will happen?`;
      currentReturnSay = currentSay = say;
      let body;
      if (stage === "predict") body = `
            <h2>What do you think ${q.predict[0]} and ${q.predict[1]} will make?</h2>
            <p class="muted">Make a guess first. Then you can test it.</p>
            <div class="choices">${q.options.map((o, i) => `<button class="choice" data-po="${i}" aria-pressed="${picked === i}">${swatch(o)}<span class="lbl">${o}</span></button>`).join("")}</div>`;
      else if (stage === "test") body = `
            <h2>Now test it</h2>
            <p>You guessed <b>${q.options[picked]}</b>. Press Mix to see what really happens.</p>
            <div class="pots">${q.predict.map(c => `<div class="pot" aria-hidden="true">${potSvg(c, 56)}<span class="lbl">${c}</span></div>`).join("")}</div>
            <div class="bowl" aria-live="polite">${testShown ? `${swatch(testShown[0])}<span>${q.predict[0]} and ${q.predict[1]} make <b>${testShown[0]}</b>.</span>` : `<span class="muted">The mixing bowl is empty.</span>`}</div>`;
      else body = `
            <h2>Which two paints make ${q.ask}?</h2>
            <div class="bowl">${swatch(q.ask)}<span>This is <b>${q.ask}</b>.</span></div>
            <div class="row" role="group" aria-label="How do you want to answer?">
              <button class="btn small" id="ppModeC" aria-pressed="${rec.mode === "choose"}">Choose a pair</button>
              <button class="btn small" id="ppModeB" aria-pressed="${rec.mode === "build"}">Mix the pots myself</button>
            </div>
            ${rec.mode === "choose"
            ? `<div class="choices">${pairOpts.map((p, i) => `<button class="choice" data-pp="${i}" aria-pressed="${picked === i}" aria-label="${p[0]} and ${p[1]}"><span class="row" style="justify-content:center;gap:4px">${potSvg(p[0], 40)}${potSvg(p[1], 40)}</span><span class="lbl">${p[0]} and ${p[1]}</span></button>`).join("")}</div>`
            : `<div class="pots">${Object.keys(PAINT).map(c => `<button class="pot" data-pc="${c}" aria-pressed="${sel.includes(c)}">${potSvg(c, 56)}<span class="lbl">${c}</span></button>`).join("")}</div>
                 <div class="bowl" aria-live="polite">${testShown ? `${swatch(testShown[0])}<span>${testShown[2]} make <b>${testShown[0]}</b>.</span>` : `<span class="muted">Tap two pots. You can try them in the bowl first.</span>`}</div>
                 <div class="row"><button class="btn small" id="ppTry"${sel.length === 2 ? "" : " disabled"}>Try them in the bowl</button></div>`}`;
      const hintText = q.predict ? (hint >= 2 ? "Think of the colour of grapes or jacaranda flowers." : "Red is warm and blue is cool. What sits in between?") : (hint >= 2 ? `One of them is ${q.ans[0]}.` : "Try mixing different pots and look at the bowl.");
      render(`
          <section class="card">
            <p class="eyebrow">Paint Pots · ${qi + 1} of ${questions.length}</p>
            ${body}
            ${thinkPrompt()}${hint ? `<div class="hint">${esc(hintText)}</div>` : ""}
            ${fb ? `<div class="feedback gentle">${esc(fb)}</div>` : ""}
            ${stage === "test"
            ? `<div class="row"><button class="btn primary" id="ppTest"${testShown ? " disabled" : ""}>Mix</button>${testShown ? '<button class="btn primary" id="ppNext" data-focus>Next</button>' : ""}</div>`
            : actionRow({ check: "ppCheck", checkLabel: stage === "predict" ? "That's my guess" : "Check my answer", hint: "ppHint", skip: "ppSkip" }, hint)}
          </section>`);
      on("#ppModeC", () => { rec.mode = "choose"; draw(); });
      on("#ppModeB", () => { rec.mode = "build"; draw(); });
      on("[data-po]", e => { picked = +e.currentTarget.dataset.po; fb = ""; draw(); });
      on("[data-pp]", e => { picked = +e.currentTarget.dataset.pp; fb = ""; draw(); });
      on("[data-pc]", e => { const c = e.currentTarget.dataset.pc; sel = sel.includes(c) ? sel.filter(x => x !== c) : sel.concat(c).slice(-2); fb = ""; draw(); });
      on("#ppTry", () => { const m = mixOf(sel[0], sel[1]); rec.tests++; testShown = [m[0], m[1], `${sel[0]} and ${sel[1]}`]; speak(`${sel[0]} and ${sel[1]} make ${m[0]}.`); draw(); });
      on("#ppHint", () => { hint = Math.min(2, hint + 1); rec.hints = hint; draw(); });
      on("#ppSkip", () => { rec.movedOn = true; next(); });
      on("#ppTest", () => { testShown = mixOf(q.predict[0], q.predict[1]); rec.tests++; speak(`${q.predict[0]} and ${q.predict[1]} make ${testShown[0]}.`); draw(); });
      on("#ppNext", () => next(rec.latestMatched ? "Your guess matched what happened." : "You tested your guess and found out what really happens. That is what scientists do."));
      on("#ppCheck", () => {
        if (stage === "predict") {
          if (picked === null) { fb = "Choose your guess first."; draw(); return; }
          rec.checks++; rec.prediction = q.options[picked];
          const ok = q.options[picked] === mixOf(q.predict[0], q.predict[1])[0];
          rec.firstMatched = ok; rec.latestMatched = ok; stage = "test"; draw(); return;
        }
        const ans = rec.mode === "choose" ? (picked === null ? null : pairOpts[picked]) : (sel.length === 2 ? sel : null);
        if (!ans) { fb = rec.mode === "choose" ? "Choose a pair first." : "Tap two pots first."; draw(); speak(fb); return; }
        rec.checks++;
        const ok = ans.slice().sort().join() === q.ans.slice().sort().join();
        if (rec.firstMatched === null) rec.firstMatched = ok;
        rec.latestMatched = ok;
        if (ok) { const t = `Yes, ${q.ans[0]} and ${q.ans[1]} make ${q.ask}.`; speak(t); next(t); }
        else { fb = "Not that pair. You can try them in the bowl, or use a hint."; draw(); speak(fb); }
      });
    };
    const next = (praise) => {
      results.push(rec); qi++;
      if (qi < questions.length) { if (praise) praiseThen(praise, "Next question", ask); else ask(); }
      else {
        const fin = () => reflect(run, "How did you find out?", ["I tried mixing", "I guessed first, then checked", "I already knew", "Not sure"], r =>
          finishExercise(run, results, r, "You explored and found things out. Thank you for being a paint scientist.", `Mixes tried while exploring: ${tried.length}.`));
        if (praise) praiseThen(praise, "Next", fin); else fin();
      }
    };
    draw();
  };
  explore();
}
