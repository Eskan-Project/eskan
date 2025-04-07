<template>
  <main
    class="min-h-screen bg-gray-100 dark:bg-[#111827] text-gray-900 dark:text-white pt-[86px] py-8"
  >
    <div class="max-w-6xl mx-auto px-4">
      <section
        class="bg-white dark:bg-[#1F2937] rounded-lg shadow-md overflow-hidden"
      >
        <div class="relative h-48">
          <img
            class="h-full w-full object-cover"
            src="../assets/images/userProfileCoverPagePhoto.jpg"
            :alt="$t('profile.title') + ' Cover'"
            loading="lazy"
          />
          <div class="absolute inset-0 bg-[#053052]/80"></div>
        </div>

        <div class="relative px-6 pb-6 text-gray-900 dark:text-white">
          <article class="flex flex-col sm:flex-row items-center">
            <figure class="-mt-16 relative">
              <img
                v-if="croppedImageSrc"
                :src="croppedImageSrc"
                :alt="$t('profile.title')"
                class="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 bg-white dark:bg-gray-800 object-cover shadow-lg"
                loading="lazy"
              />
              <img
                v-else
                :src="userDetails?.photo || defaultPhoto"
                :alt="$t('profile.title')"
                class="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 bg-white dark:bg-gray-800 object-cover shadow-lg"
                loading="lazy"
              />

              <div
                v-if="isEditing"
                class="absolute bottom-0 right-0 bg-white dark:bg-gray-700 p-2 rounded-full shadow cursor-pointer"
                @click="triggerFileInput"
              >
                <i class="bi bi-pencil-square text-xl dark:text-white"></i>
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
                      class="w-full mt-2 lg:text-2xl md:text-1xl font-semibold text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-[#3D8BFF] shadow-sm dark:bg-[#1F2937]"
                      :placeholder="$t('profile.name')"
                    />
                  </div>
                  <div v-else>
                    <h1
                      class="text-3xl font-bold text-gray-900 dark:text-white whitespace-nowrap overflow-hidden text-ellipsis mt-2 capitalize"
                    >
                      {{ userDetails?.name || "No Name" }}
                    </h1>
                  </div>
                </div>

                <p
                  class="text-sm mt-2 text-gray-600 dark:text-gray-300 flex items-center"
                >
                  {{ userDetails?.email || "mariamsamuel111@gmail.com" }}
                </p>
              </div>
            </div>

            <button
              @click="toggleEdit"
              class="mt-6 sm:mt-0 sm:ml-auto px-4 py-2 bg-[#364365] dark:bg-[#3D8BFF] text-white rounded-lg hover:bg-[#2a355e] dark:hover:bg-[#1F2937] dark:hover:text-[#3D8BFF] dark:hover:border dark:hover:border-[#3D8BFF] shadow-md cursor-pointer"
            >
              {{
                isEditing ? $t("profile.cancel") : $t("profile.edit_profile")
              }}
            </button>
          </article>
        </div>
      </section>

      <div
        v-if="showCropper"
        class="fixed inset-0 bg-[#053052]/80 flex items-center justify-center z-50"
      >
        <div
          class="bg-white dark:bg-[#1F2937] p-4 rounded-lg shadow-lg w-[90%] max-w-lg"
        >
          <h3 class="text-xl font-semibold mb-4 dark:text-white">
            {{ $t("profile.crop_image") }}
          </h3>
          <div class="cropper-container">
            <Cropper
              ref="cropper"
              class="w-full h-64 bg-gray-200 dark:bg-gray-700"
              :src="croppedImageSrc"
              :stencil-props="{ aspectRatio: 1 }"
            />
          </div>
          <div class="flex justify-end mt-4 space-x-2">
            <button
              @click="applyCrop"
              class="cursor-pointer px-4 py-2 bg-[var(--secondary-color)] dark:bg-[#3D8BFF] text-white rounded hover:bg-white hover:text-[var(--secondary-color)] dark:hover:bg-[#1F2937] dark:hover:text-[#3D8BFF] border hover:border-[var(--secondary-color)] dark:hover:border-[#3D8BFF]"
            >
              {{ $t("profile.apply") }}
            </button>
            <button
              @click="cancelCrop"
              class="cursor-pointer px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 dark:bg-gray-600 dark:hover:bg-gray-700"
            >
              {{ $t("profile.cancel_crop") }}
            </button>
          </div>
        </div>
      </div>

      <div class="mt-8 grid grid-cols-1 md:grid-cols-1 gap-6">
        <section class="md:col-span-2">
          <article
            class="bg-white dark:bg-[#1F2937] rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700"
          >
            <h2
              class="text-xl sm:text-2xl font-semibold mb-6 text-gray-700 dark:text-white border-b dark:border-gray-700 pb-3 flex items-center"
            >
              {{ $t("profile.personal_information") }}
            </h2>

            <form @submit.prevent="saveProfile">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label
                    class="text-sm font-semibold text-gray-700 dark:text-white flex items-center mb-2"
                  >
                    {{ $t("profile.national_id") }}
                  </label>
                  <div v-if="isEditing">
                    <input
                      v-model="userDetails.nationalId"
                      type="text"
                      class="block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 bg-white dark:bg-[#1F2937] dark:text-white focus:ring-2 focus:ring-blue-400 dark:focus:ring-[#3D8BFF] focus:outline-none"
                    />
                  </div>
                  <div
                    v-else
                    class="text-gray-900 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg shadow-md"
                  >
                    {{ userDetails?.nationalId || $t("profile.not_specified") }}
                  </div>
                </div>

                <div>
                  <label
                    class="text-sm font-semibold text-gray-700 dark:text-white flex items-center mb-2"
                  >
                    {{ $t("profile.gender") }}
                  </label>
                  <div v-if="isEditing">
                    <select
                      v-model="userDetails.gender"
                      class="block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 bg-white dark:bg-[#1F2937] dark:text-white focus:ring-2 focus:ring-blue-400 dark:focus:ring-[#3D8BFF] focus:outline-none"
                    >
                      <option disabled value="">
                        {{ $t("profile.not_specified") }}
                      </option>
                      <option value="Male">{{ $t("profile.male") }}</option>
                      <option value="Female">{{ $t("profile.female") }}</option>
                    </select>
                  </div>
                  <div
                    v-else
                    class="text-gray-900 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg shadow-md"
                  >
                    {{ userDetails?.gender || $t("profile.not_specified") }}
                  </div>
                </div>

                <div>
                  <label
                    class="text-sm font-semibold text-gray-700 dark:text-white flex items-center mb-2"
                  >
                    {{ $t("profile.address") }}
                  </label>
                  <div v-if="isEditing">
                    <input
                      v-model="userDetails.address"
                      type="text"
                      class="capitalize block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 bg-white dark:bg-[#1F2937] dark:text-white focus:ring-2 focus:ring-blue-400 dark:focus:ring-[#3D8BFF] focus:outline-none"
                    />
                  </div>
                  <div
                    v-else
                    class="text-gray-900 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg shadow-md"
                  >
                    {{ userDetails?.address || $t("profile.not_specified") }}
                  </div>
                </div>

                <div>
                  <label
                    class="text-sm font-semibold text-gray-700 dark:text-white flex items-center mb-2"
                  >
                    {{ $t("profile.phone") }}
                  </label>
                  <div v-if="isEditing">
                    <input
                      v-model="userDetails.phone"
                      type="text"
                      class="block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 bg-white dark:bg-[#1F2937] dark:text-white focus:ring-2 focus:ring-blue-400 dark:focus:ring-[#3D8BFF] focus:outline-none"
                    />
                  </div>
                  <div
                    v-else
                    class="text-gray-900 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg shadow-md"
                  >
                    {{ userDetails?.phone || $t("profile.not_specified") }}
                  </div>
                </div>
              </div>

              <button
                v-if="isEditing"
                type="submit"
                class="cursor-pointer mt-6 w-full md:w-auto px-6 py-2 bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold rounded-lg hover:shadow-lg transition-transform transform hover:scale-105"
              >
                {{ $t("profile.save_profile") }}
              </button>
            </form>
          </article>
        </section>
      </div>
    </div>
    <div v-if="userDetails?.role !== 'user'" class="max-w-6xl mx-auto p-6">
      <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-4">
        {{ $t("profile.my_properties") }}
      </h2>

      <p v-if="loading" class="text-gray-600 dark:text-gray-300">
        {{ $t("profile.loading_properties") }}
      </p>

      <p
        v-else-if="allProperties && allProperties.length === 0"
        class="text-gray-600 dark:text-gray-300"
      >
        {{ $t("profile.no_properties") }}
      </p>

      <div
        v-else-if="allProperties && allProperties.length > 0"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <div
          v-for="property in allProperties"
          :key="property.id"
          class="bg-white dark:bg-[#1F2937] shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
        >
          <div class="relative">
            <img
              v-if="property.images?.length"
              :src="property.images[0]"
              alt="Property Image"
              class="w-full h-48 object-cover"
              loading="lazy"
            />
            <div
              v-else
              class="w-full h-48 bg-gray-300 dark:bg-gray-700 flex items-center justify-center"
            >
              <i
                class="bi bi-building text-4xl text-gray-500 dark:text-gray-400"
              ></i>
            </div>
            <div class="absolute top-2 right-2">
              <span
                :class="[
                  'text-xs font-bold px-2 py-1 rounded-full shadow',
                  property.status === 'approved'
                    ? 'bg-green-500 text-white'
                    : property.status === 'pending'
                    ? 'bg-yellow-500 text-white'
                    : property.status === 'completed'
                    ? 'bg-blue-500 text-white'
                    : 'bg-red-500 text-white',
                ]"
              >
                {{ $t(`profile.property_status.${property.status}`) }}
              </span>
            </div>
          </div>

          <div class="p-4">
            <h4
              class="text-xl font-bold text-gray-800 dark:text-white truncate capitalize text-center mb-4"
            >
              {{ property.title }}
            </h4>

            <div
              class="flex items-center text-gray-600 dark:text-gray-300 mb-2"
            >
              <i class="bi bi-geo-alt mr-1"></i>
              <span class="truncate"
                >{{ getCityName(property) }},
                {{ getGovernorateName(property) }}</span
              >
            </div>

            <div class="grid grid-cols-2 gap-2 mb-3 ml-1">
              <div class="flex items-center">
                <span class="font-semibold dark:text-white"
                  >{{ formattedPrice(property.price) }}
                  {{ $t("profile.currency") }}</span
                >
              </div>
              <div class="flex items-center text-gray-600 dark:text-gray-300">
                <i
                  class="bi bi-door-open mr-1 text-blue-500 dark:text-[#3D8BFF]"
                ></i>
                <span>
                  {{
                    property.rooms > 1
                      ? property.rooms + " " + $t("profile.select_rooms")
                      : $t("profile.select_room")
                  }}</span
                >
              </div>
            </div>

            <div
              v-if="property.isPaid"
              class="flex flex-wrap gap-2 border-t dark:border-gray-700 pt-3 mt-2"
            >
              <span
                v-if="property.isPaid"
                class="text-xs font-medium px-2 py-1 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 flex items-center"
              >
                <i class="bi bi-check-circle-fill mr-1"></i>
                {{ $t("profile.paid") }}
              </span>
            </div>

            <button
              v-if="!property.isPaid && property.status === 'approved'"
              @click="goToPaymentPage(property)"
              class="mt-3 w-full bg-blue-600 dark:bg-[#3D8BFF] hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
            >
              <i class="bi bi-credit-card mr-2"></i> {{ $t("profile.pay_now") }}
            </button>
          </div>
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
import governorates from "@/assets/data/governorates.json";
import cities from "@/assets/data/cities.json";

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
      defaultPhoto: "path/to/default-photo.jpg",
      language: this.$i18n.locale,
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
        toast.success(this.$t("profile.success"), {
          duration: 3000,
          position: "top-left",
          transition: "slide",
        });
      } catch (error) {
        console.log(error);
        toast.error(this.$t("profile.error"), {
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
        toast.error(this.$t("profile.error_properties"), {
          duration: 3000,
          position: "top-left",
          transition: "slide",
        });
      } finally {
        this.stopLoading();
        this.loading = false;
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
        toast.success(this.$t("profile.payment_success"), {
          duration: 3000,
          position: "top-left",
          transition: "slide",
        });
        this.fetchAllProperties();
      } catch (error) {
        console.error("Error processing payment:", error);
        toast.error(this.$t("profile.payment_error"), {
          duration: 3000,
          position: "top-left",
          transition: "slide",
        });
      }
    },
    formattedPrice(price) {
      if (typeof price !== "number" && isNaN(Number(price))) {
        return price;
      }
      const locale = this.$i18n.locale === "ar" ? "ar-EG" : "en-US";
      return new Intl.NumberFormat(locale, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(price);
    },
    getCityName(property) {
      const city = cities.find((c) => c.id === property.city);
      return (
        (city
          ? this.$i18n.locale === "ar"
            ? city.city_name_ar
            : city.city_name_en
          : null) ||
        property.city ||
        "Unknown city"
      );
    },
    getGovernorateName(property) {
      const governorate = governorates.find(
        (g) => g.id === property.governorate
      );
      return (
        (governorate
          ? this.$i18n.locale === "ar"
            ? governorate.governorate_name_ar
            : governorate.governorate_name_en
          : null) ||
        property.governorate ||
        "Unknown governorate"
      );
    },
  },
};
</script>
