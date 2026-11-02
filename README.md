# 2to.iQ Thinking Lab

Calm, accessible thinking activities and CAPS-aligned lessons for learners aged 3 to 25. A static, offline-capable web app (PWA) with no build step and no stored learner data. Prototype with made-up learners only.

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
js/core/            State, speech, learner profile, UI helpers, install prompt
js/screens/         Setup, check-in, home, avatar, dashboard, skills, adult view
js/activities/      Thinking Lab games (pattern, vetkoek, comic, memory, paint, robot, sort, kraal)
js/learn/           Lesson flow, themed word problems, lesson visuals
js/content/         Lesson and skills content: one file per grade or age group
js/content/all-units.js   Combines every grade's units into UNITS (keep it after the content files)
js/support/         My way, talk board, switch scanning, reading ruler, breaks, Support Passport
js/main.js          Starts the app and registers the service worker
clips.js, clips/    Recorded voice clips (shared lines, and one file per Grade 4 to 6 lesson)
sw.js               Offline cache
_headers            Security headers for Netlify
```

## Working on the code

- The scripts are plain (non-module) scripts that share one global scope, so **order in `index.html` matters**: a file can only use, while it loads, what earlier files define. Functions called later, on a tap or screen change, can live in any file.
- **Adding a JS or CSS file:** add it to `index.html` and to the `FILES` list in `sw.js`, and change the `CACHE` name in `sw.js` so returning visitors get the update. CI fails if a file is missing from either list.
- **No inline scripts or `onclick="..."` attributes:** the Content-Security-Policy in `_headers` blocks them.
- **Adding a grade's lessons:** create `js/content/grade-N.js` defining `UNITS_GN` and `WORDS_GN`, end it with `Object.assign(WORDS, WORDS_GN);`, load it before `all-units.js`, and add `...UNITS_GN` to the list in `all-units.js`.

## Branches and deployment

- `dev`: every push runs the checks and deploys to the Netlify dev preview.
- `main`: every push runs the checks and deploys to production.
- Pull requests into either branch run the checks only.

See `.github/workflows/ci-cd.yml`. Deploys need the `NETLIFY_AUTH_TOKEN` and `NETLIFY_SITE_ID` repository secrets.
