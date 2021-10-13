#!/bin/bash
# Build APK and copy it to assets -> http://localhost:8100/assets/app.apk

npx cap copy android \
  && cd android \
  && ./gradlew build \
  && cp -f app/build/outputs/apk/debug/app-debug.apk ../public/assets/app.apk