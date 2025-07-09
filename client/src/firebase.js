// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDHO8zUma2aU17ZjArhyaPuJ-YQAmRVslQ",
  authDomain: "ministry-of-missed-opp.firebaseapp.com",
  projectId: "ministry-of-missed-opp",
  storageBucket: "ministry-of-missed-opp.firebasestorage.app",
  messagingSenderId: "270177899803",
  appId: "1:270177899803:web:c6c83efc480f7c6e44afbe",
  measurementId: "G-VS77568WTH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup };
