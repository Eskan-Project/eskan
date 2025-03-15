<template>
  <div class="properties">
    <section
      class="relative w-full h-[300px] bg-cover bg-center"
      :style="{
        backgroundImage: bgImage
          ? `url(${bgImage})`
          : 'url(/fallback-properties.jpg)',
      }"
    >
      <div class="absolute inset-0 bg-black/40"></div>
      <div
        class="relative z-10 flex items-center justify-center h-full max-w-4xl mx-auto p-4"
      >
      <div
          class="shadow-lg w-full fixed left-0 z-50 transition-all duration-500 flex justify-center"
          :class="{
            'bg-white top-[70px] py-5': isScrolled || isExpanded,
            'bg-transparent top-[200px] transform -translate-y-1/2':
              !isScrolled && !isExpanded,
          }"
        >
        <search-bar
          ref="searchBar"
          :is-scrolled="isScrolled"
          :is-expanded="isExpanded"
          :is-small-screen="isSmallScreen"
          v-model:search-query="searchQuery"
          v-model:selected-governorate="selectedGovernorate"
          v-model:selected-city="selectedCity"
          v-model:selected-property-status="selectedPropertyStatus"
          v-model:selected-rooms="selectedRooms"
          @toggle-search="toggleSearch"
          @search="searchProperties"
          @reset="resetFilters"
        />
      </div>
      </div>
    </section>

    <main class="container mx-auto py-10 px-5">
      <div
        v-if="isLoading"
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 py-10"
      >
        <div
          v-for="i in 8"
          :key="i"
          class="bg-gray-200 min-h-64 rounded-lg animate-pulse"
        ></div>
      </div>
      <div v-else-if="error" class="text-center py-10">
        <p class="text-red-500 text-lg">{{ error }}</p>
        <button @click="loadData" class="mt-4 text-blue-500 underline">
          Retry
        </button>
      </div>
      <div v-else>
        <property-list
          v-if="filteredProperties.length"
          :properties="paginatedProperties"
        />
        <p v-else class="text-center text-gray-500 py-10">
          No properties match your filters.
        </p>
        <pagination
          v-if="filteredProperties.length"
          v-model:current-page="currentPage"
          :total-pages="totalPages"
          :visible-pages="visiblePages"
          @prev="prevPage"
          @next="nextPage"
          @go-to="goToPage"
        />
      </div>
    </main>
  </div>
</template>

<script>
import SearchBar from "@/components/propertiesView/SearchBar.vue";
import PropertyList from "@/components/propertiesView/PropertyList.vue";
import Pagination from "@/components/propertiesView/Pagination.vue";
import propertiesBg from "@/assets/images/properties.jpg?url";
import { mapActions, mapGetters } from "vuex";
import debounce from "lodash/debounce";

export default {
  name: "PropertiesView",
  components: { SearchBar, PropertyList, Pagination },
  data: () => ({
    bgImage: propertiesBg,
    currentPage: 1,
    perPage: 8,
    isScrolled: false,
    isExpanded: false,
    isSmallScreen: window.innerWidth < 860,
    searchQuery: "",
    selectedGovernorate: "",
    selectedCity: "",
    selectedPropertyStatus: "",
    selectedRooms: "",
    error: null,
  }),
  computed: {
    ...mapGetters(["isLoading"]),
    ...mapGetters("property", ["allProperties"]),
    properties() {
      return this.allProperties;
    },
    filteredProperties() {
      return (this.properties || [])
        .filter((p) => {
          if (!this.searchQuery.trim()) return true;
          const query = this.searchQuery.toLowerCase();
          return ["title", "description", "type", "status"].some((key) =>
            p[key]?.toLowerCase().includes(query)
          );
        })
        .filter(
          (p) =>
            !this.selectedGovernorate ||
            p.governorate === this.selectedGovernorate
        )
        .filter((p) => !this.selectedCity || p.city === this.selectedCity)
        .filter(
          (p) =>
            !this.selectedPropertyStatus ||
            p.propertyStatus === this.selectedPropertyStatus
        )
        .filter((p) => !this.selectedRooms || p.rooms === +this.selectedRooms);
    },
    totalPages() {
      return Math.ceil(this.filteredProperties.length / this.perPage) || 1;
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
  watch: {
    currentPage() {
      this.updateQueryParams();
    },
    searchQuery() {
      this.updateQueryParams();
    },
    selectedGovernorate(newVal) {
      this.selectedCity = "";
      this.$refs.searchBar.updateCities(newVal);
      this.updateQueryParams();
    },
    selectedCity() {
      this.updateQueryParams();
    },
    selectedPropertyStatus() {
      this.updateQueryParams();
    },
    selectedRooms(newVal) {
      if (!isNaN(+newVal)) {
        this.updateQueryParams();
      }
    },
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll, { passive: true });
    window.addEventListener("resize", this.handleResize, { passive: true });
    this.loadData();
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
    window.removeEventListener("resize", this.handleResize);
  },
  methods: {
    ...mapActions("property", ["getProperties"]),
    async loadData() {
      try {
        this.error = null;
        await this.getProperties();
      } catch (error) {
        this.error = "Failed to load properties. Please try again later.";
        console.error("Fetch properties error:", error);
      }
    },
    updateQueryParams() {
      this.$router.push({
        query: {
          search: this.searchQuery || "",
          governorate: this.selectedGovernorate || "",
          city: this.selectedCity || "",
          propertyStatus: this.selectedPropertyStatus || "",
          rooms: this.selectedRooms || "",
          page: this.currentPage || 1,
        },
      });
    },
    handleScroll() {
      this.isScrolled = window.scrollY > 0;
      if (this.isScrolled && this.isExpanded) this.isExpanded = false;
    },
    handleResize() {
      this.isSmallScreen = window.innerWidth < 860;
    },
    toggleSearch() {
      this.isExpanded = !this.isExpanded;
    },
    searchProperties: debounce(function () {
      this.currentPage = 1;
    }, 300),
    goToPage(page) {
      this.currentPage = Math.max(1, Math.min(page, this.totalPages));
    },
    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++;
    },
    prevPage() {
      if (this.currentPage > 1) this.currentPage--;
    },
    resetFilters() {
      Object.assign(this, {
        searchQuery: "",
        selectedGovernorate: "",
        selectedCity: "",
        selectedPropertyStatus: "",
        selectedRooms: "",
        currentPage: 1,
        isExpanded: false,
      });
      this.$router.push({
        query: {},
      });
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
