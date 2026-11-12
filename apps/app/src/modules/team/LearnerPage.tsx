import type { Account } from "@tl/data";
import { Button, Card, TabPanel, Tabs } from "@tl/ui";
import { useState } from "react";
import { useServices } from "../../platform";
import { Health } from "./Health";
import { Messages } from "./Messages";
import { Adapting } from "./Adapting";
import { Goals, Notes } from "./Plan";
import { Sharing } from "./Sharing";
import { useLoad } from "./use-load";

export function LearnerPage({ me, learnerId, onBack }: { me: Account; learnerId: string; onBack: () => void }) {
  const { store } = useServices();
  const [learner, reload, error] = useLoad(() => store.as(me).learner(learnerId), [store, me, learnerId]);
  const [tab, setTab] = useState("messages");
  const [concerns] = useLoad(() => store.as(me).concernsOnDevice(learnerId), [store, me, learnerId]);
  if (error) return <Card><p className="tl-error">{error}</p><Button onClick={onBack}>Back</Button></Card>;
  if (!learner) return <Card><p>Loading…</p></Card>;
  const team = me.role === "teacher" || me.role === "specialist";
  const tabs = [{ id: "messages", label: "Messages" }, { id: "goals", label: "Goals" }, ...(team ? [{ id: "notes", label: "Notes" }] : []), { id: "adapting", label: "Adapting" }, { id: "health", label: "Health" }, { id: "sharing", label: team ? "Team" : "Sharing" }];
  return (
    <Card>
      <div className="tl-row"><Button variant="quiet" onClick={onBack}>All learners</Button></div>
      <h1>{learner.nickname}</h1>
      <p className="tl-muted">{learner.curriculum}, {learner.level}</p>
      {concerns?.length ? <div className="safety-alert" role="alert">
        <h2><span aria-hidden="true">🛟</span> Safeguarding: {learner.nickname} said they feel unsafe</h2>
        <ul className="plain">{concerns.map(c => <li key={c.id}>{new Date(c.at).toLocaleString("en-ZA", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })} · from the {c.where}</li>)}</ul>
        <p>Stay calm and listen. Don't ask leading questions or promise to keep a secret. Follow your organisation's child protection policy and tell its designated safeguarding lead today.</p>
      </div> : null}
      <Tabs label={`${learner.nickname}'s sections`} tabs={tabs} current={tab} onChange={setTab} />
      <TabPanel id={tab}>
        {tab === "messages" ? <Messages me={me} learner={learner} /> : tab === "goals" ? <Goals me={me} learner={learner} /> : tab === "notes" ? <Notes me={me} learner={learner} /> : tab === "adapting" ? <Adapting me={me} learner={learner} /> : tab === "health" ? <Health me={me} learner={learner} /> : <Sharing me={me} learner={learner} onChanged={reload} />}
      </TabPanel>
    </Card>
  );
}
