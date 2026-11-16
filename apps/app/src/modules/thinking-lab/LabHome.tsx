import { GAME_LIST, type GameId } from "./catalogue";
import { PLAYABLE } from "./Exercise";
import type { LabRun } from "./kit";

/** The Thinking Lab: every game, grouped as in the live app, each with its thinking domain. */
export function LabHome({ W, onPick, onBack }: { W: LabRun["W"]; onPick: (id: GameId) => void; onBack: () => void }) {
  return (
    <section className="card">
      <p className="eyebrow">Thinking Lab</p>
      <h1>{W("Choose a game", "Choose an activity")}</h1>
      <div className="grid">
        {GAME_LIST.map(g => (
          <button key={g.id} className="tile" onClick={() => onPick(g.id)} aria-label={`${g.name}. ${g.cat}. ${g.domain}${PLAYABLE[g.id] ? "" : ". Coming to the new app"}`}>
            <span className="tile-ic" aria-hidden="true">{g.pic}</span>
            <span className="tile-t">{g.name}</span>
            <span className="muted">{g.cat}</span>
          </button>))}
      </div>
      <div className="row"><button className="btn quiet" onClick={onBack}>Back</button></div>
    </section>
  );
}
