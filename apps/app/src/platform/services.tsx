import { IdbKv, LocalOrgAdmin, LocalSafeguarding, LocalStore, seedDemo, sync, type Account, type Learner, type OrgAdmin, type Safeguarding, type SyncResult } from "@tl/data";
import { createContext, useContext, type ReactNode } from "react";
import { DemoAuth, type AuthAdapter } from "./auth";

// The composition root: the only place that decides between demo mode (no server, data on this device) and the
// real backend. Modules get everything through useServices(), so they never know which one is in use.
export interface Services {
  mode: "demo" | "supabase";
  store: LocalStore;
  auth: AuthAdapter;
  /** Sends the outbox and fetches changes. Does nothing in demo mode. */
  syncNow(): Promise<SyncResult | null>;
  /** Safeguarding concerns for a designated safeguarding lead. */
  safeguarding(me: Account): Safeguarding;
  /** The organisation admin's totals and staff. */
  admin(me: Account): OrgAdmin;
  /** A parent or guardian adds their child. Needs the server (it decides the learner's id and links the guardian). */
  registerLearner(me: Account, child: NewLearner): Promise<void>;
}
export interface NewLearner { nickname: string; cohort: Learner["cohort"]; curriculum: string; level: string }

export async function createServices(env: ImportMetaEnv = import.meta.env, store = new LocalStore(new IdbKv())): Promise<Services> {
  const url = env.VITE_SUPABASE_URL, key = env.VITE_SUPABASE_ANON_KEY;
  if (url && key) {
    const link = linkError();
    // Loaded only when connected, so demo and offline try-outs don't download the server library.
    const [{ createClient }, { SupabaseTransport, SupabaseSafeguarding, SupabaseOrgAdmin }, { SupabaseAuth }] = await Promise.all([import("@supabase/supabase-js"), import("@tl/data/supabase"), import("./supabase-auth")]);
    const client = createClient(url, key, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } });
    const transport = new SupabaseTransport(client);
    const syncNow = async () => ((await client.auth.getSession()).data.session ? sync(store, transport) : null);
    const registerLearner = async (_me: Account, c: NewLearner) => {
      const { error } = await client.rpc("register_learner", { p_nickname: c.nickname, p_cohort: c.cohort, p_curriculum: c.curriculum, p_level: c.level });
      if (error) throw new Error(navigator.onLine ? error.message : "Adding a child needs an internet connection. Please try again when you're online.");
      await syncNow();
    };
    return { mode: "supabase", store, auth: new SupabaseAuth(client, store, syncNow, link), syncNow, safeguarding: () => new SupabaseSafeguarding(client), admin: me => new SupabaseOrgAdmin(client, me.orgId ?? ""), registerLearner };
  }
  if (!(await store.accounts()).length) await seedDemo(store);
  const registerLearner = async (me: Account, c: NewLearner) => {
    await store.receive("learners", [{ id: crypto.randomUUID(), orgId: me.orgId ?? "", ...c, guardianIds: [me.id], team: [],
      consent: { guardian: true, support: false, share: false, health: false, law: "POPIA", updatedAt: new Date().toISOString() } }]);
  };
  return { mode: "demo", store, auth: new DemoAuth(store), syncNow: async () => null, safeguarding: me => new LocalSafeguarding(store, me), admin: me => new LocalOrgAdmin(store, me), registerLearner };
}

/** An email link that didn't work comes back with the reason in the address. Read it, then tidy the address. */
function linkError(): string | null {
  if (typeof location === "undefined") return null;
  const q = new URLSearchParams(location.hash.slice(1) + "&" + location.search.slice(1));
  if (!q.get("error") && !q.get("error_code")) return null;
  history.replaceState(null, "", location.pathname);
  return q.get("error_code") === "otp_expired" || /expired|invalid/i.test(q.get("error_description") ?? "")
    ? "That sign-in link has already been used or has expired. Each link works once, within an hour. Sign in with your password, or ask for a new link and open the newest email."
    : `Signing in didn't work: ${q.get("error_description") ?? q.get("error")}. Please try again.`;
}

const ServicesContext = createContext<Services | null>(null);
export function ServicesProvider({ services, children }: { services: Services; children: ReactNode }) {
  return <ServicesContext.Provider value={services}>{children}</ServicesContext.Provider>;
}
export function useServices() {
  const s = useContext(ServicesContext);
  if (!s) throw new Error("useServices needs a ServicesProvider");
  return s;
}

// Who is signed in, shared by every module.
export interface Who { me: Account | null; setMe(a: Account | null): void }
export const WhoContext = createContext<Who>({ me: null, setMe() {} });
export const useWho = () => useContext(WhoContext);
