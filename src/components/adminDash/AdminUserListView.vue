<template>
  <main class="min-h-screen bg-gray-100 flex-1 p-4 md:p-8">
    <div class="md:flex block">
      <!-- Main Content -->
      <div class="flex-1 p-4 md:p-8">
        <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
          <div
            class="flex items-center justify-between flex-column md:flex-row flex-wrap space-y-4 md:space-y-0 py-4 bg-white dark:bg-gray-900 p-4"
          >
            <div class="relative">
              <div
                class="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none"
              >
                <i class="bi bi-search"></i>
              </div>
              <input
                type="text"
                v-model="searchQuery"
                id="table-search-users"
                class="block pt-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search for properties"
                @input="resetPagination"
              />
            </div>
          </div>
          <table
            class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
          >
            <thead
              class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
            >
              <tr>
                <th scope="col" class="p-4">
                  <div class="flex items-center"></div>
                </th>
                <th scope="col" class="px-6 py-3">Name</th>
                <th scope="col" class="px-6 py-3">Email</th>
                <th scope="col" class="px-6 py-3">National Id</th>
                <th scope="col" class="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="user in paginatedUsers"
                :key="user.uid"
                class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <td class="w-4 p-4"></td>
                <th
                  scope="row"
                  class="flex items-center px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  <img
                    class="w-10 h-10 rounded-full"
                    :src="user.photo"
                    alt="Jese image"
                  />
                  <div class="ps-3">
                    <div class="text-base font-semibold">
                      {{ user.name }}
                    </div>
                    <div class="font-normal text-gray-500">
                      NickName : {{ user.nickName }}
                    </div>
                  </div>
                </th>
                <td class="px-6 py-4">
                  {{ user.email }}
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center">
                    {{ user.nationalId }}
                  </div>
                </td>
                <td class="px-6 py-4">
                  <!-- Modal toggle -->

                  <button
                    type="button"
                    class="w-[25%] text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                  >
                    Edit
                  </button>
                  <button
                    @click="handleDeleteUser(user.uid)"
                    type="button"
                    class="w-[25%] focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-2 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- No data message -->
          <div
            v-if="paginatedUsers.length === 0"
            class="p-4 text-center text-gray-500"
          >
            No properties found.
          </div>

          <!-- Pagination controls -->
          <div
            v-if="filteredUsers.length > 0"
            class="flex justify-center gap-2 p-4"
          >
            <button
              @click="prevPage"
              :disabled="currentPage === 1"
              class="px-4 py-2 text-sm font-medium text-white bg-[#364365] rounded-md hover:bg-[#4a5b8a] disabled:opacity-50"
            >
              Previous
            </button>
            <span class="px-4 py-2 text-sm font-medium text-gray-700">
              Page {{ currentPage }} of {{ totalPages }}
            </span>
            <button
              @click="nextPage"
              :disabled="currentPage === totalPages || totalPages === 0"
              class="px-4 py-2 text-sm font-medium text-white bg-[#364365] rounded-md hover:bg-[#4a5b8a] disabled:opacity-50"
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
