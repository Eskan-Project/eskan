<template>
  <main class="min-h-screen bg-gray-100 dark:bg-gray-900 flex-1 p-6 md:p-8">
    <div class="max-w-6xl mx-auto">
      <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <div
          class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6"
        >
          <div class="w-full sm:w-auto relative">
            <input
              type="text"
              v-model="searchQuery"
              :class="
                windowWidth <= 550 ? 'text-xs p-1 pl-6' : 'text-sm p-3 pl-10'
              "
              class="block w-full text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 ease-in-out"
              placeholder="Search for properties"
              @input="resetPagination"
            />
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

        <div class="overflow-x-auto">
          <table class="w-full text-left text-gray-600 dark:text-gray-300">
            <thead
              class="text-gray-700 dark:text-gray-200 uppercase bg-gray-200 dark:bg-gray-700"
            >
              <tr>
                <th
                  :class="
                    windowWidth <= 550
                      ? 'px-1 py-1 text-[10px] w-2/5'
                      : 'px-4 py-3 text-sm w-2/5'
                  "
                >
                  Title
                </th>
                <th
                  v-if="windowWidth > 978 && windowWidth > 450"
                  :class="[
                    windowWidth <= 550
                      ? 'px-1 py-1 text-[10px] hidden sm:table-cell w-1/5'
                      : 'px-4 py-3 text-sm hidden sm:table-cell w-1/5',
                  ]"
                >
                  Owner Name
                </th>
                <th
                  v-if="windowWidth > 978"
                  :class="
                    windowWidth <= 550
                      ? 'px-1 py-1 text-[10px] hidden sm:table-cell w-1/5'
                      : 'px-4 py-3 text-sm hidden sm:table-cell w-1/5'
                  "
                >
                  Property Status
                </th>
                <th
                  :class="
                    windowWidth <= 550
                      ? 'px-1 py-1 text-[10px] w-1/5'
                      : 'px-4 py-3 text-sm w-1/5'
                  "
                >
                  Details
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
                      :class="windowWidth <= 550 ? 'w-6 h-6' : 'w-10 h-10'"
                      class="rounded-full border border-[#364365] dark:border-gray-600 object-cover"
                      :src="property.images[0]"
                      alt="Property image"
                    />
                    <div>
                      <div
                        :class="
                          windowWidth <= 550
                            ? 'text-[10px] font-semibold truncate'
                            : 'text-sm font-semibold truncate'
                        "
                      >
                        {{ property.title }}
                      </div>
                      <div
                        v-if="windowWidth > 450"
                        :class="
                          windowWidth <= 550
                            ? 'text-[10px] text-gray-500 dark:text-gray-400 truncate'
                            : 'text-xs text-gray-500 dark:text-gray-400 truncate'
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
                      ? 'px-1 py-1 text-[10px] hidden sm:table-cell truncate'
                      : 'px-4 py-3 text-sm hidden sm:table-cell truncate',
                  ]"
                >
                  {{ property.propertyContact.name }}
                </td>
                <td
                  v-if="windowWidth > 978"
                  :class="[
                    windowWidth <= 550
                      ? 'px-1 py-1 text-[10px] hidden sm:table-cell truncate'
                      : 'px-4 py-3 text-sm hidden sm:table-cell truncate',
                    {
                      'text-red-500 font-medium': property.status === 'expired',
                      'text-green-500 font-medium':
                        property.status === 'completed',
                    },
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
                  :class="windowWidth <= 550 ? 'px-1 py-1' : 'px-4 py-3'"
                >
                  <router-link :to="`/admin/properties/${property.title}`">
                    <button
                      class="text-[#364365] dark:text-blue-400 p-1 rounded hover:bg-[#364365] dark:hover:bg-blue-700 hover:text-white transition duration-200 ease-in-out flex items-center"
                      :class="windowWidth <= 550 ? 'text-[8px]' : 'text-xs'"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 9 0 11-18 0 9 9 9 0 0118 0z"
                        />
                      </svg>
                      View Details
                    </button>
                  </router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          v-if="paginatedProperties.length === 0"
          class="p-3 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800"
          :class="windowWidth <= 550 ? 'text-[10px]' : 'text-xs'"
        >
          No properties found.
        </div>

        <div
          v-if="filteredProperties.length > 0"
          class="flex flex-wrap justify-center gap-1 p-1 sm:p-2 mt-6"
        >
          <button
            @click="prevPage"
            :disabled="currentPage === 1"
            :class="
              windowWidth <= 550 ? 'px-2 py-1 text-[10px]' : 'px-4 py-2 text-sm'
            "
            class="font-medium text-white bg-[#364365] rounded-md hover:bg-[#4a5b8a] disabled:opacity-50"
          >
            Previous
          </button>
          <span
            :class="
              windowWidth <= 550 ? 'px-2 py-1 text-[10px]' : 'px-2 py-1 text-sm'
            "
            class="font-medium text-gray-700 dark:text-gray-300"
          >
            Page {{ currentPage }} of {{ totalPages }}
          </span>
          <button
            @click="nextPage"
            :disabled="currentPage === totalPages || totalPages === 0"
            :class="
              windowWidth <= 550 ? 'px-2 py-1 text-[10px]' : 'px-4 py-2 text-sm'
            "
            class="font-medium text-white bg-[#364365] rounded-md hover:bg-[#4a5b8a] disabled:opacity-50"
          >
            Next
          </button>
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
      await this.loadData();
    } catch (error) {
      console.error("Error in created:", error);
    }
  },
  methods: {
    ...mapActions("property", ["getProperties"]),
    async loadData() {
      try {
        this.error = null;
        this.properties = (await this.getProperties()) || [];
        console.log(this.properties);
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
