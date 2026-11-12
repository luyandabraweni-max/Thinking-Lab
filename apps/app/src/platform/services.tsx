import { IdbKv, LocalOrgAdmin, LocalSafeguarding, LocalStore, seedDemo, sync, type Account, type OrgAdmin, type Safeguarding, type SyncResult } from "@tl/data";
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
}

export async function createServices(env: ImportMetaEnv = import.meta.env, store = new LocalStore(new IdbKv())): Promise<Services> {
  const url = env.VITE_SUPABASE_URL, key = env.VITE_SUPABASE_ANON_KEY;
  if (url && key) {
    // Loaded only when connected, so demo and offline try-outs don't download the server library.
    const [{ createClient }, { SupabaseTransport, SupabaseSafeguarding, SupabaseOrgAdmin }, { SupabaseAuth }] = await Promise.all([import("@supabase/supabase-js"), import("@tl/data/supabase"), import("./supabase-auth")]);
    const client = createClient(url, key, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } });
    const transport = new SupabaseTransport(client);
    const syncNow = async () => ((await client.auth.getSession()).data.session ? sync(store, transport) : null);
    return { mode: "supabase", store, auth: new SupabaseAuth(client, store, syncNow), syncNow, safeguarding: () => new SupabaseSafeguarding(client), admin: me => new SupabaseOrgAdmin(client, me.orgId ?? "") };
  }
  if (!(await store.accounts()).length) await seedDemo(store);
  return { mode: "demo", store, auth: new DemoAuth(store), syncNow: async () => null, safeguarding: me => new LocalSafeguarding(store, me), admin: me => new LocalOrgAdmin(store, me) };
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
