<template>
  <header
    :class="[
      'fixed top-0 w-full transition-all px-3 bg-creative z-20',
      { 'shadow-lg': isSticky },
    ]"
  >
    <div class="container mx-auto flex items-center py-1">
      <router-link to="/" aria-label="Home">
        <img
          class="h-[70px]"
          src="../../assets/images/logo.png"
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
          {{ item.label }}
        </router-link>
      </nav>

      <div class="flex items-center gap-4 ml-auto">
        <template v-if="isAuth">
          <div
            class="relative text-2xl cursor-pointer"
            title="Notifications"
            @click="toggleNotifications"
            ref="notificationsDropdown"
          >
            <i class="bi bi-bell hover:text-gray-400 transition-colors"></i>
            <span
              v-if="unreadCount"
              class="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full"
            >
              {{ unreadCount }}
            </span>
            <transition name="dropdown">
              <div
                v-if="isNotificationsOpen"
                class="absolute left-0 top-12 mt-2 bg-white w-72 p-3 shadow-lg rounded-md overflow-y-auto"
              >
                <div v-if="notifications.length" class="space-y-2">
                  <div
                    v-for="notif in notifications"
                    :key="notif.id"
                    @click="notifClicked(notif)"
                    :class="[
                      'flex justify-between items-center p-2 rounded cursor-pointer transition-colors text-sm',
                      notif.read
                        ? 'text-gray-600 bg-gray-50 hover:bg-gray-100'
                        : 'text-black bg-blue-50 font-semibold hover:bg-blue-100',
                    ]"
                  >
                    <span class="flex-1">{{ notif.message }}</span>
                    <button
                      @click.stop="removeNotification(notif.id)"
                      class="text-red-500 hover:text-red-700 transition-colors"
                      title="Dismiss"
                    >
                      ✖
                    </button>
                  </div>
                </div>
                <p v-else class="p-2 text-gray-500 text-sm text-center">
                  No new notifications
                </p>
              </div>
            </transition>
          </div>
          <router-link
            to="/userProfile"
            title="User Profile"
            class="bg-white px-2 py-1 text-[var(--secondary-color)] rounded-full border border-white hover:bg-[var(--secondary-color)] hover:text-white transition-all"
          >
            <i class="bi bi-person text-2xl"></i>
          </router-link>
          <button
            title="Logout"
            @click="logout"
            class="bg-white px-2 py-1 text-[var(--secondary-color)] rounded border border-white hover:bg-[var(--secondary-color)] hover:text-white transition-all"
          >
            <i class="bi bi-box-arrow-in-right text-2xl"></i>
          </button>
        </template>

        <button
          v-else
          @click="$router.push('/login')"
          class="flex items-center gap-1 px-4 py-2 text-white font-bold border border-white rounded hover:bg-white hover:text-[var(--secondary-color)] transition-all"
        >
          Log In <i class="bi bi-box-arrow-in-right"></i>
        </button>

        <button
          @click="toggleMenu"
          class="md:hidden text-3xl text-white cursor-pointer"
          :aria-label="isMenuOpen ? 'Close Menu' : 'Open Menu'"
        >
          <i :class="isMenuOpen ? 'bi bi-x' : 'bi bi-list'"></i>
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
    ...mapActions("notifications", [
      "getNotifications",
      "removeNotification",
      "markAsRead",
    ]),
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
    notifClicked(notif) {
      this.markAsRead(notif.id);
    },
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll, { passive: true });
    window.addEventListener("click", this.handleClickOutside, {
      passive: true,
    });
    this.getNotifications();
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

.dropdown-enter-to,
.dropdown-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}
</style>
