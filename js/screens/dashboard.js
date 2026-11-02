"use strict";

// ---------- Demo dashboard (made-up learners, memory only) ----------
// Shows how history, strengths and summaries would work. Nothing here is real or saved.
const HOME_IDEA = {
  pattern: "Make a pattern with spoons and forks at the table, and ask what comes next.",
  vetkoek: "Share a snack fairly between family members and talk about how you know it's fair.",
  comic: "Take three photos of a daily routine, mix them up, and put them back in order together.",
  memory: "Play a quick pairs game with socks or playing cards.",
  paint: "Mix a little food colouring in water and guess the colour before you mix.",
  robot: "Give each other step-by-step directions to find something in the house.",
  sort: "Sort laundry by colour, then sort it again by who it belongs to.",
  kraal: "Invent an animal together and ask what it is good at, and why."
};
const MODE_TEXT = { choose: "choosing from pictures", pair: "choosing from pictures", number: "choosing from pictures", build: "building step by step", place: "building step by step", share: "building step by step", tap: "tapping", "choose parts": "choosing parts", drew: "drawing" };
const modeGroup = m => ({ pair: "choose", number: "choose", choose: "choose", place: "build", share: "build", build: "build", drew: "draw", "choose parts": "choose" })[m] || null;
// Sample rows: [date, activity, status, answer mode, hints, what the learner said helped]
const DEMO = [
  { code: "Sunny Giraffe", cohort: "3-6", band: "younger", answer: "choose", supports: "Read-aloud on, larger text", rows: [
    ["2026-10-05", "pattern", "alone", "pair", 0, "Finding the repeating part"], ["2026-10-05", "comic", "support", "tap", 1, "Looked at the pictures"],
    ["2026-10-07", "pattern", "alone", "pair", 0, "Finding the repeating part"], ["2026-10-07", "kraal", "open", "choose parts", 0, "Mixed animals I know"],
    ["2026-10-12", "memory", "alone", "tap", 0, "Remembering where they were"], ["2026-10-12", "pattern", "alone", "pair", 0, "Counting"],
    ["2026-10-14", "sort", "support", "tap", 1, "Took a moment"], ["2026-10-14", "kraal", "open", "drew", 0, "Tried lots of parts"],
    ["2026-10-19", "pattern", "alone", "pair", 0, "Finding the repeating part"], ["2026-10-19", "memory", "alone", "tap", 0, "Saying the names in my head"],
    ["2026-10-21", "comic", "support", "tap", 2, "Listened to the words"], ["2026-10-21", "kraal", "open", "drew", 0, "Thought about what it needs to do"]] },
  { code: "Brave Meerkat", cohort: "7-12", band: "older", answer: "build", supports: "Quiet mode, reduced motion", rows: [
    ["2026-10-06", "robot", "support", "build", 1, "Tried, then fixed it"], ["2026-10-06", "pattern", "notyet", "place", 2, "Not sure"],
    ["2026-10-08", "paint", "alone", "build", 0, "I guessed first, then checked"], ["2026-10-08", "robot", "support", "build", 2, "One step at a time"],
    ["2026-10-13", "vetkoek", "support", "share", 1, "Tried and fixed it"], ["2026-10-13", "pattern", "support", "place", 1, "Trying different choices"],
    ["2026-10-15", "robot", "alone", "build", 0, "Planned all the steps first"], ["2026-10-20", "paint", "alone", "build", 0, "I tried mixing"]] },
  { code: "Calm Heron", cohort: "13-18", band: "older", answer: "choose", supports: "Clear letters font", rows: [
    ["2026-10-22", "sort", "alone", "tap", 0, "Easy to switch"], ["2026-10-22", "paint", "support", "choose", 1, "I guessed first, then checked"],
    ["2026-10-27", "comic", "alone", "tap", 0, "Thought about what makes sense"]] }
];
const demoDecisions = {}; let demoCurrent = null;
const exById = id => EXERCISES.find(x => x.id === id) || (u => u && { id: u.id, name: u.title, domain: u.domain, cat: u.subject })(UNITS.find(u => u.id === id));
const niceDate = d => { const [y, m, dd] = d.split("-").map(Number); return `${dd} ${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][m - 1]}`; };

