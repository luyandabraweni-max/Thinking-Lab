#!/usr/bin/env bash
# Builds a test (debug) Android app from the web app. Run from the repo root; needs Node 20+, JDK 21 and the Android SDK.
# Store releases need a signing key kept as a CI secret, never in this repo.
set -euo pipefail
rm -rf native/www native/android
rsync -a --exclude='.*' --exclude='netlify.toml' --exclude='_headers' --exclude='node_modules' --exclude='native' --exclude='tests' --exclude='docs' \
  --exclude='README.md' --exclude='package*.json' --exclude='*.config.js' --exclude='test-results' --exclude='playwright-report' ./ native/www/
cd native
npm install --no-audit --no-fund
npx cap add android
# Use the app's own icon instead of Capacitor's placeholder.
res=android/app/src/main/res
rm -rf "$res/mipmap-anydpi-v26"
for d in "$res"/mipmap-*; do cp ../icons/icon-192.png "$d/ic_launcher.png"; cp ../icons/icon-192.png "$d/ic_launcher_round.png"; rm -f "$d/ic_launcher_foreground.png"; done
cd android && ./gradlew assembleDebug --no-daemon -q
echo "Built native/android/app/build/outputs/apk/debug/app-debug.apk"
