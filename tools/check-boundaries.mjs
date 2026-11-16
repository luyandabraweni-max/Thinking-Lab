#!/usr/bin/env node
// Keeps the modular monolith modular. Run by CI (npm run platform:bounds).
//  1. A feature module (apps/app/src/modules/<name>) may use another module only through that module's index.ts.
//  2. Feature modules never import the app shell; the platform layer never imports feature modules.
//  3. Packages are used only through the entry points in their package.json "exports", and never import an app.
//  4. Only packages/data may import @supabase/supabase-js outside the platform layer (keeps moving off Supabase cheap).
import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";

const root = resolve(dirname(new URL(import.meta.url).pathname.replace(/%20/g, " ")), "..");
const walk = d => readdirSync(d).flatMap(f => { const p = join(d, f); return statSync(p).isDirectory() ? (f === "node_modules" || f === "dist" ? [] : walk(p)) : /\.(ts|tsx)$/.test(f) ? [p] : []; });
const files = ["apps", "packages"].flatMap(d => walk(join(root, d)));
const pkgs = Object.fromEntries(readdirSync(join(root, "packages")).map(n => { const j = JSON.parse(readFileSync(join(root, "packages", n, "package.json"), "utf8")); return [j.name, Object.keys(j.exports)]; }));
const rel = p => relative(root, p).split(sep).join("/");
const problems = [];

for (const file of files) {
  const src = readFileSync(file, "utf8"), here = rel(file);
  for (const [, spec] of src.matchAll(/(?:import|export)\s[^"']*?from\s+["']([^"']+)["']|import\(\s*["']([^"']+)["']\s*\)/g)) {
    if (!spec) continue;
    if (spec.startsWith(".")) {
      const target = rel(resolve(dirname(file), spec));
      const mod = here.match(/^apps\/app\/src\/modules\/([^/]+)\//)?.[1], tmod = target.match(/^apps\/app\/src\/modules\/([^/]+)(\/.*)?$/);
      if (tmod && tmod[1] !== mod && tmod[2] && tmod[2] !== "/index") problems.push(`${here}: reaches inside the "${tmod[1]}" module (${spec}). Import "${spec.replace(tmod[2], "")}" instead.`);
      if (mod && /^apps\/app\/src\/(App|main)$/.test(target)) problems.push(`${here}: a module must not import the app shell.`);
      if (here.startsWith("apps/app/src/platform/") && tmod) problems.push(`${here}: the platform layer must not depend on a feature module.`);
      if (here.startsWith("packages/") && target.startsWith("apps/")) problems.push(`${here}: a package must not import an app.`);
      continue;
    }
    const m = spec.match(/^(@tl\/[^/]+)(\/.*)?$/);
    if (m) {
      const sub = m[2] ? "." + m[2] : ".";
      if (!pkgs[m[1]]) problems.push(`${here}: unknown package ${m[1]}.`);
      else if (!pkgs[m[1]].includes(sub)) problems.push(`${here}: ${spec} isn't a public entry point of ${m[1]} (allowed: ${pkgs[m[1]].join(", ")}).`);
    }
    if (spec.startsWith("@supabase/") && !here.startsWith("packages/data/") && !here.startsWith("apps/app/src/platform/")) problems.push(`${here}: only packages/data and the platform layer may use Supabase directly.`);
  }
}
if (problems.length) { console.error(`Module boundaries broken (${problems.length}):\n  ` + problems.join("\n  ")); process.exit(1); }
console.log(`Module boundaries hold across ${files.length} files.`);
