<template>
  <main class="min-h-screen bg-gray-100 flex relative">
    <div
      class="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#364365] shadow-lg z-40 flex items-center justify-between px-4"
    >
      <button
        @click="toggleSidebar"
        class="text-white p-2 hover:bg-[#4a5b8a] rounded-md transition-colors"
      >
        <i class="bi text-xl" :class="isOpen ? 'bi-x-lg' : 'bi-list'"></i>
      </button>
      <router-link to="/" class="h-full flex items-center">
        <img src="../assets/images/logo.png" alt="Logo" class="h-8" />
      </router-link>
    </div>

    <aside
      :class="`${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 transition-transform duration-300 fixed md:relative z-50 ${
        windowWidth >= 775 && windowWidth <= 1060 ? 'w-fit' : 'w-64'
      } bg-[#364365] min-h-screen p-4 flex flex-col shadow-lg ${
        isOpen ? 'mt-16' : ''
      } md:mt-0`"
    >
      <nav class="space-y-2">
        <router-link
          v-for="link in links"
          :key="link.path"
          :to="link.path"
          class="flex items-center text-white p-3 rounded hover:bg-[#4a5b8a] transition-colors cursor-pointer text-sm"
          active-class="bg-[#4a5b8a]"
          @click="closeSidebarOnMobile"
        >
          <i :class="link.icon" class="mr-3 text-lg"></i>
          {{ link.label }}
        </router-link>
      </nav>
      <router-link to="/" class="mt-auto pt-4" @click="closeSidebarOnMobile">
        <img src="../assets/images/logo.png" alt="" class="w-full" />
      </router-link>
    </aside>

    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden mt-16"
      @click="closeSidebar"
    ></div>

    <section class="flex-1 p-4 md:p-2 w-full overflow-x-hidden md:mt-0 mt-16">
      <router-view></router-view>
    </section>
  </main>
</template>

<script>
export default {
  name: "AdminDashboard",
  data() {
    return {
      isOpen: false,
      windowWidth: window.innerWidth,
      links: [
        {
          path: "/admin/profile",
          label: "Profile",
          icon: "bi bi-person-circle",
        },
        {
          path: "/admin/add-property",
          label: "Add Property",
          icon: "bi bi-building-add",
        },
        {
          path: "/admin/properties",
          label: "Properties",
          icon: "bi bi-building",
        },
        { path: "/admin/users", label: "Users", icon: "bi bi-people" },
        {
          path: "/admin/owners",
          label: "Owners",
          icon: "bi bi-person-workspace",
        },
        {
          path: "/admin/add-admin",
          label: "Add Admin",
          icon: "bi bi-person-fill-add",
        },
        { path: "/admin/requests", label: "Requests", icon: "bi bi-cart" },
        {
          path: "/admin/overview",
          label: "overview",
          icon: "bi bi-person-fill-add",
        },
      ],
    };
  },
  methods: {
    toggleSidebar() {
      this.isOpen = !this.isOpen;
    },
    closeSidebar() {
      this.isOpen = false;
    },
    closeSidebarOnMobile() {
      if (window.innerWidth < 768) {
        this.closeSidebar();
      }
    },
    updateWindowWidth() {
      this.windowWidth = window.innerWidth;
    },
  },
  mounted() {
    this.updateWindowWidth();
    // Close sidebar when route changes
    this.$router.afterEach(() => {
      this.closeSidebarOnMobile();
    });

    // Close sidebar when window resizes to desktop view
    window.addEventListener("resize", () => {
      this.updateWindowWidth();
      if (window.innerWidth >= 768) {
        this.closeSidebar();
      }
    });
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.updateWindowWidth);
  },
};
</script>

<style>
/* Prevent body scroll when sidebar is open on mobile */
body.sidebar-open {
  overflow: hidden;
}

.backdrop-blur-sm {
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

/* Add smooth transition for sidebar */
.transition-transform {
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}
</style>