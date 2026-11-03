"use strict";

// =====================================================================
// HOME PAGE, AVATAR AND LEARN (CAPS-aligned units, Grades 4 to 6)
// Units are original 2to.iQ content written to CAPS topics. They are not copied from any textbook.
// Each unit follows the Activity Blueprint Standard: learning intention, lesson, worked example,
// practice with up to three hints, a thinking prompt, reflection, matched feedback and observations.
// =====================================================================

// ---------- Avatar ----------
const AV = {
  skin: [["#F3D3B5", "Skin tone 1"], ["#E2B48F", "Skin tone 2"], ["#C68E64", "Skin tone 3"], ["#A0673F", "Skin tone 4"], ["#7A4A2A", "Skin tone 5"], ["#4E2F1C", "Skin tone 6"]],
  hairCol: [["#1F1A17", "Black"], ["#3B2A20", "Dark brown"], ["#6B4A2F", "Brown"], ["#A0522D", "Red-brown"], ["#D9B26A", "Blonde"], ["#9E9E9E", "Grey"]],
  hair: [["short", "Short"], ["curls", "Curls"], ["afro", "Afro"], ["braids", "Braids"], ["locs", "Locs"], ["long", "Long"], ["bun", "Bun"], ["doek", "Head wrap"], ["hijab", "Hijab"], ["none", "No hair"]],
  eyes: [["round", "Round"], ["happy", "Happy"], ["wide", "Wide"]],
  mouth: [["smile", "Smile"], ["grin", "Big smile"], ["calm", "Calm"]],
  extra: [["none", "Nothing"], ["glasses", "Glasses"], ["hearing", "Hearing aid"], ["defenders", "Ear defenders"]],
  top: [["#4D7A72", "Green"], ["#6A86A8", "Blue"], ["#C2A15A", "Gold"], ["#B07D6A", "Clay"], ["#7D6A9A", "Purple"], ["#5E8C68", "Leaf"]],
  bg: [["#DFEBE7", "Mint"], ["#DCE8EC", "Sky"], ["#EFE8D8", "Sand"], ["#F1E1DC", "Shell"], ["#E6E1EF", "Lilac"], ["#E3EEDF", "Fern"]],
  names: ["Star", "River", "Comet", "Sunny", "Pebble", "Nova", "Echo", "Maple", "Breeze", "Ember"]
};
const AV_NAME_MAX = 16;
// The 3D robot needs WebGL and movement allowed; otherwise (and while it loads) the 2D robot drawing stands in.
const can3d = () => typeof motionAllowed === "function" && motionAllowed() && !!window.WebGLRenderingContext
  && !(navigator.connection && navigator.connection.saveData) && !document.documentElement.hasAttribute("data-calm");
