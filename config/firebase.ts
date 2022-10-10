// Import the functions you need from the SDKs you need
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getApp, getApps, initializeApp } from "firebase/app";
import {getStorage} from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBoj1KzOFNROFDxZ_u24ZiQsDrhlj_oowk",
  authDomain: "next-chat-802bb.firebaseapp.com",
  projectId: "next-chat-802bb",
  storageBucket: "next-chat-802bb.appspot.com",
  messagingSenderId: "372911816299",
  appId: "1:372911816299:web:1e1fb91f08e52f57c53b2e",
  measurementId: "G-379PRVP5FD",
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const storage = getStorage()

export { db, auth, provider, storage };
