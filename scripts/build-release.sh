#!/usr/bin/env bash
# Builds build/export/Nichi.app (ad-hoc signed unless SIGN_IDENTITY is set).
# Usage: scripts/build-release.sh [version] [build-number]
set -euo pipefail
cd "$(dirname "$0")/.."

VERSION="${1:-0.1.0}"
BUILD="${2:-1}"
IDENTITY="${SIGN_IDENTITY:--}"

xcodegen generate
rm -rf build/export
xcodebuild -project Nichi.xcodeproj -scheme Nichi -configuration Release \
  -derivedDataPath build/derived \
  MARKETING_VERSION="$VERSION" CURRENT_PROJECT_VERSION="$BUILD" \
  CODE_SIGN_STYLE=Manual CODE_SIGN_IDENTITY="$IDENTITY" DEVELOPMENT_TEAM="" \
  OTHER_CODE_SIGN_FLAGS="--timestamp=none" \
  build

mkdir -p build/export
cp -R build/derived/Build/Products/Release/Nichi.app build/export/
echo "Built build/export/Nichi.app ($VERSION)"
