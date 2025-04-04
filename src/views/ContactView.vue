<template>
  <section
    class="py-16 md:py-20 lg:py-24 min-h-screen px-4 sm:px-6 lg:px-8 mt-3 sm:mt-0 bg-gray-50 dark:bg-[#111827]"
  >
    <div class="mx-auto max-w-7xl">
      <transition name="fade-out" appear>
        <div
          v-if="!formSubmitted && !errorMessage"
          class="grid grid-cols-1 lg:grid-cols-2 gap-6 md:bg-white dark:md:bg-[#1F2937] rounded-2xl shadow-md overflow-hidden"
        >
          <!-- Image and Contact Info Section -->
          <div class="relative flex flex-col justify-between">
            <img
              src="../assets/images/contact/contact-1.jpg"
              loading="lazy"
              alt="Contact Us"
              class="w-full h-48 sm:h-64 md:h-full object-cover rounded-t-2xl md:rounded-none md:rounded-l-2xl"
            />
            <div class="absolute top-4 left-4 sm:top-6 sm:left-6"></div>
            <div
              class="p-4 sm:p-6 md:p-8 bg-white dark:bg-[#1F2937] md:bg-transparent md:dark:bg-transparent md:absolute md:bottom-0 md:w-full"
            >
              <div
                class="bg-white dark:bg-[#1F2937] rounded-lg p-4 sm:p-6 shadow-md md:shadow-none"
                dir="ltr"
              >
                <a href="tel:4706011911" class="flex items-center mb-4 sm:mb-6">
                  <i
                    class="bi bi-telephone text-lg sm:text-xl text-gray-700 dark:text-[#3D8BFF]"
                  ></i>
                  <h5
                    class="text-black dark:text-white text-sm sm:text-base font-normal ml-4"
                  >
                    470-601-1911
                  </h5>
                </a>
                <a
                  href="mailto:EskanTeam@gmail.com"
                  class="flex items-center mb-4 sm:mb-6"
                >
                  <i
                    class="bi bi-envelope text-lg sm:text-xl text-gray-700 dark:text-[#3D8BFF]"
                  ></i>
                  <h5
                    class="text-black dark:text-white text-sm sm:text-base font-normal ml-4 break-all"
                  >
                    EskanTeam@gmail.com
                  </h5>
                </a>
                <a href="#" class="flex items-center">
                  <i
                    class="bi bi-geo-alt text-lg sm:text-xl text-gray-700 dark:text-[#3D8BFF]"
                  ></i>
                  <h5
                    class="text-black dark:text-white text-sm sm:text-base font-normal ml-4"
                  >
                    Cairo, Egypt
                  </h5>
                </a>
              </div>
            </div>
          </div>

          <!-- Form Section -->
          <div class="p-4 sm:p-6 md:p-8 lg:p-10 text-[#364365] dark:text-white">
            <h2
              class="text-center font-manrope text-2xl sm:text-3xl md:text-4xl font-semibold leading-tight mb-6"
            >
              {{ $t("contact.send_message") }}
            </h2>
            <form @submit.prevent="submitForm" class="space-y-4 sm:space-y-6">
              <input
                type="text"
                v-model="formData.name"
                class="w-full h-11 sm:h-12 text-gray-600 dark:text-white placeholder-gray-400 dark:placeholder-gray-300 bg-transparent text-sm sm:text-base font-normal rounded-full border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#364365] dark:focus:ring-[#3D8BFF] px-4 dark:bg-[#1F2937]"
                :placeholder="$t('contact.name')"
              />
              <input
                type="email"
                v-model="formData.email"
                class="w-full h-11 sm:h-12 text-gray-600 dark:text-white placeholder-gray-400 dark:placeholder-gray-300 bg-transparent text-sm sm:text-base font-normal rounded-full border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#364365] dark:focus:ring-[#3D8BFF] px-4 dark:bg-[#1F2937]"
                :placeholder="$t('contact.email')"
              />
              <input
                type="tel"
                v-model="formData.phone"
                class="w-full h-11 sm:h-12 text-gray-600 dark:text-white placeholder-gray-400 dark:placeholder-gray-300 bg-transparent text-sm sm:text-base font-normal rounded-full border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#364365] dark:focus:ring-[#3D8BFF] px-4 dark:bg-[#1F2937]"
                :placeholder="$t('contact.phone')"
                :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'"
              />
              <textarea
                v-model="formData.message"
                class="resize-none w-full h-20 sm:h-24 text-gray-600 dark:text-white placeholder-gray-400 dark:placeholder-gray-300 bg-transparent text-sm sm:text-base font-normal rounded-xl border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#364365] dark:focus:ring-[#3D8BFF] px-4 py-3 dark:bg-[#1F2937]"
                :placeholder="$t('contact.message')"
              ></textarea>
              <button
                type="submit"
                :disabled="isSubmitting"
                class="w-full h-11 sm:h-12 text-white text-sm sm:text-base font-semibold rounded-full bg-[#364365] hover:bg-white hover:text-[#364365] dark:hover:bg-[#3D8BFF] dark:hover:text-white hover:border-2 hover:border-[#364365] dark:hover:border-[#3D8BFF] transition-all duration-300 shadow-sm disabled:opacity-50"
              >
                {{ isSubmitting ? $t("contact.sending") : $t("contact.send") }}
              </button>
            </form>
          </div>
        </div>
      </transition>
    </div>
  </section>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      formData: {
        name: "",
        email: "",
        phone: "",
        message: "",
      },
      isSubmitting: false,
      formSubmitted: false,
      errorMessage: null,
      searchQuery: "",
    };
  },
  methods: {
    async submitForm() {
      this.isSubmitting = true;
      this.errorMessage = null;

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/send-email`,
          this.formData,
          { headers: { "Content-Type": "application/json" } }
        );
        if (response.status === 200) {
          this.formSubmitted = true;
          this.resetForm();
          setTimeout(() => {
            this.$router.push("/");
          }, 2000);
        }
      } catch (error) {
        console.error("Error:", error);
        this.errorMessage = this.$t("contact.error");
        setTimeout(() => {
          this.$router.push("/");
        }, 2000);
      } finally {
        this.isSubmitting = false;
      }
    },
    resetForm() {
      this.formData = { name: "", email: "", phone: "", message: "" };
    },
    performSearch() {
      if (this.searchQuery.trim()) {
        // Navigate to properties page with search query
        this.$router.push({
          path: "/properties",
          query: { search: this.searchQuery },
        });
      }
    },
  },
};
</script>

<style scoped>
.fade-out-enter-active,
.fade-out-leave-active {
  transition: opacity 0.5s ease;
}
.fade-out-enter-from,
.fade-out-leave-to {
  opacity: 0;
}
</style>
