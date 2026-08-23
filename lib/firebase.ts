import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported, Analytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export const firebaseConfig = {
  apiKey: "AIzaSyAEQ2p2PMetwKBS3XLH6mrSGB8qfQmPaYE",
  authDomain: "testinghub-f1d43.firebaseapp.com",
  projectId: "testinghub-f1d43",
  storageBucket: "testinghub-f1d43.firebasestorage.app",
  messagingSenderId: "303205303082",
  appId: "1:303205303082:web:c950f2358518d6550b5453",
  measurementId: "G-D8RHBJZ2BP",
};

// Initialize Firebase (singleton pattern for Next.js)
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);

export let analytics: Analytics | null = null;

if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}
