import { useRef, useState } from "react";
import { Art, Feedback, Icon, LabHead, LabRow, newRec, Think, useHints, usePlayFrames, type GameItem, type GameProps, type LabRun } from "../../kit";
import { VB_TREND, VELD_NAMES, VELD_QS, VELD_START, veldCharts, veldRun, veldScene, veldSummary, veldTrend, type Pop, type Rain, type Trend } from "./logic";

// The learner predicts what one change will do, watches the seasons ripple through the system, then experiments
// with their own veld. Records predictions, and in the open experiment, how many runs and whether they change one thing at a time.
const SEASONS = 8;
export function VeldGame({ run, onFinish }: GameProps) {
  const { W } = run, qs = VELD_QS[run.band], items = useRef<GameItem[]>([]);
  const [step, setStep] = useState<"meet" | number | "sandbox">("meet");
  const next = (rec: GameItem) => { items.current.push(rec); const qi = step as number; setStep(qi + 1 < qs.length ? qi + 1 : "sandbox"); };
  const finish = (rec: GameItem) => {
    const its = [...items.current, rec];
    onFinish({ items: its, extra: `Predictions right: ${its.filter(i => i.prediction && i.firstMatched).length} of ${its.filter(i => i.prediction).length}. Experiment runs: ${rec.runs || 0}, changing one thing at a time on ${rec.fairRuns || 0}.`,
      reflect: { q: W("What surprised you?", "What surprised you most?"), options: ["One change affected everything", "What happened to the grass", "What happened to the animals", "Nothing surprised me"] } });
  };
  if (step === "meet") return (
    <section className="card">
      <LabHead run={run} step="Meet the veld" />
      <h2>Everything is connected</h2>
      <Art svg={veldScene(VELD_START, 1)} />
      <ol className="vb-chain" aria-label="Who needs what"><li><Icon e="🌧️" /><span>Rain</span></li><li><Icon e="🌾" /><span>Grass</span></li><li><Icon e="🦌" /><span>Springbok</span></li><li><Icon e="🐆" /><span>Cheetahs</span></li></ol>
      <p>{W("Rain makes grass grow. Springbok eat grass. Cheetahs eat springbok.", "Rain grows grass, springbok graze it, and cheetahs hunt springbok. Right now the veld is in balance.")}</p>
      <p className="sr">{veldSummary(VELD_START, 0)}</p>
      <div className="row"><button className="btn primary" autoFocus onClick={() => setStep(0)}>Let's see</button></div>
    </section>);
  if (step === "sandbox") return <Sandbox run={run} onDone={finish} />;
  return <Predict key={step} run={run} qi={step} count={qs.length} onNext={next} />;
}

function Predict({ run, qi, count, onNext }: { run: LabRun; qi: number; count: number; onNext: (rec: GameItem) => void }) {
  const { W } = run, q = VELD_QS[run.band][qi]!;
  const [{ series, answer }] = useState(() => { const s = veldRun({ ...VELD_START, ...q.set }, q.rain, SEASONS); return { series: s, answer: veldTrend(s, q.ask) }; });
  const rec = useRef(newRec(`What if: ${q.change}`, { mode: "predicted" }));
  const hints = useHints([W("Follow the chain: rain, then grass, then springbok, then cheetahs.", "Follow the chain step by step from what changed."), "Start with what changes first. What does that do to the next thing in the chain?", q.why.split(". ")[0] + "."], run, n => { rec.current.hints = n; });
  const [guess, setGuess] = useState<Trend | null>(null), [shown, setShown] = useState(0), [watching, setWatching] = useState(false);
  const play = usePlayFrames(run);
  const watch = (g: Trend) => {
    run.say("Watch the seasons go by."); setWatching(true);
    play(SEASONS + 1, 900, i => setShown(i), () => { setShown(SEASONS); setWatching(false); run.say((g === answer ? "Your prediction was right! " : "") + q.why); });
  };
  const part = series.slice(0, shown + 1), now = part[part.length - 1]!;
  return (
    <section className="card">
      <LabHead run={run} step={`Question ${qi + 1} of ${count}`} />
      <h2>{q.change}</h2>
      <Art svg={veldScene(now, q.rain)} />
      {guess ? <Art svg={veldCharts(part, SEASONS + 1)} /> : null}
      <p className="sr" role="status">{guess ? veldSummary(now, shown) : ""}</p>
      {guess ? null : <>
        <h3>{W("What will happen to the", "Predict: what happens to the")} {VELD_NAMES[q.ask]}?</h3>
        <div className="choices">{(Object.entries(VB_TREND) as [Trend, [string, string]][]).map(([k, [e, l]]) =>
          <button key={k} className="choice" onClick={() => { Object.assign(rec.current, { prediction: k, checks: 1, firstMatched: k === answer, latestMatched: k === answer }); setGuess(k); watch(k); }}><Icon e={e} /><span className="lbl">{l}</span></button>)}</div>
        <Think run={run} acted={false} />{hints.box}<LabRow hints={hints} onSkip={() => { rec.current.movedOn = true; onNext(rec.current); }} />
      </>}
      {guess && !watching ? <>
        <Feedback done={guess === answer} text={`${guess === answer ? "Your prediction was right!" : `It turned out ${VB_TREND[answer][1].toLowerCase()}, not ${VB_TREND[guess][1].toLowerCase()}.`} ${q.why}`} />
        <div className="row"><button className="btn primary" autoFocus onClick={() => onNext(rec.current)}>{qi + 1 < count ? "Next question" : "Make your own veld"}</button><button className="btn" onClick={() => watch(guess)}>Watch it again</button></div>
      </> : null}
    </section>
  );
}

