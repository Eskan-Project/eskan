import { db } from "@/config/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

async function fetchUserRole(uid) {
  const collections = ["users", "owners", "admins"];
  for (const collection of collections) {
    const docRef = doc(db, collection, uid);
    const userDoc = await getDoc(docRef);
    if (userDoc.exists()) {
      return { ...userDoc.data(), role: collection.slice(0, -1), collection };
    }
  }
  return null;
}

async function storeUserInCollection(uid, userDetails) {
  if (!userDetails.role) {
    throw new Error("Role is required in userDetails");
  }
  const collection =
    userDetails.role === "owner"
      ? "owners"
      : userDetails.role === "admin"
      ? "admins"
      : "users";
  const userRef = doc(db, collection, uid);
  const userData = {
    ...userDetails,
    photo:
      userDetails.photo ||
      "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  await setDoc(userRef, userData, { merge: true });
}

// Add this new function
async function checkPropertyPermission(uid, propertyId) {
  try {
    // Check if user is admin
    const adminRef = doc(db, "admins", uid);
    const adminDoc = await getDoc(adminRef);
    if (adminDoc.exists()) {
      return true;
    }

    // Check if user is the owner of the property
    const propertyRef = doc(db, "properties", propertyId);
    const propertyDoc = await getDoc(propertyRef);
    if (propertyDoc.exists() && propertyDoc.data().ownerId === uid) {
      return true;
    }

    return false;
  } catch (error) {
    console.error("Permission check error:", error);
    return false;
  }
}

export { fetchUserRole, storeUserInCollection, checkPropertyPermission };
