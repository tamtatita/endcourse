import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBb_1uFNCXVzkbqFAVjnIARPNwF1MGG0eA",
  authDomain: "khoaluan-3f245.firebaseapp.com",
  projectId: "khoaluan-3f245",
  storageBucket: "khoaluan-3f245.appspot.com",
  messagingSenderId: "78385815714",
  appId: "1:78385815714:web:a7c379249cac7061edf7fb",
  measurementId: "G-XL5DK8XQM9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth();
export const storage = getStorage(app);

const provider = new GoogleAuthProvider();

export const signInWithGoogle = () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      console.log(result);
    })
    .catch((error) => {
      console.log(error);
    });
};
