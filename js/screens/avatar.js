"use strict";

// =====================================================================
// HOME PAGE, AVATAR AND LEARN (CAPS-aligned units, Grades 4 to 6)
// Units are original 2to.iQ content written to CAPS topics. They are not copied from any textbook.
// Each unit follows the Activity Blueprint Standard: learning intention, lesson, worked example,
// practice with up to three hints, a thinking prompt, reflection, matched feedback and observations.
// =====================================================================

// ---------- Avatar ----------
// Illustrated style from the 2to.iQ Avatar System v1.0 (Pholoso Afrika Foundation): bold outlines, big shiny eyes, bright colours.
// This version adds the motion hooks, Calm screen and the engine's planned options (afro, bun, long hair, head wrap, hijab, hearing aid).
const AV = {
  skin: [["#FBD9C0", "Skin tone 1"], ["#F1C09A", "Skin tone 2"], ["#D49A6A", "Skin tone 3"], ["#B57A4E", "Skin tone 4"], ["#8A573A", "Skin tone 5"], ["#6B4430", "Skin tone 6"]],
  hairCol: [["#24203A", "Black"], ["#5A3420", "Dark brown"], ["#8E5A2E", "Brown"], ["#E8572A", "Red"], ["#F07A2A", "Ginger"], ["#F4C542", "Blonde"], ["#7A55B8", "Purple"], ["#9E9E9E", "Grey"]],
  hair: [["short", "Short crop"], ["curls", "Big curls"], ["afro", "Afro"], ["puffs", "Afro puffs"], ["braids", "Braids"], ["locs", "Locs"], ["bob", "Bob with fringe"], ["long", "Long"], ["pigtails", "Pigtails"], ["ponytail", "Ponytail"], ["bun", "Bun"], ["doek", "Head wrap"], ["hijab", "Hijab"], ["none", "No hair"]],
  eyes: [["brown", "Brown eyes"], ["dark", "Dark eyes"], ["blue", "Blue eyes"], ["green", "Green eyes"], ["happy", "Happy, closed"]],
  mouth: [["smile", "Calm smile"], ["grin", "Big smile"], ["calm", "Straight"]],
  extra: [["none", "Nothing"], ["glasses", "Glasses"], ["hearing", "Hearing aid"], ["defenders", "Ear defenders"]],
  cloth: [["tee", "Rocket T-shirt"], ["collar", "Star dress"], ["overalls", "Overalls"], ["jacket", "Jacket"], ["labcoat", "Lab coat"], ["cape", "Wizard cape"]],
  prop: [["none", "Nothing"], ["notebook", "Number notebook"], ["point", "Glowing idea"], ["robot", "Robot friend"], ["telescope", "Telescope"], ["flasks", "Science flasks"], ["wand", "Star wand"], ["globe", "Globe"], ["paint", "Paint palette"], ["tablet", "Tablet"]],
  top: [["#EE7BA6", "Pink"], ["#3D7DD8", "Blue"], ["#4CB848", "Green"], ["#F2BE2A", "Yellow"], ["#8A5CC4", "Purple"], ["#E8613C", "Orange"], ["#2AA79B", "Teal"]],
  bg: [["#F4A3B5", "Pink"], ["#35C9B0", "Sea"], ["#4F9FE8", "Sky"], ["#F9DA5E", "Sun"], ["#5ED8C6", "Mint"], ["#A17BD4", "Lilac"]],
  names: ["Star", "River", "Comet", "Sunny", "Pebble", "Nova", "Echo", "Maple", "Breeze", "Ember"]
};
const AV_EYE = { brown: "#5A3420", dark: "#2A1A12", blue: "#1F2A6B", green: "#2F6B3A" };
const AV_NAME_MAX = 16;
// 3D characters need WebGL and movement allowed; otherwise (and while they load) the matching 2D drawing stands in.
const AV_3D = { robot3d: "robot", person3d: "person" };
const can3d = () => typeof motionAllowed === "function" && motionAllowed() && !!window.WebGLRenderingContext
  && !(navigator.connection && navigator.connection.saveData) && !document.documentElement.hasAttribute("data-calm");
