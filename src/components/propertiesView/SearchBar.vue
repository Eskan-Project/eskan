<template>
  <div class="filter-bar text-gray-900 dark:text-white" :style="filterBarStyle">
    <!-- Expanded or Unscrolled State -->
    <div
      v-if="isExpanded || !isScrolled"
      class="inline-flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3 sm:py-4 mt-4 sm:mt-6 mb-3 transition-all duration-300 sm:bg-white dark:sm:bg-[#1F2937] rounded-lg flex-wrap justify-center w-full max-w-6xl mx-auto"
    >
      <div
        v-if="!isSmallScreen"
        class="flex flex-wrap gap-3 sm:gap-4 w-full justify-center dark:text-white"
      >
        <input
          :value="localSearchQuery"
          @input="handleSearchInput"
          type="text"
          :placeholder="$t('search.placeholder')"
          class="dark:text-white dark:placeholder-white w-full sm:w-40 px-3 sm:px-4 py-2 sm:placeholder:text-sm placeholder:text-base text-sm sm:text-base rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#364365] dark:focus:ring-[#3D8BFF] dark:bg-[#1F2937]"
        />
        <div class="relative w-full sm:w-40" ref="governorateDropdown">
          <div
            @click="toggleGovernorateDropdown"
            class="bg-white dark:bg-[#1F2937] text-gray-700 dark:text-gray-200 text-sm sm:text-base rounded-md p-3 sm:p-4 sm:px-2 border border-gray-300 dark:border-gray-600 cursor-pointer flex justify-between items-center"
          >
            <span class="truncate sm:text-sm text-base">{{
              selectedGovernorateLabel || $t("search.select_governorate")
            }}</span>
            <span class="text-gray-500 dark:text-gray-400">▼</span>
          </div>
          <ul
            v-if="isGovernorateOpen"
            class="absolute w-full bg-white dark:bg-[#1F2937] border border-gray-300 dark:border-gray-600 rounded-md mt-1 shadow-lg z-10 max-h-48 overflow-y-auto"
          >
            <li
              v-for="loc in governorates"
              :key="loc.value"
              @click="selectGovernorate(loc)"
              class="p-2 hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer flex items-center gap-2 text-sm sm:text-base governorate-option text-gray-700 dark:text-gray-200"
            >
              <i class="bi bi-geo-alt text-[#364365] dark:text-[#3D8BFF]"></i>
              <span>{{ loc.label }}</span>
            </li>
          </ul>
        </div>
        <div class="relative w-full sm:w-40" ref="propertyStatusDropdown">
          <div
            @click="togglePropertyStatusDropdown"
            class="bg-white dark:bg-[#1F2937] text-gray-700 dark:text-gray-200 text-sm sm:text-base rounded-md p-3 sm:p-4 sm:px-2 border border-gray-300 dark:border-gray-600 cursor-pointer flex justify-between items-center"
          >
            <span class="truncate sm:text-sm text-base">{{
              selectedPropertyStatusLabel || $t("search.select_status")
            }}</span>
            <span class="text-gray-500 dark:text-gray-400">▼</span>
          </div>
          <ul
            v-if="isPropertyStatusOpen"
            class="absolute w-full bg-white dark:bg-[#1F2937] border border-gray-300 dark:border-gray-600 rounded-md mt-1 shadow-lg z-10 max-h-48 overflow-y-auto"
          >
            <li
              v-for="option in propertyStatusOptions"
              :key="option.value"
              @click="selectPropertyStatus(option)"
              class="p-2 hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer flex items-center gap-2 text-sm sm:text-base property-status-option text-gray-700 dark:text-gray-200"
            >
              <span>{{ option.label }}</span>
            </li>
          </ul>
        </div>
        <div class="relative w-full sm:w-40" ref="roomsDropdown">
          <div
            @click="toggleRoomsDropdown"
            class="bg-white dark:bg-[#1F2937] text-gray-700 dark:text-gray-200 text-sm sm:text-base rounded-md p-3 sm:p-4 sm:px-2 border border-gray-300 dark:border-gray-600 cursor-pointer flex justify-between items-center"
          >
            <span class="truncate sm:text-sm text-base">{{
              selectedRoomsLabel || $t("search.select_rooms")
            }}</span>
            <span class="text-gray-500 dark:text-gray-400">▼</span>
          </div>
          <ul
            v-if="isRoomsOpen"
            class="absolute w-full bg-white dark:bg-[#1F2937] border border-gray-300 dark:border-gray-600 rounded-md mt-1 shadow-lg z-10 max-h-48 overflow-y-auto"
          >
            <li
              v-for="room in roomsOptions"
              :key="room.value"
              @click="selectRooms(room)"
              class="p-2 hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer flex items-center gap-2 text-sm sm:text-base rooms-option text-gray-700 dark:text-gray-200"
            >
              <span>{{ room.label }}</span>
            </li>
          </ul>
        </div>
        <button
          class="bg-[#364365] dark:bg-[#3D8BFF] text-white px-4 sm:px-6 py-2 rounded-md text-sm sm:text-base hover:bg-[#2c3751] dark:hover:bg-blue-600 transition duration-300"
          @click="applyFilters"
        >
          {{ $t("search.button") }}
        </button>
        <button
          class="bg-[#364365] dark:bg-[#3D8BFF] text-white px-4 sm:px-6 py-2 rounded-md text-sm sm:text-base hover:bg-[#2c3751] dark:hover:bg-blue-600 transition duration-300"
          @click="resetFilters"
        >
          {{ $t("search.reset") }}
        </button>
      </div>

      <!-- Mobile Search Bar -->
      <div v-else class="relative w-full max-w-md mx-auto">
        <div
          class="flex items-center bg-white dark:bg-[#1F2937] rounded-full p-2"
        >
          <input
            :value="localSearchQuery"
            @input="handleSearchInput"
            type="text"
            :placeholder="$t('search.placeholder')"
            class="w-full px-3 sm:px-4 py-2 mr-2 text-sm sm:text-base rounded-full focus:outline-none focus:ring-2 focus:ring-[#364365] dark:focus:ring-[#3D8BFF] border border-gray-200 dark:border-gray-600 dark:bg-[#1F2937] dark:text-white"
          />
          <button
            class="bg-[#364365] dark:bg-[#3D8BFF] text-white mr-2 p-2 sm:p-3 rounded-full hover:bg-[#2c3751] dark:hover:bg-blue-600 transition duration-300 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12"
            @click="applyFilters"
          >
            <i class="bi bi-search text-base sm:text-lg"></i>
          </button>
          <button
            class="bg-[#364365] dark:bg-[#3D8BFF] text-white p-2 sm:p-3 rounded-full hover:bg-[#2c3751] dark:hover:bg-blue-600 transition duration-300 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12"
            @click="toggleFilterOptions"
          >
            <i class="bi bi-filter-circle text-base sm:text-lg"></i>
          </button>
        </div>
        <transition name="fade-slide">
          <div
            v-if="showFilterOptions"
            ref="filterContainer"
            class="absolute top-full mt-2 left-0 right-0 bg-white dark:bg-[#1F2937] rounded-lg shadow-lg p-4 z-20 grid grid-cols-1 gap-4 max-w-md mx-auto max-h-[70vh] overflow-y-auto"
          >
            <div class="relative w-full">
              <div
                @click="toggleGovernorateDropdown"
                class="bg-white dark:bg-[#1F2937] text-gray-700 dark:text-gray-200 text-sm sm:text-base rounded-md p-3 border border-gray-300 dark:border-gray-600 cursor-pointer flex justify-between items-center"
              >
                <span class="truncate">{{
                  selectedGovernorateLabel || $t("search.select_governorate")
                }}</span>
                <span class="text-gray-500 dark:text-gray-400">▼</span>
              </div>
              <ul
                v-if="isGovernorateOpen"
                class="absolute w-full bg-white dark:bg-[#1F2937] border border-gray-300 dark:border-gray-600 rounded-md mt-1 shadow-lg z-10 max-h-40 overflow-y-auto"
              >
                <li
                  v-for="loc in governorates"
                  :key="loc.value"
                  @click="selectGovernorate(loc)"
                  class="p-2 hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer flex items-center gap-2 text-sm governorate-option text-gray-700 dark:text-gray-200"
                >
                  <i
                    class="bi bi-geo-alt text-[#364365] dark:text-[#3D8BFF]"
                  ></i>
                  <span>{{ loc.label }}</span>
                </li>
              </ul>
            </div>
            <div class="relative w-full">
              <div
                @click="togglePropertyStatusDropdown"
                class="bg-white dark:bg-[#1F2937] text-gray-700 dark:text-gray-200 text-sm sm:text-base rounded-md p-3 border border-gray-300 dark:border-gray-600 cursor-pointer flex justify-between items-center"
              >
                <span class="truncate">{{
                  selectedPropertyStatusLabel || $t("search.select_status")
                }}</span>
                <span class="text-gray-500 dark:text-gray-400">▼</span>
              </div>
              <ul
                v-if="isPropertyStatusOpen"
                class="absolute w-full bg-white dark:bg-[#1F2937] border border-gray-300 dark:border-gray-600 rounded-md mt-1 shadow-lg z-10 max-h-40 overflow-y-auto"
              >
                <li
                  v-for="option in propertyStatusOptions"
                  :key="option.value"
                  @click="selectPropertyStatus(option)"
                  class="p-2 hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer flex items-center gap-2 text-sm property-status-option text-gray-700 dark:text-gray-200"
                >
                  <span>{{ option.label }}</span>
                </li>
              </ul>
            </div>
            <div>
              <div
                @click="toggleRoomsDropdown"
                class="bg-white dark:bg-[#1F2937] text-gray-700 dark:text-gray-200 text-sm sm:text-base rounded-md p-3 border border-gray-300 dark:border-gray-600 cursor-pointer flex justify-between items-center"
              >
                <span class="truncate">{{
                  selectedRoomsLabel || $t("search.select_rooms")
                }}</span>
                <span class="text-gray-500 dark:text-gray-400">▼</span>
              </div>
              <ul
                v-if="isRoomsOpen"
                class="absolute w-full bg-white dark:bg-[#1F2937] border border-gray-300 dark:border-gray-600 rounded-md mt-1 shadow-lg z-10 max-h-40 overflow-y-auto"
              >
                <li
                  v-for="room in roomsOptions"
                  :key="room.value"
                  @click="selectRooms(room)"
                  class="p-2 hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer flex items-center gap-2 text-sm rooms-option text-gray-700 dark:text-gray-200"
                >
                  <span>{{ room.label }}</span>
                </li>
              </ul>
            </div>
            <button
              class="bg-[#364365] dark:bg-[#3D8BFF] text-white font-semibold py-2 px-4 rounded-md hover:bg-[#2c3751] dark:hover:bg-blue-600 transition duration-300 text-sm sm:text-base"
              @click="applyFilters"
            >
              {{ $t("search.apply_filters") }}
            </button>
            <button
              class="bg-[#364365] dark:bg-[#3D8BFF] text-white font-semibold py-2 px-4 rounded-md hover:bg-[#2c3751] dark:hover:bg-blue-600 transition duration-300 text-sm sm:text-base"
              @click="resetFilters"
            >
              {{ $t("search.reset") }}
            </button>
          </div>
        </transition>
      </div>
    </div>

    <!-- Collapsed State -->
    <div
      v-else
      class="flex items-center justify-center p-3 sm:p-4 transition-all duration-300 w-full max-w-3xl mx-auto"
    >
      <div
        class="border dark:border-gray-600 rounded-full bg-white dark:bg-[#1F2937] shadow-md text-[#364365] dark:text-white w-full px-3 sm:px-6 py-2 flex items-center gap-2 sm:gap-4"
      >
        <div
          class="grid grid-cols-3 flex-grow text-center text-xs sm:text-sm md:text-base"
        >
          <span class="px-2 truncate">{{
            selectedGovernorateName || this.$t("search.anywhere")
          }}</span>
          <span class="px-2 truncate">{{
            selectedPropertyStatus || this.$t("search.any_status")
          }}</span>
          <span class="px-2 truncate">{{
            selectedRooms || this.$t("search.any_rooms")
          }}</span>
        </div>
        <div class="flex gap-2 sm:gap-3 flex-shrink-0">
          <button
            class="bg-[#364365] dark:bg-[#3D8BFF] text-white w-8 h-8 sm:w-10 sm:h-10 rounded-full hover:scale-110 transition-transform flex items-center justify-center"
            @click="$emit('toggle-search')"
          >
            <i class="bi bi-search text-sm sm:text-base"></i>
          </button>
          <button
            v-if="selectedGovernorate"
            class="bg-[#364365] dark:bg-[#3D8BFF] text-white w-8 h-8 sm:w-10 sm:h-10 rounded-full hover:scale-110 transition-transform flex items-center justify-center"
            @click="resetFilters"
          >
            <i class="bi bi-x text-sm sm:text-base"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import governorates from "@/assets/data/governorates.json";
