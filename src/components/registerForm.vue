<template>
  <auth-header />
  <div
    class="md:p-10 flex justify-center items-center h-screen bg-gray-50 dark:bg-[#111827]"
    :class="{ 'mt-30 md:mt-5': isOwner }"
  >
    <div class="container rounded-xl bg-[#364365] w-full md:w-1/2 shadow-md">
      <div class="main-text p-8 rounded-r-xl bg-white dark:bg-[#1F2937]">
        <h1
          class="text-[#364365] dark:text-white text-3xl text-center font-bold pb-10"
        >
          {{ $t("auth.register.title") }}
        </h1>
        <form @submit.prevent="submitRegister" novalidate>
          <div class="mb-3">
            <label
              for="username"
              class="block mb-0 md:mb-1 text-[#364365] dark:text-white"
              >{{ $t("auth.register.name") }}</label
            >
            <input
              v-model="name"
              type="text"
              id="username"
              name="name"
              class="border-b-2 dark:border-gray-600 w-full outline-none focus:outline-none text-black dark:text-white dark:bg-[#1F2937]"
              :class="{
                'border-red-500': errors.name,
                'border-gray-300 dark:border-gray-600': !errors.name,
              }"
            />
            <p v-if="errors.name" class="text-red-500 text-sm">
              {{ errors.name }}
            </p>
          </div>
          <div class="mb-3">
            <label
              for="email"
              class="block mb-0 md:mb-1 text-[#364365] dark:text-white"
              >{{ $t("auth.register.email") }}</label
            >
            <input
              v-model="email"
              type="email"
              name="email"
              id="email"
              class="border-b-2 border-gray-300 dark:border-gray-600 w-full focus:outline-none focus:border-black dark:focus:border-white text-black dark:text-white dark:bg-[#1F2937]"
              :class="{
                'border-red-500': errors.email,
                'border-gray-300 dark:border-gray-600': !errors.email,
              }"
            />
            <p v-if="errors.email" class="text-red-500 text-sm">
              {{ errors.email }}
            </p>
          </div>
          <div class="mb-3 relative">
            <label
              for="password"
              class="block mb-0 md:mb-1 text-[#364365] dark:text-white"
              >{{ $t("auth.register.password") }}</label
            >
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              id="password"
              name="password"
              class="border-b-2 border-gray-300 dark:border-gray-600 w-full focus:outline-none focus:border-black dark:focus:border-white text-black dark:text-white dark:bg-[#1F2937]"
              :class="{
                'border-red-500': errors.password,
                'border-gray-300 dark:border-gray-600': !errors.password,
              }"
            />
            <i
              :class="[
                showPassword ? 'bi bi-eye-fill' : 'bi bi-eye-slash',
                'text-black dark:text-white absolute cursor-pointer',
                $i18n.locale === 'ar' ? 'left-2 top-1/2' : 'right-2 top-1/2',
              ]"
              @click="togglePassword"
            ></i>
            <p v-if="errors.password" class="text-red-500 text-sm">
              {{ errors.password }}
            </p>
          </div>
          <div class="mb-3 relative">
            <label
              for="password"
              class="text-sm text-[#364365] dark:text-white"
              >{{ $t("auth.register.confirm_password") }}</label
            >
            <input
              v-model="confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              name="password"
              class="border-b-2 border-gray-300 dark:border-gray-600 w-full focus:outline-none focus:border-black dark:focus:border-white text-black dark:text-white dark:bg-[#1F2937]"
              :class="{
                'border-red-500': errors.confirmPassword,
                'border-gray-300 dark:border-gray-600': !errors.confirmPassword,
              }"
            />
            <i
              :class="[
                showConfirmPassword ? 'bi bi-eye-fill' : 'bi bi-eye-slash',
                'text-black dark:text-white absolute cursor-pointer',
                $i18n.locale === 'ar' ? 'left-2 top-1/2' : 'right-2 top-1/2',
              ]"
              @click="toggleConfirmPassword"
            ></i>
            <p v-if="errors.confirmPassword" class="text-red-500 text-sm">
              {{ errors.confirmPassword }}
            </p>
          </div>
          <div
            v-if="isOwner && validating === null"
            class="text-center text-black dark:text-white"
          >
            <p class="font-medium p-2" v-if="!imagePreview">
              {{ $t("auth.upload_id.title") }}
            </p>
            <div v-if="imagePreview" class="p-5 mb-3">
              <div class="w-1/3 mx-auto relative">
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
              class="border-1 border-stone-400 dark:border-gray-600 border-dashed p-3 mx-4 md:mx-8 mb-3"
            >
              <label for="file">
                <i
                  class="bi bi-cloud-upload text-5xl text-stone-400 dark:text-gray-400 cursor-pointer"
                ></i>
                <p>
                  {{ $t("auth.upload_id.drag_drop") }}
                  <span
                    class="font-bold text-[#364365] dark:text-[#3D8BFF] cursor-pointer underline decoration-2"
                    >{{ $t("auth.upload_id.browse") }}</span
                  >
                </p>
              </label>
              <input
                type="file"
                id="file"
                class="hidden"
                @change="handleFileChange"
              />
              <p
                class="p-5 text-sm text-stone-400 dark:text-gray-400"
                v-if="!imagePreview"
              >
                {{ $t("auth.upload_id.supported_formats") }}
              </p>
              <p v-if="errors.file" class="text-red-500 text-sm">
                {{ errors.file }}
              </p>
            </div>
          </div>
          <p
            v-if="validating !== null"
            class="text-stone-400 dark:text-gray-300 text-sm mb-3 text-center"
          >
            {{ validating }}
          </p>
          <div
            class="mb-3 flex flex-col gap-3 justify-center items-center text-gray-500 dark:text-gray-400"
          >
            <Turnstile
              @turnstileVerified="handleTurnstileVerified"
              @turnstileExpired="handleTurnstileExpired"
              @turnstileError="handleTurnstileError"
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
            class="cursor-pointer border shadow-xl w-full bg-[#364365] dark:bg-[#3D8BFF] hover:bg-white hover:text-[#364365] dark:hover:bg-[#1F2937] dark:hover:text-[#3D8BFF] hover:border-[#364365] dark:hover:border-[#3D8BFF] text-white text-sm py-2 px-4 rounded-lg mt-3"
            :class="{
              'opacity-50 cursor-not-allowed': loading,
              'cursor-pointer': !loading,
              'opacity-50 !cursor-not-allowed': isOwner && !isValid,
            }"
          >
            {{
              loading
                ? $t("auth.register.loading")
                : $t("auth.register.create_account")
            }}
          </button>
        </form>
        <div>
          <div
            class="text-[#364365] dark:text-white font-medium text-sm flex justify-center align-baseline gap-2 my-3 text-center"
          >
            <span
              class="border-b-1 w-20 self-center dark:border-gray-600"
            ></span>
            <p>{{ $t("auth.register.or_sign_up_with") }}</p>
            <span
              class="border-b-1 w-20 self-center dark:border-gray-600"
            ></span>
          </div>
          <div class="logs">
            <div class="flex justify-center align-center gap-2 p-3">
              <button
                class="cursor-pointer flex items-center gap-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:border-gray-500 dark:hover:border-gray-400 text-gray-700 dark:text-white py-2 px-4 rounded-lg"
                @click="googleLogin"
                :disabled="loading"
              >
                <i class="bi bi-google"></i>
                {{
                  loading
                    ? $t("auth.login.signing_in")
                    : $t("auth.login.google")
                }}
              </button>
            </div>
            <p class="text-black dark:text-white text-center">
              {{ $t("auth.register.have_account") }}
              <a
                class="text-blue-500 dark:text-[#3D8BFF] hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
                @click.prevent="
                  $router.push({
                    name: 'login',
                  })
                "
                >{{ $t("auth.register.log_in") }}</a
              >
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
import uploadToCloudinary from "@/services/uploadToCloudinary";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import { validateImage } from "@/services/imageValidationService";
import Turnstile from "./Turnstile.vue";
import AuthHeader from "./AuthHeader.vue";
export default {
  components: {
    Turnstile,
    AuthHeader,
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
    validationMessage() {
      return this.$t("auth.upload_id.validation.validating_id");
    },
  },
  mounted() {
    // Load Cloudflare Turnstile script
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    // Initialize Turnstile widget
    script.onload = () => {
      window.turnstile.render(this.$refs.turnstileWidget, {
        sitekey: "0x4AAAAAAABkMYinukS8Ncow",
        callback: (token) => {
          this.captchaToken = token;
          this.errors.captcha = null;
        },
        "expired-callback": () => {
          this.captchaToken = null;
          this.errors.captcha = this.$t(
            "auth.register.validation.captcha_expired"
          );
        },
      });
    };
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
    handleTurnstileVerified(token) {
      this.captchaToken = token;
      this.errors.captcha = null;
    },
    handleTurnstileExpired() {
      this.captchaToken = null;
      this.errors.captcha = this.$t("auth.register.validation.captcha_expired");
    },
    handleTurnstileError() {
      this.captchaToken = null;
      this.errors.captcha = this.$t("auth.register.validation.captcha_failed");
    },
    async submitRegister() {
      this.errors = {};

      if (!this.name) {
        this.errors.name = this.$t("auth.register.validation.name_required");
      }
      if (!this.email) {
        this.errors.email = this.$t("auth.register.validation.email_required");
      } else if (!/^\S+@\S+\.\S+$/.test(this.email)) {
        this.errors.email = this.$t("auth.register.validation.email_invalid");
      }
      if (!this.password) {
        this.errors.password = this.$t(
          "auth.register.validation.password_required"
        );
      } else if (this.password.length < 6) {
        this.errors.password = this.$t(
          "auth.register.validation.password_length"
        );
      }
      if (!this.confirmPassword) {
        this.errors.confirmPassword = this.$t(
          "auth.register.validation.confirm_required"
        );
      } else if (this.password !== this.confirmPassword) {
        this.errors.confirmPassword = this.$t(
          "auth.register.validation.password_match"
        );
      }
      if (!this.captchaToken) {
        this.errors.captcha = this.$t(
          "auth.register.validation.captcha_required"
        );
      }
      if (this.isOwner && !this.file) {
        this.errors.file = this.$t("auth.register.validation.id_required");
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
          this.errors.server = this.$t("auth.register.validation.email_in_use");
        } else {
          this.errors.server =
            error.message ||
            this.$t("auth.register.validation.registration_failed");
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
        const isValid = await validateImage(
          file,
          this.validationMessage,
          (message) => {
            this.validating = message;
          }
        );
        if (isValid) {
          this.isValid = true;
          this.imagePreview = URL.createObjectURL(this.file);
          this.validating = null;
        } else {
          this.errors.file = this.$t("auth.upload_id.validation.invalid_id");
          this.validating = null;
        }
      } catch (error) {
        this.errors.file = this.$t("auth.upload_id.validation.error");
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

<style scoped>
input:focus {
  outline: none !important;
}
</style>
