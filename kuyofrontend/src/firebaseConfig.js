// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAgJ9iVgIm4HQHTtWTwuipnN_4psZ7Xp10",
  authDomain: "kuyo-5dca3.firebaseapp.com",
  projectId: "kuyo-5dca3",
  storageBucket: "kuyo-5dca3.firebasestorage.app",
  messagingSenderId: "750974917114",
  appId: "1:750974917114:web:6b75416c76aba773316c43"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const db = getFirestore(app);

export { db };