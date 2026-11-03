"use strict";

// ---------- Specialist portal ----------
function specialistHome() {
  const me = PORTAL.me; if (!me || me.role !== "specialist") return welcome();
  stopSpeaking(); closeLayer(); bar("adult");
  const list = myLearners();
  render(`
      <section class="card">
        ${portalHead()}
        <h1>My learners</h1>
        ${concernListHtml(list)}
        ${list.length ? `<div class="grid">${list.map(learnerTile).join("")}</div>` : `<p class="muted">No learners yet. Ask a family for their share code, or add a learner your school has consent for.</p>`}
        <h2>Add a learner</h2>
        <div class="fields">
          <label for="spCode">Family's share code<input id="spCode" maxlength="7" autocomplete="off" autocapitalize="characters" placeholder="ABC-123" aria-describedby="spErr"></label>
        </div>
        <p class="field-error" id="spErr" role="alert"></p>
        <div class="row"><button class="btn primary" id="spAdd">${icon("🔑")}<span>Add with code</span></button><button class="btn" id="spSchool">${icon("🏫")}<span>Add a learner my school has consent for</span></button></div>
      </section>`);
  wirePortalHead();
  on("[data-learner]", e => specialistLearner(e.currentTarget.dataset.learner, "overview"));
  on("[data-concern-l]", e => specialistLearner(e.currentTarget.dataset.concernL, "overview"));
  const add = () => {
    const code = document.getElementById("spCode").value.trim().toUpperCase().replace(/[^A-Z0-9]/g, "").replace(/^(.{3})(.+)$/, "$1-$2");
    const L = PORTAL.learners.find(x => x.shareCode && x.shareCode === code && x.consent.share && (x.shareCodeExp || 0) > Date.now());
    if (!L) { document.getElementById("spErr").textContent = "That code isn't valid. Check it with the family; codes work once and last 7 days."; return; }
    if (!L.specialists.includes(me.id)) L.specialists.push(me.id);
    L.shareCode = null; // each code works once
    specialistLearner(L.id, "overview"); flash(`${L.nickname} has been added. Their family can stop sharing at any time.`);
  };
  on("#spAdd", add);
  document.getElementById("spCode").addEventListener("keydown", e => { if (e.key === "Enter") add(); });
  on("#spSchool", schoolLearnerForm);
}
// Schools often hold signed consent forms themselves; the specialist confirms this before adding the learner.
function schoolLearnerForm() {
  const me = PORTAL.me; bar("adult");
  render(`
      <section class="card setup">
        ${portalHead()}
        <p class="eyebrow">Add a learner</p>
        <h1>Learner your school has consent for</h1>
        <div class="err-summary" id="errSum" role="alert"></div>
        <div class="fields">
          ${field("slNick", "Nickname or learner code", `<input id="slNick" maxlength="24" autocomplete="off">`, "Never a full name.")}
          ${field("slCohort", "Age group", `<select id="slCohort">${options(Object.entries(COHORTS), "7-12")}</select>`)}
          ${field("slCurr", "Curriculum", `<select id="slCurr">${options(CURRICULA, "D-CAPS")}</select>`)}
          ${field("slLevel", "Grade or learning level (optional)", `<input id="slLevel" maxlength="40">`)}
        </div>
        <label class="consent" for="slConsent"><input type="checkbox" id="slConsent"><span>${esc(me.org)} holds signed consent from this learner's parent or guardian to use Thinking Lab, or the learner is 18 or older and has agreed. <span class="req">(required)</span><span class="field-error" data-for="slConsent"></span></span></label>
        <div class="row"><button class="btn primary" id="slSave" data-focus>Add learner</button><button class="btn quiet" id="slBack">Cancel</button></div>
      </section>`);
  wirePortalHead();
  on("#slBack", specialistHome);
  on("#slSave", () => {
    const v = id => document.getElementById(id).value;
    const nick = cleanAvatarName(v("slNick")).trim(), errs = {};
    if (!nick) errs.slNick = "Enter a nickname or learner code.";
    if (!document.getElementById("slConsent").checked) errs.slConsent = "Confirm that consent is held before adding the learner.";
    if (!showErrors(errs)) return;
    const L = { id: newId("lrn"), nickname: nick, cohort: v("slCohort"), curriculum: v("slCurr"), level: v("slLevel").trim(), band: "younger", answer: "choose", supports: "", supportNeeds: "", rows: [], goals: [], notes: [], specialists: [me.id], guardianId: null, shareCode: null,
      consent: { guardian: true, support: false, share: true, date: todayIso(), law: lawFor(me.country), schoolHeld: true } };
    PORTAL.learners.push(L); specialistLearner(L.id, "overview");
  });
}

