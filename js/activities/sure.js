"use strict";

// ---------- How Sure Am I? (Creativity and Metacognition: knowing what you know) ----------
// Puzzles where the learner answers, then says how sure they are, before the answer is shown. Some are optical
// illusions, where feeling sure and being right come apart. It ends with the learner's own "Sure-o-meter".
// Records each answer with its confidence: how well confidence matches being right is a view of self-awareness.
const HS_CONF = [["guess", "🤷", "Just guessing"], ["fair", "🙂", "Fairly sure"], ["very", "💪", "Very sure"]];
const hsStar = (cx, cy, r, n) => `<path d="${Array.from({ length: n * 2 }, (_, i) => { const a = Math.PI * i / n - Math.PI / 2, rr = i % 2 ? r * 0.45 : r; return `${i ? "L" : "M"}${(cx + rr * Math.cos(a)).toFixed(1)} ${(cy + rr * Math.sin(a)).toFixed(1)}`; }).join(" ")} Z"/>`;
const HS_PUZZLES = {
  lines: { q: "Which line is longer?", opts: ["The top line", "The bottom line", "They are the same"], answer: 2, illusion: true,
    why: "They are exactly the same length! The arrow ends trick your eyes. This is called the Müller-Lyer illusion.",
    art: () => `<svg class="hs-art" viewBox="0 0 220 120" aria-hidden="true"><g stroke="var(--ink)" stroke-width="4" stroke-linecap="round"><path d="M50 35 H170 M50 90 H170"/>
      <g class="hs-fins"><path d="M50 35 L34 20 M50 35 L34 50 M170 35 L186 20 M170 35 L186 50 M50 90 L66 75 M50 90 L66 105 M170 90 L154 75 M170 90 L154 105"/></g></g>
      <g class="hs-proof" stroke="var(--shape-a)" stroke-width="2" stroke-dasharray="4 4"><path d="M50 8 V112 M170 8 V112"/></g></svg>`,
    sr: "Two lines. The top one has arrow ends pointing outwards, the bottom one has arrow ends pointing inwards." },
  circles: { q: "Which middle circle is bigger?", opts: ["The one on the left", "The one on the right", "They are the same"], answer: 2, illusion: true,
    why: "Both middle circles are the same size! Big circles around one make it look small. This is the Ebbinghaus illusion.",
    art: () => `<svg class="hs-art" viewBox="0 0 240 120" aria-hidden="true"><g fill="var(--gold)" stroke="var(--ink)" stroke-width="1.5"><circle cx="60" cy="60" r="12"/><circle cx="180" cy="60" r="12"/></g>
      <g class="hs-fins" fill="var(--muted)">${[0, 1, 2, 3, 4, 5].map(i => `<circle cx="${(60 + 40 * Math.cos(i * Math.PI / 3)).toFixed(1)}" cy="${(60 + 40 * Math.sin(i * Math.PI / 3)).toFixed(1)}" r="17"/>`).join("")}${[0, 1, 2, 3, 4, 5, 6, 7].map(i => `<circle cx="${(180 + 21 * Math.cos(i * Math.PI / 4)).toFixed(1)}" cy="${(60 + 21 * Math.sin(i * Math.PI / 4)).toFixed(1)}" r="5"/>`).join("")}</g></svg>`,
    sr: "Two gold circles. The left one is surrounded by big circles, the right one by small circles." },
  arcs: { q: "Which shape is bigger?", opts: ["The top shape", "The bottom shape", "They are the same"], answer: 2, illusion: true,
    why: "They are exactly the same! Watch the bottom one slide up and fit over the top one. This is the Jastrow illusion.",
    art: () => `<svg class="hs-art" viewBox="0 0 220 130" aria-hidden="true"><path d="M30 46 Q110 0 190 46 L166 64 Q110 30 54 64 Z" fill="var(--shape-a)" stroke="var(--ink)" stroke-width="2"/>
      <g class="hs-slide"><path d="M30 46 Q110 0 190 46 L166 64 Q110 30 54 64 Z" transform="translate(0 52)" fill="var(--shape-b)" stroke="var(--ink)" stroke-width="2"/></g></svg>`,
    sr: "Two curved shapes, one above the other." },
  coins: { q: "Which row has more coins?", opts: ["The top row", "The bottom row", "They are the same"], answer: 2, illusion: true,
    why: "Both rows have 6 coins. The bottom row is just spread out, so it looks like more.",
    art: () => `<svg class="hs-art" viewBox="0 0 240 110" aria-hidden="true"><g fill="var(--gold)" stroke="var(--ink)" stroke-width="1.5">${[0, 1, 2, 3, 4, 5].map(i => `<circle cx="${70 + i * 20}" cy="30" r="8"/><circle cx="${20 + i * 40}" cy="78" r="8"/>`).join("")}</g>
      <g class="hs-proof" font-size="11" font-weight="700" fill="var(--ink)" text-anchor="middle">${[0, 1, 2, 3, 4, 5].map(i => `<text x="${70 + i * 20}" y="52">${i + 1}</text><text x="${20 + i * 40}" y="102">${i + 1}</text>`).join("")}</g></svg>`,
    sr: "Two rows of coins. The top row is close together, the bottom row is spread out." },
  count: { q: "How many stars are there?", opts: ["6", "7", "8"], answer: 1, why: "There are 7 stars. Counting one by one, and touching each, helps you be sure.",
    art: () => `<svg class="hs-art" viewBox="0 0 220 110" aria-hidden="true"><g fill="var(--gold)" stroke="var(--ink)" stroke-width="1.5">${[[30, 30], [80, 22], [140, 34], [190, 26], [52, 80], [112, 76], [172, 84]].map(([x, y]) => hsStar(x, y, 14, 5)).join("")}</g></svg>`,
    sr: "A picture of some stars, spread out." },
  next: { q: "What comes next? 2, 4, 6, 8, ...", opts: ["9", "10", "12"], answer: 1, why: "Each number is 2 more than the one before, so 10 comes next." },
  fib: { q: "What comes next? 1, 1, 2, 3, 5, 8, ...", opts: ["11", "12", "13"], answer: 2, why: "Each number is the two before it added together: 5 + 8 = 13." },
  odd: { q: "Which one is different?", opts: ["A", "B", "C", "D"], answer: 2, why: "C is a square. The others are triangles.",
    pics: [0, 1, 2, 3].map(i => `<svg width="48" height="48" viewBox="0 0 40 40" aria-hidden="true"><g fill="var(--shape-c)" stroke="var(--ink)" stroke-width="2">${i === 2 ? '<rect x="7" y="7" width="26" height="26" rx="2"/>' : '<path d="M20 5 L35 34 H5 Z"/>'}</g></svg>`) },
  oddStar: { q: "Which star is different?", opts: ["A", "B", "C", "D"], answer: 3, why: "Star D has 6 points. The others have 5. Looking closely pays off!",
    pics: [0, 1, 2, 3].map(i => `<svg width="48" height="48" viewBox="0 0 40 40" aria-hidden="true"><g fill="var(--gold)" stroke="var(--ink)" stroke-width="1.5">${hsStar(20, 21, 17, i === 3 ? 6 : 5)}</g></svg>`) },
  scales: { q: "A is heavier than B. B is heavier than C. Which is the heaviest?", opts: ["A", "B", "C"], answer: 0, why: "A is heavier than B, and B is heavier than C, so A must be the heaviest." }
};
const HS_SETS = { younger: ["count", "next", "odd", "lines", "coins"], older: ["lines", "circles", "arcs", "fib", "scales", "oddStar", "coins"] };

