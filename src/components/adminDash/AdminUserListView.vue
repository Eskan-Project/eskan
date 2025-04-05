<template>
  <main class="min-h-screen bg-gray-100 dark:bg-gray-900 flex-1 p-6 md:p-8">
    <div class="max-w-8xl mx-auto">
      <!-- Header and controls section -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          User Management
        </h1>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
          View and manage all users in the system
        </p>
      </div>

      <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <div
          class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6"
        >
          <div class="w-full sm:w-72">
            <input
              type="text"
              v-model="searchQuery"
              :class="
                windowWidth <= 550 ? 'text-xs p-2 pl-10' : 'text-sm p-3 pl-10'
              "
              class="block w-full text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700"
              placeholder="Search by name, email or ID..."
              @input="resetPagination"
            />
            <button
              v-if="searchQuery"
              @click="
                searchQuery = '';
                resetPagination();
              "
              class="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 text-gray-400 hover:text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <!-- Loading state -->
        <div v-if="isLoading" class="flex justify-center items-center py-8">
          <div
            class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"
          ></div>
          <span class="ml-3 text-gray-600 dark:text-gray-400"
            >Loading users...</span
          >
        </div>

        <!-- Table of users -->
        <div
          v-else
          class="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700"
        >
          <table class="w-full text-left text-gray-600 dark:text-gray-300">
            <thead
              class="text-gray-700 dark:text-gray-200 uppercase bg-gray-100 dark:bg-gray-700"
            >
              <tr>
                <th
                  :class="
                    windowWidth <= 550
                      ? 'px-3 py-2 text-[10px] w-2/5'
                      : 'px-4 py-3 text-sm w-2/5'
                  "
                >
                  User
                </th>
                <th
                  v-if="windowWidth > 978 && windowWidth > 450"
                  :class="[
                    windowWidth <= 550
                      ? 'px-3 py-2 text-[10px] hidden sm:table-cell w-1/5'
                      : 'px-4 py-3 text-sm hidden sm:table-cell w-1/5',
                  ]"
                >
                  Email
                </th>
                <th
                  v-if="windowWidth > 978"
                  :class="[
                    windowWidth <= 550
                      ? 'px-3 py-2 text-[10px] hidden sm:table-cell w-1/5'
                      : 'px-4 py-3 text-sm hidden sm:table-cell w-1/5',
                  ]"
                >
                  National ID
                </th>
                <th
                  :class="[
                    windowWidth <= 550
                      ? 'px-3 py-2 text-[10px] w-1/5'
                      : 'px-4 py-3 text-sm w-1/5 text-center',
                  ]"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="user in paginatedUsers"
                :key="user.uid"
                class="border-b dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-200 ease-in-out"
              >
                <th
                  scope="row"
                  class="flex items-center px-4 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap"
                >
                  <div class="flex items-center gap-3">
                    <img
                      :class="windowWidth <= 550 ? 'w-8 h-8' : 'w-12 h-12'"
                      class="rounded-full border border-gray-200 dark:border-gray-600 object-cover shadow-sm"
                      :src="user.photo"
                      alt="User photo"
                      loading="lazy"
                    />
                    <div>
                      <div
                        :class="
                          windowWidth <= 550
                            ? 'text-[11px] font-semibold'
                            : 'text-sm font-semibold'
                        "
                      >
                        {{ user.name }}
                      </div>
                      <div
                        v-if="windowWidth > 450 && windowWidth <= 978"
                        :class="
                          windowWidth <= 550
                            ? 'text-[10px] text-gray-500 dark:text-gray-400'
                            : 'text-xs text-gray-500 dark:text-gray-400'
                        "
                      >
                        {{ user.email }}
                      </div>
                    </div>
                  </div>
                </th>
                <td
                  v-if="windowWidth > 978 && windowWidth > 450"
                  :class="[
                    windowWidth <= 550
                      ? 'px-3 py-2 text-[10px] hidden sm:table-cell'
                      : 'px-4 py-3 text-sm hidden sm:table-cell',
                  ]"
                >
                  <div class="flex items-center">
                    <span class="font-medium">{{ user.email }}</span>
                  </div>
                </td>
                <td
                  v-if="windowWidth > 978"
                  :class="
                    windowWidth <= 550
                      ? 'px-3 py-2 text-[10px] hidden sm:table-cell'
                      : 'px-4 py-3 text-sm hidden sm:table-cell font-medium'
                  "
                >
                  {{ user.nationalId || "Not provided" }}
                </td>
                <td
                  class="text-center"
                  :class="windowWidth <= 550 ? 'px-2 py-2' : 'px-4 py-3'"
                >
                  <div class="flex justify-center items-center space-x-3">
                    <router-link :to="`/admin/users/edit/${user.uid}`">
                      <button
                        class="text-indigo-600 dark:text-indigo-400 p-1 rounded-full hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition duration-200 ease-in-out flex items-center justify-center"
                        :class="windowWidth <= 550 ? 'text-[10px]' : 'text-xs'"
                        title="Edit User"
                      >
                        <PencilIcon
                          :class="windowWidth <= 550 ? 'w-4 h-4' : 'w-5 h-5'"
                        />
                      </button>
                    </router-link>
                    <button
                      @click="handleDeleteUser(user.uid)"
                      class="text-red-600 dark:text-red-400 p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30 transition duration-200 ease-in-out flex items-center justify-center"
                      :class="windowWidth <= 550 ? 'text-[10px]' : 'text-xs'"
                      title="Delete User"
                    >
                      <TrashIcon
                        :class="windowWidth <= 550 ? 'w-4 h-4' : 'w-5 h-5'"
                      />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty state -->
        <div
          v-if="!isLoading && paginatedUsers.length === 0"
          class="py-10 px-6 text-center bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 mt-4"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-gray-200">
            No users found
          </h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {{
              searchQuery
                ? "Try adjusting your search criteria."
                : "Add a new user to get started."
            }}
          </p>
          <div class="mt-6">
            <router-link to="/admin/users/add-user">
              <button
                class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition duration-200 flex items-center mx-auto"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add New User
              </button>
            </router-link>
          </div>
        </div>

        <!-- Enhanced pagination -->
        <div
          v-if="!isLoading && filteredUsers.length > 0"
          class="flex flex-wrap justify-between items-center mt-6 border-t border-gray-200 dark:border-gray-700 pt-4"
        >
          <div class="text-sm text-gray-600 dark:text-gray-400 mb-3 sm:mb-0">
            Showing
            <span class="font-medium">{{
              (currentPage - 1) * perPage + 1
            }}</span>
            to
            <span class="font-medium">{{
              Math.min(currentPage * perPage, filteredUsers.length)
            }}</span>
            of
            <span class="font-medium">{{ filteredUsers.length }}</span>
            users
          </div>

          <div class="flex space-x-2">
            <button
              @click="prevPage"
              :disabled="currentPage === 1"
              :class="[
                windowWidth <= 550 ? 'px-2 py-1 text-xs' : 'px-3 py-2 text-sm',
                currentPage === 1
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-indigo-700 cursor-pointer',
              ]"
              class="font-medium text-white bg-indigo-600 rounded-md transition-colors duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>

            <button
              v-for="page in visiblePages"
              :key="page"
              @click="goToPage(page)"
              :class="[
                windowWidth <= 550 ? 'w-8 h-8 text-xs' : 'w-10 h-10 text-sm',
                page === currentPage
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600',
              ]"
              class="cursor-pointer font-medium rounded-md flex items-center justify-center transition-colors duration-200"
            >
              {{ page }}
            </button>

            <button
              @click="nextPage"
              :disabled="currentPage === totalPages"
              :class="[
                windowWidth <= 550 ? 'px-2 py-1 text-xs' : 'px-3 py-2 text-sm',
                currentPage === totalPages
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-indigo-700 cursor-pointer',
              ]"
              class="font-medium text-white bg-indigo-600 rounded-md transition-colors duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style>
