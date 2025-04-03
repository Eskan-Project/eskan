<template>
  <main class="min-h-screen bg-gray-50 flex-1 p-4 md:p-8">
    <div class="max-w-6xl mx-auto">
      <div class="bg-white shadow-lg rounded-lg p-6">
        <div class="flex justify-between items-center gap-4">
  <div class="relative max-w-md">
    <input
      type="text"
      v-model="searchQuery"
      :class="windowWidth <= 550 ? 'text-xs p-1 pl-6' : 'text-sm p-2 pl-10'"
      class="block w-full text-gray-900 border border-gray-300 rounded-lg bg-gray-200 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 ease-in-out"
      placeholder="Search for users"
      @input="resetPagination"
    />
  </div>
  <router-link to="/admin/users/add-user">
    <button
  :class="[
    'font-medium',
    'text-white',
    'bg-[#364365]',
    'hover:bg-indigo-700',
    'rounded-lg',
    'transition',
    'duration-200',
    'ease-in-out',
    windowWidth <= 450 ? 'px-2 py-2 text-[10px]' : (windowWidth <= 550 ? 'px-2 py-2 text-xs' : 'px-5 py-2 text-sm')
  ]"
>
  + Add User
</button>
  </router-link>
</div>

        <div class="overflow-x-auto mt-4">
          <table class="w-full text-left text-gray-600">
            <thead class="text-gray-700 uppercase bg-gray-100">
              <tr>
                <th :class="windowWidth <= 550 ? 'px-1 py-1 text-xs' : 'px-4 py-3 text-sm'">Name</th>
                <th v-if="windowWidth > 978" :class="[windowWidth <= 420 ? 'hidden sm:table-cell' : windowWidth <= 550 ? 'px-1 py-1 text-xs hidden sm:table-cell' : 'px-4 py-3 text-sm hidden sm:table-cell']">Email</th>
                <th v-if="windowWidth > 978" :class="windowWidth <= 550 ? 'px-1 py-1 text-xs hidden sm:table-cell' : 'px-4 py-3 text-sm hidden sm:table-cell'">National ID</th>
                <th :class="windowWidth <= 550 ? 'px-1 py-1 text-xs text-center' : 'px-4 py-3 text-sm text-center'">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="user in paginatedUsers"
                :key="user.uid"
                class="border-b hover:bg-gray-50 transition duration-200 ease-in-out"
              >
                <td class="flex items-center px-4 py-4" :class="windowWidth <= 550 ? 'px-2 py-2' : 'px-4 py-4'">
                  <img
                    :class="windowWidth <= 550 ? 'w-6 h-6' : 'w-10 h-10'"
                    class="rounded-full border shadow-sm"
                    :src="user.photo"
                    alt="User photo"
                  />
                  <div class="pl-2">
                    <div :class="windowWidth <= 550 ? 'font-semibold text-gray-900 text-xs' : 'font-semibold text-gray-900'">{{ user.name }}</div>
                    <div v-if="windowWidth <= 978 && windowWidth > 420" :class="windowWidth <= 550 ? 'text-xs text-gray-500' : 'text-sm text-gray-500'">{{ user.email }}</div>
                  </div>
                </td>
                <td v-if="windowWidth > 978" :class="[windowWidth <= 420 ? 'hidden sm:table-cell' : windowWidth <= 550 ? 'px-1 py-1 text-xs hidden sm:table-cell' : 'px-4 py-4 text-sm hidden sm:table-cell']">{{ user.email }}</td>
                <td v-if="windowWidth > 978" :class="windowWidth <= 550 ? 'px-1 py-1 text-xs hidden sm:table-cell' : 'px-4 py-4 text-sm hidden sm:table-cell'">{{ user.nationalId }}</td>
                <td class="px-4 py-4" :class="windowWidth <= 550 ? 'px-2 py-2' : 'px-4 py-4'">
                  <div class="flex justify-center gap-2">
                    <router-link :to="`/admin/users/edit/${user.uid}`">
                      <PencilIcon :class="windowWidth <= 550 ? 'w-3 h-3' : 'w-5 h-5'" class="text-indigo-600 hover:text-indigo-800 cursor-pointer" />
                    </router-link>
                    <TrashIcon @click="handleDeleteUser(user.uid)" :class="windowWidth <= 550 ? 'w-3 h-3' : 'w-5 h-5'" class="text-red-600 hover:text-red-800 cursor-pointer" />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="paginatedUsers.length === 0" class="p-4 text-center text-gray-500">
          No users found.
        </div>

        <div v-if="filteredUsers.length > 0" class="flex justify-center gap-4 p-4">
          <button
            @click="prevPage"
            :disabled="currentPage === 1"
            :class="windowWidth <= 550 ? 'px-2 py-1 text-xs' : 'px-4 py-2 text-sm'"
            class="font-medium text-white bg-gray-600 hover:bg-gray-700 rounded-md disabled:opacity-50 transition duration-200 ease-in-out"
          >
            Previous
          </button>
          <span :class="windowWidth <= 550 ? 'px-2 py-1 text-xs' : 'px-4 py-2 text-sm'" class="font-medium text-gray-700">
            Page {{ currentPage }} of {{ totalPages }}
          </span>
          <button
            @click="nextPage"
            :disabled="currentPage === totalPages || totalPages === 0"
            :class="windowWidth <= 550 ? 'px-2 py-1 text-xs' : 'px-4 py-2 text-sm'"
            class="font-medium text-white bg-gray-600 hover:bg-gray-700 rounded-md disabled:opacity-50 transition duration-200 ease-in-out"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </main>
