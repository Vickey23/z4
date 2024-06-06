import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import {
  getFirestore,
  doc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyD_IKQbtBsM-c3iYqgUwJBHVTtEp6-y408",
  authDomain: "flash-e8583.firebaseapp.com",
  databaseURL:
    "https://flash-e8583-default-rtdb.europe-west1.firebasedatabase.app/",
  projectId: "flash-e8583",
  storageBucket: "flash-e8583.appspot.com",
  messagingSenderId: "804520391805",
  appId: "1:804520391805:web:08dcb64c42f5818a28ad14",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore();
const auth = getAuth(app);

const userEmail = document.querySelector("#email");
const userPassword = document.querySelector("#password");
const authForm = document.querySelector("#authForm");

let RegisterUser = (e) => {
  e.preventDefault();

  createUserWithEmailAndPassword(auth, userEmail.value, userPassword.value)
    .then(async (credentials) => {
      var ref = doc(db, "UserAuthList", credentials.user.uid);
      await setDoc(ref, {
        uid: credentials.user.uid,
        email: userEmail.value,
      });
      window.location.href = "login.html";
    })
    .catch((error) => {
      console.log(error.code);
      console.log(error.message);
    });
};

authForm.addEventListener("submit", RegisterUser);
