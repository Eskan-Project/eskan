import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyATJDdOfsdVin3PPP9ouSq4PGb7QFdX3x8",
  authDomain: "eskan-project-14c3b.firebaseapp.com",
  databaseURL:
    "https://eskan-project-14c3b-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "eskan-project-14c3b",
  storageBucket: "eskan-project-14c3b.firebasestorage.app",
  messagingSenderId: "468202611843",
  appId: "1:468202611843:web:2dddbd587a8e832d24e7b6",
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
