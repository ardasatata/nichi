# Nichi 日

A tiny macOS menu bar app that shows today's day as a single character — `木` — or as much of the date as you like.

Docs: https://ardasatata.github.io/nichi/

macOS 15+ · Swift / SwiftUI + AppKit · no Dock icon

## Features

- Weekday as one character (default), short, or full name
- Day number, month/day, full date, date with era (令和), or a custom ICU pattern
- Multiple indicators side by side, each with its own locale and calendar
- Calendars: Gregorian, Japanese, Chinese lunar, Buddhist, Hebrew, Islamic (Umm al-Qura), Persian
- Updates on day change, clock/time zone change and wake; no polling
- Launch at login, optional bold and boxed styles

## Suggested locales

| Locale | Single-character weekday | Companion calendar |
|---|---|---|
| 日本語 `ja_JP` | 月火水木金土日 | Japanese (令和) |
| 简体中文 `zh_Hans` | 一二三四五六日 | Chinese lunar |
| 繁體中文 `zh_Hant` | 一二三四五六日 | Chinese lunar |
| 한국어 `ko_KR` | 월화수목금토일 | — |
| ไทย `th_TH` | จ อ พ พฤ ศ ส อา | Buddhist |
| עברית `he_IL` | א׳–ז׳ | Hebrew |
| العربية `ar`, فارسی `fa_IR` | — | Islamic, Persian |
| हिन्दी, Tiếng Việt, English | — | — |

Any locale identifier works; the list above is just what the picker suggests first.

## Mobile (iOS & Android widgets)

`mobile/` contains an Expo SDK 58 / React Native app that shows the same day indicator as home screen
widgets (and iOS lock screen widgets), built on `expo-widgets`.

- One screen to set language, calendar and display style, with up to four profiles.
- iOS: a single configurable widget; long-press → Edit Widget to choose a profile.
- Android: widgets "Nichi 1–4", one per profile.
- A year of days is pre-rendered, so widgets flip at midnight without opening the app
  (Android uses a small local module, `mobile/modules/nichi-midnight`, to wake at local midnight).

```sh
cd mobile
npm install
npx expo run:ios      # or: npx expo run:android (development builds; Expo Go is not supported)
npm test
```

Builds run on EAS: pushing a `mobile-v*` tag starts them. One-time setup: `npx eas-cli init` in `mobile/`
and add an `EXPO_TOKEN` repository secret. SDK 58 is still in beta; Android widgets exist only there.

## Install

Download the latest DMG or zip from [Releases](https://github.com/ardasatata/nichi/releases).
Builds are currently unsigned, so macOS blocks the first launch. Click **Done**, then allow it under
System Settings → Privacy & Security → **Open Anyway** (on macOS 15+ right-click → Open no longer works).
Or run `xattr -dr com.apple.quarantine /Applications/Nichi.app`.

Homebrew (once signed releases and the tap are live):

```sh
brew install --cask ardasatata/tap/nichi
```

## Development

```sh
brew install xcodegen
xcodegen generate
open Nichi.xcodeproj          # or: xcodebuild -scheme Nichi -destination 'platform=macOS' test
scripts/build-release.sh 0.1.0 && scripts/make-dmg.sh 0.1.0
```

## Releases

Pushing a `v*` tag runs `.github/workflows/release.yml`: build, package DMG + zip, publish a GitHub Release.

Signing, notarization and the Homebrew cask bump are wired up but skipped until these repository secrets exist:

| Secret | Purpose |
|---|---|
| `DEVELOPER_ID_P12`, `DEVELOPER_ID_P12_PASSWORD`, `KEYCHAIN_PASSWORD` | Developer ID Application certificate (p12 base64-encoded) |
| `ASC_KEY_ID`, `ASC_ISSUER_ID`, `ASC_KEY_P8` | App Store Connect API key for `notarytool` |
| `HOMEBREW_TAP_TOKEN` | Token with push access to `ardasatata/homebrew-tap` |

Enable the cask step only after notarization works; Homebrew rejects casks that fail Gatekeeper.
