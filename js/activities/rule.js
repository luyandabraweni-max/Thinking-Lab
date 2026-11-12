"use strict";

// ---------- The Secret Rule Machine (Inquiry and Systems Thinking: investigating) ----------
// The machine lights up for some objects and not others. The learner builds objects, tests them, works out the hidden
// rule, then proves it by predicting. Records how they investigate: how many tests, whether they change one thing at a
// time (a fair test), and whether a wrong guess sends them back to gather more evidence.
const RM_SHAPES = [["circle", "Circle"], ["triangle", "Triangle"], ["square", "Square"], ["star", "Star"]];
const RM_FILLS = [["solid", "Plain"], ["striped", "Stripes"], ["dotted", "Dots"]];
const RM_SIZES = [["big", "Big"], ["small", "Small"]];
const RM_RULES = {
  younger: [
    { text: "It is round", about: "its shape", f: o => o.shape === "circle" },
    { text: "It has stripes", about: "its pattern", f: o => o.fill === "striped" },
    { text: "It is big", about: "its size", f: o => o.size === "big" },
    { text: "It has dots", about: "its pattern", f: o => o.fill === "dotted" },
    { text: "It is a triangle", about: "its shape", f: o => o.shape === "triangle" }
  ],
  older: [
    { text: "It is big and has corners", about: "its size and its shape", f: o => o.size === "big" && o.shape !== "circle" },
    { text: "It is a star, or it has dots", about: "its shape or its pattern", f: o => o.shape === "star" || o.fill === "dotted" },
    { text: "It is small and has no stripes", about: "its size and its pattern", f: o => o.size === "small" && o.fill !== "striped" },
    { text: "It has corners but is not a square", about: "its shape only", f: o => o.shape === "triangle" || o.shape === "star" },
    { text: "It is round or it has stripes", about: "its shape or its pattern", f: o => o.shape === "circle" || o.fill === "striped" }
  ]
};
const RM_ALL = RM_SHAPES.flatMap(([shape]) => RM_FILLS.flatMap(([fill]) => RM_SIZES.map(([size]) => ({ shape, fill, size }))));
const rmSame = (a, b) => a.shape === b.shape && a.fill === b.fill && a.size === b.size;
const rmDiff = (a, b) => ["shape", "fill", "size"].filter(k => a[k] !== b[k]).length;
const rmName = o => `${o.size} ${{ solid: "plain", striped: "striped", dotted: "dotted" }[o.fill]} ${o.shape}`;
let rmId = 0;
// An object, drawn so colour is never the only cue: each pattern also has its own texture.
function rmToken(o, px, label) {
  const id = "rm" + (++rmId), col = { solid: "var(--shape-a)", striped: "var(--shape-b)", dotted: "var(--shape-c)" }[o.fill];
  const fill = o.fill === "solid" ? col : `url(#${id})`, k = o.size === "big" ? 1 : 0.62, t = `translate(${20 - 20 * k} ${20 - 20 * k}) scale(${k})`;
  const shape = { circle: '<circle cx="20" cy="20" r="16"/>', triangle: '<path d="M20 3 L37 35 H3 Z"/>', square: '<rect x="5" y="5" width="30" height="30" rx="3"/>',
    star: '<path d="M20 2 L25 14 L38 15 L28 24 L31 37 L20 30 L9 37 L12 24 L2 15 L15 14 Z"/>' }[o.shape];
  return `<svg class="rm-tok" width="${px}" height="${px}" viewBox="0 0 40 40" ${label ? `role="img" aria-label="${esc(label)}"` : 'aria-hidden="true"'}>
    <defs>${o.fill === "striped" ? `<pattern id="${id}" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="6" height="6" fill="var(--surface)"/><rect width="3" height="6" fill="${col}"/></pattern>`
      : o.fill === "dotted" ? `<pattern id="${id}" width="7" height="7" patternUnits="userSpaceOnUse"><rect width="7" height="7" fill="var(--surface)"/><circle cx="3.5" cy="3.5" r="2.2" fill="${col}"/></pattern>` : ""}</defs>
    <g transform="${t}" fill="${fill}" stroke="var(--ink)" stroke-width="2" stroke-linejoin="round">${shape}</g></svg>`;
}
const rmMachine = (o, state) => `<svg class="rm-machine ${state}" viewBox="0 0 220 180" aria-hidden="true">
    <path d="M70 6 H150 L128 40 H92 Z" fill="var(--brand-soft)" stroke="var(--ink)" stroke-width="3" stroke-linejoin="round"/>
    <rect x="30" y="40" width="160" height="120" rx="18" fill="var(--brand)" stroke="var(--ink)" stroke-width="3"/>
    <rect x="52" y="58" width="74" height="74" rx="12" fill="var(--surface)" stroke="var(--ink)" stroke-width="3"/>
    ${o ? `<g transform="translate(59 65)">${rmToken(o, 60).replace('class="rm-tok"', 'class="rm-tok in"')}</g>` : ""}
    <g transform="translate(158 82)"><g class="gear g1"><circle r="14" fill="var(--gold)" stroke="var(--ink)" stroke-width="2.5"/><circle r="4" fill="var(--ink)"/><path d="M0 -20 V-12 M0 12 V20 M-20 0 H-12 M12 0 H20 M-14 -14 L-9 -9 M9 9 L14 14 M-14 14 L-9 9 M9 -9 L14 -14" stroke="var(--ink)" stroke-width="5"/></g></g>
    <g transform="translate(158 124)"><g class="gear g2"><circle r="10" fill="var(--gold-soft)" stroke="var(--ink)" stroke-width="2.5"/><circle r="3" fill="var(--ink)"/><path d="M0 -15 V-9 M0 9 V15 M-15 0 H-9 M9 0 H15" stroke="var(--ink)" stroke-width="4"/></g></g>
    <g transform="translate(186 26)"><g class="bulb"><g class="rays" stroke="var(--gold)" stroke-width="3" stroke-linecap="round"><path d="M0 -24 V-18 M-20 -14 L-15 -10 M20 -14 L15 -10 M-24 4 H-18 M24 4 H18"/></g>
      <circle r="14" cy="2" fill="${state === "yes" ? "var(--gold)" : "var(--line)"}" stroke="var(--ink)" stroke-width="3"/><rect x="-7" y="15" width="14" height="9" rx="2" fill="var(--muted)" stroke="var(--ink)" stroke-width="2"/></g></g>
    <rect x="52" y="140" width="74" height="16" rx="5" fill="var(--surface)" stroke="var(--ink)" stroke-width="2"/>
    <text x="89" y="152.5" text-anchor="middle" font-size="12" font-weight="700" fill="var(--ink)">${state === "yes" ? "YES!" : state === "no" ? "NO" : state === "think" ? "..." : "READY"}</text></svg>`;

