<template>
  <div class="flex items-center justify-center h-screen">
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h2 class="text-2xl font-bold text-center text-gray-700 mb-4">
        {{ $t("auth.reset_password.title") }}
      </h2>
      <p class="text-sm text-gray-500 text-center mb-6">
        {{ $t("auth.reset_password.description") }}
      </p>

      <form @submit.prevent="handleResetPassword">
        <div class="mb-4 relative">
          <label class="block text-gray-700">{{
            $t("auth.reset_password.new_password")
          }}</label>
          <input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            class="border border-gray-300 w-full p-2 rounded-md focus:outline-none focus:border-blue-500 text-black"
            required
          />
          <i
            :class="showPassword ? 'bi bi-eye-fill' : 'bi bi-eye-slash'"
            class="text-black absolute right-2 top-8 cursor-pointer"
            @click="togglePassword"
          ></i>
        </div>

        <p v-if="message" class="text-green-500 text-center text-sm mb-4">
          {{ message }}
        </p>
        <p v-if="error" class="text-red-500 text-center text-sm mb-4">
          {{ error }}
        </p>

        <button
          type="submit"
          class="w-full text-white bg-[#364365] hover:bg-white hover:text-[#364365] py-2 px-4 rounded-lg border border-[#364365] cursor-pointer"
          :class="loading ? 'opacity-50 cursor-not-allowed' : ''"
          :disabled="loading"
        >
          <span v-if="!loading">{{ $t("auth.reset_password.reset") }}</span>
          <span v-else>{{ $t("auth.reset_password.processing") }}</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { confirmPasswordReset } from "firebase/auth";
import { auth } from "@/config/firebase";
import { useRoute, useRouter } from "vue-router";

export default {
  data() {
    return {
      password: "",
      message: "",
      error: "",
      showPassword: false,
    };
  },
  computed: {
    ...mapState(["loading"]),
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    return { route, router };
  },
  methods: {
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    async handleResetPassword() {
      this.message = "";
      this.error = "";

      if (this.password.length < 6) {
        this.error = this.$t("auth.reset_password.validation.password_length");
        return;
      }

      try {
        const oobCode = this.route.query.oobCode;
        if (!oobCode)
          throw new Error(
            this.$t("auth.reset_password.validation.invalid_code")
          );

        await confirmPasswordReset(auth, oobCode, this.password);
        this.message = this.$t("auth.reset_password.success");

        setTimeout(() => {
          this.router.push("/login");
        }, 2000);
      } catch (error) {
        console.error("Password Reset Error:", error);
        this.error = error.message;
      }
    },
  },
};
</script>
