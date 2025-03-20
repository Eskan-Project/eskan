<script>
import { mapState, mapActions } from "vuex";
import uploadToCloudinary from "@/services/uploadToCloudinary";
import hCaptcha from "@/components/hCaptcha.vue";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import { validateImage } from "@/services/imageValidationService";

export default {
  components: {
    hCaptcha,
  },
  data() {
    return {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      errors: {},
      showPassword: false,
      showConfirmPassword: false,
      loading: false,
      file: null,
      imagePreview: null,
      captchaToken: "",
      isValid: false,
      validating: null,
      validLabels: [
        "card",
        "document",
        "paper",
        "text",
        "envelope",
        "label",
        "rectangle",
        "dust",
      ],
    };
  },
  computed: {
    ...mapState("auth", ["error"]),
  },
  methods: {
    ...mapActions("auth", ["register", "loginWithGoogle"]),
    googleLogin() {
      const role = this.isOwner ? "owner" : "user";
      this.loginWithGoogle(role).then(() => {
        if (!this.isOwner) {
          toast.success(`Welcome! You have 3 free property views.`, {
            position: "top-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
          });
        }
      });
    },
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
    async submitRegister() {
      this.errors = {};

      if (!this.name) {
        this.errors.name = "Name is required";
      }
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
      if (!this.confirmPassword) {
        this.errors.confirmPassword = "Confirm your password";
      } else if (this.password !== this.confirmPassword) {
        this.errors.confirmPassword = "Passwords do not match";
      }
      if (!this.captchaToken) {
        this.errors.captcha = "Please complete the CAPTCHA";
      }
      if (this.isOwner && !this.file) {
        this.errors.file = "Please upload your ID";
      }

      if (Object.keys(this.errors).length > 0) return;

      this.loading = true;
      try {
        let idImageUrl;

        if (this.isOwner && this.file) {
          const folderName = `${this.name.toLowerCase().replace(/\s+/g, "-")}`;
          idImageUrl = await uploadToCloudinary(
            this.file,
            "unsigned_owner_upload",
            folderName
          );
        }

        const userData = {
          name: this.name,
          email: this.email,
          password: this.password,
          role: this.isOwner ? "owner" : "user",
          idImage: idImageUrl,
        };

        const result = await this.register(userData);
        this.$router.push({ name: "Home" }).then(() => {
          toast.success(result.message, {
            position: "top-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
          });
        });
      } catch (error) {
        if (error.code === "auth/email-already-in-use") {
          this.errors.server = "The email address is already in use.";
        } else {
          this.errors.server =
            error.message || "Registration failed. Please try again.";
        }
      } finally {
        this.loading = false;
      }
    },

    async handleFileChange(event) {
      const file = event.target.files[0];
      this.file = file;
      this.validating = "Preparing image data...";
      try {
        const isValid = await validateImage(this.file, (message) => {
          this.validating = message;
        });
        if (isValid) {
          this.isValid = true;
          this.imagePreview = URL.createObjectURL(this.file);
          this.validating = null;
        } else {
          this.errors.file =
            "Invalid ID image. Please upload a clear ID photo.";
          this.validating = null;
        }
      } catch (error) {
        this.errors.file = "Invalid ID image. Please upload a clear ID photo.";
        this.validating = null;
      }
    },
    removeImage() {
      this.imagePreview = null;
      this.file = null;
      this.isValid = false;
    },
    togglePassword() {
      this.showPassword = !this.showPassword;
    },

    toggleConfirmPassword() {
      this.showConfirmPassword = !this.showConfirmPassword;
    },
  },
  watch: {
    name() {
      this.errors.name = null;
    },
    email() {
      this.errors.email = null;
    },
    password() {
      this.errors.password = null;
    },
    confirmPassword() {
      this.errors.confirmPassword = null;
    },
    file() {
      this.errors.file = null;
    },
  },
  props: {
    actionlink: {
      type: String,
    },
    isOwner: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
    },
  },
};
</script>

