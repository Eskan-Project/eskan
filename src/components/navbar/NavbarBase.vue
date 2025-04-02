<template>
  <header
    :class="[
      'fixed top-0 w-full transition-all px-2 sm:px-3 bg-creative z-20',
      { 'shadow-lg': isSticky },
    ]"
  >
    <div class="container mx-auto flex items-center py-1">
      <router-link to="/" :aria-label="$t('home')" class="flex-shrink-0">
        <img
          class="h-[50px] sm:h-[60px] md:h-[70px]"
          :src="logoSrc"
          alt="Eskan Logo"
          loading="lazy"
        />
      </router-link>

      <nav class="hidden md:flex flex-grow justify-center space-x-6">
        <router-link
          v-for="item in navLinks"
          :key="item.path"
          :to="item.path"
          :class="[
            'text-white font-bold hover:text-gray-200 transition-colors',
            { 'border-b-2 border-white': $route.path === item.path },
          ]"
          @click="closeMenu"
        >
          {{ $t(item.label) }}
        </router-link>
      </nav>

      <div
        class="flex items-center gap-2 sm:gap-4"
        :class="currentLocale === 'ar' ? 'mr-auto' : 'ml-auto'"
      >
        <div class="relative inline-flex items-center">
          <div
            class="w-15 h-6 md:h-8 md:w-18 flex items-center justify-between bg-gray-300 rounded-full cursor-pointer"
            @click="changeLanguage(currentLocale === 'en' ? 'ar' : 'en')"
          >
            <span
              class="text-gray-600 text-xs md:text-sm z-10"
              :class="currentLocale === 'ar' ? 'mr-2' : 'ml-1.5 font-bold'"
              >EN</span
            >
            <span
              class="text-gray-600 text-xs md:text-sm z-10"
              :class="
                currentLocale === 'ar' ? 'ml-3 md:ml-4 font-bold' : 'mr-2'
              "
              >ع</span
            >
            <div
              class="bg-white w-7 h-5 md:w-8 md:h-6 rounded-full shadow-md transform transition-transform duration-300 absolute left-1"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <navbar-mobile-vue
      v-if="isMenuOpen"
      :navLinks="navLinks"
      @close-menu="closeMenu"
      :animate="isMenuOpen"
    />
  </header>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import NavbarMobileVue from "./NavbarMobile.vue";
import debounce from "lodash/debounce";
import arLogo from "@/assets/images/logo_ar.png";
import enLogo from "@/assets/images/logo.png";

export default {
  components: {
    NavbarMobileVue,
  },
  data() {
    return {
      languages: [
        { code: "en", name: "English" },
        { code: "ar", name: "العربية" },
      ],
      isSticky: false,
      isMenuOpen: false,
      isNotificationsOpen: false,
      isMobile: false,
      navLinks: [
        { label: "nav.home", path: "/" },
        { label: "nav.properties", path: "/properties" },
        { label: "nav.about", path: "/about" },
        { label: "nav.contact", path: "/contact" },
        { label: "nav.faqs", path: "/faq" },
      ],
    };
  },
  computed: {
    ...mapState("auth", ["isAuth", "userDetails"]),
    ...mapState("notifications", ["notifications"]),
    ...mapGetters("notifications", ["unreadCount"]),
    currentLocale() {
      return this.$i18n.locale;
    },
    logoSrc() {
      const logoPath = this.$t("nav.logo");
      return logoPath.includes("logo_ar") ? arLogo : enLogo;
    },
  },
  methods: {
    ...mapActions("auth", ["logout"]),
    ...mapActions("notifications", [
      "getNotifications",
      "removeNotification",
      "markAsRead",
    ]),
    async changeLanguage(locale) {
      // Prevent redundant changes
      if (this.currentLocale === locale) return;

      try {
        // Start loading immediately for better UX
        this.$store.dispatch("startLoading");

        // Update locale and persist it
        this.$i18n.locale = locale;
        sessionStorage.setItem("locale", locale);

        // Update document direction and language
        document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
        document.documentElement.lang = locale;

        // Simulate a delay for UI updates (optional, adjust as needed)
        await new Promise((resolve) => setTimeout(resolve, 300)); // Smooth transition
      } catch (error) {
        console.error("Failed to change language:", error);

        // Rollback to previous locale on failure (optional)
        this.$i18n.locale = this.currentLocale;
        sessionStorage.setItem("locale", this.currentLocale);
        document.documentElement.dir =
          this.currentLocale === "ar" ? "rtl" : "ltr";
        document.documentElement.lang = this.currentLocale;
      } finally {
        // Stop loading regardless of success or failure
        this.$store.dispatch("stopLoading");
      }
    },
    async fetchNotifications() {
      try {
        await this.getNotifications();
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    },
    handleScroll() {
      this.isSticky = window.scrollY > 0;
    },
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    toggleNotifications() {
      this.isNotificationsOpen = !this.isNotificationsOpen;
    },
    closeMenu() {
      this.isMenuOpen = false;
    },
    handleClickOutside(event) {
      const dropdown = this.$refs.notificationsDropdown;
      if (!this.isMobile && dropdown && !dropdown.contains(event.target)) {
        this.isNotificationsOpen = false;
      }
    },
    notifClicked(notif) {
      console.log("Notification clicked:", notif);
      this.markAsRead(notif.id);
      this.isNotificationsOpen = false;

      if (notif.type === "property_accepted") {
        console.log("Navigating to user profile");
        this.$router.push("/userProfile");
      } else {
        console.log("Not navigating:", notif.type);
      }
    },
    checkMobile: debounce(function () {
      this.isMobile = window.innerWidth < 768;
    }, 100),
  },
  mounted() {
    this.checkMobile();
    window.addEventListener("scroll", this.handleScroll, { passive: true });
    window.addEventListener("click", this.handleClickOutside, {
      passive: true,
    });
    window.addEventListener("resize", this.checkMobile);
    this.fetchNotifications();
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
    window.removeEventListener("click", this.handleClickOutside);
    window.removeEventListener("resize", this.checkMobile);
  },
};
</script>

<style scoped>
.transition-all {
  transition: all 0.3s ease-in-out;
}

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

.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
