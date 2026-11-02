"""Pre-deploy checks for the Thinking Lab static site.

Run from the repo root: python3 .github/scripts/check_site.py
"""
import json
import os
import re
import glob
import subprocess
import sys

errors = []


def fail(msg):
    errors.append(msg)
    print(f"FAIL  {msg}")


def ok(msg):
    print(f"ok    {msg}")


# 1. Files the site cannot run without.
REQUIRED = ["index.html", "clips.js", "sw.js", "manifest.webmanifest", "_headers"]
missing = [f for f in REQUIRED if not os.path.isfile(f)]
for f in missing:
    fail(f"required file missing: {f}")
if not missing:
    ok("required files present")

# 2. Every file the service worker precaches must exist, or install fails and offline mode breaks.
sw = open("sw.js", encoding="utf-8").read()
m = re.search(r"const FILES = (\[.*?\]);", sw, re.S)
if not m:
    fail("could not find FILES list in sw.js")
else:
    precached = [f for f in json.loads(m.group(1)) if f != "./"]
    gone = [f for f in precached if not os.path.isfile(f)]
    for f in gone:
        fail(f"sw.js precaches a file that does not exist: {f}")
    if not gone:
        ok(f"all {len(precached)} precached files exist")

# 2b. Every script and stylesheet the page loads must exist and be precached, or the app breaks offline.
#     Inline scripts are not allowed: the Content-Security-Policy in _headers blocks them.
html = open("index.html", encoding="utf-8").read()
assets = re.findall(r'<script src="([^"]+)"', html) + re.findall(r'<link rel="stylesheet" href="([^"]+)"', html)
bad = 0
for f in assets:
    if not os.path.isfile(f):
        fail(f"index.html loads a file that does not exist: {f}"); bad += 1
    elif m and f not in precached:
        fail(f"index.html loads {f} but sw.js does not precache it"); bad += 1
inline = len(re.findall(r"<script(?![^>]*\bsrc=)[^>]*>", html))
if inline:
    fail(f"index.html has {inline} inline <script> block(s); move them into js/ (the CSP blocks inline scripts)"); bad += 1
unused = sorted(set(f.replace(os.sep, "/") for f in glob.glob("js/**/*.js", recursive=True)) - set(assets))
for f in unused:
    fail(f"{f} is never loaded by index.html"); bad += 1
if not bad:
    ok(f"all {len(assets)} scripts and stylesheets exist, are precached and are loaded")

# 3. Manifest is valid JSON and its icons exist.
try:
    manifest = json.load(open("manifest.webmanifest", encoding="utf-8"))
    bad = [i["src"] for i in manifest.get("icons", []) if not os.path.isfile(i["src"].lstrip("./"))]
    for src in bad:
        fail(f"manifest icon missing: {src}")
    if not bad:
        ok("manifest is valid and its icons exist")
except (OSError, ValueError, KeyError) as e:
    fail(f"manifest.webmanifest is invalid: {e}")

# 4. Clips load as clips/<unit id>.js, so every clip file must match a unit in js/content.
#    Units without a clip are fine: the app simply plays no voice for them.
units = set()
for f in glob.glob("js/content/*.js"):
    units.update(re.findall(r'id: "([\w-]+)"', open(f, encoding="utf-8").read()))
clips = sorted(f[:-3] for f in os.listdir("clips") if f.endswith(".js"))
orphans = [c for c in clips if c not in units]
for c in orphans:
    fail(f"clips/{c}.js does not match any unit id in js/content")
if not orphans:
    ok(f"all {len(clips)} clip files match a unit")

# 5. No confidential or assistant files are tracked by git.
tracked = subprocess.run(["git", "ls-files"], capture_output=True, text=True, check=True).stdout.split("\n")
FORBIDDEN = re.compile(
    r"(^|/)(\.env(\..+)?|CLAUDE(\.local)?\.md|\.mcp\.json|\.npmrc|\.netrc|id_(rsa|ed25519)[^/]*"
    r"|credentials[^/]*\.json|service-account[^/]*\.json)$|(^|/)\.claude/|\.(pem|key|p12|pfx|jks|keystore)$"
)
bad = [f for f in tracked if f and FORBIDDEN.search(f) and not f.endswith(".env.example")]
for f in bad:
    fail(f"confidential or assistant file is tracked by git: {f}")
if not bad:
    ok("no confidential or assistant files tracked")

# 6. No credentials in tracked text files. Base64 audio is skipped by only matching whole tokens.
SECRETS = {
    "GitHub token": r"\b(ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{36}\b|\bgithub_pat_[A-Za-z0-9_]{60,}",
    "Netlify token": r"\bnfp_[A-Za-z0-9]{30,}",
    "Anthropic key": r"\bsk-ant-[A-Za-z0-9_-]{20,}",
    "OpenAI key": r"\bsk-(proj-)?[A-Za-z0-9]{32,}\b",
    "Private key": r"-----BEGIN [A-Z ]*PRIVATE KEY-----",
    "Slack token": r"\bxox[abprs]-[A-Za-z0-9-]{10,}",
}
found = False
for f in tracked:
    if not f or f.endswith((".png", ".woff2", ".py")):
        continue
    text = open(f, encoding="utf-8", errors="ignore").read()
    for name, pat in SECRETS.items():
        if re.search(r"(?<![A-Za-z0-9+/])(?:" + pat + r")", text):
            fail(f"possible {name} in {f}")
            found = True
if not found:
    ok("no credentials found in tracked files")

if errors:
    print(f"\n{len(errors)} check(s) failed")
    sys.exit(1)
print("\nAll checks passed")
