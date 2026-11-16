import { toRow, type ItemRecord } from "@tl/adaptation";
import type { Attempt } from "@tl/data";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { GAMES, THINK, type GameId } from "./catalogue";

// The Thinking Lab kit, ported from js/activities/lab-kit.js. Every game: no timer, up to 3 hints (least to most
// specific), moving on without penalty, a reflection that can be chosen or drawn, and a record of HOW the learner
// worked (tests, changes, predictions), not only the answer.

export type Band = "younger" | "older";
export interface LabRun {
  id: GameId;
  band: Band;
  /** The learner's nickname, for Story Weaver's "Me". */
  learnerName: string;
  /** Respectful wording for older learners: W("game", "activity"). */
  W: (kid: string, grown: string) => string;
  reduceMotion: boolean;
  /** Reads text aloud when the learner has read-aloud on. Screen readers get it from the status regions anyway. */
  say: (text: string) => void;
}
export type GameItem = ItemRecord & { title: string; checks: number; [extra: string]: unknown };
export const newRec = (title: string, extra: Partial<GameItem> = {}): GameItem =>
  ({ title, checks: 0, hints: 0, firstMatched: null, latestMatched: false, movedOn: false, mode: "choose", exampleOpened: false, ...extra });
export interface GameResult { items: GameItem[]; extra: string; reflect: { q: string; options: string[] } }
export interface GameProps { run: LabRun; onFinish: (r: GameResult) => void }

/** Escapes text placed inside game art markup. */
export const esc = (s: string) => s.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
export const pick = <T,>(a: readonly T[]): T => a[Math.floor(Math.random() * a.length)]!;
export function shuffle<T>(a: readonly T[]): T[] {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j]!, b[i]!]; }
  return b;
}

/** Plays frames one after another, or jumps to the last one when movement is off. Stops if the game closes. */
export function usePlayFrames(run: LabRun) {
  const t = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(t.current), []);
  return (n: number, ms: number, frame: (i: number, last: boolean) => void, done: () => void) => {
    clearTimeout(t.current);
    if (run.reduceMotion || n <= 1) { frame(n - 1, true); done(); return; }
    let i = 0;
    const tick = () => { frame(i, i === n - 1); i++; t.current = setTimeout(i < n ? tick : done, ms); };
    tick();
  };
}

export function LabHead({ run, step }: { run: LabRun; step?: string }) {
  return <p className="eyebrow">{GAMES[run.id].name}{step ? ` · ${step}` : ""}</p>;
}

/** Hints, least to most specific. `use()` shows the next one; `onUse` gets how many have been used, for the record. */
export function useHints(hints: string[], run: LabRun, onUse: (n: number) => void) {
  const [hint, setHint] = useState(0);
  return {
    hint, total: hints.length,
    use() { const n = Math.min(hints.length, hint + 1); setHint(n); onUse(n); run.say(hints[n - 1]!); },
    reset() { setHint(0); },
    box: hint ? <div className="hint"><b>Hint {hint} of {hints.length}.</b> {hints[hint - 1]}</div> : null
  };
}

/** The row under a task: the main action, a hint while any are left, extras, and moving on. */
export function LabRow({ main, hints, extra, onSkip }: { main?: { id: string; label: ReactNode; onClick: () => void; disabled?: boolean }; hints?: ReturnType<typeof useHints>; extra?: ReactNode; onSkip?: () => void }) {
  return (
    <div className="row">
      {main ? <button className="btn primary" id={main.id} disabled={main.disabled} onClick={main.onClick}>{main.label}</button> : null}
      {hints && hints.total ? <button className="btn" disabled={hints.hint >= hints.total} onClick={hints.use}>{hints.hint ? "Another hint" : "Use a hint"}</button> : null}
      {extra}
      {onSkip ? <button className="btn quiet" onClick={onSkip}>Move on without an answer</button> : null}
    </div>
  );
}

/** "Something to think about", once the learner has started doing something. */
export const Think = ({ run, acted }: { run: LabRun; acted: boolean }) =>
  acted ? <p className="think"><span className="eyebrow">Something to think about</span><br />{THINK[run.id]}</p> : null;

