"use strict";

// ---------- Motion ----------
// Animation is on only when it can't get in the way: off for "No movement", calm mode and devices set to reduce motion.
// CSS animates only under :root[data-anim], so every effect switches off in one place.
const motionQuery = window.matchMedia ? matchMedia("(prefers-reduced-motion: reduce)") : null;
function motionAllowed() { return !S.motion && !(S.my && S.my.calm) && !(motionQuery && motionQuery.matches); }
function updateMotion() { root.toggleAttribute("data-anim", motionAllowed()); }
if (motionQuery && motionQuery.addEventListener) motionQuery.addEventListener("change", updateMotion);

// Tiles lean towards a mouse pointer, with a soft light where it points.
let tiltedTile = null;
function untilt() { if (tiltedTile) { tiltedTile.style.removeProperty("--mx"); tiltedTile.style.removeProperty("--my"); tiltedTile = null; } }
document.addEventListener("pointermove", e => {
  const t = e.pointerType === "mouse" && root.hasAttribute("data-anim") && e.target.closest ? e.target.closest(".tile:not([aria-disabled='true'])") : null;
  if (t !== tiltedTile) untilt();
  if (!t) return;
  const r = t.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
  t.style.setProperty("--mx", (x * 2 - 1).toFixed(3)); t.style.setProperty("--my", (y * 2 - 1).toFixed(3));
  t.style.setProperty("--px", (x * 100).toFixed(1) + "%"); t.style.setProperty("--py", (y * 100).toFixed(1) + "%");
  tiltedTile = t;
});
document.addEventListener("pointerleave", untilt);

// A ripple spreads from where a button or choice is pressed.
document.addEventListener("pointerdown", e => {
  if (!root.hasAttribute("data-anim") || !e.target.closest) return;
  const b = e.target.closest(".btn:not([disabled]), .choice");
  if (!b) return;
  const r = b.getBoundingClientRect(), d = Math.max(r.width, r.height) * 2;
  const s = document.createElement("span");
  s.className = "ripple"; s.setAttribute("aria-hidden", "true");
  s.style.width = s.style.height = d + "px";
  s.style.left = (e.clientX - r.left - d / 2) + "px"; s.style.top = (e.clientY - r.top - d / 2) + "px";
  b.appendChild(s);
  s.addEventListener("animationend", () => s.remove());
});
