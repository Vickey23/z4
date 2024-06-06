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

const userId = "Xx4iK4TEYBdeFBl0mY81maiZKgD3";
const groupName = "Awesome Group";
createGroup(userId, groupName);
