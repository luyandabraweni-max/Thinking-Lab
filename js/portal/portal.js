"use strict";

// ---------- Portal: front door, registration and sign-in ----------
// A working demo of the parent and specialist portal. Accounts live only in this page's memory:
// nothing is sent or saved, and everything is cleared when the page closes. Real accounts wait for the
// legal sign-off in the system design (docs/system-design.md, sections 12 and 19).
const CURRICULA = [["CAPS", "CAPS (mainstream schools)"], ["D-CAPS", "D-CAPS (differentiated, special schools)"], ["NCF", "NCF Birth to Four (early years)"], ["GETCA", "GETCA (adult learning)"], ["Other", "Another curriculum"]];
const PROFESSIONS = ["Teacher", "Special-needs educator", "Occupational therapist", "Speech-language therapist", "Educational psychologist", "Physiotherapist", "Care worker", "Other"];
const COUNTRIES = [["ZA", "South Africa"], ["AT", "Austria"], ["BE", "Belgium"], ["BG", "Bulgaria"], ["HR", "Croatia"], ["CY", "Cyprus"], ["CZ", "Czechia"], ["DK", "Denmark"], ["EE", "Estonia"], ["FI", "Finland"], ["FR", "France"], ["DE", "Germany"], ["GR", "Greece"], ["HU", "Hungary"], ["IE", "Ireland"], ["IT", "Italy"], ["LV", "Latvia"], ["LT", "Lithuania"], ["LU", "Luxembourg"], ["MT", "Malta"], ["NL", "Netherlands"], ["PL", "Poland"], ["PT", "Portugal"], ["RO", "Romania"], ["SK", "Slovakia"], ["SI", "Slovenia"], ["ES", "Spain"], ["SE", "Sweden"]];
const lawFor = c => c === "ZA" ? "POPIA (South Africa)" : "GDPR (European Union)";

const PORTAL = { accounts: [], learners: [], me: null, seq: 0, ruleReviews: [] };
const ROLE_NAMES = { parent: "Parent portal", specialist: "Specialist portal", admin: "School admin" };
// Demo accounts, also restored into older saved demo data that doesn't have them yet.
const SEED_ACCOUNTS = [
  { id: "demo-parent", role: "parent", name: "Demo Parent", email: "parent@example.org", country: "ZA", demo: true, created: "2026-10-01", consents: { guardian: true, terms: true, support: true, share: true } },
  { id: "demo-specialist", role: "specialist", name: "Demo Specialist", email: "specialist@example.org", country: "ZA", profession: "Special-needs educator", org: "Demo Special School", regNo: "", demo: true, created: "2026-10-01", consents: { terms: true, confidential: true, safeguarding: true, honest: true, dsl: true } },
  { id: "demo-ot", role: "specialist", name: "Demo Therapist", email: "therapist@example.org", country: "ZA", profession: "Occupational therapist", org: "Demo Special School", regNo: "", demo: true, created: "2026-10-01", consents: { terms: true, confidential: true, safeguarding: true, honest: true } },
  { id: "demo-admin", role: "admin", name: "Demo School Admin", email: "admin@example.org", country: "ZA", profession: "School administrator", org: "Demo Special School", demo: true, created: "2026-10-01", consents: { terms: true, confidential: true, safeguarding: true, honest: true } }];
