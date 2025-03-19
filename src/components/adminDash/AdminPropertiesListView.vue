<template>
  <main class="min-h-screen bg-gray-100 flex-1 p-2 sm:p-4 md:p-8">
    <div class="w-full">
      <!-- Main Content -->
      <div class="w-full">
        <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
          <!-- Search Section -->
          <div class="p-2 sm:p-4 bg-white dark:bg-gray-900">
            <div class="w-full sm:max-w-xs">
              <div class="relative">
                <div
                  class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none"
                >
                  <i class="bi bi-search"></i>
                </div>
                <input
                  type="text"
                  v-model="searchQuery"
                  class="block w-full pt-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Search for properties"
                  @input="resetPagination"
                />
              </div>
            </div>
          </div>

          <!-- Responsive Table -->
          <div class="overflow-x-auto">
            <table
              class="w-full text-sm text-left text-gray-500 dark:text-gray-400"
            >
              <thead
                class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
              >
                <tr>
                  <th scope="col" class="p-2 sm:p-4">title</th>
                  <th scope="col" class="p-2 sm:p-4 hidden sm:table-cell">
                    Owner Name
                  </th>
                  <th scope="col" class="p-2 sm:p-4 hidden sm:table-cell">
                    type
                  </th>
                  <th scope="col" class="p-2 sm:p-4">Details</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="property in paginatedProperties"
                  :key="property.id"
                  class="bg-white border-b hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-600"
                >
                  <th scope="row" class="p-2 sm:p-4">
                    <div
                      class="flex flex-col sm:flex-row items-start sm:items-center gap-2 ml-[2.5rem]"
                    >
                      <img
                        class="w-16 h-16 sm:w-10 sm:h-10 rounded-lg sm:rounded-full object-cover"
                        :src="property.images[0]"
                        alt="Property image"
                      />
                      <div class="space-y-1">
                        <div
                          class="text-sm sm:text-base font-semibold text-gray-900 dark:text-white"
                        >
                          {{ property.title }}
                        </div>
                        <div
                          class="text-xs sm:text-sm font-normal text-gray-500 line-clamp-2"
                        >
                          {{ property.propertyContact.email }}
                        </div>
                      </div>
                    </div>
                  </th>
                  <td class="p-2 sm:p-4 hidden sm:table-cell">
                    {{ property.propertyContact.name }}
                  </td>
                  <td class="p-2 sm:p-4 hidden sm:table-cell">
                    <div class="flex items-center">{{ property.price }}</div>
                  </td>
                  <td class="p-2 sm:p-4">
                    <router-link :to="`/admin/properties/${property.id}`">
                      <button
                        type="button"
                        class="w-full sm:w-auto text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-3 sm:px-5 py-1.5 sm:py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                      >
                        View Details
                      </button>
                    </router-link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- No data message -->
          <div
            v-if="paginatedProperties.length === 0"
            class="p-4 text-center text-gray-500 bg-white"
          >
            No properties found.
          </div>

          <!-- Pagination controls -->
          <div
            v-if="filteredProperties.length > 0"
            class="flex flex-wrap justify-center gap-2 p-2 sm:p-4"
          >
            <button
              @click="prevPage"
              :disabled="currentPage === 1"
              class="px-3 py-1 sm:px-4 sm:py-2 text-sm font-medium text-white bg-[#364365] rounded-md hover:bg-[#4a5b8a] disabled:opacity-50"
            >
              Previous
            </button>
            <span
              class="px-3 py-1 sm:px-4 sm:py-2 text-sm font-medium text-gray-700"
            >
              Page {{ currentPage }} of {{ totalPages }}
            </span>
            <button
              @click="nextPage"
              :disabled="currentPage === totalPages || totalPages === 0"
              class="px-3 py-1 sm:px-4 sm:py-2 text-sm font-medium text-white bg-[#364365] rounded-md hover:bg-[#4a5b8a] disabled:opacity-50"
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
import { mapActions } from "vuex";
export default {
  data() {
    return {
      properties: [],
      currentPage: 1,
      perPage: 8,
      searchQuery: "",
      isLoading: false,
    };
  },
  computed: {
    filteredProperties() {
      if (!this.searchQuery) {
        return this.properties;
      }

      const query = this.searchQuery.toLowerCase();
      return this.properties.filter((prop) => {
        return (
          (prop.data.title && prop.data.title.toLowerCase().includes(query)) ||
          (prop.data.description &&
            prop.data.description.toLowerCase().includes(query)) ||
          (prop.owner.name && prop.owner.name.toLowerCase().includes(query)) ||
          (prop.data.type && prop.data.type.toLowerCase().includes(query))
        );
      });
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
  },
};
</script>
