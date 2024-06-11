import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  updateDoc,
  arrayUnion,
  writeBatch,
  getDoc,
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

const groupNameInput = document.getElementById("groupName");
const createGroupBtn = document.getElementById("createGroupBtn");
const groupDescriptionInput = document.getElementById("groupDescription");
const addMemberBtn = document.getElementById("addMemberBtn");
const profileIdInput = document.getElementById("profileId");

const membersList = document.querySelector(".membersList");

const uidData = sessionStorage.getItem("user-info");
const currentUser = JSON.parse(uidData).uid;

let currentGroupId = null; // To store the current group ID
let currentMembers = []; // To store the current members' emails

const createAGroup = async function createGroup(userId, groupName, groupDesc) {
  const groupRef = doc(collection(db, "Groups"));
  const groupId = groupRef.id;

  const batch = writeBatch(db);

  batch.set(groupRef, {
    groupName: groupName,
    Members: [userId],
    groupDesc: groupDesc,
  });

  const userRef = doc(db, "UserAuthList", userId);

  const userDoc = await getDoc(userRef);
  if (!userDoc.exists()) {
    batch.set(userRef, {
      groups: [groupId],
    });
  } else {
    batch.update(userRef, {
      groups: arrayUnion(groupId),
    });
  }

  try {
    await batch.commit();
    currentGroupId = groupId; // Store the created group ID
    currentMembers = []; // Reset the members list

    // Add current user's email to the members list
    const currentUserDoc = await getDoc(userRef);
    if (currentUserDoc.exists()) {
      const currentUserEmail = currentUserDoc.data().email;
      currentMembers.push(currentUserEmail);
    }

    updateMembersList();
    console.log("Group created successfully");
  } catch (error) {
    console.error("Error creating group: ", error);
  }
};

const updateMembersList = function () {
  membersList.innerHTML = "";
  currentMembers.forEach((email) => {
    const li = document.createElement("li");
    li.textContent = email;
    membersList.appendChild(li);
  });
};

const addMemberToGroup = async function (userEmail) {
  if (!currentGroupId) {
    console.error(
      "No group ID available. Please create or select a group first."
    );
    return;
  }

  try {
    // Fetch the user document by email
    const userQuery = await getDocs(
      query(collection(db, "UserAuthList"), where("email", "==", userEmail))
    );

    if (userQuery.empty) {
      console.error("No user found with this email.");
      return;
    }

    const userDoc = userQuery.docs[0];
    const userId = userDoc.id;
    const userEmailFromDoc = userDoc.data().email;

    // Get references to the group and user documents
    const groupRef = doc(db, "Groups", currentGroupId);
    const userRef = doc(db, "UserAuthList", userId);

    const batch = writeBatch(db);

    // Add the user to the group's Members array
    batch.update(groupRef, {
      Members: arrayUnion(userId),
    });

    // Add the group to the user's groups array
    batch.update(userRef, {
      groups: arrayUnion(currentGroupId),
    });

    // Commit the batch
    await batch.commit();

    // Add the member's email to the current members list and update the DOM
    currentMembers.push(userEmailFromDoc);
    updateMembersList();

    console.log("Member added successfully");
  } catch (error) {
    console.error("Error adding member to group: ", error);
  }
};

createGroupBtn.addEventListener("click", (event) => {
  const groupName = groupNameInput.value;
  const groupDesc = groupDescriptionInput.value;
  event.preventDefault();
  createAGroup(currentUser, groupName, groupDesc);
  groupNameInput.value = "";
  groupDescriptionInput.value = "";
});

addMemberBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const userEmail = profileIdInput.value;
  addMemberToGroup(userEmail);
  profileIdInput.value = "";
});