function gameSure(run) {
  labStart(run);
  const list = HS_SETS[S.band === "older" ? "older" : "younger"], items = []; let pi = 0;
  const doPuzzle = () => {
    const P = HS_PUZZLES[list[pi]], rec = newRec(P.q, { mode: "answered then rated" });
    let picked = null, conf = null;
    const draw = () => {
      const right = picked === P.answer, shown = conf != null;
      currentReturnSay = currentSay = shown ? (right ? "Right! " : "Not this time. ") + P.why : picked == null ? P.q : "How sure are you?";
      render(`<section class="card">${labHead(run, `Puzzle ${pi + 1} of ${list.length}`)}
          <h2>${esc(P.q)}</h2>
          ${P.art ? `<div class="hs-stage${shown ? " revealed" : ""}${reduceMotion() ? " still" : ""}">${P.art()}</div><p class="sr">${esc(P.sr)}</p>` : ""}
          <div class="choices">${P.opts.map((t, i) => `<button class="choice${shown && i === P.answer ? " hs-right" : ""}" data-a="${i}" aria-pressed="${picked === i}"${shown ? " disabled" : ""}>${P.pics ? `<span class="opt-pic">${P.pics[i]}</span>` : ""}<span class="lbl">${esc(t)}${shown && i === P.answer ? " (the answer)" : ""}</span></button>`).join("")}</div>
          ${picked != null && !shown ? `<h3>How sure are you?</h3><div class="choices hs-conf">${HS_CONF.map(([id, e, l]) => `<button class="choice" data-c="${id}">${icon(e)}<span class="lbl">${l}</span></button>`).join("")}</div>` : ""}
          ${shown ? `<div class="feedback${right ? "" : " gentle"}" role="status"><b>${right ? "Right!" : "Not this time."}</b> You said: ${esc(HS_CONF.find(c => c[0] === conf)[2].toLowerCase())}. ${esc(P.why)}</div>
            <div class="row"><button class="btn primary" id="hsNext" data-focus>${pi + 1 < list.length ? "Next puzzle" : "See my Sure-o-meter"}</button></div>`
            : `${thinkPrompt()}<div class="row"><button class="btn quiet" id="lkSkip">Move on without an answer</button></div>`}
        </section>`);
      on("[data-a]", e => { picked = +e.currentTarget.dataset.a; run.acted = true; draw(); speakNow("How sure are you? Just guessing, fairly sure, or very sure?"); const c = $main.querySelector("[data-c]"); if (c) c.focus({ preventScroll: true }); });
      on("[data-c]", e => {
        conf = e.currentTarget.dataset.c; rec.conf = conf; rec.checks = 1; rec.firstMatched = rec.latestMatched = picked === P.answer; rec.illusion = !!P.illusion;
        draw(); speakNow((picked === P.answer ? "Right! " : "Not this time. ") + P.why); const b = document.getElementById("hsNext"); if (b) b.focus({ preventScroll: true });
      });
      on("#hsNext", () => { items.push(rec); pi++; pi < list.length ? doPuzzle() : meter(); });
      on("#lkSkip", () => { rec.movedOn = true; items.push(rec); pi++; pi < list.length ? doPuzzle() : meter(); });
    };
    labSay(P.q + " " + P.opts.join(". ") + "."); draw();
  };
  // The learner's own Sure-o-meter: for each level of sureness, how often they were right.
  const meter = () => {
    const rated = items.filter(i => i.conf), rows = HS_CONF.map(([id, e, l]) => { const g = rated.filter(i => i.conf === id); return { id, e, l, n: g.length, right: g.filter(i => i.firstMatched).length }; });
    const very = rows[2], tricked = rated.filter(i => i.illusion && i.conf === "very" && !i.firstMatched).length, lucky = rows[0].right;
    const msg = [very.n && very.right / very.n >= 0.75 ? "When you felt very sure, you were usually right. You know when you know!" : "",
      tricked ? `Your eyes played tricks on you ${tricked} time${tricked > 1 ? "s" : ""}, even when you felt very sure. That happens to everyone. Checking is a superpower.` : "",
      lucky ? `When you were just guessing, you were still right ${lucky} time${lucky > 1 ? "s" : ""}. You may know more than you think!` : "",
      !rated.length ? "You can try the puzzles another time." : ""].filter(Boolean);
    if (!msg.length) msg.push("Noticing how sure you feel helps you decide when to check, or when to ask.");
    labSay("Your Sure-o-meter. " + rows.filter(r => r.n).map(r => `${r.l}: right ${r.right} of ${r.n}.`).join(" ") + " " + msg.join(" "));
    render(`<section class="card">${labHead(run, "My Sure-o-meter")}<h2>My Sure-o-meter</h2>
        <div class="hs-meter">${rows.map(r => `<div class="hs-mrow"><span class="hs-mlbl">${icon(r.e)} ${esc(r.l)}</span>
          <span class="hs-dots" aria-hidden="true">${rated.filter(i => i.conf === r.id).map(i => `<span class="hs-dot${i.firstMatched ? " ok" : ""}">${i.firstMatched ? "✓" : "✗"}</span>`).join("") || '<span class="muted">none</span>'}</span>
          <span class="hs-mnum">${r.n ? `right ${r.right} of ${r.n}` : ""}</span></div>`).join("")}</div>
        ${msg.map(m => `<p>${esc(m)}</p>`).join("")}
        <div class="row"><button class="btn primary" id="hsOn" data-focus>Carry on</button></div></section>`);
    on("#hsOn", () => labReflect(run, "What did you learn about your thinking?", ["My eyes can trick me", "When I'm sure, I'm usually right", "My guesses can be right too", "I'm not sure"],
      r => finishExercise(run, items, r, null, `Sure-o-meter: ${rows.map(x => `${x.l.toLowerCase()} ${x.right}/${x.n}`).join(", ")}. Very sure but tricked by an illusion: ${tricked}.`)));
  };
  doPuzzle();
}
