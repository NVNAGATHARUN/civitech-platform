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

// Debug: Verify config is loaded
if (typeof window !== "undefined") {
    console.log("Firebase Project ID:", firebaseConfig.projectId);
    if (!firebaseConfig.apiKey) {
        console.error("FIREBASE ERROR: API Key is missing! Check your .env.local file.");
    }
}

// Initialize Firebase safely
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);

// Use initializeFirestore with experimentalForceLongPolling to bypass potential network blocks
const db = initializeFirestore(app, {
    experimentalForceLongPolling: true,
});

// Analytics setup (client-side only)
let analytics: Analytics | undefined;
if (typeof window !== "undefined") {
    isSupported().then((yes) => yes && (analytics = getAnalytics(app)));
}

export { app, auth, db, analytics };
