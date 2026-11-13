import { type Account, type Learner } from "@tl/data";
import { Button, Card } from "@tl/ui";
import { lazy, Suspense, useState } from "react";
import { useServices } from "../../platform";
// The form brings the curriculum lists with it, so it loads when shown.
const RuleReview = lazy(() => import("./RuleReview").then(m => ({ default: m.RuleReview })));
const AddChild = lazy(() => import("./AddChild").then(m => ({ default: m.AddChild })));
const SupportTracker = lazy(() => import("../school-profile").then(m => ({ default: m.SupportTracker })));
import { AdminHome } from "./Admin";
import { SafeguardingPanel } from "./Safeguarding";
import { curriculumOf } from "./School";
import { useLoad } from "./use-load";

const news = (n: number) => (n ? ` (${n} new message${n > 1 ? "s" : ""})` : "");

/** An adult's dashboard: the learners they may see, with unread messages. Admins see no learner records. */
export function TeamHome({ me, onOpen, onHandOver }: { me: Account; onOpen: (learnerId: string) => void; onHandOver: (learner: Learner) => void }) {
  const { store } = useServices();
  const [rows, reload] = useLoad(async () => {
    const s = store.as(me), ls = await s.learners();
    return Promise.all(ls.map(async L => ({ L, unread: await s.unread(L.id), curriculum: (await s.settings(L.id)).curriculum })));
  }, [store, me]);

  const [reviewing, setReviewing] = useState(false), [tracking, setTracking] = useState(false);
  if (me.role === "org_admin" || me.role === "site_admin") return <AdminHome me={me} />;
  if (reviewing) return <Suspense fallback={<Card><p>Loading…</p></Card>}><RuleReview me={me} onBack={() => setReviewing(false)} /></Suspense>;
  const professional = me.role === "specialist" || me.role === "teacher";
  if (tracking) return <Suspense fallback={<Card><p>Loading…</p></Card>}><SupportTracker me={me} onOpen={onOpen} onBack={() => setTracking(false)} /></Suspense>;

  return (<>
    {professional ? <SafeguardingPanel me={me} /> : null}
    <Card>
      <h1>{me.role === "guardian" ? "Your children" : "Your learners"}</h1>
      {rows?.length ? <p className="tl-muted">When it's {me.role === "guardian" ? "your child's" : "a learner's"} turn on this device, press <b>Hand over</b>. It sets up the device for them and opens their learning space.</p> : null}
      {!rows ? <p>Loading…</p> : rows.length === 0 ? <p className="tl-muted">{me.role === "guardian" ? "No children yet. Add your child below to get started." : "No families have shared a learner with you yet."}</p> :
        <ul className="tl-stack" style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {rows.map(({ L, unread, curriculum }: { L: Learner; unread: number; curriculum?: string | null }) => (
            <li key={L.id}><Card as="article">
              <h2>{L.nickname}</h2>
              <p className="tl-muted">{curriculumOf(L, curriculum)}, {L.level}</p>
              <div className="tl-row">
                <Button variant="primary" onClick={() => onHandOver(L)}><span aria-hidden="true">👋</span>Hand over to {L.nickname}</Button>
                <Button onClick={() => onOpen(L.id)} aria-label={`Open ${L.nickname}${news(unread)}`}>Open{news(unread)}</Button>
              </div>
            </Card></li>))}
        </ul>}
      {professional ? <div className="tl-row"><Button onClick={() => setTracking(true)}><span aria-hidden="true">🗂️</span>Support tracker</Button><Button onClick={() => setReviewing(true)}><span aria-hidden="true">📝</span>Review the adaptation rules</Button></div> : null}
      {me.role === "guardian" && rows ? <Suspense fallback={null}><AddChild me={me} first={rows.length === 0} onAdded={reload} /></Suspense> : null}
    </Card>
  </>);
}
