import { db } from "@/config/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

async function fetchUserRole(uid) {
  const collections = ["users", "owners", "admins"];
  for (const collection of collections) {
    const docRef = doc(db, collection, uid);
    const userDoc = await getDoc(docRef);
    if (userDoc.exists()) {
      return { ...userDoc.data(), role: collection.slice(0, -1) };
    }
  }
  return null;
}

async function storeUserInCollection(uid, name, email, role, idImage = null) {
  const collection =
    role === "owner" ? "owners" : role === "admin" ? "admins" : "users";
  const userRef = doc(db, collection, uid);
  const userData = { name, email, role, createdAt: new Date() };
  if (idImage) userData.idImage = idImage;
  await setDoc(userRef, userData);
}

export { fetchUserRole, storeUserInCollection };
