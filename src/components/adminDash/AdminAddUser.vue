<template>
  <div class="min-h-screen bg-gray-100 p-3 sm:p-4 md:p-8">
    <div
      class="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-md p-4 sm:p-6"
    >
      <h2 class="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Add New User</h2>

      <form @submit.prevent="handleSubmit" class="space-y-4 sm:space-y-6">
        <!-- Basic Information -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <!-- Form fields remain the same, just update their container classes -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700"
              >Full Name</label
            >
            <input
              v-model="formData.name"
              type="text"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
            />
          </div>

          <!-- Repeat similar changes for other input fields -->
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Nickname</label
            >
            <input
              v-model="formData.nickName"
              type="text"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Email</label>
            <input
              v-model="formData.email"
              type="email"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700"
              >National ID</label
            >
            <input
              v-model="formData.nationalId"
              type="text"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <p class="mt-1 text-sm text-gray-500">
              This will be used as the initial password
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Location</label
            >
            <input
              v-model="formData.location"
              type="text"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Gender</label
            >
            <select
              v-model="formData.gender"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Account Status</label
            >
            <div class="flex items-center mt-2">
              <button
                type="button"
                @click="formData.isActive = !formData.isActive"
                class="relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                :class="formData.isActive ? 'bg-blue-600' : 'bg-gray-200'"
              >
                <span
                  class="pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                  :class="formData.isActive ? 'translate-x-5' : 'translate-x-0'"
                ></span>
              </button>
              <span class="ml-3 text-sm font-medium text-gray-900">
                {{ formData.isActive ? "Active" : "Inactive" }}
              </span>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div
          class="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 mt-6"
        >
          <button
            type="button"
            @click="$router.push('/admin/users')"
            class="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {{ loading ? "Creating..." : "Create User" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
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

export default {
  data() {
    return {
      loading: false,
      formData: {
        name: "",
        nickName: "",
        email: "",
        nationalId: "",
        location: "",
        gender: "Male",
        role: "user",
        isActive: true,
        photo: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
        createdAt: null,
        updatedAt: null,
        freePropertyViewed: 0, // Add missing required fields
        paidProperties: [], // Add missing required fields
      },
    };
  },

  methods: {
    ...mapActions("users", ["createUser"]),

    validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    },
    // In your component's handleSubmit method
    // In your component's handleSubmit method
    async handleSubmit() {
      let secondaryApp = null;
      try {
        if (!this.validateEmail(this.formData.email)) {
          throw new Error("Please enter a valid email address");
        }

        if (!this.formData.nationalId || this.formData.nationalId.length < 6) {
          throw new Error("National ID must be at least 6 characters");
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
          this.formData.nationalId
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

        const userRef = doc(db, "users", newUserUid);
        await setDoc(userRef, userData);

        await Swal.fire({
          title: "Success",
          text: "User created successfully. Initial password is their National ID.",
          icon: "success",
        });

        await this.$store.dispatch("users/getUsers");
        this.$router.push("/admin/users");
      } catch (error) {
        console.error("Error creating user:", error);
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

    // Add this new action in your Vuex actions.js file
    // This is specifically for just creating the Firestore document
  },
};
</script>
