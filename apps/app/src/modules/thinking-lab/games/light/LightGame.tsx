import { useRef, useState } from "react";
import { Feedback, Icon, LabHead, LabRow, newRec, Think, useHints, useLater, type GameItem, type GameProps, type LabRun } from "../../kit";
import { LIGHT_PUZZLES, lightTrace, nextMirror, where, type Mirror, type Trace } from "./logic";

// Light the Village (Logical and Analytical Thinking: planning). Records whether the learner plans the mirrors
// before shining the light, or works by trying and adjusting, and how they change a plan that didn't work.
const SUN = <svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="9" fill="var(--gold)" stroke="var(--ink)" strokeWidth="1.2" /><path d="M20 3v5M20 32v5M3 20h5M32 20h5M8 8l3.5 3.5M28.5 28.5L32 32M8 32l3.5-3.5M28.5 11.5L32 8" stroke="var(--gold)" strokeWidth="3" strokeLinecap="round" /></svg>;
const HUT = <svg viewBox="0 0 40 40" aria-hidden="true"><g className="rays" stroke="var(--gold)" strokeWidth="2.4" strokeLinecap="round"><path d="M20 1v4M5 8l3 3M35 8l-3 3" /></g><path d="M5 20 L20 7 L35 20 Z" fill="var(--shape-b)" stroke="var(--ink)" strokeWidth="1.5" strokeLinejoin="round" /><rect x="9" y="20" width="22" height="15" rx="2" fill="var(--surface)" stroke="var(--ink)" strokeWidth="1.5" /><rect className="lamp" x="16" y="24" width="8" height="8" rx="1.5" fill="var(--line)" stroke="var(--ink)" strokeWidth="1.2" /></svg>;
const ROCK = <svg viewBox="0 0 40 40" aria-hidden="true"><path d="M5 32 Q4 22 12 17 Q18 9 27 13 Q36 16 36 26 Q37 32 30 33 H10 Q5 33 5 32 Z" fill="var(--muted)" stroke="var(--ink)" strokeWidth="1.2" /><path d="M13 20 Q18 15 24 17" stroke="var(--surface)" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.6" /></svg>;
const MIRROR = (m: Mirror) => <svg viewBox="0 0 40 40" aria-hidden="true">{m === "/"
  ? <><line x1="7" y1="33" x2="33" y2="7" stroke="var(--ink)" strokeWidth="6" strokeLinecap="round" /><line x1="9" y1="31" x2="31" y2="9" stroke="var(--surface)" strokeWidth="2" strokeLinecap="round" /></>
  : <><line x1="7" y1="7" x2="33" y2="33" stroke="var(--ink)" strokeWidth="6" strokeLinecap="round" /><line x1="9" y1="9" x2="31" y2="31" stroke="var(--surface)" strokeWidth="2" strokeLinecap="round" /></>}</svg>;

export function LightGame({ run, onFinish }: GameProps) {
  const { W } = run, puzzles = LIGHT_PUZZLES[run.band];
  const [pi, setPi] = useState(0), items = useRef<GameItem[]>([]);
  const next = (rec: GameItem) => {
    items.current.push(rec);
    if (pi + 1 < puzzles.length) return setPi(pi + 1);
    onFinish({ items: items.current, extra: `Shines per village: ${items.current.map(i => i.shines).join(", ")}. Mirrors placed before the first shine: ${items.current.map(i => i.mirrorsAtFirstShine ?? 0).join(", ")}.`,
      reflect: { q: W("How did you work it out?", "How did you approach it?"), options: [W("I planned the mirrors first", "I planned before shining"), "I tried, then fixed it", "The hints helped me", "I'm not sure"] } });
  };
  return <Village key={pi} run={run} pi={pi} count={puzzles.length} onNext={next} />;
}

