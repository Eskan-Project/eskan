<template>
  <main class="min-h-screen bg-gray-100 dark:bg-gray-900 flex-1 p-6 md:p-8">
    <div class="max-w-8xl mx-auto">
      <!-- Header and controls section -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          Property Requests
        </h1>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
          View and manage all property requests in the system
        </p>
      </div>

      <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <div
          class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6"
        >
          <!-- Enhanced search bar with icon -->
          <div class="w-full sm:w-72">
            <input
              type="text"
              v-model="searchQuery"
              class="block w-full p-3 pl-10 text-sm text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 transition duration-200 ease-in-out"
              placeholder="Search for properties or owners..."
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
            >Loading requests...</span
          >
        </div>

        <!-- Table of requests -->
        <div
          v-else
          class="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700"
        >
          <table class="w-full text-left text-gray-600 dark:text-gray-300">
            <thead
              class="text-gray-700 dark:text-gray-200 uppercase bg-gray-100 dark:bg-gray-700"
            >
              <tr>
                <th scope="col" class="px-4 py-3 text-sm w-2/5">
                  Property Title
                </th>
                <th
                  scope="col"
                  class="px-4 py-3 text-sm w-1/5 hidden md:table-cell text-center"
                >
                  Status
                </th>
                <th
                  scope="col"
                  class="px-4 py-3 text-sm w-1/5 hidden md:table-cell text-center"
                >
                  Price (EGP)
                </th>
                <th scope="col" class="px-4 py-3 text-sm w-1/5 text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="request in paginatedRequests"
                :key="request.uid"
                class="border-b dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-200 ease-in-out"
              >
                <th
                  scope="row"
                  class="flex items-center px-4 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap"
                >
                  <div class="flex items-center gap-3">
                    <img
                      class="w-12 h-12 rounded-md border border-gray-200 dark:border-gray-600 object-cover shadow-sm"
                      :src="
                        request.images?.length
                          ? request.images[0]
                          : noPhotoImage
                      "
                      alt="Property image"
                      loading="lazy"
                    />
                    <div>
                      <div class="text-sm font-semibold">
                        {{ request.title }}
                      </div>
                      <div class="text-xs text-gray-500 dark:text-gray-400">
                        {{ request.propertyContact?.name }}
                      </div>
                      <div
                        class="text-xs text-gray-500 dark:text-gray-400 md:hidden"
                      >
                        Status:
                        <span
                          class="inline-flex px-2 py-1 text-xs rounded-full"
                          :class="{
                            'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300':
                              request.status === 'approved',
                            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300':
                              request.status === 'pending',
                            'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300':
                              request.status === 'rejected',
                          }"
                        >
                          {{ request.status }}
                        </span>
                        | Price:
                        {{ request.price }}
                      </div>
                    </div>
                  </div>
                </th>
                <td class="px-4 py-3 hidden md:table-cell text-center">
                  <span
                    class="inline-flex px-2 py-1 text-xs rounded-full"
                    :class="{
                      'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300':
                        request.status === 'approved',
                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300':
                        request.status === 'pending',
                      'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300':
                        request.status === 'rejected',
                    }"
                  >
                    {{ request.status }}
                  </span>
                </td>
                <td
                  class="px-4 py-3 hidden md:table-cell font-medium text-center"
                >
                  {{ request.price }}
                </td>
                <td class="px-4 py-3 text-center">
                  <router-link :to="`/admin/requests/${request.uid}`">
                    <button
                      class="text-indigo-600 dark:text-indigo-400 p-1 rounded-full hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition duration-200 ease-in-out flex items-center justify-center mx-auto"
                      title="View Details"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </button>
                  </router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty state -->
        <div
          v-if="!isLoading && paginatedRequests.length === 0"
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
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-gray-200">
            No requests found
          </h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {{
              searchQuery
                ? "Try adjusting your search criteria."
                : "There are no pending property requests at the moment."
            }}
          </p>
        </div>

        <div
          v-if="!isLoading && filteredRequests.length > 0"
          class="flex flex-wrap justify-between items-center mt-6 border-t border-gray-200 dark:border-gray-700 pt-4"
        >
          <div class="text-sm text-gray-600 dark:text-gray-400 mb-3 sm:mb-0">
            Showing
            <span class="font-medium">{{
              (currentPage - 1) * perPage + 1
            }}</span>
            to
            <span class="font-medium">{{
              Math.min(currentPage * perPage, filteredRequests.length)
            }}</span>
            of
            <span class="font-medium">{{ filteredRequests.length }}</span>
            requests
          </div>

          <div class="flex space-x-2">
            <button
              @click="prevPage"
              :disabled="currentPage === 1"
              :class="[
                'font-medium text-white bg-indigo-600 rounded-md transition-colors duration-200',
                currentPage === 1
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-indigo-700 cursor-pointer',
              ]"
              class="px-3 py-2 text-sm"
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
                'w-10 h-10 text-sm cursor-pointer font-medium rounded-md flex items-center justify-center transition-colors duration-200',
                page === currentPage
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600',
              ]"
            >
              {{ page }}
            </button>

            <button
              @click="nextPage"
              :disabled="currentPage === totalPages"
              :class="[
                'font-medium text-white bg-indigo-600 rounded-md transition-colors duration-200',
                currentPage === totalPages
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-indigo-700 cursor-pointer',
              ]"
              class="px-3 py-2 text-sm"
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
import noPhotoImage from "../../assets/images/no-photo.jpg";
import { mapActions, mapState } from "vuex";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      noPhotoImage,
      currentPage: 1,
      perPage: 8,
      searchQuery: "",
      isLoading: false,
      windowWidth: window.innerWidth,
    };
  },
  computed: {
    ...mapState("requests", ["requests"]),
    filteredRequests() {
      if (!this.requests) return [];

      if (!this.searchQuery) {
        return this.requests;
      }

      const query = this.searchQuery.toLowerCase();
      return this.requests.filter((request) => {
        return (
          (request.title && request.title.toLowerCase().includes(query)) ||
          (request.propertyContact?.name &&
            request.propertyContact.name.toLowerCase().includes(query)) ||
          (request.status && request.status.toLowerCase().includes(query))
        );
      });
    },
    totalPages() {
      return Math.max(
        1,
        Math.ceil(this.filteredRequests.length / this.perPage)
      );
    },
    paginatedRequests() {
      if (!this.filteredRequests) return [];
      const start = (this.currentPage - 1) * this.perPage;
      const end = start + this.perPage;
      return this.filteredRequests.slice(start, end);
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
    requests: {
      handler(newRequests) {
        console.log("requests updated:", newRequests);
      },
      immediate: true,
    },
    // Reset to page 1 when filtered data changes
    filteredRequests() {
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
    ...mapActions("requests", ["getRequests", "deleteRequest"]),
    async handleDeleteRequest(requestId) {
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
        await this.deleteRequest(requestId);
        await this.loadData();

        await Swal.fire({
          title: "Deleted!",
          text: "Request has been deleted successfully.",
          icon: "success",
          confirmButtonColor: "#4F46E5",
        });
      } catch (error) {
        console.error("Delete failed:", error);
        Swal.fire({
          title: "Error!",
          text: "Failed to delete request. Please try again.",
          icon: "error",
          confirmButtonColor: "#4F46E5",
        });
      } finally {
        this.isLoading = false;
      }
    },
    async loadData() {
      try {
        await this.getRequests();
      } catch (error) {
        console.error("Fetch requests error:", error);
      }
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
