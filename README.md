# For You

A mobile-first, fully local proposal experience built with React, Vite, Tailwind CSS, and Capacitor. The production app makes no API calls and requires no login, backend, database, or internet connection. The generated image, text, UI, animation, and optional music are all local project assets.

## Project structure

```text
src/
  components/Ui.tsx   Shared Android-style controls and celebration effects
  config.ts           All names, messages, music, and theme values
  App.tsx             Screen flow, history, sound, and interactions
  index.css           Responsive visual system and motion
public/
  images/             Local background photography
  audio/              Optional local soundtrack
  icon.svg            App/PWA icon
  manifest.webmanifest Install metadata
  sw.js               Browser offline cache
capacitor.config.ts   Android wrapper configuration
```

## Run locally

Requirements: Node.js 22 or newer and npm. Capacitor 8 requires Node.js 22.

```bash
npm install
npm run dev
```

Open the local address shown by Vite. For a production build:

```bash
npm run build
npm run preview
```

The existing single-file Vite plugin bundles the React code and CSS into `dist/index.html`. Local media is copied into `dist` alongside it.

## Personalize it

Open `src/config.ts`. This is the only file required for normal personalization.

- Change `creatorName` to update RICK's name.
- Set `recipientName`, for example `recipientName: "MAYA"`. The greeting automatically changes to the `greetingForRecipient` text, and it also personalizes the celebration subtitle.
- Adjust the personalized wording in `welcome.greeting`, `welcome.greetingForRecipient`, `accepted.subtitle`, and `accepted.subtitleForRecipient`. Keep `{recipient}` where the app should insert her name.
- Change `proposalQuestion` and `proposal.lead` for the reveal.
- Edit `welcome` and `introduction` for the opening screens.
- Add, remove, or edit entries in `messages`; each card supports `label`, `text`, and `buttonText`.
- Adjust `noConfirmation` for the playful but respectful NO bottom sheet.
- Change `finalMessage`, `maybeMessage`, and `noMessage` for the three outcomes.
- Change colors under `theme` to restyle the app.

Keep message text reasonably concise. The layout scrolls safely when content is long, including on small Android screens.

## Add optional offline music

1. Copy an MP3 file to `public/audio`, such as `public/audio/our-song.mp3`.
2. Set `music.source` in `src/config.ts` to `"./audio/our-song.mp3"`.
3. Rebuild the project and sync Android.

The music is bundled with the app, loops locally, never autoplays, and can be muted from the top-right sound control.

## Package for Android

The project includes Capacitor and its Android package. Android Studio, its Android SDK, and a Java version supported by your installed Android Studio are required.

Run this once to create the native Android project:

```bash
npm run build
npx cap add android
npx cap sync android
npx cap open android
```

In Android Studio:

1. Wait for the Gradle sync to finish.
2. Connect an Android phone with USB debugging enabled, then press Run to install a debug version.
3. To create an installable APK, use **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
4. For sharing outside your own phone, use **Build > Generate Signed Bundle / APK**, choose APK, and create or select a signing key.

After any web code or content change, update the Android project with:

```bash
npm run build
npx cap sync android
```

The Android back button follows the app's screen history. At the welcome screen, it returns to the initial state when possible instead of navigating back through the previous story. Safe-area padding covers status and navigation bars, touch targets are at least 48px, and animations honor the device's reduced-motion preference.

## Offline behavior

Capacitor packages `dist` inside the Android application, so the installed app is fully offline. The service worker also caches the browser version after its first hosted load. No CDN fonts, remote images, analytics, API requests, or external services are used at runtime.