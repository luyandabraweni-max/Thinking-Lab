"use strict";

// ---------- Home page (hub) ----------
function home() {
  S.inExercise = false; activeEx = null; inGame = false; activeUnit = null;
  if (!S.need) S.need = "start";
  trail.length = 0; mark("home", home); bar("child");
  if (!S.welcome) S.welcome = WELCOME[Math.floor(Math.random() * WELCOME.length)];
  const firstVisit = !S.played.length && !S.learned.length;
  const next = nextUnit(), nextLab = EXERCISES.find(x => x.ready && !S.played.includes(x.id));
  const who = S.avatar ? `${S.avatar.name}` : "";
  const hubLines = [firstVisit ? S.welcome : null, who ? `Hello, ${who}.` : null, "What would you like to do? You can learn, build a skill, visit the Thinking Lab, or change your character."].filter(Boolean);
  const text = hubLines.join(" ");
  currentReturnSay = currentSay = text;
  render(`
      <section class="hub">
        <div class="hub-hello card">
          <button class="av-mini" id="hAvatar" aria-label="${S.avatar ? "Change your character" : "Make your character"}">${avatarSvg(S.avatar, 96, S.avatar ? `${S.avatar.name}, your character` : "Make your character")}</button>
          <div style="flex:1;min-width:0">
            <p class="eyebrow">2to.iQ Thinking Lab</p>
            ${firstVisit ? `<p class="lead">${esc(S.welcome)}</p>` : ""}
            <h1>${who ? `Hello, ${esc(who)}` : "Hello"}</h1>
            ${S.avatar ? "" : `<p class="muted">${W("Start by making your own character.", "You can start by designing your character.")}</p>`}
          </div>
        </div>
        <div class="card">
          <h2>Today's route</h2>
          <p class="muted">A suggestion. You can choose anything you like.</p>
          <div class="route">
            ${next ? `<button class="tile" data-route="unit:${next.id}"><span class="pill">${esc(next.subject)} · ${gradeName(next.grade)}</span><span class="t-name">${esc(next.title)}</span><span class="t-cat">Learn</span></button>` : ""}
            ${nextLab ? `<button class="tile" data-route="lab:${nextLab.id}"><span class="pill">Thinking Lab</span><span class="t-name">${esc(nextLab.name)}</span><span class="t-cat">${esc(nextLab.cat)}</span></button>` : ""}
          </div>
        </div>
        <div class="card"><h2>My plan today</h2>${planHtml()}</div>
        <div class="grid">
          <button class="tile" id="hLearn"><span class="pill">${S.learned.length} done</span><span class="t-name">Learn</span><span class="t-cat">${esc([...new Set(myUnits().map(u => u.subject))].slice(0, 4).join(", "))}</span><span class="t-dom">${esc([...new Set(myUnits().map(u => u.grade))].sort((a, b) => a - b).map(gradeName).join(", "))}</span></button>
          <button class="tile" id="hSkills"><span class="pill">${S.badges.length} badge${S.badges.length === 1 ? "" : "s"}</span><span class="t-name">Skills</span><span class="t-cat">Hands-on projects: cooking, coding, business, sport and more</span><span class="t-dom">${esc(SKILL_LEVELS[S.cohort] || "")}</span></button>
          <button class="tile" id="hLab"><span class="pill">${S.played.length} done</span><span class="t-name">Thinking Lab</span><span class="t-cat">${EXERCISES.length} thinking ${gamesWord()}</span><span class="t-dom">All four domains</span></button>
          <button class="tile" id="hMine"><span class="pill">${S.avatar ? "Change" : "New"}</span><span class="t-name">My character</span><span class="t-cat">${W("Make it look how you like", "Design how you look here")}</span></button>
          <button class="tile" id="hWork"><span class="pill">${S.obs.length}</span><span class="t-name">My work</span><span class="t-cat">What I have done today</span></button>
          <button class="tile" id="hPass"><span class="pill">${S.passport ? "Change" : "New"}</span><span class="t-name">My Support Passport</span><span class="t-cat">What helps me learn</span></button>
        </div>
        <div class="row"><button class="btn" id="hDone">I'm finished for today</button></div>
      </section>`);
  setSayLines(hubLines);
  on("#hAvatar", () => avatarBuilder()); on("#hMine", () => avatarBuilder());
  on("#hLearn", () => needsBattery() ? batteryCheck(learnHome) : learnHome()); on("#hLab", () => needsBattery() ? batteryCheck(labHome) : labHome()); on("#hSkills", () => needsBattery() ? batteryCheck(skillsHome) : skillsHome()); on("#hWork", myWork); on("#hPass", passportStart); wirePlan();
  on("#hDone", goodbye);
  on("[data-route]", e => { const [k, id] = e.currentTarget.dataset.route.split(":"); if (k === "unit") unitIntro(UNITS.find(u => u.id === id)); else startExercise(EXERCISES.find(x => x.id === id)); });
}
function myWork() {
  mark("work", myWork); bar("child");
  const text = "My work. Here is what you have done today.";
  currentReturnSay = currentSay = text;
  const rows = S.obs.map(o => `<li><b>${esc(o.ex)}</b> · ${esc(o.cat)}${o.reflection ? ` · I said: ${esc(o.reflection)}` : ""}${o.feedback ? `<br><span class="muted">${esc(o.feedback)}</span>` : ""}</li>`).join("");
  render(`<section class="card"><p class="eyebrow">My work</p><h1>What I did today</h1>
      ${rows ? `<ul class="plain">${rows}</ul>` : `<p class="muted">Nothing yet. Everything you do today will show here.</p>`}
      <p class="note">This list is only for today. It is cleared when the session ends.</p>
      <div class="row"><button class="btn primary" id="wHome" data-focus>Back to home</button></div></section>`);
  setSay(text);
  on("#wHome", home);
}
