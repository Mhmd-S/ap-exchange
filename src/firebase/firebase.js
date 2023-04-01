// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAbQ4HTAo4eAx2R07r8ndxewqGEqWo6_do",
  authDomain: "fir-1-2436b.firebaseapp.com",
  projectId: "fir-1-2436b",
  storageBucket: "fir-1-2436b.appspot.com",
  messagingSenderId: "20000558993",
  appId: "1:20000558993:web:0f2039d2546e86600f5430",
  measurementId: "G-HJRHWERR0V"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage();

