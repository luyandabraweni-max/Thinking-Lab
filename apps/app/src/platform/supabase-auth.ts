import type { SupabaseClient } from "@supabase/supabase-js";
import type { Account, AdultRole, LocalStore } from "@tl/data";
import { checkPassword, WRONG_PASSWORD, type AuthAdapter } from "./auth";

// Sign-in through Supabase Auth: Google (asking only for name and email) and one-time email codes.
// The user's account row arrives through sync, so the app works the same offline after the first sign-in.
export class SupabaseAuth implements AuthAdapter {
  readonly methods = { google: true, emailCode: true, password: true, demo: false };
  constructor(private client: SupabaseClient, private store: LocalStore, private afterSignIn: () => Promise<unknown>, private link: string | null = null) {}
  linkProblem() { return this.link; }

  private async account(): Promise<Account | null> {
    const { data } = await this.client.auth.getUser();
    if (!data.user) return null;
    return (await this.store.account(data.user.id)) ?? null;
  }
  async current() { return this.account(); }
  async session() {
    const { data } = await this.client.auth.getSession();
    if (!data.session) return null;
    let syncError: Error | null = null;
    await this.afterSignIn().catch((e: Error) => { syncError = e; }); // fetch the account; offline, the copy on the device is used
    const me = await this.account();
    if (me) return me;
    if (syncError && navigator.onLine) throw syncError; // signed in, but the account couldn't be fetched: say why
    return "new";
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
  async signInWithPassword(email: string, password: string) {
    const { error } = await this.client.auth.signInWithPassword({ email: email.trim(), password });
    if (error) throw new Error(/invalid login/i.test(error.message) ? WRONG_PASSWORD : /not confirmed/i.test(error.message) ? "Please open the sign-in link we emailed you first." : error.message);
    await this.afterSignIn().catch(() => {});
    return (await this.account()) ?? "new";
  }
  async setPassword(password: string) {
    checkPassword(password);
    const { error } = await this.client.auth.updateUser({ password, data: { has_password: true } });
    if (error && !/different from the old/i.test(error.message)) throw new Error(/weak|characters/i.test(error.message) ? `That password is too easy to guess. ${error.message}` : error.message);
  }
  async needsPassword() {
    const { data } = await this.client.auth.getUser();
    return !!data.user && !data.user.user_metadata?.has_password;
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
  async signOut() { await this.client.auth.signOut({ scope: "local" }); } // other devices stay signed in
}
