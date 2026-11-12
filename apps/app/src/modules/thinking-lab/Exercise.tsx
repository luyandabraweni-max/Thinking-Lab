import { useState, type ComponentType } from "react";
import { GAMES, type GameId } from "./catalogue";
import { LightGame } from "./games/light/LightGame";
import { DrawPad, matchedFeedback, toAttempts, type GameItem, type GameProps, type GameResult, type LabRun } from "./kit";

// One game from start to finish: intro, play, reflect (choose or draw), then feedback that names what the learner did.
export const PLAYABLE: Partial<Record<GameId, ComponentType<GameProps>>> = { light: LightGame };

type Step = { at: "intro" } | { at: "play" } | { at: "reflect"; r: GameResult } | { at: "draw"; r: GameResult } | { at: "done"; items: GameItem[] };

export function Exercise({ run, onSave, onBack }: { run: LabRun; onSave: (attempts: ReturnType<typeof toAttempts>) => Promise<void>; onBack: () => void }) {
  const info = GAMES[run.id], Game = PLAYABLE[run.id], { W } = run;
  const [step, setStep] = useState<Step>({ at: "intro" }), [saveError, setSaveError] = useState("");
  const finish = (r: GameResult, reflection: string) => {
    setStep({ at: "done", items: r.items });
    onSave(toAttempts(run.id, r.items, reflection)).catch((e: Error) => setSaveError(e.message));
  };
  if (step.at === "intro") return (
    <section className="card">
      <p className="eyebrow">{info.cat}</p>
      <h1>{info.name}</h1>
      <p className="lead">{info.intention}</p>
      <p className="muted">Nothing is timed. You can use a hint, or move on whenever you like.</p>
      <div className="row">
        <button className="btn primary" autoFocus disabled={!Game} onClick={() => { setStep({ at: "play" }); run.say(info.purpose); }}>Begin</button>
        <button className="btn quiet" onClick={onBack}>Back to {W("games", "activities")}</button>
      </div>
      {Game ? null : <p className="muted">This {W("game", "activity")} is being moved to the new app. It's still on the current site.</p>}
    </section>);
  if (step.at === "play" && Game) return <Game run={run} onFinish={r => setStep({ at: "reflect", r })} />;
  if (step.at === "reflect") return (
    <section className="card">
      <p className="eyebrow">{info.name} · Think back</p>
      <h2>{step.r.reflect.q}</h2>
      <div className="choices">{step.r.reflect.options.map((o, i) => <button key={o} className="choice" autoFocus={i === 0} onClick={() => finish(step.r, o)}><span className="lbl">{o}</span></button>)}</div>
      <div className="row"><button className="btn" onClick={() => setStep({ at: "draw", r: step.r })}><span className="em" aria-hidden="true">🎨</span><span>Draw it instead</span></button></div>
    </section>);
  if (step.at === "draw") return <DrawPad title={step.r.reflect.q} note="Draw anything you like. There is no right answer." onDone={n => finish(step.r, n ? "Drew a picture" : "Chose to draw, left it blank")} />;
  if (step.at === "done") {
    const [text, achieve] = matchedFeedback(step.items);
    return (
      <section className="card">
        <h1 className="as-h2">{info.name}</h1>
        <p className="eyebrow">{achieve}</p>
        <div className="feedback" role="status">{text}</div>
        <p>{W("Thank you for playing.", "Thank you for taking part.")}</p>
        {saveError ? <p className="tl-error" role="alert">Your work couldn't be saved on this device: {saveError}</p> : null}
        <div className="row"><button className="btn primary" autoFocus onClick={onBack}>Choose another {W("game", "activity")}</button></div>
      </section>);
  }
  return null;
}
