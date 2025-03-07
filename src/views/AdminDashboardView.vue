<template>
  <main class="min-h-screen bg-gray-100">
    <div class="md:flex block">
      <!-- Sidebar -->
      <aside class="md:w-48 w-full bg-[#364365] md:min-h-screen p-4">
        <nav class="space-y-2">
          <router-link
            to="/admin"
            class="block text-white p-2 rounded hover:bg-[#4a5b8a]"
          >
            <i class="bi bi-person-circle mr-2"></i>Profile
          </router-link>
          <router-link
            to="/admin/prop"
            class="block text-white p-2 rounded hover:bg-[#4a5b8a]"
          >
            <i class="bi bi-building-add"></i> Add Property
          </router-link>
          <router-link
            to="/admin/properties"
            class="block text-white p-2 rounded hover:bg-[#4a5b8a]"
          >
            <i class="bi bi-building mr-2"></i>Properties
          </router-link>
          <router-link
            to="/admin/users"
            class="block text-white p-2 rounded hover:bg-[#4a5b8a]"
          >
            <i class="bi bi-people mr-2"></i>users
          </router-link>
          <router-link
            to="/admin/users"
            class="block text-white p-2 rounded hover:bg-[#4a5b8a]"
          >
            <i class="bi bi-people mr-2"></i>Owners
          </router-link>
          <router-link
            to="/admin/orders"
            class="block text-white p-2 rounded hover:bg-[#4a5b8a]"
          >
            <i class="bi bi-cart mr-2"></i>Requests
          </router-link>
        </nav>
      </aside>

      <!-- Main Content -->
      <router-view></router-view>
    </div>
  </main>
</template>

<script>
export default {
  name: "AdminDashboard",
  data() {
    return {};
  },
};
</script>
