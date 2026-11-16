import { type Account, type AvatarLook, type Learner } from "@tl/data";
import { Button, Card, More } from "@tl/ui";
import { lazy, Suspense, useState } from "react";
import { useServices } from "../../platform";
import { AvatarPicture } from "../avatar";
// The form brings the curriculum lists with it, so it loads when shown.
const RuleReview = lazy(() => import("./RuleReview").then(m => ({ default: m.RuleReview })));
const AddChild = lazy(() => import("./AddChild").then(m => ({ default: m.AddChild })));
const SupportTracker = lazy(() => import("../school-profile").then(m => ({ default: m.SupportTracker })));
import { AdminHome } from "./Admin";
import { SafeguardingPanel } from "./Safeguarding";
import { curriculumOf } from "./School";
import { useLoad } from "./use-load";

const news = (n: number) => (n ? ` (${n} new message${n > 1 ? "s" : ""})` : "");
const greeting = () => { const h = new Date().getHours(); return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening"; };

/** A learner's picture: their own character if they made one, otherwise their first letter in a warm circle. */
export function LearnerFace({ name, look, size = 56 }: { name: string; look?: AvatarLook | null; size?: number }) {
  return look ? <AvatarPicture look={look} size={size} label={`${name}'s character, ${look.name}`} />
    : <span className="tl-initial" style={{ width: size, height: size, fontSize: size / 2.4 }} aria-hidden="true">{name.trim().charAt(0).toUpperCase()}</span>;
}

/** An adult's dashboard: the learners they may see, with unread messages. Admins see no learner records. */
export function TeamHome({ me, onOpen, onHandOver }: { me: Account; onOpen: (learnerId: string) => void; onHandOver: (learner: Learner) => void }) {
  const { store } = useServices();
  const [rows, reload] = useLoad(async () => {
    const s = store.as(me), ls = await s.learners();
    return Promise.all(ls.map(async L => { const st = await s.settings(L.id); return { L, unread: await s.unread(L.id), curriculum: st.curriculum, avatar: st.avatar ?? null }; }));
  }, [store, me]);

  const [reviewing, setReviewing] = useState(false), [tracking, setTracking] = useState(false);
  if (me.role === "org_admin" || me.role === "site_admin") return <AdminHome me={me} />;
  if (reviewing) return <Suspense fallback={<Card><p>Loading…</p></Card>}><RuleReview me={me} onBack={() => setReviewing(false)} /></Suspense>;
  const professional = me.role === "specialist" || me.role === "teacher";
  if (tracking) return <Suspense fallback={<Card><p>Loading…</p></Card>}><SupportTracker me={me} onOpen={onOpen} onBack={() => setTracking(false)} /></Suspense>;
  const first = me.name.trim().split(/\s+/)[0] ?? "";

  return (<>
    <section className="tl-welcome">
      <p className="tl-greeting">{greeting()}{first ? `, ${first}` : ""}</p>
      <h1>{me.role === "guardian" ? "Your children" : "Your learners"}</h1>
      {rows?.length ? <div className="tl-muted"><More label="How hand over works">When it's {me.role === "guardian" ? "your child's" : "a learner's"} turn on this device, press <b>Hand over</b>. It sets up the device for them and opens their learning space.</More></div> : null}
    </section>
    {professional ? <SafeguardingPanel me={me} /> : null}
    {!rows ? <p>Loading…</p> : rows.length === 0 ? <Card><p className="tl-muted">{me.role === "guardian" ? "No children yet. Add your child below to get started." : "No families have shared a learner with you yet."}</p></Card> :
      <ul className="tl-cards" style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {rows.map(({ L, unread, curriculum, avatar }) => (
          <li key={L.id}><Card as="article">
            <div className="tl-row" style={{ gap: 14, flexWrap: "nowrap" }}>
              <LearnerFace name={L.nickname} look={avatar} />
              <div style={{ minWidth: 0 }}>
                <h2>{L.nickname}</h2>
                <p className="tl-muted">{curriculumOf(L, curriculum)}, {L.level}</p>
              </div>
            </div>
            {unread ? <p><span className="tl-badge"><span aria-hidden="true">💬</span>{unread} new message{unread > 1 ? "s" : ""}</span></p> : null}
            <div className="tl-row">
              <Button variant="primary" onClick={() => onHandOver(L)}><span aria-hidden="true">👋</span>Hand over to {L.nickname}</Button>
              <Button onClick={() => onOpen(L.id)} aria-label={`Open ${L.nickname}${news(unread)}`}>Open</Button>
            </div>
          </Card></li>))}
      </ul>}
    {professional ? <section className="tl-stack"><h2>Tools</h2>
      <div className="tl-cards">
        <ToolTile icon="🗂️" tone="" title="Support tracker" text="Every learner's school profile, riskiest first." onClick={() => setTracking(true)} />
        <ToolTile icon="📝" tone="tl-tile-icon--sun" title="Review the adaptation rules" text="Tell us how the app should adapt." onClick={() => setReviewing(true)} />
      </div>
    </section> : null}
    {me.role === "guardian" && rows ? <Suspense fallback={null}><AddChild me={me} first={rows.length === 0} onAdded={reload} /></Suspense> : null}
  </>);
}

function ToolTile({ icon, tone, title, text, onClick }: { icon: string; tone: string; title: string; text: string; onClick: () => void }) {
  return (
    <Card as="div">
      <div className="tl-row" style={{ gap: 14, flexWrap: "nowrap" }}>
        <span className={`tl-tile-icon ${tone}`} aria-hidden="true">{icon}</span>
        <div className="tl-stack" style={{ gap: 4 }}><Button variant="quiet" onClick={onClick} style={{ padding: 0, minHeight: 0, textDecoration: "none", fontSize: "1.1rem", fontWeight: 700 }}>{title}</Button><span className="tl-muted">{text}</span></div>
      </div>
    </Card>
  );
}
