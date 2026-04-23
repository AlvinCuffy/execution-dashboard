import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "REPLACE_ME",
  authDomain: "REPLACE_ME",
  projectId: "REPLACE_ME",
  storageBucket: "REPLACE_ME",
  messagingSenderId: "REPLACE_ME",
  appId: "REPLACE_ME",
};

const isConfigured = !Object.values(firebaseConfig).includes("REPLACE_ME");

// db is null until you replace the config values above with your Firebase project credentials.
// The app falls back to localStorage until Firestore is connected.
export const db = isConfigured ? getFirestore(initializeApp(firebaseConfig)) : null;
