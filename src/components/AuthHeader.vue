<template>
  <header
    class="sticky top-0 w-full transition-all px-2 sm:px-3 bg-creative z-20"
  >
    <div class="container mx-auto">
      <div class="flex justify-between items-center">
        <div class="logo">
          <router-link to="/" :aria-label="$t('home')" class="flex-shrink-0">
            <img
              :src="logoSrc"
              alt="logo"
              class="h-[50px] sm:h-[60px] md:h-[70px]"
            />
          </router-link>
        </div>
        <div class="flex items-center gap-2 sm:gap-4">
          <dark-toggle></dark-toggle>
          <div
            class="flex items-center gap-2 sm:gap-4"
            :class="currentLocale === 'ar' ? 'mr-auto' : 'ml-auto'"
          >
            <div class="relative inline-flex items-center">
              <div
                class="h-6 w-15 flex items-center justify-between bg-gray-300 dark:bg-gray-700 rounded-full cursor-pointer"
                @click="changeLanguage(currentLocale === 'en' ? 'ar' : 'en')"
              >
                <span
                  class="text-gray-600 text-xs md:text-sm z-10"
                  :class="
                    currentLocale === 'ar'
                      ? 'mr-1 dark:text-gray-200'
                      : 'ml-1.5 font-bold dark:text-gray-600'
                  "
                  >EN</span
                >
                <span
                  class="text-gray-600 text-xs md:text-sm z-10"
                  :class="
                    currentLocale === 'ar'
                      ? 'ml-2 md:ml-2.5 font-bold dark:text-gray-600'
                      : 'mr-2 dark:text-gray-200'
                  "
                  >ع</span
                >
                <div
                  class="bg-gray-200 rounded-full shadow-md transform transition-transform duration-300 absolute left-1"
                  :class="currentLocale === 'ar' ? 'w-6 h-5' : 'w-7 h-5'"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
  <!-- This is a spacer div to prevent content from being hidden behind the fixed header -->
  <div class="header-spacer"></div>
</template>

<script>
import arLogo from "@/assets/images/logo_ar.png"; // Adjust path
import enLogo from "@/assets/images/logo.png"; // Adjust path
import DarkToggle from "@/components/DarkToggle.vue";
export default {
  components: {
    DarkToggle,
  },
  data() {
    return {
      languages: [
        { code: "en", name: "English" },
        { code: "ar", name: "العربية" },
      ],
    };
  },
  computed: {
    currentLocale() {
      return this.$i18n.locale;
    },
    logoSrc() {
      return this.currentLocale === "ar" ? arLogo : enLogo;
    },
  },
  mounted() {
    const storedLocale = sessionStorage.getItem("locale");
    if (
      storedLocale &&
      this.languages.some((lang) => lang.code === storedLocale)
    ) {
      this.$i18n.locale = storedLocale;
      document.documentElement.dir = storedLocale === "ar" ? "rtl" : "ltr";
      document.documentElement.lang = storedLocale;
    }
  },
  methods: {
    async changeLanguage(locale) {
      if (this.currentLocale === locale) return;

      try {
        this.$store.dispatch("startLoading");
        this.$i18n.locale = locale;
        sessionStorage.setItem("locale", locale);
        document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
        document.documentElement.lang = locale;
        await new Promise((resolve) => setTimeout(resolve, 300)); // Optional delay
      } catch (error) {
        console.error("Failed to change language:", error);
        this.$i18n.locale = this.currentLocale;
        sessionStorage.setItem("locale", this.currentLocale);
        document.documentElement.dir =
          this.currentLocale === "ar" ? "rtl" : "ltr";
        document.documentElement.lang = this.currentLocale;
      } finally {
        this.$store.dispatch("stopLoading");
      }
    },
  },
};
</script>

<style scoped>
.bg-creative {
  background: linear-gradient(45deg, #364365, #3d4d74, #3a528f, #364365a0);
  background-size: 400% 400%;
  animation: gradientShift 15s ease infinite;
}

@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.w-18 {
  width: 4.5rem;
} /* Adjust as needed for toggle width */
</style>
