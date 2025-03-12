<template>
  <div class="min-h-screen bg-gray-100 p-4 md:p-8">
    <div class="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 class="text-2xl font-bold mb-6">Edit Owner Profile</h2>

      <!-- Add loading state -->
      <div v-if="!formData" class="text-center py-8">
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"
        ></div>
        <p class="mt-4 text-gray-600">Loading owner data...</p>
      </div>

      <form v-else @submit.prevent="handleSubmit" class="space-y-6">
        <!-- owner Photo -->
        <div class="flex items-center space-x-4">
          <img
            :src="formData.photo"
            alt="Owner photo"
            class="w-20 h-20 rounded-full object-cover"
          />
        </div>

        <!-- Basic Information -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Full Name</label
            >
            <input
              v-model="formData.name"
              type="text"
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
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Email</label>
            <input
              v-model="formData.email"
              type="email"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              readonly
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700"
              >National ID</label
            >
            <input
              v-model="formData.nationalId"
              type="text"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Location</label
            >
            <input
              v-model="formData.location"
              type="text"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Gender</label
            >
            <select
              v-model="formData.gender"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
            <label class="block text-sm font-medium text-gray-700 mb-2"
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
            @click="$router.push('/admin/owners')"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
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
      // Add loading state
      this.loading = true;

      const response = await this.$store.dispatch(
        "owners/getOwnerByUid",
        this.$route.params.id
      );
      console.log("Owner Data Response:", response); // Debug log

      if (!response) {
        throw new Error("Owner not found");
      }

      // Initialize formData with owner data
      this.formData = {
        name: response.name || "",
        nickName: response.nickName || "",
        email: response.email || "",
        nationalId: response.nationalId || "",
        location: response.location || "",
        gender: response.gender || "Male",
        role: response.role || "owner",
        isActive: response.isActive !== undefined ? response.isActive : true,
        photo: response.photo || "",
      };
    } catch (error) {
      console.error("Error fetching owner:", error);
      await Swal.fire("Error", "Failed to load owner data", "error");
      this.$router.push("/admin/owners");
    } finally {
      this.loading = false;
    }
  },

  methods: {
    ...mapActions("owners", ["getOwnerByUid", "updateOwner"]),

    async handleSubmit() {
      try {
        this.loading = true;
        await this.updateOwner({
          uid: this.$route.params.id,
          ownerData: {
            ...this.formData,
            updatedAt: new Date(),
          },
        });

        await Swal.fire(
          "Success",
          "Owner information updated successfully",
          "success"
        );
        this.$router.push("/admin/owners");
      } catch (error) {
        console.error("Error updating owner:", error);
        Swal.fire("Error", "Failed to update owner information", "error");
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
