<!-- src/views/PropertiesView.vue -->
<template>
  <div class="properties">
    <div
      class="relative w-full mx-auto h-[300px] bg-cover bg-center"
      :style="{ backgroundImage: bgImage ? `url(${bgImage})` : 'none' }"
    >
      <div class="absolute inset-0 bg-black/40"></div>
      <div
        class="relative z-10 flex items-center justify-center h-full max-w-4xl mx-auto p-4"
      >
        <search-bar
          :is-scrolled="isScrolled"
          :is-expanded="isExpanded"
          :is-small-screen="isSmallScreen"
          v-model:search-query="searchQuery"
          v-model:selected-location="selectedLocation"
          v-model:selected-check-in="selectedCheckIn"
          v-model:selected-check-out="selectedCheckOut"
          v-model:selected-guests="selectedGuests"
          @toggle-search="toggleSearch"
          @search="searchProperties"
          @reset="resetFilters"
        />
      </div>
    </div>

    <div class="container mx-auto py-10 px-5">
      <div v-if="error" class="text-center py-10">
        <p class="text-red-500 text-lg">{{ error }}</p>
      </div>
      <template v-else>
        <property-list :properties="paginatedProperties" />
        <pagination
          v-if="filteredProperties.length"
          v-model:current-page="currentPage"
          :total-pages="totalPages"
          :visible-pages="visiblePages"
          @prev="prevPage"
          @next="nextPage"
          @go-to="goToPage"
        />
      </template>
    </div>
  </div>
</template>

<script>
import SearchBar from "@/components/propertiesView/SearchBar.vue";
import PropertyList from "@/components/propertiesView/PropertyList.vue";
import Pagination from "@/components/propertiesView/Pagination.vue";
import propertiesBg from "@/assets/images/properties.jpg?url";
import { mapActions } from "vuex";

export default {
  name: "PropertiesView",
  components: { SearchBar, PropertyList, Pagination },
  data() {
    return {
      bgImage: null,
      properties: [],
      currentPage: 1,
      perPage: 8,
      isScrolled: false,
      isExpanded: false,
      isSmallScreen: window.innerWidth < 860,
      searchQuery: "",
      selectedLocation: "",
      selectedCheckIn: "",
      selectedCheckOut: "",
      selectedGuests: "",
      error: null,
    };
  },
  computed: {
    filteredProperties() {
      let filtered = [...this.properties];
      if (this.searchQuery.trim()) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.title?.toLowerCase().includes(query) ||
            p.description?.toLowerCase().includes(query) ||
            p.location?.toLowerCase().includes(query) ||
            p.type?.toLowerCase().includes(query) ||
            p.status?.toLowerCase().includes(query)
        );
      }
      if (this.selectedLocation) {
        filtered = filtered.filter((p) => p.location === this.selectedLocation);
      }
      if (this.selectedCheckIn) {
        const checkInDate = this.normalizeDate(this.selectedCheckIn);
        filtered = filtered.filter((p) =>
          p.availability?.some(
            (date) => this.normalizeDate(date) >= checkInDate
          )
        );
      }
      if (this.selectedCheckOut) {
        const checkOutDate = this.normalizeDate(this.selectedCheckOut);
        filtered = filtered.filter((p) =>
          p.availability?.some(
            (date) => this.normalizeDate(date) <= checkOutDate
          )
        );
      }
      if (this.selectedGuests) {
        const guestCount = parseInt(this.selectedGuests) || 0;
        filtered = filtered.filter((p) => p.capacity >= guestCount);
      }
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
      const total = this.totalPages;
      const maxPages = Math.min(total, 5);
      const start = Math.max(1, this.currentPage - Math.floor(maxPages / 2));
      return Array.from({ length: maxPages }, (_, i) => start + i).filter(
        (p) => p <= total
      );
    },
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll, { passive: true });
    window.addEventListener("resize", this.handleResize, { passive: true });
    this.loadAssetsAndData();
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
    window.removeEventListener("resize", this.handleResize);
  },
  methods: {
    ...mapActions(["startLoading", "stopLoading"]),
    async loadAssetsAndData() {
      this.startLoading();
      this.error = null;

      try {
        const imagePromise = this.preloadImage(propertiesBg);
        const propertiesPromise = fetch(
          "https://eskan-project-14c3b-default-rtdb.europe-west1.firebasedatabase.app/properties.json",
          { cache: "no-store" }
        ).then(async (response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data = await response.json();
          if (!data) throw new Error("No properties data received");
          return Object.entries(data).map(([key, value]) => ({
            id: key,
            ...value.data,
            availability: value.data.availability || [],
            capacity: value.data.capacity || 1,
          }));
        });

        const [_, properties] = await Promise.all([
          imagePromise,
          propertiesPromise,
        ]);
        this.bgImage = propertiesBg;
        this.properties = properties;
      } catch (error) {
        this.error = "Failed to load resources. Please refresh the page.";
      } finally {
        this.stopLoading();
      }
    },
    preloadImage(url) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = url;
        img.onload = resolve;
        img.onerror = () =>
          reject(new Error("Failed to load background image"));
      });
    },
    normalizeDate(dateStr) {
      const today = new Date();
      switch (dateStr) {
        case "Today":
          return today.toISOString().split("T")[0];
        case "Tomorrow":
          today.setDate(today.getDate() + 1);
          return today.toISOString().split("T")[0];
        case "This week":
          today.setDate(today.getDate() + 7);
          return today.toISOString().split("T")[0];
        default:
          return dateStr;
      }
    },
    handleScroll() {
      const scrolled = window.scrollY > 0;
      if (scrolled && this.isExpanded) this.isExpanded = false;
      this.isScrolled = scrolled;
    },
    handleResize() {
      this.isSmallScreen = window.innerWidth < 860;
    },
    toggleSearch() {
      this.isExpanded = !this.isExpanded;
    },
    searchProperties() {
      this.currentPage = 1;
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
    resetFilters() {
      this.searchQuery = "";
      this.selectedLocation = "";
      this.selectedCheckIn = "";
      this.selectedCheckOut = "";
      this.selectedGuests = "";
      this.currentPage = 1;
      this.isExpanded = false;
    },
  },
};
</script>

<style scoped>
.properties {
  position: relative;
  min-height: 100vh;
}
</style>
