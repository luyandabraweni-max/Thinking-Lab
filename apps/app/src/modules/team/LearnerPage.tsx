import type { Account } from "@tl/data";
import { Button, Card, TabPanel, Tabs } from "@tl/ui";
import { useState } from "react";
import { useServices } from "../../platform";
import { Health } from "./Health";
import { Messages } from "./Messages";
import { Sharing } from "./Sharing";
import { useLoad } from "./use-load";

export function LearnerPage({ me, learnerId, onBack }: { me: Account; learnerId: string; onBack: () => void }) {
  const { store } = useServices();
  const [learner, reload, error] = useLoad(() => store.as(me).learner(learnerId), [store, me, learnerId]);
  const [tab, setTab] = useState("messages");
  if (error) return <Card><p className="tl-error">{error}</p><Button onClick={onBack}>Back</Button></Card>;
  if (!learner) return <Card><p>Loading…</p></Card>;
  const tabs = [{ id: "messages", label: "Messages" }, { id: "health", label: "Health" }, { id: "sharing", label: me.role === "guardian" ? "Sharing" : "Team" }];
  return (
    <Card>
      <div className="tl-row"><Button variant="quiet" onClick={onBack}>All learners</Button></div>
      <h1>{learner.nickname}</h1>
      <p className="tl-muted">{learner.curriculum}, {learner.level}</p>
      <Tabs label={`${learner.nickname}'s sections`} tabs={tabs} current={tab} onChange={setTab} />
      <TabPanel id={tab}>
        {tab === "messages" ? <Messages me={me} learner={learner} /> : tab === "health" ? <Health me={me} learner={learner} /> : <Sharing me={me} learner={learner} onChanged={reload} />}
      </TabPanel>
    </Card>
  );
}
