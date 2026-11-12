"use strict";

// ---------- Working together: family, specialists and the learner ----------
// Shared by the parent and specialist portals: messages, goal observations, development over time, health and
// medication, supports, the next-session plan, and the specialists' review of the adaptation rules.
// Safeguarding: there is no private channel to a child. Every message to a learner is visible to their family.
// Health information is special personal information (POPIA section 26): only the family enters it, and specialists
// see it only when the family turns on sharing. It never appears in reports or to school admins.
const nowIso = () => new Date().toISOString();
const ROLE_LABEL = { parent: "Family", specialist: "Specialist", learner: "Learner" };
const LEVEL_TEXT = { notyet: "Not yet", support: "With support", alone: "On their own" };
const LEVEL_MARK = { notyet: "○", support: "◐", alone: "●" };
function teamLog(L, text) { (L.adaptLog = L.adaptLog || []).push({ date: todayIsoDate(), text, by: (PORTAL.me || {}).name || "an adult" }); }

// ----- Messages -----
const msgs = L => L.messages = L.messages || [];
const unreadFor = (L, acc) => msgs(L).filter(m => m.fromId !== acc.id && !(m.readBy || []).includes(acc.id)).length;
function messagesHtml(L, me) {
  const list = msgs(L), name = esc(L.nickname);
  return `<h2>Messages about ${name}</h2>
      <p class="note">Everyone on ${name}'s team reads this: the family and the specialists they share with. Messages to ${name} appear at the start of their next session, and the family can always read them.</p>
      ${list.length ? `<ol class="msgs">${list.map(m => `<li class="msg ${m.fromId === me.id ? "mine" : ""} from-${m.fromRole}">
          <p class="msg-who"><b>${esc(m.fromName)}</b> <span class="muted">· ${ROLE_LABEL[m.fromRole]}${m.to === "learner" ? ` · to ${name}` : ""} · ${niceDate(m.date.slice(0, 10))}</span></p>
          <p class="msg-text">${m.sticker ? `<span class="em" aria-hidden="true">${m.sticker}</span> ` : ""}${esc(m.text)}</p></li>`).join("")}</ol>` : `<p class="muted">No messages yet.</p>`}
      <div class="fields"><label for="msgText" class="sw-type">New message<textarea id="msgText" rows="3" maxlength="800"></textarea></label></div>
      <fieldset class="msg-to"><legend>Send to</legend>
        <label class="consent" for="msgTeam"><input type="radio" name="msgTo" id="msgTeam" value="team" checked><span>The team (${me.role === "parent" ? "specialists" : "the family and other specialists"})</span></label>
        <label class="consent" for="msgKid"><input type="radio" name="msgTo" id="msgKid" value="learner"><span>${name}, at their next session</span></label></fieldset>
      <div class="row"><button class="btn primary" id="msgSend">${icon("✉️")}<span>Send</span></button></div>
      <p class="note">Write as you would in a school communication book. Don't use messages for urgent safety concerns: use the safeguarding steps instead.</p>`;
}
function wireMessages(L, me, redraw) {
  msgs(L).forEach(m => { m.readBy = m.readBy || []; if (!m.readBy.includes(me.id)) m.readBy.push(me.id); });
  on("#msgSend", () => {
    const t = document.getElementById("msgText"), text = t.value.trim(); if (!text) { t.focus(); return; }
    const to = document.getElementById("msgKid").checked ? "learner" : "team";
    msgs(L).push({ id: newId("m"), date: nowIso(), fromId: me.id, fromName: me.name, fromRole: me.role, to, text, readBy: [me.id] });
    savePortal(); redraw(); flash(to === "learner" ? `Sent. ${L.nickname} will see it at their next session.` : "Sent to the team.");
  });
}
// The learner's side: messages waiting for them, shown on their home screen, with quick replies.
const LEARNER_REPLIES = [["👍", "Thank you!"], ["😊", "I'll try"], ["❤️", "That made me happy"], ["🙋", "I have a question"]];
function learnerInbox() { const L = S.portalLearner && portalLearner(S.portalLearner); return L ? msgs(L).filter(m => m.to === "learner" && !(m.readBy || []).includes("learner")) : []; }
function inboxHtml() {
  const box = learnerInbox(); if (!box.length) return "";
  return `<div class="card inbox"><h2>${icon("✉️")} ${box.length > 1 ? "Messages" : "A message"} for you</h2>
      ${box.map(m => `<div class="obs-item"><b>${esc(m.fromName)}</b> <span class="muted">(${m.fromRole === "parent" ? "your family" : "your teacher"})</span><p>${esc(m.text)}</p>
        <div class="row">${LEARNER_REPLIES.map(([e, t], i) => `<button class="btn small" data-reply="${esc(m.id)}:${i}">${icon(e)}<span>${esc(t)}</span></button>`).join("")}
        <button class="btn small" data-read="${esc(m.id)}">${speakerIcon}<span>Read it to me</span></button></div></div>`).join("")}</div>`;
}
function wireInbox(redraw) {
  const L = S.portalLearner && portalLearner(S.portalLearner); if (!L) return;
  on("[data-read]", e => { const m = msgs(L).find(x => x.id === e.currentTarget.dataset.read); if (m) speakNow(`A message from ${m.fromName}. ${m.text}`); });
  on("[data-reply]", e => {
    const [id, k] = e.currentTarget.dataset.reply.split(":"), m = msgs(L).find(x => x.id === id), [sticker, text] = LEARNER_REPLIES[+k];
    m.readBy = (m.readBy || []).concat("learner");
    msgs(L).push({ id: newId("m"), date: nowIso(), fromId: "learner", fromName: L.nickname, fromRole: "learner", to: "team", text, sticker, readBy: ["learner"] });
    logVoice("message reply", text); savePortal(); redraw(); speakNow("Sent. " + text);
  });
}