function Village({ run, pi, count, onNext }: { run: LabRun; pi: number; count: number; onNext: (rec: GameItem) => void }) {
  const { W } = run, pz = LIGHT_PUZZLES[run.band][pi]!, N = pz.n + 2;
  const rec = useRef(newRec(pz.title, { shines: 0, changes: 0, mirrorsAtFirstShine: null, mode: "placed mirrors" }));
  const hints = useHints([W("Follow the light from the sun with your finger. Where does it need to turn to reach a hut?", "Trace the beam from the sun. Where must it turn to reach each hut?"),
    `One mirror goes at ${where(pz.fix[0]![0], pz.fix[0]![1])}. It has a dashed edge now.`, "Every square with a dashed edge needs a mirror. Tap a mirror again to tilt it the other way."], run, n => { rec.current.hints = n; });
  const [mirrors, setMirrors] = useState<Record<string, Mirror>>({}), [shown, setShown] = useState<Trace | null>(null);
  const [busy, setBusy] = useState(false), [done, setDone] = useState(false), [fb, setFb] = useState(""), [acted, setActed] = useState(false);
  const later = useLater();
  const at = (list: [number, number][], r: number, c: number) => list.some(x => x[0] === r && x[1] === c);
  const ghosts = hints.hint >= 3 ? pz.fix : hints.hint === 2 ? [pz.fix[0]!] : [];
  const placed = Object.keys(mirrors).length;
  const change = (m: Record<string, Mirror>) => { setMirrors(m); rec.current.changes = (rec.current.changes as number) + 1; setActed(true); setShown(null); setFb(""); };

  const shine = () => {
    const r = rec.current; r.shines = (r.shines as number) + 1; r.checks++; setActed(true);
    if (r.mirrorsAtFirstShine === null) r.mirrorsAtFirstShine = placed;
    const t = lightTrace(pz, mirrors);
    if (r.firstMatched === null) r.firstMatched = t.all; r.latestMatched = t.all;
    setShown(t); setBusy(true); setFb("");
    later(run.reduceMotion ? 0 : 1300, () => {
      setBusy(false);
      const end = t.stop === "rock" ? t.path[t.path.length - 1]! : t.path[t.path.length - 2] ?? t.path[0]!;
      const msg = t.all
        ? (pz.lamps.length > 1 ? "Every hut has light!" : "The hut has light!") + (r.shines === 1 ? W(" You got it on your first try.", " First try.") : W(" You kept going until it worked.", " You tested and adjusted until it worked."))
        : `The light reached ${t.lit.size} of ${pz.lamps.length} hut${pz.lamps.length > 1 ? "s" : ""}. ${t.stop === "rock" ? "It hit a rock" : "It left the village"} at ${where(end[0], end[1])}. ${W("Move a mirror and try again.", "Adjust a mirror and shine again.")}`;
      setDone(t.all); setFb(msg); run.say(msg);
    });
  };

  const lit = shown && !busy ? shown.lit : new Set<string>(), cells = [];
  for (let R = 0; R < N; R++) for (let C = 0; C < N; C++) {
    const r = R - 1, c = C - 1, key = `${r},${c}`;
    if (r < 0 || c < 0 || r >= pz.n || c >= pz.n) { cells.push(<div key={key} className="lt-edge">{r === pz.from[0] && c === pz.from[1] ? SUN : null}</div>); continue; }
    if (at(pz.lamps, r, c)) cells.push(<div key={key} className={`lt-cell lt-hut${lit.has(key) ? " lit" : ""}`} role="img" aria-label={`${where(r, c)}: a hut, lamp ${lit.has(key) ? "lit" : "not lit"}`}>{HUT}</div>);
    else if (at(pz.rocks, r, c)) cells.push(<div key={key} className="lt-cell lt-rock" role="img" aria-label={`${where(r, c)}: a rock`}>{ROCK}</div>);
    else {
      const m = mirrors[key], g = ghosts.some(f => f[0] === r && f[1] === c);
      cells.push(<button key={key} className={`lt-cell${g ? " ghost" : ""}`} disabled={done || busy}
        aria-label={`${where(r, c)}: ${m ? `mirror, tilted ${m === "/" ? "up to the right" : "down to the right"}` : "empty"}${g ? ". A mirror goes here" : ""}`}
        onClick={() => { const n = { ...mirrors }, nm = nextMirror(m); if (nm) n[key] = nm; else delete n[key]; change(n); }}>{m ? MIRROR(m) : null}</button>);
    }
  }
  let beam = null;
  if (shown) {
    const pts = shown.path.map(([r, c]) => [c + 1.5, r + 1.5] as const);
    let len = 0; for (let i = 1; i < pts.length; i++) len += Math.hypot(pts[i]![0] - pts[i - 1]![0], pts[i]![1] - pts[i - 1]![1]);
    beam = <svg className="lt-light" viewBox={`0 0 ${N} ${N}`} aria-hidden="true"><polyline className={`lt-beam${run.reduceMotion ? "" : " go"}`} style={{ ["--len" as string]: len.toFixed(2) }} points={pts.map(p => p.map(v => v.toFixed(2)).join(",")).join(" ")} /></svg>;
  }
  const sunSide = pz.dir[1] === 1 ? "left" : pz.dir[1] === -1 ? "right" : pz.dir[0] === 1 ? "top" : "bottom";
  const clamp = (v: number) => Math.max(0, Math.min(pz.n - 1, v));
  return (
    <section className="card">
      <LabHead run={run} step={`Village ${pi + 1} of ${count}`} />
      <h2>{W("Can the sunlight reach every hut?", "Light every hut with one beam")}</h2>
      <p className="muted">{W("Mirrors turn the light. Rocks stop it.", "Mirrors turn the beam a quarter turn. Rocks stop it.")}</p>
      <p className="muted">{W("Tap a square to put a mirror there. Tap it again to tilt it.", "Tap a square to place a mirror, and again to tilt it.")} Then shine the light.</p>
      <div className="lt-wrap"><div className="lt-board" style={{ gridTemplateColumns: `repeat(${N}, 1fr)` }}>{cells}</div>{beam}</div>
      <p className="sr">The sun shines in from the {sunSide} side, at {where(clamp(pz.from[0]), clamp(pz.from[1]))}. Huts are at {pz.lamps.map(l => where(l[0], l[1])).join("; ")}.
        {pz.rocks.length ? ` Rocks are at ${pz.rocks.map(l => where(l[0], l[1])).join("; ")}.` : ""} {placed} mirror{placed === 1 ? "" : "s"} placed.</p>
      <Think run={run} acted={acted} />
      {hints.box}
      <Feedback text={fb} done={done} />
      {done ? <div className="row"><button className="btn primary" autoFocus onClick={() => onNext(rec.current)}>{pi + 1 < count ? "Next village" : "Finish"}</button></div>
        : <LabRow main={{ id: "ltShine", label: <><Icon e="☀️" /><span>Shine the light</span></>, onClick: shine, disabled: busy }} hints={hints}
            extra={placed ? <button className="btn" disabled={busy} onClick={() => change({})}>Take all the mirrors away</button> : null}
            onSkip={() => { rec.current.movedOn = true; onNext(rec.current); }} />}
    </section>
  );
}
