// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBJiKAulzrw1igg9paw_qRqYPX-orpHC3M",
    authDomain: "sample-firebase-ai-app-13fca.firebaseapp.com",
    projectId: "sample-firebase-ai-app-13fca",
    storageBucket: "sample-firebase-ai-app-13fca.firebasestorage.app",
    messagingSenderId: "776146262459",
    appId: "1:776146262459:web:e41cc1003826f8d4070c9e"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
export { app, db, storage, googleProvider, auth };