import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore, getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported, Analytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Status: Verify config is loaded
if (typeof window !== "undefined") {
    if (!firebaseConfig.apiKey) {
        console.warn("Civitech: Running in Mock Demo Mode (No Firebase API Key detected).");
        console.info("To enable production Firebase features, add keys to your .env.local file.");
    } else {
        console.log("Civitech: Firebase initialized with Project ID:", firebaseConfig.projectId);
    }
}

// Initialize Firebase safely
const canInitialize = !!firebaseConfig.apiKey;

const app = canInitialize
    ? (!getApps().length ? initializeApp(firebaseConfig) : getApp())
    : ({} as any);

const auth = canInitialize ? getAuth(app) : ({} as any);

const db = canInitialize
    ? initializeFirestore(app, { experimentalForceLongPolling: true })
    : ({} as any);

// Analytics setup (client-side only)
let analytics: Analytics | undefined;
if (typeof window !== "undefined" && canInitialize) {
    isSupported().then((yes) => yes && (analytics = getAnalytics(app)));
}

export { app, auth, db, analytics };
