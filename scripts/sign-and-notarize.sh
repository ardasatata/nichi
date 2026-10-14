#!/usr/bin/env bash
# Developer ID signs, notarizes and staples the app + DMG. Skips cleanly when secrets are absent.
# Required env: DEVELOPER_ID_P12 (base64), DEVELOPER_ID_P12_PASSWORD, KEYCHAIN_PASSWORD,
#               ASC_KEY_ID, ASC_ISSUER_ID, ASC_KEY_P8 (contents of the .p8)
# Usage: scripts/sign-and-notarize.sh <version>
set -euo pipefail
cd "$(dirname "$0")/.."

if [ -z "${DEVELOPER_ID_P12:-}" ]; then
  echo "DEVELOPER_ID_P12 not set; skipping signing/notarization."
  exit 0
fi

VERSION="${1:?version required}"
KEYCHAIN="$RUNNER_TEMP/nichi-signing.keychain-db"
CERT="$RUNNER_TEMP/cert.p12"
KEY="$RUNNER_TEMP/AuthKey.p8"

echo "$DEVELOPER_ID_P12" | base64 --decode > "$CERT"
printf '%s' "$ASC_KEY_P8" > "$KEY"
security create-keychain -p "$KEYCHAIN_PASSWORD" "$KEYCHAIN"
security set-keychain-settings -lut 21600 "$KEYCHAIN"
security unlock-keychain -p "$KEYCHAIN_PASSWORD" "$KEYCHAIN"
security import "$CERT" -P "$DEVELOPER_ID_P12_PASSWORD" -A -t cert -f pkcs12 -k "$KEYCHAIN"
security set-key-partition-list -S apple-tool:,apple: -k "$KEYCHAIN_PASSWORD" "$KEYCHAIN"
security list-keychains -d user -s "$KEYCHAIN" login.keychain-db

IDENTITY=$(security find-identity -v -p codesigning "$KEYCHAIN" | awk -F'"' '/Developer ID Application/ {print $2; exit}')
[ -n "$IDENTITY" ] || { echo "no Developer ID Application identity found" >&2; exit 1; }

codesign --force --deep --options runtime --timestamp --sign "$IDENTITY" build/export/Nichi.app
scripts/make-dmg.sh "$VERSION"
codesign --force --timestamp --sign "$IDENTITY" "dist/Nichi-$VERSION.dmg"

xcrun notarytool submit "dist/Nichi-$VERSION.dmg" \
  --key "$KEY" --key-id "$ASC_KEY_ID" --issuer "$ASC_ISSUER_ID" --wait
xcrun stapler staple "dist/Nichi-$VERSION.dmg"

# Re-zip the stapled app for the zip artifact.
xcrun stapler staple build/export/Nichi.app || true
ditto -c -k --keepParent build/export/Nichi.app "dist/Nichi-$VERSION.zip"
(cd dist && shasum -a 256 Nichi-"$VERSION".dmg Nichi-"$VERSION".zip > SHA256SUMS)
echo "signed=true" >> "${GITHUB_OUTPUT:-/dev/null}"
