"use strict";

// App tests. Loaded last by tests/run-tests.js, after every script in index.html (which has already booted the app).
(function () {
  let passed = 0, failed = 0;
  const out = typeof print === "function" ? print : console.log;
  const test = (name, fn) => { try { fn(); passed++; out(`ok    ${name}`); } catch (e) { failed++; out(`FAIL  ${name}: ${e && e.message || e}`); } };
  const assert = (cond, msg) => { if (!cond) throw new Error(msg || "assertion failed"); };
  const screen = () => String(document.getElementById("main").innerHTML || "");
  const layer = () => String(document.getElementById("layer").innerHTML || "");
  const text = blob => blobBytes(blob).map(b => String.fromCharCode(b)).join("");

  test("app boots to the welcome screen", () => assert(screen().includes("Parents and guardians") && screen().includes("Try it now"), "welcome not shown"));

  test("all 180 lessons are complete", () => {
    assert(UNITS.length === 180, `expected 180 units, got ${UNITS.length}`);
    UNITS.forEach(u => assert(u.id && u.title && u.questions.length && u.lesson.length && u.reflect && u.example, `unit ${u.id} is incomplete`));
    const lines = window.__TL.allLines();
    assert(Object.keys(lines).length >= 180, "spoken lines missing");
  });

  test("every avatar combination draws a valid picture", () => {
    let n = 0;
    for (const base of ["person", "robot"]) for (const [hair] of AV.hair) for (const [eyes] of AV.eyes) for (const [mouth] of AV.mouth) for (const [extra] of AV.extra) {
      const svg = avatarSvg(Object.assign(defaultAvatar(), { base, hair, eyes, mouth, extra, skin: 5, hairCol: 4, top: 3, bg: 2 }), 200, "", { full: true });
      assert(svg.startsWith("<svg") && svg.endsWith("</svg>"), "not an svg");
      assert(svg.split("<g").length === svg.split("</g>").length, `unbalanced groups: ${base}/${hair}`);
      n++;
    }
    assert(n === 720, `drew ${n}`);
  });

  test("avatar names are cleaned and capped", () => {
    assert(cleanAvatarName("<b>Zoë</b>!!") === "bZoëb", cleanAvatarName("<b>Zoë</b>!!"));
    assert(cleanAvatarName("A".repeat(40)).length === AV_NAME_MAX, "not capped");
    assert(avatarStage(defaultAvatar(), 100, 'Say "hi"').includes("&quot;hi&quot;"), "label not escaped");
  });

  test("motion is off for No movement and calm mode", () => {
    S.motion = true; assert(!motionAllowed(), "No movement ignored"); S.motion = false;
    S.my.calm = true; assert(!motionAllowed(), "calm ignored"); S.my.calm = false;
    assert(motionAllowed(), "should be on");
  });

  test("greyscale sorts by shape and size, never colour", () => {
    S.my.grey = true; gameSort({}); assert(screen().includes("Sort by shape") && !screen().includes("Sort by colour"), "colour rule shown in greyscale");
    S.my.grey = false; gameSort({}); assert(screen().includes("Sort by colour"), "colour rule missing in colour mode");
  });

  test("I feel unsafe gives helplines and records a concern", () => {
    const L = portalLearner("demo-l1"); S.portalLearner = L.id; const before = (L.concerns || []).length;
    feelUnsafe("talk board");
    assert(layer().includes("116"), "no helpline shown");
    assert(L.concerns.length === before + 1 && L.concerns[L.concerns.length - 1].status === "open", "concern not recorded");
    assert(concernsAdultHtml().includes("Safeguarding"), "adult not alerted");
    assert(TALK.some(t => t[1] === UNSAFE) && TELL.some(t => t[1] === UNSAFE), "missing from talk board or Tell us");
    S.portalLearner = null; S.concerns = [];
  });

  test("sensitive lessons end with Who can help me", () => {
    assert(safetyNote(UNITS.find(u => u.id === "gr-body")).includes("Who can help me?"), "missing on body safety");
    assert(safetyNote(UNITS.find(u => u.id === "m4-place")) === "", "shown on a maths lesson");
    SAFEGUARDING_UNITS.forEach(id => assert(UNITS.some(u => u.id === id), `unknown unit ${id}`));
  });

  test("safeguarding concerns stay out of reports", () => {
    const L = portalLearner("demo-l1"), spec = PORTAL.accounts.find(a => a.id === "demo-specialist");
    const rep = JSON.stringify(buildReport(L, "specialist", spec, { support: true, history: true }));
    assert(!/unsafe|safeguarding concern/i.test(rep), "concern leaked into report");
  });

  test("parents see only their children; specialists only shared learners", () => {
    const par = PORTAL.accounts.find(a => a.id === "demo-parent"), spec = PORTAL.accounts.find(a => a.id === "demo-specialist");
    assert(canSee(par, portalLearner("demo-l0")) && !canSee(par, portalLearner("demo-l2")), "parent access wrong");
    assert(canSee(spec, portalLearner("demo-l2")), "specialist access wrong");
    assert(!canSee(null, portalLearner("demo-l0")), "signed-out access");
  });

  test("portal screens render", () => {
    PORTAL.me = PORTAL.accounts.find(a => a.id === "demo-parent");
    parentHome(); assert(screen().includes("My children"), "parent home");
    ["progress", "support", "sharing"].forEach(t => { parentChild("demo-l1", t); assert(screen().includes("Brave Meerkat"), "parent " + t); });
    PORTAL.me = PORTAL.accounts.find(a => a.id === "demo-specialist");
    specialistHome(); assert(screen().includes("My learners"), "specialist home");
    ["overview", "goals", "notes", "profile"].forEach(t => specialistLearner("demo-l1", t));
    assert(screen().includes("Safeguarding"), "safeguarding lead can't see the concern");
    PORTAL.me = null; signIn("parent"); registerStart("parent"); registerStart("specialist"); accountPage();
  });

  test("a learner's character and settings travel with them", () => {
    const L = portalLearner("demo-l0");
    L.my = { grey: true, calm: true }; L.display = { textSize: 1.15 }; L.avatar = Object.assign(defaultAvatar(), { name: "Pip" });
    startPortalSession(L);
    assert(S.my.grey && S.my.calm && S.textSize === 1.15 && S.avatar.name === "Pip", "settings not applied to the session");
    S.avatar.name = "Pip Two"; S.my.plain = true; syncPortalLearner();
    assert(L.avatar.name === "Pip Two" && L.my.plain, "changes not saved back");
    assert(/greyscale/.test(describePrefs(L)), "settings not described");
    S.portalLearner = null; S.my.grey = false; S.my.calm = false; S.my.plain = false; S.textSize = 1;
  });

  test("demo data is kept between visits, but sign-in is not", () => {
    PORTAL.me = PORTAL.accounts[0];
    PORTAL.learners.push({ id: "keep-me", nickname: "Kept", cohort: "3-6", rows: [], goals: [], notes: [], specialists: [], consent: {} });
    savePortal(); PORTAL.learners = PORTAL.learners.filter(L => L.id !== "keep-me"); PORTAL.me = null;
    loadPortal();
    assert(PORTAL.learners.some(L => L.id === "keep-me"), "learner not restored");
    assert(PORTAL.me === null, "sign-in should not be restored");
    assert(DEMO[0].rows === portalLearner("demo-l0").rows, "demo dashboard not re-linked");
    PORTAL.learners = PORTAL.learners.filter(L => L.id !== "keep-me"); savePortal();
  });

  test("reports build as PDF and Word for every learner", () => {
    const spec = PORTAL.accounts.find(a => a.id === "demo-specialist"), par = PORTAL.accounts.find(a => a.id === "demo-parent");
    PORTAL.learners.forEach(L => ["family", "specialist"].forEach(k => {
      const rep = buildReport(L, k, k === "family" ? par : spec, { support: true, history: true });
      const pdf = text(reportToPdf(rep)), docx = blobBytes(reportToDocx(rep));
      assert(pdf.startsWith("%PDF-1.4") && pdf.includes("startxref") && pdf.trim().endsWith("%%EOF"), `bad PDF for ${L.nickname}`);
      assert(docx[0] === 0x50 && docx[1] === 0x4b, `bad Word file for ${L.nickname}`);
    }));
    const L = portalLearner("demo-l1");
    L.notes.push({ date: "2026-11-01", by: "Dr Zoë (OT)", byId: "x", text: "Uses <talk board> & says \"more\" (100%) \\ 😀", shareFamily: true });
    saveFile("sample-report.pdf", blobBytes(reportToPdf(buildReport(L, "specialist", spec, { support: true, history: true }))));
    saveFile("sample-report.docx", blobBytes(reportToDocx(buildReport(L, "specialist", spec, { support: true, history: true }))));
    saveFile("sample-family.pdf", blobBytes(reportToPdf(buildReport(L, "family", par, {}))));
    saveFile("sample-family.docx", blobBytes(reportToDocx(buildReport(L, "family", par, {}))));
    L.notes.pop();
  });

  test("support needs only appear with consent", () => {
    const L = portalLearner("demo-l1"), spec = PORTAL.accounts.find(a => a.id === "demo-specialist");
    assert(JSON.stringify(buildReport(L, "specialist", spec, { support: true })).includes("Support needs"), "missing with consent");
    L.consent.support = false;
    assert(!JSON.stringify(buildReport(L, "specialist", spec, { support: true })).includes("Support needs"), "shown without consent");
    L.consent.support = true;
  });

  out(`\n${passed} passed, ${failed} failed`);
  globalThis.__testResult = { passed, failed };
})();
