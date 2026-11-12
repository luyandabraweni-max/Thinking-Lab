import type { Account } from "@tl/data";
import { Button } from "@tl/ui";
import type { SpeechEngine } from "@tl/voice";
import { VoiceProvider } from "@tl/voice/react";
import { useEffect, useRef, useState } from "react";
import { SetPassword, SignIn } from "./modules/auth";
import { LearnerHome } from "./modules/learner";
import { LearnerPage, TeamHome } from "./modules/team";
import { ServicesProvider, WhoContext, type DeviceLearner, type Services } from "./platform";

// The shell: which module is on screen. Modules talk to each other only through the props passed here.
type View = { at: "front" } | { at: "home" } | { at: "learner"; id: string } | { at: "space"; learner: DeviceLearner };

/** `voice` lets tests use a scripted microphone; the app finds the device's own. */
export function App({ services, voice }: { services: Services; voice?: { engine: SpeechEngine | null; say: (t: string) => Promise<void> } }) {
  const [me, setMe] = useState<Account | null>(null), [view, setView] = useState<View>({ at: "front" });
  const [registering, setRegistering] = useState(false), [problem, setProblem] = useState(() => services.auth.linkProblem() ?? ""), [pw, setPw] = useState<"ask" | "change" | null>(null);
  const signedInRef = useRef(false);
  const signedIn = (a: Account) => { signedInRef.current = true; setMe(a); setRegistering(false); setView({ at: "home" }); void services.auth.needsPassword().then(n => setPw(n ? "ask" : null), () => {}); };
  // Opening the app from the sign-in link in an email: the person is already signed in. Until that's checked, the app
  // says so, rather than showing the sign-in form. A link opened in another tab signs this tab in too.
  const [starting, setStarting] = useState(true);
  useEffect(() => {
    let live = true;
    const check = () => services.auth.session()
      .then(s => { if (!live) return; if (s === "new") setRegistering(true); else if (s) signedIn(s); }, (e: Error) => { if (live) setProblem(e.message); })
      .finally(() => { if (live) setStarting(false); });
    void check();
    const stop = services.auth.watch?.(() => { if (!signedInRef.current) void check(); }); // only when nobody is signed in here yet
    return () => { live = false; stop?.(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- once, when the app opens
  }, [services]);
  const signOut = async () => { await services.auth.signOut(); signedInRef.current = false; setMe(null); setRegistering(false); setPw(null); setView({ at: "front" }); };
  return (
    <ServicesProvider services={services}>
      <VoiceProvider {...(voice ?? {})}>
        <WhoContext.Provider value={{ me, setMe }}>
          <a className="tl-visually-hidden" href="#main">Skip to content</a>
          {me ? <header className="tl-page" style={{ paddingBottom: 0 }}>
            <div className="tl-row" style={{ justifyContent: "space-between" }}>
              <p><b>{me.name}</b> <span className="tl-muted">· {ROLE_NAME[me.role]}</span></p>
              <div className="tl-row"><Button small variant="quiet" onClick={() => setPw("change")}>Password</Button><Button small variant="quiet" onClick={() => void signOut()}>Sign out</Button></div>
            </div>
          </header> : null}
          <main id="main" className="tl-page">
            {problem ? <div className="tl-error" role="alert"><p>{problem}</p><Button small onClick={() => setProblem("")}>OK</Button></div> : null}
            {me && pw && view.at !== "space" ? <SetPassword change={pw === "change"} onDone={() => setPw(null)} /> : null}
            {starting && !me ? <section className="card"><p role="status">Signing you in…</p></section>
              : view.at === "space" ? <LearnerHome learner={view.learner} onDone={() => setView({ at: "front" })} />
              : !me ? <SignIn key={String(registering)} registering={registering} onAdult={signedIn} onLearner={l => setView({ at: "space", learner: l })} />
              : view.at === "learner" ? <LearnerPage me={me} learnerId={view.id} onBack={() => setView({ at: "home" })} />
              : <TeamHome me={me} onOpen={id => setView({ at: "learner", id })} />}
          </main>
        </WhoContext.Provider>
      </VoiceProvider>
    </ServicesProvider>
  );
}
const ROLE_NAME: Record<Account["role"], string> = { guardian: "Parent or guardian", teacher: "Teacher", specialist: "Specialist", site_admin: "Site admin", org_admin: "School admin" };
