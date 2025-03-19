<template>
  <main class="min-h-screen bg-gray-100 text-gray-900 pt-[86px] py-8">
    <div class="max-w-6xl mx-auto px-4">
      <section class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="relative h-48">
          <img
            class="h-full w-full object-cover"
            src="../assets/images/userProfileCoverPagePhoto.jpg"
            alt="Profile Cover"
            loading="lazy"
          />
          <div class="absolute inset-0 bg-[#053052]/80"></div>
        </div>

        <div class="relative px-6 pb-6 text-gray-900">
          <article class="flex flex-col sm:flex-row items-center">
            <figure class="-mt-16 relative">
              <img
                v-if="croppedImageSrc"
                :src="croppedImageSrc"
                alt="Profile"
                class="w-32 h-32 rounded-full border-4 border-white bg-white object-cover shadow-lg"
                loading="lazy"
              />
              <img
                v-else
                :src="userDetails?.photo || defaultPhoto"
                alt="Profile"
                class="w-32 h-32 rounded-full border-4 border-white bg-white object-cover shadow-lg"
                loading="lazy"
              />

              <div
                v-if="isEditing"
                class="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow cursor-pointer"
                @click="triggerFileInput"
              >
                <i class="bi bi-pencil-square text-xl"></i>
              </div>

              <input
                type="file"
                id="fileInput"
                class="hidden"
                accept="image/png, image/jpeg, image/jpg"
                @change="handleFileChange"
                ref="fileInput"
              />
            </figure>

            <div class="mt-6 sm:mt-0 sm:ml-6 text-center sm:text-left">
              <div class="flex flex-col md:space-x-6">
                <div class="w-full flex-grow">
                  <div v-if="isEditing">
                    <input
                      type="text"
                      v-model="userDetails.name"
                      class="w-full mt-2 lg:text-2xl md:text-1xl font-semibold text-gray-900 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div v-else>
                    <h1
                      class="text-3xl font-bold text-gray-900 whitespace-nowrap overflow-hidden text-ellipsis mt-2 capitalize"
                    >
                      {{ userDetails?.name || "No Name" }}
                    </h1>
                  </div>
                </div>

                <p class="text-sm mt-2 text-gray-600 flex items-center">
                  {{ userDetails?.email || "mariamsamuel111@gmail.com" }}
                </p>
              </div>
            </div>

            <button
              @click="toggleEdit"
              class="mt-6 sm:mt-0 sm:ml-auto px-4 py-2 bg-[#364365] text-white rounded-lg hover:bg-[#2a355e] shadow-md cursor-pointer"
            >
              {{ isEditing ? "Cancel" : "Edit Profile" }}
            </button>
          </article>
        </div>
      </section>

      <div
        v-if="showCropper"
        class="fixed inset-0 bg-[#053052]/80 flex items-center justify-center z-50"
      >
        <div class="bg-white p-4 rounded-lg shadow-lg w-[90%] max-w-lg">
          <h3 class="text-xl font-semibold mb-4">Crop Image</h3>
          <div class="cropper-container">
            <Cropper
              ref="cropper"
              class="w-full h-64 bg-gray-200"
              :src="croppedImageSrc"
              :stencil-props="{ aspectRatio: 1 }"
            />
          </div>
          <div class="flex justify-end mt-4 space-x-2">
            <button
              @click="applyCrop"
              class="cursor-pointer px-4 py-2 bg-[var(--secondary-color)] text-white rounded hover:bg-white hover:text-[var(--secondary-color)] border hover:border-[var(--secondary-color)]"
            >
              Apply
            </button>
            <button
              @click="cancelCrop"
              class="cursor-pointer px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      <div class="mt-8 grid grid-cols-1 md:grid-cols-1 gap-6">
        <section class="md:col-span-2">
          <article
            class="bg-white rounded-lg shadow-lg p-6 border border-gray-200"
          >
            <h2
              class="text-xl sm:text-2xl font-semibold mb-6 text-gray-700 border-b pb-3 flex items-center"
            >
              Personal Information
            </h2>

            <form @submit.prevent="saveProfile">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label
                    class="text-sm font-semibold text-gray-700 flex items-center mb-2"
                  >
                    National ID
                  </label>
                  <div v-if="isEditing">
                    <input
                      v-model="userDetails.nationalId"
                      type="text"
                      class="block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    />
                  </div>
                  <div
                    v-else
                    class="text-gray-900 bg-gray-100 px-4 py-2 rounded-lg shadow-md"
                  >
                    {{ userDetails?.nationalId || "Not specified" }}
                  </div>
                </div>

                <div>
                  <label
                    class="text-sm font-semibold text-gray-700 flex items-center mb-2"
                  >
                    Gender
                  </label>
                  <div v-if="isEditing">
                    <select
                      v-model="userDetails.gender"
                      class="block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    >
                      <option disabled value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div
                    v-else
                    class="text-gray-900 bg-gray-100 px-4 py-2 rounded-lg shadow-md"
                  >
                    {{ userDetails?.gender || "Not specified" }}
                  </div>
                </div>

                <div>
                  <label
                    class="text-sm font-semibold text-gray-700 flex items-center mb-2"
                  >
                    Address
                  </label>
                  <div v-if="isEditing">
                    <input
                      v-model="userDetails.address"
                      type="text"
                      class="capitalize block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    />
                  </div>
                  <div
                    v-else
                    class="text-gray-900 bg-gray-100 px-4 py-2 rounded-lg shadow-md"
                  >
                    {{ userDetails?.address || "Not specified" }}
                  </div>
                </div>

                <div>
                  <label
                    class="text-sm font-semibold text-gray-700 flex items-center mb-2"
                  >
                    Phone Number
                  </label>
                  <div v-if="isEditing">
                    <input
                      v-model="userDetails.phone"
                      type="text"
                      class="block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    />
                  </div>
                  <div
                    v-else
                    class="text-gray-900 bg-gray-100 px-4 py-2 rounded-lg shadow-md"
                  >
                    {{ userDetails?.phone || "Not specified" }}
                  </div>
                </div>
              </div>

              <button
                v-if="isEditing"
                type="submit"
                class="cursor-pointer mt-6 w-full md:w-auto px-6 py-2 bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold rounded-lg hover:shadow-lg transition-transform transform hover:scale-105"
              >
                Save Profile
              </button>
            </form>
          </article>
        </section>
      </div>
    </div>

    <div class="max-w-6xl mx-auto p-6">
      <h2 class="text-2xl font-bold text-gray-800 mb-4">My Properties</h2>

      <p v-if="loading" class="text-gray-600">Loading properties...</p>

      <p
        v-else-if="allProperties && allProperties.length === 0"
        class="text-gray-600"
      >
        You have not added any properties yet.
      </p>

      <div
        v-else-if="allProperties && allProperties.length > 0"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <div
          v-for="property in allProperties"
          :key="property.id"
          class="bg-white shadow-md rounded-lg p-4"
        >
          <img
            v-if="property.images?.length"
            :src="property.images[0]"
            alt="Property Image"
            class="w-full h-40 object-cover rounded-md mb-3"
          />
          <h4 class="text-lg font-bold">{{ property.title }}</h4>
          <p class="text-gray-600">
            {{ property.city }}, {{ property.governorate }}
          </p>
          <p class="text-gray-700">
            Price: <span class="font-semibold">${{ property.price }}</span>
          </p>
          <p class="text-gray-700">
            Rooms: <span class="font-semibold">{{ property.rooms }}</span>
          </p>

          <p
            class="text-sm font-medium mt-2 px-3 py-1 inline-block rounded-lg"
            :class="getStatusClass(property.status)"
          >
            {{ property.status }} ({{ property.collection }})
          </p>

          <button
            v-if="!property.isPaid && property.status === 'approved'"
            @click="goToPaymentPage(property)"
            class="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
          >
            Pay Now
          </button>
        </div>
      </div>
    </div>
  </main>