const newId = p => `${p}${++PORTAL.seq}`;
// Demo accounts and learners, built on the demo dashboard's made-up learners so their histories are shared.
// Made-up messages and health records for the demo child Brave Meerkat, so every part of the team view has something to show.
const DEMO_TEAM = {
  messages: [
    { id: "dm1", date: "2026-10-15T15:10:00Z", fromId: "demo-specialist", fromName: "Demo Specialist", fromRole: "specialist", to: "team", text: "Brave Meerkat planned every step in the robot game today before pressing Run. A big step towards the planning goal.", readBy: ["demo-specialist"] },
    { id: "dm2", date: "2026-10-15T18:40:00Z", fromId: "demo-parent", fromName: "Demo Parent", fromRole: "parent", to: "team", text: "Thank you! We tried the 'exact steps' game at home with making toast. Lots of laughing.", readBy: ["demo-parent", "demo-specialist"] },
    { id: "dm3", date: "2026-10-20T09:05:00Z", fromId: "demo-specialist", fromName: "Demo Specialist", fromRole: "specialist", to: "learner", text: "Well done for fixing Bolt's instructions all by yourself!", readBy: ["demo-specialist", "learner", "demo-parent"] },
    { id: "dm4", date: "2026-10-20T10:30:00Z", fromId: "learner", fromName: "Brave Meerkat", fromRole: "learner", to: "team", text: "That made me happy", sticker: "❤️", readBy: ["learner", "demo-specialist"] }],
  meds: [{ id: "med1", name: "Example medicine (made up)", dose: "10 mg", when: "Mornings, with breakfast", reason: "Attention, prescribed by the paediatrician", start: "2026-10-12", stop: null }],
  doses: [], healthLog: [{ date: "2026-10-12", text: "Started Example medicine (made up), 10 mg, mornings" }]
};
(function seedPortal() {
  PORTAL.accounts.push(...JSON.parse(JSON.stringify(SEED_ACCOUNTS)));
  const extra = [
    { curriculum: "NCF", level: "Grade R", guardianId: "demo-parent", supportNeeds: "" },
    { curriculum: "D-CAPS", level: "Foundation level", guardianId: "demo-parent", supportNeeds: "Needs extra time to process spoken instructions. Prefers building answers step by step.",
      goals: [{ id: "g1", text: "Follows a 3-step plan without reminders", area: "Logical and Analytical Thinking", status: "doing", target: "2026-12-05" , created: "2026-10-06", obs: [{ date: "2026-10-08", level: "notyet", text: "Needed reminders after step 1.", by: "Demo Specialist" }, { date: "2026-10-15", level: "support", text: "Followed the plan with one picture prompt.", by: "Demo Specialist" }, { date: "2026-10-22", level: "alone", text: "Planned and followed all 3 steps in Literal Robot.", by: "Demo Specialist" }] }, { id: "g2", text: "Asks for help using the talk board", area: "Communication and Expression", status: "done", target: "2026-11-14" , created: "2026-10-06", obs: [{ date: "2026-10-13", level: "support", text: "Used the talk board when prompted.", by: "Demo Specialist" }] }],
      notes: [{ date: "2026-10-15", by: "Demo Specialist", byId: "demo-specialist", text: "Planned all Robot Rescue steps before starting today. A big step.", shareFamily: true }, { date: "2026-10-20", by: "Demo Specialist", byId: "demo-specialist", text: "Try the pattern activity again with building, not picture choice.", shareFamily: false }] },
    { curriculum: "CAPS", level: "Grade 9", guardianId: null, supportNeeds: "" }];
  DEMO.forEach((D, i) => PORTAL.learners.push(Object.assign({ id: "demo-l" + i, nickname: D.code, cohort: D.cohort, band: D.band, answer: D.answer, supports: D.supports, rows: D.rows, demoIndex: i, specialists: ["demo-specialist"], shareCode: null, goals: [], notes: [],
    consent: { guardian: true, support: i === 1, share: true, health: i === 1, date: "2026-10-01", law: lawFor("ZA"), schoolHeld: i === 2 } }, extra[i], i === 1 ? DEMO_TEAM : {})));
})();
const portalLearner = id => PORTAL.learners.find(l => l.id === id);
// Access rules: guardians see their own children; specialists see learners shared with them; school admins see no learner records.
function canSee(acc, L) { return !!acc && !!L && (acc.role === "parent" ? L.guardianId === acc.id : acc.role === "specialist" && L.specialists.includes(acc.id)); }
function myLearners() { return PORTAL.learners.filter(L => canSee(PORTAL.me, L)); }

function portalHead() {
  const me = PORTAL.me; if (!me) return "";
  return `<div class="portal-head"><span class="ph-who">${icon({ parent: "👪", specialist: "🧑‍🏫", admin: "🏫" }[me.role])}<span><b>${esc(me.name)}</b><span class="muted"> · ${ROLE_NAMES[me.role]}</span></span></span>
    <span class="row"><button class="btn small" id="phHome">My dashboard</button><button class="btn small" id="phAccount">My account</button><button class="btn small quiet" id="phOut">Sign out</button></span></div>
    <p class="note demo-flag">Demo portal: accounts and learners here are pretend and live only on this page. Nothing is sent or saved.</p>`;
}
function wirePortalHead() { on("#phHome", portalHome); on("#phAccount", accountPage); on("#phOut", () => { PORTAL.me = null; welcome(); }); }
function portalHome() { if (!PORTAL.me) return welcome(); ({ parent: parentHome, specialist: specialistHome, admin: adminHome }[PORTAL.me.role] || welcome)(); }

