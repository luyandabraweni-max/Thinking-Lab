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
js/core/            State, speech (with captions), learner profile, adaptation rules, UI helpers, motion, install prompt
js/screens/         Setup, check-in, home, avatar, dashboard, skills, adult view
js/activities/      Thinking Lab games: Light the Village, The Literal Robot, The Secret Rule Machine, Veld Balance,
                    Story Weaver, Describe It, Invention Workshop, How Sure Am I? (shared pieces in lab-kit.js)
js/learn/           Lesson flow, themed word problems, lesson visuals
js/content/         Lesson and skills content: one file per grade or age group
js/content/all-units.js   Combines every grade's units into UNITS (keep it after the content files)
js/support/         My way (incl. greyscale), talk board, switch scanning, choose by resting the pointer, answer by
                    speaking, reading ruler, breaks, Support Passport,
                    safeguarding ("I feel unsafe", helplines, concern records)
js/reports/         Report model, plus PDF and Word (.docx) writers that run on the device
js/portal/          Front door, registration, sign-in, parent, specialist and school admin portals, progress chart,
                    team.js (messages, goal observations, development, health and medication, plans, rule review)
js/main.js          Starts the app and registers the service worker
clips.js, clips/    Recorded voice clips (shared lines, and one file per Grade 4 to 6 lesson)
sw.js               Offline cache
modules/avatar3d.js 3D robot character (ES module, loaded only when a learner picks it)
vendor/three/       three.js r160 (MIT), kept here so it works offline
assets/3d/          3D models (CC0, Quaternius): the robot and the casual person; credits in LICENSE.txt
tools/              Blender script that slims a character to its Idle and Wave animations
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

## Thinking Lab games

There are eight games, two in each of the four domains. Each one records *how* the learner works (tests, changes, predictions, confidence), not only the answer. They are described for specialist review in [docs/thinking-lab-games.md](docs/thinking-lab-games.md).

## Adaptation

The platform adapts to each learner from what they do in sessions, not from a label. It can offer help sooner, shorten lessons, start questions with fewer choices in a hard area, offer regular breaks, and say "take your time" after very quick wrong answers. The learner can undo each change on the spot. Level changes are only suggested to adults in the portal, and adults can turn automatic changes off. The rules are in `js/core/adapt.js` (thresholds in the `ADAPT` table) and explained for specialists in [docs/adaptation-rules.md](docs/adaptation-rules.md). They are provisional until specialists review them.

Access options beyond My way: captions for everything the voice says, choosing by resting the pointer (eye gaze, head pointer), switch scanning, and answering by speaking (off by default, because some browsers send the sound to Google or Apple). Sign language videos play beside the captions once clips are added: set `window.__SIGNS = { "<exact spoken line>": "assets/signs/<file>.mp4" }` in a script loaded before `js/core/speech.js`.

## Portal (demo)

Parents and specialists can register, sign in with an emailed code (shown on screen in the demo), and use their portal. Accounts are pretend: they stay in the browser, sign-in is never kept between visits, and "Clear demo data" on the welcome screen removes them. Demo accounts: `parent@example.org`, `specialist@example.org` (also the safeguarding lead), `therapist@example.org` and `admin@example.org` (school admin).

- **Parents** see their children's progress (with a weekly chart), supports, sharing and reports.
- **Specialists** see learners shared with them: progress, goals, notes and reports.
- **Parents and specialists** both see how the platform adapts for a learner, and accept or set aside suggested level changes.
- **Working together**: the family and specialists share a message thread about each learner, and adults can send the learner a message for their next session (the family can always read it). Specialists record observations against support plan goals, see development over time, set supports, switch automatic changes on or off one by one, plan the next session, and review the adaptation rules.
- **Health and medication**: only the family enters medicines and daily doses. Specialists see them only when the family turns on sharing. They never appear in reports or to school admins.
- **School admins** see their school's staff and totals, and choose the safeguarding lead. They never see an individual learner's records. Real accounts wait for the legal sign-off in the system design.

## Characters

Learners make their own character in My character. The drawings come from the **2to.iQ Avatar System v1.0** (Pholoso Afrika Foundation): the team set and inclusive set are ready-made starting points, and every part can be changed. The app's version (`js/screens/avatar.js`) adds what the engine lists as next steps (afro, bun, long hair, head wrap, hijab, hearing aid, grey hair, a robot), the wave and talking motion, and Calm screen (softer colours, no sparkles). `avatarCode()` and `avatarFromCode()` read and write the engine's short codes, so other 2to.iQ apps can show the same character; options the engine doesn't have yet give no code.

## 3D character

**Hidden for now** (`AV_3D_ON = false` in `js/screens/avatar.js`): the free models didn't give the look the team wants, so the choices are off until the team's own model is ready. Saved 3D characters show as drawings. The notes below describe how it works when switched on.

Learners can pick a **3D person** or a **3D robot** in My character. Both are free CC0 models by [Quaternius](https://quaternius.com) ("Casual_Hoodie" from Ultimate Modular Characters, and "RobotExpressive" by Tomás Laulhé), drawn with [three.js](https://threejs.org). The person takes the learner's skin tone, hair colour and clothes colour. Each idles, turns towards the pointer, and waves when it says its name. The files (about 1.5 MB with one character) download only when someone picks one, then work offline. With No movement or Calm screen on, in Data saver, or without WebGL, the 2D robot drawing is shown instead.

More free CC0 characters (people, animals) for later: [Quaternius](https://quaternius.com) (Universal Base Characters, Ultimate Modular Characters) and [Kenney](https://kenney.nl/assets) (Animated Characters). Slim each one with `tools/slim-character.py` in [Blender](https://www.blender.org): it keeps only the Idle and Wave animations (the packs also have fighting and weapon animations, which don't belong here) and exports a `.glb`. Then add it to `MODELS` in `modules/avatar3d.js`. When you change files in `modules/` or `vendor/`, change the `CACHE` name in `sw.js` as well.

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

## The React platform (in progress)

The next version of the app is being built as a React + TypeScript modular monolith in `apps/` and `packages/`, with the database in `supabase/`. It doesn't affect this site. See [docs/architecture/README.md](docs/architecture/README.md) and the [2,500-user capacity plan](docs/architecture/capacity.md).
