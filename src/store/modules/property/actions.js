import { db } from "@/config/firebase";
import { doc, setDoc, collection } from "firebase/firestore";
import uploadToCloudinary from "@/services/uploadToCloudinary";
import base64ToFile from "@/services/base64ToFileService";

export default {
  async createProperty({ commit, state, rootState }, files) {
    commit("setLoading", true, { root: true });
    try {
      const propertyId = doc(collection(db, "requests")).id;
      let imagesUrl;
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
      await setDoc(doc(db, "requests", propertyId), propertyData);
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
