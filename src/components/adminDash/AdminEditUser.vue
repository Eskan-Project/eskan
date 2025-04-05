<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 md:p-8">
    <div
      class="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
    >
      <h2 class="text-2xl font-bold mb-6 dark:text-white">Edit User Profile</h2>

      <!-- Add loading state -->
      <div v-if="!formData" class="text-center py-8">
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"
        ></div>
        <p class="mt-4 text-gray-600 dark:text-gray-400">
          Loading user data...
        </p>
      </div>

      <form v-else @submit.prevent="handleSubmit" class="space-y-6">
        <!-- User Photo -->
        <div class="flex items-center space-x-4">
          <img
            :src="formData.photo"
            alt="User photo"
            class="w-20 h-20 rounded-full object-cover border dark:border-gray-600"
          />
        </div>

        <!-- Basic Information -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >Full Name</label
            >
            <input
              v-model="formData.name"
              type="text"
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
              class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              readonly
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
              class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >Location</label
            >
            <input
              v-model="formData.location"
              type="text"
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
              class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <!-- <div>
            <label class="block text-sm font-medium text-gray-700">Role</label>
            <select
              v-model="formData.role"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="user">User</option>
              <option value="owner">Admin</option>
              <option value="admin">Admin</option>
            </select>
          </div> -->

          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >Account Status</label
            >
            <div class="flex items-center">
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
              <span
                class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-200"
              >
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
            class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {{ loading ? "Saving..." : "Save Changes" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      loading: false,
      formData: null, // Changed to null initially
    };
  },

  async created() {
    try {
      const userData = await this.getUserByUid(this.$route.params.id);
      if (!userData) {
        throw new Error("User not found");
      }

      this.formData = {
        name: userData.name || "",
        email: userData.email || "",
        nationalId: userData.nationalId || "",
        location: userData.location || "",
        gender: userData.gender || "Male",
        role: userData.role || "user",
        isActive: userData.isActive,
        photo: userData.photo || "",
      };
    } catch (error) {
      console.error("Error fetching user:", error);
      await Swal.fire("Error", "Failed to load user data", "error");
      this.$router.push("/admin/users");
    }
  },

  methods: {
    ...mapActions("users", ["getUserByUid", "updateUser"]),

    async handleSubmit() {
      try {
        this.loading = true;
        await this.updateUser({
          uid: this.$route.params.id,
          userData: {
            ...this.formData,
            updatedAt: new Date(),
          },
        });

        await Swal.fire(
          "Success",
          "User information updated successfully",
          "success"
        );
        this.$router.push("/admin/users");
      } catch (error) {
        console.error("Error updating user:", error);
        Swal.fire("Error", "Failed to update user information", "error");
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style>
/* Add dark mode styles for inputs */
.dark input,
.dark textarea,
.dark select {
  color: white;
}
</style>