</template>
<script>
import { PencilIcon, TrashIcon } from "@heroicons/vue/24/solid";
import { mapActions, mapState } from "vuex";
import Swal from "sweetalert2";

export default {
  components: {
    PencilIcon,
    TrashIcon,
  },
  data() {
    return {
      currentPage: 1,
      perPage: 8,
      searchQuery: "",
      isLoading: false,
      windowWidth: window.innerWidth,
    };
  },
  computed: {
    ...mapState("users", ["users"]),
    filteredUsers() {
      if (!this.searchQuery) {
        return this.users;
      }

      const query = this.searchQuery.toLowerCase();
      return this.users.filter((user) => {
        return (
          (user.name && user.name.toLowerCase().includes(query)) ||
          (user.email && user.email.toLowerCase().includes(query)) ||
          (user.nationalId && user.nationalId.includes(query))
        );
      });
    },
    totalPages() {
      return Math.max(1, Math.ceil(this.filteredUsers.length / this.perPage));
    },
    paginatedUsers() {
      const start = (this.currentPage - 1) * this.perPage;
      const end = start + this.perPage;
      return this.filteredUsers.slice(start, end);
    },
    visiblePages() {
      const startPage = Math.max(1, Math.min(this.currentPage - 2, this.totalPages - 4));
      const endPage = Math.min(startPage + 4, this.totalPages);

      return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
    },
  },
  watch: {
    users: {
      handler(newUsers) {
        console.log("Users updated:", newUsers);
      },
      immediate: true,
    },
    filteredProperties() {
      if (this.currentPage > this.totalPages && this.totalPages > 0) {
        this.currentPage = this.totalPages;
      } else if (this.currentPage === 0 && this.totalPages > 0) {
        this.currentPage = 1;
      }
    },
    searchQuery() {
      this.resetPagination();
    },
  },
  async created() {
    try {
      await this.loadData();
    } catch (error) {
      console.error("Error in created:", error);
    }
  },
  mounted() {
    window.addEventListener("resize", this.updateWindowWidth);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.updateWindowWidth);
  },
  methods: {
    ...mapActions("users", ["getUsers", "deleteUser"]),
    async handleDeleteUser(userId) {
      try {
        const result = await Swal.fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, delete it!",
        });

        if (!result.isConfirmed) return;

        this.loading = true;
        await this.deleteUser(userId);
        await this.loadData();

        await Swal.fire("Deleted!", "User has been deleted successfully.", "success");
      } catch (error) {
        console.error("Delete failed:", error);
        Swal.fire("Error!", "Failed to delete user. Please try again.", "error");
      } finally {
        this.loading = false;
      }
    },
    async loadData() {
      try {
        await this.getUsers();
      } catch (error) {
        console.error("Fetch users error:", error);
      }

      console.log(this.users);
    },
    resetPagination() {
      this.currentPage = 1;
    },
    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        window.scrollTo(0, 0);
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        window.scrollTo(0, 0);
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        window.scrollTo(0, 0);
      }
    },
    updateWindowWidth() {
      this.windowWidth = window.innerWidth;
    },
  },
};
</script>