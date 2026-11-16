import { PGlite } from "@electric-sql/pglite";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// A real Postgres (PGlite, in-process) with the auth shim and every migration applied, for testing access rules.
const here = dirname(fileURLToPath(import.meta.url));
const migrations = join(here, "../migrations");

export async function freshDb() {
  const db = new PGlite();
  await db.exec(readFileSync(join(here, "auth-shim.sql"), "utf8"));
  for (const f of readdirSync(migrations).filter(f => f.endsWith(".sql")).sort()) await db.exec(readFileSync(join(migrations, f), "utf8"));
  return db;
}

/** Run queries as a signed-in adult: the "authenticated" role with their user id, exactly as the Supabase API does. */
export async function as<T>(db: PGlite, userId: string, fn: (q: <R>(sql: string, params?: unknown[]) => Promise<R[]>) => Promise<T>): Promise<T> {
  return db.transaction(async tx => {
    await tx.query("select set_config('request.jwt.claim.sub', $1, true)", [userId]);
    await tx.exec("set local role authenticated");
    return fn(async <R>(sql: string, params: unknown[] = []) => (await tx.query<R>(sql, params)).rows);
  });
}

export async function adult(db: PGlite, id: string, name: string) {
  await db.query("insert into auth.users (id, email) values ($1, $2)", [id, `${name.toLowerCase().replace(/ /g, ".")}@example.org`]);
  await db.query("insert into public.profiles (id, name, email) values ($1, $2, $3)", [id, name, `${id}@example.org`]);
}
