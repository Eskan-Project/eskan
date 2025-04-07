<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900 p-3 sm:p-4 md:p-8">
    <div
      class="w-full max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6"
    >
      <h2
        class="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-700 dark:text-white"
      >
        Add New Owner
      </h2>

      <form @submit.prevent="handleSubmit" class="space-y-4 sm:space-y-6">
        <!-- Basic Information -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <!-- Form fields remain the same, just update their container classes -->
          <div class="space-y-2">
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >Full Name</label
            >
            <input
              v-model="formData.name"
              type="text"
              required
              class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm sm:text-base"
            />
          </div>

          <!-- Repeat similar changes for other input fields -->
          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >Nickname</label
            >
            <input
              v-model="formData.nickName"
              type="text"
              required
              class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >Email</label
            >
            <input
              v-model="formData.email"
              type="email"
              required
              class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <!-- Update this part in the National ID field -->
          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >National ID</label
            >
            <input
              v-model="formData.nationalId"
              type="text"
              required
              class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              For identification purposes only
            </p>
          </div>

          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >Location</label
            >
            <input
              v-model="formData.location"
              type="text"
              required
              class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >Gender</label
            >
            <select
              v-model="formData.gender"
              required
              class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >Account Status</label
            >
            <div class="flex items-center mt-2">
              <button
                type="button"
                @click="formData.isActive = !formData.isActive"
                class="relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                :class="
                  formData.isActive
                    ? 'bg-blue-600'
                    : 'bg-gray-200 dark:bg-gray-600'
                "
              >
                <span
                  class="pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                  :class="formData.isActive ? 'translate-x-5' : 'translate-x-0'"
                ></span>
              </button>
              <span
                class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-200"
              >
                {{ formData.isActive ? "Active" : "Inactive" }}
              </span>
            </div>
          </div>

          <!-- Add this inside the grid div, after the other form fields -->
          <div class="col-span-full">
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >National ID Image</label
            >
            <div class="mt-2 flex items-center gap-x-3">
              <img
                v-if="formData.idImage"
                :src="formData.idImage"
                alt="ID Preview"
                class="h-32 w-auto object-cover rounded-lg border dark:border-gray-600"
              />
              <input
                type="file"
                accept="image/*"
                @change="handleIdImageUpload"
                class="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 dark:file:bg-blue-900 dark:file:text-blue-200 hover:file:bg-blue-100 dark:hover:file:bg-blue-800"
              />
            </div>
            <p v-if="imageError" class="mt-1 text-sm text-red-500">
              {{ imageError }}
            </p>
          </div>
        </div>

        <!-- Action Buttons -->
        <div
          class="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 mt-6"
        >
          <button
            type="button"
            @click="$router.push('/admin')"
            class="cursor-pointer w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="cursor-pointer w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {{ loading ? "Creating..." : "Create User" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
// Remove emailjs import
import axios from "axios"; // Add axios import if not already present

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};
import { initializeApp } from "firebase/app";
import { doc, getDoc, setDoc } from "firebase/firestore";

import { mapActions } from "vuex";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "@/config/firebase";
import { app } from "@/config/firebase";
import Swal from "sweetalert2";
// Remove emailjs.init

export default {
  data() {
    return {
      loading: false,
      imageError: "",
      password: "",
      formData: {
        createdAt: "",
        email: "",
        freePropertyViewed: 3,
        idImage:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSe3zbbTYJqLjRfhpuZY-h9aysJHFM29jfKzw&s",
        gender: "",
        isActive: true,
        location: "",
        name: "",
        nationalId: "",
        nickName: "",
        paidProperties: [],
        photo: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
        role: "owner",
        uid: "",
        updatedAt: "",
        createByAdmin: true,
      },
    };
  },

  methods: {
    ...mapActions("owners", ["createOwner"]),
    generateSecurePassword(length = 10) {
      const charset =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-+=";
      let generatedPassword = "";
      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        generatedPassword += charset[randomIndex];
      }
      this.password = generatedPassword;
      return generatedPassword;
    },
    validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    },
    // In your component's handleSubmit method
    async handleIdImageUpload(event) {
      this.imageError = "";
      const file = event.target.files[0];

      // Validate file
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith("image/")) {
        this.imageError = "Please upload an image file";
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.imageError = "Image must be less than 5MB";
        return;
      }

      // Read and preview the image
      const reader = new FileReader();
      reader.onload = (e) => {
        this.formData.idImage = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    async handleSubmit() {
      let secondaryApp = null;
      try {
        if (!this.validateEmail(this.formData.email)) {
          throw new Error("Please enter a valid email address");
        }

        if (!this.formData.nationalId || this.formData.nationalId.length < 14) {
          throw new Error("National ID must be at least 14 characters");
        }

        this.loading = true;

        // Get current admin user
        const adminAuth = auth.currentUser;
        if (!adminAuth) {
          throw new Error("Admin not authenticated");
        }

        // Create a secondary app instance
        const uniqueAppName = "secondaryApp-" + new Date().getTime();
        secondaryApp = initializeApp(firebaseConfig, uniqueAppName);
        const secondaryAuth = getAuth(secondaryApp);

        // Create the user with secondary app
        const userCredential = await createUserWithEmailAndPassword(
          secondaryAuth,
          this.formData.email.trim(),
          this.generateSecurePassword()
        );

        // Get the new user's UID
        const newUserUid = userCredential.user.uid;

        // Log out from secondary auth
        await signOut(secondaryAuth);

        // Prepare and save user data
        const userData = {
          ...this.formData,
          uid: newUserUid,
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: adminAuth.uid,
        };

        const userRef = doc(db, "owners", newUserUid);
        await setDoc(userRef, userData);

        // Replace EmailJS with server API call
        const emailData = {
          to_name: this.formData.name,
          user_email: this.formData.email,
          user_password: this.password,
          user_role: "Property Owner",
          message: `Your account has been created as a Property Owner. You can now list your properties on our platform.`,
        };

        const response = await axios.post(
          "http://localhost:3001/send-welcome-email",
          emailData
        );

        if (response.status !== 200) {
          throw new Error("Failed to send create email");
        }

        await Swal.fire({
          title: "Success",
          text: "Owner created successfully. Password Sent to Owner Email.",
          icon: "success",
        });

        await this.$store.dispatch("owners/getOwners");
        this.$router.push("/admin");
      } catch (error) {
        console.error("Error creating owner:", error);
        await Swal.fire({
          title: "Error",
          text: error.message,
          icon: "error",
        });
      } finally {
        // Properly delete the secondary app
        if (secondaryApp) {
          await secondaryApp.delete().catch(console.error);
        }
        this.loading = false;
      }
    },
  },
};
</script>
