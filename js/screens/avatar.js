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
function defaultAvatar() { return { base: "person", skin: 2, hair: "curls", hairCol: 0, eyes: "round", mouth: "smile", extra: "none", top: 0, bg: 0, name: "Star" }; }
function avatarSvg(a, size, label) {
  a = a || defaultAvatar(); size = size || 160;
  const skin = AV.skin[a.skin][0], hc = AV.hairCol[a.hairCol][0], top = AV.top[a.top][0], bg = AV.bg[a.bg][0];
  const name = label || `${a.name}, your character`;
  let back = "", front = "", face = "";
  if (a.base === "robot") {
    face = `<rect x="56" y="48" width="88" height="80" rx="18" fill="${top}"/><rect x="68" y="66" width="64" height="40" rx="10" fill="#F8FAF8"/>
        <line x1="100" y1="48" x2="100" y2="30" stroke="${top}" stroke-width="5"/><circle cx="100" cy="27" r="7" fill="#C2A15A"/>
        <circle cx="86" cy="84" r="6" fill="#2E3A39"/><circle cx="114" cy="84" r="6" fill="#2E3A39"/>
        ${a.mouth === "calm" ? '<line x1="90" y1="98" x2="110" y2="98" stroke="#2E3A39" stroke-width="3" stroke-linecap="round"/>' : `<path d="M88 95 Q100 ${a.mouth === "grin" ? 106 : 102} 112 95" stroke="#2E3A39" stroke-width="3" fill="none" stroke-linecap="round"/>`}
        <rect x="70" y="128" width="60" height="10" rx="4" fill="${top}"/>`;
    return `<svg width="${size}" height="${size}" viewBox="0 0 200 200" role="img" aria-label="${esc(name)}"><circle cx="100" cy="100" r="98" fill="${bg}"/>${face}<path d="M42 200 Q46 150 100 146 Q154 150 158 200 Z" fill="${top}" opacity="0.85"/></svg>`;
  }
  const cap = `<path d="M50 96 Q48 38 100 36 Q152 38 150 96 Q142 60 100 58 Q58 60 50 96 Z" fill="${hc}"/>`;
  if (a.hair === "afro") back = `<circle cx="100" cy="82" r="66" fill="${hc}"/>`;
  if (a.hair === "long") back = `<path d="M46 92 Q44 34 100 32 Q156 34 154 92 L158 170 L42 170 Z" fill="${hc}"/>`;
  if (a.hair === "hijab") back = `<path d="M40 104 Q38 30 100 28 Q162 30 160 104 L164 176 L36 176 Z" fill="${top}" opacity="0.9"/>`;
  if (a.hair === "braids") back = [62, 74, 126, 138].map(x => `<rect x="${x - 5}" y="90" width="10" height="70" rx="5" fill="${hc}"/>`).join("");
  if (a.hair === "locs") back = [58, 70, 82, 118, 130, 142].map((x, i) => `<rect x="${x - 4}" y="88" width="8" height="${60 + (i % 2) * 12}" rx="4" fill="${hc}"/>`).join("");
  if (["short", "braids", "locs", "long"].includes(a.hair)) front = cap;
  if (a.hair === "curls") front = [[60, 66], [72, 50], [88, 42], [104, 40], [120, 44], [134, 54], [142, 70], [56, 82], [146, 86]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="15" fill="${hc}"/>`).join("");
  if (a.hair === "bun") front = cap + `<circle cx="100" cy="30" r="18" fill="${hc}"/>`;
  if (a.hair === "doek") front = `<path d="M46 88 Q44 30 100 26 Q156 30 154 88 Q140 64 100 62 Q60 64 46 88 Z" fill="${top}"/><path d="M128 34 Q160 18 156 50 Q146 40 132 44 Z" fill="${top}"/><path d="M60 60 Q100 46 140 60" stroke="#F8FAF8" stroke-opacity="0.5" stroke-width="4" fill="none"/>`;
  if (a.hair === "hijab") front = `<path d="M54 96 Q52 44 100 42 Q148 44 146 96 Q140 66 100 64 Q60 66 54 96 Z" fill="${top}"/>`;
  const eyes = a.eyes === "happy"
    ? `<path d="M76 98 Q84 90 92 98" stroke="#2E3A39" stroke-width="3.5" fill="none" stroke-linecap="round"/><path d="M108 98 Q116 90 124 98" stroke="#2E3A39" stroke-width="3.5" fill="none" stroke-linecap="round"/>`
    : a.eyes === "wide"
      ? `<circle cx="84" cy="96" r="8" fill="#F8FAF8"/><circle cx="116" cy="96" r="8" fill="#F8FAF8"/><circle cx="85" cy="97" r="4.5" fill="#2E3A39"/><circle cx="117" cy="97" r="4.5" fill="#2E3A39"/>`
      : `<circle cx="84" cy="96" r="5" fill="#2E3A39"/><circle cx="116" cy="96" r="5" fill="#2E3A39"/>`;
  const mouth = a.mouth === "grin" ? `<path d="M84 114 Q100 132 116 114 Z" fill="#2E3A39"/>` : a.mouth === "calm" ? `<line x1="90" y1="118" x2="110" y2="118" stroke="#2E3A39" stroke-width="3.5" stroke-linecap="round"/>` : `<path d="M86 114 Q100 126 114 114" stroke="#2E3A39" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
  let extra = "";
  if (a.extra === "glasses") extra = `<circle cx="84" cy="96" r="13" fill="none" stroke="#2E3A39" stroke-width="3"/><circle cx="116" cy="96" r="13" fill="none" stroke="#2E3A39" stroke-width="3"/><line x1="97" y1="96" x2="103" y2="96" stroke="#2E3A39" stroke-width="3"/>`;
  if (a.extra === "hearing") extra = `<path d="M150 92 Q160 96 156 112 Q152 120 146 116" stroke="#6A86A8" stroke-width="6" fill="none" stroke-linecap="round"/>`;
  if (a.extra === "defenders") extra = `<path d="M46 98 Q46 26 100 24 Q154 26 154 98" stroke="#2E3A39" stroke-width="7" fill="none"/><rect x="36" y="86" width="20" height="32" rx="9" fill="#2E3A39"/><rect x="144" y="86" width="20" height="32" rx="9" fill="#2E3A39"/>`;
  return `<svg width="${size}" height="${size}" viewBox="0 0 200 200" role="img" aria-label="${esc(name)}">
      <circle cx="100" cy="100" r="98" fill="${bg}"/>${back}
      <path d="M40 200 Q44 150 100 146 Q156 150 160 200 Z" fill="${top}"/><rect x="88" y="128" width="24" height="24" fill="${skin}"/>
      <ellipse cx="52" cy="100" rx="8" ry="11" fill="${skin}"/><ellipse cx="148" cy="100" rx="8" ry="11" fill="${skin}"/>
      <circle cx="100" cy="96" r="48" fill="${skin}"/>${front}${eyes}${mouth}${extra}</svg>`;
}
function avatarBuilder(after) {
  inGame = false; mark("avatar", () => avatarBuilder(after)); bar("child");
  const a = S.avatar ? Object.assign({}, S.avatar) : defaultAvatar();
  const say = W("Make your own character. Choose how they look. You can change it any time.", "Design your character. Choose how they look. You can change it any time.");
  currentReturnSay = currentSay = say;
  const group = (key, title, list, swatch) => `<div><p class="eyebrow">${title}</p><div class="choices av-choices">${list.map((it, i) => {
    const v = swatch ? i : it[0], on = a[key] === v;
    return `<button class="choice" data-av="${key}:${v}" aria-pressed="${on}">${swatch ? `<span class="swatch" style="background:${it[0]}" aria-hidden="true"></span>` : ""}<span class="lbl">${esc(it[1])}</span></button>`; }).join("")}</div></div>`;
  const draw = () => {
    render(`
        <section class="card">
          <p class="eyebrow">${W("My character", "My character")}</p>
          <h1>${W("Make your character", "Design your character")}</h1>
          <div class="av-layout">
            <div class="av-preview">${avatarSvg(a, 200)}<p class="lead" style="text-align:center">${esc(a.name)}</p></div>
            <div class="av-options">
              ${group("base", "Character", [["person", "Person"], ["robot", "Robot"]])}
              ${a.base === "person" ? group("skin", "Skin tone", AV.skin, true) + group("hair", "Hair or head covering", AV.hair) + (["doek", "hijab", "none"].includes(a.hair) ? "" : group("hairCol", "Hair colour", AV.hairCol, true)) + group("eyes", "Eyes", AV.eyes) + group("extra", "Extras", AV.extra) : ""}
              ${group("mouth", "Mouth", AV.mouth)}
              ${group("top", a.base === "robot" ? "Robot colour" : "Clothes colour", AV.top, true)}
              ${group("bg", "Background", AV.bg, true)}
              ${group("name", "Name for your character", AV.names.map(n => [n, n]))}
            </div>
          </div>
          <div class="row"><button class="btn primary" id="avDone" data-focus>${W("I like it", "Save my character")}</button><button class="btn" id="avRandom">Surprise me</button></div>
        </section>`);
    setSay(say, false);
    on("[data-av]", e => {
      const [k, v] = e.currentTarget.dataset.av.split(":");
      a[k] = ["skin", "hairCol", "top", "bg"].includes(k) ? +v : v;
      const keep = e.currentTarget.dataset.av; draw();
      const again = $main.querySelector(`[data-av="${keep}"]`); if (again) again.focus({ preventScroll: true });
    });
    on("#avRandom", () => {
      const pick = l => l[Math.floor(Math.random() * l.length)];
      Object.assign(a, { skin: Math.floor(Math.random() * 6), hair: pick(AV.hair)[0], hairCol: Math.floor(Math.random() * 6), eyes: pick(AV.eyes)[0], mouth: pick(AV.mouth)[0], top: Math.floor(Math.random() * 6), bg: Math.floor(Math.random() * 6) });
      draw();
    });
    on("#avDone", () => { S.avatar = Object.assign({}, a); planDone("avatar"); speakNow(`Hello, ${a.name}.`); (after || home)(); });
  };
  draw();
}
