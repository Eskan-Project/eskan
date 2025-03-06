<template>
  <div class="md:p-10 flex justify-center align-middle">
    <div class="bg-white rounded-xl w-screen text-black lg:w-[70vw] shadow-lg">
      <img src="@/assets/images/logo-black.png" class="block mx-auto" />
      <div v-if="role === ''">
        <p class="md:text-3xl text-lg text-stone-500 text-center">
          Welcome to ESKAN! <br />
          Choose your role and start your journey with us
        </p>
        <div class="grid md:grid-cols-2 grid-cols-1 gap-10 md:p-20 p-5">
          <button
            class="cursor-pointer p-5 md:text-left rounded-xl text-center shadow-sm shadow-black hover:shadow-gray-400 hover:transition-all duration-300 hover:scale-105"
            @click="setRole('user')"
          >
            <div class="grid md:grid-cols-2 grid-cols-1 p-5 gap-5">
              <p class="text-2xl font-medium">
                Register <br />
                As a <span class="text-[#364365] font-bold">User</span>
              </p>
              <img
                src="@/assets/images/login/registerMain-1.png"
                class="shrink block mx-auto"
              />
            </div>
            <p>
              Manage your properties, track tenants, and streamline your
              business operations efficiently.
            </p>
          </button>

          <button
            class="cursor-pointer p-5 md:text-left rounded-xl text-center shadow-sm shadow-black hover:shadow-gray-400 hover:transition-all duration-300 hover:scale-105"
            @click="setRole('owner')"
          >
            <div class="grid md:grid-cols-2 grid-cols-1 p-5 gap-5">
              <p class="text-2xl font-medium">
                Register <br />
                As an <span class="text-[#364365] font-bold">Owner</span>
              </p>
              <img
                src="@/assets/images/login/registerMain-2.png"
                class="shrink block mx-auto"
              />
            </div>
            <p>
              Manage your properties, track tenants, and streamline your
              business operations efficiently.
            </p>
          </button>
        </div>
      </div>
      <UploadID v-if="role === 'owner'" @idUploaded="handleIdUpload" />

      <div class="py-10 text-center">
        <button
          v-if="role"
          class="border shadow-xl bg-[#364365] hover:bg-white hover:text-[#364365] hover:border-[#364365] text-white text-sm py-2 px-4 rounded-lg mt-6"
          @click="registerUser"
          :disabled="role === 'owner' && !idImageUrl"
          :class="{
            'opacity-50 cursor-not-allowed': role === 'owner' && !idImageUrl,
            'opacity-100 cursor-pointer': role === 'owner' && idImageUrl,
          }"
        >
          Register
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from "@/config/firebase";
import { doc, setDoc } from "firebase/firestore";
import router from "@/router";
import UploadID from "@/components/UploadID.vue";

export default {
  components: { UploadID },
  data() {
    return {
      uid: this.$route.query.uid,
      email: this.$route.query.email,
      name: this.$route.query.name,
      role: "",
      idImageUrl: "",
    };
  },
  methods: {
    setRole(selectedRole) {
      this.role = selectedRole;
    },
    handleIdUpload(imageUrl) {
      this.idImageUrl = imageUrl;
    },
    async registerUser() {
      try {
        let collection = this.role === "owner" ? "owners" : "users";
        await setDoc(doc(db, collection, this.uid), {
          name: this.name,
          email: this.email,
          role: this.role,
          idImage: this.role === "owner" ? this.idImageUrl : null,
          createdAt: new Date(),
        });

        router.push("/");
      } catch (error) {
        console.error("Error setting role:", error);
      }
    },
  },
};
</script>

<style scoped>
.btn-primary {
  background-color: #364365;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: 0.3s;
}
.btn-primary:hover {
  background-color: #2a2f4a;
}
</style>