function defaultAvatar() { return { base: "person", skin: 3, hair: "braids", hairCol: 0, eyes: "brown", mouth: "smile", extra: "none", cloth: "jacket", prop: "robot", top: 2, bg: 2, name: "Star" }; }
// Characters saved before the illustrated style get the new fields, and old eye shapes become eye colours.
function fullAvatar(a) {
  const out = Object.assign(defaultAvatar(), a || {}), ok = (k, v) => AV[k].some(x => x[0] === v);
  if (!ok("eyes", out.eyes)) out.eyes = out.eyes === "happy" ? "happy" : "brown";
  ["hair", "mouth", "extra", "cloth", "prop"].forEach(k => { if (!ok(k, out[k])) out[k] = defaultAvatar()[k]; });
  ["skin", "hairCol", "top", "bg"].forEach(k => { if (!AV[k][out[k]]) out[k] = 0; });
  return out;
}
// Letters (any language), numbers, spaces, hyphens and apostrophes only.
function cleanAvatarName(v) { return String(v || "").replace(/[^\p{L}\p{N} '\-]/gu, "").replace(/\s+/g, " ").trimStart().slice(0, AV_NAME_MAX); }
// Lighten (amt > 0) or darken (amt < 0) a #RRGGBB colour.
function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16), to = amt < 0 ? 0 : 255, p = Math.abs(amt);
  const mix = c => Math.round(c + (to - c) * p);
  return "#" + [n >> 16, (n >> 8) & 255, n & 255].map(c => mix(c).toString(16).padStart(2, "0")).join("");
}
let avSeq = 0; // clip ids must be unique when several avatars are on one page

// Drawing parts, kept in one closure so their short names don't reach the shared global scope.
const AV_DRAW = (() => {
  const OL = "#3B2620";
  const P = (d, f) => `<path d="${d}" fill="${f}" stroke="${OL}" stroke-width="2.4" stroke-linejoin="round"/>`;
  const E = (cx, cy, rx, ry, f, t = "") => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${f}" stroke="${OL}" stroke-width="2.4" ${t}/>`;
  const C = (cx, cy, r, f) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${f}" stroke="${OL}" stroke-width="2.2"/>`;
  const blob = (a, c) => a.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r + 2.4}" fill="${OL}"/>`).join("") + a.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/>`).join("");
  const arc = (cx, cy, rx, ry, a0, a1, st, r) => { const o = []; for (let a = a0; a <= a1; a += st) { const t = a * Math.PI / 180; o.push([+(cx + rx * Math.cos(t)).toFixed(1), +(cy - ry * Math.sin(t)).toFixed(1), r]); } return o; };
  const HL = (d, c) => `<path d="${d}" stroke="${shade(c, 0.5)}" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.8"/>`;
  let calm = false; // Calm screen: softer background, no sparkles or glow
  const glow = (x, y, r, c, o) => calm ? "" : `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" opacity="${o}"/>`;
  const sp = (x, y, s, c = "#FFFFFF") => calm ? "" : `<path d="M${x} ${y - s}Q${x} ${y} ${x + s} ${y}Q${x} ${y} ${x} ${y + s}Q${x} ${y} ${x - s} ${y}Q${x} ${y} ${x} ${y - s}Z" fill="${c}" opacity="0.85"/>`;
  const star = (cx, cy, R, r, f) => { const p = []; for (let i = 0; i < 10; i++) { const a = Math.PI / 5 * i - Math.PI / 2, d = i % 2 ? r : R; p.push((cx + d * Math.cos(a)).toFixed(1) + "," + (cy + d * Math.sin(a)).toFixed(1)); } return `<polygon points="${p.join(" ")}" fill="${f}" stroke="${OL}" stroke-width="2" stroke-linejoin="round"/>`; };
  const CAP = "M52 96 Q50 36 100 36 Q150 36 148 96Z", PART = "M54 96 Q52 40 100 40 Q148 40 146 96 Q140 62 100 54 Q60 62 54 96Z";
  // Behind the head
  function back(s, c, w) {
    if (s === "bob") return P("M48 96 Q44 32 100 32 Q156 32 152 96 L154 142 Q100 150 46 142Z", c);
    if (s === "long") return P("M46 96 Q42 30 100 30 Q158 30 154 96 L160 176 Q100 186 40 176Z", c);
    if (s === "pigtails") return P("M62 66 Q26 56 14 92 Q8 124 26 142 Q22 118 36 104 Q48 92 64 88Z", c) + P("M138 66 Q174 56 186 92 Q192 124 174 142 Q178 118 164 104 Q152 92 136 88Z", c) + HL("M30 84 Q22 100 24 120", c) + HL("M170 84 Q178 100 176 120", c);
    if (s === "ponytail") return P("M104 44 Q104 2 136 6 Q124 16 132 20 Q150 6 162 22 Q146 24 150 32 Q166 32 164 50 Q148 42 140 50Z", c) + HL("M118 30 Q126 16 140 14", c);
    if (s === "bun") return blob([[100, 34, 17]], c);
    if (s === "braids") { const sd = x => [0, 1, 2, 3, 4, 5].map(i => [x + (i % 2 ? 2 : -2), 118 + i * 11, 8]); return P(CAP, c) + blob([...sd(56), ...sd(144)], c) + C(56, 186, 4.5, "#E24B4A") + C(144, 186, 4.5, "#E24B4A"); }
    if (s === "curls") return blob(arc(100, 86, 56, 52, -40, 220, 14, 19), c);
    if (s === "afro") return blob(arc(100, 84, 60, 58, -50, 230, 12, 22), c) + `<ellipse cx="100" cy="80" rx="58" ry="54" fill="${c}"/>`;
    if (s === "puffs") return P(CAP, c) + blob([...arc(48, 46, 13, 13, 0, 315, 45, 12), [48, 46, 16]], c) + blob([...arc(152, 46, 13, 13, 0, 315, 45, 12), [152, 46, 16]], c) + C(62, 62, 5, "#F2C230") + C(138, 62, 5, "#F2C230");
    if (s === "locs") return P(CAP, c) + [48, 57, 66, 134, 143, 152].map(x => { const h = x < 100 ? x + 16 : 216 - x; return `<rect x="${x - 4.5}" y="78" width="9" height="${h}" rx="4.5" fill="${c}" stroke="${OL}" stroke-width="2"/><circle cx="${x}" cy="${78 + h}" r="3.5" fill="#F2C230" stroke="${OL}" stroke-width="1.5"/>`; }).join("");
    if (s === "hijab") return P("M38 104 Q36 22 100 22 Q164 22 162 104 L168 176 Q100 190 32 176Z", w);
    return "";
  }
  // Over the forehead
  function front(s, c, w) {
    if (s === "bob") return P("M52 92 Q48 36 100 36 Q152 36 148 92 L146 76 Q100 80 54 76Z", c) + HL("M70 48 Q90 40 112 42", c);
    if (s === "short") return P("M56 88 Q52 46 68 40 L74 30 L84 37 L92 28 L100 35 L108 27 L116 35 L125 30 L132 40 Q148 46 144 88 Q142 66 126 58 Q100 64 74 58 Q58 66 56 88Z", c) + HL("M78 46 Q94 40 112 42", c);
    if (s === "braids" || s === "puffs" || s === "bun" || s === "long") return P(PART, c) + `<path d="M100 41 L100 54" stroke="${shade(c, 0.6)}" stroke-width="1.6"/>` + HL("M66 62 Q78 50 94 47", c) + HL("M106 47 Q122 50 134 62", c);
    if (s === "locs") return P(PART, c) + blob(arc(100, 62, 42, 22, 15, 165, 25, 9), c);
    if (s === "curls") return blob(arc(100, 62, 42, 30, 0, 180, 18, 15), c) + HL("M84 42 Q92 36 102 38", c) + HL("M60 66 Q58 58 62 52", c);
    if (s === "ponytail") return P("M54 96 Q46 70 56 52 Q50 40 66 42 Q78 30 100 36 Q122 30 136 42 Q152 40 146 56 Q156 72 146 96 Q142 72 124 62 L118 72 L108 60 Q96 74 82 64 L76 74 Q60 72 54 96Z", c) + HL("M74 46 Q90 38 108 40", c) + C(112, 42, 6, "#7F77DD");
    if (s === "afro") return blob(arc(100, 62, 44, 26, 10, 170, 16, 13), c) + HL("M80 40 Q96 32 114 36", c);
    if (s === "doek") return P("M50 94 Q46 30 100 26 Q154 30 150 94 Q142 62 100 58 Q58 62 50 94Z", w) + P("M112 32 Q140 2 158 28 Q142 26 130 42Z", w) + P("M108 34 Q84 6 70 30 Q88 26 98 42Z", shade(w, -0.12)) + C(110, 36, 7, shade(w, -0.12)) + HL("M64 56 Q100 40 136 56", w);
    if (s === "hijab") return P("M52 100 Q50 42 100 42 Q150 42 148 100 Q144 66 100 60 Q56 66 52 100Z", w) + HL("M70 50 Q100 40 130 50", w);
    if (s === "none") return HL("M76 58 Q90 50 104 52", "#FFFFFF");
    let o = P("M54 94 Q50 38 100 38 Q150 38 146 94 Q140 70 122 62 Q112 74 96 64 Q80 74 70 64 Q58 74 54 94Z", c) + HL("M72 50 Q88 42 106 44", c);
    if (s === "pigtails") o += C(60, 68, 6, "#7F77DD") + C(140, 68, 6, "#7F77DD");
    return o;
  }
  const TP = "M40 208 Q42 152 100 146 Q158 152 160 208Z";
  const SHD = '<path d="M128 151 Q156 158 158 208 L138 208 Q140 172 128 151Z" fill="#000000" opacity="0.12"/>';
  const rocket = (x, y) => P(`M${x} ${y - 14} Q${x + 7} ${y - 4} ${x + 5} ${y + 8} L${x - 5} ${y + 8} Q${x - 7} ${y - 4} ${x} ${y - 14}Z`, "#EDEDF2") + P(`M${x} ${y - 14} Q${x + 4} ${y - 10} ${x + 5} ${y - 7} L${x - 5} ${y - 7} Q${x - 4} ${y - 10} ${x} ${y - 14}Z`, "#E24B4A") + C(x, y - 1, 2.6, "#5AAEEA")
    + P(`M${x - 5} ${y + 1} L${x - 10} ${y + 10} L${x - 5} ${y + 8}Z`, "#E24B4A") + P(`M${x + 5} ${y + 1} L${x + 10} ${y + 10} L${x + 5} ${y + 8}Z`, "#E24B4A") + P(`M${x - 3} ${y + 8} L${x} ${y + 17} L${x + 3} ${y + 8}Z`, "#F2A23A");
  function cloth(t, c) {
    if (t === "collar") return P(TP, c) + SHD + star(66, 190, 7, 3, "#FFF3DC") + star(126, 196, 6, 2.8, "#F9DA5E") + star(140, 172, 5, 2.4, "#FFF3DC") + star(84, 176, 5, 2.4, "#F9DA5E") + E(46, 164, 16, 12, c) + E(154, 164, 16, 12, c) + `<path d="M32 170 Q46 179 60 171 M140 171 Q154 179 168 170" stroke="#FFFFFF" stroke-width="3.5" fill="none" stroke-linecap="round"/>` + E(90, 151, 12, 7, "#FFFFFF") + E(110, 151, 12, 7, "#FFFFFF");
    if (t === "overalls") { const st = (a, b, x, y) => `<path d="M${a} ${b} L${x} ${y}" stroke="${OL}" stroke-width="11" stroke-linecap="round"/><path d="M${a} ${b} L${x} ${y}" stroke="${shade(c, 0.25)}" stroke-width="6.5" stroke-linecap="round"/>`; return P(TP, shade(c, -0.1)) + SHD + P("M64 174 L136 174 L138 208 L62 208Z", shade(c, 0.25)) + st(70, 176, 82, 149) + st(130, 176, 118, 149) + C(70, 176, 4.5, "#F2C230") + C(130, 176, 4.5, "#F2C230") + P("M86 182 h28 v13 q-14 6 -28 0z", shade(c, 0.1)); }
    if (t === "jacket") return P(TP, c) + SHD + P("M88 146 L100 156 L112 146 L108 164 L92 164Z", "#3D7DD8") + `<path d="M100 164 L100 208" stroke="${OL}" stroke-width="2"/>` + P("M80 148 Q78 140 88 141 L98 160 L92 166Z", shade(c, -0.18)) + P("M120 148 Q122 140 112 141 L102 160 L108 166Z", shade(c, -0.18)) + C(108, 176, 3.5, "#F2C230") + C(108, 190, 3.5, "#F2C230") + C(108, 204, 3.5, "#F2C230");
    if (t === "labcoat") return P(TP, "#FAFAF6") + SHD + P("M86 148 L100 178 L114 148Z", c) + P("M86 147 L93 160 L100 151Z", shade(c, -0.2)) + P("M114 147 L107 160 L100 151Z", shade(c, -0.2)) + `<path d="M86 148 L94 182 L100 180 L106 182 L114 148" fill="none" stroke="${OL}" stroke-width="2"/>`;
    if (t === "cape") return P(TP, c) + P("M42 208 Q44 160 84 149 L72 208Z", shade(c, -0.22)) + P("M158 208 Q156 160 116 149 L128 208Z", shade(c, -0.22)) + P("M80 150 L66 132 L90 146Z", shade(c, -0.3)) + P("M120 150 L134 132 L110 146Z", shade(c, -0.3)) + `<path d="M108 170 a15 15 0 1 0 0 28 a12 12 0 1 1 0 -28z" fill="#F2C230" stroke="${OL}" stroke-width="2"/>` + star(140, 192, 7, 3, "#F9DA5E") + star(150, 170, 5, 2.4, "#F9DA5E") + C(100, 156, 6.5, "#F2C230") + C(100, 156, 3, "#3D7DD8");
    return P(TP, c) + SHD + P("M86 148 Q100 160 114 148 Q100 153 86 148Z", shade(c, -0.2)) + rocket(72, 180);
  }
  // Props held in the hands. The glowing idea and the star wand raise the left arm, which steps aside while the character waves.
  function prop(p, sk, sleeve) {
    const H = (x, y) => C(x, y, 8.5, sk);
    const raised = `<path d="M62 172 L42 140" stroke="${OL}" stroke-width="16" stroke-linecap="round"/><path d="M62 172 L42 140" stroke="${sleeve}" stroke-width="11" stroke-linecap="round"/>`;
    if (p === "notebook") return `<g transform="rotate(-6 142 168)"><rect x="116" y="138" width="52" height="62" rx="4" fill="#FFFBEF" stroke="${OL}" stroke-width="2.4"/><g font-family="sans-serif" font-size="11.5"><text x="121" y="154" fill="#2C2C3A">1+1=2</text><text x="121" y="168" fill="#C2410C">2+3=5</text><text x="121" y="182" fill="#2E7D32">3×2=6</text><text x="121" y="196" fill="#1F5FB8">8−3=5</text></g></g>` + H(166, 170);
    if (p === "point") return `<g class="av-proparm"><text x="6" y="66" font-size="13" fill="#F3FFB0" font-family="sans-serif" font-weight="500">1+2=3</text>${sp(12, 90, 4)}${sp(56, 44, 4)}${sp(22, 40, 3)}${sp(8, 118, 3)}${raised}${glow(41, 111, 13, "#FFF27A", 0.35)}<rect x="37.5" y="110" width="7" height="22" rx="3.5" fill="${sk}" stroke="${OL}" stroke-width="2"/>${C(42, 136, 8.5, sk)}${glow(41, 111, 5, "#FFF8B0", 0.9)}</g>`;
    if (p === "globe") return `<path d="M161 186 L161 196" stroke="${OL}" stroke-width="3"/>` + P("M150 194 h22 v6 h-22z", "#8E5A2E") + C(161, 166, 20, "#5AAEEA") + P("M150 158 q6 -7 12 -2 q2 8 -6 10 q-6 0 -6 -8z", "#4CB848") + P("M164 170 q8 -2 10 4 q-2 8 -8 6 q-4 -4 -2 -10z", "#4CB848") + H(140, 182);
    if (p === "telescope") return `<path d="M162 176 L148 206 M162 176 L178 206" stroke="${OL}" stroke-width="3"/><g transform="rotate(-32 156 160)"><rect x="128" y="153" width="56" height="14" rx="5" fill="#6E7A99" stroke="${OL}" stroke-width="2.2"/><rect x="178" y="149" width="11" height="22" rx="3" fill="#85B7EB" stroke="${OL}" stroke-width="2.2"/></g>` + H(150, 176);
    if (p === "paint") return P("M128 196 Q120 168 146 160 Q174 154 178 176 Q180 190 166 186 Q156 184 156 194 Q156 204 128 196Z", "#F3D9A4") + C(146, 172, 4, "#E24B4A") + C(160, 168, 4, "#378ADD") + C(170, 178, 4, "#F2C230") + C(140, 186, 4, "#4CB848") + `<path d="M152 202 L180 148" stroke="${OL}" stroke-width="6" stroke-linecap="round"/><path d="M152 202 L180 148" stroke="#C98A3E" stroke-width="3" stroke-linecap="round"/>` + C(180, 148, 4, "#8A5CC4") + H(132, 192);
    if (p === "robot") return `<g class="av-proparm"><path d="M31 142 L31 150" stroke="${OL}" stroke-width="2.4"/>` + C(31, 139, 4, "#E24B4A") + `<rect x="14" y="150" width="34" height="27" rx="9" fill="#FFFFFF" stroke="${OL}" stroke-width="2.2"/><rect x="11" y="158" width="4" height="10" rx="2" fill="#E24B4A"/><rect x="47" y="158" width="4" height="10" rx="2" fill="#E24B4A"/><rect x="19" y="156" width="24" height="14" rx="6" fill="#2C2C3A"/><circle cx="26" cy="163" r="3" fill="#5DCAA5"/><circle cx="36" cy="163" r="3" fill="#5DCAA5"/><rect x="18" y="179" width="26" height="24" rx="6" fill="#FFFFFF" stroke="${OL}" stroke-width="2.2"/></g>`;
    if (p === "tablet") return `<g transform="rotate(-10 150 178)"><rect x="126" y="156" width="48" height="40" rx="6" fill="#2C2C3A" stroke="${OL}" stroke-width="2.4"/><rect x="131" y="161" width="38" height="30" rx="3" fill="#E9F7F4"/><circle cx="141" cy="170" r="5" fill="#E8613C"/><polygon points="150,184 158,169 166,184" fill="#F2C230"/><rect x="135" y="179" width="8" height="8" fill="#3D7DD8"/></g>` + H(128, 190);
    if (p === "flasks") return P("M125 152 h8 v14 l10 26 q2 5 -3 5 h-22 q-5 0 -3 -5 l10 -26z", "#FFFFFF") + `<path d="M116 182 L142 182 L145 191 Q146 196 141 196 L117 196 Q112 196 113 191Z" fill="#F9DA5E"/>` + P("M94 164 h8 v8 l12 24 q2 4 -3 4 h-26 q-5 0 -3 -4 l12 -24z", "#FFFFFF") + `<path d="M86 186 L110 186 L113 194 Q114 198 110 198 L86 198 Q82 198 83 194Z" fill="#4FD69C"/>` + P("M57 140 h10 v22 a19 19 0 1 1 -10 0z", "#FFFFFF") + `<path d="M44 182 a18 18 0 0 0 36 0z" fill="#E05BB5"/><circle cx="56" cy="188" r="2" fill="#FFFFFF"/><circle cx="66" cy="192" r="1.5" fill="#FFFFFF"/>` + sp(90, 154, 4) + H(62, 146);
    if (p === "wand") return `<g class="av-proparm">${sp(34, 48, 5)}${sp(6, 96, 4)}${sp(40, 86, 3)}${raised}${glow(17, 68, 18, "#FFF59D", 0.35)}<path d="M42 146 L18 74" stroke="${OL}" stroke-width="6" stroke-linecap="round"/><path d="M42 146 L18 74" stroke="#7A4A1E" stroke-width="3" stroke-linecap="round"/>${star(17, 68, 13, 6, "#FAC775")}${C(40, 136, 8.5, sk)}</g>`;
    return "";
  }
  const eye = (x, col) => col ? `<ellipse cx="${x}" cy="98" rx="11" ry="13" fill="#FFFFFF" stroke="${OL}" stroke-width="2"/><g class="av-pupils"><circle cx="${x + 1}" cy="100" r="8.5" fill="${col}"/><circle cx="${x + 1}" cy="100" r="4" fill="#0D0D1A"/><circle cx="${x + 4}" cy="96" r="3.2" fill="#FFFFFF"/><circle cx="${x - 2}" cy="104" r="1.5" fill="#FFFFFF"/></g><path d="M${x - 11} 94 Q${x} 82 ${x + 11} 94" stroke="${OL}" stroke-width="3" fill="none" stroke-linecap="round"/>`
    : `<path d="M${x - 10} 101 Q${x} 89 ${x + 10} 101" stroke="${OL}" stroke-width="3.4" fill="none" stroke-linecap="round"/>`;
  const mouthOf = m => m === "grin" ? P("M86 119 Q100 140 114 119Z", "#6E1F25") + '<path d="M89 120.5 L111 120.5 L109.5 124 L90.5 124Z" fill="#FFFFFF"/><ellipse cx="100" cy="130" rx="6" ry="3" fill="#F09595"/>'
    : m === "calm" ? `<path d="M90 124 L110 124" stroke="${OL}" stroke-width="2.6" stroke-linecap="round"/>`
    : `<path d="M90 121 Q100 129 110 121" stroke="${OL}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`;
  const mouthOpen = '<ellipse class="av-mouth-open" cx="100" cy="125" rx="7" ry="5.5" fill="#6E1F25" style="transform-origin:100px 125px"/>';
  function extra(x) {
    if (x === "glasses") return `<circle cx="82" cy="98" r="15" fill="#FFFFFF" fill-opacity="0.15" stroke="${OL}" stroke-width="2.4"/><circle cx="118" cy="98" r="15" fill="#FFFFFF" fill-opacity="0.15" stroke="${OL}" stroke-width="2.4"/><path d="M97 96 Q100 93 103 96 M67 96 L58 94 M133 96 L142 94" stroke="${OL}" stroke-width="2.4" fill="none"/>`;
    if (x === "defenders") return `<path d="M50 98 Q48 26 100 26 Q152 26 150 98" stroke="${OL}" stroke-width="10" fill="none"/><path d="M50 98 Q48 26 100 26 Q152 26 150 98" stroke="#5B4FCF" stroke-width="6" fill="none"/><rect x="40" y="84" width="18" height="30" rx="8" fill="#5B4FCF" stroke="${OL}" stroke-width="2.4"/><rect x="142" y="84" width="18" height="30" rx="8" fill="#5B4FCF" stroke="${OL}" stroke-width="2.4"/>`;
    if (x === "hearing") return P("M148 90 Q160 92 158 108 Q156 118 148 116 Q152 106 148 90Z", "#3D7DD8") + C(149, 112, 3, "#F2C230");
    return "";
  }
  const arm = (sleeve, hand) => `<g class="av-arm"><path d="M62 172 Q46 152 38 122" stroke="${OL}" stroke-width="19" fill="none" stroke-linecap="round"/><path d="M62 172 Q46 152 38 122" stroke="${sleeve}" stroke-width="14" fill="none" stroke-linecap="round"/>${C(36, 110, 10, hand)}${E(47, 116, 3.6, 6, hand, 'transform="rotate(35 47 116)"')}</g>`;
  const robotHead = c => `<g class="av-head"><path d="M100 48 L100 30" stroke="${OL}" stroke-width="3"/>${C(100, 26, 6, "#E24B4A")}<rect x="54" y="48" width="92" height="82" rx="20" fill="${c}" stroke="${OL}" stroke-width="2.4"/>${E(52, 92, 6, 12, shade(c, -0.2))}${E(148, 92, 6, 12, shade(c, -0.2))}${HL("M66 58 Q80 52 96 54", c)}
    <g class="av-face"><rect x="64" y="66" width="72" height="50" rx="14" fill="#2C2C3A" stroke="${OL}" stroke-width="2"/><g class="av-eyes" style="transform-origin:100px 86px"><g class="av-pupils"><circle cx="85" cy="86" r="7" fill="#5DCAA5"/><circle cx="115" cy="86" r="7" fill="#5DCAA5"/><circle cx="87" cy="84" r="2.2" fill="#FFFFFF"/><circle cx="117" cy="84" r="2.2" fill="#FFFFFF"/></g></g>
    <g class="av-mouth"><path d="M90 102 Q100 110 110 102" stroke="#5DCAA5" stroke-width="3" fill="none" stroke-linecap="round"/></g><ellipse class="av-mouth-open" cx="100" cy="104" rx="6" ry="4.5" fill="#5DCAA5" style="transform-origin:100px 104px"/></g></g>`;
  // a: a full avatar (see fullAvatar). Returns the inside of a 200 x 200 drawing, without the frame.
  function figure(a, full) {
    const sk = AV.skin[a.skin][0], hc = AV.hairCol[a.hairCol][0], oc = AV.top[a.top][0], wrap = shade(oc, -0.12);
    const robot = a.base === "robot" || a.base === "robot3d", hand = robot ? "#B8C2C0" : sk;
    const sleeve = a.cloth === "overalls" ? shade(oc, -0.1) : a.cloth === "labcoat" ? "#FAFAF6" : oc;
    const brow = a.hairCol < 2 ? shade(hc, 0.15) : a.hairCol === 7 ? shade(hc, -0.3) : "#B8652E";
    const body = cloth(a.cloth, oc) + (full ? arm(sleeve, hand) : "");
    if (robot) return `<g class="av-bob">${P("M88 128 L88 150 L112 150 L112 128Z", "#B8C2C0")}${body}${robotHead(oc)}${prop(a.prop, hand, sleeve)}</g>`;
    const covered = a.hair === "hijab";
    return `<g class="av-bob"><g class="av-back">${back(a.hair, hc, wrap)}</g>${P("M89 124 L89 150 L111 150 L111 124Z", shade(sk, -0.14))}${body}
      ${covered ? P("M60 116 Q100 168 140 116 L146 150 Q100 166 54 150Z", wrap) : ""}
      <g class="av-head">${covered ? "" : E(56, 102, 9, 11, sk) + E(144, 102, 9, 11, sk)}${E(100, 92, 44, 46, sk)}
        <g class="av-face"><g class="av-eyes" style="transform-origin:100px 98px">${eye(82, AV_EYE[a.eyes])}${eye(118, AV_EYE[a.eyes])}</g>
          <path d="M69 79 Q80 71 92 77" stroke="${brow}" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M108 77 Q120 71 131 79" stroke="${brow}" stroke-width="5" fill="none" stroke-linecap="round"/>
          <ellipse cx="68" cy="117" rx="7" ry="4.5" fill="#F08080" opacity="0.45"/><ellipse cx="132" cy="117" rx="7" ry="4.5" fill="#F08080" opacity="0.45"/>
          <path d="M98 108 Q103 112 98 115" stroke="${shade(sk, -0.38)}" stroke-width="2.2" fill="none" stroke-linecap="round"/>
          <g class="av-mouth">${mouthOf(a.mouth)}</g>${mouthOpen}${a.extra === "glasses" ? extra("glasses") : ""}</g>
        ${front(a.hair, hc, wrap)}${a.extra === "glasses" ? "" : extra(a.extra)}</g>${prop(a.prop, sk, sleeve)}</g>`;
  }
  // The whole picture inside the frame. isCalm: Calm screen (softer background, no sparkles or glow).
  function scene(a, full, isCalm) {
    calm = !!isCalm;
    const bg = AV.bg[a.bg][0], out = `<rect width="200" height="200" fill="${calm ? shade(bg, 0.55) : bg}"/>` + sp(26, 24, 5) + sp(180, 24, 5) + sp(184, 110, 4) + figure(a, full);
    calm = false;
    return out;
  }
  return { scene };
})();