// ----- Goals: observations against the Individual Support Plan -----
function goalObsHtml(g, editable) {
  const obs = g.obs || [];
  return `<div class="goal-obs">${obs.length ? `<span class="goal-marks" role="img" aria-label="Observations: ${obs.map(o => `${niceDate(o.date)} ${LEVEL_TEXT[o.level]}`).join(", ")}">${obs.map(o => `<span class="gm gm-${o.level}" aria-hidden="true">${LEVEL_MARK[o.level]}</span>`).join("")}</span>
      <span class="note">Latest, ${niceDate(obs[obs.length - 1].date)}: ${LEVEL_TEXT[obs[obs.length - 1].level]}${obs[obs.length - 1].text ? `: ${esc(obs[obs.length - 1].text)}` : ""}</span>` : `<span class="note">No observations yet.</span>`}</div>
    ${editable ? `<details class="goal-add"><summary>Add an observation</summary>
      <fieldset><legend>How did it go?</legend>${Object.entries(LEVEL_TEXT).map(([k, t]) => `<label class="consent" for="go-${esc(g.id)}-${k}"><input type="radio" name="go-${esc(g.id)}" id="go-${esc(g.id)}-${k}" value="${k}"${k === "support" ? " checked" : ""}><span>${LEVEL_MARK[k]} ${t}</span></label>`).join("")}</fieldset>
      <label for="gn-${esc(g.id)}" class="sw-type">What you saw (optional)<textarea id="gn-${esc(g.id)}" rows="2" maxlength="400"></textarea></label>
      <div class="row"><button class="btn small primary" data-gobs="${esc(g.id)}">Save observation</button></div></details>` : ""}`;
}
function wireGoalObs(L, me, redraw) {
  on("[data-gobs]", e => {
    const g = L.goals.find(x => x.id === e.currentTarget.dataset.gobs), level = (document.querySelector(`input[name="go-${g.id}"]:checked`) || {}).value || "support";
    (g.obs = g.obs || []).push({ date: todayIsoDate(), level, text: document.getElementById("gn-" + g.id).value.trim(), by: me.name });
    if (level === "alone" && g.status === "todo") g.status = "doing";
    savePortal(); redraw(); flash("Observation saved.");
  });
}

