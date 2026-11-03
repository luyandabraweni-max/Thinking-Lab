# 2to.iQ Thinking Lab

Calm, accessible thinking activities and CAPS-aligned lessons for learners aged 3 to 25. A static, offline-capable web app (PWA) with no build step. Prototype with made-up learners only: nothing is sent to a server, and the demo portal keeps made-up accounts in the browser only.

The target architecture (web, iOS and Android apps, offline sync, multiple curricula including D-CAPS, POPIA and EU compliance) is in [docs/system-design.md](docs/system-design.md).

## Run locally

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000. The service worker (offline mode) only registers on `localhost` or HTTPS.

## Layout

```
index.html          Page shell: loads the stylesheet and scripts in order
css/app.css         All styles
js/core/            State, speech, learner profile, UI helpers, motion, install prompt
js/screens/         Setup, check-in, home, avatar, dashboard, skills, adult view
js/activities/      Thinking Lab games (pattern, vetkoek, comic, memory, paint, robot, sort, kraal)
js/learn/           Lesson flow, themed word problems, lesson visuals
js/content/         Lesson and skills content: one file per grade or age group
js/content/all-units.js   Combines every grade's units into UNITS (keep it after the content files)
js/support/         My way (incl. greyscale), talk board, switch scanning, reading ruler, breaks, Support Passport,
                    safeguarding ("I feel unsafe", helplines, concern records)
js/reports/         Report model, plus PDF and Word (.docx) writers that run on the device
js/portal/          Front door, registration, sign-in, parent, specialist and school admin portals, progress chart
js/main.js          Starts the app and registers the service worker
clips.js, clips/    Recorded voice clips (shared lines, and one file per Grade 4 to 6 lesson)
sw.js               Offline cache
native/             Android and iOS app wrapper (Capacitor) and the Android build script
tests/              App tests (run in CI)
_headers            Security headers for Netlify
```

## Working on the code

- The scripts are plain (non-module) scripts that share one global scope, so **order in `index.html` matters**: a file can only use, while it loads, what earlier files define. Functions called later, on a tap or screen change, can live in any file.
- **Adding a JS or CSS file:** add it to `index.html` and to the `FILES` list in `sw.js`, and change the `CACHE` name in `sw.js` so returning visitors get the update. CI fails if a file is missing from either list.
- **No inline scripts or `onclick="..."` attributes:** the Content-Security-Policy in `_headers` blocks them.
- **Adding a grade's lessons:** create `js/content/grade-N.js` defining `UNITS_GN` and `WORDS_GN`, end it with `Object.assign(WORDS, WORDS_GN);`, load it before `all-units.js`, and add `...UNITS_GN` to the list in `all-units.js`.

## Tests

The site has no build step; Node is only needed for the tests.

```bash
npm install
npm run test:unit   # Vitest: app logic and every lesson's content, run in jsdom
npm run test:e2e    # Playwright: axe accessibility checks on key screens in every display mode, phone and laptop sizes, and offline mode
```

Locally the browser tests use the installed Microsoft Edge (set `PW_CHANNEL=chrome` for Chrome, or run `npx playwright install chromium`). CI runs both on every push and pull request, and nothing deploys unless they pass. When you add a screen or a display mode, add it to `tests/e2e/display-modes.spec.js`.

The unit tests also write sample PDF and Word reports when `REPORT_DIR` is set; `python3 .github/scripts/check_reports.py <folder>` checks they are valid files. CI does both.

## Portal (demo)

Parents and specialists can register, sign in with an emailed code (shown on screen in the demo), and use their portal. Accounts are pretend: they stay in the browser, sign-in is never kept between visits, and "Clear demo data" on the welcome screen removes them. Demo accounts: `parent@example.org`, `specialist@example.org` (also the safeguarding lead), `therapist@example.org` and `admin@example.org` (school admin).

- **Parents** see their children's progress (with a weekly chart), supports, sharing and reports.
- **Specialists** see learners shared with them: progress, goals, notes and reports.
- **School admins** see their school's staff and totals, and choose the safeguarding lead. They never see an individual learner's records. Real accounts wait for the legal sign-off in the system design.

## Android and iOS apps

The same web app is wrapped as a native app with [Capacitor](https://capacitorjs.com) (`native/`). The `android/` and `ios/` projects are generated, not stored in the repo.

- **Android:** every deploy also builds a test app. Download it from the run's **Artifacts** on the GitHub Actions page (`thinking-lab-android-main`), unzip it and install `app-debug.apk` on a phone (allow "install unknown apps"). Locally: `./native/build-android.sh` (needs Node 20+, JDK 21 and the Android SDK).
- **Before the Play Store:** a Google Play developer account (one-off USD 25), a signing key stored as a CI secret, and the store listing, privacy policy and Data safety form (see the system design).
- **iOS:** needs a Mac with Xcode and an Apple Developer account (USD 99 a year). Then `cd native && npm install && npx cap add ios && npx cap open ios`.
- **App ID:** `africa.pholoso.thinkinglab` in `native/capacitor.config.json`. Confirm it before the first store upload: it can't be changed afterwards.

## Branches and deployment

- `dev`: every push runs the checks and deploys to the Netlify dev preview.
- `main`: every push runs the checks and deploys to production.
- Pull requests into either branch run the checks only.

See `.github/workflows/ci-cd.yml`. Deploys need the `NETLIFY_AUTH_TOKEN` and `NETLIFY_SITE_ID` repository secrets.
