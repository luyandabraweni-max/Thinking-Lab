import { type Account, type Learner } from "@tl/data";
import { Button, Card, Notice } from "@tl/ui";
import { useServices } from "../../platform";
import { SafeguardingPanel } from "./Safeguarding";
import { useLoad } from "./use-load";

const news = (n: number) => (n ? ` (${n} new message${n > 1 ? "s" : ""})` : "");

/** An adult's dashboard: the learners they may see, with unread messages. Admins see no learner records. */
export function TeamHome({ me, onOpen }: { me: Account; onOpen: (learnerId: string) => void }) {
  const { store } = useServices();
  const [rows] = useLoad(async () => {
    const s = store.as(me), ls = await s.learners();
    return Promise.all(ls.map(async L => ({ L, unread: await s.unread(L.id) })));
  }, [store, me]);

  if (me.role === "org_admin" || me.role === "site_admin") return (
    <Card>
      <h1>School admin</h1>
      <Notice>School admins don't see individual learners' records. Reports for your organisation will show totals only.</Notice>
    </Card>);

  return (<>
    {me.role === "specialist" || me.role === "teacher" ? <SafeguardingPanel me={me} /> : null}
    <Card>
      <h1>{me.role === "guardian" ? "Your children" : "Your learners"}</h1>
      {!rows ? <p>Loading…</p> : rows.length === 0 ? <p className="tl-muted">{me.role === "guardian" ? "No children registered yet." : "No families have shared a learner with you yet."}</p> :
        <ul className="tl-stack" style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {rows.map(({ L, unread }: { L: Learner; unread: number }) => (
            <li key={L.id}><Card as="article">
              <h2>{L.nickname}</h2>
              <p className="tl-muted">{L.curriculum}, {L.level}</p>
              <div className="tl-row"><Button variant="primary" onClick={() => onOpen(L.id)} aria-label={`Open ${L.nickname}${news(unread)}`}>Open{news(unread)}</Button></div>
            </Card></li>))}
        </ul>}
    </Card>
  </>);
}
