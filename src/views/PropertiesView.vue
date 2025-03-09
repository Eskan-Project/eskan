<template>
  <div class="properties">
    <div
      class="relative w-full mx-auto h-[300px] bg-cover bg-center"
      :style="{ backgroundImage: `url(${bgImage})` }"
      loading="lazy"
    >
      <div class="absolute inset-0 bg-black/40"></div>
      <div
        class="relative z-10 flex justify-center items-center h-full w-full max-w-4xl text-gray-500 mx-auto p-4"
      >
        <div
          class="shadow-lg w-full fixed left-0 z-50 transition-all duration-500 flex justify-center"
          :class="{
            'bg-white top-[70px] py-5': isScrolled || isExpanded,
            'bg-transparent top-[200px] transform -translate-y-1/2':
              !isScrolled && !isExpanded,
          }"
        >
          <div class="flex justify-center items-center">
            <div
              v-if="isExpanded || !isScrolled"
              class="inline-flex items-center gap-2 px-4 py-3 mt-5 mb-3 shadow-lg transition-all duration-300 transform bg-white rounded-lg text-center"
            >
              <div v-if="!isSmallScreen">
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Search by keyword"
                  class="px-2 py-2 text-sm"
                />
                <select
                  v-model="selectedLocation"
                  class="text-[#364365] hover:bg-gray-500 hover:text-white p-2 rounded-md text-sm"
                >
                  <option value="" disabled selected>Location</option>
                  <option>New York</option>
                  <option>Los Angeles</option>
                  <option>San Francisco</option>
                  <option>Chicago</option>
                  <option>Washington, D.C.</option>
                </select>
                <select
                  v-model="selectedCheckIn"
                  class="hover:bg-gray-500 hover:text-white p-2 rounded-md text-sm"
                >
                  <option value="" disabled selected>Check-in</option>
                  <option>Today</option>
                  <option>Tomorrow</option>
                  <option>This week</option>
                </select>
                <select
                  v-model="selectedCheckOut"
                  class="hover:bg-gray-500 hover:text-white p-2 rounded-md text-sm"
                >
                  <option value="" disabled selected>Check-out</option>
                  <option>Today</option>
                  <option>Tomorrow</option>
                  <option>This week</option>
                </select>
                <select
                  v-model="selectedGuests"
                  class="hover:bg-gray-500 hover:text-white p-2 rounded-md text-sm"
                >
                  <option value="" disabled selected>Guests</option>
                  <option>1 guest</option>
                  <option>2 guests</option>
                  <option>3 guests</option>
                </select>
                <button
                  class="bg-black text-white px-4 py-2 rounded-md transition hover:bg-gray-800"
                >
                  Search
                </button>
              </div>

              <div
                v-else
                class="rounded-full flex items-center bg-white p-2 relative"
              >
                <div class="relative w-full">
                  <input
                    v-model="searchQuery"
                    type="text"
                    placeholder="Search by keyword"
                    class="px-4 py-2 rounded-md text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div
                    class="absolute inset-y-0 bg-[#364365] p-2 text-white bold rounded-[50%] right-3 flex items-center cursor-pointer"
                    @click="toggleFilterOptions"
                  >
                    <i class="bi bi-filter-circle"></i>
                  </div>
                </div>
                <div
                  v-if="showFilterOptions"
                  class="absolute top-full mt-2 right-0 bg-white rounded-md shadow-lg p-4 w-64 z-10"
                >
                  <div class="space-y-4">
                    <select
                      v-model="selectedLocation"
                      class="text-[#364365] hover:bg-gray-500 hover:text-white p-2 rounded-md text-sm w-[100%] overflow-hidden mb-2"
                    >
                      <option class="w-[50%]" value="" disabled selected>
                        Location
                      </option>
                      <option>New York</option>
                      <option>Los Angeles</option>
                      <option>San Francisco</option>
                      <option>Chicago</option>
                      <option>Washington, D.C.</option>
                    </select>
                    <select
                      v-model="selectedCheckIn"
                      class="hover:bg-gray-500 hover:text-white p-2 rounded-md text-sm w-full mb-2"
                    >
                      <option value="" disabled selected>Check-in</option>
                      <option>Today</option>
                      <option>Tomorrow</option>
                      <option>This week</option>
                    </select>
                    <select
                      v-model="selectedCheckOut"
                      class="hover:bg-gray-500 hover:text-white p-2 rounded-md text-sm w-full mb-2"
                    >
                      <option value="" disabled selected>Check-out</option>
                      <option>Today</option>
                      <option>Tomorrow</option>
                      <option>This week</option>
                    </select>
                    <div class="relative">
                      <select
                        v-model="selectedGuests"
                        class="hover:bg-gray-500 hover:text-white p-2 rounded-md text-sm w-full mb-2"
                      >
                        <option value="" disabled selected>Guests</option>
                        <option v-if="!isGuestsOpen">Guests</option>
                      </select>
                      <div
                        v-if="isGuestsOpen"
                        class="absolute top-full left-0 bg-white rounded-md shadow-md p-2 w-full border"
                        style="max-height: 150px; overflow-y: auto"
                      >
                        <button
                          @click="selectedGuests = '1 guest'"
                          class="block w-full text-left p-2 hover:bg-gray-100"
                        >
                          1 guest
                        </button>
                        <button
                          @click="selectedGuests = '2 guests'"
                          class="block w-full text-left p-2 hover:bg-gray-100"
                        >
                          2 guests
                        </button>
                        <button
                          @click="selectedGuests = '3 guests'"
                          class="block w-full text-left p-2 hover:bg-gray-100"
                        >
                          3 guests
                        </button>
                      </div>
                    </div>
                    <button
                      class="bg-black text-white px-4 py-2 rounded-md transition hover:bg-gray-800 w-full"
                    >
                      Search
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div
              v-else
              class="flex items-center justify-center w-auto p-3 transition-all duration-300"
            >
              <div
                class="border rounded-full w-full flex items-center p-2 bg-white shadow-md"
              >
                <span class="px-2">{{ selectedLocation || "Anywhere" }}</span>
                <span class="px-2">{{ selectedCheckIn || "Any week" }}</span>
                <span class="px-2">{{ selectedGuests || "Add guests" }}</span>
                <button
                  class="bg-[#364365] text-white w-8 h-8 ml-auto mr-3 rounded-[50%] transition-transform duration-300 hover:scale-110"
                  @click="toggleSearch"
                >
                  Q
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container mx-auto py-10 px-5">
      <div v-if="filteredProperties.length > 0">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <PropertyCard
            v-for="property in paginatedProperties"
            :key="property.id"
            :property="property"
          />
        </div>

        <div class="flex justify-center mt-10 text-gray-500">
          <button
            class="px-3 py-2 border rounded-md mx-1"
            @click="prevPage"
            :disabled="currentPage === 1"
          >
            Previous
          </button>
          <button
            v-for="page in visiblePages"
            :key="page"
            class="px-3 py-2 border rounded-md mx-1"
            :class="{ 'bg-gray-300': page === currentPage }"
            @click="goToPage(page)"
          >
            {{ page }}
          </button>
          <button
            class="px-3 py-2 border rounded-md mx-1"
            @click="nextPage"
            :disabled="currentPage === totalPages"
          >
            Next
          </button>
        </div>
      </div>

      <div v-else class="flex justify-center items-center h-64">
        <p class="text-gray-500 text-lg">
          No properties found. Try adjusting your filters.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import PropertyCard from "@/components/PropertyCard.vue";
