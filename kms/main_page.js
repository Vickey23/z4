document.addEventListener("DOMContentLoaded", () => {
  const recentDecksPlaceholder = document.getElementById(
    "recent-decks-placeholder"
  );

  function loadRecentDecks() {
    const savedDecks = JSON.parse(localStorage.getItem("savedDecks")) || [];
    const recentDecks = savedDecks.slice(-3);
    recentDecks.forEach((deck) => {
      const button = document.createElement("a");
      button.href = `deck_management.html?deck=${deck.name}`;
      button.className = "add_btn btn btn-outline-secondary";

      const displayName =
        deck.name.length > 5 ? deck.name.substring(0, 4) + "..." : deck.name;
      button.textContent = displayName;

      recentDecksPlaceholder.appendChild(button);
    });
  }

  loadRecentDecks();
});

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

export const firebaseConfig = {
  apiKey: "AIzaSyD_IKQbtBsM-c3iYqgUwJBHVTtEp6-y408",
  authDomain: "flash-e8583.firebaseapp.com",
  databaseURL:
    "https://flash-e8583-default-rtdb.europe-west1.firebasedatabase.app/",
  projectId: "flash-e8583",
  storageBucket: "flash-e8583.appspot.com",
  messagingSenderId: "804520391805",
  appId: "1:804520391805:web:08dcb64c42f5818a28ad14",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const uidData = sessionStorage.getItem("user-info");
const currentUser = JSON.parse(uidData).uid;

const groupsPlaceholder = document.getElementById("recent-groups-placeholder");

const loadUserGroups = async function () {
  try {
    // Query to find all groups where the user is a member
    const groupsQuery = query(
      collection(db, "Groups"),
      where("Members", "array-contains", currentUser)
    );

    const querySnapshot = await getDocs(groupsQuery);

    groupsPlaceholder.innerHTML = ""; // Clear the placeholder

    if (querySnapshot.empty) {
      groupsPlaceholder.innerHTML =
        "<p>You are not a member of any groups.</p>";
    } else {
      querySnapshot.forEach((doc) => {
        const groupData = doc.data();
        const groupElement = document.createElement("div");
        groupElement.className = "group";
        groupElement.innerHTML = `
          <div class="group-box">${groupData.groupName}</div>
          
        `;
        groupsPlaceholder.appendChild(groupElement);
      });
    }
  } catch (error) {
    console.error("Error loading user groups: ", error);
  }
};

// Load the user groups when the page loads
window.addEventListener("load", loadUserGroups);