// ---------- Front door ----------
function welcome() {
  stopSpeaking(); closeLayer(); bar("adult"); trail.length = 0;
  render(`
      <section class="card">
        <p class="eyebrow">2to.iQ Thinking Lab</p>
        <h1>Welcome</h1>
        <p class="lead">Calm, accessible thinking activities for learners aged 3 to 25.</p>
        <div class="doors">
          <div class="door"><span class="door-ic" aria-hidden="true">👪</span><h2>Parents and guardians</h2><p class="muted">Register your child, see how they are doing, share with their teachers and therapists, and download reports.</p>
            <div class="row"><button class="btn primary" data-reg="parent">Register</button><button class="btn" data-signin="parent">Sign in</button></div></div>
          <div class="door"><span class="door-ic" aria-hidden="true">🧑‍🏫</span><h2>Specialists and teachers</h2><p class="muted">For teachers, special-needs educators and therapists: follow your learners, set support goals, keep notes and write reports.</p>
            <div class="row"><button class="btn primary" data-reg="specialist">Register</button><button class="btn" data-signin="specialist">Sign in</button></div></div>
          <div class="door"><span class="door-ic" aria-hidden="true">✨</span><h2>Try it now</h2><p class="muted">Start a session straight away. No account, and nothing is saved.</p>
            <div class="row"><button class="btn" id="wTry">Start a try-out session</button></div></div>
        </div>
        <p class="note demo-flag">This is a prototype. Registration works, but accounts are pretend and live only on this page. Please use made-up details. To look around quickly, sign in with a demo account.</p>
        <div class="row"><button class="btn small" id="wDemoParent">Demo parent account</button><button class="btn small" id="wDemoSpec">Demo specialist account</button><button class="btn small" id="wDemoAdmin">Demo school admin</button><button class="btn small quiet" id="wClear">Clear demo data</button></div>
        <p class="note">School admins: <button class="btn small quiet" data-signin="admin">Sign in as a school admin</button> School admin accounts are set up with us when a school joins.</p>
        <p class="note">Demo accounts you create are kept in this browser only, so you can come back to them. They are never sent anywhere. You stay signed out each time you return, so a child can't open your portal.</p>
      </section>`);
  on("[data-reg]", e => registerStart(e.currentTarget.dataset.reg));
  on("[data-signin]", e => signIn(e.currentTarget.dataset.signin));
  on("#wClear", () => {
    overlay(`<div class="card"><h2>Clear all demo data?</h2><p>Accounts, children, goals and notes you made in this browser will be deleted.</p><div class="row"><button class="btn" id="cdNo" data-focus>Keep it</button><button class="btn primary" id="cdYes">Clear</button></div></div>`);
    document.getElementById("cdNo").onclick = closeLayer;
    document.getElementById("cdYes").onclick = () => { try { localStorage.removeItem(PORTAL_KEY); } catch (e) {} location.reload(); };
  });
  on("#wTry", () => { Object.assign(S, { portalLearner: null, demoLearner: null, history: [], adaptAuto: true, adaptSkip: {} }); setup(); });
  on("#wDemoParent", () => { PORTAL.me = PORTAL.accounts.find(a => a.id === "demo-parent"); parentHome(); });
  on("#wDemoSpec", () => { PORTAL.me = PORTAL.accounts.find(a => a.id === "demo-specialist"); specialistHome(); });
  on("#wDemoAdmin", () => { PORTAL.me = PORTAL.accounts.find(a => a.id === "demo-admin"); adminHome(); });
}

// ---------- Sign in (a one-time code by email, as in the design) ----------
function signIn(role) {
  bar("adult");
  render(`
      <section class="card setup">
        <p class="eyebrow">${{ parent: "Parents and guardians", specialist: "Specialists and teachers", admin: "School admins" }[role]}</p>
        <h1>Sign in</h1>
        <p>We'll send a 6-digit code to your email. There are no passwords to remember.</p>
        <label for="siEmail">Email address<input id="siEmail" type="email" autocomplete="email" inputmode="email" aria-describedby="siErr"></label>
        <p class="field-error" id="siErr" role="alert"></p>
        <div class="row"><button class="btn primary" id="siGo" data-focus>Send my code</button><button class="btn quiet" id="siBack">Back</button></div>
        <p class="note">Demo accounts: parent@example.org, specialist@example.org, therapist@example.org and admin@example.org.</p>
      </section>`);
  on("#siBack", welcome);
  const go = () => {
    const email = document.getElementById("siEmail").value.trim().toLowerCase();
    const acc = PORTAL.accounts.find(a => a.email === email && a.role === role);
    if (!acc) { document.getElementById("siErr").textContent = `No ${role === "admin" ? "school admin" : role} account uses that email on this page. Check it, or register first.`; return; }
    verifyCode(email, () => { PORTAL.me = acc; portalHome(); }, () => signIn(role));
  };
  on("#siGo", go);
  document.getElementById("siEmail").addEventListener("keydown", e => { if (e.key === "Enter") go(); });
}
function verifyCode(email, ok, back) {
  const code = String(100000 + Math.floor(Math.random() * 900000));
  render(`
      <section class="card setup">
        <p class="eyebrow">Check your email</p>
        <h1>Enter your code</h1>
        <p>We sent a 6-digit code to <b>${esc(email)}</b>.</p>
        <p class="note demo-flag">Demo: no email is sent. Your code is <b class="code">${code}</b>.</p>
        <label for="vcCode">6-digit code<input id="vcCode" inputmode="numeric" autocomplete="one-time-code" maxlength="6" aria-describedby="vcErr"></label>
        <p class="field-error" id="vcErr" role="alert"></p>
        <div class="row"><button class="btn primary" id="vcGo" data-focus>Continue</button><button class="btn quiet" id="vcBack">Back</button></div>
      </section>`);
  const go = () => { if (document.getElementById("vcCode").value.trim() === code) ok(); else document.getElementById("vcErr").textContent = "That code doesn't match. Check the numbers and try again."; };
  on("#vcGo", go); on("#vcBack", back);
  document.getElementById("vcCode").addEventListener("keydown", e => { if (e.key === "Enter") go(); });
}