function specialistLearner(id, tab) {
  const me = PORTAL.me, L = portalLearner(id);
  if (!canSee(me, L) || me.role !== "specialist") return specialistHome();
  bar("adult");
  const rows = L.rows.filter(r => exById(r[1])), ss = strengths({ code: L.nickname, rows });
  let body = "";
  if (tab === "overview") {
    const dc = d => rows.filter(r => exById(r[1]).domain === d).length, max = Math.max(1, ...REPORT_DOMAINS.map(dc));
    body = `
        <h2>Strengths and preferences</h2>
        <p class="note">Observations of activities, not a diagnosis or proof of mastery. Each one shows its evidence.</p>
        <div class="obs">${ss.map(s => `<div class="obs-item"><span class="status lvl-${s.level.toLowerCase()}">${s.level}</span> <b>${esc(s.label)}</b><div class="note">Evidence: ${esc(s.evidence)}.${s.level === "Early" ? "" : ` Suggestion: ${esc(s.suggestion)}.`}</div></div>`).join("") || '<p class="muted">No observations yet. Start a session to begin.</p>'}</div>
        <h2>Activities each week</h2>
        ${progressChart(L)}
        <h2>Activities by thinking domain</h2>
        <div class="dombars">${REPORT_DOMAINS.map(d => `<div class="dombar"><span>${esc(d)}</span><span class="track"><span class="fill" style="width:${dc(d) / max * 100}%"></span></span><span>${dc(d)}</span></div>`).join("")}</div>
        ${rows.length ? `<h2>Recent sessions</h2><div class="tablewrap" tabindex="0" role="region" aria-label="Recent sessions"><table class="hist"><thead><tr><th scope="col">Date</th><th scope="col">Activity</th><th scope="col">Observed</th><th scope="col">Hints</th></tr></thead>
          <tbody>${rows.slice(-6).reverse().map(r => `<tr><td>${niceDate(r[0])}</td><td>${esc(exById(r[1]).name)}</td><td><span class="status st-${r[2]}">${STATUS_TEXT[r[2]]}</span></td><td>${r[4]}</td></tr>`).join("")}</tbody></table></div>` : ""}
        <div class="row"><button class="btn" id="slStart">${icon("▶️")}<span>Start a session on this device as ${esc(L.nickname)}</span></button></div>`;
  } else if (tab === "goals") {
    body = `
        <p class="note">Goals from the learner's Individual Support Plan (ISP). Families can see goals and their status.</p>
        ${L.goals.length ? `<ul class="goal-list">${L.goals.map(g => `<li class="goal-item"><div><b>${esc(g.text)}</b><div class="note">${esc(g.area)}${g.target ? ` · target ${fullDate(g.target)}` : ""}</div></div>
            <label class="sr" for="gs-${esc(g.id)}">Status of: ${esc(g.text)}</label><select id="gs-${esc(g.id)}" data-gstatus="${esc(g.id)}">${options(Object.entries(GOAL_STATUS), g.status)}</select>
            <button class="btn small quiet" data-gdel="${esc(g.id)}">Remove</button></li>`).join("")}</ul>` : `<p class="muted">No goals yet.</p>`}
        <h2>Add a goal</h2>
        <div class="err-summary" id="errSum" role="alert"></div>
        <div class="fields">
          ${field("gText", "Goal", `<input id="gText" maxlength="140">`, "Small and observable, for example: follows a 3-step plan without reminders.")}
          ${field("gArea", "Area", `<select id="gArea">${options([...REPORT_DOMAINS, "Communication", "Personal care and daily living", "Social and emotional", "Mathematics", "Language and literacy", "Life skills", "Occupational skills"], REPORT_DOMAINS[0])}</select>`)}
          ${field("gTarget", "Target date (optional)", `<input id="gTarget" type="date">`)}
        </div>
        <div class="row"><button class="btn primary" id="gAdd">${icon("➕")}<span>Add goal</span></button></div>`;
  } else if (tab === "notes") {
    const visible = L.notes.slice().reverse();
    body = `
        <label for="nText" style="display:flex;flex-direction:column;gap:6px;font-family:var(--font-display)">New note<textarea id="nText" rows="4" maxlength="1000"></textarea></label>
        <label class="row" for="nShare" style="flex-direction:row"><input type="checkbox" id="nShare"> Share this note with the family</label>
        <div class="row"><button class="btn primary" id="nAdd">${icon("📝")}<span>Save note</span></button></div>
        <p class="note">Write facts and observations. Don't record anything you wouldn't want the family to read: they can ask to see everything held about their child.</p>
        ${visible.map(n => `<div class="obs-item"><b>${esc(n.by)}</b> · ${niceDate(n.date)} · ${n.shareFamily ? "shared with family" : "specialists only"}<div>${esc(n.text)}</div></div>`).join("") || '<p class="muted">No notes yet.</p>'}`;
  } else if (tab === "profile") {
    body = `
        <table class="hist"><tbody>
          <tr><th scope="row">Age group</th><td>${esc(COHORTS[L.cohort])}</td></tr>
          <tr><th scope="row">Curriculum</th><td>${esc((CURRICULA.find(c => c[0] === L.curriculum) || [, L.curriculum])[1])}${L.level ? ", " + esc(L.level) : ""}</td></tr>
          <tr><th scope="row">What helps</th><td>${esc(L.supports || "Not added")}</td></tr>
          <tr><th scope="row">Screen and sound</th><td>${esc(describePrefs(L) || "Standard settings")}</td></tr>
          <tr><th scope="row">Support needs</th><td>${L.consent.support ? esc(L.supportNeeds || "Not added") : "Not shared: the guardian hasn't agreed to record support needs."}</td></tr>
          <tr><th scope="row">Consent</th><td>${L.consent.schoolHeld ? "Held by the school" : "Given by the guardian in the portal"} on ${fullDate(L.consent.date)}, under ${esc(L.consent.law)}</td></tr>
        </tbody></table>
        <h2>Learning level</h2>
        <div class="fields">
          ${field("prCurr", "Curriculum", `<select id="prCurr">${options(CURRICULA, L.curriculum)}</select>`)}
          ${field("prLevel", "Grade or learning level", `<input id="prLevel" value="${esc(L.level || "")}" maxlength="40">`, "Set per learner. It can differ from their age.")}
        </div>
        <div class="row"><button class="btn" id="prSave">Save</button></div>`;
  }
  render(`
      <section class="card">
        ${portalHead()}
        <p class="eyebrow">Learner</p>
        <h1>${esc(L.nickname)}</h1>
        <p class="note">${esc(COHORTS[L.cohort])} · ${esc([L.curriculum, L.level].filter(Boolean).join(", "))}</p>
        ${concernPanelHtml(L)}
        ${tabsHtml([["overview", "Overview"], ["goals", "Support goals"], ["notes", "Notes"], ["profile", "Profile"], ["report", "Report"]], tab)}
        <div role="tabpanel" aria-labelledby="tab-${tab}" class="tabpanel">${body}</div>
      </section>`);
  wirePortalHead();
  on("[data-tab]", e => { const t = e.currentTarget.dataset.tab; if (t === "report") reportScreen(L, me, () => specialistLearner(id, "overview")); else specialistLearner(id, t); });
  on("#slStart", () => startPortalSession(L));
  $main.querySelectorAll("[data-cdone]").forEach(b => b.addEventListener("click", () => {
    const c = (L.concerns || []).find(x => x.id === b.dataset.cdone), note = document.getElementById("ca-" + c.id).value.trim();
    if (!note) { document.getElementById("ca-" + c.id).focus(); return; }
    Object.assign(c, { status: "followed", action: note, by: me.name, closed: todayIso() }); specialistLearner(id, tab); flash("Recorded as followed up.");
  }));
  $main.querySelectorAll("[data-gstatus]").forEach(s => s.addEventListener("change", () => { const g = L.goals.find(x => x.id === s.dataset.gstatus); g.status = s.value; }));
  on("[data-gdel]", e => { L.goals = L.goals.filter(g => g.id !== e.currentTarget.dataset.gdel); specialistLearner(id, "goals"); });
  on("#gAdd", () => {
    const text = document.getElementById("gText").value.trim();
    if (!showErrors(text ? {} : { gText: "Write the goal first." })) return;
    L.goals.push({ id: newId("g"), text, area: document.getElementById("gArea").value, status: "todo", target: document.getElementById("gTarget").value || "" });
    specialistLearner(id, "goals"); flash("Goal added.");
  });
  on("#nAdd", () => {
    const text = document.getElementById("nText").value.trim(); if (!text) { document.getElementById("nText").focus(); return; }
    L.notes.push({ date: todayIso(), by: me.name, byId: me.id, text, shareFamily: document.getElementById("nShare").checked });
    specialistLearner(id, "notes"); flash("Note saved.");
  });
  on("#prSave", () => { L.curriculum = document.getElementById("prCurr").value; L.level = document.getElementById("prLevel").value.trim(); specialistLearner(id, "profile"); flash("Saved."); });
}

