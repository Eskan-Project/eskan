<template>
  <div class="min-h-screen bg-gray-100 p-4 md:p-8">
    <div class="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 class="text-2xl font-bold mb-6">Add New User</h2>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Basic Information -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Full Name</label
            >
            <input
              v-model="formData.name"
              type="text"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

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
                class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                :class="formData.isActive ? 'bg-blue-600' : 'bg-gray-200'"
              >
                <span
                  class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
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
        <div class="flex justify-end space-x-4">
          <button
            type="button"
            @click="$router.push('/admin/users')"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {{ loading ? "Creating..." : "Create User" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "@/config/firebase";
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

    async handleSubmit() {
      try {
        if (!this.validateEmail(this.formData.email)) {
          throw new Error("Please enter a valid email address");
        }

        if (!this.formData.nationalId || this.formData.nationalId.length < 6) {
          throw new Error("National ID must be at least 6 characters");
        }

        this.loading = true;

        // Store current auth state
        const adminAuth = auth.currentUser;
        if (!adminAuth) {
          throw new Error("Admin not authenticated");
        }

        // Create authentication account first
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          this.formData.email.trim(),
          this.formData.nationalId
        );

        // Prepare user data
        const userData = {
          ...this.formData,
          uid: userCredential.user.uid,
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: adminAuth.uid, // Add admin's ID who created this user
        };

        // Create user document in Firestore
        await this.createUser(userData);

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
        this.loading = false;
      }
    },
  },
};
</script>
