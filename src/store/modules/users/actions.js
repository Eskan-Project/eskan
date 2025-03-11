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
import { signInWithEmailAndPassword } from "firebase/auth";

export default {
  // Fix: Change setUser to setUsers in getUsers action for consistency
  async getUsers({ commit }) {
    commit("startLoading", null, { root: true });
    try {
      // Check if user is authenticated
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

      const usersSnapshot = await getDocs(collection(db, "users"));
      const users = usersSnapshot.docs.map((doc) => ({
        ...doc.data(),
        uid: doc.id,
      }));

      commit("setUsers", users);
      return users;
    } catch (error) {
      console.error("Error in getUsers:", error);
      commit("setError", error.message);
      return [];
    } finally {
      commit("stopLoading", null, { root: true });
    }
  },

  async getUserByUid({ commit }, uid) {
    commit("startLoading", null, { root: true });
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        const userData = { uid: userDoc.id, ...userDoc.data() };
        commit("setUserInfo", userData);
        return userData;
      }
    } catch (error) {
      commit("setError", error.message);
    } finally {
      commit("stopLoading", null, { root: true });
    }
  },

  async updateUser({ commit }, { uid, userData }) {
    commit("startLoading", null, { root: true });
    try {
      const userRef = doc(db, "users", uid);
      await updateDoc(userRef, userData);
      commit("updateUserInfo", userData);
      return true;
    } catch (error) {
      commit("setError", error.message);
      throw error;
    } finally {
      commit("stopLoading", null, { root: true });
    }
  },

  async deleteUser({ commit }, uid) {
    commit("startLoading", null, { root: true });
    try {
      await deleteDoc(doc(db, "users", uid));
      commit("resetUserInfo");
      return true;
    } catch (error) {
      commit("setError", error.message);
      throw error;
    } finally {
      commit("stopLoading", null, { root: true });
    }
  },

  async getUsersByRole({ commit }, role) {
    commit("startLoading", null, { root: true });
    try {
      const q = query(collection(db, "users"), where("role", "==", role));
      const querySnapshot = await getDocs(q);
      const users = querySnapshot.docs.map((doc) => ({
        uid: doc.id,
        ...doc.data(),
      }));
      commit("setUser", users);
      return users;
    } catch (error) {
      commit("setError", error.message);
    } finally {
      commit("stopLoading", null, { root: true });
    }
  },

  clearError({ commit }) {
    commit("clearError");
  },

  async createUser({ commit }, userData) {
    commit("startLoading", null, { root: true });
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error("User not authenticated");
      }

      if (!userData || !userData.uid) {
        throw new Error("Invalid user data");
      }

      // Create the user document without affecting admin session
      const userRef = doc(db, "users", userData.uid);
      await setDoc(userRef, {
        ...userData,
        createdBy: currentUser.uid,
      });

      return true;
    } catch (error) {
      commit("setError", error.message);
      throw error;
    } finally {
      commit("stopLoading", null, { root: true });
    }
  },
};
