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
      { percentLabel: '95', percent: 0.95, reps: '1', rest: '3 minutes' }
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
  view: 'home', // home | setup | week | day | auth | profiles | plates | table | progress
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

  // Tracked-lift registry for accessory-lift progress charting (persisted, synced like maxes/rounding)
  trackedLifts: {}, // id -> { label, color }
  // Persistent Progress-view category filter (persisted, synced like maxes/rounding)
  progressFilterMode: 'all', // 'all' | 'main' | 'accessory'

  // Warmup calculator (session-only; never saved or synced)
  warmups: {}, // "week-dayIdx-exIdx" -> { scheme, targetWeight, expanded }

  // Plate breakdown UI (session-only; never saved or synced)
  plateBreakdownOpen: {}, // id -> boolean
  plateCalcWeight: '', // manual weight entry on the standalone Plate Calculator screen
  tableViewWeek: null, // null = all 9 weeks, 1-9 = a single week, in the Program Table view
  openProfileMenuId: null, // id of the profile row whose "more actions" menu is open, if any
  progressHiddenLifts: {}, // key -> boolean, session-only per-lift chart visibility toggle in Progress view

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
    plateSettings: state.plateSettings,
    trackedLifts: state.trackedLifts,
    progressFilterMode: state.progressFilterMode
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

