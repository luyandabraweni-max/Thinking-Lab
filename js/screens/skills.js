"use strict";

function skillProjects(sk) { return sk.levels[S.cohort] || sk.levels["7-12"]; }
function skillsHome() {
  inGame = false; mark("skills", skillsHome); bar("child");
  const lines = ["Skills.", W("Choose a skill you would like to get better at. You will do real projects with your hands.", "Choose a skill to build. Each one has hands-on projects for your age group.")];
  currentReturnSay = currentSay = lines.join(" ");
  const doneIn = sk => skillProjects(sk).filter(p => S.badges.some(b => b.id === p.id)).length;
  render(`<section style="display:flex;flex-direction:column;gap:16px">
      <div><p class="eyebrow">Skills · ${esc(SKILL_LEVELS[S.cohort] || "")}</p><h1>Choose a skill</h1><p class="muted">${esc(lines[1])}</p></div>
      <div class="grid">${SKILLS.map(sk => `<button class="tile" data-skill="${sk.id}"><span class="pill">${doneIn(sk)} of ${skillProjects(sk).length} done</span><span class="t-name">${icon(sk.icon)} ${esc(sk.name)}</span><span class="t-cat">${esc(sk.about)}</span></button>`).join("")}
        ${SKILLS_SOON.map(([id, n, e]) => `<button class="tile" aria-disabled="true" data-soon="${id}"><span class="pill">Coming soon</span><span class="t-name">${icon(e)} ${esc(n)}</span></button>`).join("")}</div>
      ${S.badges.length ? `<div class="card"><h2>My skill badges</h2>${badgeList()}</div>` : ""}
    </section>`);
  setSayLines(lines);
  on("[data-skill]", e => skillPage(SKILLS.find(s => s.id === e.currentTarget.dataset.skill)));
}
function badgeList() { return `<ul class="badges">${S.badges.map(b => `<li><span class="badge-ic" aria-hidden="true">${b.icon}</span><span><b>${esc(b.badge)}</b><br><span class="muted">${esc(b.skill)}: ${esc(b.how)}</span></span></li>`).join("")}</ul>`; }
function skillPage(sk) {
  inGame = false; mark("sk-" + sk.id, () => skillPage(sk)); bar("child"); loadUnitClips(sk.id);
  const ps = skillProjects(sk);
  const lines = [sk.name + ".", sk.about, "Choose a project."];
  currentReturnSay = currentSay = lines.join(" ");
  render(`<section class="card" style="display:flex;flex-direction:column;gap:14px">
      <p class="eyebrow">Skills · ${esc(SKILL_LEVELS[S.cohort] || "")}</p>
      <h1>${icon(sk.icon)} ${esc(sk.name)}</h1>
      <p class="lead">${esc(sk.about)}</p>
      <div class="grid">${ps.map(p => { const got = S.badges.find(b => b.id === p.id); return `<button class="tile" data-proj="${p.id}"><span class="pill">${got ? "Badge earned" : "Start"}</span><span class="t-name">${esc(p.title)}</span><span class="t-cat">About ${esc(p.time)}${p.adult ? " · with a grown-up" : ""}</span></button>`; }).join("")}</div>
      <details class="passage"><summary>Where this skill can lead</summary><ul class="plain">${sk.leads.map(l => `<li>${esc(l)}</li>`).join("")}</ul><p class="note">${esc(sk.link)}</p></details>
      <div class="row"><button class="btn" id="skBack">All skills</button></div>
    </section>`);
  setSayLines(lines);
  on("[data-proj]", e => projectStart(sk, ps.find(p => p.id === e.currentTarget.dataset.proj)));
  on("#skBack", skillsHome);
}
function projectStart(sk, p) {
  mark("pj-" + p.id, () => projectStart(sk, p)); bar("exercise"); inGame = true;
  const lines = [p.title + ".", "What you need."].concat(p.need, ["Stay safe."], p.safety, p.adult ? ["Ask a grown-up to be with you for this project."] : []);
  render(`<section class="card" style="display:flex;flex-direction:column;gap:14px">
      <p class="eyebrow">${esc(sk.name)} · project</p>
      <h1>${esc(p.title)}</h1>
      <p class="muted">About ${esc(p.time)}</p>
      <h2>What you need</h2><ul class="plain">${p.need.map(x => `<li>${esc(x)}</li>`).join("")}</ul>
      <h2>Stay safe</h2><ul class="plain">${p.safety.map(x => `<li>${esc(x)}</li>`).join("")}</ul>
      ${p.adult ? `<label class="row" for="pjAdult" style="flex-direction:row;font-family:var(--font-display)"><input type="checkbox" id="pjAdult"> A grown-up is with me</label>` : ""}
      <p class="note" id="pjMsg" role="status"></p>
      <div class="row"><button class="btn primary" id="pjGo" data-focus>I'm ready</button><button class="btn" id="pjBack">Back</button></div>
    </section>`);
  setSayLines(lines);
  on("#pjGo", () => { if (p.adult && !document.getElementById("pjAdult").checked) { const m = "Ask a grown-up to be with you, then tick the box."; document.getElementById("pjMsg").textContent = m; speakSeq([m]); return; } projectStep(sk, p, 0); });
  on("#pjBack", () => skillPage(sk));
}
function projectStep(sk, p, i) {
  bar("exercise");
  const n = p.steps.length, line = `Step ${i + 1} of ${n}.`;
  render(`<section class="card" style="display:flex;flex-direction:column;gap:14px">
      <p class="eyebrow">${esc(p.title)} · step ${i + 1} of ${n}</p>
      <ol class="stepstrip" aria-label="Project steps">${p.steps.map((s, k) => `<li class="${k < i ? "done" : k === i ? "now" : ""}"${k === i ? ' aria-current="step"' : ""}><span class="sr">${k < i ? "Done: " : k === i ? "Now: " : "Next: "}</span>${k + 1}</li>`).join("")}</ol>
      <h1 class="as-h2">${esc(line)}</h1>
      <p class="lead">${esc(p.steps[i])}</p>
      <div class="row">${i > 0 ? `<button class="btn" id="psBack">Back a step</button>` : ""}<button class="btn primary" id="psNext" data-focus>${i < n - 1 ? "Done, next step" : "I have finished"}</button></div>
    </section>`);
  setSayLines([line, p.steps[i]]);
  on("#psBack", () => projectStep(sk, p, i - 1));
  on("#psNext", () => i < n - 1 ? projectStep(sk, p, i + 1) : projectHow(sk, p));
}
function projectHow(sk, p) {
  bar("exercise"); let how = null, best = null;
  const draw = () => {
    render(`<section class="card" style="display:flex;flex-direction:column;gap:14px">
        <p class="eyebrow">${esc(p.title)}</p><h1>How did it go?</h1>
        <div class="choices">${SKILL_HOW.map((h, k) => `<button class="choice" data-how="${k}" aria-pressed="${how === k}"><span class="lbl">${esc(h)}</span></button>`).join("")}</div>
        <h2>What was the best part?</h2>
        <div class="choices">${p.reflect.map((r, k) => `<button class="choice" data-best="${k}" aria-pressed="${best === k}"><span class="lbl">${esc(r)}</span></button>`).join("")}</div>
        <p class="note" id="phMsg" role="status"></p>
        <div class="row"><button class="btn primary" id="phDone">Save and get my badge</button></div>
      </section>`);
    on("[data-how]", e => { how = +e.currentTarget.dataset.how; draw(); });
    on("[data-best]", e => { best = +e.currentTarget.dataset.best; draw(); });
    on("#phDone", () => { if (how === null) { const m = "Choose how it went first."; document.getElementById("phMsg").textContent = m; speakSeq([m]); return; } projectBadge(sk, p, SKILL_HOW[how], best === null ? "" : p.reflect[best]); });
  };
  draw(); setSayLines(["How did it go?"].concat(SKILL_HOW, ["What was the best part?"], p.reflect));
}
function projectBadge(sk, p, how, best) {
  inGame = false; bar("child");
  S.badges = S.badges.filter(b => b.id !== p.id).concat({ id: p.id, skill: sk.name, badge: p.badge, icon: sk.icon, how, at: new Date() });
  S.obs.push({ id: p.id, skill: true, assisted: S.assisted, level: S.band, ex: p.title, cat: `Skills · ${sk.name}`, domain: sk.domain, items: [], reflection: best || "Not chosen", exampleOpened: false, extra: `Hands-on project, done away from the screen. The learner said: ${how}. Not observed by the app.`, at: new Date() });
  planDone("skill");
  const lines = [`Well done. You earned the ${p.badge} badge.`, "You can see it in your Support Passport."];
  render(`<section class="card" style="text-align:center;display:flex;flex-direction:column;gap:14px;align-items:center">
      <p class="eyebrow">${esc(sk.name)}</p>
      <div class="big-badge" aria-hidden="true">${sk.icon}</div>
      <h1>${esc(p.badge)}</h1>
      <p class="lead">${esc(lines[0])}</p><p class="muted">${esc(lines[1])}</p>
      <div class="row" style="justify-content:center"><button class="btn primary" id="pbMore" data-focus>More ${esc(sk.name)} projects</button><button class="btn" id="pbHome">Home</button></div>
    </section>`);
  setSayLines(lines);
  on("#pbMore", () => skillPage(sk)); on("#pbHome", home);
}