// The open experiment: no right answer. It records how the learner explores.
type Setting = "rain" | "cheetah" | "buck";
const OPTS: Record<Setting, [number, string][]> = { rain: [[0, "No rain"], [1, "Some rain"], [2, "Lots of rain"]], cheetah: [[0, "None"], [4, "A few"], [8, "Many"]], buck: [[10, "A few"], [24, "Some"], [40, "Many"]] };
function Sandbox({ run, onDone }: { run: LabRun; onDone: (rec: GameItem) => void }) {
  const { W } = run, rec = useRef(newRec("My own veld", { open: true, runs: 0, fairRuns: 0, mode: "experimented" }));
  const [set, setSet] = useState<Record<Setting, number>>({ rain: 1, cheetah: 4, buck: 24 }), [series, setSeries] = useState<Pop[] | null>(null), [shown, setShown] = useState(0), [busy, setBusy] = useState(false), [acted, setActed] = useState(false);
  const last = useRef<Record<Setting, number> | null>(null), play = usePlayFrames(run);
  const go = () => {
    const r = rec.current; r.runs = (r.runs as number) + 1; setActed(true);
    if (last.current && (["rain", "cheetah", "buck"] as Setting[]).filter(k => last.current![k] !== set[k]).length === 1) r.fairRuns = (r.fairRuns as number) + 1;
    last.current = { ...set };
    const s = veldRun({ grass: VELD_START.grass, buck: set.buck, cheetah: set.cheetah }, set.rain as Rain, SEASONS);
    setSeries(s); setBusy(true);
    play(SEASONS + 1, 700, i => setShown(i), () => { setBusy(false); run.say(veldSummary(s[SEASONS]!, SEASONS)); });
  };
  const now = series ? series[shown]! : { grass: VELD_START.grass, buck: set.buck, cheetah: set.cheetah };
  const group = (k: Setting, label: string) => <><p className="eyebrow">{label}</p><div className="rm-pick" role="group" aria-label={label}>{OPTS[k].map(([v, l]) =>
    <button key={v} className="choice" aria-pressed={set[k] === v} disabled={busy} onClick={() => { setSet(x => ({ ...x, [k]: v })); setSeries(null); }}><span className="lbl">{l}</span></button>)}</div></>;
  return (
    <section className="card">
      <LabHead run={run} step="Your own veld" />
      <h2>{W("Make your own veld", "Run your own experiment")}</h2>
      <Art svg={veldScene(now, set.rain as Rain)} />
      {series ? <Art svg={veldCharts(series.slice(0, shown + 1), SEASONS + 1)} /> : null}
      <p className="sr" role="status">{series ? veldSummary(now, shown) : ""}</p>
      {group("rain", "Rain")}{group("cheetah", "Cheetahs")}{group("buck", "Springbok")}
      <Think run={run} acted={acted} />
      <div className="row">
        <button className="btn primary" disabled={busy} onClick={go}><Icon e="▶️" /><span>Watch {SEASONS} seasons</span></button>
        <button className="btn" disabled={busy} onClick={() => { const r = rec.current; r.latestMatched = (r.runs as number) > 0; if (!r.runs) r.movedOn = true; onDone(r); }}>I've finished exploring</button>
      </div>
    </section>
  );
}
