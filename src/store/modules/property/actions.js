import { db } from "@/config/firebase";
import {
  doc,
  setDoc,
  collection,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";
import uploadToCloudinary from "@/services/uploadToCloudinary";
import base64ToFile from "@/services/base64ToFileService";

export default {
  async getProperties({ commit, dispatch, rootState }) {
    commit("startLoading", null, { root: true });
    try {
      await dispatch("checkPropertyExpiration");
      const propertiesSnapshot = await getDocs(collection(db, "properties"));
      const userDetails = rootState.auth.userDetails;
      const userRole = userDetails.role;
      let properties;
      if (userRole != "admin") {
        properties = propertiesSnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter(
            (property) => property.status === "completed" && property.isPaid
          );
      } else {
        properties = propertiesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      }

      commit("setProperties", properties);
      return properties;
    } catch (error) {
      console.error("Error fetching properties:", error);
      commit("setProperties", []);
      throw error; // Changed from return [] to throw error
    } finally {
      commit("stopLoading", null, { root: true });
    }
  },

  async createProperty({ commit, state, rootState, dispatch }, files) {
    commit("startLoading", null, { root: true });
    try {
      const userDetails = rootState.auth.userDetails;
      if (!userDetails?.uid) {
        throw new Error("User not authenticated");
      }

      const userRole = userDetails.role || "owner";
      const collectionName = userRole === "admin" ? "properties" : "requests";
      const propertyId = doc(collection(db, collectionName)).id;

      const imagesUrl = files.length
        ? await Promise.all(
            files.map(async (file) => {
              const image = base64ToFile(file);
              return uploadToCloudinary(
                image,
                import.meta.env.VITE_CLOUDINARY_UPLOAD_PROPERTY_PRESET,
                `requests/${propertyId}`
              );
            })
          )
        : [];

      // Process contract image if exists
      let contractImageUrl = "";
      if (
        state.propertyDetails.propertyContact?.contract &&
        state.propertyDetails.propertyContact.contract.startsWith("data:image")
      ) {
        try {
          const contractImage = base64ToFile(
            state.propertyDetails.propertyContact.contract
          );
          contractImageUrl = await uploadToCloudinary(
            contractImage,
            import.meta.env.VITE_CLOUDINARY_UPLOAD_PROPERTY_PRESET,
            `requests/${propertyId}/contracts`
          );
        } catch (error) {
          console.error("Error uploading contract image:", error);
          // Continue even if contract upload fails
        }
      }

      // Create a deep copy of the property details
      const propertyDetailsClone = JSON.parse(
        JSON.stringify(state.propertyDetails)
      );

      // Update contract with Cloudinary URL if successful
      if (contractImageUrl) {
        propertyDetailsClone.propertyContact.contract = contractImageUrl;
      }

      const propertyData = {
        ...propertyDetailsClone,
        images: imagesUrl,
        ownerId: userDetails.uid,
        createdAt: new Date(),
        status: userRole === "admin" ? "completed" : "pending",
        approvedAt: userRole === "admin" ? new Date() : "",
        approvedBy: userRole === "admin" ? userDetails.uid : "",
        isPaid: userRole === "admin" ? true : false,
        expiresAt:
          userRole === "admin" ? new Date(Date.now() + 5 * 60 * 1000) : "", // 5 minutes
      };

      await setDoc(doc(db, collectionName, propertyId), propertyData);

      if (userRole !== "admin") {
        await dispatch(
          "notifications/addNotification",
          {
            message: `Your property ${propertyData.title} is under review.`,
            type: "info",
          },
          { root: true }
        );
      }

      return propertyId;
    } catch (error) {
      console.error("Error creating property:", error);
      throw error;
    } finally {
      commit("stopLoading", null, { root: true });
      localStorage.removeItem("propertyDetails");
      localStorage.removeItem("propertyImages");
    }
  },

  async getProperty({ commit }, title) {
    commit("startLoading", null, { root: true });
    try {
      // Get all properties
      const propertiesSnapshot = await getDocs(collection(db, "properties"));

      // Find the property with matching title (case insensitive)
      const propertyDoc = propertiesSnapshot.docs.find((doc) => {
        const data = doc.data();
        return data.title && data.title.toLowerCase() === title.toLowerCase();
      });

      if (!propertyDoc) {
        throw new Error("Property not found");
      }

      const property = {
        id: propertyDoc.id,
        ...propertyDoc.data(),
      };

      commit("setProperty", property);
      return property;
    } catch (error) {
      console.error("Error fetching property:", error);
      throw error;
    } finally {
      commit("stopLoading", null, { root: true });
    }
  },

  async updateProperty(
    { commit, rootState },
    { propertyId, updatedData, files = [] }
  ) {
    commit("startLoading", null, { root: true });
    try {
      const currentUser = rootState.auth.userDetails;
      if (!currentUser?.uid) throw new Error("User not authenticated");

      const propertyRef = doc(db, "properties", propertyId);
      const propertyDoc = await getDoc(propertyRef);
      if (!propertyDoc.exists()) throw new Error("Property not found");

      const existingData = propertyDoc.data();
      if (
        existingData.ownerId !== currentUser.uid &&
        currentUser.role !== "admin"
      ) {
        throw new Error("Unauthorized to update this property");
      }

      let newImages = [];
      if (files.length) {
        newImages = await Promise.all(
          files.map((file) =>
            uploadToCloudinary(
              file,
              import.meta.env.VITE_CLOUDINARY_UPLOAD_PROPERTY_PRESET,
              `properties/${propertyId}`
            )
          )
        );
      }

      // Process contract image if exists and it's a data URL
      let updatedDataClone = { ...updatedData };
      if (
        updatedData.propertyContact?.contract &&
        updatedData.propertyContact.contract.startsWith("data:image")
      ) {
        try {
          const contractImage = base64ToFile(
            updatedData.propertyContact.contract
          );
          const contractImageUrl = await uploadToCloudinary(
            contractImage,
            import.meta.env.VITE_CLOUDINARY_UPLOAD_PROPERTY_PRESET,
            `properties/${propertyId}/contracts`
          );

          // Create a deep copy and update contract with Cloudinary URL
          updatedDataClone = JSON.parse(JSON.stringify(updatedData));
          updatedDataClone.propertyContact.contract = contractImageUrl;
        } catch (error) {
          console.error("Error uploading contract image:", error);
          // Continue even if contract upload fails
        }
      }

      const cleanedData = Object.fromEntries(
        Object.entries(updatedDataClone)
          .filter(([_, value]) => value !== undefined && value !== null)
          .map(([key, value]) => [
            key,
            typeof value === "object" && !Array.isArray(value)
              ? Object.fromEntries(
                  Object.entries(value).filter(
                    ([_, v]) => v !== undefined && v !== null
                  )
                )
              : value,
          ])
      );

      const finalData = {
        ...cleanedData,
        images: newImages.length
          ? [...(existingData.images || []), ...newImages]
          : cleanedData.images || existingData.images,
        lastUpdated: new Date().toISOString(),
        updatedBy: currentUser.uid,
      };

      await updateDoc(propertyRef, finalData);
      commit("updateFirebaseProperty", { propertyId, updatedData: finalData });
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
      if (!currentUser?.uid) throw new Error("User not authenticated");

      const propertyRef = doc(db, "properties", propertyId);
      const propertyDoc = await getDoc(propertyRef);
      if (!propertyDoc.exists()) throw new Error("Property not found");

      const propertyData = propertyDoc.data();
      if (
        propertyData.ownerId !== currentUser.uid &&
        currentUser.role !== "admin"
      ) {
        throw new Error("Unauthorized to delete this property");
      }

      await deleteDoc(propertyRef);
      commit("deleteProperty", propertyId);
      return true;
    } catch (error) {
      console.error("Error deleting property:", error);
      throw error;
    } finally {
      commit("stopLoading", null, { root: true });
    }
  },

  async handlePayment({ commit, dispatch, rootState }, propertyId) {
    commit("startLoading", null, { root: true });
    try {
      const currentUser = rootState.auth.userDetails;
      if (!currentUser?.uid) throw new Error("User not authenticated");

      const propertyRef = doc(db, "properties", propertyId);
      const propertyDoc = await getDoc(propertyRef);
      if (!propertyDoc.exists()) throw new Error("Property not found");

      const propertyData = propertyDoc.data();
      if (propertyData.ownerId !== currentUser.uid) {
        throw new Error("Unauthorized to pay for this property");
      }

      const paymentId = doc(collection(db, "payments")).id;
      const paymentData = {
        propertyId,
        amount: propertyData.price,
        userId: currentUser.uid,
        userName: currentUser.name,
        userEmail: currentUser.email,
        userPhoto: currentUser.photo,
        createdAt: new Date(),
      };
      await Promise.all([
        setDoc(doc(db, "payments", paymentId), paymentData),
        updateDoc(propertyRef, {
          isPaid: true,
          paymentId,
          paymentDate: new Date(),
          status: "completed",
          expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        }),
      ]);

      await dispatch(
        "auth/addPaidProperty",
        { uid: currentUser.uid, propertyId, role: currentUser.role },
        { root: true }
      );

      return paymentId;
    } catch (error) {
      console.error("Error handling payment:", error);
      throw error;
    } finally {
      commit("stopLoading", null, { root: true });
    }
  },

  async createPropertyFromRequest({ commit, rootState }, requestData) {
    commit("startLoading", null, { root: true });
    try {
      const userDetails = rootState.auth.userDetails;
      if (!userDetails?.uid) throw new Error("User not authenticated");
      if (userDetails.role !== "admin")
        throw new Error("Admin access required");

      const propertyId = doc(collection(db, "properties")).id;
      const propertyData = {
        ...requestData,
        status: "approved",
        approvedBy: userDetails.uid,
        isPaid: false,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
      };

      delete propertyData.id; // Remove request ID
      await setDoc(doc(db, "properties", propertyId), propertyData);
      return propertyId;
    } catch (error) {
      console.error("Error creating property from request:", error);
      throw error;
    } finally {
      commit("stopLoading", null, { root: true });
    }
  },

  async checkPropertyExpiration() {
    try {
      console.log("Running property expiration check...");
      const propertiesSnapshot = await getDocs(collection(db, "properties"));
      const currentTime = Date.now();

      let updateCount = 0;
      await Promise.all(
        propertiesSnapshot.docs.map(async (docSnap) => {
          try {
            const property = docSnap.data();
            const propertyId = docSnap.id;

            if (property.status === "expired") {
              return;
            }

            let expirationDate = null;

            if (property.expiresAt) {
              if (property.expiresAt instanceof Timestamp) {
                expirationDate = property.expiresAt.toDate();
              } else if (property.expiresAt instanceof Date) {
                expirationDate = property.expiresAt;
              } else if (
                property.expiresAt.seconds &&
                property.expiresAt.nanoseconds
              ) {
                expirationDate = new Timestamp(
                  property.expiresAt.seconds,
                  property.expiresAt.nanoseconds
                ).toDate();
              } else if (typeof property.expiresAt === "string") {
                expirationDate = new Date(property.expiresAt);
              } else if (typeof property.expiresAt.toDate === "function") {
                expirationDate = property.expiresAt.toDate();
              }

              console.log(
                `Property ${propertyId}: Expiration date is ${expirationDate}, Type: ${typeof property.expiresAt}`
              );

              if (expirationDate && expirationDate.getTime() < currentTime) {
                console.log(
                  `Property ${propertyId}: Expired! Updating status...`
                );
                await updateDoc(docSnap.ref, {
                  status: "expired",
                  lastUpdated: new Date(),
                });
                updateCount++;
                console.log(
                  `Property ${propertyId}: Successfully marked as expired.`
                );
              }
            } else {
              console.log(`Property ${propertyId}: No expiration date found.`);
            }
          } catch (error) {
            console.error(
              `Error checking expiration for property ${docSnap.id}:`,
              error
            );
          }
        })
      );

      console.log(
        `Expiration check completed. ${updateCount} properties were marked as expired.`
      );
      return updateCount;
    } catch (error) {
      console.error("Error in checkPropertyExpiration:", error);
    }
  },
};
