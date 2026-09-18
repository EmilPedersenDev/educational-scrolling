# educational-scrolling

Small Expo/React Native app that shows the day's 10 educational content items from Supabase.
A dropdown in the top-left switches between today and the 6 previous days; already-loaded days
are cached in memory so switching back is instant. Read-only — the app never writes to the database.

Content is written to the `daily_content` table by a separate scheduled task; this app just reads it.

## Local setup

```bash
npm install
cp .env.example .env   # fill in the Supabase URL + publishable key
```

## Develop (fast iteration, needs your laptop running)

```bash
npx expo start
```

Scan the QR code with the **Expo Go** app on your phone. Note: the Play Store build of Expo Go
currently lags behind this project's Expo SDK (57), so if Expo Go on your phone refuses to open the
project, sideload the matching APK from https://github.com/expo/expo-go-releases/releases instead of
using the Play Store version. If your phone and laptop aren't on the same network, use
`npx expo start --tunnel`.

This mode only runs while the dev server is up on your laptop — it's for development, not daily use.

## Build a standalone APK (install once, run without a laptop)

Uses [EAS Build](https://docs.expo.dev/build/introduction/) — Expo compiles the app in the cloud, so
you don't need Android Studio locally.

```bash
npm i -g eas-cli
eas login   # Expo account: pedersen268@gmail.com
```

One-time: push the Supabase env vars to EAS (read from your local `.env`), so the cloud build can see
them without them ever being committed to git:

```bash
eas env:create --scope project --name EXPO_PUBLIC_SUPABASE_URL \
  --value "$(grep EXPO_PUBLIC_SUPABASE_URL .env | cut -d= -f2-)" \
  --environment preview,production --visibility plaintext --non-interactive

eas env:create --scope project --name EXPO_PUBLIC_SUPABASE_ANON_KEY \
  --value "$(grep EXPO_PUBLIC_SUPABASE_ANON_KEY .env | cut -d= -f2-)" \
  --environment preview,production --visibility plaintext --non-interactive
```

Then build:

```bash
eas build -p android --profile preview
```

Takes ~10–15 minutes. When it finishes, the terminal (and the Expo dashboard) shows a build page URL
and QR code. Open that page **on your phone**, download the APK, and install it (Android will ask
once to allow installs from your browser). The app installs with its own icon and runs standalone —
no laptop, no dev server.

Rebuild only when the app's **code** changes. New daily content rows show up on next app launch or
pull-to-refresh — no rebuild needed for that.

## Project layout

```
App.tsx                         screen: header, day dropdown, content list
src/lib/supabase.ts             Supabase client (env-driven, no auth/session)
src/lib/days.ts                 builds the 7-day list (today .. 6 days back)
src/hooks/useDailyContent.ts    fetch + in-memory per-day cache
src/components/DayFilter.tsx    top-left day dropdown
src/components/ContentCard.tsx  one content item (title, content, read-more link)
```
