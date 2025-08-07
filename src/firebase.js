// Import the functions you need from the Firebase SDKs
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// Note: You don't need getAnalytics for this project, so it can be removed.

// Your web app's Firebase configuration from your Firebase project
const firebaseConfig = {
  apiKey: "AIzaSyDvjoV3eOEWhb6vOSAOMMorvIfQzr1g1U0",
  authDomain: "smart-campus-booking-website.firebaseapp.com",
  projectId: "smart-campus-booking-website",
  storageBucket: "smart-campus-booking-website.firebasestorage.app", // Note: The prompt uses firestore, not storage, but it's good to have this key.
  messagingSenderId: "909008243286",
  appId: "1:909008243286:web:36a70b0cefd73ae95989f7",
  measurementId: "G-MQ4R9FSXCS" // This is optional but fine to keep
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export Firebase Authentication
export const auth = getAuth(app);

// Initialize and export Cloud Firestore
export const db = getFirestore(app);

// You can also export the main app object if needed elsewhere, but it's often not necessary
export default app;