// opts.full adds the waving arm; opts.decorative hides the drawing from screen readers (its button carries the label).
function avatarSvg(a, size, label, opts) {
  a = fullAvatar(a); size = size || 160; opts = opts || {};
  const id = "av" + (++avSeq), name = label || `${a.name}, your character. ${describeAvatar(a)}`;
  const calm = opts.calm != null ? opts.calm : !!(typeof S !== "undefined" && S.my && S.my.calm);
  return `<svg class="av3d${opts.full ? " av-full" : ""}" width="${size}" height="${size}" viewBox="0 0 200 200" ${opts.decorative ? 'aria-hidden="true" focusable="false"' : `role="img" aria-label="${esc(name)}"`}>`
    + `<defs><clipPath id="${id}c"><rect x="2.5" y="2.5" width="195" height="195" rx="22"/></clipPath></defs>`
    + `<g clip-path="url(#${id}c)">${AV_DRAW.scene(a, opts.full, calm)}</g>`
    + `<rect x="2.5" y="2.5" width="195" height="195" rx="22" fill="none" stroke="#FFF3DC" stroke-width="5"/></svg>`;
}
// Plain-language description for screen readers.
function describeAvatar(a) {
  a = fullAvatar(a);
  const label = (k, v) => (AV[k].find(x => x[0] === v) || [, v])[1].toLowerCase();
  if (a.base === "robot" || a.base === "robot3d") return `A robot wearing ${label("cloth", a.cloth)}${a.prop === "none" ? "" : `, holding a ${label("prop", a.prop)}`}.`;
  const hair = a.hair === "none" ? "no hair" : a.hair === "hijab" ? "a hijab" : a.hair === "doek" ? "a head wrap" : label("hair", a.hair);
  const parts = [`A child with ${hair}`, `wearing a ${label("cloth", a.cloth)}`];
  if (a.extra !== "none") parts.push(`with ${label("extra", a.extra)}`);
  if (a.prop !== "none") parts.push(`holding a ${label("prop", a.prop)}`);
  return parts.join(", ") + (a.mouth === "grin" ? ", smiling widely." : a.mouth === "calm" ? "." : ", smiling calmly.");
}
// The 2to.iQ Avatar System's two ready-made sets, as starting points in the builder.
const AV_SETS = [
  ["Number explorer", { skin: 0, hairCol: 3, hair: "pigtails", top: 0, cloth: "collar", bg: 0, extra: "none", mouth: "smile", prop: "notebook", eyes: "blue" }],
  ["Idea spark", { skin: 0, hairCol: 5, hair: "ponytail", top: 1, cloth: "overalls", bg: 1, extra: "none", mouth: "smile", prop: "point", eyes: "blue" }],
  ["Robot builder", { skin: 3, hairCol: 0, hair: "braids", top: 2, cloth: "jacket", bg: 2, extra: "none", mouth: "smile", prop: "robot", eyes: "brown" }],
  ["Sky watcher", { skin: 0, hairCol: 1, hair: "short", top: 3, cloth: "tee", bg: 3, extra: "none", mouth: "smile", prop: "telescope", eyes: "brown" }],
  ["Lab scientist", { skin: 0, hairCol: 6, hair: "bob", top: 6, cloth: "labcoat", bg: 4, extra: "glasses", mouth: "smile", prop: "flasks", eyes: "blue" }],
  ["Story wizard", { skin: 0, hairCol: 4, hair: "curls", top: 4, cloth: "cape", bg: 5, extra: "none", mouth: "grin", prop: "wand", eyes: "blue" }],
  ["World finder", { skin: 5, hairCol: 0, hair: "puffs", top: 3, cloth: "tee", bg: 4, extra: "none", mouth: "grin", prop: "globe", eyes: "brown" }],
  ["Star gazer", { skin: 4, hairCol: 0, hair: "locs", top: 2, cloth: "jacket", bg: 2, extra: "defenders", mouth: "smile", prop: "telescope", eyes: "brown" }],
  ["Colour maker", { skin: 1, hairCol: 0, hair: "bob", top: 1, cloth: "overalls", bg: 5, extra: "glasses", mouth: "smile", prop: "paint", eyes: "blue" }],
  ["Robot coder", { skin: 2, hairCol: 1, hair: "short", top: 4, cloth: "labcoat", bg: 3, extra: "none", mouth: "grin", prop: "robot", eyes: "brown" }],
  ["Shape solver", { skin: 0, hairCol: 5, hair: "pigtails", top: 5, cloth: "collar", bg: 1, extra: "none", mouth: "smile", prop: "tablet", eyes: "blue" }],
  ["Spell weaver", { skin: 3, hairCol: 0, hair: "braids", top: 6, cloth: "cape", bg: 0, extra: "none", mouth: "grin", prop: "wand", eyes: "brown" }]];
