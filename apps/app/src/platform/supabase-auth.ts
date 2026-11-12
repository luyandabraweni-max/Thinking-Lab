import type { SupabaseClient } from "@supabase/supabase-js";
import type { Account, AdultRole, LocalStore } from "@tl/data";
import type { AuthAdapter } from "./auth";

// Sign-in through Supabase Auth: Google (asking only for name and email) and one-time email codes.
// The user's account row arrives through sync, so the app works the same offline after the first sign-in.
export class SupabaseAuth implements AuthAdapter {
  readonly methods = { google: true, emailCode: true, demo: false };
  constructor(private client: SupabaseClient, private store: LocalStore, private afterSignIn: () => Promise<unknown>) {}

  private async account(): Promise<Account | null> {
    const { data } = await this.client.auth.getUser();
    if (!data.user) return null;
    return (await this.store.account(data.user.id)) ?? null;
  }
  async current() { return this.account(); }
  async session() {
    const { data } = await this.client.auth.getSession();
    if (!data.session) return null;
    await this.afterSignIn().catch(() => {}); // fetch the account; offline, the copy on the device is used
    return (await this.account()) ?? "new";
  }
  async signInWithGoogle() {
    const { error } = await this.client.auth.signInWithOAuth({ provider: "google", options: { redirectTo: location.origin + location.pathname, scopes: "openid email profile" } });
    if (error) throw new Error(error.message);
  }
  async sendEmailCode(email: string) {
    const { error } = await this.client.auth.signInWithOtp({ email, options: { shouldCreateUser: true, emailRedirectTo: location.origin + location.pathname } });
    if (error) throw new Error(error.message);
  }
  async verifyEmailCode(email: string, code: string) {
    const { error } = await this.client.auth.verifyOtp({ email, token: code.replace(/\s/g, ""), type: "email" });
    if (error) throw new Error("That code isn't right, or it has expired. Please ask for a new one.");
    await this.afterSignIn();
    return (await this.account()) ?? "new";
  }
  async register(name: string, role: Exclude<AdultRole, "site_admin" | "org_admin">, profession?: string) {
    const { error } = await this.client.rpc("register_adult", { p_name: name, p_role: role, p_profession: profession ?? null });
    if (error) throw new Error(error.message);
    await this.afterSignIn();
    const me = await this.account();
    if (!me) throw new Error("Your account was made, but couldn't be loaded. Please try signing in again.");
    return me;
  }
  async signInDemo(): Promise<Account> { throw new Error("Demo accounts aren't available when the app is connected to its server."); }
  async signOut() { await this.client.auth.signOut(); }
}
