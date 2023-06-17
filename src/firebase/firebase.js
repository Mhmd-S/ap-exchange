// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectStorageEmulator, getStorage } from "firebase/storage";

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore();
connectFirestoreEmulator(db, '127.0.0.1', 8080);
export const storage = getStorage();
connectStorageEmulator(storage, "127.0.0.1", 9199);

