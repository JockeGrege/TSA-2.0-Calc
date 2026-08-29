# TSA 9-Week Intermediate Program – Web App

A mobile-first progressive web app for the **TSA Intermediate Approach 2.0** (9-week powerlifting program by Bryce Lewis / The Strength Athlete).

## Features

### Core
- **Setup maxes**: Enter recent heavy singles/low-rep sets + optional RPE → automatic estimated 1RM using the official TSA RPE chart (or Brzycki fallback).
- **Rounding**: Choose 2.5 kg or 5 lb plate increments.
- **All 9 weeks** with correct day structure and calculated loads for percentage-based main lifts.
- **Logging**: Record Weight Used, Reps Done, and RPE for every exercise. These fields only accept numbers — Weight Used and Reps Done clamp negative values to 0, and RPE clamps to 1–10. RPE is color-coded by intensity band (green 4–5, yellow 6–7.5, orange 8–9, red 9.5+) everywhere it appears — the log input, the prescribed "@RPE" target badge, and the Program Table. Data syncs to your account and is cached locally for offline use.
- **Warmup calculator**: Generate a warmup ramp (Slow / Medium / Fast schemes) for each main lift's working weight, with an expandable stage-by-stage table and an editable target weight if you want to recalibrate.
- **Program Table view**: A compact, spreadsheet-style overview of the whole program — switch between all 9 weeks or a single week, with per-day sections and highlighted main-lift rows. Uses the full screen width on larger/landscape viewports (≥760px) instead of scrolling.
- **Progress view**: A chart of estimated 1RM per lift across the 9-week block — squat/bench/deadlift by default (or, for a custom profile without SBD tracking, whichever tracked lifts you've marked "Main" instead — see Profiles below), plus any exercise you mark as a "tracked" accessory lift (picked by name from a small registry, so the same lift stays on one line across different weeks). Click a data point to see exactly which day/set produced it, with a button to jump straight there. Filter by All / Main Lifts / Accessory (resets to "All" each session, not synced — this is toggled often enough that syncing it isn't worth the extra writes), and toggle individual lifts on/off in the legend just for the current visit. Also uses the full screen width on larger viewports, like the Program Table.
- **Plate Calculator**: Given a target weight, shows the barbell + plate breakdown per side, with color swatches matching real competition plate colors. Configurable barbell weight, collar weight, available plate inventory (per unit, with an "Unlimited" option), and unit (kg/lb).
- **RPE Calculator**: A standalone what-if calculator, reachable from every screen. Enter a Weight/Reps/RPE combo to get an estimated 1RM (using the same RPE chart and formula as the rest of the app), then pick a target rep count to see a suggested weight at every RPE from 10 down to 6. Not tied to logged sets — nothing here is saved or synced.
- **Accounts & cloud sync**: Sign in with email/password or Google. Data syncs across devices via Firebase, with offline support (edits made without a connection sync once you're back online). The Profiles screen shows the signed-in account's email.
- **Profiles**: Maintain multiple training-block profiles under one account. "+ New Profile" creates the original TSA program with Squat/Bench/Deadlift tracking; "+ New Custom Profile" opens a short wizard letting you keep that same setup or start a fully custom program instead — no preset exercises, your own name for each week, and up to 3 of your own tracked lifts marked "Main" (they get a Home summary card and full Progress treatment in place of Squat/Bench/Deadlift). Rename, duplicate, switch, and see the active profile clearly marked. A "more actions" menu per profile handles Export, Save as Blueprint, Reset to Original Default, Reset to Blueprint, Hide/Unhide, and Delete — all destructive actions ask for confirmation first. Hidden profiles (backups, retired training blocks, anything you don't need day-to-day) drop out of the main list into a collapsed "Hidden Profiles" section — expand it to find one, then unhide it to bring it back. Hidden state persists across sessions.
- **Blueprints**: Save any profile's current setup (maxes, custom exercises, plate settings, tracked lifts, rounding — not logged sets) as a reusable named template from its "more actions" menu. Reset a profile back to a saved blueprint later, or pick one to seed a brand-new profile from instead of starting blank. Manage saved blueprints (rename/delete) from their own screen, reachable from the Profiles list.
- **Import/Export**: Export any profile to a JSON file for an offline backup. Importing a file always creates a new profile (never overwrites), so restoring is non-destructive.
- **Share with a coach**: Grant read-only access to a profile by adding a coach's email. The coach signs in with their own account and sees your maxes, logs, and the Program Table exactly as you do, but can't edit anything. Access is enforced server-side (Firestore security rules), not just hidden in the UI. The share link only works once at least one email has been added.

### Customization
- **Edit any exercise**: Change name, sets, reps, intensity, type (percentage / RPE / other), which 1RM it references (hidden on a custom profile without SBD tracking, since there's no 1RM to reference), and a free-text note (e.g. equipment used) shown in small text under the exercise name.
- **Add accessory movements**: Name them, set sets/reps/RPE, etc.
- **Remove exercises**.
- **Reset individual days** back to the original program template.
- All customizations and logs persist per profile and sync to your account.

### Mobile/touch
Designed for one-handed phone use: large tap targets throughout (the whole load/weight badge is tappable, not just the icon), an easy-to-hit "Unlimited" checkbox, and numeric inputs that select their existing value on focus so you can immediately type a replacement. On Android, the hardware/gesture back button navigates within the app (closing an open modal first, then stepping back through screens) instead of exiting straight away.

## How to run

### Option 1 – Local static server (recommended)
```bash
python3 -m http.server 8080
# then open http://localhost:8080 on your phone or browser
```

### Option 2 – Open directly
Most modern browsers allow opening `index.html` directly, but `fetch` for the JSON may be blocked by CORS when using `file://`. Prefer a local server.

### Android
1. Open the URL in Chrome.
2. Menu → "Add to Home screen" / "Install app" (PWA).
3. It will open fullscreen like a native app. Works offline after first load (data is local).

## Data
- Your maxes, logs, plate settings, custom exercises, and tracked-lift registry sync to your account via Firebase (Auth + Firestore), with a local cache so the app keeps working offline.
- Each account can hold multiple profiles (`users/{uid}/profiles/{profileId}`) and any number of saved blueprints (`users/{uid}/blueprints/{blueprintId}`); a profile can optionally list coach emails (`viewerEmails`) granted read-only access.
- Program structure extracted from the official LiftVault / TSA spreadsheet.

## Firebase setup (for developers)
This app needs its own Firebase project with Authentication and Firestore enabled. To set one up from scratch:

1. **Create a project.** Go to the [Firebase Console](https://console.firebase.google.com/), click **Add project**, and follow the prompts (Google Analytics is optional, not used by this app).

2. **Register a Web App.** In the project's Overview page, click the **Web** (`</>`) icon to add a web app. Give it a nickname (Firebase Hosting setup can be skipped unless you plan to use it). Firebase will show a `firebaseConfig` object — copy its values into `firebase-config.js` at the repo root:
   ```js
   window.FIREBASE_CONFIG = {
     apiKey: "...",
     authDomain: "...",
     projectId: "...",
     storageBucket: "...",
     messagingSenderId: "...",
     appId: "..."
   };
   ```
   This file is loaded as a plain script before the Firebase SDK, so no build step or environment variables are needed. The values here aren't secret — access is controlled by the Firestore rules below, not by hiding this file.

3. **Enable sign-in providers.** In the console, go to **Authentication → Sign-in method** and enable both:
   - **Email/Password**
   - **Google**

4. **Authorize your domain(s).** Still under Authentication, go to **Settings → Authorized domains** and add every domain the app will actually be served from (e.g. your GitHub Pages domain). `localhost` is included by default, which covers local development. Google sign-in's popup flow will fail with an `unauthorized-domain` error on any domain not in this list.

5. **Create the Firestore database.** Go to **Firestore Database → Create database**, choose **Production mode** (the security rules in this repo — not the default-deny production rules — are what actually govern access), and pick a region.

6. **Deploy the security rules.** Install the CLI (`npm install --no-save firebase-tools`), then:
   ```bash
   npx firebase login
   npx firebase use --add        # select your project, e.g. as the "default" alias
   npx firebase deploy --only firestore:rules
   ```
   `firestore.rules` allows a profile to be read by its owner or by any signed-in user whose email is listed in that profile's `viewerEmails` (the coach-sharing feature); writes remain owner-only. `firestore.indexes.json` is empty — this app doesn't need any composite indexes.

7. **(Optional) Firebase Hosting.** `firebase.json` already declares a hosting config pointing at the repo root, if you'd rather deploy there than to GitHub Pages: `npx firebase deploy --only hosting`.

8. **(Recommended) Restrict the API key.** `firebase-config.js` is committed to the repo and its `apiKey` is visible to anyone — this is normal for Firebase web apps and isn't itself a vulnerability (it doesn't grant data access; the Firestore rules above are what actually do that). As an extra guardrail against quota abuse, restrict the key in the [Google Cloud Console](https://console.cloud.google.com/) (Firebase projects are Google Cloud projects, so this is the same project): **APIs & Services → Credentials**, open the key (usually named something like "Browser key (auto created by Firebase)"), then:
   - Under **Application restrictions**, choose **HTTP referrers** and add every domain the app is served from, e.g. `https://yourusername.github.io/*` and `http://localhost:8080/*`.
   - Under **API restrictions**, choose **Restrict key** and select only what this app actually calls: **Identity Toolkit API**, **Token Service API**, **Cloud Firestore API**, and **Firebase Installations API**.
   - Save, then re-test sign-in (email/password and Google) on every domain you added. If something breaks, the browser console error will name the specific API to add back.

## Offline app shell
`sw.js` caches the app shell (HTML/CSS/JS + the Firebase SDK) so a cold start works with no connection. There's no build step to hash filenames automatically, so bump `CACHE_VERSION` in `sw.js` by hand whenever any cached file changes — otherwise visitors keep getting the stale cached version.

## Credits
- Original program: **The Strength Athlete** (Bryce Lewis) – https://www.thestrengthathlete.com
- Spreadsheet source: LiftVault.com
- This web app is an independent recreation for personal use.