import propertiesBg from "@/assets/images/properties.jpg";

export default {
  components: { PropertyCard, SearchBar },
  data() {
    return {
      bgImage: propertiesBg,
      currentPage: 1,
      perPage: 8,
      properties: [],
      properties: [],
      isScrolled: false,
      isExpanded: false,
      isSmallScreen: window.innerWidth < 860,
      showFilterOptions: false,
      isCheckInOpen: false,
      isCheckOutOpen: false,
      isGuestsOpen: false,
    };
  },
  computed: {
    filteredProperties() {
      console.log("Search Params:", this.searchParams);
      let filtered = this.properties;

      if (this.searchParams.searchQuery.trim()) {
        filtered = filtered.filter(
          (property) =>
            property.title
              .toLowerCase()
              .includes(this.searchParams.searchQuery.toLowerCase()) ||
            property.description
              .toLowerCase()
              .includes(this.searchParams.searchQuery.toLowerCase()) ||
            property.location
              .toLowerCase()
              .includes(this.searchParams.searchQuery.toLowerCase()) ||
            property.type
              .toLowerCase()
              .includes(this.searchParams.searchQuery.toLowerCase()) ||
            property.status
              .toLowerCase()
              .includes(this.searchParams.searchQuery.toLowerCase())
        );
      }

      if (this.searchParams.selectedLocation) {
        filtered = filtered.filter(
          (property) => property.location === this.searchParams.selectedLocation
        );
      }

      if (this.searchParams.selectedRoomType) {
        filtered = filtered.filter(
          (property) => property.type === this.searchParams.selectedRoomType
        );
      }

      if (this.searchParams.selectedStatus) {
        filtered = filtered.filter(
          (property) => property.status === this.searchParams.selectedStatus
        );
      }

      if (this.searchParams.selectedFurnished !== "") {
        filtered = filtered.filter(
          (property) =>
            property.furnished ===
            (this.searchParams.selectedFurnished === "true")
        );
      }

      if (this.searchParams.selectedRooms) {
        filtered = filtered.filter(
          (property) =>
            property.rooms === parseInt(this.searchParams.selectedRooms)
        );
      }

      console.log("Filtered Properties:", filtered);
      return filtered;
    },
    totalPages() {
      return Math.ceil(this.filteredProperties.length / this.perPage);
    },
    paginatedProperties() {
      const start = (this.currentPage - 1) * this.perPage;
      return this.filteredProperties.slice(start, start + this.perPage);
    },
    visiblePages() {
      return Array.from(
        { length: Math.min(this.totalPages, 5) },
        (_, i) => i + 1
      );
    },
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll);
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
    this.fetchProperties();
    this.fetchProperties();
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
    window.removeEventListener("resize", this.handleResize);
  },
  methods: {
    async fetchProperties() {
      try {
        const response = await fetch(
          "https://eskan-project-14c3b-default-rtdb.europe-west1.firebasedatabase.app/properties.json"
        );
     
        const data = await response.json();
        if (data) {
          this.properties = Object.entries(data).map(([key, value]) => ({
            id: key,
            ...value.data,
          }));
          console.log("Loaded Properties:", this.properties);
        }
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    },
    goToProperty(property) {
      this.$router.push({
        name: "PropertyItem",
        params: { id: property.id },
        state: { property },
      });
    },

    handleScroll() {
      this.isScrolled = window.scrollY > 0;
    },
    toggleFilterOptions() {
      this.showFilterOptions = !this.showFilterOptions;
    },
    toggleNested(filter) {
      if (filter === "checkIn") {
        this.isCheckInOpen = !this.isCheckInOpen;
      } else if (filter === "checkOut") {
        this.isCheckOutOpen = !this.isCheckOutOpen;
      } else if (filter === "guests") {
        this.isGuestsOpen = !this.isGuestsOpen;
      }
    },
    toggleSearch() {
      this.isExpanded = !this.isExpanded;
      if (this.isExpanded) {
        window.addEventListener("scroll", this.handleScroll);
      } else {
        window.removeEventListener("scroll", this.handleScroll);
      }
    },
    goToPage(page) {
      this.currentPage = page;
    },
    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++;
    },
    prevPage() {
      if (this.currentPage > 1) this.currentPage--;
    },
    handleResize() {
      this.isSmallScreen = window.innerWidth < 860;
    },
    handleSearch(searchParams) {
      this.searchParams = { ...searchParams };
      this.currentPage = 1;
    },
  },
};
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-slide-enter,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.nested-fade-enter-active,
.nested-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.nested-fade-enter,
.nested-fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

@media (max-width: 859px) {
  .rounded-full {
    width: 70vw !important;
  }
}
</style>
