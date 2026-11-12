"use strict";

// ---------- Describe It (Communication and Expression: saying exactly what you mean) ----------
// Bolt can't see the picture. The learner chooses clues so Bolt can find their Blip among look-alikes; then they swap
// and the learner follows Bolt's clues. Records how precise the learner's descriptions are (clues used compared with
// the fewest needed, and clues that didn't fit) and how they follow a description.
const DI_FEATURES = {
  body: [["round", "is round"], ["tall", "is tall"]],
  eyes: [[1, "has one eye"], [2, "has two eyes"], [3, "has three eyes"]],
  hat: [["hat", "wears a hat"], ["none", "has no hat"]],
  skin: [["spots", "has spots"], ["stripes", "has stripes"], ["plain", "has no pattern"]]
};
// The same clue said as a "not", which older learners hear from Bolt.
const DI_NOT = { "hat:none": "does NOT wear a hat", "skin:plain": "does NOT have spots or stripes", "body:round": "is NOT tall", "body:tall": "is NOT round" };
const diClues = () => Object.entries(DI_FEATURES).flatMap(([k, vs]) => vs.map(([v, t]) => ({ k, v, t, f: c => c[k] === v })));
const diName = c => `a ${c.body} Blip with ${["one eye", "two eyes", "three eyes"][c.eyes - 1]}, ${c.hat === "hat" ? "a hat" : "no hat"} and ${c.skin === "plain" ? "no pattern" : c.skin}`;
// The fewest true clues that pick out the target from the others.
function diMinClues(target, all) {
  const mine = diClues().filter(c => c.f(target));
  for (let n = 1; n <= mine.length; n++) {
    const combos = n === 1 ? mine.map(c => [c]) : mine.flatMap((a, i) => n === 2 ? mine.slice(i + 1).map(b => [a, b]) : mine.slice(i + 1).flatMap((b, j) => mine.slice(i + j + 2).map(d => [a, b, d])));
    const hit = combos.find(cs => all.filter(c => cs.every(x => x.f(c))).length === 1); if (hit) return hit;
  }
  return mine;
}
function diMake(n, older, minNeeded) {
  for (let tries = 0; tries < 400; tries++) {
    const set = [];
    while (set.length < n) {
      const c = { body: pick(["round", "tall"]), eyes: pick(older ? [1, 2, 3] : [1, 2]), hat: pick(["hat", "none"]), skin: pick(older ? ["spots", "stripes", "plain"] : ["spots", "plain"]) };
      if (!set.some(d => d.body === c.body && d.eyes === c.eyes && d.hat === c.hat && d.skin === c.skin)) set.push(c);
    }
    const target = pick(set);
    if (diMinClues(target, set).length >= minNeeded) return { set, target };
  }
  return null;
}
let diId = 0;
function blip(c, px) {
  const id = "di" + (++diId), body = c.body === "round" ? '<circle cx="20" cy="23" r="14"/>' : '<rect x="10" y="9" width="20" height="29" rx="10"/>';
  const top = 9, ey = c.body === "round" ? 20 : 17, xs = { 1: [20], 2: [15, 25], 3: [13, 20, 27] }[c.eyes];
  const skin = c.skin === "spots" ? '<g fill="var(--ink)" opacity="0.55"><circle cx="13" cy="30" r="2"/><circle cx="26" cy="31" r="2.2"/><circle cx="20" cy="35" r="1.8"/><circle cx="29" cy="25" r="1.6"/></g>'
    : c.skin === "stripes" ? '<g stroke="var(--ink)" stroke-width="2" opacity="0.55"><path d="M4 28 H36 M4 33 H36"/></g>' : "";
  return `<svg width="${px}" height="${px}" viewBox="0 0 40 42" aria-hidden="true"><defs><clipPath id="${id}">${body}</clipPath></defs>
    <g fill="var(--shape-d)" stroke="var(--ink)" stroke-width="1.8">${body}</g><g clip-path="url(#${id})">${skin}</g>
    ${xs.map(x => `<circle cx="${x}" cy="${ey}" r="3.2" fill="var(--surface)" stroke="var(--ink)" stroke-width="1.2"/><circle cx="${x}" cy="${ey + 0.6}" r="1.4" fill="var(--ink)"/>`).join("")}
    <path d="M16 ${ey + 7} Q20 ${ey + 10} 24 ${ey + 7}" stroke="var(--ink)" stroke-width="1.4" fill="none" stroke-linecap="round"/>
    ${c.hat === "hat" ? `<g fill="var(--ink)"><rect x="12" y="${top - 2}" width="16" height="3" rx="1"/><rect x="15" y="${top - 9}" width="10" height="8" rx="1.5"/></g><rect x="15" y="${top - 4}" width="10" height="2" fill="var(--gold)"/>` : ""}</svg>`;
}

