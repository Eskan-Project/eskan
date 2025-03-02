<template>
  <header
    :class="{ 'shadow-lg': isSticky }"
    class="fixed top-0 w-full transition-all px-3"
    style="background-color: var(--secondary-color)"
  >
    <div class="container mx-auto flex items-center py-1">
      <!-- Logo -->
      <img
        class="w-[150px] h-[70px]"
        src="../assets/images/logo.png"
        alt="Logo"
      />

      <!-- Desktop Navigation -->
      <ul class="hidden md:flex flex-grow justify-center space-x-6">
        <li>
          <router-link
            :class="{
              'text-white font-bold hover:text-gray-200': true,
              'border-b-2 border-white': $route.path === '/',
            }"
            to="/"
            @click="closeMenu"
          >
            Home
          </router-link>
        </li>
        <li>
          <router-link
            :class="{
              'text-white font-bold hover:text-gray-200': true,
              'border-b-2 border-white': $route.path === '/properties',
            }"
            to="/properties"
            @click="closeMenu"
          >
            Properties
          </router-link>
        </li>
        <li>
          <router-link
            :class="{
              'text-white font-bold hover:text-gray-200': true,
              'border-b-2 border-white': $route.path === '/about',
            }"
            to="/about"
            @click="closeMenu"
          >
            About
          </router-link>
        </li>
        <li>
          <router-link
            :class="{
              'text-white font-bold hover:text-gray-200': true,
              'border-b-2 border-white': $route.path === '/contact',
            }"
            to="/contact"
            @click="closeMenu"
          >
            Contact
          </router-link>
        </li>
      </ul>

      <!-- Right Section (Icons and Button) -->
      <div class="flex items-center gap-2 ml-auto">
        <!-- Brightness Icon -->
        <i
          class="bi bi-brightness-high text-lg text-white hidden md:block mr-2"
          aria-label="Cart"
        ></i>

        <!-- Login Button -->
        <button
          class="flex items-center gap-1 px-4 py-2 text-white font-bold border border-white rounded hover:bg-white hover:text-secondary transition-all"
        >
          Log IN <i class="bi bi-box-arrow-in-right"></i>
        </button>

        <!-- Mobile Menu Toggle -->
        <i
          class="bi bi-list text-3xl text-white md:hidden ml-2 cursor-pointer"
          @click="toggleMenu"
          aria-label="Toggle Navigation"
        ></i>
      </div>
    </div>

    <!-- Mobile Navigation Menu -->
    <ul
      v-if="isMenuOpen"
      class="md:hidden flex flex-col bg-white p-3 absolute top-full right-0 shadow-lg"
      style="width: 200px; max-width: 80%"
    >
      <li>
        <router-link
          class="block py-2 px-4 text-secondary hover:bg-gray-100"
          to="/"
          @click="closeMenu"
        >
          Home
        </router-link>
      </li>
      <li>
        <router-link
          class="block py-2 px-4 text-secondary hover:bg-gray-100"
          to="/properties"
          @click="closeMenu"
        >
          Properties
        </router-link>
      </li>
      <li>
        <router-link
          class="block py-2 px-4 text-secondary hover:bg-gray-100"
          to="/about"
          @click="closeMenu"
        >
          About
        </router-link>
      </li>
      <li>
        <router-link
          class="block py-2 px-4 text-secondary hover:bg-gray-100"
          to="/contact"
          @click="closeMenu"
        >
          Contact
        </router-link>
      </li>
    </ul>
  </header>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from "vue";

export default {
  setup() {
    const isSticky = ref(false);
    const isMenuOpen = ref(false);

    const handleScroll = () => {
      isSticky.value = window.scrollY > 0;
    };

    const toggleMenu = () => {
      isMenuOpen.value = !isMenuOpen.value;
    };

    const closeMenu = () => {
      isMenuOpen.value = false;
    };

    onMounted(() => {
      window.addEventListener("scroll", handleScroll);
    });

    onBeforeUnmount(() => {
      window.removeEventListener("scroll", handleScroll);
    });

    return { isSticky, isMenuOpen, toggleMenu, closeMenu };
  },
};
</script>

<style scoped>
/* Custom styles for transitions */
.transition-all {
  transition: all 0.3s ease-in-out;
}
</style>
