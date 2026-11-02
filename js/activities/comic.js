"use strict";

// ---------- Sprout's Comic ----------
function sceneSvg(k) {
  const sprout = (x, y) => `<g transform="translate(${x} ${y})"><ellipse cx="0" cy="0" rx="13" ry="11" fill="var(--gold)"/><circle cx="-4" cy="-2" r="1.6" fill="var(--ink)"/><circle cx="4" cy="-2" r="1.6" fill="var(--ink)"/><path d="M-3 4 Q0 6 3 4" stroke="var(--ink)" stroke-width="1.4" fill="none"/><path d="M0 -11 Q6 -20 12 -18 Q8 -12 0 -11" fill="var(--leaf)"/></g>`;
  const ground = '<rect x="0" y="92" width="160" height="28" fill="var(--soil)"/>';
  const sky = '<rect x="0" y="0" width="160" height="92" fill="var(--sky)"/>';
  const S1 = `${sky}${ground}${sprout(52, 78)}<circle cx="100" cy="98" r="5" fill="var(--ink)"/><path d="M92 92 Q100 84 108 92" stroke="var(--ink)" stroke-width="2" fill="none"/>`;
  const S2 = `${sky}${ground}<g fill="var(--surface)" stroke="var(--muted)" stroke-width="1.5"><ellipse cx="80" cy="26" rx="34" ry="14"/><ellipse cx="60" cy="30" rx="18" ry="11"/><ellipse cx="102" cy="30" rx="18" ry="11"/></g><g stroke="var(--shape-c)" stroke-width="3" stroke-linecap="round"><path d="M62 50 L58 62"/><path d="M80 50 L76 62"/><path d="M98 50 L94 62"/><path d="M71 68 L67 80"/><path d="M89 68 L85 80"/></g>${sprout(30, 80)}`;
  const S3 = `${sky}${ground}<path d="M100 92 L100 70" stroke="var(--leaf)" stroke-width="4"/><path d="M100 82 Q110 76 114 80 Q106 86 100 82" fill="var(--leaf)"/>${sprout(50, 80)}`;
  const S4 = `${sky}${ground}<path d="M100 92 L100 50" stroke="var(--leaf)" stroke-width="4"/><path d="M100 74 Q112 66 118 72 Q108 80 100 74" fill="var(--leaf)"/><g transform="translate(100 44)"><circle r="7" fill="var(--gold)"/>${[0, 60, 120, 180, 240, 300].map(a => `<ellipse rx="6" ry="10" transform="rotate(${a}) translate(0 -13)" fill="var(--shape-d)"/>`).join("")}<circle r="6" fill="var(--gold)"/></g>${sprout(46, 80)}`;
  const E1 = `${sky}${ground}<path d="M80 92 L80 52" stroke="var(--leaf)" stroke-width="4"/><g transform="translate(80 46)">${[0, 60, 120, 180, 240, 300].map(a => `<ellipse rx="6" ry="10" transform="rotate(${a}) translate(0 -13)" fill="var(--shape-d)"/>`).join("")}<circle r="6" fill="var(--gold)"/></g><g transform="translate(118 30)"><ellipse rx="9" ry="7" fill="var(--gold)"/><path d="M-4 -7 L-4 7 M2 -7 L2 7" stroke="var(--ink)" stroke-width="2"/><ellipse cx="-2" cy="-10" rx="6" ry="4" fill="var(--surface)" opacity="0.9"/></g>`;
  const E2 = `${sky}${ground}${sprout(46, 80)}${sprout(112, 80)}<g transform="translate(80 66)"><path d="M0 12 L0 -4" stroke="var(--leaf)" stroke-width="3"/>${[0, 72, 144, 216, 288].map(a => `<ellipse rx="4" ry="7" transform="rotate(${a}) translate(0 -9) translate(0 -4)" fill="var(--shape-d)"/>`).join("")}<circle cy="-4" r="4" fill="var(--gold)"/></g>`;
  const E3 = `${sky}${ground}<path d="M80 92 L80 52" stroke="var(--leaf)" stroke-width="4"/><g transform="translate(80 46)"><circle r="12" fill="var(--muted)" opacity="0.35"/>${[0, 45, 90, 135, 180, 225, 270, 315].map(a => `<path d="M0 0 L0 -16" stroke="var(--muted)" stroke-width="1.5" transform="rotate(${a})"/>`).join("")}</g>${[[40, 60], [116, 40], [130, 70]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3" fill="var(--ink)"/>`).join("")}`;
  const map = { s1: S1, s2: S2, s3: S3, s4: S4, e1: E1, e2: E2, e3: E3 };
  return `<svg viewBox="0 0 160 120" aria-hidden="true">${map[k]}</svg>`;
}
function gameComic(run) {
  const panels = S.band === "older"
    ? [{ k: "s1", cap: "Sprout plants a seed." }, { k: "s2", cap: "The rain falls." }, { k: "s3", cap: "A small shoot grows." }, { k: "s4", cap: "A flower opens." }]
    : [{ k: "s1", cap: "Sprout plants a seed." }, { k: "s2", cap: "The rain falls." }, { k: "s4", cap: "A flower opens." }];
  const order = shuffle(panels.map((p, i) => i));
  if (order.every((v, i) => v === i)) order.reverse();
  const rec = { title: "Story in order", checks: 0, hints: 0, firstMatched: null, latestMatched: false, movedOn: false, mode: "tap", readAloud: 0, exampleOpened: false };
  let slots = Array(panels.length).fill(null), hint = 0, fb = "";
  activeEx = { abort: () => {} };
  const draw = () => {
    const say = "Sprout's comic is mixed up. Tap the pictures in the order they happened. What happened first?";
    currentReturnSay = currentSay = say;
    render(`
        <section class="card">
          <p class="eyebrow">Sprout's Comic</p>
          <h2>The comic is mixed up. Put it in order.</h2>
          <p class="muted">Tap the pictures in the order they happened. What happened first?</p>
          <div class="panels">${order.map(pi => `<button class="panel" data-pn="${pi}" aria-pressed="${slots.includes(pi)}" aria-label="${esc(panels[pi].cap)}">${sceneSvg(panels[pi].k)}<span>${esc(panels[pi].cap)}</span></button>`).join("")}</div>
          <div class="row"><button class="btn small" id="cRead">${speakerIcon}<span>Read the pictures to me</span></button></div>
          <p class="eyebrow">Your story</p>
          <div class="strip">${slots.map((s, i) => `<button class="slot${s !== null ? " filled" : ""}" data-sl="${i}" aria-label="${s !== null ? "Part " + (i + 1) + ": " + esc(panels[s].cap) + ". Tap to take it out" : "Empty part " + (i + 1)}">${s !== null ? sceneSvg(panels[s].k) : `<span class="muted">${i + 1}</span>`}</button>`).join("")}</div>
          ${thinkPrompt()}${hint ? `<div class="hint">${hint >= 2 ? "The first picture is in place. What comes next?" : "Listen to each picture again. What has to happen before a flower can grow?"}</div>` : ""}
          ${fb ? `<div class="feedback gentle">${esc(fb)}</div>` : ""}
          <div class="row">
            <button class="btn primary" id="cCheck">Check my story</button>
            <button class="btn" id="cHint"${hint >= 2 ? " disabled" : ""}>Use a hint</button>
            <button class="btn quiet" id="cSkip">Move on without an answer</button>
          </div>
        </section>`);
    on("[data-pn]", e => { const pi = +e.currentTarget.dataset.pn; if (slots.includes(pi)) return; const i = slots.indexOf(null); if (i >= 0) { slots[i] = pi; fb = ""; draw(); } });
    on("[data-sl]", e => { const i = +e.currentTarget.dataset.sl; if (hint >= 2 && i === 0) return; slots[i] = null; fb = ""; draw(); });
    on("#cRead", () => { rec.readAloud++; speakSeq(order.map(pi => panels[pi].cap), true); });
    on("#cHint", () => {
      hint = Math.min(2, hint + 1); rec.hints = hint;
      if (hint === 1) { rec.readAloud++; speakSeq(["Listen to each picture again. What has to happen before a flower can grow?"].concat(order.map(pi => panels[pi].cap))); }
      if (hint === 2) { const rest = slots.filter(v => v !== null && v !== 0); slots = [0].concat(rest); while (slots.length < panels.length) slots.push(null); }
      draw();
    });
    on("#cSkip", () => { rec.movedOn = true; ending(); });
    on("#cCheck", () => {
      if (slots.includes(null)) { fb = "Fill every part of the story first."; draw(); speak(fb); return; }
      rec.checks++;
      const ok = slots.every((s, i) => s === i);
      if (rec.firstMatched === null) rec.firstMatched = ok;
      rec.latestMatched = ok;
      if (ok) { speak("Your story makes sense from start to end."); ending("Your story makes sense from start to end."); }
      else { fb = "Some parts are in a different order. You can take a picture out and try again, or use a hint."; draw(); speak(fb); }
    });
  };
  const ending = (praise) => {
    const say = (praise ? praise + " " : "") + "How does the story end? Choose an ending, or draw your own.";
    currentReturnSay = currentSay = say;
    render(`
        <section class="card">
          ${praise ? `<div class="feedback">${esc(praise)}</div>` : ""}
          <h2>How does the story end?</h2>
          <div class="panels">
            <button class="panel" data-e="A bee visits the flower">${sceneSvg("e1")}<span>A bee visits the flower</span></button>
            <button class="panel" data-e="Sprout gives the flower to a friend">${sceneSvg("e2")}<span>Sprout gives it to a friend</span></button>
            <button class="panel" data-e="The flower makes new seeds">${sceneSvg("e3")}<span>The flower makes new seeds</span></button>
          </div>
          <div class="row"><button class="btn" id="eDraw">I'll draw my own ending</button></div>
        </section>`);
    setSay(say);
    on("[data-e]", e => { rec.ending = e.currentTarget.dataset.e; rec.endingMode = "chose a picture"; afterEnding(); });
    on("#eDraw", drawEnding);
  };
  const drawEnding = () => {
    const say = "Draw your own ending. Press Done when you are finished.";
    currentReturnSay = currentSay = say;
    render(`
        <section class="card">
          <h2>Draw your own ending</h2>
          <canvas class="pad" id="pad" width="800" height="600" aria-label="Drawing space"></canvas>
          <div class="row"><button class="btn" id="dClear">Start again</button><button class="btn primary" id="dDone">Done</button></div>
        </section>`);
    setSay(say);
    const c = document.getElementById("pad"), g = c.getContext("2d");
    g.lineWidth = 10; g.lineCap = "round"; g.lineJoin = "round"; g.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue("--brand").trim() || "#426C65";
    let down = false, strokes = 0;
    const pos = e => { const r = c.getBoundingClientRect(); return [(e.clientX - r.left) * c.width / r.width, (e.clientY - r.top) * c.height / r.height]; };
    c.addEventListener("pointerdown", e => { down = true; strokes++; c.setPointerCapture(e.pointerId); const [x, y] = pos(e); g.beginPath(); g.moveTo(x, y); });
    c.addEventListener("pointermove", e => { if (!down) return; const [x, y] = pos(e); g.lineTo(x, y); g.stroke(); });
    c.addEventListener("pointerup", () => { down = false; });
    on("#dClear", () => g.clearRect(0, 0, c.width, c.height));
    on("#dDone", () => { rec.ending = strokes ? "Drew their own ending" : "Started a drawing"; rec.endingMode = "drew"; afterEnding(); });
  };
  const afterEnding = () => reflect(run, "How did you know the order?", ["Looked at the pictures", "Listened to the words", "Thought about what makes sense", "Not sure"], r =>
    finishExercise(run, [rec], r, "You told Sprout's story and gave it an ending. Thank you for sharing your idea.", `Ending: ${rec.ending || "none chosen"} (${rec.endingMode || "-"}). Read-aloud used ${rec.readAloud} time(s).`));
  draw();
}