function gameDescribe(run) {
  labStart(run);
  const older = S.band === "older", n = older ? 6 : 4, rounds = older ? ["tell", "tell", "listen", "listen"] : ["tell", "tell", "listen"], items = []; let ri = 0;
  const doRound = () => {
    const kind = rounds[ri], made = diMake(n, older, older ? 2 : kind === "tell" ? 2 : 1), { set, target } = made, need = diMinClues(target, set);
    const rec = newRec(kind === "tell" ? `Describe a Blip ${ri + 1}` : `Find Bolt's Blip ${ri + 1 - rounds.indexOf("listen")}`, { mode: kind === "tell" ? "described" : "listened", tells: 0, wrongClues: 0, clues: 0, fewest: need.length });
    const clues = diClues().filter(c => older || c.k !== "eyes" || c.v !== 3).filter(c => older || c.k !== "skin" || c.v !== "stripes");
    let chosen = [], fb = "", done = false, picked = null;
    // Bolt's clues when the learner listens: the fewest that work, and for older learners one put as a "not".
    const said = kind === "listen" ? need.map((c, i) => (older && i === need.length - 1 && DI_NOT[c.k + ":" + c.v]) || c.t) : [];
    const o = kind === "tell"
      ? { hint: 0, hints: ["What makes your Blip different from the others?", "Look at the Blips most like yours. What is different about yours?", `Try telling Bolt: "It ${need[0].t}."`] }
      : { hint: 0, hints: ["Check one clue at a time.", "Rule out every Blip that doesn't match the first clue. Then check the next clue."] };
    const intro = kind === "tell" ? `${run.x.name}. Bolt can't see your Blip. Choose clues so Bolt can find it.` : `Now Bolt describes a Blip, and you find it. Bolt says: it ${said.join(", and it ")}.`;
    const draw = () => {
      currentReturnSay = currentSay = fb || intro;
      const grid = `<div class="di-grid">${set.map((c, i) => kind === "listen"
        ? `<button class="di-blip${picked === i ? (c === target ? " right" : " wrong") : ""}" data-pick="${i}" aria-label="${esc(diName(c))}"${done ? " disabled" : ""}>${blip(c, 72)}</button>`
        : `<div class="di-blip${c === target ? " mine" : ""}" role="img" aria-label="${c === target ? "Your Blip: " : ""}${esc(diName(c))}">${blip(c, 72)}${c === target ? '<span class="di-tag">Yours</span>' : ""}</div>`).join("")}</div>`;
      render(`<section class="card">${labHead(run, `${ri + 1} of ${rounds.length}`)}
          <h2>${kind === "tell" ? W("Help Bolt find your Blip", "Describe your Blip so Bolt can find it") : W("Find the Blip Bolt is thinking of", "Follow Bolt's description")}</h2>
          <div class="lr-stage"><div class="lr-robot">${BOLT(done ? "happy" : "idle")}</div><div class="lr-bubble" role="status">${esc(kind === "listen" ? `It ${said.join(", and it ")}.` : fb || "I can't see your Blip! Tell me about it.")}</div></div>
          ${grid}
          ${kind === "tell" && !done ? `<h3>Your clues for Bolt</h3><div class="choices di-clues">${clues.map((c, i) => `<button class="choice" data-cl="${i}" aria-pressed="${chosen.includes(i)}"><span class="lbl">It ${esc(c.t)}</span></button>`).join("")}</div>` : ""}
          ${thinkPrompt()}${hintHtml(o)}
          ${kind === "listen" && fb ? `<div class="feedback${done ? "" : " gentle"}" role="status">${esc(fb)}</div>` : ""}
          ${done ? `<div class="row"><button class="btn primary" id="diNext" data-focus>${ri + 1 < rounds.length ? "Next one" : "Finish"}</button></div>`
            : labRow(o, kind === "tell" ? ["diTell", `${icon("💬")}<span>Tell Bolt</span>`, !chosen.length] : null)}
        </section>`);
      on("[data-cl]", e => { const i = +e.currentTarget.dataset.cl; chosen = chosen.includes(i) ? chosen.filter(x => x !== i) : chosen.concat(i); run.acted = true; draw(); const b = $main.querySelector(`[data-cl="${i}"]`); if (b) b.focus({ preventScroll: true }); });
      on("#diTell", () => {
        const cs = chosen.map(i => clues[i]), matches = set.filter(c => cs.every(x => x.f(c))), wrong = cs.filter(x => !x.f(target));
        rec.tells++; rec.checks++; rec.clues = cs.length; rec.wrongClues += wrong.length;
        const ok = matches.length === 1 && matches[0] === target;
        if (rec.firstMatched === null) rec.firstMatched = ok; rec.latestMatched = ok;
        if (ok) { done = true; fb = `Found it! ${cs.length <= need.length ? W("Your clues were just right.", "Exactly enough clues: precise.") : `You used ${cs.length} clues. ${need.length} would have been enough: "${need.map(c => c.t).join('" and "')}".`}`; }
        else if (wrong.length) fb = `Hmm. Look at your Blip again. Is it true that it ${wrong[0].t}? Check that clue.`;
        else if (!matches.length) fb = "I can't find any Blip that matches all of those!";
        else fb = `I can see ${matches.length} Blips that match. Which one? Tell me something more.`;
        draw(); speakNow(fb);
      });
      on("[data-pick]", e => {
        picked = +e.currentTarget.dataset.pick; const ok = set[picked] === target; rec.checks++; run.acted = true;
        if (rec.firstMatched === null) rec.firstMatched = ok; rec.latestMatched = ok;
        if (ok) { done = true; fb = "That's the one! You followed every clue."; } else { const miss = need.find(c => !c.f(set[picked])); fb = miss ? `Not that one: Bolt's Blip ${miss.t}, and that one doesn't. Try again.` : "Not that one. Check each clue again."; }
        draw(); speakNow(fb);
      });
      on("#diNext", () => { items.push(rec); ri++; ri < rounds.length ? doRound() : wrapUp(); });
      on("#lkSkip", () => { rec.movedOn = true; items.push(rec); ri++; ri < rounds.length ? doRound() : wrapUp(); });
      wireHints(o, rec, draw);
    };
    labSay(intro); draw();
  };
  const wrapUp = () => labReflect(run, W("Which was easier?", "Which did you find easier?"), ["Telling Bolt", "Listening to Bolt", "Both were fine", "I'm not sure"],
    r => finishExercise(run, items, r, null, `Clues used compared with fewest needed: ${items.filter(i => i.mode === "described").map(i => `${i.clues}/${i.fewest}`).join(", ")}. Clues that didn't fit: ${items.reduce((s, i) => s + i.wrongClues, 0)}.`));
  doRound();
}