<template>
  <div class="md:p-10 flex justify-center align-middle">
    <div
      class="container rounded-xl bg-[#364365] grid md:grid-cols-[1fr_1.5fr] grid-cols-1 lg:w-[75vw]"
    >
      <div class="img-container hidden md:block p-5 relative rounded-l-xl">
        <img
          src="@/assets/images/logo-black.png"
          class="bg-white w-30"
          loading="lazy"
        />
        <img
          class="rounded-r-xl absolute bottom-0 left-0"
          src="@/assets/images/login/register.png"
          loading="lazy"
        />
      </div>
      <div class="main-text p-8 rounded-r-xl bg-white">
        <h1 class="text-[#364365] text-3xl text-center font-bold pb-10">
          {{ title }}
        </h1>
        <form @submit.prevent="submitRegister" novalidate>
          <div class="mb-6">
            <label for="username" class="block mb-1 text-[#364365]">Name</label>
            <input
              v-model="name"
              type="text"
              id="username"
              name="name"
              class="border-b-2 border-gray-300 w-full focus:outline-none focus:border-black text-black"
              :class="{
                'border-red-500': errors.name,
                'border-gray-300': !errors.name,
              }"
            />
            <p v-if="errors.name" class="text-red-500 text-sm">
              {{ errors.name }}
            </p>
          </div>
          <div class="mb-6">
            <label for="email" class="block mb-1 text-[#364365]">Email</label>
            <input
              v-model="email"
              type="email"
              name="email"
              id="email"
              class="border-b-2 border-gray-300 w-full focus:outline-none focus:border-black text-black"
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
            <label for="password" class="block mb-1 text-[#364365]"
              >Password</label
            >
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              id="password"
              name="password"
              class="border-b-2 border-gray-300 w-full focus:outline-none focus:border-black text-black"
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
          </div>
          <div class="mb-6 relative">
            <label for="password" class="text-sm text-[#364365]"
              >Confirm Password</label
            >
            <input
              v-model="confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              name="password"
              class="border-b-2 border-gray-300 w-full focus:outline-none focus:border-black text-black"
              :class="{
                'border-red-500': errors.confirmPassword,
                'border-gray-300': !errors.confirmPassword,
              }"
            />
            <i
              :class="
                showConfirmPassword ? 'bi bi-eye-fill' : 'bi bi-eye-slash'
              "
              class="text-black absolute right-2 cursor-pointer"
              @click="toggleConfirmPassword"
            ></i>
            <p v-if="errors.confirmPassword" class="text-red-500 text-sm">
              {{ errors.confirmPassword }}
            </p>
          </div>
          <div
            v-if="isOwner && validating === null"
            class="text-center text-black"
          >
            <p class="font-medium p-2" v-if="!imagePreview">
              please upload your ID
            </p>
            <div v-if="imagePreview" class="p-5 mb-5">
              <div class="w-full mx-auto relative">
                <img :src="imagePreview" alt="Image Preview" />
                <button
                  @click="removeImage"
                  class="cursor-pointer absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                >
                  &times;
                </button>
              </div>
            </div>
            <div
              v-else
              class="border-1 border-stone-400 border-dashed p-5 mx-4 md:mx-10 mb-5"
            >
              <label for="file">
                <i
                  class="bi bi-cloud-upload text-5xl text-stone-400 cursor-pointer"
                ></i>
                <p>
                  Drag &amp; drop files or
                  <span
                    class="font-bold text-[#364365] cursor-pointer underline decoration-2"
                    >Browse</span
                  >
                </p>
              </label>
              <input
                type="file"
                id="file"
                class="hidden"
                @change="handleFileChange"
              />
              <p class="p-5 text-sm text-stone-400" v-if="!imagePreview">
                support JPEG, PNG, JPG
              </p>
              <p v-if="errors.file" class="text-red-500 text-sm">
                {{ errors.file }}
              </p>
            </div>
          </div>
          <p
            v-if="validating !== null"
            class="text-stone-400 text-sm mb-5 text-center"
          >
            {{ validating }}
          </p>
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
          <div v-if="errors.server" class="text-red-500 text-center mb-4">
            {{ errors.server }}
          </div>

          <button
            :disabled="isOwner && !isValid"
            type="submit"
            class="border shadow-xl w-full bg-[#364365] hover:bg-white hover:text-[#364365] hover:border-[#364365] text-white text-sm py-2 px-4 rounded-lg mt-6"
            :class="{
              'opacity-50 cursor-not-allowed': loading,
              'cursor-pointer': !loading,
              'opacity-50 cursor-not-allowed': isOwner && !isValid,
              'cursor-pointer': isValid,
            }"
          >
            {{ loading ? "Loading..." : "Create Account" }}
          </button>
        </form>
        <div>
          <div
            class="text-[#364365] font-medium text-sm flex justify-center align-baseline gap-2 my-4 text-center"
          >
            <span class="border-b-1 w-20 self-center"></span>
            <p>Or sign Up with</p>
            <span class="border-b-1 w-20 self-center"></span>
          </div>
          <div class="logs">
            <div class="flex justify-center align-center gap-2 p-5">
              <button
                class="cursor-pointer flex items-center gap-2 bg-white border border-gray-300 hover:border-gray-500 text-gray-700 py-2 px-4 rounded-lg"
                @click="googleLogin"
                :disabled="loading"
              >
                <i class="bi bi-google"></i>
                {{ loading ? "Signing in..." : "Google" }}
              </button>
            </div>
            <p class="text-black text-center">
              Already have an accoun?
              <a
                class="text-blue-500 hover:text-blue-600 cursor-pointer"
                @click.prevent="
                  $router.push({
                    name: 'login',
                  })
                "
                >Log In</a
              >
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