// ----- Development over time -----
function developmentHtml(L, viewer) {
  const name = esc(L.nickname), rows = L.rows.filter(r => exById(r[1])), months = [...new Set(rows.map(r => r[0].slice(0, 7)))].sort();
  const monthName = m => ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][+m.slice(5) - 1] + " " + m.slice(0, 4);
  const cellFor = (d, m) => { const rs = rows.filter(r => r[0].startsWith(m) && exById(r[1]).domain === d); if (!rs.length) return `<td class="muted">–</td>`;
    const a = rs.filter(r => r[2] === "alone").length; return `<td><span class="dev-bar" style="--p:${Math.round(a / rs.length * 100)}%" aria-hidden="true"></span>${a} of ${rs.length} on their own</td>`; };
  const showHealth = viewer.role === "parent" || (L.consent && L.consent.health);
  const events = [].concat(
    (L.goals || []).flatMap(g => (g.obs || []).map(o => ({ date: o.date, icon: LEVEL_MARK[o.level], text: `Goal "${g.text}": ${LEVEL_TEXT[o.level].toLowerCase()}${o.text ? `. ${o.text}` : ""}` }))),
    (L.adaptLog || []).map(e => ({ date: e.date, icon: "⚙️", text: `${e.text} (${e.by})` })),
    (L.notes || []).filter(n => viewer.role === "specialist" || n.shareFamily).map(n => ({ date: n.date, icon: "📝", text: `${n.by}: ${n.text}` })),
    showHealth ? (L.healthLog || []).map(h => ({ date: h.date, icon: "💊", text: h.text })) : [],
    [...new Set(rows.map(r => r[0]))].map(d => ({ date: d, icon: "🧠", text: `Session: ${rows.filter(r => r[0] === d).length} activities` }))
  ).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 25);
  return `<h2>How ${name} is developing</h2>
      <p class="note">Growth over time, from sessions, goals, notes and changes. It describes activities, not ability, and is not a diagnosis.</p>
      <h3>Support goals</h3>
      ${(L.goals || []).length ? `<ul class="goal-list">${L.goals.map(g => `<li class="goal-item"><div><b>${esc(g.text)}</b> <span class="status st-${g.status === "done" ? "alone" : g.status === "doing" ? "support" : "notyet"}">${GOAL_STATUS[g.status]}</span>${goalObsHtml(g, false)}</div></li>`).join("")}</ul>
        <p class="note">${Object.entries(LEVEL_TEXT).map(([k, t]) => `${LEVEL_MARK[k]} ${t}`).join(" · ")}</p>` : `<p class="muted">No goals yet.</p>`}
      <h3>Thinking domains, month by month</h3>
      ${months.length ? `<div class="tablewrap" tabindex="0" role="region" aria-label="Thinking domains by month"><table class="hist dev"><thead><tr><th scope="col">Domain</th>${months.map(m => `<th scope="col">${monthName(m)}</th>`).join("")}</tr></thead>
        <tbody>${REPORT_DOMAINS.map(d => `<tr><th scope="row">${esc(d)}</th>${months.map(m => cellFor(d, m)).join("")}</tr>`).join("")}</tbody></table></div>` : `<p class="muted">No sessions yet.</p>`}
      <h3>Timeline</h3>
      ${events.length ? `<ol class="timeline">${events.map(e => `<li><span class="tl-date">${niceDate(e.date)}</span><span class="em" aria-hidden="true">${e.icon}</span><span>${esc(e.text)}</span></li>`).join("")}</ol>` : `<p class="muted">Nothing yet.</p>`}`;
}