function gameRule(run) {
  labStart(run);
  const pool = RM_RULES[S.band === "older" ? "older" : "younger"], rules = shuffle(pool.slice()).slice(0, 2), items = []; let ri = 0;
  const doRound = () => {
    const rule = rules[ri], lights = o => rule.f(o);
    const ex = [pick(RM_ALL.filter(lights)), pick(RM_ALL.filter(o => !lights(o)))], log = ex.map(o => ({ o, yes: lights(o), given: true }));
    const rec = newRec(`Rule ${ri + 1}`, { tests: 0, fairTests: 0, guesses: 0, predictions: 0, mode: "tested objects" });
    const o = { hint: 0, hints: [W("Change just one thing at a time, then see if the machine changes its mind.", "Change one feature at a time. That way you know what made the difference."),
      W("Look at everything that lit up. What do they all have?", "Compare what lit up with what stayed dark. What do only the YES objects share?"), `The rule is about ${rule.about}.`] };
    let cur = { shape: "square", fill: "solid", size: "big" }, lastTried = ex[1], state = "idle", inMachine = null, phase = "test", fb = "", guessOpts = null, proof = null;
    const intro = `${run.x.name}. This machine lights up for some things and not others. It has a secret rule. Build something, put it in, and find the rule.`;
    const logList = yes => { const l = log.filter(e => e.yes === yes); return l.length ? `<ul class="rm-log">${l.map(e => `<li>${rmToken(e.o, 44, rmName(e.o) + (e.given ? " (example)" : ""))}</li>`).join("")}</ul>` : `<p class="muted">Nothing yet.</p>`; };
    const picker = (key, list) => `<div class="rm-pick" role="group" aria-label="${{ shape: "Shape", fill: "Pattern", size: "Size" }[key]}">${list.map(([v, l]) =>
      `<button class="choice rm-opt" data-k="${key}" data-v="${v}" aria-pressed="${cur[key] === v}">${rmToken(Object.assign({}, cur, { [key]: v, size: key === "size" ? v : "big" }), 30)}<span class="lbl">${l}</span></button>`).join("")}</div>`;
    const draw = () => {
      currentReturnSay = currentSay = fb || intro;
      let body = "";
      if (phase === "test") body = `
          <div class="rm-build">
            <div class="rm-preview">${rmToken(cur, 96, "You are making a " + rmName(cur))}<p class="rm-cap">${esc(rmName(cur))}</p></div>
            <div class="rm-pickers"><p class="eyebrow">Shape</p>${picker("shape", RM_SHAPES)}<p class="eyebrow">Pattern</p>${picker("fill", RM_FILLS)}<p class="eyebrow">Size</p>${picker("size", RM_SIZES)}</div>
          </div>
          ${hintHtml(o)}
          ${fb ? `<div class="feedback gentle" role="status">${esc(fb)}</div>` : ""}
          ${labRow(o, ["rmTest", `${icon("⚙️")}<span>Put it in the machine</span>`, state === "think"], `<button class="btn" id="rmGuess"${state === "think" ? " disabled" : ""}>${icon("💡")}<span>I know the rule</span></button>`)}`;
      else if (phase === "guess") body = `
          <h3>What is the secret rule? The machine lights up when...</h3>
          <div class="choices">${guessOpts.map((g, i) => `<button class="choice" data-g="${i}"><span class="lbl">${esc(g.text)}</span></button>`).join("")}</div>
          <div class="row"><button class="btn quiet" id="rmBack">Test some more first</button></div>`;
      else if (phase === "prove") {
        const p = proof.list[proof.i];
        body = `<h3>Prove it! Will the machine light up for this one?</h3>
          <div class="rm-proof">${rmToken(p, 96, rmName(p))}</div>
          ${fb ? `<div class="feedback gentle" role="status">${esc(fb)}</div>` : ""}
          <div class="row"><button class="btn primary" data-p="1">${icon("💡")}<span>It lights up</span></button><button class="btn primary" data-p="0">${icon("⚫")}<span>It stays dark</span></button></div>`;
      } else body = `${fb ? `<div class="feedback" role="status">${esc(fb)}</div>` : ""}<div class="row"><button class="btn primary" id="rmNext" data-focus>${ri + 1 < rules.length ? "Next machine" : "Finish"}</button></div>`;
      render(`<section class="card">
          ${labHead(run, `Machine ${ri + 1} of ${rules.length}`)}
          <h2>${W("Find the secret rule", "Discover the hidden rule")}</h2>
          <div class="rm-top"><div class="rm-mach">${rmMachine(inMachine, state)}<p class="sr" role="status">${inMachine ? `The ${rmName(inMachine)} ${state === "yes" ? "made the machine light up." : state === "no" ? "did not make the machine light up." : "is in the machine."}` : ""}</p></div>
            <div class="rm-logs"><div><p class="eyebrow">${icon("💡")} Lights up</p>${logList(true)}</div><div><p class="eyebrow">${icon("⚫")} Stays dark</p>${logList(false)}</div></div></div>
          ${thinkPrompt()}
          ${body}
        </section>`);
      on("[data-k]", e => { const b = e.currentTarget; cur = Object.assign({}, cur, { [b.dataset.k]: b.dataset.v }); fb = ""; draw(); const a = $main.querySelector(`[data-k="${b.dataset.k}"][data-v="${b.dataset.v}"]`); if (a) a.focus({ preventScroll: true }); });
      on("#rmTest", () => {
        const t = Object.assign({}, cur); rec.tests++; run.acted = true;
        if (rmDiff(lastTried, t) === 1) rec.fairTests++; // a fair test: one change from the last thing tried
        lastTried = t;
        inMachine = t; state = "think"; fb = ""; draw();
        labTimer = setTimeout(() => {
          if (!labAlive(run)) return;
          const yes = lights(t); state = yes ? "yes" : "no";
          if (!log.some(e => rmSame(e.o, t))) log.push({ o: t, yes });
          fb = `The ${rmName(t)} ${yes ? "made it light up!" : "kept it dark."}`; draw(); speakNow(fb);
          const b = document.getElementById("rmTest"); if (b) b.focus({ preventScroll: true });
        }, reduceMotion() ? 0 : 1200);
      });
      on("#rmGuess", () => { phase = "guess"; guessOpts = shuffle([rule].concat(shuffle(pool.filter(r => r !== rule)).slice(0, 3))); fb = ""; draw(); labSay("What is the secret rule? " + guessOpts.map(g => g.text).join(". ") + "."); });
      on("#rmBack", () => { phase = "test"; draw(); });
      on("[data-g]", e => {
        const g = guessOpts[+e.currentTarget.dataset.g]; rec.guesses++; rec.checks++;
        const right = g === rule; if (rec.firstMatched === null) rec.firstMatched = right; rec.latestMatched = right;
        if (right) {
          const fresh = shuffle(RM_ALL.filter(x => !log.some(e2 => rmSame(e2.o, x))));
          const yesOne = fresh.find(lights), noOne = fresh.find(x => !lights(x)), list = [yesOne, noOne, fresh.find(x => x !== yesOne && x !== noOne)].filter(Boolean);
          proof = { list: shuffle(list), i: 0, right: 0 }; phase = "prove"; fb = ""; draw(); labSay("Yes, that's the rule! Now prove it. Will the machine light up for this one?");
        } else {
          // Evidence, not just "wrong": an object the machine has already judged differently from the guessed rule.
          const counter = log.find(e2 => g.f(e2.o) !== e2.yes) || RM_ALL.map(x => ({ o: x, yes: lights(x) })).find(e2 => g.f(e2.o) !== e2.yes);
          phase = "test"; fb = `Not quite. Look at the ${rmName(counter.o)}: ${counter.yes ? "it lights up" : "it stays dark"}, but that rule says it ${g.f(counter.o) ? "would light up" : "would stay dark"}. Test some more.`;
          if (!log.some(e2 => rmSame(e2.o, counter.o))) log.push(counter);
          draw(); speakNow(fb);
        }
      });
      on("[data-p]", e => {
        const p = proof.list[proof.i], said = e.currentTarget.dataset.p === "1", yes = lights(p); rec.predictions++;
        if (said === yes) proof.right++;
        log.push({ o: p, yes }); inMachine = p; state = yes ? "yes" : "no";
        fb = said === yes ? `Right! The ${rmName(p)} ${yes ? "lights it up" : "keeps it dark"}.` : `This time the machine said ${yes ? "yes" : "no"}. The ${rmName(p)} ${yes ? "lights it up" : "keeps it dark"}.`;
        proof.i++;
        if (proof.i >= proof.list.length) { phase = "done"; rec.proved = proof.right; fb += ` You predicted ${proof.right} of ${proof.list.length} correctly. ${proof.right === proof.list.length ? "You cracked the rule!" : "You found the rule. Proving it helps you be sure."}`; }
        draw(); speakNow(fb);
      });
      on("#rmNext", () => { items.push(rec); ri++; ri < rules.length ? doRound() : wrapUp(); });
      on("#lkSkip", () => { rec.movedOn = true; items.push(rec); ri++; ri < rules.length ? doRound() : wrapUp(); });
      wireHints(o, rec, draw);
    };
    labSay(intro); draw();
  };
  const wrapUp = () => labReflect(run, W("How did you find the rule?", "How did you work out the rule?"), ["I changed one thing at a time", "I tried lots of different things", "I looked at what lit up", "I'm not sure"],
    r => finishExercise(run, items, r, null, `Tests per machine: ${items.map(i => i.tests).join(", ")}. Fair tests (one change at a time): ${items.map(i => i.fairTests).join(", ")}. Guesses: ${items.map(i => i.guesses).join(", ")}.`));
  doRound();
}
