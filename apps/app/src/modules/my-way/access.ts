// Ways to choose without tapping (ported from js/support/access.js). Both work on whatever is on screen, so every
// module gets them without doing anything: inside an open dialog only that dialog's buttons are used.

const TARGETS = "button:not([disabled]), input:not([disabled]), select:not([disabled]), summary, a[href]";
const visible = (el: Element) => !(el as HTMLElement).closest("[hidden], [inert]") && (el as HTMLElement).getClientRects().length > 0;
function scope(root: Document) {
  const dialogs = root.querySelectorAll<HTMLElement>("[role=dialog][aria-modal=true], [role=alertdialog]");
  return dialogs.length ? dialogs[dialogs.length - 1]! : root;
}
export function scanTargets(root: Document = document, includeHidden = false) {
  return [...scope(root).querySelectorAll<HTMLElement>(TARGETS)].filter(el => includeHidden || visible(el));
}

export const SCAN_MS = { slow: 3200, medium: 2200, fast: 1400 } as const;
/**
 * Single-switch scanning: the highlight moves to the next thing every few seconds, and a switch press (most switch
 * interfaces send Space or Enter) chooses it. Returns a function that stops scanning.
 */
export function startScanning(speed: keyof typeof SCAN_MS, root: Document = document, opts: { includeHidden?: boolean } = {}) {
  const step = () => {
    const t = scanTargets(root, opts.includeHidden);
    if (!t.length) return;
    const next = t[(t.indexOf(root.activeElement as HTMLElement) + 1) % t.length]!;
    root.querySelectorAll(".scan-on").forEach(e => e.classList.remove("scan-on"));
    next.classList.add("scan-on");
    next.focus();
    next.scrollIntoView?.({ block: "nearest" });
  };
  const timer = setInterval(step, SCAN_MS[speed]);
  const press = (e: KeyboardEvent) => {
    const el = root.activeElement as HTMLElement | null;
    if ((e.key === " " || e.key === "Enter") && el?.matches("button, summary")) { e.preventDefault(); el.click(); }
  };
  root.addEventListener("keydown", press);
  return () => { clearInterval(timer); root.removeEventListener("keydown", press); root.querySelectorAll(".scan-on").forEach(e => e.classList.remove("scan-on")); };
}

export const DWELL_MS = { slow: 2000, medium: 1400, fast: 900 } as const;
const DWELL_TARGETS = "button:not([disabled]), summary, input[type=checkbox], input[type=radio]";
/**
 * Choose by resting the pointer: for eye-gaze and head pointers, which move the pointer but can't easily click. A bar
 * fills to show the time left. After a choice, nothing more is chosen until the pointer moves away, so a new screen
 * under a still pointer is never chosen by accident. Touch is left alone: a tap already chooses.
 */
export function startDwell(speed: keyof typeof DWELL_MS, root: Document = document) {
  const ms = DWELL_MS[speed];
  let el: HTMLElement | null = null, timer: ReturnType<typeof setTimeout> | undefined, hold: [number, number] | null = null;
  const stop = () => { clearTimeout(timer); el?.classList.remove("dwelling"); el = null; };
  const move = (e: PointerEvent) => {
    if (e.pointerType === "touch") { stop(); return; }
    if (hold) { if (Math.hypot(e.clientX - hold[0], e.clientY - hold[1]) < 40) return; hold = null; }
    const t = (e.target as Element | null)?.closest?.<HTMLElement>(DWELL_TARGETS) ?? null;
    if (t === el) return;
    stop();
    if (!t || !scope(root).contains(t)) return;
    const at: [number, number] = [e.clientX, e.clientY];
    el = t; t.style.setProperty("--dwell", `${ms}ms`); t.classList.add("dwelling");
    timer = setTimeout(() => { stop(); hold = at; if (t.isConnected) t.click(); }, ms);
  };
  root.addEventListener("pointermove", move);
  root.addEventListener("pointerleave", stop);
  return () => { stop(); root.removeEventListener("pointermove", move); root.removeEventListener("pointerleave", stop); };
}
