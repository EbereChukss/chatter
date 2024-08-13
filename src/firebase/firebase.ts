// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAUVgzLJT4Tf1zznG17a7isREjP3YLW8CE",
  authDomain: "chatter-d0884.firebaseapp.com",
  projectId: "chatter-d0884",
  storageBucket: "chatter-d0884.appspot.com",
  messagingSenderId: "398016987767",
  appId: "1:398016987767:web:2ee2709bb437bc231cfc72",
  measurementId: "G-PK1BKME136",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const provider = new GoogleAuthProvider();
export const storage = getStorage();
export const db = getFirestore(app);