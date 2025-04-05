<template>
  <div class="flex items-center justify-center h-screen">
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h2 class="text-2xl font-bold text-center text-gray-700 mb-4">
        {{ $t("auth.forgot_password.title") }}
      </h2>
      <p class="text-sm text-gray-500 text-center mb-6">
        {{ $t("auth.forgot_password.description") }}
      </p>

      <form @submit.prevent="handleResetPassword" novalidate>
        <div class="mb-4">
          <label class="block text-gray-700">{{
            $t("auth.forgot_password.email")
          }}</label>
          <input
            v-model="email"
            type="email"
            class="border border-gray-300 w-full p-2 rounded-md focus:outline-none focus:border-blue-500 text-black"
          />
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
          :disabled="loading"
        >
          <span v-if="!loading">{{
            $t("auth.forgot_password.send_link")
          }}</span>
          <span v-else>{{ $t("auth.forgot_password.sending") }}</span>
        </button>
      </form>

      <p class="text-center text-sm text-gray-600 mt-4">
        <router-link to="/login" class="text-blue-500 hover:underline">
          {{ $t("auth.forgot_password.back_to_login") }}
        </router-link>
      </p>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  data() {
    return {
      email: "",
      message: "",
      error: "",
    };
  },
  computed: {
    ...mapState("auth", ["loading"]),
  },
  methods: {
    ...mapActions("auth", ["resetPassword"]),

    async handleResetPassword() {
      this.message = "";
      this.error = "";

      if (!this.email.trim()) {
        this.error = this.$t("auth.forgot_password.validation.email_required");
        return;
      }

      try {
        const response = await this.resetPassword(this.email);
        if (response.success) {
          this.message = response.message;
        }
      } catch (error) {
        this.error = this.$t("auth.forgot_password.validation.failed");
        console.error(error);
      }
    },
  },
};
</script>