// ---------- Registration ----------
const isEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
function stepper(n, names) { return `<ol class="stepstrip" aria-label="Steps">${names.map((s, i) => `<li class="${i < n ? "done" : i === n ? "now" : ""}"${i === n ? ' aria-current="step"' : ""}>${esc(s)}</li>`).join("")}</ol>`; }
// Shows every problem at once, next to its field and in a summary that screen readers announce.
function showErrors(errs) {
  $main.querySelectorAll(".field-error[data-for]").forEach(p => { p.textContent = ""; });
  $main.querySelectorAll("[aria-invalid]").forEach(n => n.removeAttribute("aria-invalid"));
  Object.entries(errs).forEach(([id, msg]) => { const f = document.getElementById(id), p = $main.querySelector(`.field-error[data-for="${id}"]`); if (f) f.setAttribute("aria-invalid", "true"); if (p) p.textContent = msg; });
  const sum = document.getElementById("errSum");
  sum.innerHTML = Object.keys(errs).length ? `<b>Please fix ${Object.keys(errs).length === 1 ? "this" : "these"}:</b><ul class="plain">${Object.values(errs).map(m => `<li>${esc(m)}</li>`).join("")}</ul>` : "";
  const first = Object.keys(errs)[0]; if (first) document.getElementById(first).focus();
  return !Object.keys(errs).length;
}
const field = (id, label, input, hint) => `<label for="${id}">${label}${input}${hint ? `<span class="note">${hint}</span>` : ""}<span class="field-error" data-for="${id}"></span></label>`;
const options = (list, sel) => list.map(o => Array.isArray(o) ? `<option value="${esc(o[0])}"${o[0] === sel ? " selected" : ""}>${esc(o[1])}</option>` : `<option${o === sel ? " selected" : ""}>${esc(o)}</option>`).join("");

