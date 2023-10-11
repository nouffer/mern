// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-bc33b.firebaseapp.com",
  projectId: "mern-bc33b",
  storageBucket: "mern-bc33b.appspot.com",
  messagingSenderId: "922589677816",
  appId: "1:922589677816:web:1f31c53a5bfbd20bdfd30d",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