</template>
<script>
import { mapState, mapActions } from "vuex";
import uploadToCloudinary from "../services/uploadToCloudinary";
import { Cropper } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";
import base64ToFile from "../services/base64ToFileService";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

export default {
  name: "ProfileProperties",
  components: {
    Cropper,
  },
  data() {
    return {
      isEditing: false,
      selectedFile: null,
      showCropper: false,
      croppedImageSrc: null,
      croppedImageFile: null,
      properties: [],
      allProperties: [],
      loading: true,
    };
  },
  mounted() {
    this.fetchUserDetails();
    this.fetchAllProperties();
  },
  computed: {
    ...mapState("auth", ["userDetails"]),
    isPaid() {
      return this.userDetails?.paidProperties?.includes(this.id);
    },
  },
  methods: {
    ...mapActions("auth", ["fetchUserDetails", "updateProfile"]),
    ...mapActions(["startLoading", "stopLoading"]),
    toggleEdit() {
      this.isEditing = !this.isEditing;
      this.croppedImageSrc = null;
    },
    async saveProfile() {
      this.startLoading();
      try {
        if (this.croppedImageFile) {
          const folderName = `${this.userDetails.name
            .toLowerCase()
            .replace(/\s+/g, "-")}-profile`;
          const uploadImgUrl = await uploadToCloudinary(
            this.croppedImageFile,
            this.userDetails.role === "owner"
              ? import.meta.env.VITE_CLOUDINARY_UPLOAD_OWNER_PRESET
              : import.meta.env.VITE_CLOUDINARY_UPLOAD_USER_PRESET,
            folderName
          );
          this.userDetails.photo = uploadImgUrl;
        }
        await this.updateProfile();
        this.isEditing = false;
        toast.success("Profile updated successfully", {
          duration: 3000,
          position: "top-left",
          transition: "slide",
        });
      } catch (error) {
        console.log(error);
        toast.error("Failed to update profile", {
          duration: 3000,
          position: "top-left",
          transition: "slide",
        });
      } finally {
        this.stopLoading();
      }
    },
    handleFileChange(event) {
      this.selectedFile = event.target.files[0];
      if (this.selectedFile) {
        const reader = new FileReader();
        reader.readAsDataURL(this.selectedFile);
        reader.onload = () => {
          this.croppedImageSrc = reader.result;
          this.showCropper = true;
        };
      }
    },
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    cancelCrop() {
      this.showCropper = false;
    },
    applyCrop() {
      const result = this.$refs.cropper.getResult();
      if (result?.canvas) {
        result.canvas.toBlob((blob) => {
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = () => {
            this.croppedImageSrc = reader.result;
            const file = base64ToFile(this.croppedImageSrc);
            this.croppedImageFile = file;
            console.log(file);
            this.showCropper = false;
          };
        }, "image/png");
      }
    },
    async fetchRequests() {
      try {
        const requestsCollection = collection(db, "requests");
        const q = query(
          requestsCollection,
          where("ownerId", "==", this.userDetails.uid)
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          collection: "requests",
        }));
      } catch (error) {
        console.error("Error fetching requests:", error);
        return [];
      }
    },
    async fetchProperties() {
      try {
        const propertiesCollection = collection(db, "properties");
        const q = query(
          propertiesCollection,
          where("ownerId", "==", this.userDetails.uid)
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          collection: "properties",
          isPaid: doc.data().isPaid || false,
        }));
      } catch (error) {
        console.error("Error fetching properties:", error);
        return [];
      }
    },
    async fetchAllProperties() {
      this.startLoading();
      try {
        const requests = await this.fetchRequests();
        const properties = await this.fetchProperties();
        this.allProperties = [...requests, ...properties];
        console.log("All properties:", this.allProperties);
      } catch (error) {
        console.error("Error fetching all properties:", error);
        toast.error("Failed to fetch properties.", {
          duration: 3000,
          position: "top-left",
          transition: "slide",
        });
      } finally {
        this.stopLoading();
        this.loading = false;
      }
    },
    getStatusClass(status) {
      switch (status) {
        case "pending":
          return "bg-yellow-100 text-yellow-700";
        case "approved":
          return "bg-green-100 text-green-700";
        case "rejected":
          return "bg-red-100 text-red-700";
        default:
          return "bg-gray-100 text-gray-700";
      }
    },
    goToPaymentPage(property) {
      localStorage.setItem("property", JSON.stringify(property));
      window.location.href = `/payment?propertyId=${property.id}`;
    },
    async handlePayment(propertyId) {
      try {
        const propertyRef = doc(db, "properties", propertyId);
        await updateDoc(propertyRef, {
          isPaid: true,
        });
        toast.success("Payment successful!", {
          duration: 3000,
          position: "top left",
          transition: "slide",
        });
        this.fetchAllProperties();
      } catch (error) {
        console.error("Error processing payment:", error);
        toast.error("Payment failed!", {
          duration: 3000,
          position: "top-left",
          transition: "slide",
        });
      }
    },
  },
};
</script>
