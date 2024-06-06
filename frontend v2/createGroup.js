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

async function createGroup(userId, groupName) {
  const groupRef = doc(collection(db, "Groups"));
  const groupId = groupRef.id;

  const batch = writeBatch(db);

  batch.set(groupRef, {
    groupName: groupName,
    Members: [userId],
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
    console.log("Group created successfully");
  } catch (error) {
    console.error("Error creating group: ", error);
  }
}

const groupName = "Grupa2";
// createGroup(userId, groupName);

export async function displayGroups(userId) {
  const userRef = doc(db, "UserAuthList", userId);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    console.error("User does not exist");
    return;
  }

  const groups = userDoc.data().groups;
  const groupsContainer = document.getElementById("groups-container");

  groupsContainer.innerHTML = "";

  if (Array.isArray(groups) && groups.length > 0) {
    for (const groupId of groups) {
      const groupRef = doc(db, "Groups", groupId);
      const groupDoc = await getDoc(groupRef);

      if (groupDoc.exists()) {
        const groupName = groupDoc.data().groupName;
        const groupElement = document.createElement("div");
        groupElement.className = "group-item";
        groupElement.textContent = groupName;
        groupsContainer.appendChild(groupElement);
      }
    }
  }
}

const uidData = sessionStorage.getItem("user-info");
if (uidData) {
  const uid = JSON.parse(uidData).uid;
  displayGroups(uid);
} else {
  console.error("User is not logged in");
}
