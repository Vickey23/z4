import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  arrayUnion,
  arrayRemove,
  query,
  where,
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

const groupList = document.getElementById("groupList");
const membersList = document.querySelector(".membersList");
const groupNameInput = document.getElementById("groupName");
const groupDescriptionInput = document.getElementById("groupkDescription");
const profileIdInput = document.getElementById("profile_id");
const saveGroupBtn = document.querySelector(".btn-save");
const removeSelectedBtn = document.getElementById("removeSelected");
const btnAddMember = document.querySelector(".btn-add");

let currentGroupId = null;

const loadUserGroups = async function () {
  try {
    // Query to find all groups where the user is a member
    const groupsQuery = query(
      collection(db, "Groups"),
      where("Members", "array-contains", currentUser)
    );

    const querySnapshot = await getDocs(groupsQuery);

    groupList.innerHTML = ""; // Clear the list

    if (querySnapshot.empty) {
      groupList.innerHTML = "<li>You are not a member of any groups.</li>";
    } else {
      querySnapshot.forEach((doc) => {
        const groupData = doc.data();
        const groupItem = document.createElement("li");
        groupItem.textContent = groupData.groupName;
        groupItem.dataset.groupId = doc.id;
        groupItem.addEventListener("click", () => loadGroupDetails(doc.id));
        groupList.appendChild(groupItem);
      });
    }
  } catch (error) {
    console.error("Error loading user groups: ", error);
  }
};

const loadGroupDetails = async function (groupId) {
  try {
    const groupRef = doc(db, "Groups", groupId);
    const groupDoc = await getDoc(groupRef);

    if (!groupDoc.exists()) {
      console.error("No group found with the given ID.");
      return;
    }

    currentGroupId = groupId;
    const groupData = groupDoc.data();

    groupNameInput.value = groupData.groupName;
    groupDescriptionInput.value = groupData.groupDesc;
    membersList.innerHTML = "";

    groupData.Members.forEach((member) => {
      const memberItem = document.createElement("li");
      memberItem.innerHTML = `<input type="checkbox"><label>${member}</label>`;
      membersList.appendChild(memberItem);
    });
  } catch (error) {
    console.error("Error loading group details: ", error);
  }
};

const saveGroup = async function () {
  if (!currentGroupId) {
    console.error("No group selected.");
    return;
  }

  const groupRef = doc(db, "Groups", currentGroupId);
  try {
    await updateDoc(groupRef, {
      groupName: groupNameInput.value,
      groupDesc: groupDescriptionInput.value,
    });
    console.log("Group updated successfully.");
  } catch (error) {
    console.error("Error updating group: ", error);
  }
};

const addMember = async function () {
  if (!currentGroupId) {
    console.error("No group selected.");
    return;
  }

  const newMemberId = profileIdInput.value;
  const groupRef = doc(db, "Groups", currentGroupId);

  try {
    await updateDoc(groupRef, {
      Members: arrayUnion(newMemberId),
    });

    const newMemberItem = document.createElement("li");
    newMemberItem.innerHTML = `<input type="checkbox"><label>${newMemberId}</label>`;
    membersList.appendChild(newMemberItem);

    profileIdInput.value = ""; // Clear input field
    console.log("Member added successfully.");
  } catch (error) {
    console.error("Error adding member: ", error);
  }
};

const removeSelectedMembers = async function () {
  if (!currentGroupId) {
    console.error("No group selected.");
    return;
  }

  const selectedMembers = [];
  const checkboxes = membersList.querySelectorAll(
    "input[type='checkbox']:checked"
  );

  checkboxes.forEach((checkbox) => {
    selectedMembers.push(checkbox.nextElementSibling.textContent);
    checkbox.closest("li").remove();
  });

  if (selectedMembers.length > 0) {
    const groupRef = doc(db, "Groups", currentGroupId);

    try {
      await updateDoc(groupRef, {
        Members: arrayRemove(...selectedMembers),
      });
      console.log("Selected members removed successfully.");
    } catch (error) {
      console.error("Error removing members: ", error);
    }
  }
};

// Load user groups when the page loads
window.addEventListener("load", loadUserGroups);
saveGroupBtn.addEventListener("click", function (e) {
  e.preventDefault();
  saveGroup();
  loadUserGroups();
});
removeSelectedBtn.addEventListener("click", removeSelectedMembers);
btnAddMember.addEventListener("click", addMember);
