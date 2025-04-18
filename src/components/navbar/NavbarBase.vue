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
            'text-white font-bold hover:text-gray-200 transition-colors focus:outline-none!',
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
        <div class="relative items-center hidden md:inline-flex">
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

        <dark-toggle></dark-toggle>
        <button
          @click="toggleMenu"
          class="md:hidden text-3xl text-white cursor-pointer relative order-last"
          :aria-label="isMenuOpen ? 'Close Menu' : 'Open Menu'"
        >
          <i :class="isMenuOpen ? 'bi bi-x' : 'bi bi-list'"></i>
        </button>
        <div
          v-if="isAuth"
          class="relative text-xl sm:text-2xl cursor-pointer"
          ref="notificationsDropdown"
          @click="toggleNotifications"
          aria-label="Toggle notifications"
          title="Notifications"
        >
          <i
            class="bi bi-bell hover:text-gray-400 transition-colors md:text-3xl text-lg"
          ></i>
          <span
            v-if="unreadCount"
            class="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full"
          >
            {{ unreadCount }}
          </span>
        </div>
        <transition :name="isMobile ? 'slide-up' : 'dropdown'">
          <div
            v-if="isNotificationsOpen"
            :class="[
              isMobile
                ? 'fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 rounded-t-xl shadow-lg p-4 max-h-[70vh] z-30'
                : 'absolute top-20 w-full md:w-64 right-30 bg-white dark:bg-gray-800 p-3 shadow-lg rounded-md max-h-[40vh]',
              'overflow-y-auto',
            ]"
          >
            <div v-if="isMobile" class="flex justify-between items-center mb-4">
              <h3
                class="text-lg font-semibold text-[var(--secondary-color)] dark:text-white"
              >
                {{ $t("nav.notifications") }}
              </h3>
              <button
                @click.stop="toggleNotifications"
                class="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
              >
                <i class="bi bi-x text-xl"></i>
              </button>
            </div>
            <div v-if="notifications.length" class="space-y-2">
              <div
                v-for="notif in notifications"
                :key="notif.id"
                @click="notifClicked(notif)"
                :class="[
                  'flex justify-between items-center p-2 rounded cursor-pointer transition-colors text-xs sm:text-sm',
                  notif.read
                    ? 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                    : 'text-black dark:text-white bg-blue-50 dark:bg-blue-900 font-semibold hover:bg-blue-100 dark:hover:bg-blue-800',
                ]"
              >
                <span class="flex-1">{{ notif.message }}</span>
                <button
                  @click.stop="removeNotification(notif.id)"
                  class="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors ml-1"
                  title="Dismiss"
                >
                  ✖
                </button>
              </div>
            </div>
            <p
              v-else
              class="p-2 text-gray-500 dark:text-gray-400 text-sm text-center"
            >
              {{ $t("nav.no_notifications") }}
            </p>
          </div>
        </transition>

        <!-- Overlay for mobile bottom sheet -->
        <transition name="fade">
          <div
            v-if="isNotificationsOpen && isMobile"
            class="fixed inset-0 bg-gray-900/50 z-20"
            @click.stop="toggleNotifications"
          ></div>
        </transition>

        <!-- Mobile Menu Toggle -->
        <router-link
          v-if="userDetails.role === 'owner'"
          to="/createProperty"
          :title="$t('nav.create_property')"
          class="hidden md:block bg-white px-0.5 py-0.1 md:px-2 md:py-1 text-[var(--secondary-color)] rounded-full border border-white hover:bg-[var(--secondary-color)] hover:text-white transition-all"
        >
          <i class="bi bi-plus-circle text-sm md:text-2xl"></i>
        </router-link>
        <router-link
          v-if="userDetails.role === 'admin'"
          to="/admin"
          :title="$t('nav.admin_dashboard')"
          class="hidden md:block bg-white px-0.5 py-0.1 md:px-2 md:py-1 text-[var(--secondary-color)] rounded-full border border-white hover:bg-[var(--secondary-color)] hover:text-white transition-all"
        >
          <i class="bi bi-person-fill-gear text-sm md:text-2xl"></i>
        </router-link>

        <router-link
          v-if="isAuth && userDetails.role !== 'admin'"
          to="/userProfile"
          :title="$t('nav.user_profile')"
          class="hidden md:block bg-white px-0.5 py-0.1 md:px-2 md:py-1 text-[var(--secondary-color)] rounded-full border border-white hover:bg-[var(--secondary-color)] hover:text-white transition-all"
        >
          <i class="bi bi-person text-sm md:text-2xl"></i>
        </router-link>

        <button
          v-if="isAuth"
          :title="$t('nav.logout')"
          @click="logout"
          class="cursor-pointer hidden md:block bg-white px-0.5 py-0.1 md:px-2 md:py-1 text-[var(--secondary-color)] rounded border border-white hover:bg-[var(--secondary-color)] hover:text-white transition-all"
        >
          <i
            :class="
              this.$i18n.locale === 'ar'
                ? 'bi bi-box-arrow-in-left text-sm md:text-xl'
                : 'bi bi-box-arrow-in-right text-sm md:text-xl'
            "
          ></i>
        </button>

        <button
          v-else
          @click="$router.push('/login')"
          class="items-center hidden md:flex gap-1 px-2 md:px-4 py-1 md:py-2 text-xs md:text-base text-white font-bold border border-white rounded hover:bg-white hover:text-[var(--secondary-color)] transition-all cursor-pointer"
        >
          {{ $t("nav.login") }}
          <i
            :class="
              this.$i18n.locale === 'ar'
                ? 'bi bi-box-arrow-in-left'
                : 'bi bi-box-arrow-in-right'
            "
          ></i>
        </button>
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
import DarkToggle from "../DarkToggle.vue";

export default {
  components: {
    NavbarMobileVue,
    DarkToggle,
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
        localStorage.setItem("locale", locale);

        // Update document direction and language
        document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
        document.documentElement.lang = locale;

        // Simulate a delay for UI updates (optional, adjust as needed)
        await new Promise((resolve) => setTimeout(resolve, 300)); // Smooth transition

        // Optionally reload or fetch localized data if required
        // Example: await this.fetchLocalizedContent();

        // Notify user of success (optional)
        this.$toast.success(
          this.$t("language_switch_success", {
            lang: locale === "ar" ? "العربية" : "English",
          }),
          { position: "top-left", autoClose: 3000 }
        );
      } catch (error) {
        console.error("Failed to change language:", error);
        this.$toast.error(this.$t("language_switch_error"), {
          position: "top-left",
          autoClose: 5000,
        });

        // Rollback to previous locale on failure (optional)
        this.$i18n.locale = this.currentLocale;
        localStorage.setItem("locale", this.currentLocale);
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
@import "tailwindcss";
@custom-variant dark (&:where(.dark, .dark *));
.transition-all {
  transition: all 0.3s ease-in-out;
}

.bg-creative {
  background: linear-gradient(45deg, #364365, #3d4d74, #3a528f, #364365a0);
  background-size: 400% 400%;
  animation: gradientShift 15s ease infinite;
}

/* Dark mode version of the creative background */
:global(.dark) .bg-creative {
  background: linear-gradient(45deg, #1a2036, #212a40, #1e2a4d, #1a2036a0);
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
