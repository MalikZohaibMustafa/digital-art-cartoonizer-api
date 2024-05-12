import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {getFirestore} from "@firebase/firestore"


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: "digitalart-98f6b.firebaseapp.com",
  projectId: "digitalart-98f6b",
  storageBucket: "digitalart-98f6b.appspot.com",
  messagingSenderId: "565073617531",
  appId: "1:565073617531:web:cbdd91ec148140b6aa38de"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth=getAuth();
export const db=getFirestore(app);


