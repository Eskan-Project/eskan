<template>
  <div class="flex-1 p-4 md:p-8 dark:bg-gray-900">
    <!-- Profile Section -->
    <section
      class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6 flex items-center space-x-4"
    >
      <img
        :src="userInfo.photo"
        loading="lazy"
        alt="Profile"
        class="w-16 h-16 rounded-full object-cover border dark:border-gray-600"
      />
      <div>
        <h1
          class="text-lg md:text-xl font-semibold text-gray-600 dark:text-white"
        >
          {{ userInfo.name }}
        </h1>
        <p class="text-sm md:text-base text-gray-600 dark:text-gray-300">
          {{ userInfo.email }}
        </p>
      </div>
    </section>

    <section class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 md:p-6">
      <h2
        class="text-lg md:text-xl font-semibold mb-4 text-gray-700 dark:text-white"
      >
        Edit Profile
      </h2>
      <form @submit.prevent="handleUpdateProfile">
        <div class="grid md:grid-cols-2 gap-7">
          <InputField
            v-for="(field, key) in editableFields"
            :key="key"
            :label="field.label"
            v-model="userInfo[key]"
            :type="field.type"
            :placeholder="field.placeholder"
            :disabled="!isEdited"
            class="dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />
        </div>

        <div class="mt-4 flex gap-4">
          <button
            v-if="!isEdited"
            @click="editProfile"
            type="button"
            class="px-6 py-2 bg-[#364365] text-white rounded hover:bg-[#2a355e] cursor-pointer"
          >
            Edit
          </button>
          <button
            v-else
            type="submit"
            :disabled="!isEdited"
            class="px-6 py-2 bg-[#364365] text-white rounded hover:bg-[#2a355e] disabled:bg-gray-400 cursor-pointer"
          >
            Save Changes
          </button>
          <button
            v-if="isEdited"
            @click="cancelEdit"
            type="button"
            class="px-6 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </form>
    </section>

    <!-- Orders Section -->
    <section class="mt-8" v-if="latestRequests.length === 0">
      <div
        class="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 p-4 rounded-lg shadow"
      >
        <p class="text-center font-semibold">
          Well Done! There are no Pending Requests
        </p>
      </div>
    </section>
    <section v-else class="mt-8">
      <div class="flex justify-between items-center mb-6">
        <h2
          class="text-[#364365] dark:text-blue-300 text-lg md:text-xl font-semibold"
        >
          Owners Requests
        </h2>
        <router-link
          to="/admin/requests"
          class="text-[#364365] dark:text-blue-300 hover:underline"
        >
          View all
        </router-link>
      </div>
      <div class="grid sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        <div
          v-for="request in latestRequests"
          :key="request.id"
          @click="viewRequestDetails(request.id)"
          class="bg-white dark:bg-gray-800 rounded-lg shadow cursor-pointer hover:shadow-lg transition-shadow"
        >
          <img
            :src="request.images?.[0] || 'default-image-url'"
            loading="lazy"
            alt="Property"
            class="w-full h-40 md:h-48 object-cover"
          />
          <div class="p-4">
            <div class="flex items-center justify-between mb-2">
              <h3 class="font-semibold text-gray-600 dark:text-white">
                {{ request.title }}
              </h3>
              <span
                :class="{
                  'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100':
                    request.status === 'pending',
                  'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100':
                    request.status === 'approved',
                  'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100':
                    request.status === 'rejected',
                }"
                class="px-2 py-1 rounded-full text-xs"
              >
                {{ request.status }}
              </span>
            </div>
            <p class="text-gray-600 dark:text-gray-300 text-sm">
              {{ request.propertyContact.name }}
            </p>
            <p class="text-gray-500 dark:text-gray-400 text-xs mt-2">
              {{
                new Date(request.createdAt.seconds * 1000).toLocaleDateString()
              }}
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style>
/* Add dark mode styles for inputs */
.dark input,
.dark textarea,
.dark select {
  color: white;
  background-color: #374151; /* gray-700 */
  border-color: #4b5563; /* gray-600 */
}

/* Fix any potential light mode issues */
input,
textarea,
select {
  color: #111827; /* gray-900 for better contrast in light mode */
}
</style>

<script>
import { mapState, mapActions } from "vuex";
import InputField from "@/components/InputField.vue";
import img1 from "@/assets/images/department.jpg";
import img2 from "@/assets/images/department2.jpg";

export default {
  components: { InputField },
  data() {
    return {
      isEdited: false,
      originalUserInfo: {},
    };
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.auth.userDetails,
      allRequests: (state) => state.requests.requests,
    }),
    // Get latest 3 requests
    latestRequests() {
      return [...this.allRequests]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 3);
    },
    editableFields() {
      return {
        name: { label: "Full Name", type: "text", disabled: false },
        email: { label: "Email", type: "email", disabled: true },
        phone: { label: "Phone Number", type: "tel", disabled: false },
        nationalId: { label: "National ID", type: "text", disabled: false },
        gender: { label: "Gender", type: "text", disabled: false },
        address: { label: "Address", type: "text", disabled: false },
      };
    },
  },
  methods: {
    ...mapActions("auth", ["updateProfile"]),
    ...mapActions("requests", ["getRequests"]),
    editProfile() {
      this.isEdited = true;
    },
    async handleUpdateProfile() {
      try {
        await this.updateProfile(this.userInfo);
        this.originalUserInfo = JSON.parse(JSON.stringify(this.userInfo));
        this.isEdited = false;
      } catch (error) {
        console.error("Error updating profile:", error);
      }
    },
    cancelEdit() {
      this.userInfo = JSON.parse(JSON.stringify(this.originalUserInfo));
      this.isEdited = false;
    },
    viewRequestDetails(requestId) {
      this.$router.push(`/admin/requests/${requestId}`);
    },
  },
  async created() {
    this.originalUserInfo = JSON.parse(JSON.stringify(this.userInfo));
    await this.getRequests(); // Fetch all requests when component mounts
  },
};
</script>
