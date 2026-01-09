// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBqVPyFaVVUF8N1K27yuTEOlT1q2ma4Sjs",
  authDomain: "qrate-75765.firebaseapp.com",
  projectId: "qrate-75765",
  storageBucket: "qrate-75765.firebasestorage.app",
  messagingSenderId: "590731711628",
  appId: "1:590731711628:web:fb89c062edd5feae6857a9",
  measurementId: "G-JC08Q505F4"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);