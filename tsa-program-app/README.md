# TSA 9-Week Intermediate Program – Web App MVP

A mobile-first progressive web app for the **TSA Intermediate Approach 2.0** (9-week powerlifting program by Bryce Lewis / The Strength Athlete).

## Features

### Core
- **Setup maxes**: Enter recent heavy singles/low-rep sets + optional RPE → automatic estimated 1RM using the official TSA RPE chart (or Brzycki fallback).
- **Rounding**: Choose 2.5 kg or 5 lb plate increments.
- **All 9 weeks** with correct day structure and calculated loads for percentage-based main lifts.
- **Logging**: Record Weight Used, Reps Done, and RPE for every exercise (green cells equivalent). Data saved in browser localStorage.

### Customization (requested extras)
- **Edit any exercise**: Change name, sets, reps, intensity, type (percentage / RPE / other), and which 1RM it references.
- **Add accessory movements**: Name them, set sets/reps/RPE, etc.
- **Remove exercises**.
- **Reset individual days** back to the original program template.
- All customizations and logs persist on the device.

## How to run

### Option 1 – Local static server (recommended)
```bash
cd tsa-program-app
python3 -m http.server 8080
# then open http://localhost:8080 on your phone or browser
```

### Option 2 – Open directly
Most modern browsers allow opening `index.html` directly, but `fetch` for the JSON may be blocked by CORS when using `file://`. Prefer a local server.

### Android
1. Open the URL in Chrome.
2. Menu → “Add to Home screen” / “Install app” (PWA).
3. It will open fullscreen like a native app. Works offline after first load (data is local).

## Data
- Everything stays on your device (localStorage). No accounts, no server.
- Program structure extracted from the official LiftVault / TSA spreadsheet.

## Credits
- Original program: **The Strength Athlete** (Bryce Lewis) – https://www.thestrengthathlete.com
- Spreadsheet source: LiftVault.com
- This web MVP is an independent recreation for personal use.
