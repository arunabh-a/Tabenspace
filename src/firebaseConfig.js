// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { get, getDatabase } from "firebase/database";
import { getStorage } from 'firebase/storage';
import { GoogleAuthProvider, getAuth } from "firebase/auth";



// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional


export const firebaseConfig = {
    apiKey: import.meta.env.VITE_API_KEY,
    authDomain: import.meta.env.VITE_AUTH_DOMAIN,
    databaseURL: import.meta.env.VITE_DATABASE_URL,
    projectId: import.meta.env.VITE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
    messagingSenderId: "406111857549",
    appId: import.meta.env.VITE_APP_ID,
    measurementId: import.meta.env.VITE_MEASUREMENT_ID
};

// console.log(firebaseConfig);


export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const db = getDatabase(app);
export const auth = getAuth();
export const googleProvider = new GoogleAuthProvider();