import { auth, db } from "@/config/firebase";
import {
  doc,
  setDoc,
  collection,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import axios from "axios";
import { signInWithEmailAndPassword } from "firebase/auth";

export default {
  async getOwners({ commit }) {
    commit("startLoading", null, { root: true });
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error("User not authenticated");
      }

      // Check admin role in owners collection
      const ownerDoc = await getDoc(doc(db, "owners", currentUser.uid));
      const ownerData = ownerDoc.data();

      if (ownerData?.role !== "admin") {
        throw new Error("Insufficient permissions: Admin access required");
      }

      const ownersSnapshot = await getDocs(collection(db, "owners"));
      const owners = ownersSnapshot.docs.map((doc) => ({
        ...doc.data(),
        uid: doc.id,
      }));

      commit("setOwners", owners);
      return owners;
    } catch (error) {
      console.error("Error in getOwners:", error);
      commit("setError", error.message);
      return [];
    } finally {
      commit("stopLoading", null, { root: true });
    }
  },

  async getOwnerByUid({ commit }, uid) {
    commit("startLoading", null, { root: true });
    try {
      const ownerDoc = await getDoc(doc(db, "owners", uid));
      if (ownerDoc.exists()) {
        const ownerData = { uid: ownerDoc.id, ...ownerDoc.data() };
        commit("setOwnerInfo", ownerData);
        return ownerData; // Make sure to return the data
      }
      return null; // Return null if no document exists
    } catch (error) {
      commit("setError", error.message);
      throw error; // Throw error to be caught in component
    } finally {
      commit("stopLoading", null, { root: true });
    }
  },

  async updateOwner({ commit }, { uid, ownerData }) {
    commit("startLoading", null, { root: true });
    try {
      const ownerRef = doc(db, "owners", uid);
      await updateDoc(ownerRef, ownerData);
      commit("updateOwnerInfo", ownerData);
      return true;
    } catch (error) {
      commit("setError", error.message);
      throw error;
    } finally {
      commit("stopLoading", null, { root: true });
    }
  },

  async deleteOwner({ commit }, uid) {
    commit("startLoading", null, { root: true });
    try {
      // First delete from Firebase Auth via our backend endpoint
      const response1 = await axios.post(
        "http://localhost:3001/delete-auth-user",
        {
          uid: uid,
        }
      );
      if (response1.status !== 200) {
        throw new Error("Failed to delete Owner");
      }

      // Then delete from Firestore
      await deleteDoc(doc(db, "owners", uid));
      commit("resetOwnerInfo");
      return true;
    } catch (error) {
      commit("setError", error.message);
      throw error;
    } finally {
      commit("stopLoading", null, { root: true });
    }
  },

  async getOwnersByRole({ commit }, role) {
    commit("startLoading", null, { root: true });
    try {
      const q = query(collection(db, "owners"), where("role", "==", role));
      const querySnapshot = await getDocs(q);
      const owners = querySnapshot.docs.map((doc) => ({
        uid: doc.id,
        ...doc.data(),
      }));
      commit("setOwners", owners);
      return owners;
    } catch (error) {
      commit("setError", error.message);
    } finally {
      commit("stopLoading", null, { root: true });
    }
  },

  async createOwner({ commit }, ownerData) {
    commit("startLoading", null, { root: true });
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error("Admin not authenticated");
      }

      if (!ownerData || !ownerData.uid) {
        throw new Error("Invalid owner data");
      }

      const ownerRef = doc(db, "owners", ownerData.uid);
      await setDoc(ownerRef, ownerData);

      return true;
    } catch (error) {
      commit("setError", error.message);
      throw error;
    } finally {
      commit("stopLoading", null, { root: true });
    }
  },

  clearError({ commit }) {
    commit("clearError");
  },
};
