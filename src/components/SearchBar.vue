<template>
  <div class="filter-bar text-gray-900">
    <div
      v-if="isExpanded || !isScrolled"
      class="inline-flex items-center gap-2 px-4 py-3 mt-5 mb-3 shadow-lg transition-all duration-300 transform bg-white rounded-lg text-center"
    >
      <div v-if="!isSmallScreen">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by keyword"
          class="px-2 py-2 text-sm "
        />

        <select
          v-model="selectedCity"
          class="text-[#364365] hover:bg-gray-500 hover:text-white text-gray-900 p-2 rounded-md text-sm "
        >
          <option value="" disabled selected>City</option>
          <option class="text-gray-900 hover:text-white" v-for="City in uniqueCitys" :key="City">
            {{ City }}
          </option>
        </select>

        <select
          v-model="selectedRooms"
          class="hover:bg-gray-500 hover:text-white p-2 rounded-md text-sm "
        >
          <option value="" disabled selected>Rooms</option>
          <option v-for="rooms in uniqueRooms" :key="rooms">
            {{ rooms }}
          </option>
        </select>

        <select
          v-model="selectedPropertyStatus"
          class="hover:bg-gray-500 hover:text-white p-2 rounded-md text-sm "
        >
          <option value="" disabled selected>Property Status</option>
          <option v-for="status in uniquePropertyStatus" :key="status">
            {{ status }}
          </option>
        </select>

        <button
          class="bg-black text-white px-4 py-2 rounded-md m-2 transition hover:bg-gray-800"
          @click="performFilter"
        >
          Filter
        </button>
        <button
          class="bg-gray-500 text-white px-4 py-2 rounded-md transition hover:bg-gray-700"
          @click="resetFilters"
        >
          Reset
        </button>
      </div>

      <div v-else class="rounded-full flex items-center bg-white p-2 relative">
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
              v-model="selectedCity"
              class="text-[#364365] hover:bg-gray-500 hover:text-white p-2 rounded-md text-sm w-[100%] overflow-hidden mb-2 border"
            >
              <option class="w-[50%]" value="" disabled selected>City</option>
              <option v-for="City in uniqueCitys" :key="City">
                {{ City }}
              </option>
            </select>

            <select
              v-model="selectedRooms"
              class="text-[#364365] hover:bg-gray-500 hover:text-white p-2 rounded-md text-sm w-[100%] overflow-hidden mb-2 border"
            >
              <option value="" disabled selected>Rooms</option>
              <option v-for="rooms in uniqueRooms" :key="rooms">
                {{ rooms }}
              </option>
            </select>

            <select
              v-model="selectedPropertyStatus"
              class="text-[#364365] hover:bg-gray-500 hover:text-white p-2 rounded-md text-sm w-[100%] overflow-hidden mb-2 border"
            >
              <option value="" disabled selected>Property Status</option>
              <option value="new">New</option>
              <option value="old">Old</option>
              <option value="rent">Rent</option>
            </select>

            <button
              class="bg-black text-white px-4 py-2 rounded-md transition hover:bg-gray-800 w-full"
              @click="performFilter"
            >
              Filter
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      v-else
      class="flex items-center justify-center w-auto p-3 transition-all duration-300"
    >
      <div class="border rounded-full w-full flex items-center p-2 bg-white shadow-md">
        <span class="px-2">{{ selectedCity || "Anywhere" }}</span>
        <span class="px-2">{{ selectedRooms || "Any Rooms" }}</span>
        <span class="px-2">
          {{ selectedPropertyStatus || "Any Status" }}
        </span>
        <button
          class="bg-[#364365] text-white w-8 h-8 ml-auto mr-3 rounded-[50%] transition-transform duration-300 hover:scale-110"
          @click="toggleSearch"
        >
          Q
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isScrolled: Boolean,
    isExpanded: Boolean,
    isSmallScreen: Boolean,
    properties: Array,
  },
  data() {
    return {
      searchQuery: "",
      selectedCity: "",
      selectedRooms: "",
      selectedPropertyStatus: "",
      showFilterOptions: false,
    };
  },
  computed: {
    uniqueCitys() {
      return this.properties
        ? [...new Set(this.properties.map((p) => p.city))]
        : [];
    },
    uniqueRooms() {
      return this.properties
        ? [...new Set(this.properties.map((p) => p.rooms))]
        : [];
    },
    uniquePropertyStatus() {
      return this.properties
        ? [...new Set(this.properties.map((p) => p.propertyStatus))]
        : [];
    },
  },
  methods: {
    toggleFilterOptions() {
      this.showFilterOptions = !this.showFilterOptions;
    },
    toggleSearch() {
      this.$emit("toggle-search");
    },
    performFilter() {
      this.$emit("filter", {
        searchQuery: this.searchQuery,
        selectedCity: this.selectedCity,
        selectedRooms: this.selectedRooms,
        selectedPropertyStatus: this.selectedPropertyStatus,
      });
    },
    resetFilters() {
      this.searchQuery = "";
      this.selectedCity = "";
      this.selectedRooms = "";
      this.selectedPropertyStatus = "";
      this.$emit("reset");
    },
  },
};
</script>



<style scoped>
@media (max-width: 859px) {
  .rounded-full {
    width: 70vw !important;
  }
}
</style>