// ---------- Safeguarding concerns: only the designated safeguarding lead sees them, never in reports ----------
const isDsl = () => !!(PORTAL.me && PORTAL.me.role === "specialist" && PORTAL.me.consents.dsl);
function openConcerns(L) { return (L.concerns || []).filter(c => c.status === "open"); }
function concernListHtml(list) {
  if (!isDsl()) return "";
  const open = list.filter(L => openConcerns(L).length);
  if (!open.length) return "";
  return `<div class="safety-alert" role="alert"><h2>${icon("🛟")} Safeguarding concerns to follow up</h2>
      <ul class="plain">${open.map(L => `<li><button class="btn small" data-concern-l="${esc(L.id)}">${esc(L.nickname)}: ${openConcerns(L).length} open</button></li>`).join("")}</ul></div>`;
}
function concernPanelHtml(L) {
  if (!isDsl() || !(L.concerns || []).length) return "";
  return `<div class="safety-alert"><h2>${icon("🛟")} Safeguarding</h2>
      <p class="note">You see this because you are a designated safeguarding lead. It is not shared with the family and never appears in reports.</p>
      ${L.concerns.slice().reverse().map(c => `<div class="obs-item"><b>${fullDate(c.date)}, ${esc(c.time)}</b>: the learner said they feel unsafe (from the ${esc(c.where)}).
        ${c.status === "open" ? `<label for="ca-${esc(c.id)}" style="display:flex;flex-direction:column;gap:6px;margin-top:8px">What did you do?<textarea id="ca-${esc(c.id)}" rows="2" maxlength="600"></textarea></label>
          <div class="row"><button class="btn small primary" data-cdone="${esc(c.id)}">Record as followed up</button></div>`
          : `<div class="note">Followed up by ${esc(c.by)} on ${fullDate(c.closed)}: ${esc(c.action)}</div>`}</div>`).join("")}</div>`;
}
