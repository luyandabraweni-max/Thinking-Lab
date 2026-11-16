import { useEffect, useState } from "react";

// Check-ins and breaks (ported from js/screens/check-in.js and js/support/wellbeing.js). How a learner feels and how
// much energy they have shape this session only: none of it is stored or sent anywhere.

type Face = "happy" | "calm" | "unsure" | "tired" | "worried" | "cross";
export const FEELINGS: [Face, string][] = [["happy", "Happy"], ["calm", "Calm"], ["unsure", "Not sure"], ["tired", "Tired"], ["worried", "Worried"], ["cross", "Cross"]];
const MOUTHS: Record<Face, string> = {
  happy: "M18 30 Q28 40 38 30", calm: "M19 32 Q28 36 37 32", unsure: "M19 33 Q24 30 28 33 Q32 36 37 33",
  tired: "M21 34 L35 34", worried: "M19 36 Q28 29 37 36", cross: "M19 37 Q28 30 37 37"
};
export function FaceIcon({ kind }: { kind: Face }) {
  const line = { stroke: "currentColor", strokeWidth: 3, fill: "none", strokeLinecap: "round" as const };
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" aria-hidden="true" style={{ color: "var(--ink)" }}>
      <circle cx="28" cy="28" r="25" fill="var(--gold-soft)" stroke="var(--gold)" strokeWidth="2" />
      {kind === "tired" ? <path d="M17 23 Q21 25 25 23 M31 23 Q35 25 39 23" {...line} /> : <><circle cx="21" cy="23" r="2.6" fill="currentColor" /><circle cx="35" cy="23" r="2.6" fill="currentColor" /></>}
      <path d={MOUTHS[kind]} {...line} />
      {kind === "cross" ? <path d="M16 17 L24 20 M40 17 L32 20" {...line} /> : null}
    </svg>);
}

export type Need = "start" | "break" | "help";
/** At the start of a session: how are you feeling (or skip), then what would help. */
export function Feelings({ older, say, onDone }: { older: boolean; say: (t: string) => void; onDone: (need: Need) => void }) {
  const [asked, setAsked] = useState(false);
  useEffect(() => { say(asked ? (older ? "Thank you. What would help you right now? Start, a quiet break first, or help from someone?" : "Thank you for telling me. What would help you right now? Start playing, a quiet break first, or help from a grown-up?")
    : "How are you feeling? You can choose a picture, or skip this."); }, [asked, older, say]);
  if (asked) return (
    <section className="card">
      <h1>What would help you right now?</h1>
      <div className="choices">
        <button className="choice" autoFocus onClick={() => onDone("start")}><span className="lbl">{older ? "Start" : "Start playing"}</span></button>
        <button className="choice" onClick={() => onDone("break")}><span className="lbl">A quiet break first</span></button>
        <button className="choice" onClick={() => onDone("help")}><span className="lbl">{older ? "Help from someone" : "Help from a grown-up"}</span></button>
      </div>
    </section>);
  return (
    <section className="card">
      <h1>How are you feeling?</h1>
      <p className="muted">You can choose a picture, or skip this.</p>
      <div className="faces">{FEELINGS.map(([k, l]) => <button key={k} className="choice" onClick={() => setAsked(true)}><FaceIcon kind={k} /><span className="lbl">{l}</span></button>)}</div>
      <div className="row"><button className="btn quiet" autoFocus onClick={() => onDone("start")}>Skip</button></div>
    </section>);
}

const MOVES: [string, string, string][] = [
  ["🙆", "Stretch up high", "Reach your arms up high, as tall as you can. Hold, then let them float down."],
  ["👐", "Shake your hands", "Shake your hands loosely for a count of ten, then let them rest."],
  ["🧱", "Push the wall", "Put your hands flat on a wall and push hard for five seconds. Then relax."],
  ["🔄", "Roll your shoulders", "Roll your shoulders slowly backwards five times."],
  ["🐢", "Slow walk", "Walk slowly around the room, feeling each foot touch the floor."],
  ["🤲", "Squeeze and let go", "Make tight fists for three seconds, then open your hands wide."]
];
/** A break for as long as the learner likes: breathing, or a movement idea. */
export function BreakScreen({ text = "Take a break. Stay as long as you like.", say, onReady }: { text?: string; say: (t: string) => void; onReady: () => void }) {
  const [move, setMove] = useState("");
  useEffect(() => { say(`${text} Breathe in slowly. Breathe out slowly. Press I'm ready when you want to carry on.`); }, [text, say]);
  return (
    <section className="card" style={{ textAlign: "center" }} aria-labelledby="bkH">
      <h2 id="bkH">{text}</h2>
      <div className="breathe" aria-hidden="true">Breathe</div>
      <p>Breathe in slowly. Breathe out slowly.</p>
      <p className="eyebrow">Or try a movement</p>
      <div className="choices moves">{MOVES.map(([e, t, how]) => <button key={t} className="choice" onClick={() => { setMove(how); say(how); }}><span className="em" aria-hidden="true">{e}</span><span className="lbl">{t}</span></button>)}</div>
      <p className="move-say" role="status">{move}</p>
      <div className="row" style={{ justifyContent: "center" }}><button className="btn primary" autoFocus onClick={onReady}>I'm ready</button></div>
    </section>);
}

