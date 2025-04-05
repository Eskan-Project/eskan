<template>
  <auth-header />
  <div
    v-if="role !== 'user'"
    class="px-3 sm:px-5 md:px-10 flex justify-center items-center min-h-screen py-8"
  >
    <div
      class="bg-white rounded-xl w-full text-black sm:w-[95vw] md:w-[90vw] lg:w-[70vw] shadow-lg"
    >
      <div v-if="role === ''">
        <p
          class="text-xl sm:text-2xl md:text-3xl text-stone-500 text-center mt-6 md:mt-10 leading-relaxed px-4"
        >
          {{ $t("auth.select_role.welcome") }} <br />
          {{ $t("auth.select_role.subtitle") }}
        </p>
        <div
          class="grid sm:grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8 md:gap-10 p-4 sm:p-5 md:p-10 lg:p-20"
        >
          <button
            class="cursor-pointer p-3 sm:p-4 md:p-5 rounded-xl text-center shadow-sm shadow-black hover:shadow-gray-400 hover:transition-all duration-300 hover:scale-105"
            @click="setRole('user')"
          >
            <div
              class="grid sm:grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-5 p-3 sm:p-4 md:p-5 items-center"
            >
              <p
                class="text-xl sm:text-2xl font-medium md:text-left text-center"
              >
                {{ $t("auth.select_role.user") }}
              </p>
            </div>
            <p class="text-sm sm:text-base">
              {{ $t("auth.select_role.user_description") }}
            </p>
          </button>

          <button
            class="cursor-pointer p-3 sm:p-4 md:p-5 rounded-xl text-center shadow-sm shadow-black hover:shadow-gray-400 hover:transition-all duration-300 hover:scale-105"
            @click="setRole('owner')"
          >
            <div
              class="grid sm:grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-5 p-3 sm:p-4 md:p-5 items-center"
            >
              <p
                class="text-xl sm:text-2xl font-medium md:text-left text-center"
              >
                {{ $t("auth.select_role.owner") }}
              </p>
            </div>
            <p class="text-sm sm:text-base">
              {{ $t("auth.select_role.owner_description") }}
            </p>
          </button>
        </div>
      </div>
      <UploadID v-if="role === 'owner'" @idUploaded="handleIdUpload" />

      <div class="py-6 md:py-10 text-center">
        <button
          v-if="role"
          class="border shadow-xl bg-[#364365] hover:bg-white hover:text-[#364365] hover:border-[#364365] text-white text-sm sm:text-base py-2 px-4 sm:px-6 rounded-lg mt-4 sm:mt-6"
          @click="registerUser"
          :disabled="(role === 'owner' && !file) || loading"
          :class="{
            'opacity-50 cursor-not-allowed':
              (role === 'owner' && !file) || loading,
            'opacity-100 cursor-pointer': role === 'owner' && file,
          }"
        >
          {{
            loading
              ? $t("auth.select_role.registering")
              : $t("auth.select_role.register")
          }}
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
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import AuthHeader from "./AuthHeader.vue";
export default {
  components: { UploadID, AuthHeader },
  data() {
    return {
      uid: this.$route.query.uid,
      email: this.$route.query.email,
      name: this.$route.query.name,
      file: null,
      role: this.$route.query.role || "",
      loading: false,
    };
  },
  methods: {
    ...mapActions("auth", ["registerWithRole"]),
    setRole(selectedRole) {
      this.role = selectedRole;
      if (this.role === "user") {
        this.registerUser();
      }
    },
    handleIdUpload(file) {
      this.file = file;
    },
    async registerUser() {
      this.loading = true;
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
        router.push("/").then(() => {
          toast.success(this.$t("auth.select_role.welcome_message"), {
            position: "top-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
          });
        });
      } catch (error) {
        console.error("Error setting role:", error);
      } finally {
        this.loading = false;
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

@media (max-width: 640px) {
  .btn-primary {
    padding: 8px 16px;
    font-size: 14px;
  }
}
</style>
