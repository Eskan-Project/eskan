<template>
  <div class="properties">
    <div
      class="relative w-full mx-auto h-[380px] bg-cover bg-center"
      :style="{ backgroundImage: `url(${bgImage})` }"
    >
      <div class="absolute inset-0 bg-black/40"></div>
      <div
        class="relative z-10 flex justify-center items-center h-full w-full max-w-4xl text-gray-500 mx-auto p-4"
      >
        <div
          class="shadow-lg w-full fixed left-0 z-50 transition-all duration-500 flex justify-center"
          :class="{
            'bg-white top-[70px]': isScrolled || isExpanded,
            'bg-transparent top-1/3 transform -translate-y-1/2':
              !isScrolled && !isExpanded,
          }"
        >
          <div class="flex justify-center items-center">
            <div
              v-if="isExpanded || !isScrolled"
              class="inline-flex items-center gap-2 px-4 py-3 mt-5 mb-3 shadow-lg transition-all duration-300 transform bg-white rounded-lg text-center"
            >
              <input
                type="text"
                placeholder=" Search by keyword"
                class="border px-2 py-2 rounded-md text-sm"
              />
              <select
                class="hover:bg-gray-500 hover:text-white p-2 rounded-md text-sm"
              >
                <option disabled selected>Location</option>
                <option>New York</option>
                <option>Los Angeles</option>
                <option>️ San Francisco</option>
                <option>Chicago</option>
                <option>Washington, D.C.</option>
              </select>
              <select
                class="hover:bg-gray-500 hover:text-white p-2 rounded-md text-sm"
              >
                <option disabled selected>Check-in</option>
              </select>
              <select
                class="hover:bg-gray-500 hover:text-white p-2 rounded-md text-sm"
              >
                <option disabled selected>Check-out</option>
              </select>
              <select
                class="hover:bg-gray-500 hover:text-white p-2 rounded-md text-sm"
              >
                <option disabled selected>Guests</option>
              </select>
              <button
                class="bg-black text-white px-4 py-2 rounded-md transition hover:bg-gray-800"
              >
                Search
              </button>
            </div>
            <div
              v-else
              class="flex items-center justify-center w-auto p-3 transition-all duration-300"
            >
              <div
                class="border rounded-full flex items-center p-2 bg-white shadow-md"
              >
                <span class="px-2">Anywhere</span>
                <span class="px-2">Any week</span>
                <span class="px-2">Add guests</span>
                <button
                  class="bg-[#364365] text-white rounded-full w-8 h-8 ml-2 transition-transform duration-300 hover:scale-110"
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
  </div>
</template>

<script>
import PropertyCard from "@/components/PropertyCard.vue";
import propertiesBg from "@/assets/images/properties.png";
import properties from "@/data/properties.js";

export default {
  components: { PropertyCard },
  data() {
    return {
      bgImage: propertiesBg,
      currentPage: 1,
      perPage: 8,
      properties,
      isScrolled: false,
      isExpanded: false,
    };
  },
  computed: {
    filteredProperties() {
      return this.properties;
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
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
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
  },
};
</script>