function registerStart(role) {
  const d = { role, name: "", email: "", country: "ZA", profession: PROFESSIONS[0], org: "", regNo: "", consents: {} };
  const steps = role === "parent" ? ["About you", "Check email", "Consent", "Your child"] : ["About you", "Check email", "Agreements", "Done"];
  const about = () => {
    bar("adult");
    render(`
      <section class="card setup">
        <p class="eyebrow">Register · ${role === "parent" ? "parent or guardian" : "specialist or teacher"}</p>
        <h1>About you</h1>
        ${stepper(0, steps)}
        <div class="err-summary" id="errSum" role="alert"></div>
        <div class="fields">
          ${field("rgName", "Your name", `<input id="rgName" autocomplete="name" value="${esc(d.name)}" maxlength="60">`)}
          ${field("rgEmail", "Email address", `<input id="rgEmail" type="email" autocomplete="email" inputmode="email" value="${esc(d.email)}" maxlength="120">`, "We use it to send sign-in codes. Never for marketing unless you opt in.")}
          ${field("rgCountry", "Country", `<select id="rgCountry">${options(COUNTRIES, d.country)}</select>`, "This decides which privacy law protects your data.")}
          ${role === "specialist" ? field("rgProf", "Your role", `<select id="rgProf">${options(PROFESSIONS, d.profession)}</select>`)
            + field("rgOrg", "School, practice or organisation", `<input id="rgOrg" autocomplete="organization" value="${esc(d.org)}" maxlength="80">`)
            + field("rgReg", "Professional registration number (optional)", `<input id="rgReg" value="${esc(d.regNo)}" maxlength="30">`, "For example your SACE or HPCSA number, or your national registration in the EU.") : ""}
        </div>
        <div class="row"><button class="btn primary" id="rgNext" data-focus>Next</button><button class="btn quiet" id="rgBack">Cancel</button></div>
      </section>`);
    on("#rgBack", welcome);
    on("#rgNext", () => {
      const v = id => (document.getElementById(id) || {}).value || "";
      Object.assign(d, { name: v("rgName").trim(), email: v("rgEmail").trim().toLowerCase(), country: v("rgCountry") });
      if (role === "specialist") Object.assign(d, { profession: v("rgProf"), org: v("rgOrg").trim(), regNo: v("rgReg").trim() });
      const errs = {};
      if (!d.name) errs.rgName = "Enter your name.";
      if (!isEmail(d.email)) errs.rgEmail = "Enter an email address like name@example.org.";
      else if (PORTAL.accounts.some(a => a.email === d.email && a.role === role)) errs.rgEmail = "An account already uses this email. Sign in instead.";
      if (role === "specialist" && !d.org) errs.rgOrg = "Enter your school, practice or organisation.";
      if (showErrors(errs)) verifyCode(d.email, consent, about);
    });
  };
  const consent = () => {
    const items = role === "parent" ? [
      ["guardian", true, "I am the parent or legal guardian of the children I add, and I can give consent for them."],
      ["terms", true, "I agree to the terms of use and have read the privacy notice."],
      ["support", false, "Optional: allow me to record my child's support needs (for example a disability or health condition). This is sensitive information. Only I and the specialists I choose can see it, and I can withdraw this at any time."],
      ["share", false, "Optional: allow me to share my child's progress with specialists I choose, using a share code. I choose each specialist, and can stop sharing at any time."]
    ] : [
      ["terms", true, "I agree to the terms of use and have read the privacy notice."],
      ["confidential", true, "I will keep learners' information confidential and use it only to support them."],
      ["safeguarding", true, "I will follow my organisation's child protection policy and report any concern about a child's safety."],
      ["honest", true, "The information I have given about my role is true."],
      ["dsl", false, "Optional: I am my organisation's designated safeguarding lead. I will receive safeguarding concerns about the learners I support."]
    ];
    render(`
      <section class="card setup">
        <p class="eyebrow">Register</p>
        <h1>${role === "parent" ? "Your consent" : "Agreements"}</h1>
        ${stepper(2, steps)}
        <p>Your data is protected by <b>${lawFor(d.country)}</b>. You can see, download or delete it at any time from My account.</p>
        <button class="btn small" id="cgPrivacy">${icon("🔒")}<span>Read the privacy summary</span></button>
        <div class="err-summary" id="errSum" role="alert"></div>
        <div class="consents">${items.map(([k, req, t]) => `<label class="consent" for="cg-${k}"><input type="checkbox" id="cg-${k}"${d.consents[k] ? " checked" : ""}><span>${esc(t)}${req ? ' <span class="req">(required)</span>' : ""}<span class="field-error" data-for="cg-${k}"></span></span></label>`).join("")}</div>
        <div class="row"><button class="btn primary" id="cgNext" data-focus>${role === "parent" ? "Next" : "Create my account"}</button><button class="btn quiet" id="cgBack">Back</button></div>
      </section>`);
    on("#cgPrivacy", privacySummary);
    on("#cgBack", about);
    on("#cgNext", () => {
      items.forEach(([k]) => { d.consents[k] = document.getElementById("cg-" + k).checked; });
      const errs = {}; items.forEach(([k, req]) => { if (req && !d.consents[k]) errs["cg-" + k] = "This box needs to be ticked to continue."; });
      if (!showErrors(errs)) return;
      const acc = Object.assign({ id: newId("acc"), created: todayIso() }, d);
      PORTAL.accounts.push(acc); PORTAL.me = acc;
      if (role === "parent") childForm(null, () => parentHome(), true);
      else { specialistHome(); flash("Your account is ready. Add learners using a family's share code."); }
    });
  };
  about();
}
function privacySummary() {
  overlay(`<div class="card"><h2>Privacy summary</h2>
      <ul class="plain">
        <li>We collect as little as possible: a nickname for each child, never their full name, address or photo.</li>
        <li>Support needs are sensitive. They are only recorded if you agree, and only you and the specialists you choose can see them.</li>
        <li>No adverts, no tracking and no selling of data, ever.</li>
        <li>You can download all your data, or delete it, at any time from My account.</li>
        <li>Data is held in the European Union and protected under POPIA and GDPR.</li>
        <li>If you are worried about how we use data, contact our Information Officer. You can also complain to the Information Regulator (South Africa) or your national data protection authority (EU).</li>
      </ul>
      <p class="note">Prototype: the full privacy notice will be written with legal advisers before real accounts open.</p>
      <div class="row"><button class="btn primary" id="pvClose" data-focus>Close</button></div></div>`);
  document.getElementById("pvClose").onclick = closeLayer;
}
function flash(text) { const m = document.createElement("p"); m.className = "feedback"; m.setAttribute("role", "status"); m.textContent = text; const c = $main.querySelector(".card"); if (c) c.insertBefore(m, c.children[2] || null); }

