<template>
  <main class="min-h-screen bg-gray-100 flex-1 p-2 sm:p-4 md:p-8">
    <div class="w-full">
      <!-- Main Content -->
      <div class="w-full">
        <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
          <!-- Search and Add Section -->
          <div class="bg-white dark:bg-gray-900 p-3 sm:p-4">
            <div
              class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
            >
              <div class="w-full sm:w-auto relative">
                <i
                  class="bi bi-search absolute left-3 top-1/2 transform -translate-y-1/2"
                ></i>
                <input
                  type="text"
                  v-model="searchQuery"
                  class="w-full sm:w-80 pl-10 pr-4 py-2 text-sm text-gray-200 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Search for users"
                  @input="resetPagination"
                />
              </div>
              <router-link to="/admin/users/add-user" class="w-full sm:w-auto">
                <button
                  type="button"
                  class="w-full sm:w-auto text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700"
                >
                  Add User
                </button>
              </router-link>
            </div>
          </div>

          <!-- Table Section -->
          <div class="overflow-x-auto">
            <table
              class="w-full text-sm text-left text-gray-500 dark:text-gray-400"
            >
              <thead
                class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
              >
                <tr>
                  <th scope="col" class="px-3 sm:px-6 py-3">Name</th>
                  <th
                    scope="col"
                    class="px-3 sm:px-6 py-3 hidden sm:table-cell"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    class="px-3 sm:px-6 py-3 hidden sm:table-cell"
                  >
                    National Id
                  </th>
                  <th scope="col" class="px-3 sm:px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="user in paginatedUsers"
                  :key="user.uid"
                  class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <th class="flex items-center px-3 sm:px-6 py-4">
                    <img
                      class="w-8 h-8 sm:w-10 sm:h-10 rounded-full"
                      :src="user.photo"
                      alt="User photo"
                    />
                    <div class="ps-3">
                      <div
                        class="text-sm sm:text-base font-semibold text-gray-900 dark:text-white"
                      >
                        {{ user.name }}
                      </div>
                      <div class="text-xs text-gray-500 sm:hidden">
                        {{ user.email }}
                      </div>
                    </div>
                  </th>
                  <td class="px-3 sm:px-6 py-4 hidden sm:table-cell">
                    {{ user.email }}
                  </td>
                  <td class="px-3 sm:px-6 py-4 hidden sm:table-cell">
                    {{ user.nationalId }}
                  </td>
                  <td class="px-3 sm:px-6 py-4">
                    <div class="flex flex-col sm:flex-row gap-2">
                      <router-link
                        :to="`/admin/users/edit/${user.uid}`"
                        class="w-full sm:w-auto"
                      >
                        <button
                          class="w-full text-white bg-blue-700 hover:bg-blue-800 rounded-lg text-sm px-3 sm:px-5 py-2"
                        >
                          Edit
                        </button>
                      </router-link>
                      <button
                        @click="handleDeleteUser(user.uid)"
                        class="w-full sm:w-auto text-white bg-red-700 hover:bg-red-800 rounded-lg text-sm px-3 sm:px-5 py-2"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- No data message -->
          <div
            v-if="paginatedUsers.length === 0"
            class="p-4 text-center text-gray-500"
          >
            No users found.
          </div>

          <!-- Pagination controls -->
          <div
            v-if="filteredUsers.length > 0"
            class="flex justify-center items-center gap-2 p-4"
          >
            <button
              @click="prevPage"
              :disabled="currentPage === 1"
              class="px-4 py-2 text-sm font-medium text-white bg-[#364365] rounded-md hover:bg-[#4a5b8a] disabled:opacity-50 cursor-pointer"
            >
              Previous
            </button>
            <span class="px-4 py-2 text-sm font-medium text-gray-700">
              Page {{ currentPage }} of {{ totalPages }}
            </span>
            <button
              @click="nextPage"
              :disabled="currentPage === totalPages || totalPages === 0"
              class="px-4 py-2 text-sm font-medium text-white bg-[#364365] rounded-md hover:bg-[#4a5b8a] disabled:opacity-50 cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import { mapActions, mapState } from "vuex"; // Add mapState
import Swal from "sweetalert2";

export default {
  data() {
    return {
      currentPage: 1,
      perPage: 8,
      searchQuery: "",
      isLoading: false,
    };
  },
  computed: {
    ...mapState("users", ["users"]), // Get users from state
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
      // Create an array of page numbers to display, similar to front-end implementation
      // This shows a maximum of 5 pages at a time
      const startPage = Math.max(
        1,
        Math.min(this.currentPage - 2, this.totalPages - 4)
      );
      const endPage = Math.min(startPage + 4, this.totalPages);

      return Array.from(
        { length: endPage - startPage + 1 },
        (_, i) => startPage + i
      );
    },
  },
  watch: {
    users: {
      handler(newUsers) {
        console.log("Users updated:", newUsers);
      },
      immediate: true,
    },
    // Reset to page 1 when filtered data changes
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
        await this.deleteUser(userId); // Changed from deleteOne to directly use deleteUser
        await this.loadData(); // Reload the users list after deletion

        await Swal.fire(
          "Deleted!",
          "User has been deleted successfully.",
          "success"
        );
      } catch (error) {
        console.error("Delete failed:", error);
        Swal.fire(
          "Error!",
          "Failed to delete user. Please try again.",
          "error"
        );
      } finally {
        this.loading = false;
      }
    },
    // Remove the deleteOne method as it's no longer needed
    async loadData() {
      try {
        await this.getUsers(); // Don't reassign users here, use from state
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
  },
};
</script>
