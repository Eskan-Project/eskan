import { db } from "@/config/firebase";
import { doc, setDoc } from "firebase/firestore";
import uploadToCloudinary from "@/services/uploadToCloudinary";

export default {
  async createProperty({ commit, state, rootState }, images) {
    commit("setLoading", { root: true });

    const propertyId = doc(db, "properties").id;
    let imagesUrl;
    if (images.length) {
      const folderName = `properties/${propertyId}`;
      imagesUrl = await Promise.all(
        images.map((image) => {
          uploadToCloudinary(
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
    };
    await setDoc(doc(db, "properties", propertyId), propertyData);

    commit("setLoading", { root: false });
  },
  updateImages({ commit }, images) {
    commit("updateImages", images);
  },
};
