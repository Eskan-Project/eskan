<template>
  <div class="flex-1 p-4 md:p-8">
    <!-- Profile Section -->
    <section
      class="bg-white rounded-lg shadow p-4 mb-6 flex items-center space-x-4"
    >
      <img
        :src="userInfo.profileImage"
        loading="lazy"
        alt="Profile"
        class="w-16 h-16 rounded-full object-cover"
      />
      <div>
        <h1 class="text-lg md:text-xl font-semibold text-gray-600">
          {{ userInfo.firstName }} {{ userInfo.lastName }}
        </h1>
        <p class="text-sm md:text-base text-gray-600">{{ userInfo.email }}</p>
      </div>
    </section>

    <section class="bg-white rounded-lg shadow p-4 md:p-6">
      <h2 class="text-lg md:text-xl font-semibold mb-4">Edit Profile</h2>
      <form @submit.prevent="updateProfile">
        <div class="grid md:grid-cols-2 gap-7">
          <InputField
            v-for="(field, key) in editableFields"
            :key="key"
            :label="field.label"
            v-model="userInfo[key]"
            :type="field.type"
            :placeholder="field.placeholder"
            :disabled="!isEdited"
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
    <section class="mt-8">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-[#364365] text-lg md:text-xl font-semibold">
          Owners Requests
        </h2>
        <router-link to="/admin/orders" class="text-[#364365] hover:underline">
          View all
        </router-link>
      </div>
      <div class="grid sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        <div
          v-for="item in properties"
          :key="item.id"
          class="bg-white rounded-lg shadow"
        >
          <img
            :src="item.image"
            loading="lazy"
            alt="Property"
            class="w-full h-40 md:h-48 object-cover"
          />
          <div class="p-4">
            <h3 class="font-semibold text-gray-600">{{ item.title }}</h3>
            <p class="text-gray-600 text-sm">{{ item.location }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import InputField from "@/components/InputField.vue";
import img1 from "@/assets/images/department.jpg";
import img2 from "@/assets/images/department2.jpg";
import profilePic from "@/assets/images/userProfilePhoto.jpg";

export default {
  components: { InputField },
  data() {
    return {
      isEdited: false,
      userInfo: {
        profileImage: profilePic,
        firstName: "Dina",
        lastName: "Ahmed",
        email: "DinaAhmed@gmail.com",
        phone: "011154151151",
        password: "",
        nationality: "Egypt",
      },
      originalUserInfo: {},
      properties: [
        { id: 1, title: "Luxury Condo", location: "New York", image: img1 },
        { id: 2, title: "Apartment for sale", location: "London", image: img2 },
        { id: 3, title: "Luxury Condo", location: "Times Sq.", image: img1 },
      ],
    };
  },
  computed: {
    editableFields() {
      return {
        firstName: { label: "First Name", type: "text", disabled: true },
        lastName: { label: "Last Name", type: "text", disabled: true },
        email: { label: "Email", type: "email", disabled: true },
        phone: { label: "Phone Number", type: "tel", disabled: false },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Change Password",
          disabled: false,
        },
        nationality: { label: "Nationality", type: "text", disabled: false },
      };
    },
  },
  methods: {
    editProfile() {
      this.isEdited = true;
    },
    updateProfile() {
      console.log("Profile updated:", this.userInfo);
      this.originalUserInfo = JSON.parse(JSON.stringify(this.userInfo));
      this.isEdited = false;
    },
    cancelEdit() {
      this.userInfo = JSON.parse(JSON.stringify(this.originalUserInfo));
      this.isEdited = false;
    },
  },
  created() {
    this.originalUserInfo = JSON.parse(JSON.stringify(this.userInfo));
  },
};
</script>
