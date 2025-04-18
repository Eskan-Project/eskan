<template>
  <auth-header />
  <div
    class="md:p-10 flex justify-center items-center h-screen bg-gray-50 dark:bg-[#111827]"
  >
    <div
      class="bg-white dark:bg-[#1F2937] rounded-xl w-full md:w-1/3 shadow-md"
    >
      <div class="main-text p-8 rounded-l-xl">
        <h1
          class="text-[#364365] dark:text-white text-3xl text-center font-bold pb-10"
        >
          {{ $t("auth.login.title") }}
        </h1>
        <form @submit.prevent="submitLogin">
          <div class="mb-6">
            <label class="block mb-0 md:mb-1 text-[#364365] dark:text-white">{{
              $t("auth.login.email")
            }}</label>
            <input
              v-model="email"
              type="email"
              class="border-b-2 w-full focus:outline-none text-black dark:text-white dark:bg-[#1F2937] dark:border-gray-600"
              :class="{
                'border-red-500': errors.email,
                'border-gray-300 dark:border-gray-600': !errors.email,
              }"
            />
            <p v-if="errors.email" class="text-red-500 text-sm">
              {{ errors.email }}
            </p>
          </div>
          <div class="mb-6 relative">
            <label class="block mb-0 md:mb-1 text-[#364365] dark:text-white">{{
              $t("auth.login.password")
            }}</label>
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              class="border-b-2 w-full focus:outline-none text-black dark:text-white dark:bg-[#1F2937] dark:border-gray-600"
              :class="{
                'border-red-500': errors.password,
                'border-gray-300 dark:border-gray-600': !errors.password,
              }"
            />
            <i
              :class="[
                showPassword ? 'bi bi-eye-fill' : 'bi bi-eye-slash',
                'text-black dark:text-white absolute cursor-pointer',
                $i18n.locale === 'ar' ? 'left-2 top-1/3' : 'right-2 top-1/3',
              ]"
              @click="togglePassword"
            ></i>
            <p v-if="errors.password" class="text-red-500 text-sm">
              {{ errors.password }}
            </p>
            <a
              class="text-[#364365] dark:text-[#3D8BFF] text-sm text-right pt-4 cursor-pointer block underline w-fit"
              @click.prevent="$router.push({ name: 'forgetPassword' })"
            >
              {{ $t("auth.login.forgot_password") }}
            </a>
          </div>
          <div
            class="mb-6 flex flex-col gap-6 justify-center items-center text-gray-500 dark:text-gray-300"
          >
            <Turnstile
              @turnstileVerified="handleTurnstileVerified"
              @turnstileExpired="handleTurnstileExpired"
              @turnstileError="handleTurnstileError"
            />
            <p v-if="errors.turnstile" class="text-red-500 text-sm mt-1">
              {{ errors.turnstile }}
            </p>
          </div>
          <p v-if="isError" class="text-red-500 text-center mb-4">
            {{ isError }}
          </p>
          <div class="p-5">
            <button
              type="submit"
              :disabled="loading"
              class="border shadow-xl w-full bg-[#364365] dark:bg-[#3D8BFF] text-white text-sm py-2 px-4 rounded-lg hover:bg-white hover:text-[#364365] hover:border-[#364365] dark:hover:bg-[#1F2937] dark:hover:text-[#3D8BFF] dark:hover:border-[#3D8BFF]"
              :class="{
                'opacity-50 cursor-not-allowed': loading,
                'cursor-pointer': !loading,
              }"
            >
              {{
                loading ? $t("auth.login.signing_in") : $t("auth.login.sign_in")
              }}
            </button>
          </div>
        </form>
        <div>
          <div
            class="text-[#364365] dark:text-white font-medium text-sm flex justify-center gap-2 my-4 text-center"
          >
            <span
              class="border-b-1 w-20 self-center dark:border-gray-600"
            ></span>
            <p>{{ $t("auth.login.or_sign_in_with") }}</p>
            <span
              class="border-b-1 w-20 self-center dark:border-gray-600"
            ></span>
          </div>
          <div class="logs flex justify-center gap-2 p-5">
            <button
              class="cursor-pointer flex items-center gap-2 bg-white dark:bg-[#1F2937] border border-gray-300 dark:border-gray-600 hover:border-gray-500 dark:hover:border-gray-400 text-gray-700 dark:text-white py-2 px-4 rounded-lg"
              @click="loginWithGoogle"
            >
              <i class="bi bi-google"></i>
              {{ $t("auth.login.google") }}
            </button>
          </div>
          <p class="text-black dark:text-gray-300 text-center">
            {{ $t("auth.login.no_account") }}
            <a
              class="text-blue-500 dark:text-[#3D8BFF] hover:text-blue-700 dark:hover:text-blue-400 cursor-pointer"
              @click.prevent="$router.push({ name: 'register' })"
            >
              {{ $t("auth.login.sign_up") }}
            </a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import Turnstile from "@/components/Turnstile.vue";
import AuthHeader from "@/components/AuthHeader.vue";
export default {
  components: {
    Turnstile,
    AuthHeader,
  },
  data() {
    return {
      email: "",
      password: "",
      errors: {},
      loading: false,
      showPassword: false,
      turnstileToken: null,
    };
  },
  computed: {
    ...mapGetters("auth", ["isError"]),
  },
  watch: {
    isError(newVal) {
      this.errors.server = newVal;
    },
    email() {
      this.errors.email = null;
    },
    password() {
      this.errors.password = null;
    },
  },
  methods: {
    ...mapActions("auth", ["login", "loginWithGoogle"]),

    handleTurnstileVerified(token) {
      this.turnstileToken = token;
      this.errors.turnstile = null;
    },
    handleTurnstileExpired() {
      this.turnstileToken = null;
      this.errors.turnstile = this.$t("auth.login.validation.security_expired");
    },
    handleTurnstileError() {
      this.turnstileToken = null;
      this.errors.turnstile = this.$t("auth.login.validation.security_failed");
    },
    async submitLogin() {
      this.errors = {};
      if (!this.email) {
        this.errors.email = this.$t("auth.login.validation.email_required");
      } else if (!/^\S+@\S+\.\S+$/.test(this.email)) {
        this.errors.email = this.$t("auth.login.validation.email_invalid");
      }
      if (!this.password) {
        this.errors.password = this.$t(
          "auth.login.validation.password_required"
        );
      } else if (this.password.length < 6) {
        this.errors.password = this.$t("auth.login.validation.password_length");
      }
      if (!this.turnstileToken) {
        this.errors.turnstile = this.$t("auth.login.validation.security_check");
      }
      if (Object.keys(this.errors).length > 0) return;

      try {
        const userData = {
          email: this.email,
          password: this.password,
          turnstileToken: this.turnstileToken,
        };
        await this.login(userData);
        this.$router.push({ name: "Home" });
      } catch (error) {
        console.error("Login failed:", error.message);
        this.errors.server =
          error.message || this.$t("auth.login.validation.registration_failed");
      }
    },
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
  },
};
</script>

<style scoped>
input:focus {
  outline: none !important;
}
</style>