// Codes in the Avatar System's format ("skin-hair-outfit-bg-eye-style-cloth-acc-mouth-prop"), so other 2to.iQ apps
// can show the same character. Options the engine doesn't have yet (robot, head wrap, hijab, hearing aid...) give null.
const AV_ENGINE = { style: ["pigtails", "ponytail", "braids", "short", "bob", "curls", "puffs", "locs"], cloth: ["collar", "overalls", "jacket", "tee", "labcoat", "cape"],
  acc: ["none", "glasses", "defenders"], mouth: ["smile", "grin"], prop: ["notebook", "point", "robot", "telescope", "flasks", "wand", "globe", "paint", "tablet", "none"], eye: ["blue", "brown"] };
function avatarCode(a) {
  a = fullAvatar(a);
  const n = [a.skin, a.hairCol, a.top, a.bg, AV_ENGINE.eye.indexOf(a.eyes), AV_ENGINE.style.indexOf(a.hair), AV_ENGINE.cloth.indexOf(a.cloth), AV_ENGINE.acc.indexOf(a.extra), AV_ENGINE.mouth.indexOf(a.mouth), AV_ENGINE.prop.indexOf(a.prop)];
  return a.base === "person" && a.hairCol < 7 && n.every(x => x >= 0) ? n.join("-") : null;
}
function avatarFromCode(code, name) {
  const n = String(code).split("-").map(Number), at = (k, i) => AV_ENGINE[k][n[i]];
  return fullAvatar({ base: "person", skin: n[0], hairCol: n[1], top: n[2], bg: n[3], eyes: at("eye", 4), hair: at("style", 5), cloth: at("cloth", 6), extra: at("acc", 7), mouth: at("mouth", 8), prop: at("prop", 9), name: name || defaultAvatar().name });
}

