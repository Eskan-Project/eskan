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

export default {
  async getRequests({ commit }) {
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

      const requestsSnapshot = await getDocs(collection(db, "requests"));
      const requests = requestsSnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        uid: doc.id,
      }));

      commit("setRequests", requests);
      return requests;
    } catch (error) {
      console.error("Error in getRequests:", error);
      commit("setError", error.message);
      return [];
    } finally {
      commit("stopLoading", null, { root: true });
    }
  },

  async getRequestById({ commit }, uid) {
    commit("startLoading", null, { root: true });
    try {
      const requestDoc = await getDoc(doc(db, "requests", uid));
      if (requestDoc.exists()) {
        const requestData = {
          ...requestDoc.data(),
          id: requestDoc.id, // Add document ID as id field
          uid: requestDoc.id, // Keep uid for backward compatibility
        };
        commit("setRequestInfo", requestData);
        return requestData;
      }
      return null;
    } catch (error) {
      commit("setError", error.message);
      throw error;
    } finally {
      commit("stopLoading", null, { root: true });
    }
  },

  async updateRequest({ commit }, { uid, requestData }) {
    commit("startLoading", null, { root: true });
    try {
      const requestRef = doc(db, "requests", uid);
      const updatedData = {
        ...requestData,
        updatedAt: new Date().toISOString(),
      };
      await updateDoc(requestRef, updatedData);
      commit("updateRequestInfo", { ...updatedData, id: uid, uid: uid });
      return true;
    } catch (error) {
      commit("setError", error.message);
      throw error;
    } finally {
      commit("stopLoading", null, { root: true });
    }
  },

  async deleteRequest({ commit }, uid) {
    commit("startLoading", null, { root: true });
    try {
      await deleteDoc(doc(db, "requests", uid));
      commit("resetRequestInfo");
      return true;
    } catch (error) {
      commit("setError", error.message);
      throw error;
    } finally {
      commit("stopLoading", null, { root: true });
    }
  },

  async getRequestsByStatus({ commit }, status) {
    commit("startLoading", null, { root: true });
    try {
      const q = query(
        collection(db, "requests"),
        where("status", "==", status)
      );
      const querySnapshot = await getDocs(q);
      const requests = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        uid: doc.id,
      }));
      commit("setRequests", requests);
      return requests;
    } catch (error) {
      commit("setError", error.message);
    } finally {
      commit("stopLoading", null, { root: true });
    }
  },

  async createRequest({ commit }, requestData) {
    commit("startLoading", null, { root: true });
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error("User not authenticated");
      }

      if (!requestData) {
        throw new Error("Invalid request data");
      }

      // Create new document with auto-generated ID
      const requestRef = doc(collection(db, "requests"));
      const requestId = requestRef.id; // Get the auto-generated ID

      // Add creation metadata and ID
      const finalRequestData = {
        ...requestData,
        id: requestId, // Add the document ID as a field
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: currentUser.uid,
      };

      await setDoc(requestRef, finalRequestData);
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
