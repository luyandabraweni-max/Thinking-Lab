"use strict";

// ---------- A New Animal for the Kraal (Creativity) ----------
const PARTS = {
  head: [["horns", "Horns"], ["ears", "Long ears"], ["beak", "A beak"]],
  body: [["round", "Round body"], ["long", "Long body"], ["tall", "Tall body"]],
  legs: [["two", "Two legs"], ["four", "Four legs"], ["six", "Six legs"]],
  coat: [["spots", "Spots"], ["stripes", "Stripes"], ["plain", "Plain"]]
};
function animalSvg(a) {
  const body = { round: { cx: 100, cy: 92, rx: 46, ry: 34 }, long: { cx: 100, cy: 96, rx: 62, ry: 24 }, tall: { cx: 100, cy: 84, rx: 34, ry: 44 } }[a.body || "round"];
  const bottom = body.cy + body.ry - 4, hx = body.cx - body.rx + 6, hy = body.cy - body.ry + 6;
  const legX = { two: [-0.3, 0.3], four: [-0.6, -0.25, 0.25, 0.6], six: [-0.65, -0.4, -0.15, 0.15, 0.4, 0.65] }[a.legs || "four"];
  const legs = legX.map(f => `<rect x="${body.cx + f * body.rx - 4}" y="${bottom}" width="8" height="${150 - bottom}" rx="4" fill="var(--soil)"/>`).join("");
  const coat = a.coat === "spots" ? [[-0.3, -0.2], [0.2, 0.1], [0.45, -0.35], [-0.05, 0.4]].map(([fx, fy]) => `<circle cx="${body.cx + fx * body.rx}" cy="${body.cy + fy * body.ry}" r="7" fill="var(--soil)" opacity="0.7"/>`).join("")
    : a.coat === "stripes" ? [-0.4, -0.1, 0.2, 0.5].map(f => `<rect x="${body.cx + f * body.rx - 3}" y="${body.cy - body.ry * 0.8}" width="6" height="${body.ry * 1.6}" rx="3" fill="var(--soil)" opacity="0.6"/>`).join("") : "";
  const head = `<circle cx="${hx}" cy="${hy}" r="20" fill="var(--gold)"/><circle cx="${hx - 7}" cy="${hy - 3}" r="2.6" fill="var(--ink)"/>` +
    (a.head === "horns" ? `<path d="M${hx - 6} ${hy - 17} Q${hx - 14} ${hy - 34} ${hx - 2} ${hy - 36}" stroke="var(--ink)" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M${hx + 8} ${hy - 16} Q${hx + 10} ${hy - 34} ${hx + 20} ${hy - 32}" stroke="var(--ink)" stroke-width="4" fill="none" stroke-linecap="round"/>`
      : a.head === "ears" ? `<ellipse cx="${hx - 4}" cy="${hy - 32}" rx="6" ry="18" fill="var(--gold)"/><ellipse cx="${hx + 10}" cy="${hy - 30}" rx="6" ry="18" fill="var(--gold)" transform="rotate(18 ${hx + 10} ${hy - 30})"/>`
      : a.head === "beak" ? `<path d="M${hx - 18} ${hy + 2} L${hx - 36} ${hy + 8} L${hx - 18} ${hy + 12} Z" fill="var(--shape-d)"/>` : "");
  return `<svg viewBox="0 0 200 160" class="animal" role="img" aria-label="Your animal: ${[a.head, a.body, a.legs, a.coat].filter(Boolean).map(k => Object.values(PARTS).flat().find(p => p[0] === k)[1].toLowerCase()).join(", ") || "not started"}"><rect x="0" y="146" width="200" height="14" fill="var(--sky)"/>${legs}<ellipse cx="${body.cx}" cy="${body.cy}" rx="${body.rx}" ry="${body.ry}" fill="var(--shape-b)"/>${coat}${head}</svg>`;
}
function gameKraal(run) {
  const a = { head: null, body: null, legs: null, coat: null };
  const rec = newRec("New animal", { open: true, mode: "choose parts" });
  let hint = 0;
  activeEx = { abort: () => {} };
  const build = () => {
    const say = "A new animal for the kraal. Choose a head, a body, legs and a coat. What would make your animal special?";
    currentReturnSay = currentSay = say;
    const group = (k, label) => `<div><p class="eyebrow">${label}</p><div class="choices">${PARTS[k].map(([v, l]) => `<button class="choice" data-part="${k}:${v}" aria-pressed="${a[k] === v}"><span class="lbl">${l}</span></button>`).join("")}</div></div>`;
    const ready = a.head && a.body && a.legs && a.coat;
    render(`
        <section class="card">
          <p class="eyebrow">A New Animal for the Kraal</p>
          <h2>Make up a new animal</h2>
          <p class="muted">There is no right answer. Choose the parts you like.</p>
          <div class="animal-wrap">${animalSvg(a)}</div>
          ${group("head", "Head")}${group("body", "Body")}${group("legs", "Legs")}${group("coat", "Coat")}
          ${thinkPrompt()}${hint ? `<div class="hint">${hint >= 2 ? "Try mixing parts from two animals you know, like a cow and a bird." : "Think of an animal you know. What could you change?"}</div>` : ""}
          <div class="row">
            <button class="btn primary" id="kNext"${ready ? "" : " disabled"}>My animal is ready</button>
            <button class="btn" id="kHint"${hint >= 2 ? " disabled" : ""}>Give me an idea</button>
            <button class="btn" id="kDraw">I'd rather draw it</button>
            <button class="btn quiet" id="kSkip">Move on</button>
          </div>
        </section>`);
    on("[data-part]", e => { const [k, v] = e.currentTarget.dataset.part.split(":"); a[k] = v; rec.moves = (rec.moves || 0) + 1; build(); });
    on("#kHint", () => { hint = Math.min(2, hint + 1); rec.hints = hint; build(); });
    on("#kNext", goodAt);
    on("#kDraw", () => { rec.mode = "drew"; drawPad("Draw your new animal", "Press Done when you are finished.", strokes => { rec.drawn = strokes ? "drew their own animal" : "started a drawing"; goodAt(); }); });
    on("#kSkip", () => { rec.movedOn = true; rec.latestMatched = false; finish(); });
  };
  const goodAt = () => {
    const opts = ["Running fast", "Keeping the kraal safe", "Finding water", "Making friends"];
    const say = "What is your animal good at?";
    currentReturnSay = currentSay = say; setSay(say);
    render(`
        <section class="card">
          <p class="eyebrow">A New Animal for the Kraal</p>
          ${rec.mode === "drew" ? "" : `<div class="animal-wrap">${animalSvg(a)}</div>`}
          <h2>What is your animal good at?</h2>
          <div class="choices">${opts.map((o, i) => `<button class="choice" data-g="${i}"${i === 0 ? " data-focus" : ""}><span class="lbl">${o}</span></button>`).join("")}</div>
        </section>`);
    on("[data-g]", e => {
      rec.goodAt = opts[+e.currentTarget.dataset.g];
      if (S.band === "older" && rec.mode !== "drew") why(); else finish(true);
    });
  };
  const why = () => {
    const chosen = Object.keys(PARTS).map(k => PARTS[k].find(p => p[0] === a[k])[1]);
    const say = `Which part helps it with ${rec.goodAt.toLowerCase()}?`;
    currentReturnSay = currentSay = say; setSay(say);
    render(`
        <section class="card">
          <p class="eyebrow">A New Animal for the Kraal</p>
          <div class="animal-wrap">${animalSvg(a)}</div>
          <h2>Which part helps it with ${esc(rec.goodAt.toLowerCase())}?</h2>
          <p class="muted">Any answer is fine if you can explain it.</p>
          <div class="choices">${chosen.map((c, i) => `<button class="choice" data-w="${i}"${i === 0 ? " data-focus" : ""}><span class="lbl">${esc(c)}</span></button>`).concat(`<button class="choice" data-w="-1"><span class="lbl">All of it together</span></button>`).join("")}</div>
        </section>`);
    on("[data-w]", e => { const i = +e.currentTarget.dataset.w; rec.why = i < 0 ? "all of it together" : chosen[i].toLowerCase(); finish(true); });
  };
  const finish = (shared) => {
    if (shared) { rec.firstMatched = true; rec.latestMatched = true; }
    const desc = rec.mode === "drew" ? (rec.drawn || "drew an animal") : Object.keys(PARTS).map(k => a[k] ? PARTS[k].find(p => p[0] === a[k])[1].toLowerCase() : null).filter(Boolean).join(", ");
    reflect(run, "How did you come up with your idea?", ["Mixed animals I know", "Thought about what it needs to do", "Tried lots of parts", "Not sure"], r =>
      finishExercise(run, [rec], r, "You invented something new. Thank you for sharing your idea.",
        `Animal: ${desc || "not finished"}.${rec.goodAt ? " Good at: " + rec.goodAt.toLowerCase() + "." : ""}${rec.why ? " Part that helps: " + rec.why + "." : ""}`));
  };
  build();
}
