

<template>
  <div class="properties">
    <div
      class="relative w-full mx-auto h-[300px] bg-cover bg-center"
      :style="{ backgroundImage: `url(${bgImage})` }"
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
          <SearchBar
            v-if="properties.length > 0"
            :isScrolled="isScrolled"
            :isExpanded="isExpanded"
            :isSmallScreen="isSmallScreen"
            @toggle-search="toggleSearch"
            @filter="handleSearch"
            :properties="properties"
          />
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
        <p class="text-gray-500 text-lg">No properties found. Try adjusting your filters.</p>
      </div>
    </div>
  </div>
</template>

<script>
import PropertyCard from "@/components/PropertyCard.vue";
import propertiesBg from "@/assets/images/properties.png";
import SearchBar from "@/components/SearchBar.vue";

export default {
  components: { PropertyCard, SearchBar },
  data() {
    return {
      bgImage: propertiesBg,
      currentPage: 1,
      perPage: 8,
      properties: [],
      isScrolled: false,
      isExpanded: false,
      isSmallScreen: window.innerWidth < 860,
      searchParams: {
        searchQuery: "",
        selectedLocation: "",
        selectedRoomType: "",
        selectedStatus: "",
        selectedFurnished: "",
        selectedRooms: "",
      },
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
          (property) => property.rooms === parseInt(this.searchParams.selectedRooms)
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

 



