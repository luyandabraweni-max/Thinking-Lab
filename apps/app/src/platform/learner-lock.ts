import type { Kv } from "@tl/data";

// Learners on a shared device: an adult opens the learner's space and sets a picture password, so learners can
// come back to their own space (and not someone else's) without an email or a typed password (docs/system-design.md, section 11).
// This is a lock for sharing a device, not strong security: 9 pictures in a row of 3 gives 729 choices, and the
// data stays protected on the server by the adult's sign-in.
export const PICTURES = [["🦁", "lion"], ["🐘", "elephant"], ["🦒", "giraffe"], ["🐢", "tortoise"], ["🦓", "zebra"], ["🐧", "penguin"], ["🌳", "tree"], ["⭐", "star"], ["🌙", "moon"]] as const;
export interface DeviceLearner { learnerId: string; nickname: string; adultId: string; hash: string }

const KEY = "device-learners";
async function hash(learnerId: string, pics: number[]) {
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`${learnerId}:${pics.join(",")}`));
  return [...new Uint8Array(bytes)].map(b => b.toString(16).padStart(2, "0")).join("");
}
export async function deviceLearners(kv: Kv): Promise<DeviceLearner[]> {
  try { return JSON.parse((await kv.getMeta(KEY)) ?? "[]") as DeviceLearner[]; } catch { return []; }
}
export async function addDeviceLearner(kv: Kv, l: { learnerId: string; nickname: string; adultId: string }, pics: number[]) {
  const list = (await deviceLearners(kv)).filter(x => x.learnerId !== l.learnerId);
  list.push({ ...l, hash: await hash(l.learnerId, pics) });
  await kv.setMeta(KEY, JSON.stringify(list));
}
export async function removeDeviceLearner(kv: Kv, learnerId: string) {
  await kv.setMeta(KEY, JSON.stringify((await deviceLearners(kv)).filter(x => x.learnerId !== learnerId)));
}
const tries = new Map<string, { n: number; until: number }>();
/** Checks a picture password. After 5 wrong tries, waits 30 seconds before trying again. */
export async function checkPictures(kv: Kv, learnerId: string, pics: number[]): Promise<"ok" | "wrong" | "wait"> {
  const t = tries.get(learnerId) ?? { n: 0, until: 0 };
  if (Date.now() < t.until) return "wait";
  const l = (await deviceLearners(kv)).find(x => x.learnerId === learnerId);
  if (l && l.hash === (await hash(learnerId, pics))) { tries.delete(learnerId); return "ok"; }
  t.n++; if (t.n >= 5) { t.n = 0; t.until = Date.now() + 30000; }
  tries.set(learnerId, t);
  return "wrong";
}
