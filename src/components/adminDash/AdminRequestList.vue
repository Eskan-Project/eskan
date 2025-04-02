<template>
  <main class="min-h-screen bg-gray-100 flex-1 p-6 md:p-8">
    <div class="max-w-6xl mx-auto">
      <div class="bg-white shadow-md rounded-lg p-6">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div class="w-full sm:w-auto relative">
            <input
              type="text"
              v-model="searchQuery"
              class="block w-full p-3 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 ease-in-out"
              placeholder="Search for properties"
              @input="resetPagination"
            />
          </div>
          <router-link to="/admin/add-property" class="w-full sm:w-auto">
            <button
              type="button"
              class="px-5 py-2.5 text-sm font-medium text-white bg-[#364365] hover:bg-[#4a5b8a] rounded-lg transition duration-200 ease-in-out"
            >
              Add Property
            </button>
          </router-link>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left text-gray-600">
            <thead class="text-xs text-gray-700 uppercase bg-gray-200">
              <tr>
                <th scope="col" class="px-6 py-3 w-1/4">Property Title</th>
                <th scope="col" class="px-6 py-3 w-1/4 hidden sm:table-cell">Status</th>
                <th scope="col" class="px-6 py-3 w-1/4 hidden sm:table-cell">Price (EGP)</th>
                <th scope="col" class="px-6 py-3 w-1/4 ">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="request in paginatedRequests"
                :key="request.uid"
                class="border-b hover:bg-gray-50 transition duration-200 ease-in-out"
              >
                <th class="flex items-center px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                  <img
                    class="w-10 h-10 rounded-full mr-3 border border-[#364365]"
                    :src="request.images?.length ? request.images[0] : noPhotoImage"
                    alt="Property image"
                  />
                  <div>
                    <div class="text-base font-semibold">{{ request.title }}</div>
                    <div class="font-normal text-gray-500">{{ request.propertyContact.name }}</div>
                    <div class="text-xs text-gray-500 sm:hidden">
                      Status: {{ request.status }} | Price: {{ request.price }} EGP
                    </div>
                  </div>
                </th>
                <td class="px-6 py-4 hidden sm:table-cell">{{ request.status }}</td>
                <td class="px-6 py-4 hidden sm:table-cell">{{ request.price }} EGP</td>
                <td class="px-6 py-4 text-center">
                  <router-link :to="`/admin/requests/${request.uid}`" >
                    <button class="text-[#364365]  rounded hover:bg-[#364365] hover:text-white transition duration-200 ease-in-out flex items-center">
  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
  View Details
</button>
                  </router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="paginatedRequests.length === 0" class="p-4 text-center text-gray-500">
          No requests found.
        </div>

        <div v-if="filteredRequests.length > 0" class="flex justify-center items-center gap-2 mt-6">
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
  </main>
</template>

<script>
import noPhotoImage from "../../assets/images/no-photo.jpg";
import { mapActions, mapState } from "vuex"; // Add mapState
import Swal from "sweetalert2";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';

export default {
  data() {
    return {
      noPhotoImage,
      currentPage: 1,
      perPage: 8,
      searchQuery: "",
      isLoading: false,
    };
  },
  computed: {
    ...mapState("requests", ["requests"]), // Get requests from state
    filteredRequests() {
      if (!this.searchQuery) {
        return this.requests;
      }

      const query = this.searchQuery.toLowerCase();
      return this.requests.filter((request) => {
        return (
          (request.name && request.name.toLowerCase().includes(query)) ||
          (request.email && request.email.toLowerCase().includes(query)) ||
          (request.nationalId && request.nationalId.includes(query))
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
      const start = (this.currentPage - 1) * this.perPage;
      const end = start + this.perPage;
      return this.filteredRequests.slice(start, end);
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
    requests: {
      handler(newRequests) {
        console.log("requests updated:", newRequests);
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
    ...mapActions("requests", ["getRequests", "deleteRequest"]),
    async handleDeleteRequest(requestId) {
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
        await this.deleteRequest(requestId); // Changed from deleteOne to directly use deleteRequest
        await this.loadData(); // Reload the requests list after deletion

        await Swal.fire(
          "Deleted!",
          "Request has been deleted successfully.",
          "success"
        );
      } catch (error) {
        console.error("Delete failed:", error);
        Swal.fire(
          "Error!",
          "Failed to delete request. Please try again.",
          "error"
        );
      } finally {
        this.loading = false;
      }
    },
    // Remove the deleteOne method as it's no longer needed
    async loadData() {
      try {
        await this.getRequests(); // Don't reassign requests here, use from state
      } catch (error) {
        console.error("Fetch requests error:", error);
      }

      console.log(this.requests);
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