// Strength signals, then the agreed levels: Early, Growing, Consistent (pending expert review).
function strengths(L) {
  const sig = {};
  const add = (key, label, suggestion, row) => { (sig[key] = sig[key] || { key, label, suggestion, rows: [] }).rows.push(row); };
  L.rows.forEach(r => {
    const x = exById(r[1]); if (!x) return;
    if (r[2] === "alone") add("dom:" + x.domain, `Works independently in ${x.domain}`, `Offer a more challenging level in ${x.domain}`, r);
    if (r[2] === "support" && r[4] > 0) add("hints", "Makes good use of hints", "Keep hints visible and offer the first one early", r);
    if (r[2] === "open") add("ideas", "Shares original ideas", "Offer open-ended choices, like drawing an answer", r);
    const g = modeGroup(r[3]);
    if (g && (r[2] === "alone" || r[2] === "support")) add("mode:" + g, `Succeeds when ${g === "draw" ? "drawing" : g === "build" ? "building answers step by step" : "choosing from pictures"}`, `Offer ${g === "draw" ? "the drawing answer" : g === "build" ? "the build-it answer" : "picture choices"} first`, r);
  });
  return Object.values(sig).map(s => {
    const sessions = new Set(s.rows.map(r => r[0])).size, days = sessions, acts = new Set(s.rows.map(r => r[1])).size;
    s.level = sessions >= 5 && days >= 3 && acts >= 2 ? "Consistent" : sessions >= 3 && days >= 2 ? "Growing" : "Early";
    s.evidence = `${s.rows.length} time${s.rows.length > 1 ? "s" : ""} in ${sessions} session${sessions > 1 ? "s" : ""}, across ${acts} activit${acts > 1 ? "ies" : "y"}`;
    return s;
  }).sort((a, b) => ["Consistent", "Growing", "Early"].indexOf(a.level) - ["Consistent", "Growing", "Early"].indexOf(b.level) || b.rows.length - a.rows.length);
}

function dashboard() {
  stopSpeaking(); closeLayer(); bar("adult"); demoCurrent = null;
  render(`
      <section class="card">
        <p class="eyebrow">Demo dashboard</p>
        <h1>Learners</h1>
        <p class="note demo-flag">Made-up learners for demonstration only. Nothing on these screens is real, and nothing is saved.</p>
        <div class="grid">${DEMO.map((L, i) => {
        const st = strengths(L)[0], last = L.rows[L.rows.length - 1][0];
        return `<button class="tile" data-dl="${i}"><span class="pill">${COHORTS[L.cohort]}</span><span class="t-name">${esc(L.code)}</span>
            <span class="t-cat">${new Set(L.rows.map(r => r[0])).size} sessions · last on ${niceDate(last)}</span>
            ${st ? `<span class="t-dom">${st.level}: ${esc(st.label)}</span>` : ""}</button>`;
      }).join("")}</div>
        <div class="row"><button class="btn" id="dbBack">Back to session setup</button></div>
      </section>`);
  on("[data-dl]", e => learnerPage(+e.currentTarget.dataset.dl, "teacher"));
  on("#dbBack", setup);
}

