<template>
  <div class="properties">
    <section
      class="relative w-full h-60 sm:h-72 md:h-80 lg:h-96 bg-cover bg-center"
      :style="{
        backgroundImage: bgImage
          ? `url(${bgImage})`
          : 'url(/fallback-properties.jpg)',
      }"
    >
      <div class="absolute inset-0 bg-black/50"></div>
      <div
        class="relative z-10 flex items-center justify-center h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div
          class="w-full fixed left-0 z-50 transition-all duration-300 flex justify-center"
          :class="{
            'bg-white top-14 sm:top-16 md:top-20 py-4 sm:py-5 shadow-lg':
              isScrolled || isExpanded,
            'bg-transparent top-1/4 md:top-1/3 -translate-y-1/2':
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

    <main class="container mx-auto py-8 lg:py-16 px-4 sm:px-6 lg:px-8">
      <div
        v-if="isLoading"
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10 py-10"
      >
        <div
          v-for="i in 8"
          :key="i"
          class="bg-gray-200 h-56 sm:h-64 md:h-72 rounded-lg animate-pulse"
        ></div>
      </div>
      <div v-else-if="error" class="text-center py-10">
        <p class="text-red-500 text-sm sm:text-base md:text-lg">{{ error }}</p>
        <button
          @click="loadData"
          class="mt-4 text-blue-500 underline text-sm sm:text-base"
        >
          Retry
        </button>
      </div>
      <div v-else>
        <property-list
          v-if="filteredProperties.length"
          :properties="paginatedProperties"
        />
        <p
          v-else
          class="text-center text-gray-500 py-10 text-sm sm:text-base md:text-lg"
        >
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
    pendingUpdate: false,
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
      this.debouncedUpdateQueryParams();
    },
    searchQuery() {
      this.currentPage = 1;
    },
    selectedGovernorate(newVal) {
      this.selectedCity = "";
      this.$refs.searchBar.updateCities(newVal);
      this.currentPage = 1;
    },
    selectedCity() {
      this.currentPage = 1;
    },
    selectedPropertyStatus() {
      this.currentPage = 1;
    },
    selectedRooms() {
      this.currentPage = 1;
    },
  },
  created() {
    this.debouncedUpdateQueryParams = debounce(() => {
      this.updateQueryParams();
    }, 300);
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
          search: this.searchQuery || undefined,
          governorate: this.selectedGovernorate || undefined,
          city: this.selectedCity || undefined,
          propertyStatus: this.selectedPropertyStatus || undefined,
          rooms: this.selectedRooms || undefined,
          page: this.currentPage !== 1 ? this.currentPage : undefined,
        },
      });
      this.pendingUpdate = false;
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
    searchProperties() {
      this.currentPage = 1;
      this.updateQueryParams();
    },
    goToPage(page) {
      this.currentPage = Math.max(1, Math.min(page, this.totalPages));
      this.updateQueryParams();
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.updateQueryParams();
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.updateQueryParams();
      }
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
