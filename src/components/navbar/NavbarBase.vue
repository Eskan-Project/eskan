<template>
  <header
    :class="[
      'fixed top-0 w-full transition-all px-2 sm:px-3 bg-creative z-20',
      { 'shadow-lg': isSticky },
    ]"
  >
    <div class="container mx-auto flex items-center py-1">
      <router-link to="/" aria-label="Home" class="flex-shrink-0">
        <img
          class="h-[50px] sm:h-[60px] md:h-[70px]"
          src="../../assets/images/logo.png"
          alt="Eskan Logo"
          loading="lazy"
        />
      </router-link>

      <nav
        class="hidden md:flex flex-grow justify-center space-x-3 lg:space-x-6"
      >
        <router-link
          v-for="item in navLinks"
          :key="item.path"
          :to="item.path"
          :class="[
            'text-white font-bold text-sm lg:text-base hover:text-gray-200 transition-colors',
            { 'border-b-2 border-white': $route.path === item.path },
          ]"
          @click="closeMenu"
        >
          {{ item.label }}
        </router-link>
      </nav>

      <div class="flex items-center gap-2 sm:gap-4 ml-auto">
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
                ? 'fixed bottom-0 left-0 right-0 bg-white rounded-t-xl shadow-lg p-4 max-h-[70vh] z-30'
                : 'absolute top-20 w-full md:w-64 right-30 bg-white p-3 shadow-lg rounded-md max-h-[40vh]',
              'overflow-y-auto',
            ]"
          >
            <div v-if="isMobile" class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-semibold text-[var(--secondary-color)]">
                Notifications
              </h3>
              <button
                @click.stop="toggleNotifications"
                class="text-gray-600 hover:text-gray-800"
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
                    ? 'text-gray-600 bg-gray-50 hover:bg-gray-100'
                    : 'text-black bg-blue-50 font-semibold hover:bg-blue-100',
                ]"
              >
                <span class="flex-1">{{ notif.message }}</span>
                <button
                  @click.stop="removeNotification(notif.id)"
                  class="text-red-500 hover:text-red-700 transition-colors ml-1"
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
          title="Create Property"
          class="hidden md:block bg-white px-0.5 py-0.1 md:px-2 md:py-1 text-[var(--secondary-color)] rounded-full border border-white hover:bg-[var(--secondary-color)] hover:text-white transition-all"
        >
          <i class="bi bi-plus-circle text-sm md:text-2xl"></i>
        </router-link>
        <router-link
          v-if="userDetails.role === 'admin'"
          to="/admin"
          title="Admin Dashboard"
          class="hidden md:block bg-white px-0.5 py-0.1 md:px-2 md:py-1 text-[var(--secondary-color)] rounded-full border border-white hover:bg-[var(--secondary-color)] hover:text-white transition-all"
        >
          <i class="bi bi-person-fill-gear text-sm md:text-2xl"></i>
        </router-link>

        <router-link
          v-else
          to="/userProfile"
          title="User Profile"
          class="hidden md:block bg-white px-0.5 py-0.1 md:px-2 md:py-1 text-[var(--secondary-color)] rounded-full border border-white hover:bg-[var(--secondary-color)] hover:text-white transition-all"
        >
          <i class="bi bi-person text-sm md:text-2xl"></i>
        </router-link>

        <button
          v-if="isAuth"
          title="Logout"
          @click="logout"
          class="cursor-pointer hidden md:block bg-white px-0.5 py-0.1 md:px-2 md:py-1 text-[var(--secondary-color)] rounded border border-white hover:bg-[var(--secondary-color)] hover:text-white transition-all"
        >
          <i class="bi bi-box-arrow-in-right text-sm md:text-2xl"></i>
        </button>

        <button
          v-else
          @click="$router.push('/login')"
          class="flex items-center gap-1 px-2 md:px-4 py-1 md:py-2 text-xs md:text-base text-white font-bold border border-white rounded hover:bg-white hover:text-[var(--secondary-color)] transition-all cursor-pointer"
        >
          Log In <i class="bi bi-box-arrow-in-right"></i>
        </button>
        <button
          @click="toggleMenu"
          class="md:hidden text-2xl sm:text-3xl text-white cursor-pointer"
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
import debounce from "lodash/debounce";

export default {
  components: {
    NavbarMobileVue,
  },
  data() {
    return {
      isSticky: false,
      isMenuOpen: false,
      isNotificationsOpen: false,
      isMobile: false,
      navLinks: [
        { label: "Home", path: "/" },
        { label: "Properties", path: "/properties" },
        { label: "About", path: "/about" },
        { label: "Contact", path: "/contact" },
        { label: "FAQs", path: "/faq" },
      ],
    };
  },
  computed: {
    ...mapState("auth", ["isAuth", "userDetails"]),
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
      if (!this.isMobile && dropdown && !dropdown.contains(event.target)) {
        this.isNotificationsOpen = false;
      }
    },
    notifClicked(notif) {
      this.markAsRead(notif.id);
      this.isNotificationsOpen = false; // Close on click for better UX
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
    this.getNotifications();
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
