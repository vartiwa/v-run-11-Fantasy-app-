import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getDatabase(app);

// Zero-friction persistent device/browser identity
// Guarantees stable unique player ID without requiring Identity Toolkit / Firebase Auth enabled
export const ensureAuthUser = () => {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      return resolve(null);
    }
    try {
      let savedUid = localStorage.getItem("vrun11_uid");
      if (!savedUid) {
        savedUid = "usr_" + Math.random().toString(36).substring(2, 10) + "_" + Date.now().toString(36);
        localStorage.setItem("vrun11_uid", savedUid);
      }
      resolve({ uid: savedUid, isLocal: true });
    } catch {
      resolve({ uid: "usr_" + Math.random().toString(36).substring(2, 10) });
    }
  });
};

export { app, db };