function learnerPage(i, tab) {
  const L = DEMO[i]; demoCurrent = i; bar("adult");
  const ss = strengths(L), dates = [...new Set(L.rows.map(r => r[0]))];
  const domains = ["Communication and Expression", "Logical and Analytical Thinking", "Inquiry and Systems Thinking", "Creativity and Metacognition"];
  const domCount = d => L.rows.filter(r => exById(r[1]).domain === d).length, maxDom = Math.max(1, ...domains.map(domCount));
  const tabs = [["teacher", "Teacher view"], ["family", "Family summary"], ["profile", "Learner profile"]];
  let body = "";
  if (tab === "teacher") {
    body = `
        <h2>Strengths and preferences</h2>
        <p class="note">Strengths come first. Each one shows its evidence. These are observations of activities, not a diagnosis, a label or proof of mastery. Levels follow the draft rule: Early (1 to 2 sessions), Growing (3 or more sessions on 2 or more days), Consistent (5 or more sessions on 3 or more days, in 2 or more activities).</p>
        <div class="obs">${ss.map(s => {
        const dec = demoDecisions[L.code + s.key];
        return `<div class="obs-item"><span class="status lvl-${s.level.toLowerCase()}">${s.level}</span> <b>${esc(s.label)}</b>
            <div class="note">Evidence: ${esc(s.evidence)}. Activities: ${[...new Set(s.rows.map(r => exById(r[1]).name))].map(esc).join(", ")}.</div>
            ${s.level === "Early" ? `<div class="note">Early observation. No change for the learner yet.</div>`
            : dec ? `<div class="note">You ${dec === "yes" ? "accepted" : "dismissed"} the suggestion: ${esc(s.suggestion.toLowerCase())}. <button class="btn small quiet" data-undo="${esc(s.key)}">Undo</button></div>`
            : `<div class="row"><span style="flex:1 1 260px">Suggestion: ${esc(s.suggestion)}.</span><span class="row" style="gap:8px;flex-wrap:nowrap"><button class="btn small" data-acc="${esc(s.key)}">Use this</button><button class="btn small quiet" data-dis="${esc(s.key)}">Not now</button></span></div>`}
          </div>`;
      }).join("") || '<p class="muted">No observations yet.</p>'}</div>
        <h2>Activities by domain</h2>
        <div class="dombars">${domains.map(d => `<div class="dombar"><span>${esc(d)}</span><span class="track"><span class="fill" style="width:${domCount(d) / maxDom * 100}%"></span></span><span>${domCount(d)}</span></div>`).join("")}</div>
        <p class="note">Number of activities completed in each domain. A gap shows where to offer something new, not a weakness.</p>
        <h2>Curriculum links (proposed)</h2>
        <p class="note">How the activities this learner has done connect to the curriculum for their age group. 2to.iQ does not replace the school's curriculum. These links are drafts awaiting specialist confirmation.</p>
        <ul class="plain">${[...new Set(L.rows.map(r => r[1]))].map(id => `<li><b>${esc(exById(id).name)}</b>: ${esc(curriculumLink(id, L.cohort))}</li>`).join("")}</ul>
        <h2>Session history</h2>
        <div class="tablewrap" tabindex="0" role="region" aria-label="Session history"><table class="hist"><thead><tr><th scope="col">Date</th><th scope="col">Activity</th><th scope="col">What was observed</th><th scope="col">Answered by</th><th scope="col">Hints</th><th scope="col">Learner said</th></tr></thead>
        <tbody>${L.rows.slice().reverse().map(r => `<tr><td>${niceDate(r[0])}</td><td>${esc(exById(r[1]).name)}</td><td><span class="status st-${r[2]}">${STATUS_TEXT[r[2]]}</span></td><td>${esc(MODE_TEXT[r[3]] || r[3])}</td><td>${r[4]}</td><td>${esc(r[5])}</td></tr>`).join("")}</tbody></table></div>`;
  } else if (tab === "family") {
    const acts = [...new Set(L.rows.map(r => r[1]))];
    const top = ss.filter(s => s.level !== "Early").slice(0, 2);
    const fav = L.rows.reduce((m, r) => (m[r[1]] = (m[r[1]] || 0) + 1, m), {});
    const most = Object.keys(fav).sort((a, b) => fav[b] - fav[a])[0];
    body = `
        <h2>What ${esc(L.code)} explored</h2>
        <p>Between ${niceDate(dates[0])} and ${niceDate(dates[dates.length - 1])}, ${esc(L.code)} took part in ${dates.length} session${dates.length > 1 ? "s" : ""} and tried ${acts.length} different activit${acts.length > 1 ? "ies" : "y"}.</p>
        <ul class="plain">${acts.map(a => `<li><b>${esc(exById(a).name)}:</b> ${esc(L.code)} ${esc(SPEC[a].parent)}</li>`).join("")}</ul>
        <h2>What went well</h2>
        ${top.length ? `<ul class="plain">${top.map(s => `<li>${esc(s.label)}.</li>`).join("")}</ul>` : `<p>It is early days. We will share patterns once there are a few more sessions.</p>`}
        <h2>One idea for home</h2>
        <p>${esc(HOME_IDEA[most])}</p>
        <p class="note">This summary describes activities, not ability. It is not a diagnosis or an assessment.</p>`;
  } else {
    body = `
        <h2>Learner profile</h2>
        <table class="hist"><tbody>
          <tr><th scope="row">Age group</th><td>${COHORTS[L.cohort]} (provisional grouping)</td></tr>
          <tr><th scope="row">Challenge</th><td>${LEVEL[L.band]}</td></tr>
          <tr><th scope="row">Answers by</th><td>${L.answer === "build" ? "Building step by step" : "Choosing from pictures"}</td></tr>
          <tr><th scope="row">Supports</th><td>${esc(L.supports)}</td></tr></tbody></table>
        <p class="note">Settings describe what helps. They are not labels and carry no diagnosis.</p>
        <div class="row"><button class="btn primary" id="dlStart">Start a session as ${esc(L.code)}</button></div>
        <p class="note">The session will use this profile. When you end it, it is added to this demo history so you can see it appear.</p>`;
  }
  render(`
      <section class="card">
        <p class="eyebrow">Demo dashboard · made-up learner</p>
        <h1>${esc(L.code)}</h1>
        <p class="note">${COHORTS[L.cohort]} · ${LEVEL[L.band]} · ${dates.length} sessions</p>
        <div class="row" role="tablist" aria-label="Views">${tabs.map(([k, l]) => `<button class="btn small" role="tab" id="tab-${k}" aria-selected="${tab === k}" data-tab="${k}">${l}</button>`).join("")}</div>
        <div role="tabpanel" aria-labelledby="tab-${tab}" class="tabpanel">${body}</div>
        <div class="row"><button class="btn" id="dlBack">All learners</button></div>
      </section>`);
  on("[data-tab]", e => learnerPage(i, e.currentTarget.dataset.tab));
  on("#dlBack", dashboard);
  on("[data-acc]", e => { demoDecisions[L.code + e.currentTarget.dataset.acc] = "yes"; learnerPage(i, tab); });
  on("[data-dis]", e => { demoDecisions[L.code + e.currentTarget.dataset.dis] = "no"; learnerPage(i, tab); });
  on("[data-undo]", e => { delete demoDecisions[L.code + e.currentTarget.dataset.undo]; learnerPage(i, tab); });
  on("#dlStart", () => {
    Object.assign(S, { code: L.code, cohort: L.cohort, band: L.band, answer: L.answer, demoLearner: i });
    setup();
  });
}

// When a demo learner's session ends, add it to their in-memory history.
function addSessionToDemo() {
  if (S.demoLearner == null) return 0;
  const L = DEMO[S.demoLearner], today = new Date().toISOString().slice(0, 10); let n = 0;
  S.obs.forEach(o => o.items.forEach(it => { L.rows.push([today, o.id, statusOf(it), it.mode || "tap", it.hints || 0, o.reflection]); n++; }));
  return n;
}
