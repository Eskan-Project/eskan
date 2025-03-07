import { db } from "@/config/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

async function fetchUserRole(uid) {
  if (!uid) throw new Error("fetchUserRole: UID is undefined or null");

  const collections = ["users", "owners", "admins"];
  for (const collection of collections) {
    const docRef = doc(db, collection, uid);
    const userDoc = await getDoc(docRef);
    if (userDoc.exists()) {
      return { ...userDoc.data(), role: collection.slice(0, -1), collection };
    }
  }
  throw new Error(`fetchUserRole: No document found for UID ${uid}`);
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

export { fetchUserRole, storeUserInCollection };
