<template>
  <main class="min-h-screen bg-gray-100 dark:bg-gray-900 flex-1 p-6 md:p-8">
    <div class="max-w-8xl mx-auto">
      <!-- Header and controls section -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          Properties Management
        </h1>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
          View and manage all properties in the system
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
              class="block w-full text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Search by title, description or type..."
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

          <div class="w-full sm:w-auto">
            <select
              v-model="statusFilter"
              @change="resetPagination"
              :class="windowWidth <= 550 ? 'text-xs p-1' : 'text-sm p-3'"
              class="block w-full text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 ease-in-out"
            >
              <option
                v-for="option in statusOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </div>
        </div>

        <!-- Loading state -->
        <div v-if="isLoading" class="flex justify-center items-center py-8">
          <div
            class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"
          ></div>
          <span class="ml-3 text-gray-600 dark:text-gray-400"
            >Loading properties...</span
          >
        </div>

        <!-- Table of properties -->
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
                  Property
                </th>
                <th
                  v-if="windowWidth > 978 && windowWidth > 450"
                  :class="[
                    windowWidth <= 550
                      ? 'px-3 py-2 text-[10px] hidden sm:table-cell w-1/5'
                      : 'px-4 py-3 text-sm hidden sm:table-cell w-1/5',
                  ]"
                >
                  Owner
                </th>
                <th
                  v-if="windowWidth > 978"
                  :class="[
                    windowWidth <= 550
                      ? 'px-3 py-2 text-[10px] hidden sm:table-cell w-1/5'
                      : 'px-4 py-3 text-sm hidden sm:table-cell w-1/5',
                  ]"
                >
                  Price (EGP)
                </th>
                <th
                  :class="[
                    windowWidth <= 550
                      ? 'px-3 py-2 text-[10px] hidden sm:table-cell w-1/5'
                      : 'px-4 py-3 text-sm hidden sm:table-cell w-1/5',
                  ]"
                >
                  Status
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
                v-for="property in paginatedProperties"
                :key="property.id"
                class="border-b dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-200 ease-in-out"
              >
                <th
                  scope="row"
                  class="flex items-center px-4 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap"
                >
                  <div class="flex items-center gap-3">
                    <img
                      :class="windowWidth <= 550 ? 'w-8 h-8' : 'w-12 h-12'"
                      class="rounded-md border border-gray-200 dark:border-gray-600 object-cover shadow-sm"
                      :src="property.images[0]"
                      alt="Property image"
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
                        {{ property.title }}
                      </div>
                      <div
                        v-if="windowWidth > 450"
                        :class="
                          windowWidth <= 550
                            ? 'text-[10px] text-gray-500 dark:text-gray-400'
                            : 'text-xs text-gray-500 dark:text-gray-400'
                        "
                      >
                        {{ property.propertyContact.email }}
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
                    <span class="font-medium">{{
                      property.propertyContact.name
                    }}</span>
                  </div>
                </td>
                <td
                  v-if="windowWidth > 978"
                  :class="
                    windowWidth <= 550
                      ? 'px-3 py-2 text-[10px] hidden sm:table-cell'
                      : 'px-4 py-3 text-sm hidden sm:table-cell'
                  "
                >
                  {{ property.price }}
                </td>
                <td
                  v-if="windowWidth > 978"
                  :class="[
                    windowWidth <= 550
                      ? 'px-3 py-2 text-[10px] hidden sm:table-cell'
                      : 'px-4 py-3 text-sm hidden sm:table-cell font-medium',
                  ]"
                >
                  <span
                    :class="{
                      'bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded':
                        property.status === 'expired',
                      'bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded':
                        property.status === 'completed',
                    }"
                  >
                    {{ property.status }}
                  </span>
                </td>

                <td
                  class="text-center"
                  :class="windowWidth <= 550 ? 'px-2 py-2' : 'px-4 py-3'"
                >
                  <div class="flex justify-center items-center space-x-2">
                    <router-link :to="`/admin/properties/${property.title}`">
                      <button
                        class="cursor-pointer text-indigo-600 dark:text-indigo-400 p-1 rounded-full hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition duration-200 ease-in-out flex items-center justify-center"
                        :class="windowWidth <= 550 ? 'text-[10px]' : 'text-xs'"
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
                    <button
                      class="cursor-pointer text-blue-600 dark:text-blue-400 p-1 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30 transition duration-200 ease-in-out flex items-center justify-center"
                      :class="windowWidth <= 550 ? 'text-[10px]' : 'text-xs'"
                      title="Edit Property"
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
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty state -->
        <div
          v-if="!isLoading && paginatedProperties.length === 0"
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
            No properties found
          </h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {{
              searchQuery
                ? "Try adjusting your search criteria."
                : "Add a new property to get started."
            }}
          </p>
          <div class="mt-6">
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
              Add New Property
            </button>
          </div>
        </div>

        <div
          v-if="!isLoading && filteredProperties.length > 0"
          class="flex flex-wrap justify-between items-center mt-6 border-t border-gray-200 dark:border-gray-700 pt-4"
        >
          <div class="text-sm text-gray-600 dark:text-gray-400 mb-3 sm:mb-0">
            Showing
            <span class="font-medium">{{
              (currentPage - 1) * perPage + 1
            }}</span>
            to
            <span class="font-medium">{{
              Math.min(currentPage * perPage, filteredProperties.length)
            }}</span>
            of
            <span class="font-medium">{{ filteredProperties.length }}</span>
            properties
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
import { mapActions } from "vuex";
export default {
  data() {
    return {
      properties: [],
      currentPage: 1,
      perPage: 8,
      searchQuery: "",
      isLoading: false,
      windowWidth: window.innerWidth,
      statusFilter: "all", // Add this line
      statusOptions: [
        { value: "all", label: "All Status" },
        { value: "completed", label: "Completed" },
        { value: "expired", label: "Expired" },
      ],
    };
  },
  mounted() {
    window.addEventListener("resize", this.updateWindowWidth);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.updateWindowWidth);
  },
  computed: {
    filteredProperties() {
      let filtered = [...this.properties];

      // Apply status filter
      if (this.statusFilter !== "all") {
        filtered = filtered.filter(
          (property) => property.status === this.statusFilter
        );
      }

      // Apply search query
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter((property) => {
          return (
            (property.title && property.title.toLowerCase().includes(query)) ||
            (property.status &&
              property.status.toLowerCase().includes(query)) ||
            (property.propertyContact?.name &&
              property.propertyContact.name.toLowerCase().includes(query)) ||
            (property.type && property.type.toLowerCase().includes(query))
          );
        });
      }

      return filtered;
    },
    totalPages() {
      return Math.max(
        1,
        Math.ceil(this.filteredProperties.length / this.perPage)
      );
    },
    paginatedProperties() {
      const start = (this.currentPage - 1) * this.perPage;
      const end = start + this.perPage;
      return this.filteredProperties.slice(start, end);
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
    statusFilter() {
      this.resetPagination();
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
      this.isLoading = true;
      await this.loadData();
    } catch (error) {
      console.error("Error in created:", error);
    } finally {
      this.isLoading = false;
    }
  },
  methods: {
    ...mapActions("property", ["getProperties"]),
    async loadData() {
      try {
        this.error = null;
        const properties = (await this.getProperties()) || [];

        // Ensure the properties are in the correct format
        this.properties = properties.map((prop) => {
          // Provide default values to prevent undefined errors
          return {
            ...prop,
            id: prop?.id || `temp-${Math.random().toString(36).substr(2, 9)}`,
            title: prop?.title || prop?.data?.title || "Untitled Property",
            description: prop?.description || prop?.data?.description || "",
            price: prop?.price || prop?.data?.price || "N/A",
            status: prop?.status || "pending",
            type: prop?.type || prop?.data?.type || "Unknown",
            images: Array.isArray(prop?.images)
              ? prop.images
              : Array.isArray(prop?.data?.images)
              ? prop.data.images
              : ["https://via.placeholder.com/150?text=No+Image"],
            propertyContact: {
              name:
                prop?.propertyContact?.name || prop?.owner?.name || "Unknown",
              email:
                prop?.propertyContact?.email ||
                prop?.owner?.email ||
                "no-email@example.com",
            },
          };
        });

        console.log("Normalized properties:", this.properties);
      } catch (error) {
        this.error = "Failed to load properties. Please try again later.";
        console.error("Fetch properties error:", error);
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
