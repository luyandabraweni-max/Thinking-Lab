"use strict";

// ---------- Screens: adult setup ----------
function setup() {
  bar("adult"); stopSpeaking();
  render(`
      <section class="card setup">
        <p class="eyebrow">For the grown-up running the session</p>
        <h1>Start a try-out session</h1>
        <p>Nothing is saved. Everything from this session stays on this screen only, and is cleared when you end the session or close the page.</p>
        <div id="installSlot"></div>
        <h2>Learner profile</h2>
        <div class="fields">
          <label for="fCode">Learner code (no names)<input id="fCode" value="${esc(S.code)}" maxlength="20" autocomplete="off"></label>
          <label for="fCohort">Age group<select id="fCohort">
            ${Object.entries(COHORTS).map(([k, v]) => `<option value="${k}"${S.cohort === k ? " selected" : ""}>${v}</option>`).join("")}</select></label>
          <label for="fBand">Challenge<select id="fBand">
            <option value="younger"${S.band === "younger" ? " selected" : ""}>Gentler</option>
            <option value="older"${S.band === "older" ? " selected" : ""}>More challenging</option></select></label>
          <label for="fAnswer">How the learner likes to answer<select id="fAnswer">
            <option value="choose"${S.answer === "choose" ? " selected" : ""}>Pick from pictures</option>
            <option value="build"${S.answer === "build" ? " selected" : ""}>Build it step by step</option></select></label>
          <label for="fLen">Lesson length<select id="fLen">
            <option value="full"${S.lessonLen !== "short" ? " selected" : ""}>Full (all questions)</option>
            <option value="short"${S.lessonLen === "short" ? " selected" : ""}>Shorter (3 questions)</option></select></label>
          <label for="fGrade">Usual level for Learn lessons<select id="fGrade">
            ${levelOptions(curGrade())}</select></label>
        </div>
        <details class="passage"${Object.keys(S.levels).length ? " open" : ""}><summary>A different level for some learning areas</summary>
          <p class="note">For example, a D-CAPS learner may work at Foundation Phase level in maths and higher in life skills.</p>
          <div class="fields">${Object.entries(AREAS).map(([a, [label]]) => `<label for="fLv-${a}">${label}<select id="fLv-${a}" data-area="${a}"><option value="">Same as usual level</option>${levelOptions(S.levels[a])}</select></label>`).join("")}</div>
        </details>
        <p class="note">Age groups are provisional and will be confirmed with specialists. Age changes only the wording and look. Level, challenge and answer style are set separately, because age says nothing about ability.</p>
        <label class="row" for="fAssist" style="flex-direction:row;font-family:var(--font-display)"><input type="checkbox" id="fAssist"${S.assisted ? " checked" : ""}> The learner points and an adult taps for them</label>
        <h2>Screen and sound</h2>
        <div class="fields">
          <label for="fTheme">Colours<select id="fTheme">
            <option value="system">Match this device</option><option value="light"${S.theme === "light" ? " selected" : ""}>Light</option><option value="dark"${S.theme === "dark" ? " selected" : ""}>Dark</option></select></label>
          <label for="fSize">Text size<select id="fSize">
            <option value="1">Standard</option><option value="1.15"${S.textSize == 1.15 ? " selected" : ""}>Larger</option><option value="1.3"${S.textSize == 1.3 ? " selected" : ""}>Largest</option></select></label>
          <label for="fFont">Letters<select id="fFont">
            <option value="atkinson">Clear letters</option><option value="lexend"${S.font === "lexend" ? " selected" : ""}>Wide, easy-reading letters</option></select></label>
          <label for="fPalette">Colour vision<select id="fPalette">
            ${Object.entries(PALETTES).map(([k, v]) => `<option value="${k}"${S.my.palette === k ? " selected" : ""}>${v}</option>`).join("")}</select></label>
        </div>
        <div class="row">
          <label class="row" for="fAuto" style="flex-direction:row"><input type="checkbox" id="fAuto"${S.autoRead ? " checked" : ""}> Read every screen aloud</label>
          <label class="row" for="fContrast" style="flex-direction:row"><input type="checkbox" id="fContrast"${S.contrast ? " checked" : ""}> Stronger outlines</label>
          <label class="row" for="fGrey" style="flex-direction:row"><input type="checkbox" id="fGrey"${S.my.grey ? " checked" : ""}> Greyscale (no colours; games switch to patterns)</label>
          <label class="row" for="fMotion" style="flex-direction:row"><input type="checkbox" id="fMotion"${S.motion ? " checked" : ""}> No movement</label>
          <label class="row" for="fScan" style="flex-direction:row"><input type="checkbox" id="fScan"${S.my.scan ? " checked" : ""}> Switch scanning (one switch or the space bar)</label>
          <label for="fScanSpeed" style="flex-direction:row;align-items:center;gap:8px">Scanning speed <select id="fScanSpeed"><option value="slow"${S.my.scanSpeed === "slow" ? " selected" : ""}>Slow</option><option value="medium"${S.my.scanSpeed === "medium" ? " selected" : ""}>Medium</option><option value="fast"${S.my.scanSpeed === "fast" ? " selected" : ""}>Fast</option></select></label>
        </div>
        <p class="note">English only in this version. Read-aloud is off unless you tick the box above. The learner can always tap Read aloud on any screen, and tap it again to stop. The voice is a recorded synthetic voice built from the LibriTTS dataset (CC BY 4.0) using Piper. Lines without a recording use this device's voice.</p>
        ${S.portalLearner && S.demoLearner == null ? `<p class="note demo-flag">Portal learner: ${esc(S.code)}. This session will be added to their history when you end it.</p>` : ""}
        ${S.demoLearner != null ? `<p class="note demo-flag">Demo learner: ${esc(S.code)}. This made-up session will be added to their demo history when you end it.</p>` : ""}
        <div class="row"><button class="btn primary" id="go" data-focus>Hand over to the learner</button><button class="btn" id="goPortal">Parent and specialist portal</button><button class="btn" id="goDash">Open the demo dashboard</button></div>
        <p class="note">Credits: voice recorded with Piper using the LibriTTS dataset (CC BY 4.0). Fonts: Lexend and Atkinson Hyperlegible (SIL Open Font License). Details in CREDITS.txt.</p>
      </section>`);
  const sync = () => {
    const typed = (document.getElementById("fCode").value || "T01").trim().slice(0, 20); if (typed !== S.code) S.demoLearner = null; S.code = typed;
    const coh = document.getElementById("fCohort").value;
    if (coh !== S.cohort && !bandTouched) { S.band = coh === "3-6" ? "younger" : "older"; document.getElementById("fBand").value = S.band; }
    if (coh !== S.cohort) { if (coh === "3-6") document.getElementById("fAuto").checked = true; S.cohort = coh; if (!gradeTouched) document.getElementById("fGrade").value = DEFAULT_GRADE[coh]; }
    S.cohort = coh;
    S.band = document.getElementById("fBand").value;
    S.answer = document.getElementById("fAnswer").value;
    S.grade = +document.getElementById("fGrade").value;
    S.levels = {}; $main.querySelectorAll("[data-area]").forEach(n => { if (n.value !== "") S.levels[n.dataset.area] = +n.value; });
    S.lessonLen = document.getElementById("fLen").value;
    S.assisted = document.getElementById("fAssist").checked;
    S.theme = document.getElementById("fTheme").value;
    S.textSize = parseFloat(document.getElementById("fSize").value);
    S.font = document.getElementById("fFont").value;
    S.autoRead = document.getElementById("fAuto").checked;
    S.my.how = S.autoRead ? "listen" : (S.my.how === "listen" ? "read" : S.my.how);
    S.my.scan = document.getElementById("fScan").checked; S.my.scanSpeed = document.getElementById("fScanSpeed").value;
    S.contrast = document.getElementById("fContrast").checked;
    S.my.palette = document.getElementById("fPalette").value;
    S.motion = document.getElementById("fMotion").checked;
    S.my.grey = document.getElementById("fGrey").checked;
    applySettings();
  };
  let bandTouched = false, gradeTouched = false;
  document.getElementById("fBand").addEventListener("change", () => { bandTouched = true; });
  document.getElementById("fGrade").addEventListener("change", () => { gradeTouched = true; });
  $main.querySelectorAll("input,select").forEach(n => n.addEventListener("change", sync));
  on("#go", () => { sync(); S.started = new Date(); assent(); });
  on("#goDash", dashboard); on("#goPortal", () => { S.portalLearner = null; S.demoLearner = null; portalHome(); }); renderInstall();
}
