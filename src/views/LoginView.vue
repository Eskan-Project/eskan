<script>
import { mapActions, mapGetters } from "vuex";
import hCaptcha from "@/components/hCaptcha.vue";
export default {
  components: {
    hCaptcha,
  },
  data() {
    return {
      email: "",
      password: "",
      errors: {},
      loading: false,
      showPassword: false,
      captchaToken: null,
    };
  },
  computed: {
    ...mapGetters("auth", ["isError"]),
  },
  watch: {
    isError(newVal) {
      this.errors.server = newVal;
    },
  },

  methods: {
    ...mapActions("auth", ["login", "loginWithGoogle"]),

    handleCaptchaVerified(token) {
      this.captchaToken = token;
      this.errors.captcha = null;
    },

    handleCaptchaExpired() {
      this.captchaToken = null;
      this.errors.captcha = "CAPTCHA expired. Please try again.";
    },

    handleCaptchaError() {
      this.captchaToken = null;
      this.errors.captcha = "CAPTCHA verification failed. Please try again.";
    },

    async submitLogin() {
      this.errors = {};

      if (!this.email) {
        this.errors.email = "Email is required";
      } else if (!/^\S+@\S+\.\S+$/.test(this.email)) {
        this.errors.email = "Invalid email format";
      }
      if (!this.password) {
        this.errors.password = "Password is required";
      } else if (this.password.length < 6) {
        this.errors.password = "Password must be at least 6 characters";
      }
      if (!this.captchaToken) {
        this.errors.captcha = "Please complete the CAPTCHA";
      }

      if (Object.keys(this.errors).length > 0) return;

      try {
        const userData = {
          email: this.email,
          password: this.password,
        };
        await this.login(userData);
        this.$router.push({ name: "Home" });
      } catch (error) {
        console.error("Login failed:", error.message);
        this.errors.server = error.message || "Login failed. Please try again.";
      }
    },

    togglePassword() {
      this.showPassword = !this.showPassword;
    },
  },
  watch: {
    email() {
      this.errors.email = null;
    },
    password() {
      this.errors.password = null;
    },
  },
};
</script>

<template>
  <div class="md:p-10 flex justify-center h-screen md:h-auto">
    <div
      class="bg-white rounded-xl grid md:grid-cols-2 grid-cols-1 lg:w-[60vw]"
    >
      <div class="main-text p-8 rounded-l-xl">
        <h1 class="text-[#364365] text-3xl text-center font-bold p-5">
          Welcome Back
        </h1>

        <form @submit.prevent="submitLogin">
          <div class="mb-6">
            <label class="block mb-1 text-[#364365]">Email</label>
            <input
              v-model="email"
              type="email"
              class="border-b-2 w-full focus:outline-none text-black"
              :class="{
                'border-red-500': errors.email,
                'border-gray-300': !errors.email,
              }"
            />
            <p v-if="errors.email" class="text-red-500 text-sm">
              {{ errors.email }}
            </p>
          </div>
          <div class="mb-6 relative">
            <label class="block mb-1 text-[#364365]">Password</label>
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              class="border-b-2 w-full focus:outline-none text-black"
              :class="{
                'border-red-500': errors.password,
                'border-gray-300': !errors.password,
              }"
            />
            <i
              :class="showPassword ? 'bi bi-eye-fill' : 'bi bi-eye-slash'"
              class="text-black absolute right-2 cursor-pointer"
              @click="togglePassword"
            ></i>
            <p v-if="errors.password" class="text-red-500 text-sm">
              {{ errors.password }}
            </p>
            <a
              class="text-[#364365] text-sm text-right pt-4 cursor-pointer block underline w-fit"
              @click.prevent="$router.push({ name: 'forgetPassword' })"
            >
              Forgot Your Password?
            </a>
          </div>

          <div
            class="mb-6 flex flex-col gap-6 justify-center items-center text-gray-500"
          >
            <hCaptcha
              @captchaVerified="handleCaptchaVerified"
              @captchaExpired="handleCaptchaExpired"
              @captchaError="handleCaptchaError"
            />

            <p v-if="errors.captcha" class="text-red-500 text-sm mt-1">
              {{ errors.captcha }}
            </p>
          </div>

          <p v-if="isError" class="text-red-500 text-center mb-4">
            {{ isError }}
          </p>

          <div class="p-5">
            <button
              type="submit"
              :disabled="loading"
              class="border shadow-xl w-full bg-[#364365] text-white text-sm py-2 px-4 rounded-lg hover:bg-white hover:text-[#364365] hover:border-[#364365]"
              :class="{
                'opacity-50 cursor-not-allowed': loading,
                'cursor-pointer': !loading,
              }"
            >
              {{ loading ? "Signing In..." : "Sign In" }}
            </button>
          </div>
        </form>

        <div>
          <div
            class="text-[#364365] font-medium text-sm flex justify-center gap-2 my-4 text-center"
          >
            <span class="border-b-1 w-20 self-center"></span>
            <p>Or sign in with</p>
            <span class="border-b-1 w-20 self-center"></span>
          </div>

          <div class="logs flex justify-center gap-2 p-5">
            <button
              class="cursor-pointer flex items-center gap-2 bg-white border border-gray-300 hover:border-gray-500 text-gray-700 py-2 px-4 rounded-lg"
              @click="loginWithGoogle"
            >
              <i class="bi bi-google"></i>
              Google
            </button>
          </div>

          <p class="text-black text-center">
            Don't have an account?
            <a
              class="text-blue-500 hover:text-blue-700 cursor-pointer"
              @click.prevent="$router.push({ name: 'register' })"
            >
              Sign Up
            </a>
          </p>
        </div>
      </div>

      <div class="img-container hidden md:block">
        <img
          loading="lazy"
          class="w-full h-full rounded-r-xl"
          src="@/assets/images/login/login.jpg"
        />
      </div>
    </div>
  </div>
</template>
