/**
 * TSA 9-Week Intermediate Program – MVP Web App
 * Based on The Strength Athlete Intermediate Approach 2.0
 */

// ========== DATA ==========
const RPE_CHART = {
  "10":   [1.0, 0.955, 0.922, 0.892, 0.863, 0.837, 0.811, 0.786, 0.762, 0.739, 0.707, 0.68],
  "9.5":  [0.978, 0.939, 0.907, 0.878, 0.85, 0.824, 0.799, 0.774, 0.751, 0.723, 0.694, 0.667],
  "9":    [0.955, 0.922, 0.892, 0.863, 0.837, 0.811, 0.786, 0.762, 0.739, 0.707, 0.68, 0.653],
  "8.5":  [0.939, 0.907, 0.878, 0.85, 0.824, 0.799, 0.774, 0.751, 0.723, 0.694, 0.667, 0.64],
  "8":    [0.922, 0.892, 0.863, 0.837, 0.811, 0.786, 0.762, 0.739, 0.707, 0.68, 0.653, 0.626],
  "7.5":  [0.907, 0.878, 0.85, 0.824, 0.799, 0.774, 0.751, 0.723, 0.694, 0.667, 0.64, 0.613],
  "7":    [0.892, 0.863, 0.837, 0.811, 0.786, 0.762, 0.739, 0.707, 0.68, 0.653, 0.626, 0.599],
  "6.5":  [0.878, 0.85, 0.824, 0.799, 0.774, 0.751, 0.723, 0.694, 0.667, 0.64, 0.613, 0.586]
};

let PROGRAM = null; // loaded from JSON

const WARMUP_SCHEMES = {
  slow: {
    label: 'Slow',
    steps: [
      { percentLabel: '50',    percent: 0.50,   reps: '8', rest: '2 minutes' },
      { percentLabel: '60',    percent: 0.60,   reps: '5', rest: '2 minutes' },
      { percentLabel: '70',    percent: 0.70,   reps: '3', rest: '2 minutes' },
      { percentLabel: '80',    percent: 0.80,   reps: '2', rest: '2 minutes' },
      { percentLabel: '85',    percent: 0.85,   reps: '1', rest: '3 minutes' },
      { percentLabel: '90',    percent: 0.90,   reps: '1', rest: '3 minutes' },
      { percentLabel: '95',    percent: 0.95,   reps: '1', rest: '5 minutes' }
    ]
  },
  medium: {
    label: 'Medium',
    steps: [
      { percentLabel: '50', percent: 0.50, reps: '5', rest: '2 minutes' },
      { percentLabel: '65', percent: 0.65, reps: '5', rest: '2 minutes' },
      { percentLabel: '78', percent: 0.78, reps: '3', rest: '2 minutes' },
      { percentLabel: '88', percent: 0.88, reps: '2', rest: '3 minutes' },
      { percentLabel: '96', percent: 0.96, reps: '1', rest: '3 minutes' }
    ]
  },
  fast: {
    label: 'Fast',
    steps: [
      { percentLabel: '52.94', percent: 0.5294, reps: '10', rest: '2 minutes' },
      { percentLabel: '70.58', percent: 0.7058, reps: '8',  rest: '2 minutes' },
      { percentLabel: '82.35', percent: 0.8235, reps: '5',  rest: '2 minutes' },
      { percentLabel: '91.17', percent: 0.9117, reps: '3',  rest: '3 minutes' }
    ]
  }
};

// ========== PLATE CALCULATOR DATA ==========
const PLATE_DENOMS_KG = [25, 20, 15, 10, 5, 2.5, 1.25];
const PLATE_DENOMS_LB = [45, 35, 25, 10, 5, 2.5];
const BARBELL_OPTIONS_KG = [12, 15, 20, 25, 30];
const BARBELL_OPTIONS_LB = [33, 35, 45, 55];

const PLATE_VISUAL_KG = {
  25:   { color: '#dc2626', width: 26, height: 100 },
  20:   { color: '#2563eb', width: 22, height: 100 },
  15:   { color: '#facc15', width: 18, height: 90 },
  10:   { color: '#4ade80', width: 16, height: 80 },
  5:    { color: '#f8fafc', width: 12, height: 60, border: '#334155' },
  2.5:  { color: '#000000', width: 8,  height: 45, border: '#6b7280' },
  1.25: { color: '#6b7280', width: 6,  height: 35, border: '#000000' }
};
const PLATE_VISUAL_LB = {
  45: { color: '#dc2626', width: 26, height: 100 },
  35: { color: '#2563eb', width: 22, height: 90 },
  25: { color: '#facc15', width: 18, height: 80 },
  10: { color: '#4ade80', width: 14, height: 70 },
  5:  { color: '#f8fafc', width: 10, height: 55, border: '#334155' },
  2.5:{ color: '#000000', width: 7,  height: 40, border: '#6b7280' }
};