import cities from "@/assets/data/cities.json";

export default {
  name: "SearchBar",
  props: {
    isScrolled: Boolean,
    isExpanded: Boolean,
    isSmallScreen: Boolean,
    searchQuery: String,
    selectedGovernorate: String,
    selectedPropertyStatus: String,
    selectedRooms: [Number, String],
  },
  emits: [
    "update:searchQuery",
    "update:selectedGovernorate",
    "update:selectedPropertyStatus",
    "update:selectedRooms",
    "search",
    "toggle-search",
    "reset",
  ],
  data: () => ({
    showFilterOptions: false,
    governorates: governorates.map((g) => ({
      value: g.id,
      label: g.governorate_name_en,
    })),
    cities: [],
    isGovernorateOpen: false,
    selectedGovernorateValue: "",
    isPropertyStatusOpen: false,
    selectedPropertyStatusValue: "",
    isRoomsOpen: false,
    selectedRoomsValue: "",
    localSearchQuery: "",
    propertyStatusOptions: [
      { value: "new", label: "New" },
      { value: "second-hand", label: "Second-hand" },
      { value: "renovated", label: "Renovated" },
    ],
    roomsOptions: [
      { value: "1", label: "1 Room" },
      { value: "2", label: "2 Rooms" },
      { value: "3", label: "3 Rooms" },
      { value: "4", label: "4 Rooms" },
      { value: "5", label: "5 Rooms" },
      { value: "6", label: "6+ Rooms" },
    ],
  }),
  computed: {
    filterBarStyle() {
      return {
        transition: "all 0.3s ease",
      };
    },
    selectedGovernorateName() {
      return (
        this.governorates.find((g) => g.value === this.selectedGovernorate)
          ?.label || this.$t("search.anywhere")
      );
    },
    selectedGovernorateLabel() {
      const selected = this.governorates.find(
        (loc) => loc.value === this.selectedGovernorateValue
      );
      return selected ? selected.label : "";
    },
    selectedPropertyStatusLabel() {
      const selected = this.propertyStatusOptions.find(
        (opt) => opt.value === this.selectedPropertyStatusValue
      );
      return selected ? selected.label : "";
    },
    selectedRoomsLabel() {
      const selected = this.roomsOptions.find(
        (room) => room.value === this.selectedRoomsValue
      );
      return selected ? selected.label : "";
    },
  },
  watch: {
    selectedGovernorate(newVal) {
      this.updateCities(newVal);
      this.selectedGovernorateValue = newVal;
    },
    selectedPropertyStatus(newVal) {
      this.selectedPropertyStatusValue = newVal;
    },
    selectedRooms(newVal) {
      this.selectedRoomsValue = newVal;
    },
    searchQuery(newVal) {
      this.localSearchQuery = newVal;
    },
  },
  mounted() {
    document.addEventListener("click", this.handleClickOutside);
  },
  beforeUnmount() {
    document.removeEventListener("click", this.handleClickOutside);
  },
  created() {
    // Initialize local values from props
    this.localSearchQuery = this.searchQuery || "";
    this.selectedGovernorateValue = this.selectedGovernorate || "";
    this.selectedPropertyStatusValue = this.selectedPropertyStatus || "";
    this.selectedRoomsValue = this.selectedRooms || "";
  },
  methods: {
    updateCities(governorateId) {
      this.cities = governorateId
        ? cities
            .filter((c) => c.governorate_id === governorateId)
            .map((c) => ({
              value: c.id,
              label: c.city_name_en,
            }))
        : [];
    },
    toggleFilterOptions() {
      this.showFilterOptions = !this.showFilterOptions;
    },
    toggleGovernorateDropdown() {
      this.isGovernorateOpen = !this.isGovernorateOpen;
    },
    selectGovernorate(loc) {
      this.selectedGovernorateValue = loc.value;
      this.isGovernorateOpen = false;
      if (this.isSmallScreen) {
        this.showFilterOptions = true;
      }
    },
    togglePropertyStatusDropdown() {
      this.isPropertyStatusOpen = !this.isPropertyStatusOpen;
    },
    selectPropertyStatus(option) {
      this.selectedPropertyStatusValue = option.value;
      this.isPropertyStatusOpen = false;
      if (this.isSmallScreen) {
        this.showFilterOptions = true;
      }
    },
    toggleRoomsDropdown() {
      this.isRoomsOpen = !this.isRoomsOpen;
    },
    selectRooms(room) {
      this.selectedRoomsValue = room.value;
      this.isRoomsOpen = false;
      if (this.isSmallScreen) {
        this.showFilterOptions = true;
      }
    },
    applyFilters() {
      // Emit all filter changes at once
      this.$emit("update:searchQuery", this.localSearchQuery);
      this.$emit("update:selectedGovernorate", this.selectedGovernorateValue);
      this.$emit(
        "update:selectedPropertyStatus",
        this.selectedPropertyStatusValue
      );
      this.$emit("update:selectedRooms", this.selectedRoomsValue);
      this.$emit("search");

      // Close any open dropdowns
      this.isGovernorateOpen = false;
      this.isPropertyStatusOpen = false;
      this.isRoomsOpen = false;
      this.showFilterOptions = false;
    },
    resetFilters() {
      this.localSearchQuery = "";
      this.selectedGovernorateValue = "";
      this.selectedPropertyStatusValue = "";
      this.selectedRoomsValue = "";
      this.$emit("update:searchQuery", "");
      this.$emit("update:selectedGovernorate", "");
      this.$emit("update:selectedPropertyStatus", "");
      this.$emit("update:selectedRooms", "");
      this.$emit("reset");
    },
    handleClickOutside(event) {
      if (
        this.$refs.governorateDropdown &&
        !this.$refs.governorateDropdown.contains(event.target)
      ) {
        this.isGovernorateOpen = false;
      }
      if (
        this.$refs.propertyStatusDropdown &&
        !this.$refs.propertyStatusDropdown.contains(event.target)
      ) {
        this.isPropertyStatusOpen = false;
      }
      if (
        this.$refs.roomsDropdown &&
        !this.$refs.roomsDropdown.contains(event.target)
      ) {
        this.isRoomsOpen = false;
      }

      // Only close the filter container if the click is outside the filter-related elements
      if (
        this.$refs.filterContainer &&
        !this.$refs.filterContainer.contains(event.target) &&
        !event.target.closest(".bi-filter-circle") &&
        !event.target.closest(".governorate-option") &&
        !event.target.closest(".property-status-option") &&
        !event.target.closest(".rooms-option")
      ) {
        this.showFilterOptions = false;
      }
    },
    handleSearchInput(event) {
      this.localSearchQuery = event.target.value;
    },
  },
};
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@media (max-width: 640px) {
  .filter-bar {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}
</style>
