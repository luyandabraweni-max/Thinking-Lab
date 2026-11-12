# Platform architecture

The React + TypeScript platform described in [the system design](../system-design.md) (sections 7 to 11 and 17). It lives beside the live site and doesn't change it: the live site at the repo root keeps deploying from `dev` and `main` until the platform can replace it.

## Shape: a modular monolith

One app and one deploy for the web, iOS and Android (through Capacitor), split into modules with clear public interfaces. No microservices.

```
apps/app/                 The app for learners, families and specialists
  src/platform/           Composition root: picks demo mode or Supabase, sign-in adapters, shared-device learner lock
  src/modules/auth/       Front door: sign-in for every role
  src/modules/team/       Adults around a learner: learners, messages, health, sharing and consent
  src/modules/learner/    The learner's own space: messages and the Thinking Lab (lessons join here next)
  src/modules/thinking-lab/  The 8 Thinking Lab games: each game's rules in logic.ts (tested), its screen in React
  src/modules/learning/   The lesson menu and lesson player, with the adaptation rules applied during lessons
  src/modules/my-way/     The learner's display and sound preferences, read-aloud and captions
  src/modules/safety/     "Who can help me?", helplines, and the "I feel unsafe" response
  native/build.sh         Android and iOS test builds
packages/data/            The only code that reads or saves data: local store, outbox, sync, access rules, transports
packages/voice/           Speaking instead of typing: speech engines (web, iOS, Android), commands, voice-filled forms
packages/ui/              Design system: tokens for every display mode, accessible components, and the live stylesheet
packages/content/         Lessons, word help and skills as data: one pack per level, plus a small catalogue
packages/adaptation/      The adaptation rules (docs/adaptation-rules.md) as pure functions
packages/reports/         Reports: one model for the preview, the PDF and the Word file, made on the device
supabase/migrations/      The database: schema, row-level security, audit, sync functions (plain Postgres)
supabase/tests/           Database access-rule tests, run on a real Postgres in-process (PGlite)
tools/check-boundaries.mjs  Enforces the module rules below
tools/export-content.mjs    Exports lessons and styles from the live site; CI fails if they drift
```

### Module rules (checked in CI by `npm run platform:bounds`)

1. A feature module uses another module only through its `index.ts`.
2. Feature modules never import the app shell, and the platform layer never imports feature modules.
3. Packages are used only through the entry points in their `package.json` `exports`, and never import an app.
4. Only `packages/data` and `apps/app/src/platform` may use Supabase directly.

### Data flow: offline first

Every change is written to the device (IndexedDB) and to an **outbox** in one step, so nobody waits for the network. `sync()` sends the outbox in batches and pulls changes since the last cursor. Each outbox entry has its own id, so sending it twice does no harm.

- **Access rules exist twice.** The database enforces them with row-level security, so an app bug can't leak data. `packages/data/src/access.ts` mirrors them so the app hides what a person can't use, and behaves the same offline.
- **The server decides who sent something.** A trigger stamps every message's sender, whatever the device claims.

### Moving off Supabase later

The app knows Supabase in three files:
- [supabase-transport.ts](../../packages/data/src/supabase-transport.ts)
- [supabase-auth.ts](../../apps/app/src/platform/supabase-auth.ts)
- the `createServices` branch in [services.tsx](../../apps/app/src/platform/services.tsx)

The database is standard Postgres. Its only Supabase-specific pieces are `auth.users`, `auth.uid()` and the `authenticated` role.

To move to another Postgres host, keep the migrations and replace those three files with:
- an API that calls `sync_push` and `sync_pull`
- an auth provider that sets the user id

The tests show the swap works: they run the same migrations on PGlite with a 10-line auth shim.

## Running it

```bash
npm ci
npm run app:dev          # http://localhost:3000, demo mode (or connected, with apps/app/.env.local) (data stays in the browser)
npm run platform:check   # types, lint, module boundaries, all platform tests
```

To connect to Supabase:
1. Copy `apps/app/.env.example` to `apps/app/.env.local` and fill in the project URL and anon key.
2. Apply the migrations with the Supabase CLI: `supabase db push`.
3. Sign-in works with Supabase's standard emails: the link brings people back to `http://localhost:3000`, Supabase's default Site URL. When the app gets its real address, add it under Authentication → URL Configuration. **Before launch, configure custom SMTP**: the built-in email service only sends a few emails an hour. Google sign-in needs a Google Cloud OAuth client.

## Status and next steps

**Done:**
- the database with its access rules, audit log and sync
- the data module, with offline storage and sync
- sign-in for every role:
  - Google and email codes for adults
  - picture passwords for learners on shared devices
  - demo accounts
- the team module: messages, health and medication, sharing and consent
- voice forms on the web, iOS and Android
- CI builds for Android and iOS

**Also ported:**
- lessons as data packs (180 lessons, 15 packs)
- the adaptation rules
- all 8 Thinking Lab games, played start to finish in tests
- attempts saved and synced for the adaptation history

**Next**, in the order of the system design's Phase 0:
1. Port the learner flows still missing: feelings check-in, battery check-in, breaks, talk board, avatar, switch scanning, pointer resting, answering by voice in lessons, and recorded voice clips. Story Weaver's "Me" uses the learner's nickname until the avatar is ported.
2. Sync My way preferences between devices (today they're saved on the device).
3. Team module ported: rule review, goals, observations, notes, reports, development charts, the next-session plan, level suggestions and the admin screen are done.
4. Adding staff to an organisation: today staff join a school only when an admin adds their membership in the database.
5. Tell devices when access is withdrawn, so they remove that learner's data (section 9). Today the pull only sends what someone can see, not what they lost.
6. Accessibility tests (axe) for the new app in every display mode, as the live site has.
7. Replace the live site once the port reaches parity.