/* Add dark mode styles for inputs */
.dark input {
  color: white;
}

/* Fix any potential light mode issues */
input {
  color: #111827; /* gray-900 for better contrast in light mode */
}

/* Optimize transitions for theme changes */
.dark,
.dark *,
:root,
* {
  transition-property: color, background-color, border-color;
  transition-duration: 150ms;
  transition-timing-function: ease;
}

/* Remove transitions from some elements to improve performance */
.dark .animate-spin,
.animate-spin,
svg,
.dark svg {
  transition: none;
}

/* Enhance focus states for better accessibility */
button:focus,
a:focus,
input:focus {
  outline: 2px solid rgba(99, 102, 241, 0.5);
  outline-offset: 2px;
}

/* Add some animations */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.fade-in {
  animation: fadeIn 0.3s ease-in-out;
}
</style>
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
      if (!this.users) return [];

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
      if (!this.filteredUsers) return [];
      const start = (this.currentPage - 1) * this.perPage;
      const end = start + this.perPage;
      return this.filteredUsers.slice(start, end);
    },
    visiblePages() {
      // Show up to 5 page numbers, centered around current page when possible
      let startPage = Math.max(1, this.currentPage - 2);
      const endPage = Math.min(startPage + 4, this.totalPages);

      // Adjust startPage if we're near the end
      if (endPage - startPage < 4) {
        startPage = Math.max(1, endPage - 4);
      }

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
    filteredUsers() {
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
      this.isLoading = true;
      await this.loadData();
    } catch (error) {
      console.error("Error in created:", error);
    } finally {
      this.isLoading = false;
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
          confirmButtonColor: "#4F46E5",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, delete it!",
        });

        if (!result.isConfirmed) return;

        this.isLoading = true;
        await this.deleteUser(userId);
        await this.loadData();

        await Swal.fire({
          title: "Deleted!",
          text: "User has been deleted successfully.",
          icon: "success",
          confirmButtonColor: "#4F46E5",
        });
      } catch (error) {
        console.error("Delete failed:", error);
        Swal.fire({
          title: "Error!",
          text: "Failed to delete user. Please try again.",
          icon: "error",
          confirmButtonColor: "#4F46E5",
        });
      } finally {
        this.isLoading = false;
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
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    updateWindowWidth() {
      this.windowWidth = window.innerWidth;
    },
  },
};
</script>
