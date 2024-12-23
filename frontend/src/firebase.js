import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "dochub-92559.firebaseapp.com",
    projectId: "dochub-92559",
    storageBucket: "dochub-92559.firebasestorage.app",
    messagingSenderId: "370001867931",
    appId: "1:370001867931:web:d3e31b1753519f6550c23e",
    measurementId: "G-SL8022BYRF"
};

export const app = initializeApp(firebaseConfig);
