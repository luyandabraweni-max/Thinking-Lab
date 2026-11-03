"use strict";

// ---------- Colour and Shape Sort (Flexible Thinking) ----------
function gameSort(run) {
  const B = "var(--shape-c)", G = "var(--shape-b)";
  // In greyscale, blue and gold look alike, so the game sorts by shape and size instead of colour.
  const grey = !!(S.my && S.my.grey);
  const items = grey ? (S.band === "older"
    ? [["blue", "circle", "big"], ["blue", "square", "small"], ["gold", "circle", "small"], ["gold", "square", "big"], ["blue", "circle", "small"], ["gold", "square", "small"]]
    : [["blue", "circle", "big"], ["gold", "square", "small"], ["blue", "square", "big"], ["gold", "circle", "small"]])
    : S.band === "older"
    ? [["blue", "circle", "big"], ["blue", "square", "small"], ["gold", "circle", "small"], ["gold", "square", "big"], ["blue", "circle", "small"], ["gold", "circle", "big"]]
    : [["blue", "circle", "big"], ["gold", "square", "big"], ["blue", "square", "big"], ["gold", "circle", "big"]];
  const rules = grey ? [{ by: 1, title: "Sort by shape", bins: ["circle", "square"] }, { by: 2, title: "Now sort by size", bins: ["big", "small"] }]
    : [{ by: 0, title: "Sort by colour", bins: ["blue", "gold"] }, { by: 1, title: "Now sort by shape", bins: ["circle", "square"] }]
      .concat(S.band === "older" ? [{ by: 2, title: "Now sort by size", bins: ["big", "small"] }] : []);
  const itemSvg = (it, size) => shape(it[1], { size: size || 52, small: it[2] === "small", color: it[0] === "blue" ? B : G, label: `${it[2] === "small" ? "small " : ""}${it[0]} ${it[1]}` });
  const binSign = v => v === "blue" || v === "gold" ? shape("circle", { size: 30, color: v === "blue" ? B : G, label: v }) : v === "circle" || v === "square" ? shape(v, { size: 30, color: "var(--muted)", label: v }) : shape("square", { size: 30, small: v === "small", color: "var(--muted)", label: v });
  const results = []; let ri = 0;
  activeEx = { abort: () => {} };
  const doRule = () => {
    const rule = rules[ri];
    const rec = newRec(rule.title, { mode: "tap", moves: 0 });
    let place = items.map(() => null), sel = null, hint = 0, fb = "";
    const draw = () => {
      const say = `${rule.title}. Tap a picture, then tap the box it belongs in. What is the same about these?`;
      currentReturnSay = currentSay = say;
      const tray = items.map((it, i) => place[i] === null ? `<button class="choice sortitem" data-si="${i}" aria-pressed="${sel === i}" aria-label="${it[2] === "small" ? "small " : ""}${it[0]} ${it[1]}">${itemSvg(it)}<span class="note">${it[2] === "small" ? "small " : ""}${it[0]} ${it[1]}</span></button>` : "").join("");
      render(`
          <section class="card">
            <p class="eyebrow">Colour and Shape Sort · rule ${ri + 1} of ${rules.length}</p>
            <h2>${esc(rule.title)}</h2>
            ${ri > 0 ? `<p class="muted">The rule has changed. Everything is back in the tray.</p>` : `<p class="muted">Tap a picture, then tap the box it belongs in.</p>`}
            <div class="tray" aria-label="Pictures to sort">${tray || '<span class="muted">All sorted. Press Check when you are ready.</span>'}</div>
            <div class="bins">${rule.bins.map((b, bi) => `<div class="bin"><button class="btn bin-head" data-bin="${bi}"${sel === null ? " disabled" : ""}>${binSign(b)}<span>${b === "circle" || b === "square" ? b + "s" : b}</span></button>
              <div class="bin-items">${items.map((it, i) => place[i] === bi ? `<button class="vk" data-out="${i}" aria-label="${it[2] === "small" ? "small " : ""}${it[0]} ${it[1]} in the ${b} box. Tap to take it out">${itemSvg(it, 40)}</button>` : "").join("")}</div></div>`).join("")}</div>
            ${thinkPrompt()}${hint ? `<div class="hint">${hint >= 2 ? "One picture has been put in the right box for you." : `Look at the sign on each box. This time, only the ${["colour", "shape", "size"][rule.by]} matters.`}</div>` : ""}
            ${fb ? `<div class="feedback gentle">${esc(fb)}</div>` : ""}
            ${actionRow({ check: "sCheck", checkLabel: "Check my sorting", hint: "sHint", skip: "sSkip" }, hint)}
          </section>`);
      on("[data-si]", e => { const i = +e.currentTarget.dataset.si; sel = sel === i ? null : i; fb = ""; draw(); });
      on("[data-bin]", e => { if (sel === null) return; place[sel] = +e.currentTarget.dataset.bin; rec.moves++; sel = null; draw(); });
      on("[data-out]", e => { place[+e.currentTarget.dataset.out] = null; rec.moves++; fb = ""; draw(); });
      on("#sHint", () => {
        hint = Math.min(2, hint + 1); rec.hints = hint;
        if (hint === 2) { const i = items.findIndex((it, j) => place[j] === null || place[j] !== rule.bins.indexOf(it[rule.by])); if (i >= 0) place[i] = rule.bins.indexOf(items[i][rule.by]); }
        draw();
      });
      on("#sSkip", () => { rec.movedOn = true; next(); });
      on("#sCheck", () => {
        if (place.includes(null)) { fb = "Some pictures are still in the tray."; draw(); speak(fb); return; }
        rec.checks++;
        const ok = items.every((it, i) => place[i] === rule.bins.indexOf(it[rule.by]));
        if (rec.firstMatched === null) rec.firstMatched = ok;
        rec.latestMatched = ok;
        if (ok) { const t = ri === 0 ? "Every picture matches its box." : "You switched to the new rule."; speak(t); next(t); }
        else { fb = "Some pictures are in a box that doesn't match its sign. Tap one to take it out."; draw(); speak(fb); }
      });
    };
    const next = (praise) => {
      results.push(rec); ri++;
      if (ri < rules.length) { if (praise) praiseThen(praise + " Get ready: the rule is about to change.", "Show me the new rule", doRule); else doRule(); }
      else {
        const fin = () => reflect(run, "How did it feel when the rule changed?", ["Easy to switch", "Took a moment", "Tricky", "Not sure"], r =>
          finishExercise(run, results, r, "You sorted in more than one way. Changing your thinking is a real skill."));
        if (praise) praiseThen(praise, "Next", fin); else fin();
      }
    };
    draw();
  };
  doRule();
}
