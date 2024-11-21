// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDD5rhvIvrl0gEv-ch1xj1Tpz0-Na06pUw",
  authDomain: "brainstorming-d4ec4.firebaseapp.com",
  projectId: "brainstorming-d4ec4",
  storageBucket: "brainstorming-d4ec4.firebasestorage.app",
  messagingSenderId: "491870457051",
  appId: "1:491870457051:web:429633ed88dfd27a5a10fe",
  measurementId: "G-J62063K7EM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics only on client side
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export const db = getFirestore(app);
export { analytics };