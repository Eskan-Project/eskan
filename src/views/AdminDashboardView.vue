<template>
  <main class="min-h-screen bg-gray-100 flex">
    <aside
      class="md:w-48 w-full bg-[#364365] md:min-h-screen p-4 flex flex-col"
    >
      <nav class="space-y-2">
        <router-link
          v-for="link in links"
          :key="link.path"
          :to="link.path"
          class="flex items-center text-white p-2 rounded hover:bg-[#4a5b8a] cursor-pointer"
          active-class="bg-[#4a5b8a]"
        >
          <i :class="link.icon" class="mr-2"></i>
          {{ link.label }}
        </router-link>
      </nav>
      <router-link to="/" class="mt-auto pt-4">
        <img src="../assets/images/logo.png" alt="" class="w-full" />
      </router-link>
    </aside>

    <section class="flex-1 p-4">
      <router-view></router-view>
    </section>
  </main>
</template>

<script>
export default {
  name: "AdminDashboard",
  data() {
    return {
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
        { path: "/admin/orders", label: "Requests", icon: "bi bi-cart" },
      ],
    };
  },
};
</script>