// Add or edit a child (parents). Nickname only: never a full name.
function childForm(L, done, firstTime) {
  const me = PORTAL.me, isNew = !L;
  const d = L ? Object.assign({}, L) : { nickname: "", cohort: "7-12", band: "younger", answer: "choose", curriculum: "CAPS", level: "", supports: "", supportNeeds: "" };
  bar("adult");
  render(`
      <section class="card setup">
        ${portalHead()}
        <p class="eyebrow">${isNew ? "Add a child" : "Edit details"}</p>
        <h1>${isNew ? "About your child" : `About ${esc(L.nickname)}`}</h1>
        ${firstTime ? stepper(3, ["About you", "Check email", "Consent", "Your child"]) : ""}
        <div class="err-summary" id="errSum" role="alert"></div>
        <div class="fields">
          ${field("cfNick", "Nickname", `<input id="cfNick" value="${esc(d.nickname)}" maxlength="24" autocomplete="off">`, "A nickname or first name only. Never their full name.")}
          ${field("cfCohort", "Age group", `<select id="cfCohort">${options(Object.entries(COHORTS), d.cohort)}</select>`)}
          ${field("cfCurr", "Curriculum", `<select id="cfCurr">${options(CURRICULA, d.curriculum)}</select>`, "D-CAPS is the differentiated curriculum used in many special schools.")}
          ${field("cfLevel", "Grade or learning level (optional)", `<input id="cfLevel" value="${esc(d.level)}" maxlength="40">`, "For example Grade 3, or D-CAPS Foundation level. It can differ from their age.")}
          ${field("cfAnswer", "How they like to answer", `<select id="cfAnswer">${options([["choose", "Pick from pictures"], ["build", "Build it step by step"]], d.answer)}</select>`)}
          ${field("cfBand", "Challenge", `<select id="cfBand">${options([["younger", "Gentler"], ["older", "More challenging"]], d.band)}</select>`)}
        </div>
        ${field("cfSupports", "What helps them (optional)", `<textarea id="cfSupports" rows="3" maxlength="400">${esc(d.supports)}</textarea>`, "For example: read-aloud, extra time, quiet space, picture choices.")}
        ${me.consents.support ? field("cfNeeds", "Support needs (optional, sensitive)", `<textarea id="cfNeeds" rows="3" maxlength="600">${esc(d.supportNeeds)}</textarea>`, "Only you and the specialists you choose can see this.")
          : `<p class="note">You haven't agreed to record support needs, so there's no box for them. You can change this in My account.</p>`}
        <div class="row"><button class="btn primary" id="cfSave" data-focus>${isNew ? "Add child" : "Save"}</button><button class="btn quiet" id="cfBack">${firstTime ? "Skip for now" : "Cancel"}</button></div>
      </section>`);
  wirePortalHead();
  on("#cfBack", () => done(L));
  on("#cfSave", () => {
    const v = id => (document.getElementById(id) || {}).value || "";
    Object.assign(d, { nickname: cleanAvatarName(v("cfNick")).trim(), cohort: v("cfCohort"), curriculum: v("cfCurr"), level: v("cfLevel").trim(), answer: v("cfAnswer"), band: v("cfBand"), supports: v("cfSupports").trim(), supportNeeds: me.consents.support ? v("cfNeeds").trim() : "" });
    const errs = {}; if (!d.nickname) errs.cfNick = "Enter a nickname, using letters or numbers.";
    if (!showErrors(errs)) return;
    if (isNew) {
      const child = Object.assign({ id: newId("child"), rows: [], goals: [], notes: [], specialists: [], shareCode: null, guardianId: me.id,
        consent: { guardian: true, support: !!me.consents.support, share: !!me.consents.share, date: todayIso(), law: lawFor(me.country) } }, d);
      PORTAL.learners.push(child); done(child);
    } else { Object.assign(L, d); done(L); }
  });
}

