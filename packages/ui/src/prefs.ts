// Display preferences (docs/system-design.md, section 6), applied as attributes on the page root exactly as the live
// app does (js/core/ui.js, js/support/my-way.js), so the shared stylesheet handles every mode.
export interface Prefs {
  theme: "system" | "light" | "dark";
  contrast: boolean;      // high contrast
  grey: boolean;          // greyscale: colour never carries meaning alone
  palette: "standard" | "redgreen" | "blueyellow";
  font: "atkinson" | "lexend";
  size: "normal" | "large" | "larger";
  spacing: boolean;       // wider letter and line spacing
  calm: boolean;          // calm mode: fewer things on screen, no movement
  motion: boolean;        // "No movement"
  plain: boolean;         // plain-language boxes
  pictures: boolean;      // pictures with key words
  speak: boolean;         // read aloud automatically
  captions: boolean;      // show the words when it talks
  rate: "slow" | "normal";
}
export const DEFAULT_PREFS: Prefs = { theme: "system", contrast: false, grey: false, palette: "standard", font: "atkinson", size: "normal", spacing: false, calm: false, motion: false, plain: false, pictures: false, speak: false, captions: false, rate: "normal" };
const SIZES = { normal: "1.15rem", large: "1.3rem", larger: "1.5rem" };

/** Animation only when it can't get in the way: not for "No movement", calm mode, or a device set to reduce motion. */
export const motionAllowed = (p: Prefs) => !p.motion && !p.calm && !globalThis.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

export function applyPrefs(p: Prefs, root: HTMLElement = document.documentElement) {
  const flag = (name: string, on: boolean) => root.toggleAttribute(name, on);
  if (p.theme === "system") root.removeAttribute("data-theme"); else root.setAttribute("data-theme", p.theme);
  if (p.contrast) root.setAttribute("data-contrast", "high"); else root.removeAttribute("data-contrast");
  if (p.palette !== "standard") root.setAttribute("data-palette", p.palette); else root.removeAttribute("data-palette");
  if (p.motion || p.calm) root.setAttribute("data-motion", "reduce"); else root.removeAttribute("data-motion");
  root.setAttribute("data-font", p.font);
  flag("data-grey", p.grey); flag("data-calm", p.calm); flag("data-spacing", p.spacing); flag("data-plain", p.plain); flag("data-pictures", p.pictures);
  flag("data-anim", motionAllowed(p));
  root.style.setProperty("--text", SIZES[p.size]);
}
