import type { Account, AdultRole, LocalStore } from "@tl/data";

// How adults sign in. The demo adapter works with no server; the Supabase adapter adds Google and email codes.
// Learners never sign in with an email: an adult opens their space on a device (see learner-lock.ts).
export interface AuthAdapter {
  readonly methods: { google: boolean; emailCode: boolean; password: boolean; demo: boolean };
  /** The adult already signed in on this device, if any. */
  current(): Promise<Account | null>;
  /** On opening the app: signed in (for example from an email link), signed in but not yet registered ("new"), or not. */
  session(): Promise<Account | "new" | null>;
  signInWithGoogle(): Promise<void>;
  sendEmailCode(email: string): Promise<void>;
  verifyEmailCode(email: string, code: string): Promise<Account | "new">;
  /** Everyday sign-in, with no email needed. */
  signInWithPassword(email: string, password: string): Promise<Account | "new">;
  /** Create or change the signed-in adult's password. */
  setPassword(password: string): Promise<void>;
  /** True when the signed-in adult came in by email and has no password yet. */
  needsPassword(): Promise<boolean>;
  /** Why an email link didn't work (used, expired), read once when the app opens. */
  linkProblem(): string | null;
  /** After a first sign-in: who this person is. Admin roles are set up when an organisation joins. */
  register(name: string, role: Exclude<AdultRole, "site_admin" | "org_admin">, profession?: string): Promise<Account>;
  signInDemo(accountId: string): Promise<Account>;
  signOut(): Promise<void>;
}

export const DEMO_CODE = "246810";
export const WRONG_PASSWORD = "That email and password don't match. Check them and try again, or use \"Email me a sign-in link\" below.";
export const PASSWORD_RULE = "At least 8 characters. A short sentence you'll remember works well.";
export function checkPassword(pw: string) { if (pw.length < 8) throw new Error("Your password needs at least 8 characters."); }

export class DemoAuth implements AuthAdapter {
  readonly methods = { google: false, emailCode: true, password: true, demo: true };
  private me: Account | null = null;
  private passwords = new Map<string, string>(); private viaCode = false;
  constructor(private store: LocalStore) {}
  async current() { return this.me; }
  async session() { return this.me; }
  async signInWithGoogle() { throw new Error("Google sign-in works once the app is connected to its server."); }
  async sendEmailCode(email: string) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Please check the email address.");
  }
  async verifyEmailCode(email: string, code: string) {
    if (code.replace(/\s/g, "") !== DEMO_CODE) throw new Error("That code isn't right. Please check it and try again.");
    const found = (await this.store.accounts()).find(a => a.email.toLowerCase() === email.trim().toLowerCase());
    this.viaCode = true;
    if (found) { this.me = found; return found; }
    this.pendingEmail = email.trim();
    return "new" as const;
  }
  private pendingEmail = "";
  async register(name: string, role: Exclude<AdultRole, "site_admin" | "org_admin">, profession?: string) {
    const me: Account = { id: crypto.randomUUID(), role, name: name.trim(), email: this.pendingEmail, orgId: null, ...(profession ? { profession } : {}) };
    await this.store.receive("accounts", [me]); // a demo account stays on this device
    this.me = me;
    return me;
  }
  async signInWithPassword(email: string, password: string) {
    const key = email.trim().toLowerCase(), found = (await this.store.accounts()).find(a => a.email.toLowerCase() === key);
    if (!found || this.passwords.get(key) !== password) throw new Error(WRONG_PASSWORD);
    this.viaCode = false;
    return (this.me = found);
  }
  async setPassword(password: string) {
    checkPassword(password);
    if (!this.me) throw new Error("Please sign in first.");
    this.passwords.set(this.me.email.toLowerCase(), password);
  }
  async needsPassword() { return !!this.me && this.viaCode && !this.passwords.has(this.me.email.toLowerCase()); }
  linkProblem() { return null; }
  async signInDemo(id: string) {
    this.viaCode = false;
    const found = await this.store.account(id);
    if (!found) throw new Error("That demo account isn't here.");
    return (this.me = found);
  }
  async signOut() { this.me = null; }
}