function rpeColorClass(rpe) {
  const v = parseFloat(rpe);
  if (isNaN(v)) return '';
  if (v < 6) return 'rpe-green';
  if (v < 8) return 'rpe-yellow';
  if (v < 9.5) return 'rpe-orange';
  return 'rpe-red';
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

// ========== PROGRESS ==========
const FIXED_LIFTS = ['squat', 'bench', 'deadlift'];

function isMainLiftExercise(ex) {
  return !!(ex.lift && (ex.type === 'percentage' || (ex.type === 'rpe' && (ex.name.toLowerCase().includes('squat') || ex.name.toLowerCase().includes('bench') || ex.name.toLowerCase().includes('deadlift')))));
}

// Returns 10 entries, index 0..9. Each entry is either null (nothing for that
// week) or { value, dayIdx, exIdx, log } where value is the best (max) e1RM
// implied by any matching logged set that week, and dayIdx/exIdx/log identify
// which exercise produced it (used by the click-to-detail popup).
// `key` is either a fixed lift key ('squat'|'bench'|'deadlift', matched via
// ex.lift + isMainLiftExercise) or a tracked-registry id (matched via ex.trackedId).
function computeLiftProgress(key) {
  const isTracked = !FIXED_LIFTS.includes(key);
  const points = new Array(10).fill(null);

  if (!isTracked) {
    const startValue = state.maxes[key]?.e1rm ?? null;
    points[0] = startValue != null ? { value: startValue, dayIdx: null, exIdx: null, log: null } : null;
  }

  for (let week = 1; week <= 9; week++) {
    const days = PROGRAM[String(week)]?.days || [];
    let best = null;
    days.forEach((day, dayIdx) => {
      getExercises(week, dayIdx).forEach((ex, exIdx) => {
        const matches = isTracked ? ex.trackedId === key : (isMainLiftExercise(ex) && ex.lift === key);
        if (!matches) return;
        const log = state.logs[getLogKey(week, dayIdx, exIdx)];
        if (!log) return;
        const e1rm = estimate1RM(log.weightUsed, log.repsDone, log.rpe);
        if (e1rm != null && (best == null || e1rm > best.value)) {
          best = { value: e1rm, dayIdx, exIdx, log };
        }
      });
    });
    points[week] = best;
  }
  return points;
}

function buildChartSegments(points) {
  const segments = [];
  let current = [];
  points.forEach((p, week) => {
    if (p == null) {
      if (current.length) segments.push(current);
      current = [];
    } else {
      current.push({ week, value: p.value });
    }
  });
  if (current.length) segments.push(current);
  return segments;
}

function chooseAxisStep(range) {
  const candidates = [5, 10, 25, 50, 100, 250, 500];
  const targetTicks = 5;
  for (const step of candidates) {
    if (range / step <= targetTicks) return step;
  }
  return candidates[candidates.length - 1];
}

function niceAxisScale(values) {
  const nums = values.filter((v) => v != null);
  if (nums.length === 0) return null;
  let min = Math.min(...nums);
  let max = Math.max(...nums);
  if (min === max) { min -= 10; max += 10; }
  const step = chooseAxisStep(max - min);
  min = Math.max(0, Math.floor((min - step * 0.5) / step) * step);
  max = Math.ceil((max + step * 0.5) / step) * step;
  const ticks = [];
  for (let v = min; v <= max + 1e-9; v += step) ticks.push(Math.round(v));
  return { min, max, ticks };
}

const LIFT_CHART_COLOR = { squat: 'var(--accent)', bench: 'var(--chart-indigo)', deadlift: 'var(--chart-magenta)' };
const LIFT_LABEL = { squat: 'Squat', bench: 'Bench', deadlift: 'Deadlift' };
const ACCESSORY_CHART_PALETTE = [
  'var(--chart-teal)',
  'var(--chart-blue)',
  'var(--chart-purple)',
  'var(--chart-lime)',
  'var(--chart-stone)',
  'var(--chart-fuchsia)'
];

function slugify(label) {
  return label.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'lift';
}

// Creates a new tracked-lift registry entry and returns its id. The id is an
// internal disambiguator only (slug + random 3-digit suffix) — never shown to the user.
function createTrackedLift(label) {
  const base = slugify(label);
  let id;
  do {
    id = `${base}-${Math.floor(100 + Math.random() * 900)}`;
  } while (state.trackedLifts[id]);

  const color = ACCESSORY_CHART_PALETTE[Object.keys(state.trackedLifts).length % ACCESSORY_CHART_PALETTE.length];
  state.trackedLifts[id] = { label, color };
  return id;
}

function getProgressCandidates() {
  const mode = state.progressFilterMode || 'all';
  const hidden = state.progressHiddenLifts || {};

  const main = FIXED_LIFTS.map((key) => ({
    key, label: LIFT_LABEL[key], color: LIFT_CHART_COLOR[key], category: 'main'
  }));

  const accessory = Object.keys(state.trackedLifts || {}).map((id) => {
    const t = state.trackedLifts[id];
    return { key: id, label: t.label, color: t.color, category: 'accessory' };
  });

  let candidates;
  if (mode === 'main') candidates = main;
  else if (mode === 'accessory') candidates = accessory;
  else candidates = main.concat(accessory);

  return candidates.map((c) => ({ ...c, hidden: !!hidden[c.key] }));
}

function setProgressFilterMode(mode) {
  state.progressFilterMode = mode;
  saveState();
  render();
}

function toggleProgressLiftActive(key) {
  state.progressHiddenLifts[key] = !state.progressHiddenLifts[key];
  render();
}

function goToWeekDay(week, dayIdx) {
  state.currentWeek = week;
  state.currentDayIdx = dayIdx;
  navigateTo('day');
}

function showProgressPointDetail(key, week) {
  const candidate = getProgressCandidates().find((c) => c.key === key)
    || (FIXED_LIFTS.includes(key) ? { key, label: LIFT_LABEL[key] } : null);
  if (!candidate) return;

  const point = computeLiftProgress(key)[week];

  state.editing = { mode: 'progress-point' };
  document.getElementById('modal-title').textContent = `${candidate.label} — ${week === 0 ? 'Start' : 'Week ' + week}`;
  document.getElementById('modal-save').classList.add('hidden');

  let body;
  if (week === 0) {
    body = `
      <p>This is your Setup baseline${point ? ` — estimated 1RM ${point.value}.` : '.'}</p>
      <button class="btn btn-secondary btn-block mt-4" onclick="closeModal();goSetup();">Go to Setup</button>
    `;
  } else if (!point) {
    body = `<p>Nothing logged for ${candidate.label} in Week ${week}.</p>`;
  } else {
    const day = PROGRAM[String(week)]?.days[point.dayIdx];
    const dayName = day ? day.name : `Day ${point.dayIdx + 1}`;
    const log = point.log || {};
    body = `
      <div class="form-group"><label>Day</label><p class="log-readonly-value">${dayName} (Week ${week})</p></div>
      <div class="form-group"><label>Logged</label><p class="log-readonly-value">${log.weightUsed || '—'} × ${log.repsDone || '—'}${log.rpe ? ` @RPE ${log.rpe}` : ''}</p></div>
      <div class="form-group"><label>Estimated 1RM</label><p class="log-readonly-value">${point.value}</p></div>
      <button class="btn btn-primary btn-block mt-4" onclick="closeModal();goToWeekDay(${week}, ${point.dayIdx});">Go to Day</button>
    `;
  }

  document.getElementById('modal-body').innerHTML = body;
  document.getElementById('modal-overlay').classList.remove('hidden');
}

function renderProgressChart(candidates, seriesByKey) {
  const W = 340, H = 200;
  const marginLeft = 34, marginRight = 8, marginTop = 8, marginBottom = 20;
  const chartW = W - marginLeft - marginRight;
  const chartH = H - marginTop - marginBottom;

  const withData = candidates.filter((c) => seriesByKey[c.key].some((p) => p != null));
  if (withData.length === 0) {
    return `<div class="empty-state"><p>No data yet.</p></div>`;
  }

  const plotted = withData.filter((c) => !c.hidden);
  const scale = plotted.length
    ? niceAxisScale(plotted.flatMap((c) => seriesByKey[c.key].map((p) => (p ? p.value : null))))
    : null;

  const xFor = (week) => marginLeft + (week / 9) * chartW;
  const yFor = (v) => marginTop + chartH - ((v - scale.min) / (scale.max - scale.min)) * chartH;

  let xLabels = '';
  for (let week = 0; week <= 9; week++) {
    xLabels += `<text x="${xFor(week)}" y="${H - marginBottom + 14}" class="chart-axis-label" text-anchor="middle">${week === 0 ? 'Start' : week}</text>`;
  }

  let gridlines = '';
  let linesSvg = '';
  if (scale) {
    scale.ticks.forEach((tick) => {
      const y = yFor(tick);
      gridlines += `
        <line x1="${marginLeft}" y1="${y}" x2="${W - marginRight}" y2="${y}" class="chart-gridline" />
        <text x="${marginLeft - 6}" y="${y}" class="chart-axis-label" text-anchor="end" dominant-baseline="middle">${tick}</text>
      `;
    });

    plotted.forEach((c) => {
      const points = seriesByKey[c.key];
      buildChartSegments(points).forEach((seg) => {
        if (seg.length >= 2) {
          const pts = seg.map((p) => `${xFor(p.week)},${yFor(p.value)}`).join(' ');
          linesSvg += `<polyline points="${pts}" fill="none" stroke="${c.color}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round" />`;
        }
      });
      points.forEach((point, week) => {
        if (point == null) return;
        linesSvg += `<circle cx="${xFor(week)}" cy="${yFor(point.value)}" r="3.5" fill="${c.color}" stroke="var(--bg-card)" stroke-width="1.5" style="cursor:pointer" onclick="showProgressPointDetail('${c.key}', ${week})" />`;
      });
    });
  }

  const legend = withData.map((c) => {
    const latest = [...seriesByKey[c.key]].reverse().find((p) => p != null);
    return `
      <div class="chart-legend-item ${c.hidden ? 'inactive' : ''}" style="cursor:pointer" onclick="toggleProgressLiftActive('${c.key}')">
        <span class="chart-legend-swatch" style="background:${c.color}"></span>
        <span>${c.label}</span>
        <span class="chart-legend-value">${latest ? latest.value : '—'}</span>
      </div>
    `;
  }).join('');

  const omitted = candidates.filter((c) => !withData.includes(c));
  const omittedNote = omitted.length
    ? `<p class="note">${omitted.map((c) => c.label).join(' & ')} — no data yet.</p>` : '';

  return `
    <svg viewBox="0 0 ${W} ${H}" class="progress-chart-svg" preserveAspectRatio="xMidYMid meet">
      ${gridlines}${xLabels}${linesSvg}
    </svg>
    <div class="chart-legend">${legend}</div>
    ${omittedNote}
  `;
}

function renderProgress() {
  const candidates = getProgressCandidates();
  const seriesByKey = {};
  candidates.forEach((c) => { seriesByKey[c.key] = computeLiftProgress(c.key); });

  const hasAnyData = candidates.some((c) => seriesByKey[c.key].some((p) => p != null));

  const filterPills = `
    <div class="choice-row mb-2">
      <button class="choice-btn ${state.progressFilterMode === 'all' ? 'active' : ''}" onclick="setProgressFilterMode('all')">All</button>
      <button class="choice-btn ${state.progressFilterMode === 'main' ? 'active' : ''}" onclick="setProgressFilterMode('main')">Main Lifts</button>
      <button class="choice-btn ${state.progressFilterMode === 'accessory' ? 'active' : ''}" onclick="setProgressFilterMode('accessory')">Accessory</button>
    </div>
  `;

  if (!hasAnyData) {
    mainEl.innerHTML = `
      ${filterPills}
      <div class="empty-state"><p>No data yet. Enter your maxes in Setup or log a few sets to see your estimated 1RM progress here.</p></div>
    `;
    return;
  }

  mainEl.innerHTML = `
    ${filterPills}
    <div class="card">${renderProgressChart(candidates, seriesByKey)}</div>
    <p class="note">Each point is your best estimated 1RM logged that week from working sets for that lift. "Start" is your Setup baseline (main lifts only). Weeks with nothing logged are skipped, not interpolated. Tap a point for details, or a legend entry to hide/show it.</p>
  `;
}

function goProgress() {
  navigateTo('progress');
}

// ========== RENDER ==========
const appEl = document.getElementById('app');
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
  appEl.classList.toggle('wide-view', state.view === 'table' || state.view === 'progress');
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
  } else if (state.view === 'table') {
    headerTitle.textContent = 'Program Table';
    renderTableView();
  } else if (state.view === 'progress') {
    headerTitle.textContent = 'Progress';
    renderProgress();
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

  html += `
    <div class="card-title-row" style="margin-top:8px;">
      <div class="card-title">Program Weeks</div>
      <div class="flex gap-2 items-center">
        <button class="link-btn" onclick="goProgress()">Progress</button>
        <button class="link-btn" onclick="goTable(null)">View as Table</button>
      </div>
    </div>
    <div class="week-list">`;

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

  let html = `
    <div class="day-header">
      <h2>Week ${state.currentWeek}</h2>
      <p>${w.title}</p>
    </div>
    <button class="link-btn" style="margin-bottom:12px;" onclick="goTable(${state.currentWeek})">View as Table</button>
    <div class="week-list">
  `;

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

function renderTableViewDayTable(week, dayIdx, day) {
  let rows = '';
  getExercises(week, dayIdx).forEach((ex, exIdx) => {
    const isMain = ex.lift && (ex.type === 'percentage' || (ex.type === 'rpe' && (ex.name.toLowerCase().includes('squat') || ex.name.toLowerCase().includes('bench') || ex.name.toLowerCase().includes('deadlift'))));
    const load = (ex.type === 'percentage' && ex.percent != null && ex.lift) ? calcLoad(ex.percent, ex.lift) : null;
    const log = state.logs[getLogKey(week, dayIdx, exIdx)] || {};
    rows += `
      <tr class="${isMain ? 'main-lift-row' : ''}">
        <td class="col-exercise">${ex.name}</td>
        <td>${ex.sets || '—'}</td>
        <td>${ex.reps || '—'}</td>
        <td>${ex.intensity || '—'}</td>
        <td>${load != null ? load : '—'}</td>
        <td class="col-logged">${log.weightUsed || '—'}</td>
        <td class="col-logged">${log.repsDone || '—'}</td>
        <td class="col-logged">${log.rpe ? `<span class="badge ${rpeColorClass(log.rpe)}">${log.rpe}</span>` : '—'}</td>
      </tr>
    `;
  });

  return `
    <div class="program-day-block">
      <div class="program-day-banner">${day.name}</div>
      <div class="program-table-wrap">
        <table class="program-table">
          <thead>
            <tr>
              <th class="col-exercise">Exercise</th>
              <th>Sets</th>
              <th>Reps</th>
              <th>Intensity</th>
              <th>Load</th>
              <th class="col-logged">Weight Used</th>
              <th class="col-logged">Reps Done</th>
              <th class="col-logged">RPE</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>
  `;
}

function renderTableView() {
  const selectedWeek = state.tableViewWeek;
  const weeks = selectedWeek ? [selectedWeek] : [1, 2, 3, 4, 5, 6, 7, 8, 9];

  let html = `
    <div class="choice-row" style="margin-bottom:16px;">
      <button class="choice-btn ${selectedWeek == null ? 'active' : ''}" onclick="goTable(null)">All</button>
      ${[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => `<button class="choice-btn ${selectedWeek === n ? 'active' : ''}" onclick="goTable(${n})">${n}</button>`).join('')}
    </div>
  `;

  weeks.forEach((week) => {
    const w = PROGRAM[String(week)];
    if (!w) return;
    html += `<div class="program-week-block">`;
    html += `<div class="program-week-banner">${w.title}</div>`;
    w.days.forEach((day, dayIdx) => {
      html += renderTableViewDayTable(week, dayIdx, day);
    });
    html += `</div>`;
  });

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
            <button class="btn-icon" style="width:32px;height:32px;" onclick="clearExerciseLog(${week},${dayIdx},${exIdx})" title="Clear logged weight/reps/RPE">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
            </button>
          </div>
          `}
        </div>
        <div class="exercise-meta">
          <div class="meta-item"><strong>${ex.sets || '—'}</strong> sets</div>
          <div class="meta-item"><strong>${ex.reps || '—'}</strong> reps</div>
          ${ex.intensity ? `<div class="meta-item">${ex.intensity}</div>` : ''}
          ${load != null ? `<div class="load-badge has-plate-toggle" onclick="togglePlateBreakdown('main-${logKey}')">${load}${renderPlateToggleButton(`main-${logKey}`)}</div>` : ''}
          ${ex.type === 'rpe' && ex.rpe ? `<div class="load-badge rpe-badge ${rpeColorClass(ex.rpe)}">@RPE ${ex.rpe}</div>` : ''}
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
              ? `<p class="log-readonly-value ${rpeColorClass(log.rpe)}">${log.rpe || '—'}</p>`
              : `<input type="text" inputmode="decimal" step="0.5" placeholder="—"
              class="${rpeColorClass(log.rpe)}"
              value="${log.rpe || ''}"
              oninput="this.className = rpeColorClass(this.value)"
              onchange="saveLog(${week},${dayIdx},${exIdx},'rpe',this.value)" />`}
          </div>
        </div>
      </div>
    `;
  });

  if (!state.readOnly) {
    html += `
      <button class="btn-add" onclick="openAddModal(${week},${dayIdx})">+ Add Exercise</button>
      <button class="btn btn-secondary btn-block mt-2" style="margin-top:16px;" onclick="clearDayLogs(${week},${dayIdx})">
        Clear All Logs for This Day
      </button>
      <button class="btn btn-secondary btn-block mt-2" onclick="resetDayCustom(${week},${dayIdx})">
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
      <div class="week-item${active ? ' week-item-active' : ''}" onclick="switchProfile('${p.id}')">
        <div class="week-info week-info-flex">
          <h3>${p.name}</h3>
          ${active ? '<span class="badge badge-accent">Active</span>' : ''}
        </div>
        <button class="btn-icon" style="width:32px;height:32px;flex:none;" onclick="event.stopPropagation();openRenameProfileModal('${p.id}')" title="Rename">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        </button>
        <button class="btn-icon" style="width:32px;height:32px;flex:none;" onclick="event.stopPropagation();openShareModal('${p.id}')" title="Share (read-only)">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
        </button>
        <div class="profile-menu-wrap">
          <button class="btn-icon" style="width:32px;height:32px;flex:none;" onclick="event.stopPropagation();toggleProfileMenu('${p.id}')" title="More actions">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>
          </button>
          ${state.openProfileMenuId === p.id ? `
            <div class="profile-menu">
              <button onclick="event.stopPropagation();closeProfileMenu();exportProfileHandler('${p.id}')">Export</button>
              <button onclick="event.stopPropagation();closeProfileMenu();resetProfileHandler('${p.id}')">Reset to Default</button>
              <button class="profile-menu-danger" onclick="event.stopPropagation();closeProfileMenu();deleteProfileHandler('${p.id}')">Delete</button>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  });
  html += `</div>`;
  html += `
    <button class="btn btn-primary btn-block mt-4" onclick="openNewProfileModal()">+ New Profile</button>
    <button class="btn btn-secondary btn-block mt-2" onclick="openDuplicateProfileModal()">Duplicate Current Profile</button>
    <button class="btn btn-secondary btn-block mt-2" onclick="importProfileHandler()">Import Profile from File</button>
    <button class="btn btn-secondary btn-block mt-2" onclick="signOutHandler()">Sign Out</button>
  `;
  mainEl.innerHTML = html;
}