// ----- Health and medication -----
function healthHtml(L, me) {
  const name = esc(L.nickname), meds = L.meds || [], current = meds.filter(m => !m.stop), parent = me.role === "parent";
  if (!parent && !(L.consent && L.consent.health)) return `<h2>Health and medication</h2><p class="muted">Not shared. ${name}'s family hasn't chosen to share medication information.</p>`;
  const days = Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - 6 + i); return d.toISOString().slice(0, 10); });
  const dose = (m, d) => (L.doses || []).find(x => x.medId === m.id && x.date === d);
  return `<h2>Health and medication</h2>
      <p class="note">${parent ? `Only you can add or change this. ` : ""}This is a record for ${name}'s team, not medical advice. Always follow the prescriber's instructions. It never appears in reports.</p>
      ${parent ? `<label class="consent" for="hShare"><input type="checkbox" id="hShare"${L.consent.health ? " checked" : ""}><span>Share medication information with ${name}'s specialists</span></label>` : ""}
      <h3>Current medicines</h3>
      ${current.length ? `<ul class="goal-list">${current.map(m => `<li class="goal-item"><div><b>${esc(m.name)}</b> · ${esc(m.dose)} · ${esc(m.when)}${m.reason ? `<div class="note">For: ${esc(m.reason)}</div>` : ""}<div class="note">Since ${fullDate(m.start)}</div></div>
          ${parent ? `<span class="row"><button class="btn small" data-mgiven="${esc(m.id)}">${icon("✅")}<span>Given today</span></button><button class="btn small" data-mmissed="${esc(m.id)}">${icon("⏭️")}<span>Missed today</span></button><button class="btn small quiet" data-mstop="${esc(m.id)}">Stopped</button></span>` : ""}</li>`).join("")}</ul>` : `<p class="muted">None recorded.</p>`}
      ${current.length ? `<h3>The last 7 days</h3><div class="tablewrap" tabindex="0" role="region" aria-label="Doses in the last 7 days"><table class="hist"><thead><tr><th scope="col">Medicine</th>${days.map(d => `<th scope="col">${niceDate(d)}</th>`).join("")}</tr></thead>
        <tbody>${current.map(m => `<tr><th scope="row">${esc(m.name)}</th>${days.map(d => { const x = dose(m, d); return `<td>${x ? (x.status === "given" ? "✓ given" : "✗ missed") : "–"}</td>`; }).join("")}</tr>`).join("")}</tbody></table></div>` : ""}
      ${parent ? `<details class="goal-add"><summary>Add a medicine</summary><div class="fields">
          ${field("mName", "Name", `<input id="mName" maxlength="60">`)}${field("mDose", "Dose", `<input id="mDose" maxlength="40">`, "As on the label, for example: 10 mg")}
          ${field("mWhen", "When", `<input id="mWhen" maxlength="60">`, "For example: mornings, with breakfast")}${field("mWhy", "What it's for (optional)", `<input id="mWhy" maxlength="80">`)}
          ${field("mStart", "Started", `<input id="mStart" type="date" value="${todayIsoDate()}">`)}</div>
          <div class="err-summary" id="errSum" role="alert"></div><div class="row"><button class="btn primary" id="mAdd">Add medicine</button></div></details>` : ""}
      ${(L.healthLog || []).length ? `<h3>Changes</h3><ul class="plain">${L.healthLog.slice().reverse().map(h => `<li>${niceDate(h.date)}: ${esc(h.text)}</li>`).join("")}</ul>` : ""}`;
}
function wireHealth(L, me, redraw) {
  const share = document.getElementById("hShare");
  if (share) share.addEventListener("change", () => { L.consent.health = share.checked; (L.healthLog = L.healthLog || []).push({ date: todayIsoDate(), text: `Sharing with specialists turned ${share.checked ? "on" : "off"}` }); savePortal(); redraw(); });
  const doseFor = (id, status) => { const d = todayIsoDate(); L.doses = (L.doses || []).filter(x => !(x.medId === id && x.date === d)).concat({ medId: id, date: d, status }); savePortal(); redraw(); };
  on("[data-mgiven]", e => doseFor(e.currentTarget.dataset.mgiven, "given"));
  on("[data-mmissed]", e => doseFor(e.currentTarget.dataset.mmissed, "missed"));
  on("[data-mstop]", e => { const m = L.meds.find(x => x.id === e.currentTarget.dataset.mstop); m.stop = todayIsoDate(); (L.healthLog = L.healthLog || []).push({ date: m.stop, text: `Stopped ${m.name}` }); savePortal(); redraw(); });
  on("#mAdd", () => {
    const v = id => document.getElementById(id).value.trim(), errs = {};
    if (!v("mName")) errs.mName = "Write the medicine's name."; if (!v("mDose")) errs.mDose = "Write the dose."; if (!v("mWhen")) errs.mWhen = "Write when it's taken.";
    if (!showErrors(errs)) return;
    const m = { id: newId("med"), name: v("mName"), dose: v("mDose"), when: v("mWhen"), reason: v("mWhy"), start: v("mStart") || todayIsoDate(), stop: null };
    (L.meds = L.meds || []).push(m); (L.healthLog = L.healthLog || []).push({ date: m.start, text: `Started ${m.name}, ${m.dose}, ${m.when}` });
    savePortal(); redraw(); flash("Medicine added.");
  });
}

// ----- Supports, automatic changes and the next-session plan (specialist) -----
const ADAPT_RULE_KEYS = ["sooner", "shorter", "fewer", "breaks", "slow"];
const ADAPT_RULE_TEXT = { sooner: "Offer help sooner", shorter: "Shorter lessons", fewer: "Start with fewer choices", breaks: "Regular break offers", slow: "\"Take your time\" after very quick answers" };
function supportsHtml(L) {
  const off = L.adaptOff || {}, plan = L.nextPlan || [];
  const units = UNITS.filter(u => u.grade === ((L.learnLevels || {})[areaOf(u.subject)] ?? L.learnGrade ?? DEFAULT_GRADE[L.cohort])).slice(0, 40);
  return `<h2>Screen and sound</h2><p class="note">These start every session. The family sees any change.</p>
      <div class="consents">${PREF_TOGGLES.map(([k, t]) => `<label class="consent" for="pf-${k}"><input type="checkbox" id="pf-${k}"${prefOn(L, k) ? " checked" : ""}><span>${esc(t)}</span></label>`).join("")}</div>
      <div class="row"><button class="btn" id="spPrefs">Save screen and sound</button></div>
      <h2>Automatic changes, one by one</h2><p class="note">Turn off a rule that doesn't suit ${esc(L.nickname)}. The rest keep working.</p>
      <div class="consents">${ADAPT_RULE_KEYS.map(k => `<label class="consent" for="ar-${k}"><input type="checkbox" id="ar-${k}"${off[k] ? "" : " checked"}><span>${esc(ADAPT_RULE_TEXT[k])}</span></label>`).join("")}</div>
      <div class="row"><button class="btn" id="spAuto">Save automatic changes</button></div>
      <h2>Plan the next session</h2>
      <p class="note">Up to 5 steps. ${esc(L.nickname)} sees it as "My plan today" at their next session, and can still choose something else.</p>
      ${plan.length ? `<ol class="plan-strip">${plan.map(k => `<li>${icon(planStepInfo(k)[0])}<span>${esc(planStepInfo(k)[1])}</span></li>`).join("")}</ol><div class="row"><button class="btn small quiet" id="npClear">Clear the plan</button></div>` : `<p class="muted">No plan set.${L.lastPlan ? ` The last one was used on ${niceDate(L.lastPlan.used)}.` : ""}</p>`}
      <div class="fields">${field("npAdd", "Add a step", `<select id="npAdd"><option value="">Choose…</option><optgroup label="Thinking Lab">${EXERCISES.map(x => `<option value="x:${x.id}">${esc(x.name)}</option>`).join("")}</optgroup>
        <optgroup label="Lessons at their level">${units.map(u => `<option value="u:${esc(u.id)}">${esc(u.subject)}: ${esc(u.title)}</option>`).join("")}</optgroup>
        <optgroup label="Other">${["brk", "avatar", "passport"].map(k => `<option value="${k}">${esc(PLAN_STEPS[k][1])}</option>`).join("")}</optgroup></select>`)}</div>
      <div class="row"><button class="btn" id="npPush"${plan.length >= 5 ? " disabled" : ""}>Add to the plan</button></div>`;
}
function wireSupports(L, redraw) {
  on("#spPrefs", () => { PREF_TOGGLES.forEach(([k]) => setPref(L, k, document.getElementById("pf-" + k).checked)); teamLog(L, "Screen and sound settings changed"); savePortal(); redraw(); flash("Saved. These settings start every session."); });
  on("#spAuto", () => {
    L.adaptOff = {}; ADAPT_RULE_KEYS.forEach(k => { if (!document.getElementById("ar-" + k).checked) L.adaptOff[k] = true; });
    teamLog(L, Object.keys(L.adaptOff).length ? `Automatic changes turned off: ${Object.keys(L.adaptOff).map(k => ADAPT_RULE_TEXT[k].toLowerCase()).join(", ")}` : "All automatic changes on");
    savePortal(); redraw(); flash("Saved.");
  });
  on("#npPush", () => { const v = document.getElementById("npAdd").value; if (!v) return; L.nextPlan = (L.nextPlan || []).concat(v).slice(0, 5); L.nextPlanBy = (PORTAL.me || {}).name; savePortal(); redraw(); });
  on("#npClear", () => { L.nextPlan = null; savePortal(); redraw(); });
}

// ----- Specialists review the adaptation rules (docs/adaptation-rules.md) -----
const RULES_FOR_REVIEW = [
  ["sooner", "Help sooner", `Help used on ${ADAPT.helpShare * 100}% or more of at least ${ADAPT.minQs} questions in the last ${ADAPT.window} session days: help is offered after 1 wrong answer instead of 2, and after 45 seconds instead of 90.`],
  ["shorter", "Shorter lessons", `Moved on without an answer ${ADAPT.skips} or more times in the last ${ADAPT.window} session days: lessons have 3 questions. The learner can ask for the full lesson.`],
  ["fewer", "Fewer choices to start", `Chose "make it easier" on ${ADAPT.easierMin} of the last ${ADAPT.easierOf} questions in one area: questions there start with 2 choices. The learner can show them all.`],
  ["breaks", "Regular break offers", `Chose a break on ${ADAPT.breakDays} or more recent days: a break is offered every ${ADAPT.breakEvery} questions.`],
  ["slow", "Take your time", `${ADAPT.quickMin} wrong answers within ${ADAPT.quickMs / 1000} seconds in one session: a one-time gentle reminder to read the question again.`],
  ["up", "Suggest the next level", `${ADAPT.moreShare * 100}% of the last ${ADAPT.moreQs} questions at a level answered alone, on ${ADAPT.minDays} or more days: an adult is asked whether to move up. Never automatic.`],
  ["down", "Suggest the level below", `Half of the last ${ADAPT.lessQs} questions at a level not yet shown or made easier, on ${ADAPT.minDays} or more days: an adult is asked. Never automatic.`]
];
const VERDICTS = { agree: "Agree as it is", change: "Needs a change", unsure: "Not sure yet" };
function ruleReview() {
  const me = PORTAL.me; if (!me || me.role !== "specialist") return portalHome();
  bar("adult"); PORTAL.ruleReviews = PORTAL.ruleReviews || [];
  render(`<section class="card">${portalHead()}<p class="eyebrow">For specialists</p><h1>Review the adaptation rules</h1>
      <p class="lead">These rules decide how the platform adapts to each learner. They were written before any specialist review. Please say whether each one is right, and what you would change.</p>
      ${RULES_FOR_REVIEW.map(([k, name, text]) => { const mine = PORTAL.ruleReviews.filter(r => r.rule === k && r.byId === me.id).pop(), others = PORTAL.ruleReviews.filter(r => r.rule === k && r.byId !== me.id);
        return `<div class="obs-item rule-rev"><h2>${esc(name)}</h2><p>${esc(text)}</p>
          <fieldset><legend>Your view</legend>${Object.entries(VERDICTS).map(([v, t]) => `<label class="consent" for="rv-${k}-${v}"><input type="radio" name="rv-${k}" id="rv-${k}-${v}" value="${v}"${mine && mine.verdict === v ? " checked" : ""}><span>${t}</span></label>`).join("")}</fieldset>
          <label for="rc-${k}" class="sw-type">What would you change, and why? (optional)<textarea id="rc-${k}" rows="2" maxlength="800">${esc(mine ? mine.comment : "")}</textarea></label>
          <div class="row"><button class="btn small primary" data-rv="${k}">Save my review</button></div>
          ${others.length ? `<details><summary>${others.length} other review${others.length > 1 ? "s" : ""}</summary><ul class="plain">${others.map(r => `<li><b>${esc(r.by)}</b> (${esc(r.profession)}): ${VERDICTS[r.verdict]}${r.comment ? `. "${esc(r.comment)}"` : ""}</li>`).join("")}</ul></details>` : ""}</div>`; }).join("")}
      <div class="row"><button class="btn" id="rvDown">${icon("⬇️")}<span>Download all reviews</span></button><button class="btn quiet" id="rvBack">Back to my learners</button></div>
      <p class="note">In this demo, reviews stay in this browser. Download them to send to the 2to.iQ team.</p></section>`);
  wirePortalHead();
  on("[data-rv]", e => {
    const k = e.currentTarget.dataset.rv, v = (document.querySelector(`input[name="rv-${k}"]:checked`) || {}).value;
    if (!v) { flash("Choose your view first."); return; }
    PORTAL.ruleReviews = PORTAL.ruleReviews.filter(r => !(r.rule === k && r.byId === me.id)).concat({ rule: k, verdict: v, comment: document.getElementById("rc-" + k).value.trim(), by: me.name, byId: me.id, profession: me.profession, date: todayIsoDate() });
    savePortal(); ruleReview(); flash("Review saved. Thank you.");
  });
  on("#rvDown", () => downloadBlob(new Blob([JSON.stringify({ exported: nowIso(), thresholds: ADAPT, reviews: PORTAL.ruleReviews }, null, 2)], { type: "application/json" }), `ThinkingLab-rule-reviews-${todayIsoDate()}.json`));
  on("#rvBack", specialistHome);
}
