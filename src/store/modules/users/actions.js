import { db } from "@/config/firebase";
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

export default {
  // Fix: Change setUser to setUsers in getUsers action for consistency
  async getUsers({ commit }) {
    commit("startLoading", null, { root: true });
    try {
      const usersSnapshot = await getDocs(collection(db, "users"));
      const users = usersSnapshot.docs.map((doc) => ({
        uid: doc.id,
        ...doc.data(),
      }));
      commit("setUsers", users); // Changed from setUser to setUsers
      return users;
    } catch (error) {
      commit("setError", error.message);
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
};
