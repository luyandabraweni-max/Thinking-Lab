"use strict";

// ---------- Lesson screens (v3: step strip, texts in parts, word help, shorter lessons, line-by-line speech) ----------
const STEP_NAMES = ["Learn", "Example", "Practice", "Reflect"];
function stepStrip(active) {
  return `<ol class="stepstrip" aria-label="Lesson steps">${STEP_NAMES.map((n, i) => `<li class="${i < active ? "done" : i === active ? "now" : ""}"${i === active ? ' aria-current="step"' : ""}><span class="sr">${i < active ? "Done: " : i === active ? "Now: " : "Next: "}</span>${n}</li>`).join("")}</ol>`;
}
// Lines are spoken one at a time, so each can be matched to a recorded clip.
let currentSayLines = null;
function setSayLines(lines, auto) { currentSayLines = lines.filter(Boolean); currentSay = currentSayLines.join(" "); if (auto !== false) speakSeq(currentSayLines, false); }
const L = {
  begin: "Press Begin when you are ready.", worked: "Worked example.", yes: "Yes.",
  wrong: "Not quite yet. Have another look, or use a hint.", wrong3: "Not quite yet. That's fine. You can try again, or move on without an answer.",
  pick: "Choose an answer first.", type: "Type your answer first.", orderAll: "Put all of them in order first.", sortAll: "Sort all of them first."
};
function introLines(u) { return [u.title + ".", u.intention, L.begin]; }
function lessonLines(pg) { return [pg.h + ".", pg.say]; }
function questionLines(q, order) { return [q.q].concat(order.map(i => q.options[i])); }
function wordLine(w) { return `${w[1]}. ${w[2]}.`; }
function phraseLine(p) { return `"${p[0]}" means ${p[1]}.`; }

// Long texts are shown in short parts, each with its own Read button.
function passageParts(html) {
  const t = document.createElement("template"); t.innerHTML = html.trim();
  const box = t.content.querySelector(".passage-text"); if (!box) return [];
  return [...box.children].map(el => ({ html: el.outerHTML, text: el.textContent.replace(/\s+/g, " ").trim() })).filter(p => p.text);
}
function partsHtml(u, shown, cls) {
  const parts = passageParts(u.passage), n = Math.min(shown, parts.length);
  return `<div class="passage-text parts ${cls || ""}">${parts.slice(0, n).map((p, i) => `<div class="part">${p.html}<button class="btn small read-part" data-rp="${i}" aria-label="Read part ${i + 1} aloud"${S.quiet ? " disabled" : ""}>${speakerIcon}<span>Read this part</span></button></div>`).join("")}</div>
      ${n < parts.length ? `<div class="row"><button class="btn" id="morePart">Show the next part (${n} of ${parts.length})</button></div>` : ""}`;
}
function wirePartReaders(u) {
  const parts = passageParts(u.passage);
  $main.querySelectorAll("[data-rp]").forEach(b => b.addEventListener("click", () => { const p = parts[+b.dataset.rp]; if (!p) return; const el = b.closest(".part").firstElementChild; readAndLight(el, p.text); }));
}

// Word help: key words with a picture, and plain meanings for figurative phrases.
function wordsBox(u) {
  const W2 = WORDS[u.id]; if (!W2 || !W2.words) return "";
  return `<div class="keywords"><p class="eyebrow">Key words</p><ul class="kw">${W2.words.map(w => `<li><span class="kw-pic" aria-hidden="true">${w[0]}</span><span><b>${esc(w[1])}</b>: ${esc(w[2])}</span></li>`).join("")}</ul></div>`;
}
function wordsExtra(u) { const w = wordsBox(u); return w ? `<div class="kw-extra">${w}</div>` : ""; }
function plainBox(u) {
  const W2 = WORDS[u.id]; if (!W2 || !W2.phrases) return "";
  return `<div class="plainbox"><p class="eyebrow">In plain words</p><ul class="plain">${W2.phrases.map(p => `<li><b>"${esc(p[0])}"</b> means ${esc(p[1])}.</li>`).join("")}</ul></div>`;
}
function wordHelpButton(u) { return WORDS[u.id] ? `<button class="btn small" id="wordHelp">What does this mean?</button>` : ""; }
function openWordHelp(u) {
  const W2 = WORDS[u.id] || {}; const lines = (W2.words || []).map(wordLine).concat((W2.phrases || []).map(phraseLine));
  overlay(`<div class="card"><h2>What does this mean?</h2>
      ${W2.words ? `<ul class="kw">${W2.words.map(w => `<li><span class="kw-pic" aria-hidden="true">${w[0]}</span><span><b>${esc(w[1])}</b>: ${esc(w[2])}</span></li>`).join("")}</ul>` : ""}
      ${W2.phrases ? `<p class="eyebrow">Phrases in this lesson</p><ul class="plain">${W2.phrases.map(p => `<li><b>"${esc(p[0])}"</b> means ${esc(p[1])}.</li>`).join("")}</ul>` : ""}
      <div class="row"><button class="btn" id="whRead"${S.quiet ? " disabled" : ""}>${speakerIcon}<span>Read these aloud</span></button><button class="btn primary" id="whClose" data-focus>Close</button></div></div>`);
  document.getElementById("whRead").onclick = () => speakSeq(lines, true);
  document.getElementById("whClose").onclick = () => { stopSpeaking(); closeLayer(); };
}
function wireWordHelp(u) { const b = document.getElementById("wordHelp"); if (b) b.onclick = () => openWordHelp(u); }

