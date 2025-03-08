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
                <th scope="col" class="px-6 py-3">title</th>
                <th scope="col" class="px-6 py-3">Owner Name</th>
                <th scope="col" class="px-6 py-3">type</th>
                <th scope="col" class="px-6 py-3">Details</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="property in paginatedProperties"
                :key="property.id"
                class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <td class="w-4 p-4"></td>
                <th
                  scope="row"
                  class="flex items-center px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  <img
                    class="w-10 h-10 rounded-full"
                    :src="property.data.gallery[0]"
                    alt="Jese image"
                  />
                  <div class="ps-3">
                    <div class="text-base font-semibold">
                      {{ property.data.title }}
                    </div>
                    <div class="font-normal text-gray-500">
                      {{ property.data.description }}
                    </div>
                  </div>
                </th>
                <td class="px-6 py-4">{{ property.owner.name }}</td>
                <td class="px-6 py-4">
                  <div class="flex items-center">
                    {{ property.data.type }}
                  </div>
                </td>
                <td class="px-6 py-4">
                  <!-- Modal toggle -->
                  <router-link
                    :to="`/admin/properties/${property.id}`"
                    type="button"
                    data-modal-show="editUserModal"
                    class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    >Edit</router-link
                  >
                </td>
              </tr>
            </tbody>
          </table>

          <!-- No data message -->
          <div
            v-if="paginatedProperties.length === 0"
            class="p-4 text-center text-gray-500"
          >
            No properties found.
          </div>

          <!-- Pagination controls -->
          <div
            v-if="filteredProperties.length > 0"
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
      await this.getData();
    } catch (error) {
      console.error("Error in created:", error);
    }
  },
  methods: {
    async getData() {
      this.isLoading = true;
      try {
        const response = await fetch(
          "https://eskan-project-14c3b-default-rtdb.europe-west1.firebasedatabase.app/properties.json"
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (!data) {
          this.properties = [];
          return;
        }

        // Transform the data and enforce a consistent structure
        this.properties = Object.entries(data)
          .map(([id, obj]) => ({
            id,
            data: obj.data || {},
            owner: obj.owner || { name: "Unknown" },
          }))
          .sort((a, b) => a.id.localeCompare(b.id));
      } catch (error) {
        console.error("Error fetching data:", error);
        this.properties = [];
      } finally {
        this.isLoading = false;
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
