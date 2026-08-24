import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  GoogleAuthProvider,
  signOut
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";
import {
  initializeFirestore,
  persistentLocalCache,
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  deleteDoc,
  onSnapshot,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

const app = initializeApp(window.FIREBASE_CONFIG);
const auth = getAuth(app);
const db = initializeFirestore(app, { localCache: persistentLocalCache() });

const LEGACY_STORAGE_KEY = "tsa9week_v1";
const DEFAULT_PROFILE_DATA = {
  maxes: {
    squat: { weight: "", reps: "", rpe: "", e1rm: null },
    bench: { weight: "", reps: "", rpe: "", e1rm: null },
    deadlift: { weight: "", reps: "", rpe: "", e1rm: null }
  },
  rounding: 2.5,
  customExercises: {},
  logs: {},
  trackedLifts: {},
  trackSbd: true,
  weekTitles: {},
  viewerEmails: [],
  plateSettings: {
    barbellKg: 20,
    barbellLb: 45,
    collars: false,
    platesKg: Object.fromEntries([25, 20, 15, 10, 5, 2.5, 1.25].map((d) => [d, { count: 0, unlimited: true }])),
    platesLb: Object.fromEntries([45, 35, 25, 10, 5, 2.5].map((d) => [d, { count: 0, unlimited: true }]))
  }
};

function userDocRef(uid) {
  return doc(db, "users", uid);
}

function profileDocRef(uid, profileId) {
  return doc(db, "users", uid, "profiles", profileId);
}

function profilesCollectionRef(uid) {
  return collection(db, "users", uid, "profiles");
}

function blueprintDocRef(uid, blueprintId) {
  return doc(db, "users", uid, "blueprints", blueprintId);
}

function blueprintsCollectionRef(uid) {
  return collection(db, "users", uid, "blueprints");
}

async function signUpEmail(email, password) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  return cred.user;
}

async function signInEmail(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

async function signInGoogle() {
  const provider = new GoogleAuthProvider();
  try {
    const cred = await signInWithPopup(auth, provider);
    return cred.user;
  } catch (err) {
    if (err.code === "auth/popup-blocked" || err.code === "auth/popup-closed-by-user") {
      await signInWithRedirect(auth, provider);
      return null;
    }
    throw err;
  }
}

async function signOutUser() {
  await signOut(auth);
}

function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}

async function ensureUserDoc(uid, email) {
  const ref = userDocRef(uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    const data = { email: email || null, currentProfileId: null, createdAt: serverTimestamp() };
    await setDoc(ref, data);
    return data;
  }
  return snap.data();
}

async function setCurrentProfileId(uid, profileId) {
  await setDoc(userDocRef(uid), { currentProfileId: profileId }, { merge: true });
}

async function listProfiles(uid) {
  const snap = await getDocs(profilesCollectionRef(uid));
  const profiles = [];
  snap.forEach((d) => profiles.push({ id: d.id, name: d.data().name || "Untitled" }));
  return profiles;
}

async function createProfile(uid, name, seedData) {
  const ref = doc(profilesCollectionRef(uid));
  const data = {
    name,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    ...DEFAULT_PROFILE_DATA,
    ...(seedData || {})
  };
  await setDoc(ref, data);
  return ref.id;
}

async function renameProfile(uid, profileId, name) {
  await setDoc(profileDocRef(uid, profileId), { name, updatedAt: serverTimestamp() }, { merge: true });
}

async function deleteProfile(uid, profileId) {
  await deleteDoc(profileDocRef(uid, profileId));
}

async function loadProfileData(uid, profileId) {
  const snap = await getDoc(profileDocRef(uid, profileId));
  return snap.exists() ? snap.data() : null;
}

async function saveProfileData(uid, profileId, data) {
  // mergeFields (not a plain {merge: true}) so each top-level field - customExercises,
  // logs, etc. - is REPLACED wholesale. A plain merge:true recursively merges into nested
  // map fields, silently preserving any subkey (e.g. a deleted day's exercise override)
  // that isn't present in the new value, since Firestore has no way to distinguish
  // "delete this subkey" from "I just didn't mention it" without an explicit deleteField().
  await setDoc(
    profileDocRef(uid, profileId),
    { ...data, updatedAt: serverTimestamp() },
    { mergeFields: [...Object.keys(data), 'updatedAt'] }
  );
}

async function listBlueprints(uid) {
  const snap = await getDocs(blueprintsCollectionRef(uid));
  const blueprints = [];
  snap.forEach((d) => blueprints.push({ id: d.id, name: d.data().name || "Untitled" }));
  return blueprints;
}

async function createBlueprint(uid, name, data) {
  const ref = doc(blueprintsCollectionRef(uid));
  await setDoc(ref, {
    name,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    maxes: data.maxes,
    rounding: data.rounding,
    customExercises: data.customExercises,
    plateSettings: data.plateSettings,
    trackedLifts: data.trackedLifts,
    trackSbd: data.trackSbd !== false,
    weekTitles: data.weekTitles || {}
  });
  return ref.id;
}

async function renameBlueprint(uid, blueprintId, name) {
  await setDoc(blueprintDocRef(uid, blueprintId), { name, updatedAt: serverTimestamp() }, { merge: true });
}

async function deleteBlueprint(uid, blueprintId) {
  await deleteDoc(blueprintDocRef(uid, blueprintId));
}

async function loadBlueprintData(uid, blueprintId) {
  const snap = await getDoc(blueprintDocRef(uid, blueprintId));
  return snap.exists() ? snap.data() : null;
}

async function setViewerEmails(uid, profileId, emails) {
  await setDoc(
    profileDocRef(uid, profileId),
    { viewerEmails: emails, updatedAt: serverTimestamp() },
    { mergeFields: ['viewerEmails', 'updatedAt'] }
  );
}

function watchCurrentProfile(uid, profileId, callback) {
  return onSnapshot(profileDocRef(uid, profileId), (snap) => {
    if (snap.exists()) callback(snap.data());
  });
}

function readLegacyLocalStorage() {
  try {
    const raw = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data || typeof data !== "object") return null;
    return data;
  } catch (e) {
    return null;
  }
}

async function importLegacyLocalStorageIfNeeded(uid) {
  const existing = await listProfiles(uid);
  if (existing.length > 0) return null;

  const legacy = readLegacyLocalStorage();
  const seed = legacy
    ? {
        maxes: legacy.maxes || DEFAULT_PROFILE_DATA.maxes,
        rounding: legacy.rounding || DEFAULT_PROFILE_DATA.rounding,
        customExercises: legacy.customExercises || {},
        logs: legacy.logs || {}
      }
    : null;

  const name = legacy ? "My Training Block" : "Default";
  const profileId = await createProfile(uid, name, seed || {});
  await setCurrentProfileId(uid, profileId);
  return profileId;
}

window.Firebase = {
  onAuthChange,
  signUpEmail,
  signInEmail,
  signInGoogle,
  signOutUser,
  ensureUserDoc,
  setCurrentProfileId,
  listProfiles,
  createProfile,
  renameProfile,
  deleteProfile,
  loadProfileData,
  saveProfileData,
  listBlueprints,
  createBlueprint,
  renameBlueprint,
  deleteBlueprint,
  loadBlueprintData,
  setViewerEmails,
  watchCurrentProfile,
  importLegacyLocalStorageIfNeeded
};

window.__firebaseReady = true;
window.dispatchEvent(new CustomEvent("firebase-ready"));
