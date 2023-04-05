// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectStorageEmulator, getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAbQ4HTAo4eAx2R07r8ndxewqGEqWo6_do",
  authDomain: "fir-1-2436b.firebaseapp.com",
  projectId: "fir-1-2436b",
  // storageBucket: "fir-1-2436b.appspot.com",
  storageBucket: "127.0.0.1:8080",
  messagingSenderId: "20000558993",
  appId: "1:20000558993:web:0f2039d2546e86600f5430",
  measurementId: "G-HJRHWERR0V"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore();
connectFirestoreEmulator(db, '127.0.0.1', 8080);
export const storage = getStorage();
connectStorageEmulator(storage, "127.0.0.1", 9199);

