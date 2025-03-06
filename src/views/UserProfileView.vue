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
                :src="userDetails.photo || defaultPhoto"
                alt="Profile"
                class="w-32 h-32 rounded-full border-4 border-white bg-white object-cover shadow-lg"
              />
            </figure>
            <div class="mt-6 sm:mt-0 sm:ml-6 text-center sm:text-left">
              <h1 class="text-3xl font-bold text-gray-900">{{ userDetails.name || "No Name" }}</h1>
              <div class="flex items-center justify-center sm:justify-start space-x-2 mt-2">
                <span class="relative text-gray-600 text-sm font-medium bg-gray-200 px-4 py-1 rounded-lg shadow-md flex items-center">
                  {{ userDetails.email }}
                  <span
                    v-if="userDetails.isActive"
                    class="ml-2 bg-green-100 text-green-700 font-semibold px-2 py-1 rounded-md shadow-sm"
                  >
                    ✅ Active
                  </span>
                </span>
              </div>
            </div>
            <button
              @click="toggleEdit"
              class="mt-6 sm:mt-0 sm:ml-auto px-4 py-2 bg-[#364365] text-white rounded-lg hover:bg-[#2a355e] shadow-md"
            >
              {{ isEditing ? "Cancel" : "Edit Profile" }}
            </button>
          </article>
        </div>
      </section>

      <div class="mt-8 grid grid-cols-1 md:grid-cols-1 gap-6">
        <section class="md:col-span-2">
          <article class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-xl font-semibold mb-4 border-b pb-2">Personal Information</h2>
            <form @submit.prevent="saveProfile">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div v-for="(value, key) in editableFields" :key="key">
                  <label class="block text-sm font-medium text-gray-600">
                    {{ formatLabel(key) }}
                  </label>
                  <div v-if="isEditing">
                    <input
                      v-model="userDetails[key]"
                      type="text"
                      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white"
                    />
                  </div>
                  <div v-else class="text-gray-900  bg-gray-100 px-4 py-2 rounded-lg shadow">
                    {{ userDetails[key] || "Not specified" }}
                  </div>
                </div>
                <div class="flex items-center space-x-4">
                  <label class="text-sm font-medium text-gray-700">Gender:</label>
                  <div v-if="isEditing" class="flex-1">
                    <select
                      v-model="userDetails.gender"
                      class="block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white"
                    >
                      <option disabled value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div v-else class="text-gray-900 font-semibold bg-gray-100 px-4 py-2 rounded-lg shadow">
                    {{ userDetails.gender || "Not specified" }}
                  </div>
                </div>
              </div>
              <button
                v-if="isEditing"
                type="submit"
                class="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-md"
              >
                 Save
              </button>
            </form>
          </article>
        </section>
      </div>
    </div>
  </main>
</template>

<script>
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../config/firebase";

export default {
  data() {
    return {
      userDetails: {
        email: "",
        name: "",
        photo: "",
        nickName: "",
        location: "",
        gender: "",
        nationalId: "",
        isActive: false, 
      },
      isEditing: false,
      defaultPhoto: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
      editableFields: {
        name: "",
        nickName: "",
        location: "",
        nationalId: "",
      },
    };
  },
  mounted() {
    this.fetchUserData();
  },
  methods: {
    async fetchUserData() {
      const authInstance = getAuth();
      onAuthStateChanged(authInstance, async (currentUser) => {
        if (currentUser) {
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            this.userDetails = {
              email: currentUser.email,
              name: userData.name || "No Name",
              nickName: userData.nickName || "",
              location: userData.location || "",
              gender: userData.gender || "",
              nationalId: userData.nationalId || "",
              photo: userData.photo || this.defaultPhoto,
              isActive: userData.isActive || false,
            };
          }
        }
      });
    },
    toggleEdit() {
      this.isEditing = !this.isEditing;
    },
    async saveProfile() {
      const authInstance = getAuth();
      const currentUser = authInstance.currentUser;
      if (currentUser) {
        const userDocRef = doc(db, "users", currentUser.uid);
        await setDoc(userDocRef, this.userDetails, { merge: true });
        this.isEditing = false;
      }
    },
    formatLabel(key) {
      return key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());
    },
  },
};
</script>

