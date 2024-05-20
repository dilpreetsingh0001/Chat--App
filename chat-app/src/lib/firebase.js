
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyDenf2C4FyD6f5E3l5qmlSEaLJ6s6Ca6dY",
  authDomain: "react-chat-app-858fd.firebaseapp.com",
  projectId: "react-chat-app-858fd",
  storageBucket: "react-chat-app-858fd.appspot.com",
  messagingSenderId: "247858224933",
  appId: "1:247858224933:web:49940a411cbf75af0a84cc"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage();
export const googleProvider = new GoogleAuthProvider();