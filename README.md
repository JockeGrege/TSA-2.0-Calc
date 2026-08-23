# TSA 9-Week Intermediate Program – Web App

A mobile-first progressive web app for the **TSA Intermediate Approach 2.0** (9-week powerlifting program by Bryce Lewis / The Strength Athlete).

## Features

### Core
- **Setup maxes**: Enter recent heavy singles/low-rep sets + optional RPE → automatic estimated 1RM using the official TSA RPE chart (or Brzycki fallback).
- **Rounding**: Choose 2.5 kg or 5 lb plate increments.
- **All 9 weeks** with correct day structure and calculated loads for percentage-based main lifts.
- **Logging**: Record Weight Used, Reps Done, and RPE for every exercise. RPE is color-coded by intensity band (green 4–5, yellow 6–7.5, orange 8–9, red 9.5+) everywhere it appears — the log input, the prescribed "@RPE" target badge, and the Program Table. Data syncs to your account and is cached locally for offline use.
- **Warmup calculator**: Generate a warmup ramp (Slow / Medium / Fast schemes) for each main lift's working weight, with an expandable stage-by-stage table and an editable target weight if you want to recalibrate.
- **Program Table view**: A compact, spreadsheet-style overview of the whole program — switch between all 9 weeks or a single week, with per-day sections and highlighted main-lift rows. Uses the full screen width on larger/landscape viewports (≥760px) instead of scrolling.
- **Plate Calculator**: Given a target weight, shows the barbell + plate breakdown per side, with color swatches matching real competition plate colors. Configurable barbell weight, collar weight, available plate inventory (per unit, with an "Unlimited" option), and unit (kg/lb).
- **Accounts & cloud sync**: Sign in with email/password or Google. Data syncs across devices via Firebase, with offline support (edits made without a connection sync once you're back online). The Profiles screen shows the signed-in account's email.
- **Profiles**: Maintain multiple training-block profiles (e.g. different accessories or rep ranges) under one account. Rename, duplicate, switch, and see the active one clearly marked. A "more actions" menu per profile handles Export, Reset to Default, and Delete — all destructive actions ask for confirmation first.
- **Import/Export**: Export any profile to a JSON file for an offline backup. Importing a file always creates a new profile (never overwrites), so restoring is non-destructive.
- **Share with a coach**: Grant read-only access to a profile by adding a coach's email. The coach signs in with their own account and sees your maxes, logs, and the Program Table exactly as you do, but can't edit anything. Access is enforced server-side (Firestore security rules), not just hidden in the UI. The share link only works once at least one email has been added.

### Customization
- **Edit any exercise**: Change name, sets, reps, intensity, type (percentage / RPE / other), and which 1RM it references.
- **Add accessory movements**: Name them, set sets/reps/RPE, etc.
- **Remove exercises**.
- **Reset individual days** back to the original program template.
- All customizations and logs persist per profile and sync to your account.

### Mobile/touch
Designed for one-handed phone use: large tap targets throughout (the whole load/weight badge is tappable, not just the icon), an easy-to-hit "Unlimited" checkbox, and numeric inputs that select their existing value on focus so you can immediately type a replacement.

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
- Your maxes, logs, plate settings, and custom exercises sync to your account via Firebase (Auth + Firestore), with a local cache so the app keeps working offline.
- Each account can hold multiple profiles (`users/{uid}/profiles/{profileId}`); a profile can optionally list coach emails (`viewerEmails`) granted read-only access.
- Program structure extracted from the official LiftVault / TSA spreadsheet.

## Firebase setup (for developers)
This app expects a Firebase project with Authentication (Email/Password + Google) and Firestore enabled. See `firebase-config.js` for where to put your project's config, and `firestore.rules` for the security rules (profile reads are allowed for the owner or any authenticated user whose email is listed in that profile's `viewerEmails`; writes remain owner-only). Deploy rules with `firebase deploy --only firestore:rules` (requires `firebase-tools`, e.g. `npm install --no-save firebase-tools`).

## Offline app shell
`sw.js` caches the app shell (HTML/CSS/JS + the Firebase SDK) so a cold start works with no connection. There's no build step to hash filenames automatically, so bump `CACHE_VERSION` in `sw.js` by hand whenever any cached file changes — otherwise visitors keep getting the stale cached version.

## Credits
- Original program: **The Strength Athlete** (Bryce Lewis) – https://www.thestrengthathlete.com
- Spreadsheet source: LiftVault.com
- This web app is an independent recreation for personal use.
