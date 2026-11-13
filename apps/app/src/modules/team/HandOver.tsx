import type { Account, Learner } from "@tl/data";
import { Button, Card, Notice } from "@tl/ui";
import { useEffect, useState } from "react";
import { addDeviceLearner, deviceLearners, PICTURES, useServices, type DeviceLearner } from "../../platform";

/**
 * Handing the device to a learner, in one place: set their picture password on this device if they don't have one,
 * then start their time. The adult is signed out first, so the learner can't see the adults' messages or health records.
 */
export function HandOver({ me, learner, onStart, onBack }: { me: Account; learner: Learner; onStart: (l: DeviceLearner) => void; onBack: () => void }) {
  const { store } = useServices();
  const name = learner.nickname;
  const [ready, setReady] = useState<{ l: DeviceLearner; pics?: number[] } | null | undefined>(undefined), [picking, setPicking] = useState(false);
  const [pics, setPics] = useState<number[]>([]);
  useEffect(() => { void deviceLearners(store.kv).then(ls => { const l = ls.find(x => x.learnerId === learner.id); setReady(l ? { l } : null); }); }, [store, learner.id]);
  const pick = async (i: number) => {
    const next = [...pics, i];
    if (next.length < 3) return setPics(next);
    await addDeviceLearner(store.kv, { learnerId: learner.id, nickname: name, adultId: me.id }, next);
    const l = (await deviceLearners(store.kv)).find(x => x.learnerId === learner.id)!;
    setPics([]); setPicking(false); setReady({ l, pics: next });
  };

  if (ready === undefined) return <Card><p role="status">Getting ready…</p></Card>;
  if (!ready || picking) return (
    <Card>
      <h1>Hand over to {name}</h1>
      <p className="tl-muted">Step 1 of 2</p>
      <h2>Choose {name}'s picture password</h2>
      <p>{name} will tap these three pictures, in order, to get back into their own learning space on this device. Choose pictures they will remember, and choose them together if you like.</p>
      <p role="status" aria-live="polite">{pics.length ? `${pics.length} of 3 chosen.` : ""}</p>
      <div className="tl-row" role="group" aria-label="Pictures">
        {PICTURES.map(([em, pic], i) => <Button key={pic} aria-label={pic} onClick={() => void pick(i)}><span aria-hidden="true" style={{ fontSize: "2rem" }}>{em}</span></Button>)}
      </div>
      <div className="tl-row">{pics.length ? <Button variant="quiet" onClick={() => setPics([])}>Start again</Button> : null}<Button variant="quiet" onClick={ready ? () => setPicking(false) : onBack}>Back</Button></div>
    </Card>);

  return (
    <Card>
      <h1>Hand over to {name}</h1>
      <p className="tl-muted">{ready.pics ? "Step 2 of 2" : "Ready"}</p>
      {ready.pics ? <Notice tone="ok">
        <p>{name}'s pictures are {ready.pics.map(n => PICTURES[n]![1]).join(", then ")}.</p>
        <p aria-hidden="true" style={{ fontSize: "2rem", margin: 0 }}>{ready.pics.map(n => PICTURES[n]![0]).join(" ")}</p>
        <p>Help {name} remember them, and keep them private between you.</p>
      </Notice> : <p>{name} already has a picture password on this device. <Button small variant="quiet" onClick={() => setPicking(true)}>Change the pictures</Button></p>}
      <h2>What happens next</h2>
      <ul>
        <li>You are signed out, so {name} can't see your messages or health records.</li>
        <li>{name}'s learning space opens straight away. Give them the device.</li>
        <li>When {name} is finished, they press <b>I'm done</b>. Sign in again to see how they did.</li>
        <li>Next time, {name} can open their space on their own: <b>I'm a learner</b> on the front screen, then their name and pictures.</li>
      </ul>
      <div className="tl-row">
        <Button variant="primary" onClick={() => onStart(ready.l)}>Start {name}'s time</Button>
        <Button variant="quiet" onClick={onBack}>Not now</Button>
      </div>
    </Card>);
}