// A tappable avatar with a speech bubble. Call wireAvatarStage once per screen on the element around it.
function avatarStage(a, size, tapLabel) {
  a = a && fullAvatar(a);
  const kind = a && AV_3D[a.base], colours = kind && JSON.stringify({ top: AV.top[a.top][0], skin: AV.skin[a.skin][0], hair: AV.hairCol[a.hairCol][0] });
  const three = kind ? `<span class="av-3d" aria-hidden="true" data-kind="${kind}" data-colours='${colours}' style="background:${AV.bg[a.bg][0]}"></span>` : "";
  return `<div class="av-stage"><button class="av-tap" type="button"><span class="sr av-tap-label">${esc(tapLabel)}</span>${avatarSvg(a, size, "", { full: true, decorative: true })}${three}</button><p class="av-bubble" role="status" aria-live="polite"></p></div>`;
}
// Swap in the 3D character once it has loaded. If it can't load, the drawing simply stays.
let avatar3d = null;
function bring3d(scope) {
  scope.querySelectorAll(".av-3d:not([data-on])").forEach(box => {
    box.setAttribute("data-on", "");
    if (!can3d()) return;
    const st = box.closest(".av-stage");
    (avatar3d || (avatar3d = import(new URL("modules/avatar3d.js", document.baseURI).href)))
      .then(m => m.mount(box, box.dataset.kind, JSON.parse(box.dataset.colours)))
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
  const a = fullAvatar(S.avatar);
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
  const setsHtml = () => `<div><p class="eyebrow">Start from a character</p><div class="av-sets">${AV_SETS.map(([t, c], i) => `<button class="av-set" type="button" data-avset="${i}">${avatarSvg(c, 64, "", { decorative: true })}<span>${esc(t)}</span><span class="sr">: ${esc(describeAvatar(c))}</span></button>`).join("")}</div></div>`;
  const optionsHtml = () => `
      ${nameGroup()}
      ${setsHtml()}
      ${group("base", "Character", [["person", "Person"], ["robot", "Robot"], ["person3d", "3D person"], ["robot3d", "3D robot"]])}
      ${AV_3D[a.base] ? `<p class="note">${W("Your 3D character moves and waves.", "Your 3D character moves, waves and turns to follow you.")} It needs a bit more data the first time. With No movement or Calm screen on, or on phones that can't show 3D, it shows as a drawing.${a.base === "person3d" ? " The 3D person has one hairstyle; your hair choice shows in the drawing." : ""}</p>` : ""}
      ${a.base === "person" || a.base === "person3d" ? group("skin", "Skin tone", AV.skin, true) + group("hair", "Hair or head covering", AV.hair) + (["doek", "hijab", "none"].includes(a.hair) ? "" : group("hairCol", "Hair colour", AV.hairCol, true)) + group("eyes", "Eyes", AV.eyes) + group("extra", "Extras", AV.extra) + group("mouth", "Expression", AV.mouth) : ""}
      ${group("cloth", "Clothes", AV.cloth)}
      ${group("top", a.base === "robot" || a.base === "robot3d" ? "Robot colour" : "Clothes colour", AV.top, true)}
      ${group("prop", "Holding", AV.prop)}
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
    if (keep) { const again = box.querySelector(`[data-av="${keep}"], [data-avname="${keep}"], [data-avset="${keep}"]`); if (again) { again.focus({ preventScroll: true }); again.classList.add("pop"); } }
  };
  const setName = v => {
    a.name = cleanAvatarName(v);
    document.getElementById("avName").textContent = shownName();
    const tap = card.querySelector(".av-tap-label"); if (tap) tap.textContent = `Wave and say hello, ${shownName()}`;
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
    box.querySelectorAll("[data-avset]").forEach(b => b.addEventListener("click", e => {
      Object.assign(a, { base: "person" }, AV_SETS[+e.currentTarget.dataset.avset][1]); // keeps the name
      refreshPreview(true); refreshOptions(e.currentTarget.dataset.avset);
    }));
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
    const n = l => Math.floor(Math.random() * l.length);
    Object.assign(a, { skin: n(AV.skin), hair: pick(AV.hair)[0], hairCol: n(AV.hairCol), eyes: pick(AV.eyes)[0], mouth: pick(AV.mouth)[0], cloth: pick(AV.cloth)[0], prop: pick(AV.prop)[0], top: n(AV.top), bg: n(AV.bg) });
    refreshPreview(true); refreshOptions(null);
  });
  on("#avDone", () => {
    a.name = a.name.trim() || defaultAvatar().name;
    S.avatar = Object.assign({}, a); S.avWaveNext = true; planDone("avatar"); syncPortalLearner(); (after || home)();
  });
}