function toggleProfileMenu(profileId) {
  state.openProfileMenuId = state.openProfileMenuId === profileId ? null : profileId;
  render();
}

function closeProfileMenu() {
  state.openProfileMenuId = null;
  render();
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

function goTable(week) {
  state.tableViewWeek = week ?? null;
  navigateTo('table');
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
    plateSettings: defaultPlateSettings(),
    trackedLifts: {},
    progressFilterMode: 'all'
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
    state.trackedLifts = defaults.trackedLifts;
    state.progressFilterMode = defaults.progressFilterMode;
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
    state.trackedLifts = data.trackedLifts || {};
    state.progressFilterMode = data.progressFilterMode || 'all';
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
    state.trackedLifts = data.trackedLifts || {};
    state.progressFilterMode = data.progressFilterMode || 'all';
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
      <button class="btn btn-secondary btn-block" onclick="copyShareLink()" ${emails.length === 0 ? 'disabled' : ''}>Copy Link</button>
      ${emails.length === 0 ? '<p class="note" style="margin-top:6px;">Add a coach\'s email above first — the link only works for people listed here.</p>' : ''}
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

async function exportProfileHandler(profileId) {
  const p = state.profiles.find((x) => x.id === profileId);
  if (!p) return;

  let data;
  if (profileId === state.profileId) {
    data = {
      maxes: state.maxes,
      rounding: state.rounding,
      customExercises: state.customExercises,
      logs: state.logs,
      plateSettings: state.plateSettings,
      trackedLifts: state.trackedLifts,
      progressFilterMode: state.progressFilterMode
    };
  } else {
    const remote = await window.Firebase.loadProfileData(state.user.uid, profileId);
    if (!remote) {
      showToast('Could not load that profile');
      return;
    }
    data = {
      maxes: remote.maxes,
      rounding: remote.rounding,
      customExercises: remote.customExercises,
      logs: remote.logs,
      plateSettings: remote.plateSettings,
      trackedLifts: remote.trackedLifts,
      progressFilterMode: remote.progressFilterMode
    };
  }

  const exportObj = {
    schemaVersion: 1,
    exportedAt: new Date().toISOString(),
    name: p.name,
    ...data
  };

  const json = JSON.stringify(exportObj, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const safeName = p.name.replace(/[^a-z0-9]+/gi, '-').replace(/^-+|-+$/g, '').toLowerCase() || 'profile';
  const filename = `tsa-${safeName}-${new Date().toISOString().slice(0, 10)}.json`;

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  showToast('Profile exported');
}

function importProfileHandler() {
  const input = document.getElementById('import-profile-input');
  input.value = '';
  input.click();
}

function handleImportFileSelected(e) {
  const file = e.target.files && e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    let parsed;
    try {
      parsed = JSON.parse(reader.result);
    } catch (err) {
      alert('That file is not valid JSON. Please choose a TSA profile export file.');
      return;
    }
    importParsedProfile(parsed);
  };
  reader.onerror = () => {
    alert('Could not read that file. Please try again.');
  };
  reader.readAsText(file);
}

async function importParsedProfile(parsed) {
  const looksValid = parsed && typeof parsed === 'object' && !Array.isArray(parsed) &&
    ('maxes' in parsed) && ('logs' in parsed) && ('plateSettings' in parsed);
  if (!looksValid) {
    alert('That file does not look like a TSA profile export.');
    return;
  }

  const defaults = defaultProfileData();
  const seed = {
    maxes: parsed.maxes || defaults.maxes,
    rounding: typeof parsed.rounding === 'number' ? parsed.rounding : defaults.rounding,
    customExercises: parsed.customExercises || {},
    logs: parsed.logs || {},
    plateSettings: parsed.plateSettings || defaults.plateSettings,
    trackedLifts: parsed.trackedLifts || {},
    progressFilterMode: ['all', 'main', 'accessory'].includes(parsed.progressFilterMode)
      ? parsed.progressFilterMode
      : defaults.progressFilterMode
  };

  let name = (typeof parsed.name === 'string' && parsed.name.trim())
    ? parsed.name.trim() + ' (Imported)'
    : 'Imported Profile';
  const existingNames = new Set(state.profiles.map((p) => p.name));
  if (existingNames.has(name)) {
    let n = 2;
    while (existingNames.has(`${name} (${n})`)) n++;
    name = `${name} (${n})`;
  }

  try {
    const uid = state.user.uid;
    await window.Firebase.createProfile(uid, name, seed);
    state.profiles = await window.Firebase.listProfiles(uid);
    showToast(`Imported as "${name}"`);
    render();
  } catch (err) {
    console.error('Import failed', err);
    alert('Import failed. Please try again.');
  }
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
    state.trackedLifts = defaults.trackedLifts;
    state.progressFilterMode = defaults.progressFilterMode;
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

function clearExerciseLog(week, dayIdx, exIdx) {
  if (!confirm('Clear the logged weight, reps, and RPE for this exercise?')) return;
  delete state.logs[getLogKey(week, dayIdx, exIdx)];
  saveState();
  render();
}

function clearDayLogs(week, dayIdx) {
  if (!confirm('Clear all logged sets for this entire day? This cannot be undone.')) return;
  const prefix = `${week}-${dayIdx}-`;
  Object.keys(state.logs).forEach((key) => {
    if (key.startsWith(prefix)) delete state.logs[key];
  });
  saveState();
  render();
}

// ========== CUSTOM EXERCISES ==========
function trackedLiftFormGroupHtml(selectedId) {
  const entries = Object.entries(state.trackedLifts || {}).sort((a, b) => a[1].label.localeCompare(b[1].label));
  const options = entries.map(([id, t]) =>
    `<option value="${id}" ${selectedId === id ? 'selected' : ''}>${t.label}</option>`
  ).join('');
  return `
    <div class="form-group" id="edit-tracked-group">
      <label>Track as accessory lift (optional)</label>
      <select id="edit-tracked">
        <option value="" ${!selectedId ? 'selected' : ''}>Not tracked</option>
        ${options}
        <option value="__new__">+ New tracked lift...</option>
      </select>
    </div>
    <div class="form-group" id="edit-tracked-new-group" style="display:none">
      <label>New tracked lift name</label>
      <input type="text" id="edit-tracked-new-name" placeholder="e.g. Front Squat" />
    </div>
  `;
}

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
    ${trackedLiftFormGroupHtml(ex.trackedId || null)}
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
  document.getElementById('edit-tracked').addEventListener('change', (e) => {
    document.getElementById('edit-tracked-new-group').style.display = e.target.value === '__new__' ? '' : 'none';
  });
  document.getElementById('edit-lift').addEventListener('change', (e) => {
    document.getElementById('edit-tracked-group').style.display = e.target.value ? 'none' : '';
    if (e.target.value) document.getElementById('edit-tracked-new-group').style.display = 'none';
  });
  if (ex.lift) document.getElementById('edit-tracked-group').style.display = 'none';

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
    ${trackedLiftFormGroupHtml(null)}
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
  document.getElementById('edit-tracked').addEventListener('change', (e) => {
    document.getElementById('edit-tracked-new-group').style.display = e.target.value === '__new__' ? '' : 'none';
  });
  document.getElementById('edit-lift').addEventListener('change', (e) => {
    document.getElementById('edit-tracked-group').style.display = e.target.value ? 'none' : '';
    if (e.target.value) document.getElementById('edit-tracked-new-group').style.display = 'none';
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

  const trackedSel = document.getElementById('edit-tracked').value;
  let trackedId = null;
  if (trackedSel === '__new__') {
    const newLabel = document.getElementById('edit-tracked-new-name').value.trim();
    if (!newLabel) {
      showToast('Enter a name for the new tracked lift');
      return;
    }
    trackedId = createTrackedLift(newLabel);
  } else if (trackedSel) {
    trackedId = trackedSel;
  }

  const newEx = { name, sets, reps, intensity, type, lift, percent, rpe, trackedId };

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

document.addEventListener('click', (e) => {
  if (state.openProfileMenuId && !e.target.closest('.profile-menu-wrap')) {
    state.openProfileMenuId = null;
    render();
  }
});

document.getElementById('btn-back').addEventListener('click', goBack);

document.getElementById('btn-setup').addEventListener('click', goSetup);
document.getElementById('btn-profile').addEventListener('click', goProfiles);
document.getElementById('btn-plates').addEventListener('click', goPlates);
document.getElementById('btn-exit-shared').addEventListener('click', exitSharedView);
document.getElementById('import-profile-input').addEventListener('change', handleImportFileSelected);

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
  state.trackedLifts = data.trackedLifts || {};
  state.progressFilterMode = data.progressFilterMode || 'all';
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
