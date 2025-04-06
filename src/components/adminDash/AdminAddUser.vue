<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900 p-3 sm:p-4 md:p-8">
    <div
      class="w-full max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6"
    >
      <h2 class="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 dark:text-white">
        Add New User
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
        </div>

        <!-- Action Buttons -->
        <div
          class="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 mt-6"
        >
          <button
            type="button"
            @click="$router.push('/admin/users')"
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
import emailjs from "emailjs-com";
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
} from "firebase/auth";
import { auth, db } from "@/config/firebase";
import { app } from "@/config/firebase";
import Swal from "sweetalert2";
emailjs.init("aQTbmvnAXB72PTixL");
export default {
  data() {
    return {
      loading: false,
      password: "",
      formData: {
        name: "",
        email: "",
        nationalId: "",
        location: "",
        gender: "Male",
        role: "user",
        isActive: false,
        photo: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
        createdAt: null,
        updatedAt: null,
        freeViewsRemaining: 3,
        freePropertyViewed: 0, // Add missing required fields
        paidProperties: [], // Add missing required fields
      },
    };
  },

  methods: {
    ...mapActions("users", ["createUser"]),
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

        const adminAuth = auth.currentUser;
        if (!adminAuth) {
          throw new Error("Admin not authenticated");
        }

        // Check admin permissions first
        const adminDoc = await getDoc(doc(db, "owners", adminAuth.uid));
        if (!adminDoc.exists() || adminDoc.data().role !== "admin") {
          throw new Error("Insufficient permissions to create users");
        }

        const uniqueAppName = "secondaryApp-" + new Date().getTime();
        secondaryApp = initializeApp(firebaseConfig, uniqueAppName);
        const secondaryAuth = getAuth(secondaryApp);

        // Create user account
        const userCredential = await createUserWithEmailAndPassword(
          secondaryAuth,
          this.formData.email.trim(),
          this.generateSecurePassword()
        );

        // Sign out immediately
        await signOut(secondaryAuth);

        // Prepare user data
        const userData = {
          ...this.formData,
          uid: userCredential.user.uid,
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: adminAuth.uid,
          role: "user", // Ensure role is set
          isActive: true, // Set default active status
        };

        // Create user document using admin's auth context
        await setDoc(doc(db, "users", userCredential.user.uid), userData);
        const templateParams = {
          to_email: this.formData.email,
          to_name: this.formData.name,
          user_email: this.formData.email,
          user_password: this.password,
          user_role: "User", // Capitalize first letter
          message: `Your account has been created as an user . Please use the credentials below to log in.`,
        };
        try {
          const serviceID = import.meta.env.VITE_EMAILJS_SERVICE_ID2;
          console.log(serviceID);
          const response = await emailjs.send(
            "service_itsyzca",
            import.meta.env.VITE_EMAILJS_TEMPLATE_ID5,
            templateParams
          );

          console.log("Email sent successfully:", response);

          if (response.status !== 200) {
            throw new Error("Failed to send welcome email");
          }
        } catch (emailError) {
          console.error("EmailJS error:", emailError);
          throw new Error("Failed to send welcome email: " + emailError.text);
        }
        await Swal.fire({
          title: "Success",
          text: "User created successfully, Password Sent to user Email",
          icon: "success",
        });
        console.log("this is password", this.password);
        this.$router.push("/admin/users");
      } catch (error) {
        console.error("Error creating user:", error);
        await Swal.fire({
          title: "Error",
          text: error.message,
          icon: "error",
        });
      } finally {
        if (secondaryApp) {
          try {
            await secondaryApp._delete(); // Use _delete() instead of delete()
          } catch (e) {
            console.error("Error deleting secondary app:", e);
          }
        }
        this.loading = false;
      }
    },
  },
};
</script>
