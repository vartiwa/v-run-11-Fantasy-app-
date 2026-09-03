import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyCOSTgPjx1FYkh7--QMrXAWgqsc-4GWeCY",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "ipl-auction-app-dc137.firebaseapp.com",
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || "https://ipl-auction-app-dc137-default-rtdb.firebaseio.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "ipl-auction-app-dc137",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "ipl-auction-app-dc137.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "701747595838",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:701747595838:web:6384945d454c29cb565f6f"
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