// ---------- My account: see, download or delete your data ----------
function accountPage() {
  const me = PORTAL.me; if (!me) return welcome();
  bar("adult");
  const opt = me.role === "parent" ? [["support", "Record my children's support needs"], ["share", "Share progress with specialists I choose"]] : [];
  render(`
      <section class="card setup">
        ${portalHead()}
        <p class="eyebrow">My account</p>
        <h1>${esc(me.name)}</h1>
        <table class="hist"><tbody>
          <tr><th scope="row">Email</th><td>${esc(me.email)}</td></tr>
          <tr><th scope="row">Account</th><td>${me.role === "parent" ? "Parent or guardian" : esc(me.profession) + ", " + esc(me.org || "no school")}</td></tr>
          <tr><th scope="row">Country</th><td>${esc((COUNTRIES.find(c => c[0] === me.country) || [, ""])[1])} · protected by ${lawFor(me.country)}</td></tr>
          <tr><th scope="row">Registered</th><td>${fullDate(me.created)}</td></tr>
          ${me.role === "specialist" ? `<tr><th scope="row">Safeguarding lead</th><td>${me.consents.dsl ? "Yes: you receive safeguarding concerns" : "No"}</td></tr>` : ""}</tbody></table>
        ${opt.length ? `<h2>Your choices</h2><p class="note">You can change these at any time. Turning one off takes effect straight away.</p>
          <div class="consents">${opt.map(([k, t]) => `<label class="consent" for="ac-${k}"><input type="checkbox" id="ac-${k}"${me.consents[k] ? " checked" : ""}><span>${esc(t)}</span></label>`).join("")}</div>` : ""}
        <h2>Your data</h2>
        <div class="row"><button class="btn" id="acExport">${icon("⬇️")}<span>Download all my data</span></button><button class="btn" id="acDelete">${icon("🗑️")}<span>Delete my account</span></button></div>
        <p class="note">The download is a file with everything held about you${me.role === "parent" ? " and your children" : ""}, in a format other services can read.</p>
        <p class="note" id="acMsg" role="status"></p>
      </section>`);
  wirePortalHead();
  opt.forEach(([k]) => document.getElementById("ac-" + k).addEventListener("change", e => {
    me.consents[k] = e.target.checked;
    PORTAL.learners.filter(L => L.guardianId === me.id).forEach(L => { L.consent[k] = e.target.checked; if (k === "support" && !e.target.checked) L.supportNeeds = ""; if (k === "share" && !e.target.checked) { L.specialists = []; L.shareCode = null; } });
    document.getElementById("acMsg").textContent = e.target.checked ? "Turned on." : k === "support" ? "Turned off. Recorded support needs have been deleted." : "Turned off. Sharing with all specialists has stopped.";
  }));
  on("#acExport", () => {
    const mine = me.role === "parent" ? PORTAL.learners.filter(L => L.guardianId === me.id) : [];
    const data = { exported: new Date().toISOString(), account: me, children: mine.map(L => Object.assign({}, L, { specialists: L.specialists.map(id => (PORTAL.accounts.find(a => a.id === id) || {}).name) })) };
    downloadBlob(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }), `ThinkingLab-my-data-${todayIso()}.json`);
    document.getElementById("acMsg").textContent = "Downloaded. Check your downloads folder.";
  });
  on("#acDelete", () => {
    overlay(`<div class="card"><h2>Delete your account?</h2><p>${me.role === "parent" ? "Your account and your children's profiles, progress and reports will be deleted. Specialists will lose access." : "Your account and your notes will be deleted. Learners' families keep their own records."} This can't be undone.</p>
        <div class="row"><button class="btn" id="dNo" data-focus>Keep my account</button><button class="btn primary" id="dYes">Delete everything</button></div></div>`);
    document.getElementById("dNo").onclick = closeLayer;
    document.getElementById("dYes").onclick = () => {
      closeLayer();
      if (me.role === "parent") PORTAL.learners = PORTAL.learners.filter(L => L.guardianId !== me.id);
      else PORTAL.learners.forEach(L => { L.specialists = L.specialists.filter(id => id !== me.id); L.notes = L.notes.filter(n => n.byId !== me.id); });
      PORTAL.accounts = PORTAL.accounts.filter(a => a !== me); PORTAL.me = null;
      welcome(); flash("Your account has been deleted.");
    };
  });
}

// Start a learning session on this device as a portal learner. When it ends, it's added to their history.
// The learner's own character, My way choices and screen settings come with them, and go straight to their welcome.
function startPortalSession(L) {
  Object.assign(S, { code: L.nickname, cohort: L.cohort, band: L.band, answer: L.answer, demoLearner: L.demoIndex != null ? L.demoIndex : null, portalLearner: L.id,
    avatar: L.avatar ? Object.assign({}, L.avatar) : null, my: Object.assign(JSON.parse(JSON.stringify(MY_DEFAULTS)), L.my || {}), passport: L.passport ? JSON.parse(JSON.stringify(L.passport)) : null,
    started: new Date(), need: null, played: [], learned: [], badges: [], obs: [], voice: [], battery: [], concerns: [], plan: null, planStep: 0, welcome: null,
    grade: L.learnGrade != null ? L.learnGrade : S.grade, levels: Object.assign({}, L.learnLevels || {}), history: (L.rows || []).slice(), adaptAuto: L.adaptAuto !== false, adaptOff: Object.assign({}, L.adaptOff || {}), adaptSkip: {} }, L.display || {});
  // A plan from a specialist is for this session only; it stays on record as the last plan used.
  if (L.nextPlan && L.nextPlan.length) { S.plan = L.nextPlan.slice(); S.planBy = L.nextPlanBy || null; L.lastPlan = { steps: L.nextPlan, by: L.nextPlanBy, used: todayIsoDate() }; L.nextPlan = null; } else S.planBy = null;
  applySettings(); assent();
}
function portalAfterSession(id, added) {
  const L = portalLearner(id);
  if (!PORTAL.me || !canSee(PORTAL.me, L)) return welcome();
  (PORTAL.me.role === "parent" ? parentChild : specialistLearner)(id, PORTAL.me.role === "parent" ? "progress" : "overview");
  if (added) flash(`Today's session was added to ${L.nickname}'s history: ${added} new record${added > 1 ? "s" : ""}.`);
}