/** Shown to an adult nearby. */
export function HelpCard({ say, onDone }: { say: (t: string) => void; onDone: () => void }) {
  useEffect(() => { say("I would like some help, please."); }, [say]);
  return (
    <section className="card" style={{ textAlign: "center" }}>
      <p className="eyebrow">Show this to a grown-up</p>
      <h1>I would like some help, please.</h1>
      <div className="row" style={{ justifyContent: "center" }}><button className="btn primary" autoFocus onClick={onDone}>Done</button></div>
    </section>);
}

const BATTERY = ["Empty", "Low", "Good", "Full"];
function BatteryIcon({ level }: { level: number }) {
  const fill = [0, 1, 2, 4][level]!;
  return (
    <svg width="64" height="34" viewBox="0 0 64 34" aria-hidden="true">
      <rect x="2" y="4" width="54" height="26" rx="6" fill="none" stroke="var(--ink)" strokeWidth="3" /><rect x="57" y="12" width="5" height="10" rx="2" fill="var(--ink)" />
      {Array.from({ length: fill }, (_, i) => <rect key={i} x={7 + i * 12} y="9" width="9" height="16" rx="2" fill={level <= 1 ? "var(--gold)" : "var(--ok)"} />)}
    </svg>);
}
export type Energy = "go" | "break" | "short";
/** Every couple of activities: how much energy now? Low energy offers a break or a shorter lesson. */
export function BatteryCheck({ say, onDone }: { say: (t: string) => void; onDone: (choice: Energy) => void }) {
  const [low, setLow] = useState(false);
  useEffect(() => { say(low ? "Thanks for telling me. Low energy is okay. Would you like a break first?" : "How's your battery? How much energy do you have right now?"); }, [low, say]);
  if (low) return (
    <section className="card">
      <h1 className="as-h2">Thanks for telling me.</h1><p>Low energy is okay. Would you like a break first?</p>
      <div className="choices">
        <button className="choice" autoFocus onClick={() => onDone("break")}><span className="em" aria-hidden="true">🌿</span><span className="lbl">Take a break first</span></button>
        <button className="choice" onClick={() => onDone("short")}><span className="em" aria-hidden="true">🪶</span><span className="lbl">Do a short lesson</span></button>
        <button className="choice" onClick={() => onDone("go")}><span className="em" aria-hidden="true">➡️</span><span className="lbl">Keep going</span></button>
      </div>
    </section>);
  return (
    <section className="card">
      <p className="eyebrow">Check-in</p><h1 className="as-h2">How's your battery?</h1>
      <p className="muted">How much energy do you have right now? There is no wrong answer.</p>
      <div className="choices battery">{[3, 2, 1, 0].map(l => <button key={l} className="choice" onClick={() => (l >= 2 ? onDone("go") : setLow(true))}><BatteryIcon level={l} /><span className="lbl">{BATTERY[l]}</span></button>)}</div>
      <div className="row"><button className="btn quiet" onClick={() => onDone("go")}>Skip</button></div>
    </section>);
}

/** Ask about energy before every second activity, but not before the first (the session just started with a check-in). */
export const BATTERY_EVERY = 2;

// The talk board (ported from js/support/talk-board.js): tap a picture and the device says it. Open from every
// learner screen, so a learner who doesn't speak can say "stop", "toilet" or "I feel unsafe" mid-lesson.
export const UNSAFE_WORDS = "I feel unsafe";
const TALK: [string, string][] = [["👍", "Yes"], ["👎", "No"], ["🙋", "I need help"], ["🌿", "I need a break"], ["🔁", "Again, please"], ["✋", "Stop, please"], ["🤷", "I don't know"], ["✅", "I'm finished"],
  ["💧", "I need water"], ["🚻", "I need the toilet"], ["😊", "I like this"], ["🔊", "It's too loud"], ["🛟", UNSAFE_WORDS]];
export function TalkBoard({ say, onUnsafe, onClose }: { say: (t: string) => void; onUnsafe: () => void; onClose: () => void }) {
  const [said, setSaid] = useState("");
  useEffect(() => {
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    addEventListener("keydown", esc);
    return () => removeEventListener("keydown", esc);
  }, [onClose]);
  return (
    <div className="overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="card talk" role="dialog" aria-modal="true" aria-labelledby="tkH">
        <h2 id="tkH">Talk board</h2><p className="muted">Tap a picture to say it.</p>
        <p className="said" role="status">{said}</p>
        <div className="talk-grid">{TALK.map(([e, t]) => <button key={t} className="choice" onClick={() => { if (t === UNSAFE_WORDS) { onUnsafe(); return; } setSaid(t); say(t); }}>
          <span className="em" aria-hidden="true">{e}</span><span className="lbl">{t}</span></button>)}</div>
        <div className="row"><button className="btn primary" autoFocus onClick={onClose}>Close</button></div>
      </div>
    </div>);
}