const BARBELL_ICON_SVG = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="1" y1="12" x2="4" y2="12"/><rect x="4" y="9" width="2" height="6" fill="currentColor"/><rect x="6" y="6" width="3" height="12" fill="currentColor"/><line x1="9" y1="12" x2="15" y2="12"/><rect x="15" y="6" width="3" height="12" fill="currentColor"/><rect x="18" y="9" width="2" height="6" fill="currentColor"/><line x1="20" y1="12" x2="23" y2="12"/></svg>`;

function defaultPlateSettings() {
  const platesKg = {};
  PLATE_DENOMS_KG.forEach((d) => { platesKg[d] = { count: 0, unlimited: true }; });
  const platesLb = {};
  PLATE_DENOMS_LB.forEach((d) => { platesLb[d] = { count: 0, unlimited: true }; });
  return {
    barbellKg: 20,
    barbellLb: 45,
    collars: false,
    platesKg,
    platesLb
  };
}

// ========== STATE ==========
const state = {
  view: 'home', // home | setup | week | day | auth | profiles | plates
  viewHistory: [], // back-stack of prior views; goBack() pops it
  currentWeek: null,
  currentDayIdx: 0,
  maxes: {
    squat: { weight: '', reps: '', rpe: '', e1rm: null },
    bench: { weight: '', reps: '', rpe: '', e1rm: null },
    deadlift: { weight: '', reps: '', rpe: '', e1rm: null }
  },
  rounding: 2.5,
  // Custom program overrides: { "1-0-3": { name, sets, reps, ... } } keyed by week-dayIdx-exIdx
  // or full custom days stored
  customExercises: {}, // week -> dayIdx -> array of exercises (full override if present)
  logs: {}, // "week-dayIdx-exIdx" -> { weightUsed, repsDone, rpe }
  editing: null, // { week, dayIdx, exIdx } or 'add'

  // Plate calculator settings (persisted, synced like maxes/rounding)
  plateSettings: defaultPlateSettings(),

  // Warmup calculator (session-only; never saved or synced)
  warmups: {}, // "week-dayIdx-exIdx" -> { scheme, targetWeight, expanded }

  // Plate breakdown UI (session-only; never saved or synced)
  plateBreakdownOpen: {}, // id -> boolean
  plateCalcWeight: '', // manual weight entry on the standalone Plate Calculator screen

  // Auth / cloud sync
  user: null,
  authReady: false,
  authMode: 'login', // 'login' | 'signup'
  authError: '',
  profileId: null,
  profiles: [], // [{ id, name }]
  profileUnsubscribe: null,
  syncStatus: 'synced', // 'synced' | 'syncing' | 'offline' | 'error'

  // Read-only coach view: set when opening a ?shareUid=&shareProfile= link.
  // While set, we never write - we're viewing someone else's profile, not our own.
  readOnly: false,
  sharedView: null // { uid, profileId, ownerName } or null
};

// ========== PERSISTENCE ==========
const STORAGE_KEY = 'tsa9week_v1';
let cloudSaveTimer = null;
// Tracks whether our own outgoing write is still in flight, so a late-arriving
// snapshot echo of an OLDER write can't clobber a newer local change (e.g. an
// edit followed shortly by a reset, on a large profile where the round trip
// for the edit's write is slower than the gap between the two actions).
let saveEpoch = 0;
let confirmedEpoch = 0;

function saveState() {
  const toSave = {
    maxes: state.maxes,
    rounding: state.rounding,
    customExercises: state.customExercises,
    logs: state.logs,
    plateSettings: state.plateSettings
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));

  if (state.user && state.profileId) {
    setSyncStatus('syncing');
    clearTimeout(cloudSaveTimer);
    const myEpoch = ++saveEpoch;
    cloudSaveTimer = setTimeout(() => {
      window.Firebase.saveProfileData(state.user.uid, state.profileId, toSave)
        .then(() => {
          confirmedEpoch = myEpoch;
          setSyncStatus('synced');
        })
        .catch((e) => {
          confirmedEpoch = myEpoch;
          console.warn('Cloud sync failed', e);
          setSyncStatus(navigator.onLine ? 'error' : 'offline');
        });
    }, 600);
  }
}

const syncIndicator = document.getElementById('sync-indicator');

function setSyncStatus(status) {
  state.syncStatus = status;
  syncIndicator.className = 'sync-dot ' + status;
  syncIndicator.classList.toggle('hidden', state.view === 'auth' || (status === 'synced' && navigator.onLine));
  syncIndicator.title = {
    syncing: 'Syncing…',
    synced: 'All changes synced',
    offline: 'Offline — changes saved locally, will sync when back online',
    error: 'Sync error — changes saved locally'
  }[status];
}

window.addEventListener('online', () => setSyncStatus(state.syncStatus === 'offline' ? 'synced' : state.syncStatus));
window.addEventListener('offline', () => setSyncStatus('offline'));

// ========== CALCULATIONS ==========
function estimate1RM(weight, reps, rpe) {
  weight = parseFloat(weight);
  reps = parseInt(reps);
  if (!weight || !reps || weight <= 0 || reps <= 0) return null;

  let percent;
  if (rpe && RPE_CHART[String(rpe)]) {
    const idx = Math.min(Math.max(reps, 1), 12) - 1;
    percent = RPE_CHART[String(rpe)][idx];
  } else {
    // Brzycki-like fallback used in original sheet
    percent = 1.0278 - 0.0278 * reps;
  }
  if (!percent || percent <= 0) return null;
  return Math.round((weight / percent) * 10) / 10;
}

function mround(value, multiple) {
  if (!multiple || multiple <= 0) return value;
  return Math.round(value / multiple) * multiple;
}

function calcLoad(percent, lift) {
  const e1rm = state.maxes[lift]?.e1rm;
  if (!e1rm || percent == null) return null;
  return mround(e1rm * percent, state.rounding);
}

// ========== PLATE CALCULATOR ==========
function getPlateUnit() {
  return state.rounding === 2.5 ? 'kg' : 'lb';
}

function getPlateDenoms() {
  return getPlateUnit() === 'kg' ? PLATE_DENOMS_KG : PLATE_DENOMS_LB;
}

function getPlateVisual() {
  return getPlateUnit() === 'kg' ? PLATE_VISUAL_KG : PLATE_VISUAL_LB;
}

function getActivePlates() {
  return getPlateUnit() === 'kg' ? state.plateSettings.platesKg : state.plateSettings.platesLb;
}

function getBarbellWeight() {
  return getPlateUnit() === 'kg' ? state.plateSettings.barbellKg : state.plateSettings.barbellLb;
}

function getCollarWeight() {
  return state.plateSettings.collars ? state.rounding : 0;
}

function computePlateBreakdown(targetWeight) {
  const barbell = getBarbellWeight();
  const collarWeight = getCollarWeight();
  const unit = getPlateUnit();
  let perSide = (targetWeight - barbell - collarWeight) / 2;
  const shortBy = perSide < 0 ? -perSide * 2 : 0;
  perSide = Math.max(0, perSide);

  const plates = getActivePlates();
  const denoms = getPlateDenoms();
  const breakdown = [];
  let remaining = perSide;

  denoms.forEach((d) => {
    const info = plates[d] || { count: 0, unlimited: false };
    const maxUsable = info.unlimited ? Infinity : Math.floor(info.count / 2);
    const n = Math.min(maxUsable, Math.floor(remaining / d + 1e-9));
    if (n > 0) {
      breakdown.push({ denom: d, count: n });
      remaining -= n * d;
    }
  });

  return {
    barbell,
    collars: state.plateSettings.collars,
    collarWeight,
    perSide: breakdown,
    leftoverPerSide: remaining,
    shortBy,
    unit
  };
}

function formatPlateBreakdown(breakdown) {
  if (breakdown.shortBy > 0.001) {
    return `Below empty bar${breakdown.collars ? ' + collars' : ''} by ${breakdown.shortBy}`;
  }
  if (breakdown.perSide.length === 0) {
    return 'Empty bar only';
  }
  const parts = breakdown.perSide.map((p) => `${p.count}×${p.denom}`).join(' + ');
  const leftoverNote = breakdown.leftoverPerSide > 0.001
    ? ` (short ${(breakdown.leftoverPerSide * 2).toFixed(2).replace(/\.00$/, '')} — not enough plates)`
    : '';
  return `${parts} per side${leftoverNote}`;
}

function updateE1RMs() {
  for (const lift of ['squat', 'bench', 'deadlift']) {
    const m = state.maxes[lift];
    m.e1rm = estimate1RM(m.weight, m.reps, m.rpe);
  }
}

// ========== GET EXERCISES (with custom overrides) ==========
function getExercises(week, dayIdx) {
  const key = `${week}-${dayIdx}`;
  if (state.customExercises[key]) {
    return state.customExercises[key];
  }
  // Deep clone from program
  const day = PROGRAM[String(week)]?.days[dayIdx];
  if (!day) return [];
  return JSON.parse(JSON.stringify(day.exercises));
}

function setExercises(week, dayIdx, exercises) {
  const key = `${week}-${dayIdx}`;
  state.customExercises[key] = exercises;
  saveState();
}

function getLogKey(week, dayIdx, exIdx) {
  return `${week}-${dayIdx}-${exIdx}`;
}

// ========== RENDER ==========
const mainEl = document.getElementById('main');
const headerTitle = document.getElementById('header-title');
const btnBack = document.getElementById('btn-back');
const btnSetup = document.getElementById('btn-setup');
const btnProfile = document.getElementById('btn-profile');
const btnPlates = document.getElementById('btn-plates');
const bottomNav = document.getElementById('bottom-nav');
const sharedBanner = document.getElementById('shared-banner');
const sharedBannerText = document.getElementById('shared-banner-text');

function showToast(msg, duration = 2000) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), duration);
}

function render() {
  if (!state.authReady) {
    btnBack.classList.add('hidden');
    btnSetup.classList.add('hidden');
    btnProfile.classList.add('hidden');
    btnPlates.classList.add('hidden');
    syncIndicator.classList.add('hidden');
    bottomNav.classList.add('hidden');
    headerTitle.textContent = 'TSA 9-Week';
    mainEl.innerHTML = `<div class="empty-state"><p>Loading…</p></div>`;
    return;
  }

  if (!state.user) state.view = 'auth';

  updateE1RMs();
  btnBack.classList.toggle('hidden', state.view === 'home' || state.view === 'auth');
  btnSetup.classList.toggle('hidden', state.view === 'auth' || state.readOnly);
  btnProfile.classList.toggle('hidden', state.view === 'auth' || state.readOnly);
  btnPlates.classList.toggle('hidden', state.view === 'auth');
  setSyncStatus(state.syncStatus);
  bottomNav.classList.add('hidden');
  sharedBanner.classList.toggle('hidden', !state.readOnly || state.view === 'auth');
  if (state.readOnly) sharedBannerText.textContent = `Viewing "${state.sharedView.profileName}" (read-only)`;

  const activeProfile = state.profiles.find((p) => p.id === state.profileId);
  btnProfile.title = activeProfile ? `Profiles (${activeProfile.name})` : 'Profiles';

  if (state.view === 'auth') {
    headerTitle.textContent = 'Sign In';
    renderAuth();
  } else if (state.view === 'profiles') {
    headerTitle.textContent = 'Profiles';
    renderProfiles();
  } else if (state.view === 'plates') {
    headerTitle.textContent = 'Plate Calculator';
    renderPlateCalculator();
  } else if (state.view === 'home') {
    headerTitle.textContent = 'TSA 9-Week';
    renderHome();
  } else if (state.view === 'setup') {
    headerTitle.textContent = 'Setup';
    renderSetup();
  } else if (state.view === 'week') {
    const w = PROGRAM[String(state.currentWeek)];
    headerTitle.textContent = w?.title?.replace(/^Week \d+\s*-\s*/, '') || `Week ${state.currentWeek}`;
    renderWeek();
  } else if (state.view === 'day') {
    const w = PROGRAM[String(state.currentWeek)];
    const day = w?.days[state.currentDayIdx];
    headerTitle.textContent = day?.name || 'Day';
    renderDay();
  }
}

function renderHome() {
  const hasMaxes = state.maxes.squat.e1rm || state.maxes.bench.e1rm || state.maxes.deadlift.e1rm;

  let html = '';
  if (hasMaxes) {
    html += `
      <div class="setup-summary">
        <div class="setup-stat">
          <div class="label">Squat</div>
          <div class="value">${state.maxes.squat.e1rm || '—'}</div>
        </div>
        <div class="setup-stat">
          <div class="label">Bench</div>
          <div class="value">${state.maxes.bench.e1rm || '—'}</div>
        </div>
        <div class="setup-stat">
          <div class="label">Deadlift</div>
          <div class="value">${state.maxes.deadlift.e1rm || '—'}</div>
        </div>
      </div>
    `;
  } else {
    html += `
      <div class="card">
        <p style="color:var(--text-muted);margin-bottom:12px;">Enter your recent heavy singles or low-rep sets to calculate training loads.</p>
        <button class="btn btn-primary btn-block" onclick="goSetup()">Set Up Maxes →</button>
      </div>
    `;
  }

  html += `<div class="card-title" style="margin-top:8px;">Program Weeks</div><div class="week-list">`;

  for (let i = 1; i <= 9; i++) {
    const w = PROGRAM[String(i)];
    const title = w?.title || `Week ${i}`;
    const short = title.replace(/^Week \d+\s*-\s*/, '');
    html += `
      <div class="week-item" onclick="goWeek(${i})">
        <div class="week-num">${i}</div>
        <div class="week-info">
          <h3>${short}</h3>
          <p>${w?.days?.length || 0} days</p>
        </div>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-dim)" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
      </div>
    `;
  }
  html += `</div>`;

  html += `
    <p class="note" style="margin-top:24px;text-align:center;">
      Program by The Strength Athlete (Bryce Lewis)<br>
      Rebuilt as web MVP · Synced to your account
    </p>
  `;

  mainEl.innerHTML = html;
}

function renderSetup() {
  const lifts = [
    { key: 'squat', label: 'Squat' },
    { key: 'bench', label: 'Bench Press' },
    { key: 'deadlift', label: 'Deadlift' }
  ];

  let html = `
    <div class="card">
      <p class="note" style="margin-bottom:16px;">
        Enter a recent heavy single or low-rep top set (1–3 reps ideal). Add RPE if known. The app estimates your 1RM and builds every load from it.
      </p>
  `;

  for (const lift of lifts) {
    const m = state.maxes[lift.key];
    html += `
      <div class="form-group">
        <label>${lift.label}</label>
        <div class="form-row">
          <div>
            <input type="text" inputmode="decimal" placeholder="Weight" 
              value="${m.weight || ''}" 
              onchange="updateMax('${lift.key}','weight',this.value)"
              oninput="updateMax('${lift.key}','weight',this.value)" />
          </div>
          <div>
            <input type="text" inputmode="numeric" placeholder="Reps" 
              value="${m.reps || ''}" 
              onchange="updateMax('${lift.key}','reps',this.value)"
              oninput="updateMax('${lift.key}','reps',this.value)" />
          </div>
          <div>
            <input type="text" inputmode="decimal" placeholder="RPE" step="0.5" min="6.5" max="10"
              value="${m.rpe || ''}" 
              onchange="updateMax('${lift.key}','rpe',this.value)"
              oninput="updateMax('${lift.key}','rpe',this.value)" />
          </div>
        </div>
        <div class="e1rm" id="e1rm-${lift.key}">${m.e1rm ? `e1RM ≈ ${m.e1rm}` : '—'}</div>
      </div>
    `;
  }

  html += `
      <div class="form-group">
        <label>Rounding / Units</label>
        <select onchange="updateRounding(this.value)">
          <option value="2.5" ${state.rounding === 2.5 ? 'selected' : ''}>2.5 (kg plates)</option>
          <option value="5" ${state.rounding === 5 ? 'selected' : ''}>5 (lb plates)</option>
        </select>
      </div>
    </div>
    <button class="btn btn-primary btn-block" onclick="goHome()">Done</button>
    <button class="btn btn-secondary btn-block mt-2" onclick="resetAllData()">Reset All Data</button>
  `;

  mainEl.innerHTML = html;
}

function renderWeek() {
  const w = PROGRAM[String(state.currentWeek)];
  if (!w) return;

  let html = `<div class="day-header"><h2>Week ${state.currentWeek}</h2><p>${w.title}</p></div><div class="week-list">`;

  w.days.forEach((day, idx) => {
    const exercises = getExercises(state.currentWeek, idx);
    html += `
      <div class="week-item" onclick="goDay(${idx})">
        <div class="week-num" style="font-size:0.85rem;">${idx + 1}</div>
        <div class="week-info">
          <h3>${day.name}</h3>
          <p>${exercises.length} exercises</p>
        </div>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-dim)" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
      </div>
    `;
  });
  html += `</div>`;
  mainEl.innerHTML = html;
}

function renderDay() {
  const week = state.currentWeek;
  const dayIdx = state.currentDayIdx;
  const w = PROGRAM[String(week)];
  const day = w?.days[dayIdx];
  if (!day) return;

  const exercises = getExercises(week, dayIdx);

  // Bottom nav for days
  bottomNav.classList.remove('hidden');
  bottomNav.innerHTML = w.days.map((d, i) => `
    <button class="nav-tab ${i === dayIdx ? 'active' : ''}" onclick="goDay(${i})">
      ${d.name.replace('Day ', 'D').replace(' - MEET OR MOCK MEET', ' Meet')}
    </button>
  `).join('');

  let html = `
    <div class="day-header">
      <h2>${day.name}</h2>
      <p>${w.title}</p>
    </div>
  `;

  exercises.forEach((ex, exIdx) => {
    const isMain = ex.lift && (ex.type === 'percentage' || (ex.type === 'rpe' && (ex.name.toLowerCase().includes('squat') || ex.name.toLowerCase().includes('bench') || ex.name.toLowerCase().includes('deadlift'))));
    const load = (ex.type === 'percentage' && ex.percent != null && ex.lift)
      ? calcLoad(ex.percent, ex.lift)
      : null;

    const logKey = getLogKey(week, dayIdx, exIdx);
    const log = state.logs[logKey] || {};

    html += `
      <div class="exercise ${isMain ? 'main-lift' : 'accessory'}">
        <div class="exercise-header">
          <div class="exercise-name">${ex.name}</div>
          ${state.readOnly ? '' : `
          <div class="exercise-actions">
            <button class="btn-icon" style="width:32px;height:32px;" onclick="openEditModal(${week},${dayIdx},${exIdx})" title="Edit">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
          </div>
          `}
        </div>
        <div class="exercise-meta">
          <div class="meta-item"><strong>${ex.sets || '—'}</strong> sets</div>
          <div class="meta-item"><strong>${ex.reps || '—'}</strong> reps</div>
          ${ex.intensity ? `<div class="meta-item">${ex.intensity}</div>` : ''}
          ${load != null ? `<div class="load-badge has-plate-toggle" onclick="togglePlateBreakdown('main-${logKey}')">${load}${renderPlateToggleButton(`main-${logKey}`)}</div>` : ''}
          ${ex.type === 'rpe' && ex.rpe ? `<div class="load-badge rpe-badge">@RPE ${ex.rpe}</div>` : ''}
        </div>
        ${load != null && state.plateBreakdownOpen[`main-${logKey}`] ? renderPlateInlineDetail(load) : ''}
        ${isMain && load != null ? renderWarmupBlock(week, dayIdx, exIdx, load) : ''}
        <div class="log-row">
          <div>
            <label>Weight Used</label>
            ${state.readOnly
              ? `<p class="log-readonly-value">${log.weightUsed || '—'}</p>`
              : `<input type="text" inputmode="decimal" placeholder="—"
              value="${log.weightUsed || ''}"
              onchange="saveLog(${week},${dayIdx},${exIdx},'weightUsed',this.value)" />`}
          </div>
          <div>
            <label>Reps Done</label>
            ${state.readOnly
              ? `<p class="log-readonly-value">${log.repsDone || '—'}</p>`
              : `<input type="text" inputmode="numeric" placeholder="—"
              value="${log.repsDone || ''}"
              onchange="saveLog(${week},${dayIdx},${exIdx},'repsDone',this.value)" />`}
          </div>
          <div>
            <label>RPE</label>
            ${state.readOnly
              ? `<p class="log-readonly-value">${log.rpe || '—'}</p>`
              : `<input type="text" inputmode="decimal" step="0.5" placeholder="—"
              value="${log.rpe || ''}"
              onchange="saveLog(${week},${dayIdx},${exIdx},'rpe',this.value)" />`}
          </div>
        </div>
      </div>
    `;
  });

  if (!state.readOnly) {
    html += `
      <button class="btn-add" onclick="openAddModal(${week},${dayIdx})">+ Add Exercise</button>
      <button class="btn btn-secondary btn-block mt-2" style="margin-top:16px;" onclick="resetDayCustom(${week},${dayIdx})">
        Reset Day to Default
      </button>
    `;
  }

  const dayWarmupPrefix = `${week}-${dayIdx}-`;
  const hasWarmupsThisDay = Object.keys(state.warmups).some((k) => k.startsWith(dayWarmupPrefix));
  if (hasWarmupsThisDay) {
    html += `
      <button class="btn btn-secondary btn-block mt-2" onclick="toggleAllWarmupsForDay(${week},${dayIdx})">Show/Hide All Warmups</button>
      <button class="btn btn-secondary btn-block mt-2" onclick="resetWarmupsForDay(${week},${dayIdx})">Reset Warmup Tables</button>
    `;
  }

  mainEl.innerHTML = html;
}

function renderPlateToggleButton(id) {
  const open = !!state.plateBreakdownOpen[id];
  return `<span class="plate-toggle-btn ${open ? 'open' : ''}" title="Plate breakdown">${BARBELL_ICON_SVG}</span>`;
}

function renderPlateInlineDetail(weight) {
  const breakdown = computePlateBreakdown(weight);
  return `
    <div class="plate-inline-detail">
      <span>${formatPlateBreakdown(breakdown)}</span>
      <a href="#" onclick="openPlateCalculatorFor(${weight});return false;">View barbell →</a>
    </div>
  `;
}

function togglePlateBreakdown(id) {
  state.plateBreakdownOpen[id] = !state.plateBreakdownOpen[id];
  render();
}

function openPlateCalculatorFor(weight) {
  state.plateCalcWeight = String(weight);
  navigateTo('plates');
}

function renderWarmupBlock(week, dayIdx, exIdx, defaultWeight) {
  const key = getLogKey(week, dayIdx, exIdx);
  const warmup = state.warmups[key];

  let html = `
    <div class="warmup-block">
      <div class="warmup-buttons">
        ${Object.keys(WARMUP_SCHEMES).map((s) => `
          <button class="btn-warmup ${warmup && warmup.scheme === s ? 'active' : ''}" onclick="generateWarmup(${week},${dayIdx},${exIdx},'${s}',${defaultWeight})">${WARMUP_SCHEMES[s].label}</button>
        `).join('')}
      </div>
  `;

  if (warmup) {
    html += `
      <div class="warmup-table-wrap">
        <div class="warmup-table-header" onclick="toggleWarmupExpanded(${week},${dayIdx},${exIdx})">
          <span>${WARMUP_SCHEMES[warmup.scheme].label} Warmup — target ${warmup.targetWeight}</span>
          <svg class="chevron ${warmup.expanded ? 'open' : ''}" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
        </div>
        <div class="warmup-recalibrate ${warmup.expanded ? '' : 'hidden'}">
          <label>Target Weight</label>
          <input type="text" inputmode="decimal" value="${warmup.targetWeight}"
            onchange="recalibrateWarmup(${week},${dayIdx},${exIdx},this.value)" />
        </div>
        <table class="warmup-table ${warmup.expanded ? '' : 'hidden'}">
          <thead><tr><th>Stage</th><th>Weight</th><th>Reps</th><th>Rest</th></tr></thead>
          <tbody>${renderWarmupTableRows(warmup.scheme, warmup.targetWeight, week, dayIdx, exIdx)}</tbody>
        </table>
      </div>
    `;
  }

  html += `</div>`;
  return html;
}

function renderWarmupTableRows(scheme, targetWeight, week, dayIdx, exIdx) {
  const rows = [`<tr><td>Empty Bar</td><td>—</td><td>8-10</td><td>N/A</td></tr>`];
  WARMUP_SCHEMES[scheme].steps.forEach((s, stepIdx) => {
    const weight = mround(targetWeight * s.percent, state.rounding);
    const id = `warmup-${week}-${dayIdx}-${exIdx}-${stepIdx}`;
    rows.push(`<tr><td>${s.percentLabel}%</td><td><span class="warmup-weight-cell" onclick="togglePlateBreakdown('${id}')">${weight} ${renderPlateToggleButton(id)}</span></td><td>${s.reps}</td><td>${s.rest}</td></tr>`);
    if (state.plateBreakdownOpen[id]) {
      rows.push(`<tr><td colspan="4">${renderPlateInlineDetail(weight)}</td></tr>`);
    }
  });
  return rows.join('');
}

function renderAuth() {
  const isSignup = state.authMode === 'signup';
  let html = `
    <div class="card">
      <p class="note" style="margin-bottom:16px;">${isSignup ? 'Create an account to sync your data across devices.' : 'Sign in to sync your training data across devices.'}</p>
      <div class="form-group">
        <label>Email</label>
        <input type="email" id="auth-email" inputmode="email" autocomplete="email" />
      </div>
      <div class="form-group">
        <label>Password</label>
        <input type="password" id="auth-password" autocomplete="${isSignup ? 'new-password' : 'current-password'}" />
      </div>
      ${state.authError ? `<p class="note" style="color:var(--danger);margin-bottom:12px;">${state.authError}</p>` : ''}
      <button class="btn btn-primary btn-block" onclick="submitAuth()">${isSignup ? 'Create Account' : 'Sign In'}</button>
      <button class="btn btn-secondary btn-block mt-2" onclick="handleGoogleSignIn()">Sign in with Google</button>
      <p class="note" style="text-align:center;margin-top:16px;">
        ${isSignup ? 'Already have an account?' : "Don't have an account?"}
        <a href="#" onclick="toggleAuthMode();return false;">${isSignup ? 'Sign In' : 'Create one'}</a>
      </p>
    </div>
  `;
  mainEl.innerHTML = html;
}

function renderProfiles() {
  let html = `<p class="note" style="margin-bottom:12px;">Signed in as ${state.user.email}</p>`;
  html += `<div class="week-list">`;
  state.profiles.forEach((p) => {
    const active = p.id === state.profileId;
    html += `
      <div class="week-item" onclick="switchProfile('${p.id}')" style="${active ? 'border-color:var(--accent);' : ''}">
        <div class="week-info">
          <h3>${p.name}${active ? ' (active)' : ''}</h3>
        </div>
        <button class="btn-icon" style="width:32px;height:32px;flex:none;" onclick="event.stopPropagation();openRenameProfileModal('${p.id}')" title="Rename">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        </button>
        <button class="btn-icon" style="width:32px;height:32px;flex:none;" onclick="event.stopPropagation();openShareModal('${p.id}')" title="Share (read-only)">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
        </button>
        <button class="btn-icon" style="width:32px;height:32px;flex:none;" onclick="event.stopPropagation();resetProfileHandler('${p.id}')" title="Reset to Default">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 0 2.64-6.36"/><path d="M3 4v5h5"/></svg>
        </button>
        <button class="btn-icon" style="width:32px;height:32px;flex:none;" onclick="event.stopPropagation();deleteProfileHandler('${p.id}')" title="Delete">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
        </button>
      </div>
    `;
  });
  html += `</div>`;
  html += `
    <button class="btn btn-primary btn-block mt-4" onclick="openNewProfileModal()">+ New Profile</button>
    <button class="btn btn-secondary btn-block mt-2" onclick="openDuplicateProfileModal()">Duplicate Current Profile</button>
    <button class="btn btn-secondary btn-block mt-2" onclick="signOutHandler()">Sign Out</button>
  `;
  mainEl.innerHTML = html;
}

function renderBarbellVisual(breakdown) {
  const visual = getPlateVisual();
  let html = `<div id="plate-barbell-visual" class="barbell-visual" onclick="openPlateSettingsModal()">`;
  html += `<div class="barbell-sleeve"></div>`;
  if (breakdown.collars) html += `<div class="barbell-collar"></div>`;
  breakdown.perSide.forEach((p) => {
    const v = visual[p.denom] || { color: 'var(--text-dim)', width: 10, height: 50 };
    const borderStyle = v.border ? `border:2px solid ${v.border};` : '';
    for (let i = 0; i < p.count; i++) {
      html += `<div class="barbell-plate-hit" onclick="event.stopPropagation();openPlateCountModal(${p.denom},false)" title="${p.denom} ${breakdown.unit}"><div class="barbell-plate" style="width:${v.width}px;height:${v.height}px;background:${v.color};${borderStyle}"></div></div>`;
    }
  });
  html += `<div class="barbell-bar"></div>`;
  html += `</div>`;
  return html;
}

function renderPlateSummary(breakdown) {
  if (!breakdown) {
    return `<p class="note">Enter a weight above to see the plate breakdown.</p>`;
  }
  const totalPerSide = breakdown.perSide.reduce((sum, p) => sum + p.denom * p.count, 0);
  const total = breakdown.barbell + breakdown.collarWeight + totalPerSide * 2;
  const visuals = getPlateVisual();

  let html = `<div class="plate-summary-row"><span>Barbell</span><span>${breakdown.barbell} ${breakdown.unit}</span></div>`;
  if (breakdown.collars) {
    html += `<div class="plate-summary-row"><span>Collars</span><span>${breakdown.collarWeight} ${breakdown.unit}</span></div>`;
  }
  if (breakdown.perSide.length === 0) {
    html += `<div class="plate-summary-row"><span>Plates per side</span><span>—</span></div>`;
  } else {
    breakdown.perSide.forEach((p) => {
      const v = visuals[p.denom] || {};
      const swatchStyle = `background:${v.color || '#888'};${v.border ? `border:2px solid ${v.border};` : ''}`;
      html += `<div class="plate-summary-row"><span class="plate-swatch-label"><span class="plate-swatch" style="${swatchStyle}"></span>${p.denom} ${breakdown.unit} × ${p.count} (per side)</span><span>${p.denom * p.count * 2} ${breakdown.unit}</span></div>`;
    });
  }
  html += `<div class="plate-summary-row plate-summary-total"><span>Total</span><span>${total}</span></div>`;

  if (breakdown.shortBy > 0.001) {
    html += `<p class="note" style="color:var(--danger);margin-top:8px;">Below the minimum loadable weight (empty bar${breakdown.collars ? ' + collars' : ''}) by ${breakdown.shortBy}</p>`;
  } else if (breakdown.leftoverPerSide > 0.001) {
    html += `<p class="note" style="color:var(--warning);margin-top:8px;">Not enough plates available — short ${(breakdown.leftoverPerSide * 2).toFixed(2).replace(/\.00$/, '')} ${breakdown.unit}</p>`;
  }
  return html;
}

function refreshPlateCalcDisplay() {
  const weight = parseFloat(state.plateCalcWeight);
  const breakdown = !isNaN(weight) ? computePlateBreakdown(weight) : null;
  document.getElementById('plate-barbell-visual').outerHTML = renderBarbellVisual(breakdown || { collars: state.plateSettings.collars, perSide: [], unit: getPlateUnit() });
  document.getElementById('plate-summary').innerHTML = renderPlateSummary(breakdown);
}

function updatePlateCalcWeight(value) {
  state.plateCalcWeight = value;
  refreshPlateCalcDisplay();
}

function renderPlateCalculator() {
  const weight = parseFloat(state.plateCalcWeight);
  const breakdown = !isNaN(weight) ? computePlateBreakdown(weight) : null;

  let html = `
    <p class="note" style="margin-bottom:12px;">Put these plates on each side (tap the bar to edit barbell/collars/plates)</p>
    ${renderBarbellVisual(breakdown || { collars: state.plateSettings.collars, perSide: [], unit: getPlateUnit() })}
    <div class="card-title" style="margin-top:16px;">Summary</div>
    <div class="card" id="plate-summary">${renderPlateSummary(breakdown)}</div>
    <div class="form-group" style="margin-top:16px;">
      <label>Weight (${getPlateUnit()})</label>
      <input type="text" inputmode="decimal" placeholder="0" value="${state.plateCalcWeight}"
        oninput="updatePlateCalcWeight(this.value)" />
    </div>
  `;
  mainEl.innerHTML = html;
}

// ========== NAVIGATION ==========
// state.viewHistory is a back-stack: every navigateTo() push the view being left,
// and goBack() pops it, so "back" always returns to wherever the user actually came
// from, however they got here (header icons, inline links, etc).
function navigateTo(view) {
  if (state.view !== view) {
    state.viewHistory.push(state.view);
  }
  state.view = view;
  render();
}

function goBack() {
  state.view = state.viewHistory.pop() || 'home';
  render();
}

function goHome() {
  state.viewHistory = [];
  state.view = 'home';
  render();
}

function goSetup() {
  navigateTo('setup');
}

function goWeek(week) {
  state.currentWeek = week;
  navigateTo('week');
}

function goDay(dayIdx) {
  state.currentDayIdx = dayIdx;
  navigateTo('day');
}

function goProfiles() {
  navigateTo('profiles');
}

function goPlates() {
  navigateTo('plates');
}

// ========== SETUP HANDLERS ==========
function updateMax(lift, field, value) {
  state.maxes[lift][field] = value;
  updateE1RMs();
  const el = document.getElementById(`e1rm-${lift}`);
  if (el) {
    el.textContent = state.maxes[lift].e1rm ? `e1RM ≈ ${state.maxes[lift].e1rm}` : '—';
  }
  saveState();
}

function updateRounding(val) {
  state.rounding = parseFloat(val);
  saveState();
}

function defaultProfileData() {
  return {
    maxes: {
      squat: { weight: '', reps: '', rpe: '', e1rm: null },
      bench: { weight: '', reps: '', rpe: '', e1rm: null },
      deadlift: { weight: '', reps: '', rpe: '', e1rm: null }
    },
    rounding: 2.5,
    customExercises: {},
    logs: {},
    plateSettings: defaultPlateSettings()
  };
}

function resetAllData() {
  if (confirm('Reset all maxes, logs, and custom exercises? This cannot be undone.')) {
    localStorage.removeItem(STORAGE_KEY);
    const defaults = defaultProfileData();
    state.maxes = defaults.maxes;
    state.rounding = defaults.rounding;
    state.customExercises = defaults.customExercises;
    state.logs = defaults.logs;
    state.plateSettings = defaults.plateSettings;
    if (state.user && state.profileId) {
      window.Firebase.saveProfileData(state.user.uid, state.profileId, defaults)
        .catch((e) => console.warn('Cloud reset failed', e));
    }
    showToast('All data reset');
    render();
  }
}

// ========== AUTH ==========
function toggleAuthMode() {
  state.authMode = state.authMode === 'login' ? 'signup' : 'login';
  state.authError = '';
  render();
}

function friendlyAuthError(e) {
  const code = (e && e.code) || '';
  if (code.includes('wrong-password') || code.includes('invalid-credential')) return 'Incorrect email or password.';
  if (code.includes('email-already-in-use')) return 'An account with that email already exists.';
  if (code.includes('weak-password')) return 'Password should be at least 6 characters.';
  if (code.includes('user-not-found')) return 'No account found with that email.';
  return 'Something went wrong. Please try again.';
}

async function submitAuth() {
  const email = document.getElementById('auth-email').value.trim();
  const password = document.getElementById('auth-password').value;
  if (!email || !password) {
    state.authError = 'Email and password are required.';
    render();
    return;
  }
  try {
    if (state.authMode === 'signup') {
      await window.Firebase.signUpEmail(email, password);
    } else {
      await window.Firebase.signInEmail(email, password);
    }
  } catch (e) {
    state.authError = friendlyAuthError(e);
    render();
  }
}

async function handleGoogleSignIn() {
  try {
    await window.Firebase.signInGoogle();
  } catch (e) {
    state.authError = friendlyAuthError(e);
    render();
  }
}

async function signOutHandler() {
  if (state.profileUnsubscribe) {
    state.profileUnsubscribe();
    state.profileUnsubscribe = null;
  }
  await window.Firebase.signOutUser();
}

// ========== PROFILES ==========
async function applyProfileData(profileId) {
  const data = await window.Firebase.loadProfileData(state.user.uid, profileId);
  if (data) {
    if (data.maxes) state.maxes = data.maxes;
    if (data.rounding) state.rounding = data.rounding;
    if (data.customExercises) state.customExercises = data.customExercises;
    if (data.logs) state.logs = data.logs;
    if (data.plateSettings) state.plateSettings = data.plateSettings;
  }
}

function subscribeToProfile(profileId) {
  if (state.profileUnsubscribe) state.profileUnsubscribe();
  state.profileUnsubscribe = window.Firebase.watchCurrentProfile(state.user.uid, profileId, (data) => {
    // A local write is still queued or in flight (saveEpoch ahead of confirmedEpoch) - this
    // snapshot can only be a stale echo of an older write, so applying it would clobber a
    // newer local change (e.g. an edit immediately followed by a reset). Skip it; once our
    // own pending write confirms, the next snapshot will correctly reflect it.
    if (confirmedEpoch < saveEpoch) return;
    const active = document.activeElement;
    const isEditingInput = active && mainEl.contains(active) && (active.tagName === 'INPUT' || active.tagName === 'SELECT');
    if (data.maxes) state.maxes = data.maxes;
    if (data.rounding) state.rounding = data.rounding;
    if (data.customExercises) state.customExercises = data.customExercises;
    if (data.logs) state.logs = data.logs;
    if (data.plateSettings) state.plateSettings = data.plateSettings;
    if (!isEditingInput) render();
  });
}

async function switchProfile(profileId) {
  if (profileId === state.profileId) {
    state.view = 'home';
    render();
    return;
  }
  const uid = state.user.uid;
  await window.Firebase.setCurrentProfileId(uid, profileId);
  state.profileId = profileId;
  await applyProfileData(profileId);
  subscribeToProfile(profileId);
  state.view = 'home';
  render();
  showToast('Switched profile');
}

function openNewProfileModal() {
  state.editing = { mode: 'new-profile' };
  document.getElementById('modal-title').textContent = 'New Profile';
  document.getElementById('modal-body').innerHTML = `
    <div class="form-group">
      <label>Name</label>
      <input type="text" id="profile-name" placeholder="e.g. Block B - higher reps" />
    </div>
  `;
  document.getElementById('modal-overlay').classList.remove('hidden');
}

function openRenameProfileModal(profileId) {
  const p = state.profiles.find((x) => x.id === profileId);
  if (!p) return;
  state.editing = { mode: 'rename-profile', profileId };
  document.getElementById('modal-title').textContent = 'Rename Profile';
  document.getElementById('modal-body').innerHTML = `
    <div class="form-group">
      <label>Name</label>
      <input type="text" id="profile-name" value="${p.name}" />
    </div>
  `;
  document.getElementById('modal-overlay').classList.remove('hidden');
}

function openDuplicateProfileModal() {
  const current = state.profiles.find((p) => p.id === state.profileId);
  state.editing = { mode: 'duplicate-profile' };
  document.getElementById('modal-title').textContent = 'Duplicate Profile';
  document.getElementById('modal-body').innerHTML = `
    <div class="form-group">
      <label>Name</label>
      <input type="text" id="profile-name" value="${current ? current.name + ' (copy)' : ''}" />
    </div>
  `;
  document.getElementById('modal-overlay').classList.remove('hidden');
}

async function openShareModal(profileId) {
  const p = state.profiles.find((x) => x.id === profileId);
  if (!p) return;
  const data = await window.Firebase.loadProfileData(state.user.uid, profileId);
  state.editing = { mode: 'share-profile', profileId, emails: (data && data.viewerEmails) || [] };
  document.getElementById('modal-title').textContent = `Share "${p.name}"`;
  document.getElementById('modal-save').classList.add('hidden');
  renderShareModalBody();
  document.getElementById('modal-overlay').classList.remove('hidden');
}

function renderShareModalBody() {
  const { emails } = state.editing;
  document.getElementById('modal-body').innerHTML = `
    <p class="note" style="margin-bottom:12px;">Anyone below can view this profile's maxes and logs read-only, once they sign in with a matching email. They can't edit anything.</p>
    <div class="form-group">
      <label>Coach emails</label>
      <div class="plate-list">
        ${emails.length === 0 ? '<p class="note">No one has view access yet.</p>' : emails.map((email, idx) => `
          <div class="plate-list-row">
            <span>${email}</span>
            <button class="btn-icon" style="width:28px;height:28px;flex:none;" onclick="removeViewerEmail(${idx})" title="Remove">&times;</button>
          </div>
        `).join('')}
      </div>
    </div>
    <div class="form-group">
      <label>Add a coach's email</label>
      <div class="form-row">
        <input type="email" id="share-email-input" placeholder="coach@example.com" />
        <button class="btn btn-secondary" onclick="addViewerEmail()">Add</button>
      </div>
    </div>
    <div class="form-group">
      <label>Share link</label>
      <button class="btn btn-secondary btn-block" onclick="copyShareLink()">Copy Link</button>
    </div>
  `;
}

async function addViewerEmail() {
  const input = document.getElementById('share-email-input');
  const email = input.value.trim().toLowerCase();
  if (!email || !email.includes('@')) {
    showToast('Enter a valid email');
    return;
  }
  if (state.editing.emails.includes(email)) {
    showToast('Already shared with that email');
    return;
  }
  state.editing.emails.push(email);
  await window.Firebase.setViewerEmails(state.user.uid, state.editing.profileId, state.editing.emails);
  renderShareModalBody();
  showToast('Shared with ' + email);
}

async function removeViewerEmail(idx) {
  state.editing.emails.splice(idx, 1);
  await window.Firebase.setViewerEmails(state.user.uid, state.editing.profileId, state.editing.emails);
  renderShareModalBody();
}

function copyShareLink() {
  const link = `${location.origin}${location.pathname}?shareUid=${state.user.uid}&shareProfile=${state.editing.profileId}`;
  navigator.clipboard.writeText(link).then(
    () => showToast('Link copied'),
    () => showToast(link)
  );
}

async function createProfileHandler(name) {
  const uid = state.user.uid;
  await window.Firebase.createProfile(uid, name, {});
  state.profiles = await window.Firebase.listProfiles(uid);
  showToast('Profile created');
  render();
}

async function duplicateProfileHandler(name) {
  const uid = state.user.uid;
  const seed = {
    maxes: state.maxes,
    rounding: state.rounding,
    customExercises: state.customExercises,
    logs: state.logs,
    plateSettings: state.plateSettings
  };
  await window.Firebase.createProfile(uid, name, seed);
  state.profiles = await window.Firebase.listProfiles(uid);
  showToast('Profile duplicated');
  render();
}

async function resetProfileHandler(profileId) {
  const p = state.profiles.find((x) => x.id === profileId);
  if (!p) return;
  if (!confirm(`Reset "${p.name}" to default? This clears its maxes, logs, and custom exercises. This cannot be undone.`)) return;

  const uid = state.user.uid;
  const defaults = defaultProfileData();
  await window.Firebase.saveProfileData(uid, profileId, defaults);

  if (profileId === state.profileId) {
    state.maxes = defaults.maxes;
    state.rounding = defaults.rounding;
    state.customExercises = defaults.customExercises;
    state.logs = defaults.logs;
    state.plateSettings = defaults.plateSettings;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
  }
  showToast('Profile reset to default');
  render();
}

async function renameProfileHandler(profileId, name) {
  const uid = state.user.uid;
  await window.Firebase.renameProfile(uid, profileId, name);
  state.profiles = await window.Firebase.listProfiles(uid);
  showToast('Profile renamed');
  render();
}

async function deleteProfileHandler(profileId) {
  if (state.profiles.length <= 1) {
    showToast("Can't delete your only profile");
    return;
  }
  if (!confirm('Delete this profile? This cannot be undone.')) return;
  const uid = state.user.uid;
  await window.Firebase.deleteProfile(uid, profileId);
  state.profiles = await window.Firebase.listProfiles(uid);
  if (state.profileId === profileId) {
    await switchProfile(state.profiles[0].id);
  } else {
    render();
  }
  showToast('Profile deleted');
}

// ========== LOGGING ==========
function saveLog(week, dayIdx, exIdx, field, value) {
  const key = getLogKey(week, dayIdx, exIdx);
  if (!state.logs[key]) state.logs[key] = {};
  state.logs[key][field] = value;
  saveState();
}

// ========== CUSTOM EXERCISES ==========
function openEditModal(week, dayIdx, exIdx) {
  const exercises = getExercises(week, dayIdx);
  const ex = exercises[exIdx];
  if (!ex) return;

  state.editing = { week, dayIdx, exIdx, mode: 'edit' };

  document.getElementById('modal-title').textContent = 'Edit Exercise';
  document.getElementById('modal-body').innerHTML = `
    <div class="form-group">
      <label>Name</label>
      <input type="text" id="edit-name" value="${ex.name || ''}" />
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>Sets</label>
        <input type="text" id="edit-sets" value="${ex.sets || ''}" />
      </div>
      <div class="form-group">
        <label>Reps</label>
        <input type="text" id="edit-reps" value="${ex.reps || ''}" />
      </div>
    </div>
    <div class="form-group">
      <label>Intensity (e.g. 75%, RPE 7, or leave blank)</label>
      <input type="text" id="edit-intensity" value="${ex.intensity || ''}" />
    </div>
    <div class="form-group">
      <label>Lift for load calc (optional)</label>
      <select id="edit-lift">
        <option value="" ${!ex.lift ? 'selected' : ''}>None (accessory)</option>
        <option value="squat" ${ex.lift === 'squat' ? 'selected' : ''}>Squat</option>
        <option value="bench" ${ex.lift === 'bench' ? 'selected' : ''}>Bench</option>
        <option value="deadlift" ${ex.lift === 'deadlift' ? 'selected' : ''}>Deadlift</option>
      </select>
    </div>
    <div class="form-group">
      <label>Type</label>
      <select id="edit-type">
        <option value="percentage" ${ex.type === 'percentage' ? 'selected' : ''}>Percentage of 1RM</option>
        <option value="rpe" ${ex.type === 'rpe' ? 'selected' : ''}>RPE (choose weight by feel)</option>
        <option value="other" ${ex.type === 'other' ? 'selected' : ''}>Other</option>
      </select>
    </div>
    <div class="form-group" id="edit-percent-group" style="${ex.type === 'percentage' ? '' : 'display:none'}">
      <label>Percent (0–1, e.g. 0.75 for 75%)</label>
      <input type="text" inputmode="decimal" id="edit-percent" value="${ex.percent != null ? ex.percent : ''}" />
    </div>
    <button class="btn btn-danger btn-block mt-4" onclick="deleteExercise()">Delete Exercise</button>
  `;

  // Toggle percent field
  document.getElementById('edit-type').addEventListener('change', (e) => {
    document.getElementById('edit-percent-group').style.display = e.target.value === 'percentage' ? '' : 'none';
  });

  document.getElementById('modal-overlay').classList.remove('hidden');
}

function openAddModal(week, dayIdx) {
  state.editing = { week, dayIdx, mode: 'add' };

  document.getElementById('modal-title').textContent = 'Add Exercise';
  document.getElementById('modal-body').innerHTML = `
    <div class="form-group">
      <label>Name</label>
      <input type="text" id="edit-name" placeholder="e.g. Face Pulls" />
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>Sets</label>
        <input type="text" id="edit-sets" placeholder="3" value="3" />
      </div>
      <div class="form-group">
        <label>Reps</label>
        <input type="text" id="edit-reps" placeholder="10-12" value="10-12" />
      </div>
    </div>
    <div class="form-group">
      <label>Intensity (e.g. RPE 7)</label>
      <input type="text" id="edit-intensity" placeholder="RPE 7" value="RPE 7" />
    </div>
    <div class="form-group">
      <label>Lift for load calc (optional)</label>
      <select id="edit-lift">
        <option value="" selected>None (accessory)</option>
        <option value="squat">Squat</option>
        <option value="bench">Bench</option>
        <option value="deadlift">Deadlift</option>
      </select>
    </div>
    <div class="form-group">
      <label>Type</label>
      <select id="edit-type">
        <option value="rpe" selected>RPE (choose weight by feel)</option>
        <option value="percentage">Percentage of 1RM</option>
        <option value="other">Other</option>
      </select>
    </div>
    <div class="form-group" id="edit-percent-group" style="display:none">
      <label>Percent (0–1)</label>
      <input type="text" inputmode="decimal" id="edit-percent" />
    </div>
  `;

  document.getElementById('edit-type').addEventListener('change', (e) => {
    document.getElementById('edit-percent-group').style.display = e.target.value === 'percentage' ? '' : 'none';
  });

  document.getElementById('modal-overlay').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('modal-overlay').classList.add('hidden');
  document.getElementById('modal-save').classList.remove('hidden');
  document.getElementById('modal-save').textContent = 'Save';
  state.editing = null;
}

function saveModal() {
  if (!state.editing) return;

  if (state.editing.mode === 'plate-count') {
    const denom = state.editing.denom;
    const returnToSettings = state.editing.returnToSettings;
    const unlimited = document.getElementById('plate-unlimited-input').checked;
    const countVal = Math.max(0, parseInt(document.getElementById('plate-count-input').value, 10) || 0);
    getActivePlates()[denom] = { count: countVal, unlimited };
    saveState();
    closeModal();
    if (returnToSettings) openPlateSettingsModal();
    if (state.view === 'plates') refreshPlateCalcDisplay();
    if (state.view !== 'plates' && !returnToSettings) render();
    return;
  }

  if (state.editing.mode === 'new-profile' || state.editing.mode === 'rename-profile' || state.editing.mode === 'duplicate-profile') {
    const profileName = document.getElementById('profile-name').value.trim();
    if (!profileName) {
      showToast('Name is required');
      return;
    }
    if (state.editing.mode === 'new-profile') {
      createProfileHandler(profileName);
    } else if (state.editing.mode === 'rename-profile') {
      renameProfileHandler(state.editing.profileId, profileName);
    } else {
      duplicateProfileHandler(profileName);
    }
    closeModal();
    return;
  }

  const { week, dayIdx, exIdx, mode } = state.editing;

  const name = document.getElementById('edit-name').value.trim();
  if (!name) {
    showToast('Name is required');
    return;
  }

  const sets = document.getElementById('edit-sets').value.trim();
  const reps = document.getElementById('edit-reps').value.trim();
  const intensity = document.getElementById('edit-intensity').value.trim();
  const lift = document.getElementById('edit-lift').value || null;
  const type = document.getElementById('edit-type').value;
  let percent = null;
  let rpe = null;

  if (type === 'percentage') {
    percent = parseFloat(document.getElementById('edit-percent').value);
    if (isNaN(percent)) percent = null;
  } else if (type === 'rpe' && intensity) {
    const match = intensity.toUpperCase().match(/RPE\s*([\d.]+)/);
    if (match) rpe = parseFloat(match[1]);
  }

  const newEx = { name, sets, reps, intensity, type, lift, percent, rpe };

  let exercises = getExercises(week, dayIdx);

  if (mode === 'edit') {
    exercises[exIdx] = newEx;
  } else {
    exercises.push(newEx);
  }

  setExercises(week, dayIdx, exercises);
  closeModal();
  render();
  showToast(mode === 'edit' ? 'Exercise updated' : 'Exercise added');
}

function deleteExercise() {
  if (!state.editing || state.editing.mode !== 'edit') return;
  if (!confirm('Delete this exercise?')) return;

  const { week, dayIdx, exIdx } = state.editing;
  let exercises = getExercises(week, dayIdx);
  exercises.splice(exIdx, 1);
  setExercises(week, dayIdx, exercises);

  // Clean up log
  const key = getLogKey(week, dayIdx, exIdx);
  delete state.logs[key];
  // Shift subsequent logs? For simplicity, leave orphaned keys (harmless)
  saveState();
  closeModal();
  render();
  showToast('Exercise deleted');
}

function resetDayCustom(week, dayIdx) {
  if (!confirm('Reset this day to the original program exercises? Custom changes and this day\'s logs for custom slots will be lost.')) return;
  const key = `${week}-${dayIdx}`;
  delete state.customExercises[key];
  // Optionally clear logs for this day
  Object.keys(state.logs).forEach(k => {
    if (k.startsWith(`${week}-${dayIdx}-`)) delete state.logs[k];
  });
  saveState();
  render();
  showToast('Day reset to default');
}

// ========== WARMUP CALCULATOR (session-only, not persisted) ==========
function generateWarmup(week, dayIdx, exIdx, scheme, defaultWeight) {
  const key = getLogKey(week, dayIdx, exIdx);
  state.warmups[key] = { scheme, targetWeight: defaultWeight, expanded: true };
  render();
}

function recalibrateWarmup(week, dayIdx, exIdx, value) {
  const key = getLogKey(week, dayIdx, exIdx);
  const w = state.warmups[key];
  if (!w) return;
  const parsed = parseFloat(value);
  if (!isNaN(parsed)) w.targetWeight = parsed;
  render();
}

function toggleWarmupExpanded(week, dayIdx, exIdx) {
  const w = state.warmups[getLogKey(week, dayIdx, exIdx)];
  if (!w) return;
  w.expanded = !w.expanded;
  render();
}

function toggleAllWarmupsForDay(week, dayIdx) {
  const keys = Object.keys(state.warmups).filter((k) => k.startsWith(`${week}-${dayIdx}-`));
  const anyExpanded = keys.some((k) => state.warmups[k].expanded);
  keys.forEach((k) => { state.warmups[k].expanded = !anyExpanded; });
  render();
}

function resetWarmupsForDay(week, dayIdx) {
  Object.keys(state.warmups).forEach((k) => {
    if (k.startsWith(`${week}-${dayIdx}-`)) delete state.warmups[k];
  });
  render();
}

// ========== PLATE CALCULATOR SETTINGS ==========
function openPlateSettingsModal() {
  state.editing = { mode: 'plate-settings' };
  const unit = getPlateUnit();
  const barbellOptions = unit === 'kg' ? BARBELL_OPTIONS_KG : BARBELL_OPTIONS_LB;
  const currentBarbell = getBarbellWeight();
  const denoms = getPlateDenoms();
  const plates = getActivePlates();
  const visuals = getPlateVisual();

  document.getElementById('modal-title').textContent = 'Barbell & Plates';
  document.getElementById('modal-body').innerHTML = `
    <div class="form-group">
      <label>Barbell (${unit})</label>
      <div class="choice-row">
        ${barbellOptions.map((b) => `<button class="choice-btn ${b === currentBarbell ? 'active' : ''}" onclick="setBarbellWeight(${b})">${b}</button>`).join('')}
      </div>
    </div>
    <div class="form-group">
      <label>Collars</label>
      <div class="choice-row">
        <button class="choice-btn ${!state.plateSettings.collars ? 'active' : ''}" onclick="setCollars(false)">Off</button>
        <button class="choice-btn ${state.plateSettings.collars ? 'active' : ''}" onclick="setCollars(true)">${state.rounding}</button>
      </div>
    </div>
    <div class="form-group">
      <label>Total available plates (${unit})</label>
      <div class="plate-list">
        ${denoms.map((d) => {
          const info = plates[d] || { count: 0, unlimited: true };
          const v = visuals[d] || {};
          const swatchStyle = `background:${v.color || '#888'};${v.border ? `border:2px solid ${v.border};` : ''}`;
          return `
            <button class="plate-list-row" onclick="openPlateCountModal(${d},true)">
              <span class="plate-swatch-label"><span class="plate-swatch" style="${swatchStyle}"></span>${d} ${unit}</span>
              <span>${info.unlimited ? '∞' : 'x' + info.count}</span>
            </button>
          `;
        }).join('')}
      </div>
    </div>
  `;
  document.getElementById('modal-save').classList.add('hidden');
  document.getElementById('modal-overlay').classList.remove('hidden');
}

function setBarbellWeight(val) {
  if (getPlateUnit() === 'kg') state.plateSettings.barbellKg = val;
  else state.plateSettings.barbellLb = val;
  saveState();
  openPlateSettingsModal();
  if (state.view === 'plates') refreshPlateCalcDisplay();
}

function setCollars(val) {
  state.plateSettings.collars = val;
  saveState();
  openPlateSettingsModal();
  if (state.view === 'plates') refreshPlateCalcDisplay();
}

function openPlateCountModal(denom, returnToSettings) {
  const plates = getActivePlates();
  const info = plates[denom] || { count: 0, unlimited: true };
  state.editing = { mode: 'plate-count', denom, returnToSettings };

  document.getElementById('modal-title').textContent = 'Total available plates';
  document.getElementById('modal-body').innerHTML = `
    <p style="text-align:center;font-size:1.3rem;font-weight:700;margin-bottom:16px;">${denom} ${getPlateUnit()}</p>
    <div class="form-group">
      <label>Total count you own (both sides)</label>
      <input type="text" inputmode="numeric" id="plate-count-input" value="${info.count}" ${info.unlimited ? 'disabled' : ''} />
    </div>
    <label class="unlimited-toggle">
      <input type="checkbox" id="plate-unlimited-input" ${info.unlimited ? 'checked' : ''}
        onchange="document.getElementById('plate-count-input').disabled = this.checked;" />
      <span>Unlimited</span>
    </label>
  `;
  document.getElementById('modal-save').textContent = 'Update';
  document.getElementById('modal-save').classList.remove('hidden');
  document.getElementById('modal-overlay').classList.remove('hidden');
  if (!info.unlimited) document.getElementById('plate-count-input').focus();
}

// ========== EVENT LISTENERS ==========
document.addEventListener('focusin', (e) => {
  if (e.target.tagName === 'INPUT' && (e.target.inputMode === 'decimal' || e.target.inputMode === 'numeric')) e.target.select();
});

document.getElementById('btn-back').addEventListener('click', goBack);

document.getElementById('btn-setup').addEventListener('click', goSetup);
document.getElementById('btn-profile').addEventListener('click', goProfiles);
document.getElementById('btn-plates').addEventListener('click', goPlates);
document.getElementById('btn-exit-shared').addEventListener('click', exitSharedView);

document.getElementById('modal-close').addEventListener('click', closeModal);
document.getElementById('modal-cancel').addEventListener('click', closeModal);
document.getElementById('modal-save').addEventListener('click', saveModal);

document.getElementById('modal-overlay').addEventListener('click', (e) => {
  if (e.target === document.getElementById('modal-overlay')) closeModal();
});

// ========== INIT ==========
function waitForFirebase() {
  if (window.__firebaseReady) return Promise.resolve();
  return new Promise((resolve) => {
    window.addEventListener('firebase-ready', () => resolve(), { once: true });
  });
}

async function loadUserProfileContext(uid) {
  await window.Firebase.ensureUserDoc(uid, state.user.email);
  let profileId = await window.Firebase.getCurrentProfileId(uid);

  if (!profileId) {
    profileId = await window.Firebase.importLegacyLocalStorageIfNeeded(uid);
  }
  if (!profileId) {
    const existing = await window.Firebase.listProfiles(uid);
    profileId = existing[0]?.id || null;
  }

  state.profileId = profileId;
  if (profileId) {
    await applyProfileData(profileId);
    subscribeToProfile(profileId);
  }
  state.profiles = await window.Firebase.listProfiles(uid);
  if (state.view === 'auth') {
    state.view = 'home';
    state.viewHistory = [];
  }
}

async function loadSharedProfileContext() {
  const { uid, profileId } = state.sharedView;
  try {
    const data = await window.Firebase.loadProfileData(uid, profileId);
    if (!data) throw new Error('Shared profile not found');
    applySharedProfileData(data);
    state.readOnly = true;
    if (state.profileUnsubscribe) state.profileUnsubscribe();
    state.profileUnsubscribe = window.Firebase.watchCurrentProfile(uid, profileId, applySharedProfileData);
    if (state.view === 'auth') {
      state.view = 'home';
      state.viewHistory = [];
    }
  } catch (e) {
    console.warn('Could not load shared profile', e);
    state.sharedView = null;
    state.readOnly = false;
    showToast("Couldn't open that shared profile - check the link or ask for a new one");
    await loadUserProfileContext(state.user.uid);
  }
}

function applySharedProfileData(data) {
  state.sharedView.profileName = data.name || 'Shared Profile';
  if (data.maxes) state.maxes = data.maxes;
  if (data.rounding) state.rounding = data.rounding;
  state.customExercises = data.customExercises || {};
  state.logs = data.logs || {};
  if (data.plateSettings) state.plateSettings = data.plateSettings;
  render();
}

function exitSharedView() {
  if (state.profileUnsubscribe) {
    state.profileUnsubscribe();
    state.profileUnsubscribe = null;
  }
  state.sharedView = null;
  state.readOnly = false;
  history.replaceState(null, '', location.pathname);
  loadUserProfileContext(state.user.uid).then(render);
}

async function init() {
  try {
    const res = await fetch('program_data.json');
    PROGRAM = await res.json();
  } catch (e) {
    console.error('Failed to load program data', e);
    mainEl.innerHTML = `<div class="empty-state"><p>Failed to load program data.</p></div>`;
    return;
  }

  const shareParams = new URLSearchParams(location.search);
  const shareUid = shareParams.get('shareUid');
  const shareProfile = shareParams.get('shareProfile');
  if (shareUid && shareProfile) {
    state.sharedView = { uid: shareUid, profileId: shareProfile, profileName: '' };
  }

  render();
  await waitForFirebase();
  window.Firebase.onAuthChange(async (user) => {
    state.user = user;
    state.authReady = true;
    state.authError = '';

    if (user && state.sharedView) {
      await loadSharedProfileContext();
    } else if (user) {
      await loadUserProfileContext(user.uid);
    } else {
      if (state.profileUnsubscribe) {
        state.profileUnsubscribe();
        state.profileUnsubscribe = null;
      }
      state.profileId = null;
      state.profiles = [];
      state.view = 'auth';
      state.viewHistory = [];
    }
    render();
  });
}

init();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch((e) => console.warn('Service worker registration failed', e));
  });
}
