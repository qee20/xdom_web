// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC4M7p3R5-2hpzndYLSH_qd_8jV6gkBCwQ",
  authDomain: "proposalx-f370d.firebaseapp.com",
  databaseURL: "https://proposalx-f370d-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "proposalx-f370d",
  storageBucket: "proposalx-f370d.appspot.com",
  messagingSenderId: "977412466766",
  appId: "1:977412466766:web:feb5b5a394cfd3e92dfb1f",
  measurementId: "G-DD6P4R63WF"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const database = getDatabase(app);
export const auth = getAuth(app);