import { canKeepIntakeTeam, isGuardian, type Account, type FamilyIntake, type Learner, type SupportProfile } from "@tl/data";
import { useEffect, useState } from "react";
import { useServices } from "../../platform";
import { ClinicalIntake, SupportOnly } from "./Clinical";
import { FamilyIntake as FamilyPages } from "./Family";

// The Multidisciplinary Neurodevelopmental Intake (Pholoso Afrika Foundation, v2.0). Who sees what:
//  * the family fills it in;
//  * team members with health access see it, once the family agrees in it to share it with the team, and keep the
//    team's own part (summary, formulation, safety review, professional view, reviews);
//  * everyone else on the team sees only "How to support me", when the family shares it.
export function IntakeView({ me, learner }: { me: Account; learner: Learner }) {
  const { store } = useServices(), s = store.as(me);
  const [state, setState] = useState<{ intake: FamilyIntake | null; support: SupportProfile | null }>(), [n, setN] = useState(0);
  useEffect(() => {
    let live = true;
    void Promise.all([s.intake(learner.id), s.supportProfile(learner.id)]).then(([intake, support]) => { if (live) setState({ intake, support }); });
    return () => { live = false; };
  }, [store, me, learner.id, n]); // eslint-disable-line react-hooks/exhaustive-deps
  if (!state) return <p>Loading…</p>;
  const reload = () => setN(x => x + 1);
  if (isGuardian(me, learner)) return <FamilyPages me={me} learner={learner} data={state.intake?.data ?? {}} support={state.support} onChange={reload} />;
  if (state.intake && canKeepIntakeTeam(me, learner)) return <ClinicalIntake me={me} learner={learner} family={state.intake.data} onChange={reload} />;
  return <SupportOnly support={state.support} learner={learner} />;
}
