import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import {
  getDatabase,
  set,
  ref,
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";
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
const db = getDatabase();
const auth = getAuth(app);

const userEmail = document.querySelector("#email");
const userPassword = document.querySelector("#password");
const authForm = document.querySelector("#authForm");

let RegisterUser = (e) => {
  e.preventDefault();

  createUserWithEmailAndPassword(auth, userEmail.value, userPassword.value)
    .then((credentials) => {
      set(ref(db, "UsersAuthList/" + credentials.user.uid), {
        login: userEmail.value,
        pass: userPassword.value,
      });
    })
    .catch((error) => {
      console.log(error.code);
      console.log(error.message);
    });
};

authForm.addEventListener("submit", RegisterUser);