// ---------- Learner settings travel with the learner ----------
const MY_DEFAULTS = JSON.parse(JSON.stringify(S.my));
const DISPLAY_KEYS = ["theme", "textSize", "font", "contrast", "motion", "autoRead", "quiet"];
// Copy the session's character, My way choices, Support Passport and screen settings back to the learner's profile.
function syncPortalLearner() {
  const L = S.portalLearner ? portalLearner(S.portalLearner) : null; if (!L) return;
  if (S.avatar) L.avatar = Object.assign({}, S.avatar);
  if (S.passport) L.passport = JSON.parse(JSON.stringify(S.passport));
  L.my = JSON.parse(JSON.stringify(S.my));
  L.display = {}; DISPLAY_KEYS.forEach(k => { L.display[k] = S[k]; });
  L.learnGrade = S.grade; L.learnLevels = Object.assign({}, S.levels || {}); // usual level and per-area levels
  savePortal();
}
function describePrefs(L) {
  const m = L.my || {}, d = L.display || {}, out = [];
  if (m.grey) out.push("grey screen"); if (m.palette && m.palette !== "standard") out.push(PALETTES[m.palette].toLowerCase()); if (m.calm) out.push("calm screen"); if (m.plain) out.push("plain words"); if (m.spacing) out.push("extra letter spacing"); if (m.ruler) out.push("reading ruler");
  if (m.how === "listen" || d.autoRead) out.push("read aloud"); if (m.how === "pictures") out.push("pictures"); if (m.scan) out.push("switch scanning"); if (m.dwell) out.push("choose by resting the pointer"); if (m.captions) out.push("captions"); if (m.voiceIn) out.push("answers by speaking");
  if (d.motion) out.push("no movement"); if (d.contrast) out.push("stronger outlines"); if (d.textSize > 1) out.push("larger text"); if (d.quiet) out.push("sound off"); if (d.theme === "dark") out.push("dark screen");
  return out.join(", ");
}

// ---------- Demo data kept in this browser ----------
// Made-up demo accounts stay in this browser (never sent anywhere) so testers can come back to them.
// Sign-in is not kept: after a reload everyone starts signed out, so a child can't open an adult's portal.
const PORTAL_KEY = "tl-demo-portal-v1";
function savePortal() {
  try { localStorage.setItem(PORTAL_KEY, JSON.stringify({ v: 1, seq: PORTAL.seq, accounts: PORTAL.accounts, learners: PORTAL.learners, ruleReviews: PORTAL.ruleReviews || [] })); } catch (e) {}
}
function loadPortal() {
  try {
    const d = JSON.parse(localStorage.getItem(PORTAL_KEY) || "null");
    if (!d || d.v !== 1 || !Array.isArray(d.accounts) || !Array.isArray(d.learners)) return;
    PORTAL.accounts = d.accounts; PORTAL.learners = d.learners; PORTAL.seq = d.seq || 0; PORTAL.ruleReviews = d.ruleReviews || [];
    SEED_ACCOUNTS.forEach(a => { if (!PORTAL.accounts.some(x => x.id === a.id)) PORTAL.accounts.push(JSON.parse(JSON.stringify(a))); });
    // Records of activities that no longer exist (the first Thinking Lab games) are dropped; demo learners get the new sample history.
    PORTAL.learners.forEach(L => { const kept = (L.rows || []).filter(r => exById(r[1])); if (kept.length < (L.rows || []).length && L.demoIndex != null && DEMO[L.demoIndex]) L.rows = DEMO[L.demoIndex].rows.concat(kept.filter(r => !DEMO[L.demoIndex].rows.includes(r))); else L.rows = kept; });
    PORTAL.learners.forEach(L => { if (L.demoIndex != null && DEMO[L.demoIndex]) DEMO[L.demoIndex].rows = L.rows; }); // the demo dashboard shares these histories
  } catch (e) {}
}
window.addEventListener("pagehide", savePortal);
loadPortal();
