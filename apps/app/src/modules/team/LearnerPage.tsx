import type { Account } from "@tl/data";
import { Button, Card, TabPanel, Tabs } from "@tl/ui";
import { lazy, Suspense, useState } from "react";
import { useServices } from "../../platform";
import { AvatarPicture } from "../avatar";
import { Health } from "./Health";
import { Messages } from "./Messages";
import { curriculumOf, School } from "./School";
import { Goals, Notes } from "./Plan";
// Reports and adaptation bring the games and lesson catalogue with them, so they load when opened.
const Adapting = lazy(() => import("./Adapting").then(m => ({ default: m.Adapting })));
const Progress = lazy(() => import("./Progress").then(m => ({ default: m.Progress })));
const NextSession = lazy(() => import("./NextSession").then(m => ({ default: m.NextSession })));
const Report = lazy(() => import("./Report").then(m => ({ default: m.Report })));
// The school profile brings the pack's 268 observations and strategies catalogue with it.
const SchoolProfileView = lazy(() => import("../school-profile").then(m => ({ default: m.SchoolProfileView })));
import { Sharing } from "./Sharing";
import { useLoad } from "./use-load";

export function LearnerPage({ me, learnerId, onBack }: { me: Account; learnerId: string; onBack: () => void }) {
  const { store } = useServices();
  const [learner, reload, error] = useLoad(() => store.as(me).learner(learnerId), [store, me, learnerId]);
  const [tab, setTab] = useState("messages");
  const [settings, reloadSettings] = useLoad(() => store.as(me).settings(learnerId), [store, me, learnerId]);
  const [concerns] = useLoad(() => store.as(me).concernsOnDevice(learnerId), [store, me, learnerId]);
  if (error) return <Card><p className="tl-error">{error}</p><Button onClick={onBack}>Back</Button></Card>;
  if (!learner) return <Card><p>Loading…</p></Card>;
  const team = me.role === "teacher" || me.role === "specialist";
  const tabs = [{ id: "messages", label: "Messages" }, { id: "goals", label: "Goals" }, ...(team ? [{ id: "notes", label: "Notes" }, { id: "profile", label: "School profile" }] : []), { id: "progress", label: "Progress" }, { id: "next", label: "Next session" }, { id: "adapting", label: "Adapting" }, { id: "report", label: "Report" }, { id: "health", label: "Health" }, { id: "sharing", label: team ? "Team" : "Sharing" }];
  return (
    <Card>
      <div className="tl-row"><Button variant="quiet" onClick={onBack}>All learners</Button></div>
      <div className="tl-row" style={{ alignItems: "center" }}>
        {settings?.avatar ? <AvatarPicture look={settings.avatar} size={72} label={`${learner.nickname}'s character, ${settings.avatar.name}`} /> : null}
        <h1>{learner.nickname}</h1>
      </div>
      <p className="tl-muted">{curriculumOf(learner, settings?.curriculum)}, {learner.level}</p>
      <School me={me} learner={learner} onChanged={reloadSettings} />
      {concerns?.length ? <div className="safety-alert" role="alert">
        <h2><span aria-hidden="true">🛟</span> Safeguarding: {learner.nickname} said they feel unsafe</h2>
        <ul className="plain">{concerns.map(c => <li key={c.id}>{new Date(c.at).toLocaleString("en-ZA", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })} · from the {c.where}</li>)}</ul>
        <p>Stay calm and listen. Don't ask leading questions or promise to keep a secret. Follow your organisation's child protection policy and tell its designated safeguarding lead today.</p>
      </div> : null}
      <Tabs label={`${learner.nickname}'s sections`} tabs={tabs} current={tab} onChange={setTab} />
      <TabPanel id={tab}>
        {tab === "messages" ? <Messages me={me} learner={learner} /> : tab === "goals" ? <Goals me={me} learner={learner} /> : tab === "notes" ? <Notes me={me} learner={learner} /> : tab === "profile" ? <Suspense fallback={<p>Loading…</p>}><SchoolProfileView me={me} learner={learner} /></Suspense> : tab === "progress" ? <Suspense fallback={<p>Loading…</p>}><Progress me={me} learner={learner} /></Suspense> : tab === "next" ? <Suspense fallback={<p>Loading…</p>}><NextSession me={me} learner={learner} /></Suspense> : tab === "adapting" ? <Suspense fallback={<p>Loading…</p>}><Adapting me={me} learner={learner} /></Suspense> : tab === "report" ? <Suspense fallback={<p>Loading…</p>}><Report me={me} learner={learner} /></Suspense> : tab === "health" ? <Health me={me} learner={learner} /> : <Sharing me={me} learner={learner} onChanged={reload} onDeleted={onBack} />}
      </TabPanel>
    </Card>
  );
}
