#!/usr/bin/env bash
# Builds a test version of the platform app for Android or iOS from apps/app/dist. Run from the repo root after npm ci.
#   apps/app/native/build.sh android   needs JDK 21 and the Android SDK; makes a debug APK
#   apps/app/native/build.sh ios       needs a Mac with Xcode; builds for the simulator, unsigned
# Store builds need signing keys kept as CI secrets, never in this repo.
set -euo pipefail
platform="${1:?android or ios}"
npm run app:build
cd apps/app
rm -rf "$platform"
npx cap add "$platform"
npx cap sync "$platform"
MIC="Thinking Lab uses the microphone so you can answer and fill in forms by speaking. You can always type instead."
SPEECH="Thinking Lab turns what you say into words, so you can answer and fill in forms by speaking."
if [ "$platform" = android ]; then
  manifest=android/app/src/main/AndroidManifest.xml
  # Speech recognition: the microphone permission, and (Android 11+) permission to find the phone's speech service.
  grep -q RECORD_AUDIO "$manifest" || sed -i.bak 's#<application#<uses-permission android:name="android.permission.RECORD_AUDIO" />\n    <application#' "$manifest"
  grep -q RecognitionService "$manifest" || sed -i.bak 's#<application#<queries><intent><action android:name="android.speech.RecognitionService" /></intent></queries>\n    <application#' "$manifest"
  rm -f "$manifest.bak"
  cd android && ./gradlew assembleDebug --no-daemon -q
  echo "Built apps/app/android/app/build/outputs/apk/debug/app-debug.apk"
else
  plist=ios/App/App/Info.plist
  /usr/libexec/PlistBuddy -c "Add :NSMicrophoneUsageDescription string $MIC" "$plist" 2>/dev/null || /usr/libexec/PlistBuddy -c "Set :NSMicrophoneUsageDescription $MIC" "$plist"
  /usr/libexec/PlistBuddy -c "Add :NSSpeechRecognitionUsageDescription string $SPEECH" "$plist" 2>/dev/null || /usr/libexec/PlistBuddy -c "Set :NSSpeechRecognitionUsageDescription $SPEECH" "$plist"
  cd ios/App
  if [ -d App.xcworkspace ]; then target=(-workspace App.xcworkspace); else target=(-project App.xcodeproj); fi
  xcodebuild "${target[@]}" -scheme App -configuration Debug -sdk iphonesimulator -destination 'generic/platform=iOS Simulator' CODE_SIGNING_ALLOWED=NO build -quiet
  echo "Built the iOS app for the simulator"
fi
