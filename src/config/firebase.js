// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { GoogleAuthProvider, getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB2laWdIoeJtm35eDKGECCcOFvJHVxZS80",
  authDomain: "pet-management-94cf6.firebaseapp.com",
  projectId: "pet-management-94cf6",
  storageBucket: "pet-management-94cf6.appspot.com",
  messagingSenderId: "412494328318",
  appId: "1:412494328318:web:1d352f489e01f454e290af",
  measurementId: "G-1M9XMY9FS7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();
const auth = getAuth();
export { storage, googleProvider, auth };