export const Feedback = ({ text, done }: { text: string; done?: boolean }) =>
  text ? <div className={`feedback${done ? "" : " gentle"}`} role="status">{text}</div> : null;

export const Icon = ({ e }: { e: string }) => <span className="em" aria-hidden="true">{e}</span>;

/**
 * Game art, kept as the same SVG markup the live site draws so the games look identical. Only for markup built by
 * our own code from fixed numbers and words: never pass anything a person typed or said.
 */
export const Art = ({ svg, className }: { svg: string; className?: string }) =>
  <span className={className} style={{ display: "contents" }} dangerouslySetInnerHTML={{ __html: svg }} />;

/** Runs a step after a pause for an animation, or at once when movement is off. Cancelled if the game closes. */
export function useLater() {
  const t = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(t.current), []);
  return (ms: number, fn: () => void) => { clearTimeout(t.current); t.current = setTimeout(fn, ms); };
}

/** Feedback names what the learner did (persistence, a new strategy, careful looking), never a score. */
export function matchedFeedback(items: GameItem[]): [string, string] {
  if (items.some(i => i.open)) return ["You explored new possibilities.", "New idea explored."];
  if (items.length && items.every(i => i.movedOn)) return ["You worked through something difficult.", "Challenge explored."];
  if (items.some(i => (i.hints ?? 0) > 0 && i.latestMatched)) return ["You stayed with the challenge.", "Strong persistence."];
  if (items.some(i => i.checks > 1 && i.latestMatched)) return ["You tried a different approach when your first idea did not work.", "New strategy discovered."];
  if (items.some(i => i.movedOn)) return ["You kept trying.", "Learning continued."];
  return ["You looked carefully before deciding.", "Careful observation."];
}

/** What gets saved: one attempt per round, in the format the adaptation rules read. */
export const toAttempts = (id: GameId | string, items: GameItem[], reflection: string, at = new Date().toISOString()): Omit<Attempt, "id" | "learnerId">[] =>
  items.map(it => { const [, , status, mode, hints, refl, flags] = toRow(it, id, reflection, at.slice(0, 10)); return { activityId: id, status, mode, hints, reflection: refl, flags: flags ?? null, occurredAt: at }; });

/** A canvas to draw on, for reflections and stories. Returns the picture (or null if left blank). */
export function DrawPad({ title, note, onDone }: { title: string; note: string; onDone: (strokes: number, picture: string | null) => void }) {
  const ref = useRef<HTMLCanvasElement>(null), strokes = useRef(0);
  useEffect(() => {
    const c = ref.current, g = c?.getContext("2d");
    if (!c || !g) return;
    g.lineWidth = 10; g.lineCap = "round"; g.lineJoin = "round";
    g.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue("--brand").trim() || "#426C65";
    let down = false;
    const pos = (e: PointerEvent) => { const r = c.getBoundingClientRect(); return [(e.clientX - r.left) * c.width / r.width, (e.clientY - r.top) * c.height / r.height] as const; };
    const start = (e: PointerEvent) => { down = true; strokes.current++; c.setPointerCapture(e.pointerId); const [x, y] = pos(e); g.beginPath(); g.moveTo(x, y); };
    const move = (e: PointerEvent) => { if (!down) return; const [x, y] = pos(e); g.lineTo(x, y); g.stroke(); };
    const up = () => { down = false; };
    c.addEventListener("pointerdown", start); c.addEventListener("pointermove", move); c.addEventListener("pointerup", up);
    return () => { c.removeEventListener("pointerdown", start); c.removeEventListener("pointermove", move); c.removeEventListener("pointerup", up); };
  }, []);
  return (
    <section className="card">
      <h2>{title}</h2>
      <p className="muted">{note}</p>
      <canvas className="pad" ref={ref} width={800} height={600} aria-label="Drawing space" />
      <div className="row">
        <button className="btn" onClick={() => ref.current?.getContext("2d")?.clearRect(0, 0, 800, 600)}>Start again</button>
        <button className="btn primary" onClick={() => { let pic: string | null = null; try { if (strokes.current) pic = ref.current!.toDataURL("image/png"); } catch { /* drawing stays local */ } onDone(strokes.current, pic); }}>Done</button>
      </div>
    </section>
  );
}
