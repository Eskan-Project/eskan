<template>
  <div :dir="currentLocale === 'ar' ? 'rtl' : 'ltr'">
    <!-- Overlay -->
    <transition name="fade">
      <div
        v-if="isVisible"
        class="fixed inset-0 bg-[#3643656d] backdrop-blur-sm z-100"
        @click="closeMenu"
      ></div>
    </transition>

    <!-- Mobile Menu -->
    <!-- Updating mobile menu for dark mode -->
    <transition name="slide">
      <ul
        v-if="isVisible"
        class="md:hidden flex flex-col bg-white dark:bg-gray-800 w-64 sm:w-72 fixed top-0 h-full shadow-lg p-4 z-200"
        :class="[currentLocale === 'ar' ? 'left-0' : 'right-0']"
      >
        <li
          :class="[
            'flex mb-4',
            currentLocale === 'ar' ? 'justify-start' : 'justify-end',
          ]"
        >
          <button
            @click="closeMenu"
            class="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
            aria-label="Close menu"
          >
            <i class="bi bi-x text-2xl"></i>
          </button>
        </li>

        <!-- Main Navigation -->
        <li v-for="item in navLinks" :key="item.path">
          <router-link
            :to="item.path"
            class="block py-3 px-4 text-[var(--secondary-color)] dark:text-white font-medium text-base hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            :class="{
              'bg-gray-100 dark:bg-gray-700': $route.path === item.path,
              'border-r-4 border-[var(--secondary-color)]':
                $route.path === item.path && currentLocale === 'ar',
              'border-l-4 border-[var(--secondary-color)]':
                $route.path === item.path && currentLocale === 'en',
            }"
            @click="closeMenu"
          >
            {{ $t(item.label) }}
          </router-link>
        </li>

        <!-- Language Switcher -->
        <li class="py-3 px-4">
          <div
            class="flex items-center gap-2 text-[var(--secondary-color)] dark:text-white"
          >
            <i class="bi bi-globe"></i>
            <button
              class="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded transition-colors"
              @click="changeLanguage(currentLocale === 'en' ? 'ar' : 'en')"
            >
              {{ currentLocale === "ar" ? "English" : "العربية" }}
            </button>
          </div>
        </li>

        <!-- Auth Actions -->
        <li v-if="isAuth" class="mt-auto border-t dark:border-gray-600 pt-4">
          <router-link
            v-if="userDetails.role === 'owner'"
            to="/createProperty"
            class="flex items-center gap-2 py-3 px-4 text-[var(--secondary-color)] dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
            @click="closeMenu"
          >
            <i class="bi bi-plus-circle"></i>
            {{ $t("nav.create_property") }}
          </router-link>

          <router-link
            v-if="userDetails.role === 'admin'"
            to="/admin"
            class="flex items-center gap-2 py-3 px-4 text-[var(--secondary-color)] dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
            @click="closeMenu"
          >
            <i class="bi bi-person-fill-gear"></i>
            {{ $t("nav.admin_dashboard") }}
          </router-link>

          <!-- Profile link for all authenticated users -->
          <router-link
            to="/userProfile"
            class="flex items-center gap-2 py-3 px-4 text-[var(--secondary-color)] dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
            @click="closeMenu"
          >
            <i class="bi bi-person"></i>
            {{ $t("nav.user_profile") }}
          </router-link>

          <button
            @click="logoutAndClose"
            class="flex items-center gap-2 py-3 px-4 text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md w-full text-left"
          >
            <i class="bi bi-box-arrow-in-right"></i>
            {{ $t("nav.logout") }}
          </button>
        </li>

        <li v-else class="mt-auto border-t dark:border-gray-600 pt-4">
          <router-link
            to="/login"
            class="flex items-center gap-2 py-3 px-4 text-[var(--secondary-color)] dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
            @click="closeMenu"
          >
            <i class="bi bi-box-arrow-in-right"></i>
            {{ $t("nav.login") }}
          </router-link>
        </li>
      </ul>
    </transition>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  props: {
    navLinks: {
      type: Array,
      required: true,
    },
  },
  watch: {
    currentLocale: {
      immediate: true,
      handler(locale) {
        document.documentElement.style.setProperty(
          "--slide-direction",
          locale === "ar" ? "100%" : "-100%"
        );
      },
    },
  },
  computed: {
    isVisible() {
      return this.$parent.isMenuOpen;
    },
    currentLocale() {
      return this.$i18n.locale;
    },
    ...mapState("auth", ["isAuth", "userDetails"]),
  },
  methods: {
    closeMenu() {
      this.$emit("close-menu");
    },
    logoutAndClose() {
      this.$store.dispatch("auth/logout");
      this.closeMenu();
    },
    changeLanguage(locale) {
      this.$i18n.locale = locale;
      localStorage.setItem("locale", locale);
      document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
      document.documentElement.lang = locale;
    },
  },
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active,
.slide-enter-from,
.slide-leave-to {
  transform: translateX(var(--slide-direction));
  opacity: 0;
  box-shadow: none;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease, box-shadow 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(var(--slide-direction));
  opacity: 0;
  box-shadow: none;
}
</style>