function pickQuestions(u) {
  const qs = u.questions; if (S.lessonLen !== "short" || qs.length <= 3) return qs;
  return [0, Math.floor(qs.length / 2), qs.length - 1].map(i => qs[i]);
}
const unitClipsLoaded = new Set();
function loadUnitClips(id) {
  if (unitClipsLoaded.has(id) || location.protocol === "file:") return; unitClipsLoaded.add(id);
  const s = document.createElement("script"); s.src = `clips/${id}.js`; s.async = true; s.onerror = () => unitClipsLoaded.delete(id); document.head.appendChild(s);
}

function unitIntro(u) {
  inGame = false; activeUnit = u; activeX = null; mark("u-" + u.id, () => unitIntro(u)); bar("exercise"); loadUnitClips(u.id);
  const nq = pickQuestions(u).length;
  render(`
      <section class="card">
        <p class="eyebrow">${esc(u.subject)} · ${gradeName(u.grade)}</p>
        <h1>${esc(u.title)}</h1>
        <p class="lead">${esc(u.intention)}</p>
        <div class="preview"><p class="eyebrow">What will happen</p>
          <ol class="story">
            <li>${icon("📖")}<span>First, you will read ${u.lesson.length} short pages.</span></li>
            <li>${icon("👀")}<span>Then you will see a worked example, one step at a time.</span></li>
            <li>${icon("✏️")}<span>Then you will try ${nq} questions. You can use hints, or move on.</span></li>
            <li>${icon("💬")}<span>Then you will say how it went.</span></li>
            <li>${icon("🏁")}<span>Then you can choose what to do next.</span></li>
          </ol>
          <p class="muted">Nothing is timed. You can take a break or stop at any time.</p></div>
        <p class="note">Curriculum: ${esc(u.caps)}</p>
        <div class="row"><button class="btn primary" id="uBegin" data-focus>Begin</button><button class="btn quiet" id="uBack">Back to Learn</button></div>
      </section>`);
  setSayLines(introLines(u).concat([`First, you will read ${u.lesson.length} short pages.`, "Then you will see a worked example, one step at a time.", `Then you will try ${nq} questions. You can use hints, or move on.`, "Then you will say how it went.", "Then you can choose what to do next."]));
  on("#uBack", learnHome);
  on("#uBegin", () => { inGame = true; const run = { x: { id: u.id, name: u.title }, acted: false, recs: [], qs: pickQuestions(u), parts: 2 }; THINK[u.id] = u.prompt; thinkRun = run; unitLesson(u, run, 0); });
}
function unitLesson(u, run, i) {
  const pg = u.lesson[i], isPassage = u.passage && pg.html === u.passage;
  render(`
      <section class="card">
        <p class="eyebrow">${esc(u.title)} · Learn ${i + 1} of ${u.lesson.length}</p>
        ${stepStrip(0)}
        <h2>${esc(pg.h)}</h2>
        ${isPassage ? partsHtml(u, run.parts) : pg.html}
        ${isPassage ? plainBox(u) : ""}
        ${i === 0 ? wordsBox(u) : wordsExtra(u)}
        <div class="row">
          <button class="btn primary" id="lNext" data-focus>${i + 1 < u.lesson.length ? "Next" : "See a worked example"}</button>
          ${i > 0 ? '<button class="btn" id="lPrev">Back a page</button>' : ""}
          ${wordHelpButton(u)}
        </div>
      </section>`);
  setSayLines(lessonLines(pg));
  if (isPassage) { wirePartReaders(u); on("#morePart", () => { run.parts += 2; unitLesson(u, run, i); const b = $main.querySelector(`[data-rp="${run.parts - 2}"]`); if (b) b.focus({ preventScroll: true }); }); }
  wireWordHelp(u);
  on("#lNext", () => i + 1 < u.lesson.length ? unitLesson(u, run, i + 1) : unitExample(u, run, 1));
  on("#lPrev", () => unitLesson(u, run, i - 1));
}
function unitExample(u, run, shown) {
  const ex = u.example;
  render(`
      <section class="card">
        <p class="eyebrow">${esc(u.title)} · Worked example</p>
        ${stepStrip(1)}
        <h2>${esc(ex.q)}</h2>
        ${ex.html || ""}
        <ol class="steps">${ex.steps.slice(0, shown).map(s => `<li>${esc(s)}</li>`).join("")}</ol>
        ${wordsExtra(u)}
        <div class="row">
          ${shown < ex.steps.length ? '<button class="btn primary" id="eNext" data-focus>Show the next step</button>' : '<button class="btn primary" id="eGo" data-focus>Now I\'ll try</button>'}
          ${shown < ex.steps.length ? '<button class="btn quiet" id="eSkip">Skip to the questions</button>' : ""}
          ${wordHelpButton(u)}
        </div>
      </section>`);
  setSayLines([L.worked, ex.q].concat(ex.steps.slice(0, shown)));
  wireWordHelp(u);
  on("#eNext", () => unitExample(u, run, shown + 1));
  on("#eGo", () => unitQuestion(u, run, 0)); on("#eSkip", () => unitQuestion(u, run, 0));
}
const norm = v => String(v == null ? "" : v).toLowerCase().replace(/\s+/g, "").replace(/^r/, "").replace(/\./g, ",");
function unitQuestion(u, run, qi) {
  const QS = run.qs, q = themedQuestion(u, QS[qi]); let wrongs = 0, offered = false, offer = null, easier = false; clearTimeout(idleTimer);
  const rec = newRec(q.title || `Question ${qi + 1}`, {});
  const buildMode = S.answer === "build";
  rec.mode = q.type === "num" ? (buildMode ? "typed" : "chose") : q.type === "order" ? "ordered" : q.type === "sort" ? "sorted" : "chose";
  let hint = 0, fb = "", fbLines = null, picked = null, typed = "", done = false;
  let order = [], sortPick = null; const sortPlace = q.type === "sort" ? q.items.map(() => null) : null;
  const shuffled = q.type === "order" ? shuffle(q.items.map((t, i) => i)) : null;
  let optsShown = (q.type === "mcq" || (q.type === "num" && !buildMode)) ? (q.fixed ? q.options.map((o, i) => i) : shuffle(q.options.map((o, i) => i))) : [];
  const sayQ = questionLines(q, optsShown);
  const say = (lines) => speakSeq(lines, true);
  const draw = () => {
    let body = "";
    if (q.type === "mcq" || (q.type === "num" && (!buildMode || easier))) body = `<div class="choices${u.grade <= 0 ? " big" : ""}">${optsShown.map(i => `<button class="choice" data-o="${i}" aria-pressed="${picked === i}">${q.pics ? `<span class="opt-pic" aria-hidden="true">${q.pics[i]}</span>` : ""}<span class="lbl">${esc(q.options[i])}</span></button>`).join("")}</div>`;
    else if (q.type === "num" && !easier) body = `<label for="qNum" style="display:flex;flex-direction:column;gap:6px;font-family:var(--font-display);max-width:260px">Your answer${q.unitLabel ? ` (${esc(q.unitLabel)})` : ""}<input id="qNum" inputmode="decimal" autocomplete="off" value="${esc(typed)}" style="font:inherit;padding:12px 14px;border-radius:12px;border:2px solid var(--line);background:var(--surface);color:var(--ink);min-height:48px"></label>`;
    else if (q.type === "order") body = `
        <p class="muted">Tap them in order, ${esc(q.orderLabel || "first to last")}.</p>
        <div class="choices">${shuffled.map(i => `<button class="choice" data-ord="${i}" aria-pressed="${order.includes(i)}"${order.includes(i) ? " disabled" : ""}><span class="lbl">${esc(q.items[i])}</span></button>`).join("")}</div>
        <div class="plan" aria-label="Your order">${order.length ? order.map((i, k) => `<span class="chip" style="font-size:1rem;padding:0 10px">${k + 1}. ${esc(q.items[i])}</span>`).join("") : '<span class="muted">Your order will show here.</span>'}</div>
        ${order.length ? '<button class="btn small" id="qUndo">Take the last one back</button>' : ""}`;
    else if (q.type === "sort") body = `
        <p class="muted">Tap a word, then tap the box it belongs in.</p>
        <div class="tray">${q.items.map((t, i) => sortPlace[i] === null ? `<button class="choice" data-si="${i}" aria-pressed="${sortPick === i}"><span class="lbl">${esc(t)}</span></button>` : "").join("") || '<span class="muted">All sorted.</span>'}</div>
        <div class="bins">${q.bins.map((b, bi) => `<div class="bin"><button class="btn bin-head" data-bin="${bi}"${sortPick === null ? " disabled" : ""}>${esc(b)}</button><div class="bin-items">${q.items.map((t, i) => sortPlace[i] === bi ? `<button class="chip" style="font-size:0.95rem;padding:0 10px" data-back="${i}" aria-label="${esc(t)}, in ${esc(b)}. Tap to take it out">${esc(t)}</button>` : "").join("")}</div></div>`).join("")}</div>`;
    render(`
        <section class="card">
          <p class="eyebrow">${esc(u.title)} · Question ${qi + 1} of ${QS.length}</p>
          ${stepStrip(2)}
          ${QS.length - qi === 2 ? '<p class="heads-up" role="status">' + icon("⏭️") + ' 2 more questions, then this lesson is finished.</p>' : QS.length - qi === 1 && QS.length > 1 ? '<p class="heads-up" role="status">' + icon("🏁") + ' This is the last question.</p>' : ""}
          ${u.passage ? `<details class="passage"><summary>Show the text again</summary>${partsHtml(u, 99)}${plainBox(u)}</details>` : ""}
          <h2>${esc(q.q)}</h2>
          ${q.html || ""}
          ${body}
          ${wordsExtra(u)}
          ${thinkPrompt()}
          ${offer ? `<div class="checkin" role="group" aria-labelledby="ciTitle"><p id="ciTitle"><b>${esc(offer)}</b></p><div class="row">
              <button class="btn small" data-ci="break">${icon("🌿")}<span>Take a break</span></button>
              <button class="btn small" data-ci="easier">${icon("🪶")}<span>Make it easier</span></button>
              <button class="btn small" data-ci="hint"${hint >= 3 ? " disabled" : ""}>${icon("💡")}<span>Show me a hint</span></button>
              <button class="btn small" data-ci="keep">${icon("➡️")}<span>Keep going</span></button></div></div>` : ""}
          ${hint ? `<div class="hint"><b>Hint ${hint} of 3.</b> ${esc(q.hints[hint - 1])}</div>` : ""}
          ${fb ? `<div class="feedback${done ? "" : " gentle"}">${esc(fb)}</div>` : ""}
          <div class="row">
            ${done ? `<button class="btn primary" id="qNext" data-focus>${qi + 1 < QS.length ? "Next question" : "Finish"}</button>`
            : `<button class="btn primary" id="qCheck">Check my answer</button>
                 <button class="btn" id="qHint"${hint >= 3 ? " disabled" : ""}>${hint ? "Another hint" : "Use a hint"}</button>
                 <button class="btn quiet" id="qSkip">Move on without an answer</button>`}
            ${wordHelpButton(u)}
          </div>
        </section>`);
    setSayLines(fbLines || (offer ? [offer, "Take a break.", "Make it easier.", "Show me a hint.", "Keep going."] : sayQ), false);
    clearTimeout(idleTimer);
    if (!done && !offered) idleTimer = setTimeout(() => { if (!offered && activeUnit === u && document.getElementById("qCheck")) { offered = true; offer = "Take your time. Would anything help?"; draw(); say([offer]); } }, 90000);
    $main.querySelectorAll("[data-ci]").forEach(b => b.addEventListener("click", () => {
      const c = b.dataset.ci; rec.adapt = c; S.voice.push({ kind: "chose when stuck", what: { break: "a break", easier: "an easier version", hint: "a hint", keep: "to keep going" }[c], where: u.title + ", question " + (qi + 1), at: new Date() });
      offer = null;
      if (c === "break") { draw(); breakScreen("Take a break. Stay as long as you like."); return; }
      if (c === "hint") { hint = Math.min(3, hint + 1); rec.hints = hint; draw(); say([q.hints[hint - 1]]); return; }
      if (c === "easier") makeEasier();
      draw();
    }));
    if (u.passage) wirePartReaders(u);
    wireWordHelp(u);
    on("[data-o]", e => { picked = +e.currentTarget.dataset.o; fb = ""; fbLines = null; draw(); const b = $main.querySelector(`[data-o="${picked}"]`); if (b) b.focus({ preventScroll: true }); });
    const inp = document.getElementById("qNum"); if (inp) { inp.addEventListener("input", () => { typed = inp.value; run.acted = true; }); }
    on("[data-ord]", e => { order.push(+e.currentTarget.dataset.ord); fb = ""; draw(); });
    on("#qUndo", () => { order.pop(); draw(); });
    on("[data-si]", e => { sortPick = +e.currentTarget.dataset.si; draw(); });
    on("[data-bin]", e => { if (sortPick === null) return; sortPlace[sortPick] = +e.currentTarget.dataset.bin; sortPick = null; rec.moves = (rec.moves || 0) + 1; fb = ""; draw(); });
    on("[data-back]", e => { sortPlace[+e.currentTarget.dataset.back] = null; draw(); });
    on("#qHint", () => { hint = Math.min(3, hint + 1); rec.hints = hint; fb = ""; fbLines = null; draw(); say([q.hints[hint - 1]]); });
    on("#qSkip", () => { clearTimeout(idleTimer); rec.movedOn = true; run.recs.push(rec); nextQ(); });
    on("#qNext", () => { run.recs.push(rec); nextQ(); });
    const makeEasier = () => {
      easier = true; rec.easier = true;
      if (q.type === "mcq" || q.type === "num") {
        const right = q.type === "mcq" ? q.answer : q.options.findIndex(o => norm(o) === norm(q.answer));
        const other = optsShown.find(i => i !== right) ?? q.options.findIndex((o, i) => i !== right);
        optsShown = shuffle([right, other]); picked = null; rec.mode = "chose (easier)";
      } else if (q.type === "order") { order = [0]; }
      else if (q.type === "sort") { let n = 0; q.items.forEach((t, i) => { if (n < 2 && sortPlace[i] === null) { sortPlace[i] = q.answer[i]; n++; } }); }
    };
    const tell = (lines, isDone) => { fbLines = lines; fb = lines.join(" "); done = isDone; draw(); say(lines); };
    on("#qCheck", () => {
      if (q.open) { if (picked === null) { tell([L.pick], false); return; } rec.open = true; rec.checks++; rec.choice = q.options[picked]; run.acted = true; tell([q.explain], true); return; }
      let ok = null;
      if (q.type === "mcq" || (q.type === "num" && !buildMode)) { if (picked === null) { tell([L.pick], false); return; } ok = q.type === "mcq" ? picked === q.answer : norm(q.options[picked]) === norm(q.answer); }
      else if (q.type === "num") { if (!typed.trim()) { tell([L.type], false); return; } ok = [q.answer].concat(q.accept || []).some(a => norm(a) === norm(typed)); }
      else if (q.type === "order") { if (order.length < q.items.length) { tell([L.orderAll], false); return; } ok = order.every((v, k) => v === k); }
      else if (q.type === "sort") { if (sortPlace.some(v => v === null)) { tell([L.sortAll], false); return; } ok = sortPlace.every((v, i) => v === q.answer[i]); }
      rec.checks++; if (rec.firstMatched === null) rec.firstMatched = ok; rec.latestMatched = ok; run.acted = true;
      if (ok) { clearTimeout(idleTimer); tell([L.yes, q.explain], true); }
      else { wrongs++; if (wrongs >= 2 && !offered) { offered = true; offer = "This one is tricky. What would help?"; fbLines = null; fb = ""; draw(); say([offer]); } else tell([hint >= 3 ? L.wrong3 : L.wrong], false); }
    });
  };
  const nextQ = () => { if (qi + 1 < QS.length) unitQuestion(u, run, qi + 1); else unitFinish(u, run); };
  draw();
}
function unitFinish(u, run) {
  const R = u.reflect;
  render(`
      <section class="card">
        <p class="eyebrow">${esc(u.title)}</p>
        ${stepStrip(3)}
        <h2>${esc(R.q)}</h2>
        <div class="choices">${R.options.map((o, i) => `<button class="choice" data-r="${i}"${i === 0 ? " data-focus" : ""}><span class="lbl">${esc(o)}</span></button>`).join("")}</div>
        <div class="row"><button class="btn" id="rDraw">${icon("🎨")}<span>Draw how it went instead</span></button></div>
      </section>`);
  setSayLines([R.q].concat(R.options));
  on("#rDraw", () => drawReflection(u, r => finishWith(r)));
  on("[data-r]", e => finishWith(R.options[+e.currentTarget.dataset.r]));
  function finishWith(r) {
    inGame = false;
    if (!S.learned.includes(u.id)) S.learned.push(u.id);
    const recs = run.recs;
    const shown = recs.filter(it => statusOf(it) !== "notyet").length, alone = recs.filter(it => statusOf(it) === "alone").length, hinted = recs.filter(it => it.hints > 0).length;
    const dims = `Knowledge: shown in ${shown} of ${recs.length} questions${S.lessonLen === "short" ? " (shorter lesson)" : ""}. Independence: ${alone} without support. Support used: hints on ${hinted} question(s). Reflection: "${r}".`;
    S.obs.push({ id: u.id, unit: true, assisted: S.assisted, level: S.band, ex: u.title, cat: `${u.subject} · ${gradeName(u.grade)}`, domain: u.domain, items: recs, reflection: r, exampleOpened: false, extra: `CAPS: ${u.caps}. ${dims}`, at: new Date() });
    const [fbText, achieve] = matchedFeedback(run, recs);
    S.obs[S.obs.length - 1].feedback = fbText;
    render(`
        <section class="card">
          <p class="eyebrow">${esc(u.subject)} · ${gradeName(u.grade)}</p>
          <h1 class="as-h2">${esc(u.title)}: done</h1>
          <ol class="stepstrip" aria-label="Lesson steps">${STEP_NAMES.map(n => `<li class="done"><span class="sr">Done: </span>${n}</li>`).join("")}</ol>
          <p class="eyebrow">${esc(achieve)}</p>
          <div class="feedback">${esc(fbText)}</div>
          <p>${esc(u.done)}</p>
          ${safetyNote(u)}
          <div class="row"><button class="btn primary" id="ufLearn" data-focus>Choose another lesson</button><button class="btn" id="ufHome">Back to home</button>${tellButton()}</div>
        </section>`);
    setSayLines([achieve, fbText, u.done]);
    planDone("lesson");
    on("#ufLearn", () => needsBattery() ? batteryCheck(learnHome) : learnHome()); on("#ufHome", home); wireTell(); on("#sfUnsafe", () => feelUnsafe("lesson"));
  }
}
function drawReflection(u, done) {
  render(`<section class="card"><p class="eyebrow">${esc(u.title)}</p>${stepStrip(3)}<h2>Draw how it went</h2><p class="muted">Draw anything you like. There is no right answer.</p>
      <canvas class="pad" id="rPad" width="640" height="480" aria-label="Drawing space"></canvas>
      <div class="row"><button class="btn primary" id="rpDone" data-focus>I'm finished</button><button class="btn" id="rpClear">Start again</button></div></section>`);
  setSayLines(["Draw how it went.", "Draw anything you like. There is no right answer."]);
  const c = document.getElementById("rPad"), g = c.getContext("2d"); let down = false, strokes = 0;
  g.lineWidth = 8; g.lineCap = "round"; g.lineJoin = "round"; g.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue("--brand").trim() || "#426C65";
  const pos = e => { const r = c.getBoundingClientRect(); return [(e.clientX - r.left) * c.width / r.width, (e.clientY - r.top) * c.height / r.height]; };
  c.addEventListener("pointerdown", e => { down = true; strokes++; c.setPointerCapture(e.pointerId); const [x, y] = pos(e); g.beginPath(); g.moveTo(x, y); });
  c.addEventListener("pointermove", e => { if (!down) return; const [x, y] = pos(e); g.lineTo(x, y); g.stroke(); });
  c.addEventListener("pointerup", () => { down = false; });
  on("#rpClear", () => g.clearRect(0, 0, c.width, c.height));
  on("#rpDone", () => done(strokes ? "Drew a picture" : "Chose to draw, left it blank"));
}