function defaultAvatar() { return { base: "person", skin: 2, hair: "curls", hairCol: 0, eyes: "round", mouth: "smile", extra: "none", top: 0, bg: 0, name: "Star" }; }
// Letters (any language), numbers, spaces, hyphens and apostrophes only.
function cleanAvatarName(v) { return String(v || "").replace(/[^\p{L}\p{N} '\-]/gu, "").replace(/\s+/g, " ").trimStart().slice(0, AV_NAME_MAX); }
// Lighten (amt > 0) or darken (amt < 0) a #RRGGBB colour, for the soft 3D shading.
function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16), to = amt < 0 ? 0 : 255, p = Math.abs(amt);
  const mix = c => Math.round(c + (to - c) * p);
  return "#" + [n >> 16, (n >> 8) & 255, n & 255].map(c => mix(c).toString(16).padStart(2, "0")).join("");
}
let avSeq = 0; // gradient ids must be unique when several avatars are on one page
// opts.full adds the waving arm; opts.decorative hides the drawing from screen readers (its button carries the label).
function avatarSvg(a, size, label, opts) {
  a = a || defaultAvatar(); size = size || 160; opts = opts || {};
  const skin = AV.skin[a.skin][0], hc = AV.hairCol[a.hairCol][0], top = AV.top[a.top][0], bg = AV.bg[a.bg][0];
  const name = label || `${a.name}, your character`;
  const id = "av" + (++avSeq), skinF = `url(#${id}s)`, hairF = `url(#${id}h)`, topF = `url(#${id}t)`;
  const ink = "#2E3A39";
  const defs = `<defs>
      <radialGradient id="${id}b" cx="50%" cy="40%" r="65%"><stop offset="0" stop-color="${shade(bg, 0.45)}"/><stop offset="1" stop-color="${shade(bg, -0.06)}"/></radialGradient>
      <radialGradient id="${id}s" cx="38%" cy="30%" r="78%"><stop offset="0" stop-color="${shade(skin, 0.3)}"/><stop offset="0.55" stop-color="${skin}"/><stop offset="1" stop-color="${shade(skin, -0.25)}"/></radialGradient>
      <radialGradient id="${id}h" cx="36%" cy="22%" r="80%"><stop offset="0" stop-color="${shade(hc, 0.32)}"/><stop offset="0.5" stop-color="${hc}"/><stop offset="1" stop-color="${shade(hc, -0.3)}"/></radialGradient>
      <linearGradient id="${id}t" x1="0" y1="0" x2="0.35" y2="1"><stop offset="0" stop-color="${shade(top, 0.25)}"/><stop offset="0.6" stop-color="${top}"/><stop offset="1" stop-color="${shade(top, -0.25)}"/></linearGradient>
      <clipPath id="${id}c"><circle cx="100" cy="100" r="98"/></clipPath>
    </defs>`;
  const svgOpen = `<svg class="av3d${opts.full ? " av-full" : ""}" width="${size}" height="${size}" viewBox="0 0 200 200" ${opts.decorative ? 'aria-hidden="true" focusable="false"' : `role="img" aria-label="${esc(name)}"`}>${defs}<circle cx="100" cy="100" r="98" fill="url(#${id}b)"/><g clip-path="url(#${id}c)"><g class="av-bob">`;
  const svgClose = `</g></g></svg>`;
  const body = `<path d="M40 200 Q44 150 100 146 Q156 150 160 200 Z" fill="${topF}"/><path d="M84 148 Q100 160 116 148" stroke="${shade(top, -0.3)}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  const arm = (sleeve, hand) => opts.full ? `<g class="av-arm"><path d="M62 172 Q46 152 40 126" stroke="${sleeve}" stroke-width="17" fill="none" stroke-linecap="round"/>
      <ellipse cx="38" cy="112" rx="11" ry="13" fill="${hand}"/><ellipse cx="48" cy="119" rx="4" ry="6.5" transform="rotate(35 48 119)" fill="${hand}"/></g>` : "";
  const mouthOpen = cy => `<ellipse class="av-mouth-open" cx="100" cy="${cy}" rx="7" ry="5.5" fill="${ink}" style="transform-origin:100px ${cy}px"/>`;

  if (a.base === "robot" || a.base === "robot3d") {
    const mouth = a.mouth === "calm" ? `<line x1="90" y1="98" x2="110" y2="98" stroke="${ink}" stroke-width="3" stroke-linecap="round"/>` : `<path d="M88 95 Q100 ${a.mouth === "grin" ? 106 : 102} 112 95" stroke="${ink}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
    return svgOpen + body + arm(topF, "#B8C2C0") + `<g class="av-head">
        <line x1="100" y1="48" x2="100" y2="30" stroke="${shade(top, -0.2)}" stroke-width="5"/><circle cx="100" cy="27" r="7" fill="#D9B44A"/><circle cx="98" cy="25" r="2.5" fill="#FFF6D8"/>
        <rect x="56" y="48" width="88" height="80" rx="18" fill="${topF}"/><rect x="62" y="52" width="40" height="10" rx="5" fill="#FFFFFF" opacity="0.18"/>
        <g class="av-face"><rect x="68" y="66" width="64" height="40" rx="10" fill="#F8FAF8"/>
          <g class="av-eyes" style="transform-origin:100px 84px"><g class="av-pupils"><circle cx="86" cy="84" r="6" fill="${ink}"/><circle cx="114" cy="84" r="6" fill="${ink}"/><circle cx="88" cy="82" r="1.8" fill="#FFFFFF"/><circle cx="116" cy="82" r="1.8" fill="#FFFFFF"/></g></g>
          <g class="av-mouth">${mouth}</g>${mouthOpen(98)}</g>
        <rect x="70" y="128" width="60" height="10" rx="4" fill="${shade(top, -0.2)}"/></g>` + svgClose;
  }

  const cap = `<path d="M50 96 Q48 38 100 36 Q152 38 150 96 Q142 60 100 58 Q58 60 50 96 Z" fill="${hairF}"/>`;
  let back = "", front = "";
  if (a.hair === "afro") back = `<circle cx="100" cy="82" r="66" fill="${hairF}"/>`;
  if (a.hair === "long") back = `<path d="M46 92 Q44 34 100 32 Q156 34 154 92 L158 170 L42 170 Z" fill="${hairF}"/>`;
  if (a.hair === "hijab") back = `<path d="M40 104 Q38 30 100 28 Q162 30 160 104 L164 176 L36 176 Z" fill="${topF}"/>`;
  if (a.hair === "braids") back = [62, 74, 126, 138].map(x => `<rect x="${x - 5}" y="90" width="10" height="70" rx="5" fill="${hairF}"/>`).join("");
  if (a.hair === "locs") back = [58, 70, 82, 118, 130, 142].map((x, i) => `<rect x="${x - 4}" y="88" width="8" height="${60 + (i % 2) * 12}" rx="4" fill="${hairF}"/>`).join("");
  if (["short", "braids", "locs", "long"].includes(a.hair)) front = cap;
  if (a.hair === "curls") front = [[60, 66], [72, 50], [88, 42], [104, 40], [120, 44], [134, 54], [142, 70], [56, 82], [146, 86]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="15" fill="${hairF}"/>`).join("");
  if (a.hair === "bun") front = cap + `<circle cx="100" cy="30" r="18" fill="${hairF}"/>`;
  if (a.hair === "doek") front = `<path d="M46 88 Q44 30 100 26 Q156 30 154 88 Q140 64 100 62 Q60 64 46 88 Z" fill="${topF}"/><path d="M128 34 Q160 18 156 50 Q146 40 132 44 Z" fill="${topF}"/><path d="M60 60 Q100 46 140 60" stroke="#F8FAF8" stroke-opacity="0.5" stroke-width="4" fill="none"/>`;
  if (a.hair === "hijab") front = `<path d="M54 96 Q52 44 100 42 Q148 44 146 96 Q140 66 100 64 Q60 66 54 96 Z" fill="${topF}"/>`;
  const glint = (x, y) => `<circle cx="${x}" cy="${y}" r="1.7" fill="#FFFFFF"/>`;
  const eyes = a.eyes === "happy"
    ? `<path d="M76 98 Q84 90 92 98" stroke="${ink}" stroke-width="3.5" fill="none" stroke-linecap="round"/><path d="M108 98 Q116 90 124 98" stroke="${ink}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`
    : a.eyes === "wide"
      ? `<circle cx="84" cy="96" r="8.5" fill="#F8FAF8"/><circle cx="116" cy="96" r="8.5" fill="#F8FAF8"/><g class="av-pupils"><circle cx="85" cy="97" r="5" fill="${ink}"/><circle cx="117" cy="97" r="5" fill="${ink}"/>${glint(87, 95)}${glint(119, 95)}</g>`
      : `<g class="av-pupils"><circle cx="84" cy="96" r="5.5" fill="${ink}"/><circle cx="116" cy="96" r="5.5" fill="${ink}"/>${glint(86, 94)}${glint(118, 94)}</g>`;
  const mouth = a.mouth === "grin" ? `<path d="M84 114 Q100 132 116 114 Z" fill="${ink}"/>` : a.mouth === "calm" ? `<line x1="90" y1="118" x2="110" y2="118" stroke="${ink}" stroke-width="3.5" stroke-linecap="round"/>` : `<path d="M86 114 Q100 126 114 114" stroke="${ink}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
  let glasses = "", onHead = "";
  if (a.extra === "glasses") glasses = `<circle cx="84" cy="96" r="13" fill="#FFFFFF" fill-opacity="0.12" stroke="${ink}" stroke-width="3"/><circle cx="116" cy="96" r="13" fill="#FFFFFF" fill-opacity="0.12" stroke="${ink}" stroke-width="3"/><line x1="97" y1="96" x2="103" y2="96" stroke="${ink}" stroke-width="3"/>`;
  if (a.extra === "hearing") onHead = `<path d="M150 92 Q160 96 156 112 Q152 120 146 116" stroke="#6A86A8" stroke-width="6" fill="none" stroke-linecap="round"/>`;
  if (a.extra === "defenders") onHead = `<path d="M46 98 Q46 26 100 24 Q154 26 154 98" stroke="${ink}" stroke-width="7" fill="none"/><rect x="36" y="86" width="20" height="32" rx="9" fill="${ink}"/><rect x="144" y="86" width="20" height="32" rx="9" fill="${ink}"/>`;
  return svgOpen + `<g class="av-back">${back}</g>${body}
      <rect x="88" y="126" width="24" height="26" fill="${skinF}"/><ellipse cx="100" cy="140" rx="13" ry="5" fill="${shade(skin, -0.35)}" opacity="0.45"/>` + arm(topF, skinF) + `
      <g class="av-head"><ellipse cx="52" cy="100" rx="8" ry="11" fill="${skinF}"/><ellipse cx="148" cy="100" rx="8" ry="11" fill="${skinF}"/>
        <circle cx="100" cy="96" r="48" fill="${skinF}"/><ellipse cx="80" cy="70" rx="15" ry="8" transform="rotate(-28 80 70)" fill="#FFFFFF" opacity="0.16"/>${front}
        <g class="av-face"><ellipse cx="73" cy="111" rx="8" ry="4.5" fill="#E8837A" opacity="0.22"/><ellipse cx="127" cy="111" rx="8" ry="4.5" fill="#E8837A" opacity="0.22"/>
          <path d="M96 104 Q100 109 104 104" stroke="${shade(skin, -0.4)}" stroke-width="2.5" fill="none" stroke-linecap="round" opacity="0.7"/>
          <g class="av-eyes" style="transform-origin:100px 96px">${eyes}</g><g class="av-mouth">${mouth}</g>${mouthOpen(118)}${glasses}</g>${onHead}</g>` + svgClose;
}
// A tappable avatar with a speech bubble. Call wireAvatarStage once per screen on the element around it.
function avatarStage(a, size, tapLabel) {
  const three = a && a.base === "robot3d" ? `<span class="av-3d" aria-hidden="true" data-colour="${AV.top[a.top][0]}" style="background:${AV.bg[a.bg][0]}"></span>` : "";
  return `<div class="av-stage"><button class="av-tap" type="button" aria-label="${esc(tapLabel)}">${avatarSvg(a, size, "", { full: true, decorative: true })}${three}</button><p class="av-bubble" role="status" aria-live="polite"></p></div>`;
}
// Swap in the 3D robot once it has loaded. If it can't load, the drawing simply stays.
let avatar3d = null;
function bring3d(scope) {
  scope.querySelectorAll(".av-3d:not([data-on])").forEach(box => {
    box.setAttribute("data-on", "");
    if (!can3d()) return;
    const st = box.closest(".av-stage");
    (avatar3d || (avatar3d = import(new URL("modules/avatar3d.js", document.baseURI).href)))
      .then(m => m.mount(box, box.dataset.colour))
      .then(r => { if (r) { st._av3d = r; st.classList.add("is3d"); } })
      .catch(() => { avatar3d = null; });
  });
}
// Head, face and eyes lean towards the pointer anywhere inside scope (CSS turns the --tx/--ty values into depth).
function wireAvatarStage(scope) {
  bring3d(scope);
  const set = (x, y) => { scope.style.setProperty("--tx", x.toFixed(3)); scope.style.setProperty("--ty", y.toFixed(3)); };
  scope.addEventListener("pointermove", e => {
    const st = scope.querySelector(".av-stage"); if (!st) return;
    const r = st.getBoundingClientRect(), clamp = v => Math.max(-1, Math.min(1, v));
    set(clamp((e.clientX - (r.left + r.width / 2)) / (r.width * 1.5)), clamp((e.clientY - (r.top + r.height / 2)) / (r.height * 1.5)));
  });
  scope.addEventListener("pointerleave", () => set(0, 0));
}
// The avatar waves and says its own name in a speech bubble (and aloud, unless sound is off).
function avatarSayHello(scope, a) {
  const st = scope.querySelector(".av-stage"); if (!st || !a) return;
  const svg = st.querySelector("svg"), bubble = st.querySelector(".av-bubble"), name = (a.name || "").trim() || defaultAvatar().name;
  const text = `Hi, I'm ${name}!`;
  clearTimeout(st._t1); clearTimeout(st._t2); clearTimeout(st._t3);
  svg.classList.remove("av-waving", "av-talking"); void svg.getBoundingClientRect(); // restart the animation if tapped again
  bubble.textContent = text; bubble.classList.add("show");
  svg.classList.add("av-waving", "av-talking");
  speakNow(text);
  if (st._av3d) st._av3d.wave();
  st._t1 = setTimeout(() => svg.classList.remove("av-talking"), 1800);
  st._t2 = setTimeout(() => svg.classList.remove("av-waving"), 2700);
  st._t3 = setTimeout(() => { bubble.classList.remove("show"); bubble.textContent = ""; }, 4200);
}
function avatarBuilder(after) {
  inGame = false; mark("avatar", () => avatarBuilder(after)); bar("child");
  const a = S.avatar ? Object.assign({}, S.avatar) : defaultAvatar();
  const say = W("Make your own character. Choose how they look and give them a name. You can change it any time.", "Design your character. Choose how they look and give them a name. You can change it any time.");
  currentReturnSay = currentSay = say;
  const group = (key, title, list, swatch) => `<div><p class="eyebrow">${title}</p><div class="choices av-choices">${list.map((it, i) => {
    const v = swatch ? i : it[0], on = a[key] === v;
    return `<button class="choice" data-av="${key}:${v}" aria-pressed="${on}">${swatch ? `<span class="swatch" style="background:${it[0]}" aria-hidden="true"></span>` : ""}<span class="lbl">${esc(it[1])}</span></button>`; }).join("")}</div></div>`;
  const nameGroup = () => `<div class="av-namebox">
      <label class="eyebrow" for="avNameInput">Name for your character</label>
      <input id="avNameInput" class="av-name-input" type="text" maxlength="${AV_NAME_MAX}" autocomplete="off" spellcheck="false" autocapitalize="words" value="${esc(a.name)}" aria-describedby="avNameNote">
      <p class="note" id="avNameNote">${W("Make up a name. Don't use your real full name.", "Use a nickname, not your full real name.")}</p>
      <div class="choices av-choices av-namechips">${AV.names.map(n => `<button class="choice" data-avname="${n}" aria-pressed="${a.name === n}"><span class="lbl">${n}</span></button>`).join("")}</div></div>`;
  const optionsHtml = () => `
      ${nameGroup()}
      ${group("base", "Character", [["person", "Person"], ["robot", "Robot"], ["robot3d", "3D robot"]])}
      ${a.base === "robot3d" ? `<p class="note">${W("The 3D robot moves and waves.", "The 3D robot moves, waves and turns to follow you.")} It needs a bit more data the first time. With No movement or Calm screen on, or on phones that can't show 3D, it shows as a drawing.</p>` : ""}
      ${a.base === "person" ? group("skin", "Skin tone", AV.skin, true) + group("hair", "Hair or head covering", AV.hair) + (["doek", "hijab", "none"].includes(a.hair) ? "" : group("hairCol", "Hair colour", AV.hairCol, true)) + group("eyes", "Eyes", AV.eyes) + group("extra", "Extras", AV.extra) : ""}
      ${group("mouth", "Mouth", AV.mouth)}
      ${group("top", a.base !== "person" ? "Robot colour" : "Clothes colour", AV.top, true)}
      ${group("bg", "Background", AV.bg, true)}`;
  const shownName = () => a.name.trim() || defaultAvatar().name;
  let card;
  // Only the preview and the options are redrawn on each choice, so the screen doesn't jump or replay its entrance.
  const refreshPreview = pop => {
    const holder = document.getElementById("avStage");
    holder.innerHTML = avatarStage(a, 220, `Wave and say hello, ${shownName()}`);
    holder.querySelector(".av-tap").addEventListener("click", () => avatarSayHello(card, a));
    bring3d(holder);
    if (pop) holder.querySelector("svg").classList.add("av-pop");
  };
  const refreshOptions = keep => {
    const box = document.getElementById("avOptions");
    box.innerHTML = optionsHtml(); wireOptions(box);
    if (keep) { const again = box.querySelector(`[data-av="${keep}"], [data-avname="${keep}"]`); if (again) { again.focus({ preventScroll: true }); again.classList.add("pop"); } }
  };
  const setName = v => {
    a.name = cleanAvatarName(v);
    document.getElementById("avName").textContent = shownName();
    const tap = card.querySelector(".av-tap"); if (tap) tap.setAttribute("aria-label", `Wave and say hello, ${shownName()}`);
    card.querySelectorAll("[data-avname]").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.avname === a.name)));
    const input = document.getElementById("avNameInput"); if (input && input.value !== a.name) input.value = a.name; // drops characters that aren't allowed
  };
  const wireOptions = box => {
    box.querySelectorAll("[data-av]").forEach(b => b.addEventListener("click", e => {
      const [k, v] = e.currentTarget.dataset.av.split(":");
      a[k] = ["skin", "hairCol", "top", "bg"].includes(k) ? +v : v;
      refreshPreview(true); refreshOptions(e.currentTarget.dataset.av);
    }));
    box.querySelectorAll("[data-avname]").forEach(b => b.addEventListener("click", e => { setName(e.currentTarget.dataset.avname); avatarSayHello(card, a); }));
    const input = box.querySelector("#avNameInput");
    input.addEventListener("input", () => setName(input.value));
    input.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); setName(input.value); avatarSayHello(card, a); } });
  };
  render(`
      <section class="card av-card">
        <p class="eyebrow">My character</p>
        <h1>${W("Make your character", "Design your character")}</h1>
        <div class="av-layout">
          <div class="av-preview">
            <div id="avStage"></div>
            <p class="lead av-name" id="avName">${esc(shownName())}</p>
            <button class="btn" id="avWave" type="button">${icon("👋")}<span>Wave and say my name</span></button>
            <p class="note av-tip">${W("Tap your character to make it wave.", "Tap your character, or move around it, to bring it to life.")}</p>
          </div>
          <div class="av-options" id="avOptions"></div>
        </div>
        <div class="row"><button class="btn primary" id="avDone" data-focus>${W("I like it", "Save my character")}</button><button class="btn" id="avRandom">Surprise me</button></div>
      </section>`);
  card = $main.querySelector(".av-card");
  setSay(say, false);
  refreshPreview(false); refreshOptions(null); wireAvatarStage(card);
  on("#avWave", () => avatarSayHello(card, a));
  on("#avRandom", () => {
    const pick = l => l[Math.floor(Math.random() * l.length)];
    Object.assign(a, { skin: Math.floor(Math.random() * 6), hair: pick(AV.hair)[0], hairCol: Math.floor(Math.random() * 6), eyes: pick(AV.eyes)[0], mouth: pick(AV.mouth)[0], top: Math.floor(Math.random() * 6), bg: Math.floor(Math.random() * 6) });
    refreshPreview(true); refreshOptions(null);
  });
  on("#avDone", () => {
    a.name = a.name.trim() || defaultAvatar().name;
    S.avatar = Object.assign({}, a); S.avWaveNext = true; planDone("avatar"); syncPortalLearner(); (after || home)();
  });
}
