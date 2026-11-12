import type { Account } from "@tl/data";
import { Button } from "@tl/ui";
import type { SpeechEngine } from "@tl/voice";
import { VoiceProvider } from "@tl/voice/react";
import { useEffect, useState } from "react";
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
  const signedIn = (a: Account) => { setMe(a); setRegistering(false); setView({ at: "home" }); void services.auth.needsPassword().then(n => setPw(n ? "ask" : null), () => {}); };
  // Opening the app from the sign-in link in an email: the person is already signed in.
  useEffect(() => {
    void services.auth.session().then(s => { if (s === "new") setRegistering(true); else if (s) signedIn(s); }).catch((e: Error) => setProblem(e.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- once, when the app opens
  }, [services]);
  const signOut = async () => { await services.auth.signOut(); setMe(null); setRegistering(false); setPw(null); setView({ at: "front" }); };
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
            {view.at === "space" ? <LearnerHome learner={view.learner} onDone={() => setView({ at: "front" })} />
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
