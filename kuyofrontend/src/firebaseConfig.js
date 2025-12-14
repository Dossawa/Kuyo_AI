import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "kuyo-5dca3.firebaseapp.com",
  projectId: "kuyo-5dca3",
  storageBucket: "kuyo-5dca3.firebasestorage.app",
  messagingSenderId: "750974917114",
  appId: "1:750974917114:web:6b75416c76aba773316c43"
};

export const firebaseApp = initializeApp(firebaseConfig);
