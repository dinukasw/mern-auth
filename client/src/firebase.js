// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "mern-auth-e7f5f.firebaseapp.com",
    projectId: "mern-auth-e7f5f",
    storageBucket: "mern-auth-e7f5f.firebasestorage.app",
    messagingSenderId: "566208415714",
    appId: "1:566208415714:web:ab5172d4d2c32f9756dbbb",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
