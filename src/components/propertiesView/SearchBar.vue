<template>
  <div class="filter-bar text-gray-900" :style="filterBarStyle">
    <!-- Expanded or Unscrolled State -->
    <div
      v-if="isExpanded || !isScrolled"
      class="inline-flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3 sm:py-4 mt-4 sm:mt-6 mb-3 transition-all duration-300 sm:bg-white rounded-lg flex-wrap justify-center w-full max-w-6xl mx-auto"
    >
      <div
        v-if="!isSmallScreen"
        class="flex flex-wrap gap-3 sm:gap-4 w-full justify-center"
      >
        <input
          :value="searchQuery"
          @input="$emit('update:searchQuery', $event.target.value)"
          type="text"
          placeholder="Search by keyword"
          class="w-full sm:w-40 px-3 sm:px-4 py-2 sm:placeholder:text-sm placeholder:text-base text-sm sm:text-base rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#364365]"
        />
        <div class="relative w-full sm:w-40" ref="governorateDropdown">
          <div
            @click="toggleGovernorateDropdown"
            class="bg-white text-gray-700 text-sm sm:text-base rounded-md p-3 sm:p-4 sm:px-2 border border-gray-300 cursor-pointer flex justify-between items-center"
          >
            <span class="truncate sm:text-sm text-base">{{
              selectedGovernorateLabel || "Governorate"
            }}</span>
            <span class="text-gray-500">▼</span>
          </div>
          <ul
            v-if="isGovernorateOpen"
            class="absolute w-full bg-white border border-gray-300 rounded-md mt-1 shadow-lg z-10 max-h-48 overflow-y-auto"
          >
            <li
              v-for="loc in governorates"
              :key="loc.value"
              @click="selectGovernorate(loc)"
              class="p-2 hover:bg-blue-50 cursor-pointer flex items-center gap-2 text-sm sm:text-base"
            >
              <span>{{ loc.label }}</span>
            </li>
          </ul>
        </div>
        <div class="relative w-full sm:w-40" ref="propertyStatusDropdown">
          <div
            @click="togglePropertyStatusDropdown"
            class="bg-white text-gray-700 text-sm sm:text-base rounded-md p-3 sm:p-4 sm:px-2 border border-gray-300 cursor-pointer flex justify-between items-center"
          >
            <span class="truncate sm:text-sm text-base">{{
              selectedPropertyStatusLabel || "Property Status"
            }}</span>
            <span class="text-gray-500">▼</span>
          </div>
          <ul
            v-if="isPropertyStatusOpen"
            class="absolute w-full bg-white border border-gray-300 rounded-md mt-1 shadow-lg z-10 max-h-48 overflow-y-auto"
          >
            <li
              v-for="option in propertyStatusOptions"
              :key="option.value"
              @click="selectPropertyStatus(option)"
              class="p-2 hover:bg-blue-50 cursor-pointer flex items-center gap-2 text-sm sm:text-base"
            >
              <span>{{ option.label }}</span>
            </li>
          </ul>
        </div>
        <div class="relative w-full sm:w-40" ref="roomsDropdown">
          <div
            @click="toggleRoomsDropdown"
            class="bg-white text-gray-700 text-sm sm:text-base rounded-md p-3 sm:p-4 sm:px-2 border border-gray-300 cursor-pointer flex justify-between items-center"
          >
            <span class="truncate sm:text-sm text-base">{{
              selectedRoomsLabel || "Rooms Number"
            }}</span>
            <span class="text-gray-500">▼</span>
          </div>
          <ul
            v-if="isRoomsOpen"
            class="absolute w-full bg-white border border-gray-300 rounded-md mt-1 shadow-lg z-10 max-h-48 overflow-y-auto"
          >
            <li
              v-for="room in roomsOptions"
              :key="room.value"
              @click="selectRooms(room)"
              class="p-2 hover:bg-blue-50 cursor-pointer flex items-center gap-2 text-sm sm:text-base"
            >
              <span>{{ room.label }}</span>
            </li>
          </ul>
        </div>
        <button
          class="bg-[#364365] text-white px-4 sm:px-6 py-2 rounded-md text-sm sm:text-base hover:bg-[#2c3751] transition duration-300"
          @click="resetFilters"
        >
          Reset
        </button>
      </div>

      <!-- Mobile Search Bar -->
      <div v-else class="relative w-full max-w-md mx-auto">
        <div class="flex items-center bg-white rounded-full p-2">
          <input
            :value="searchQuery"
            @input="$emit('update:searchQuery', $event.target.value)"
            type="text"
            placeholder="Search by keyword"
            class="w-full px-3 sm:px-4 py-2 mr-2 text-sm sm:text-base rounded-full focus:outline-none focus:ring-2 focus:ring-[#364365] border border-gray-200"
          />
          <button
            class="bg-[#364365] text-white p-2 sm:p-3 rounded-full hover:bg-[#2c3751] transition duration-300 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12"
            @click="toggleFilterOptions"
          >
            <i class="bi bi-filter-circle text-base sm:text-lg"></i>
          </button>
        </div>
        <transition name="fade-slide">
          <div
            v-if="showFilterOptions"
            ref="filterContainer"
            class="absolute top-full mt-2 left-0 right-0 bg-white rounded-lg shadow-lg p-4 z-20 grid grid-cols-1 gap-4 max-w-md mx-auto max-h-[70vh] overflow-y-auto"
          >
            <div class="relative w-full">
              <div
                @click="toggleGovernorateDropdown"
                class="bg-white text-gray-700 text-sm sm:text-base rounded-md p-3 border border-gray-300 cursor-pointer flex justify-between items-center"
              >
                <span class="truncate">{{
                  selectedGovernorateLabel || "Select Governorate"
                }}</span>
                <span class="text-gray-500">▼</span>
              </div>
              <ul
                v-if="isGovernorateOpen"
                class="absolute w-full bg-white border border-gray-300 rounded-md mt-1 shadow-lg z-10 max-h-40 overflow-y-auto"
              >
                <li
                  v-for="loc in governorates"
                  :key="loc.value"
                  @click="selectGovernorate(loc)"
                  class="p-2 hover:bg-blue-50 cursor-pointer flex items-center gap-2 text-sm"
                >
                  <i class="bi bi-geo-alt"></i>
                  <span>{{ loc.label }}</span>
                </li>
              </ul>
            </div>
            <div class="relative w-full">
              <div
                @click="togglePropertyStatusDropdown"
                class="bg-white text-gray-700 text-sm sm:text-base rounded-md p-3 border border-gray-300 cursor-pointer flex justify-between items-center"
              >
                <span class="truncate">{{
                  selectedPropertyStatusLabel || "Select Status"
                }}</span>
                <span class="text-gray-500">▼</span>
              </div>
              <ul
                v-if="isPropertyStatusOpen"
                class="absolute w-full bg-white border border-gray-300 rounded-md mt-1 shadow-lg z-10 max-h-40 overflow-y-auto"
              >
                <li
                  v-for="option in propertyStatusOptions"
                  :key="option.value"
                  @click="selectPropertyStatus(option)"
                  class="p-2 hover:bg-blue-50 cursor-pointer flex items-center gap-2 text-sm"
                >
                  <span>{{ option.label }}</span>
                </li>
              </ul>
            </div>
            <div>
              <input
                type="number"
                :value="selectedRooms"
                placeholder="Enter number"
                @input="$emit('update:selectedRooms', $event.target.value)"
                class="w-full rounded-md border border-gray-300 text-sm p-3 focus:outline-none focus:ring-2 focus:ring-[#364365]"
              />
            </div>
            <button
              class="bg-[#364365] text-white font-semibold py-2 px-4 rounded-md hover:bg-[#2c3751] transition duration-300 text-sm sm:text-base"
              @click="resetFilters"
            >
              Reset Filters
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
        class="border rounded-full bg-white shadow-md text-[#364365] w-full px-3 sm:px-6 py-2 flex items-center gap-2 sm:gap-4"
      >
        <div
          class="grid grid-cols-3 flex-grow text-center text-xs sm:text-sm md:text-base"
        >
          <span class="px-2 truncate">{{
            selectedGovernorateName || "Anywhere"
          }}</span>
          <span class="px-2 truncate">{{
            selectedPropertyStatus || "Any Status"
          }}</span>
          <span class="px-2 truncate">{{ selectedRooms || "Any Rooms" }}</span>
        </div>
        <div class="flex gap-2 sm:gap-3 flex-shrink-0">
          <button
            class="bg-[#364365] text-white w-8 h-8 sm:w-10 sm:h-10 rounded-full hover:scale-110 transition-transform flex items-center justify-center"
            @click="$emit('toggle-search')"
          >
            <i class="bi bi-search text-sm sm:text-base"></i>
          </button>
          <button
            v-if="selectedGovernorate"
            class="bg-[#364365] text-white w-8 h-8 sm:w-10 sm:h-10 rounded-full hover:scale-110 transition-transform flex items-center justify-center"
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
// Assuming the script remains unchanged unless specified
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
    selectedGovernorateName() {
      return (
        this.governorates.find((g) => g.value === this.selectedGovernorate)
          ?.label || "Anywhere"
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
    },
  },
  mounted() {
    document.addEventListener("click", this.handleClickOutside);
  },
  beforeUnmount() {
    document.removeEventListener("click", this.handleClickOutside);
  },
  methods: {
    updateCities(governorateId) {
      this.cities = governorateId
        ? cities
            .filter((c) => c.governorate_id === governorateId)
            .map((c) => ({
              value: c.id,
              label: c.city_name_en, // Assuming city_name_en exists
            }))
        : [];
    },
    toggleFilterOptions() {
      this.showFilterOptions = !this.showFilterOptions;
      if (!this.showFilterOptions) this.$emit("search");
    },
    toggleGovernorateDropdown() {
      this.isGovernorateOpen = !this.isGovernorateOpen;
    },
    selectGovernorate(loc) {
      this.selectedGovernorateValue = loc.value;
      this.isGovernorateOpen = false;
      this.$emit("update:selectedGovernorate", loc.value);
    },
    togglePropertyStatusDropdown() {
      this.isPropertyStatusOpen = !this.isPropertyStatusOpen;
    },
    selectPropertyStatus(option) {
      this.selectedPropertyStatusValue = option.value;
      this.isPropertyStatusOpen = false;
      this.$emit("update:selectedPropertyStatus", option.value);
    },
    toggleRoomsDropdown() {
      this.isRoomsOpen = !this.isRoomsOpen;
    },
    selectRooms(room) {
      this.selectedRoomsValue = room.value;
      this.isRoomsOpen = false;
      this.$emit("update:selectedRooms", room.value);
    },
    resetFilters() {
      this.selectedGovernorateValue = "";
      this.selectedPropertyStatusValue = "";
      this.selectedRoomsValue = "";
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
      if (
        this.$refs.filterContainer &&
        !this.$refs.filterContainer.contains(event.target) &&
        !event.target.closest(".bi-filter-circle")
      ) {
        this.showFilterOptions = false;
      }
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
