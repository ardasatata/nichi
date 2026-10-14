#!/usr/bin/env bash
# Packages build/export/Nichi.app into dist/Nichi-<version>.{dmg,zip} plus SHA256SUMS.
# Usage: scripts/make-dmg.sh <version>
set -euo pipefail
cd "$(dirname "$0")/.."

VERSION="${1:?version required}"
APP="build/export/Nichi.app"
[ -d "$APP" ] || { echo "missing $APP; run build-release.sh first" >&2; exit 1; }

rm -rf dist build/dmg && mkdir -p dist build/dmg
cp -R "$APP" build/dmg/
ln -s /Applications build/dmg/Applications

hdiutil create -volname "Nichi" -srcfolder build/dmg -ov -format UDZO "dist/Nichi-$VERSION.dmg"
ditto -c -k --keepParent "$APP" "dist/Nichi-$VERSION.zip"
(cd dist && shasum -a 256 Nichi-"$VERSION".dmg Nichi-"$VERSION".zip > SHA256SUMS)
cat dist/SHA256SUMS
