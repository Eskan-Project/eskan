import { db } from "@/config/firebase";
import { doc, setDoc, collection } from "firebase/firestore";
import uploadToCloudinary from "@/services/uploadToCloudinary";
import base64ToFile from "@/services/base64ToFileService";

export default {
  async createProperty(
    { commit, state, rootState, dispatch },
    { files = [], role = "owner" } = {}
  ) {
    commit("setLoading", true, { root: true });
    try {
      let collectionName = "requests";
      if (role === "admin") {
        collectionName = "properties";
      }
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
      const { propertyDetails, propertyContact } = state;
      const ownerId = rootState.auth.userDetails.uid;
      const propertyData = {
        ...propertyDetails,
        ...propertyContact,
        images: imagesUrl,
        ownerId,
        createdAt: new Date(),
        status: "pending",
      };
      const propertyRef = await setDoc(
        doc(db, collectionName, propertyId),
        propertyData
      );
      if (role !== "admin") {
        dispatch(
          "notifications/addNotification",
          `Your property ${propertyDetails.title} is under review.`,
          {
            root: true,
          }
        );
      }
    } catch (error) {
      console.log(error);
    } finally {
      commit("setLoading", false, { root: true });
    }
  },
  updateImages({ commit }, images) {
    commit("updateImages", images);
  },
};
