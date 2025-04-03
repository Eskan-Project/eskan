<template>
  <div class="min-h-screen bg-gray-100 p-4 md:p-8">
    <div class="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 class="text-2xl font-bold mb-6 text-gray-700">Edit Owner Profile</h2>

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

      <!-- National ID Card Display -->
      <div class="mt-8 border-t pt-6">
        <h3 class="text-lg font-semibold mb-4 text-gray-700">
          National ID Card
        </h3>
        <div class="bg-gray-50 rounded-lg p-4">
          <!-- Add v-if check for formData first -->
          <div v-if="formData">
            <div v-if="formData.idImage" class="flex flex-col items-center">
              <img
                :src="formData.idImage"
                alt="National ID"
                class="max-w-full h-auto rounded-lg shadow-md"
                style="max-height: 200px"
              />
            </div>
            <div v-else class="text-center py-8 text-gray-500">
              No national ID image available
            </div>
          </div>
          <div v-else class="text-center py-8 text-gray-500">Loading...</div>
        </div>
        <button
          v-if="formData"
          @click="handleDeleteOwner"
          :disabled="defaultImage"
          :class="
            defaultImage
              ? 'mt-4 px-4 py-2 bg-green-600'
              : 'mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700'
          "
        >
          {{
            defaultImage
              ? "Valid id image created by admin"
              : "Not Valid id, Delete user"
          }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import Swal from "sweetalert2";
import emailjs from "emailjs-com";

emailjs.init(import.meta.env.VITE_EMAILJS_USER_ID);

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
        nationalIdImage: response.nationalIdImage || "", // Add this line
        location: response.location || "",
        gender: response.gender || "Male",
        role: response.role || "owner",
        isActive: response.isActive,
        photo: response.photo || "",
        idImage: response.idImage || "",
        createByAdmin: response.createByAdmin || false,
      };
    } catch (error) {
      console.error("Error fetching owner:", error);
      await Swal.fire("Error", "Failed to load owner data", "error");
      this.$router.push("/admin/owners");
    } finally {
      this.loading = false;
    }
  },
  computed: {
    defaultImage() {
      return this.formData.createByAdmin;
    },
  },
  methods: {
    ...mapActions("owners", ["getOwnerByUid", "updateOwner", "deleteOwner"]),
    async handleDeleteOwner() {
      try {
        const result = await Swal.fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, delete it!",
        });

        if (!result.isConfirmed) return;

        this.loading = true;

        // Send email notification before deleting the owner
        try {
          const templateParams = {
            to_name: this.formData.name,
            to_email: this.formData.email,
            message: `Your account has been deleted due to submission of invalid National ID. This is a warning, and repeated attempts with invalid documentation may result in permanent restriction from our platform.`,
            subject: "Account Deletion Notice - Invalid Documentation",
          };

          await emailjs.send(
            import.meta.env.VITE_EMAILJS_SERVICE_ID,
            import.meta.env.VITE_EMAILJS_TEMPLATE_ID2,
            templateParams
          );
        } catch (emailError) {
          console.error("Failed to send email notification:", emailError);
          // Continue with deletion even if email fails
        }

        // Proceed with owner deletion
        await this.deleteOwner(this.$route.params.id);

        await Swal.fire(
          "Deleted!",
          "Owner has been deleted successfully.",
          "success"
        );

        // Navigate back to owners list
        this.$router.push("/admin/owners");
      } catch (error) {
        console.error("Delete failed:", error);
        Swal.fire(
          "Error!",
          "Failed to delete owner. Please try again.",
          "error"
        );
      } finally {
        this.loading = false;
      }
    },
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
