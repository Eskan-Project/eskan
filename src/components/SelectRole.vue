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
                src="@/assets/images/login/registerMain-1.jpg"
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
                src="@/assets/images/login/registerMain-2.jpg"
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
          :disabled="role === 'owner' && !file"
          :class="{
            'opacity-50 cursor-not-allowed': role === 'owner' && !file,
            'opacity-100 cursor-pointer': role === 'owner' && file,
          }"
        >
          Register
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import router from "@/router";
import UploadID from "@/components/UploadID.vue";
import uploadToCloudinary from "../services/uploadToCloudinary";
import { mapActions } from "vuex";
export default {
  components: { UploadID },
  data() {
    return {
      uid: this.$route.query.uid,
      email: this.$route.query.email,
      name: this.$route.query.name,
      file: null,
      role: "",
    };
  },
  methods: {
    ...mapActions("auth", ["registerWithRole"]),
    setRole(selectedRole) {
      this.role = selectedRole;
    },
    handleIdUpload(file) {
      this.file = file;
    },
    async registerUser() {
      this.$store.commit("setLoading", true);
      try {
        let idImageUrl;
        if (this.role === "owner" && this.file) {
          const folderName = `${this.name
            .toLowerCase()
            .replace(/\s+/g, "-")}-id`;
          idImageUrl = await uploadToCloudinary(
            this.file,
            "unsigned_owner_upload",
            folderName
          );
        }
        await this.registerWithRole({
          uid: this.uid,
          name: this.name,
          email: this.email,
          role: this.role,
          idImage: idImageUrl,
        });
        router.push("/");
      } catch (error) {
        console.error("Error setting role:", error);
      } finally {
        this.$store.commit("setLoading", false);
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
