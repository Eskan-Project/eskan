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

      <div class="flex items-center gap-5 ml-auto">
        <template v-if="isAuth">
          <div
            class="text-2xl cursor-pointer relative"
            title="Notifications"
            @click="toggleNotifications"
            ref="notificationsDropdown"
          >
            <i class="bi bi-bell hover:text-gray-400"></i>
            <span
              v-if="unreadCount"
              class="absolute -top-2 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full"
            >
              {{ unreadCount }}
            </span>
            <div
              v-if="isNotificationsOpen"
              class="absolute left-5 top-15 bg-white w-64 p-2 shadow-lg rounded-md"
            >
              <div v-if="notifications.length">
                <div
                  v-for="notif in notifications"
                  :key="notif.id"
                  class="p-1 border-b border-gray-300 my-2 flex justify-between items-center text-black hover:bg-gray-100 text-sm"
                >
                  <span>{{ notif.message }}</span>
                  <button
                    @click="removeNotification(notif.id)"
                    class="text-red-500 text-sm cursor-pointer"
                  >
                    ✖
                  </button>
                </div>
              </div>
              <p v-else class="p-2 text-gray-500 text-sm text-center">
                No new notifications
              </p>
            </div>
          </div>
          <router-link
            title="User Profile"
            :to="{ name: 'userProfile' }"
            class="bg-white px-2 py-1 text-[var(--secondary-color)] rounded-full border border-white hover:bg-[var(--secondary-color)] hover:text-white transition-all cursor-pointer"
          >
            <i class="text-2xl bi bi-person"></i>
          </router-link>
          <button
            title="Logout"
            @click="logout"
            class="bg-white px-2 py-1 text-[var(--secondary-color)] rounded border border-white hover:bg-[var(--secondary-color)] hover:text-white transition-all cursor-pointer"
          >
            <i class="text-2xl bi bi-box-arrow-in-right"></i>
          </button>
        </template>

        <button
          title="Login"
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
import { mapState, mapActions, mapGetters } from "vuex";
import NavbarMobileVue from "./NavbarMobile.vue";
export default {
  components: {
    NavbarMobileVue,
  },
  data() {
    return {
      isSticky: false,
      isMenuOpen: false,
      isNotificationsOpen: false,
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
    ...mapState("notifications", ["notifications"]),
    ...mapGetters("notifications", ["unreadCount"]),
  },
  methods: {
    ...mapActions("auth", ["logout"]),
    ...mapActions("notifications", ["getNotifications", "removeNotification"]),
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
      if (dropdown && !dropdown.contains(event.target)) {
        this.isNotificationsOpen = false;
      }
    },
  },
  mounted() {
    window.onscroll = this.handleScroll;
    this.getNotifications();
    document.addEventListener("click", this.handleClickOutside);
  },
  beforeUnmount() {
    window.onscroll = null;
    document.removeEventListener("click", this.handleClickOutside);
  },
};
</script>

<style scoped>
.transition-all {
  transition: all 0.3s ease-in-out;
}
</style>
