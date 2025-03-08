<template>
      <main class="min-h-screen bg-gray-100 text-gray-900 pt-[86px] py-8">
    <div class="max-w-6xl mx-auto px-4">
      <section class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="relative h-48">
          <img
            class="h-full w-full object-cover"
            src="../assets/images/userProfileCoverPagePhoto.jpg"
            alt="Profile Cover"
          />
          <div class="absolute inset-0 bg-[#053052]/80"></div>
        </div>

        <div class="relative px-6 pb-6 text-gray-900">
          <article class="flex flex-col sm:flex-row items-center">
            <figure class="-mt-16 relative">
              <img
                :src="userDetails?.photo || defaultPhoto"
                alt="Profile"
                class="w-32 h-32 rounded-full border-4 border-white bg-white object-cover shadow-lg"
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
                class="hidden "
                accept="image/png, image/jpeg, image/jpg"
                @change="handleFileChange"
                ref="fileInput"
              />
            </figure>

            <div class="mt-6 sm:mt-0 sm:ml-6 text-center sm:text-left">
              <div class="mt-6 sm:mt-0 sm:ml-6 text-center sm:text-left">
                <div class="flex flex-col md:flex-row md:items-center md:space-x-6">
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
    <h1 class="text-3xl font-bold text-gray-900 whitespace-nowrap overflow-hidden text-ellipsis">
      {{ userDetails?.name || "No Name" }}
    </h1>
  </div>
</div>
                </div>

                <p class="text-sm mt-2 text-gray-600 flex items-center mt-1">
                  {{ userDetails?.email || 'mariamsamuel111@gmail.com' }}
                  <span
                    v-if="userDetails?.isActive"
                    class="ml-2 bg-green-100 text-green-700 font-semibold px-2 py-1 rounded-md shadow-sm"
                  >
                    ✅ Active
                  </span>
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


      <div class="mt-8 grid grid-cols-1 md:grid-cols-1 gap-6">
        <section class="md:col-span-2">
          <article class="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
            <h2 class="text-2xl font-semibold mb-6 text-gray-700 border-b pb-3 flex items-center">
              Personal Information
            </h2>

            <form @submit.prevent="saveProfile">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 flex items-center mb-2">
                    National ID
                  </label>
                  <div v-if="isEditing">
                    <input
                      v-model="userDetails.nationalId"
                      type="text"
                      class="block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    />
                  </div>
                  <div v-else class="text-gray-900 bg-gray-100 px-4 py-2 rounded-lg shadow-md">
                    {{ userDetails?.nationalId || "Not specified" }}
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 flex items-center mb-2">
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
                  <div v-else class="text-gray-900 font-semibold bg-gray-100 px-4 py-2 rounded-lg shadow-md">
                    {{ userDetails?.gender || "Not specified" }}
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 flex items-center mb-2">
                    Location
                  </label>
                  <div v-if="isEditing">
                    <input
                      v-model="userDetails.location"
                      type="text"
                      class="block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    />
                  </div>
                  <div v-else class="text-gray-900 font-semibold bg-gray-100 px-4 py-2 rounded-lg shadow-md">
                    {{ userDetails?.location || "Not specified" }}
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 flex items-center mb-2">
                    Nickname
                  </label>
                  <div v-if="isEditing">
                    <input
                      v-model="userDetails.nickName"
                      type="text"
                      class="block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    />
                  </div>
                  <div v-else class="text-gray-900 bg-gray-100 px-4 py-2 rounded-lg shadow-md">
                    {{ userDetails?.nickName || "Not specified" }}
                  </div>
                </div>
              </div>

              <button
                v-if="isEditing"
                type="submit"
                class="mt-6 w-full md:w-auto px-6 py-2 bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold rounded-lg hover:shadow-lg transition-transform transform hover:scale-105"
              >
                Save Profile
              </button>
            </form>
          </article>
        </section>
      </div>
    </div>
  </main>
</template>

<script>
import { mapState, mapActions } from "vuex";
import uploadToCloudinary from "../services/uploadToCloudinary";
export default {
  data() {
    return {
      isEditing: false,
      selectedFile: null,
    };
  },
  mounted() {
    this.fetchUserDetails();
  },
  computed: {
    ...mapState("auth", ["userDetails"]),
  },
  methods: {
    ...mapActions("auth", ["fetchUserDetails", "updateProfile"]),
    toggleEdit() {
      this.isEditing = !this.isEditing;
    },
    async saveProfile() {
      this.$store.commit("setLoading", true);
      try {
        if (this.selectedFile) {
          const folderName = `${this.userDetails.name
            .toLowerCase()
            .replace(/\s+/g, "-")}-profile`;
          const uploadImgUrl = await uploadToCloudinary(
            this.selectedFile,
            this.userDetails.role === "owner"
              ? import.meta.env.VITE_CLOUDINARY_UPLOAD_OWNER_PRESET
              : import.meta.env.VITE_CLOUDINARY_UPLOAD_USER_PRESET,
            folderName
          );
          this.userDetails.photo = uploadImgUrl;
        }
        await this.updateProfile();
        this.isEditing = false;
      } catch (error) {
        console.log(error);
      } finally {
        this.$store.commit("setLoading", false);
      }
    },
    handleFileChange(event) {
      this.selectedFile = event.target.files[0];
      if (this.selectedFile) {
        const reader = new FileReader();
        reader.readAsDataURL(this.selectedFile);
        reader.onload = () => {
          this.userDetails.photo = reader.result;
        };
      }
    },
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
  },
};
</script>