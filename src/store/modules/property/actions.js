import { db } from "@/config/firebase";
import {
  doc,
  setDoc,
  collection,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc, // Add this import
} from "firebase/firestore";
import uploadToCloudinary from "@/services/uploadToCloudinary";
import base64ToFile from "@/services/base64ToFileService";
import { checkPropertyPermission } from "@/services/firebaseService";

export default {
  async getProperties({ commit }) {
    commit("startLoading", null, { root: true });
    try {
      const propertiesSnapshot = await getDocs(collection(db, "properties"));
      const properties = propertiesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      commit("setProperties", properties);
      return properties;
    } catch (error) {
      console.log(error);
    } finally {
      commit("stopLoading", null, { root: true });
    }
  },
  async createProperty({ commit, state, rootState, dispatch }, files) {
    commit("startLoading", null, { root: true });
    try {
      if (!rootState.auth.userDetails || !rootState.auth.userDetails.uid) {
        throw new Error("User not authenticated or user details not loaded");
      }
      console.log(files);
      const userRole = rootState.auth.userDetails.role || "owner";
      const collectionName = userRole === "admin" ? "properties" : "requests";
      const propertyId = doc(collection(db, collectionName)).id;

      let imagesUrl = [];
      if (files.length) {
        const folderName = `requests/${propertyId}`;
        imagesUrl = await Promise.all(
          files.map(async (file) => {
            const image = base64ToFile(file);
            return await uploadToCloudinary(
              image,
              import.meta.env.VITE_CLOUDINARY_UPLOAD_PROPERTY_PRESET,
              folderName
            );
          })
        );
      }
      console.log(imagesUrl);
      const ownerId = rootState.auth.userDetails.uid;
      const propertyData = {
        ...state.propertyDetails,
        images: imagesUrl,
        ownerId,
        createdAt: new Date(),
        status: userRole === "admin" ? "approved" : "pending",
      };

      console.log("Property Data to Save:", propertyData);
      await setDoc(doc(db, collectionName, propertyId), propertyData);

      if (userRole !== "admin") {
        console.log("this is working");
        dispatch(
          "notifications/addNotification",
          `Your property ${propertyData.title} is under review.`,
          { root: true }
        );
      }
    } catch (error) {
      console.log(error);
    } finally {
      commit("stopLoading", null, { root: true });
      localStorage.removeItem("propertyDetails");
      localStorage.removeItem("propertyImages");
    }
  },
  async getProperty({ commit }, id) {
    commit("startLoading", null, { root: true });
    try {
      const propertySnapshot = await getDoc(doc(db, "properties", id));
      const property = { id: propertySnapshot.id, ...propertySnapshot.data() };
      console.log("property", property);
      commit("setProperty", property);
    } catch (error) {
      console.log(error);
    } finally {
      commit("stopLoading", null, { root: true });
    }
  },
  updateImages({ commit }, images) {
    commit("updateImages", images);
  },
  async updateProperty(
    { commit, rootState },
    { propertyId, updatedData, files = [] }
  ) {
    commit("startLoading", null, { root: true });
    try {
      if (!rootState.auth.userDetails || !rootState.auth.userDetails.uid) {
        throw new Error("User not authenticated");
      }

      const propertyRef = doc(db, "properties", propertyId);

      // Handle new images if any
      if (files.length) {
        const folderName = `properties/${propertyId}`;
        const newImages = await Promise.all(
          files.map(async (file) => {
            const image = base64ToFile(file);
            return await uploadToCloudinary(
              image,
              import.meta.env.VITE_CLOUDINARY_UPLOAD_PROPERTY_PRESET,
              folderName
            );
          })
        );
        updatedData.images = [...(updatedData.images || []), ...newImages];
      }

      // Update the document in Firestore
      await updateDoc(propertyRef, {
        ...updatedData,
        lastUpdated: new Date(),
      });

      // Update local state
      commit("updateFirebaseProperty", { propertyId, updatedData });

      return true;
    } catch (error) {
      console.error("Error updating property:", error);
      throw error;
    } finally {
      commit("stopLoading", null, { root: true });
    }
  },
  async deleteProperty({ commit, rootState }, propertyId) {
    commit("startLoading", null, { root: true });
    try {
      const currentUser = rootState.auth.userDetails;
      if (!currentUser) {
        throw new Error("User not authenticated");
      }

      // Check if user is admin by role instead of collection
      if (currentUser.role === "admin") {
        const propertyRef = doc(db, "properties", propertyId);
        await deleteDoc(propertyRef);
        commit("deleteProperty", propertyId);
        return true;
      }

      // If not admin, check if they own the property
      const propertyRef = doc(db, "properties", propertyId);
      const propertyDoc = await getDoc(propertyRef);
      if (
        propertyDoc.exists() &&
        propertyDoc.data().ownerId === currentUser.uid
      ) {
        await deleteDoc(propertyRef);
        commit("deleteProperty", propertyId);
        return true;
      }

      throw new Error("You do not have permission to delete this property");
    } catch (error) {
      console.error("Error deleting property:", error);
      throw error;
    } finally {
      commit("stopLoading", null, { root: true });
    }
  },
};
