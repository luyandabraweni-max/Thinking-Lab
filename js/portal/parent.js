"use strict";

// ---------- Parent portal ----------
function learnerTile(L) {
  const dates = [...new Set(L.rows.map(r => r[0]))].sort(), st = strengths({ code: L.nickname, rows: L.rows.filter(r => exById(r[1])) })[0];
  return `<button class="tile" data-learner="${esc(L.id)}"><span class="tile-top"><span class="pill">${esc(COHORTS[L.cohort])}</span>${L.avatar ? avatarSvg(L.avatar, 48, "", { decorative: true }) : ""}</span><span class="t-name">${esc(L.nickname)}</span>
      <span class="t-cat">${esc([L.curriculum, L.level].filter(Boolean).join(" · "))}</span>
      <span class="t-cat">${dates.length ? `${dates.length} session${dates.length > 1 ? "s" : ""} · last on ${niceDate(dates[dates.length - 1])}` : "No sessions yet"}</span>
      ${st ? `<span class="t-dom">${st.level}: ${esc(st.label)}</span>` : ""}</button>`;
}
function parentHome() {
  const me = PORTAL.me; if (!me || me.role !== "parent") return welcome();
  stopSpeaking(); closeLayer(); bar("adult");
  const kids = myLearners();
  render(`
      <section class="card">
        ${portalHead()}
        <h1>My children</h1>
        ${kids.length ? `<div class="grid">${kids.map(learnerTile).join("")}</div>` : `<p class="muted">You haven't added a child yet.</p>`}
        <div class="row"><button class="btn primary" id="pAdd">${icon("➕")}<span>Add a child</span></button></div>
        <p class="note">Each child's page shows their progress, the supports that help them, who you share with, and reports to download.</p>
      </section>`);
  wirePortalHead();
  on("[data-learner]", e => parentChild(e.currentTarget.dataset.learner, "progress"));
  on("#pAdd", () => childForm(null, c => c ? parentChild(c.id, "progress") : parentHome()));
}
function tabsHtml(tabs, tab) { return `<div class="row" role="tablist" aria-label="Views">${tabs.map(([k, l]) => `<button class="btn small" role="tab" id="tab-${k}" aria-selected="${tab === k}" data-tab="${k}">${l}</button>`).join("")}</div>`; }

function parentChild(id, tab) {
  const me = PORTAL.me, L = portalLearner(id);
  if (!canSee(me, L) || me.role !== "parent") return parentHome();
  bar("adult");
  const rep = buildReport(L, "family", me, {});
  const sec = h => rep.sections.find(s => s.heading === h);
  let body = "";
  if (tab === "progress") {
    const well = sec("What went well"), explored = rep.sections.find(s => s.heading.startsWith("What ") && s.heading.endsWith("explored")), idea = sec("One idea for home");
    const goals = L.goals || [], notes = (L.notes || []).filter(n => n.shareFamily);
    body = `
        <p>${esc(rep.sections[0].paras[0])}</p>
        <h2>What went well</h2>
        ${well.bullets.length ? `<ul class="plain">${well.bullets.map(b => `<li>${esc(b)}</li>`).join("")}</ul>` : `<p class="muted">${esc(well.paras[0])}</p>`}
        ${explored && explored.bullets.length ? `<h2>What ${esc(L.nickname)} explored</h2><ul class="plain">${explored.bullets.map(b => `<li>${esc(b)}</li>`).join("")}</ul>` : ""}
        ${idea ? `<h2>One idea for home</h2><p>${esc(idea.paras[0])}</p>` : ""}
        ${goals.length ? `<h2>Support goals set by specialists</h2><ul class="goal-list">${goals.map(g => `<li><span class="status st-${g.status === "done" ? "alone" : g.status === "doing" ? "support" : "notyet"}">${GOAL_STATUS[g.status]}</span> ${esc(g.text)}</li>`).join("")}</ul>` : ""}
        ${notes.length ? `<h2>Notes from specialists</h2>${notes.map(n => `<div class="obs-item"><b>${esc(n.by)}</b> · ${niceDate(n.date)}<div>${esc(n.text)}</div></div>`).join("")}` : ""}
        <p class="note">This describes activities, not ability. It is not a diagnosis or an assessment.</p>
        <div class="row"><button class="btn" id="pcStart">${icon("▶️")}<span>Start a session on this device as ${esc(L.nickname)}</span></button></div>`;
  } else if (tab === "support") {
    body = `
        <table class="hist"><tbody>
          <tr><th scope="row">Age group</th><td>${esc(COHORTS[L.cohort])}</td></tr>
          <tr><th scope="row">Curriculum</th><td>${esc((CURRICULA.find(c => c[0] === L.curriculum) || [, L.curriculum])[1])}${L.level ? ", " + esc(L.level) : ""}</td></tr>
          <tr><th scope="row">Answers by</th><td>${L.answer === "build" ? "Building step by step" : "Choosing from pictures"} · ${esc(LEVEL[L.band])}</td></tr>
          <tr><th scope="row">What helps</th><td>${esc(L.supports || "Not added yet")}</td></tr>
          ${L.consent.support ? `<tr><th scope="row">Support needs</th><td>${esc(L.supportNeeds || "Not added")}</td></tr>` : ""}
        </tbody></table>
        ${L.consent.support ? "" : `<p class="note">Support needs aren't recorded, because you haven't agreed to it. You can change this in My account.</p>`}
        <div class="row"><button class="btn" id="pcEdit">${icon("✏️")}<span>Edit details</span></button><button class="btn" id="pcAvatar">${icon("🧑‍🎨")}<span>${L.avatar ? "Change" : "Make"} ${esc(L.nickname)}'s character</span></button></div>
        <h2>Screen and sound</h2>
        <p class="note">These start every session on this child's profile. ${esc(L.nickname)} can still change them in My way during a session, and their changes are kept.</p>
        <div class="consents">${PREF_TOGGLES.map(([k, t]) => `<label class="consent" for="pf-${k}"><input type="checkbox" id="pf-${k}"${prefOn(L, k) ? " checked" : ""}><span>${esc(t)}</span></label>`).join("")}</div>
        <div class="row"><button class="btn" id="pcPrefs">Save screen and sound</button></div>`;
  } else if (tab === "sharing") {
    const specs = L.specialists.map(sid => PORTAL.accounts.find(a => a.id === sid)).filter(Boolean);
    body = `
        <h2>Specialists who can see ${esc(L.nickname)}</h2>
        ${specs.length ? `<ul class="goal-list">${specs.map(s => `<li><b>${esc(s.name)}</b> · ${esc(s.profession)}, ${esc(s.org)} <button class="btn small" data-unshare="${esc(s.id)}">Stop sharing</button></li>`).join("")}</ul>` : `<p class="muted">Nobody yet.</p>`}
        <h2>Share with a teacher or therapist</h2>
        ${L.consent.share ? `<p>Give them this code. They enter it in their specialist portal to see ${esc(L.nickname)}'s progress${L.consent.support ? " and support needs" : ""}. Each code works once and lasts 7 days.</p>
          ${L.shareCode ? `<p class="share-code" aria-label="Share code ${esc(L.shareCode.split("").join(" "))}">${esc(L.shareCode)}</p>` : ""}
          <div class="row"><button class="btn" id="pcCode">${icon("🔑")}<span>${L.shareCode ? "Make a new code" : "Make a share code"}</span></button></div>`
          : `<p class="note">Sharing is turned off for your account. You can turn it on in My account.</p>`}
        <h2>Consent</h2>
        <table class="hist"><tbody>
          <tr><th scope="row">Guardian consent</th><td>Given on ${fullDate(L.consent.date)} under ${esc(L.consent.law)}</td></tr>
          <tr><th scope="row">Support needs recorded</th><td>${L.consent.support ? "Yes" : "No"}</td></tr>
          <tr><th scope="row">Sharing with specialists</th><td>${L.consent.share ? "Allowed, with the people you choose" : "Off"}</td></tr></tbody></table>
        <div class="row"><button class="btn" id="pcDelete">${icon("🗑️")}<span>Delete ${esc(L.nickname)}'s profile</span></button></div>`;
  }
  render(`
      <section class="card">
        ${portalHead()}
        <div class="child-head">${L.avatar ? avatarStage(L.avatar, 96, `Wave hello, ${L.avatar.name}`) : ""}<div><p class="eyebrow">My child</p><h1>${esc(L.nickname)}</h1>${describePrefs(L) ? `<p class="note">Settings: ${esc(describePrefs(L))}</p>` : ""}</div></div>
        ${tabsHtml([["progress", "Progress"], ["support", "Support"], ["sharing", "Sharing and consent"], ["report", "Report"]], tab)}
        <div role="tabpanel" aria-labelledby="tab-${tab}" class="tabpanel">${body}</div>
      </section>`);
  wirePortalHead();
  on("[data-tab]", e => { const t = e.currentTarget.dataset.tab; if (t === "report") reportScreen(L, me, () => parentChild(id, "progress")); else parentChild(id, t); });
  on("#pcStart", () => startPortalSession(L));
  const head = $main.querySelector(".child-head"); if (L.avatar && head) { wireAvatarStage(head); on(".av-tap", () => avatarSayHello(head, L.avatar)); }
  on("#pcAvatar", () => { const keep = S.avatar; S.avatar = L.avatar ? Object.assign({}, L.avatar) : null; S.portalLearner = null;
    avatarBuilder(() => { L.avatar = Object.assign({}, S.avatar); S.avatar = keep; S.avWaveNext = false; parentChild(id, "progress"); flash(`${L.nickname}'s character is saved. Tap it to say hello.`); }); });
  on("#pcPrefs", () => { PREF_TOGGLES.forEach(([k]) => setPref(L, k, document.getElementById("pf-" + k).checked)); parentChild(id, "support"); flash("Saved. These settings start every session."); });
  on("#pcEdit", () => childForm(L, () => parentChild(id, "support")));
  on("#pcCode", () => { L.shareCode = makeShareCode(); L.shareCodeExp = Date.now() + 7 * 864e5; parentChild(id, "sharing"); });
  on("[data-unshare]", e => { L.specialists = L.specialists.filter(s => s !== e.currentTarget.dataset.unshare); parentChild(id, "sharing"); flash("Sharing stopped. They can no longer see this child."); });
  on("#pcDelete", () => {
    overlay(`<div class="card"><h2>Delete ${esc(L.nickname)}'s profile?</h2><p>Their progress, goals, notes and reports will be deleted, and specialists will lose access. This can't be undone.</p>
        <div class="row"><button class="btn" id="dNo" data-focus>Keep it</button><button class="btn primary" id="dYes">Delete</button></div></div>`);
    document.getElementById("dNo").onclick = closeLayer;
    document.getElementById("dYes").onclick = () => { closeLayer(); PORTAL.learners = PORTAL.learners.filter(x => x !== L); parentHome(); flash("The profile has been deleted."); };
  });
}
// Easy to read aloud: no 0/O or 1/I.
function makeShareCode() { const a = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; let c = ""; for (let i = 0; i < 6; i++) c += a[Math.floor(Math.random() * a.length)]; return c.slice(0, 3) + "-" + c.slice(3); }

// Screen and sound settings a parent can set for every session (stored on the learner, like My way).
const PREF_TOGGLES = [["grey", "Greyscale (no colours)"], ["calm", "Calm screen"], ["plain", "Plain words"], ["autoRead", "Read every screen aloud"], ["quiet", "Sound off"], ["motion", "No movement"], ["contrast", "Stronger outlines"], ["large", "Larger text"]];
const MY_PREFS = ["grey", "calm", "plain"];
function prefOn(L, k) { const m = L.my || {}, d = L.display || {}; return k === "large" ? d.textSize > 1 : MY_PREFS.includes(k) ? !!m[k] : !!d[k]; }
function setPref(L, k, on) {
  L.my = Object.assign(JSON.parse(JSON.stringify(MY_DEFAULTS)), L.my || {}); L.display = L.display || {};
  if (k === "large") L.display.textSize = on ? 1.15 : 1;
  else if (MY_PREFS.includes(k)) L.my[k] = on;
  else L.display[k] = on;
  if (k === "autoRead") L.my.how = on ? "listen" : L.my.how === "listen" ? "read" : L.my.how;
}
