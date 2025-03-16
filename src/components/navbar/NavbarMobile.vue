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
          >
            <i class="bi bi-x text-2xl"></i>
          </button>
        </li>
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
            {{ item.label }}
          </router-link>
        </li>
      </ul>
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    navLinks: {
      type: Array,
      required: true,
    },
  },
  computed: {
    isVisible() {
      return this.$parent.isMenuOpen; // Sync with parent state
    },
  },
  methods: {
    closeMenu() {
      this.$emit("close-menu");
    },
  },
};
</script>

<style scoped>
/* Overlay Fade Animation */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}

/* Menu Slide Animation */
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
.slide-enter-to,
.slide-leave-from {
  transform: translateX(0);
  opacity: 1;
  box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
}
</style>
