<template>
  <div>
    <!-- Overlay -->
    <transition name="fade">
      <div
        v-if="isVisible"
        class="fixed inset-0 bg-[#3643656d] backdrop-blur-sm z-100"
        @click="closeMenu"
      ></div>
    </transition>

    <!-- Mobile Menu -->
    <transition name="slide">
      <ul
        v-if="isVisible"
        class="md:hidden flex flex-col bg-white w-64 sm:w-72 fixed top-0 right-0 h-full shadow-lg p-4 z-200"
      >
        <li class="flex justify-end mb-4">
          <button
            @click="closeMenu"
            class="text-gray-600 hover:text-gray-800 transition-colors"
            aria-label="Close menu"
          >
            <i class="bi bi-x text-2xl"></i>
          </button>
        </li>

        <!-- Main Navigation -->
        <li v-for="item in navLinks" :key="item.path">
          <router-link
            :to="item.path"
            class="block py-3 px-4 text-[var(--secondary-color)] font-medium text-base hover:bg-gray-100 rounded-md transition-colors"
            :class="{
              'bg-gray-100 border-l-4 border-[var(--secondary-color)]':
                $route.path === item.path,
            }"
            @click="closeMenu"
          >
            {{ $t(item.label) }}
          </router-link>
        </li>

        <!-- Auth Actions -->
        <li v-if="isAuth" class="mt-auto border-t pt-4">
          <router-link
            v-if="userDetails.role === 'owner'"
            to="/createProperty"
            class="flex items-center gap-2 py-3 px-4 text-[var(--secondary-color)] hover:bg-gray-100 rounded-md"
            @click="closeMenu"
          >
            <i class="bi bi-plus-circle"></i>
            {{ $t("nav.create_property") }}
          </router-link>

          <router-link
            v-if="userDetails.role === 'admin'"
            to="/admin"
            class="flex items-center gap-2 py-3 px-4 text-[var(--secondary-color)] hover:bg-gray-100 rounded-md"
            @click="closeMenu"
          >
            <i class="bi bi-person-fill-gear"></i>
            {{ $t("nav.admin_dashboard") }}
          </router-link>

          <!-- Profile link for all authenticated users -->
          <router-link
            to="/userProfile"
            class="flex items-center gap-2 py-3 px-4 text-[var(--secondary-color)] hover:bg-gray-100 rounded-md"
            @click="closeMenu"
          >
            <i class="bi bi-person"></i>
            {{ $t("nav.user_profile") }}
          </router-link>

          <button
            @click="logoutAndClose"
            class="flex items-center gap-2 py-3 px-4 text-red-600 hover:bg-gray-100 rounded-md w-full text-left"
          >
            <i class="bi bi-box-arrow-in-right"></i>
            {{ $t("nav.logout") }}
          </button>
        </li>

        <li v-else class="mt-auto border-t pt-4">
          <router-link
            to="/login"
            class="flex items-center gap-2 py-3 px-4 text-[var(--secondary-color)] hover:bg-gray-100 rounded-md"
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
  computed: {
    isVisible() {
      return this.$parent.isMenuOpen;
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
  },
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease, box-shadow 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
  box-shadow: none;
}
</style>
