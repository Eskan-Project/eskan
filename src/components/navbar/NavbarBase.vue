<template>
  <header
    :class="[
      'fixed top-0 w-full transition-all px-3 bg-[var(--secondary-color)] z-20',
      { 'shadow-lg': isSticky },
    ]"
  >
    <div class="container mx-auto flex items-center py-1">
      <router-link to="/">
        <img class="h-[70px]" src="../../assets/images/logo.png" alt="Logo" />
      </router-link>
      <ul class="hidden md:flex flex-grow justify-center space-x-6">
        <li v-for="(item, index) in navLinks" :key="index">
          <router-link
            :to="item.path"
            :class="{
              'text-white font-bold hover:text-gray-200': true,
              'border-b-2 border-white': $route.path === item.path,
            }"
            @click="closeMenu"
          >
            {{ item.label }}
          </router-link>
        </li>
      </ul>

      <div class="flex items-center gap-2 ml-auto">
        <template v-if="isAuth">
          <router-link
            :to="{ name: 'userProfile' }"
            class="flex items-center gap-1 px-2 py-1 md:px-4 md:py-2 text-white font-bold border border-white rounded hover:bg-white hover:text-[var(--secondary-color)] transition-all cursor-pointer"
          >
            Profile <i class="bi bi-person"></i>
          </router-link>
          <button
            @click="logout"
            class="flex items-center gap-1 px-2 py-1 md:px-4 md:py-2 text-white font-bold border border-white rounded hover:bg-white hover:text-[var(--secondary-color)] transition-all cursor-pointer"
          >
            Log Out <i class="bi bi-box-arrow-in-right"></i>
          </button>
        </template>

        <button
          v-else
          @click="$router.push({ name: 'login' })"
          class="flex items-center gap-1 px-2 py-1 md:px-4 md:py-2 text-white font-bold border border-white rounded hover:bg-white hover:text-[var(--secondary-color)] transition-all cursor-pointer"
        >
          Log IN <i class="bi bi-box-arrow-in-right"></i>
        </button>

        <i
          v-if="isMenuOpen"
          class="bi bi-x text-3xl text-white md:hidden ml-2 cursor-pointer"
          @click="toggleMenu"
          aria-label="Toggle Navigation"
        ></i>
        <i
          v-else
          class="bi bi-list text-3xl text-white md:hidden ml-2 cursor-pointer"
          @click="toggleMenu"
          aria-label="Toggle Navigation"
        ></i>
      </div>
    </div>

    <navbar-mobile-vue
      v-if="isMenuOpen"
      :navLinks="navLinks"
      @closeMenu="closeMenu"
      :animate="isMenuOpen"
    />
  </header>
</template>

<script>
import NavbarMobileVue from "./NavbarMobile.vue";
import { mapState, mapActions } from "vuex";
export default {
  components: {
    NavbarMobileVue,
  },
  data() {
    return {
      isSticky: false,
      isMenuOpen: false,
      navLinks: [
        { label: "Home", path: "/" },
        { label: "Properties", path: "/properties" },
        { label: "About", path: "/about" },
        { label: "Contact", path: "/contact" },
      ],
    };
  },
  computed: {
    ...mapState("auth", ["isAuth"]),
  },
  methods: {
    ...mapActions("auth", ["logout"]),
    handleScroll() {
      this.isSticky = window.scrollY > 0;
    },
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    closeMenu() {
      this.isMenuOpen = false;
    },
  },
  mounted() {
    window.onscroll = this.handleScroll;
  },
  beforeUnmount() {
    window.onscroll = null;
  },
};
</script>

<style scoped>
.transition-all {
  transition: all 0.3s ease-in-out;
}
</style>
