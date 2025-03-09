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
            class="px-2 py-2 text-sm"
          />
  
          <select
            v-model="selectedLocation"
            class="text-[#364365] hover:bg-gray-500 hover:text-white p-2 rounded-md text-sm"
          >
            <option value="" disabled selected>Location</option>
            <option v-for="location in uniqueLocations" :key="location">
              {{ location }}
            </option>
          </select>
  
          <select
            v-model="selectedRoomType"
            class="hover:bg-gray-500 hover:text-white p-2 rounded-md text-sm"
          >
            <option value="" disabled selected>Room Type</option>
            <option v-for="roomType in uniqueRoomTypes" :key="roomType">
              {{ roomType }}
            </option>
          </select>
  
          <select
            v-model="selectedStatus"
            class="hover:bg-gray-500 hover:text-white p-2 rounded-md text-sm"
          >
            <option value="" disabled selected>Status</option>
            <option v-for="status in uniqueStatuses" :key="status">
              {{ status }}
            </option>
          </select>
  
          
  
          <select
            v-model="selectedRooms"
            class="hover:bg-gray-500 hover:text-white p-2 rounded-md text-sm"
          >
            <option value="" disabled selected>Rooms</option>
            <option v-for="rooms in uniqueRooms" :key="rooms">
              {{ rooms }}
            </option>
          </select>
  
          <button
            class="bg-black text-white px-4 py-2 rounded-md transition hover:bg-gray-800"
            @click="performFilter"
          >
            Filter
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
                v-model="selectedLocation"
                class="text-[#364365] hover:bg-gray-500 hover:text-white p-2 rounded-md text-sm w-[100%] overflow-hidden mb-2"
              >
                <option class="w-[50%]" value="" disabled selected>Location</option>
                <option v-for="location in uniqueLocations" :key="location">
                  {{ location }}
                </option>
              </select>
  
              <select
                v-model="selectedRoomType"
                class="hover:bg-gray-500 hover:text-white p-2 rounded-md text-sm w-full mb-2"
              >
                <option value="" disabled selected>Room Type</option>
                <option v-for="roomType in uniqueRoomTypes" :key="roomType">
                  {{ roomType }}
                </option>
              </select>
  
              <select
                v-model="selectedStatus"
                class="hover:bg-gray-500 hover:text-white p-2 rounded-md text-sm w-full mb-2"
              >
                <option value="" disabled selected>Status</option>
                <option v-for="status in uniqueStatuses" :key="status">
                  {{ status }}
                </option>
              </select>
  
              
  
              <select
                v-model="selectedRooms"
                class="hover:bg-gray-500 hover:text-white p-2 rounded-md text-sm w-full mb-2"
              >
                <option value="" disabled selected>Rooms</option>
                <option v-for="rooms in uniqueRooms" :key="rooms">
                  {{ rooms }}
                </option>
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
          <span class="px-2">{{ selectedLocation || "Anywhere" }}</span>
          <span class="px-2">{{ selectedRoomType || "Any Room" }}</span>
          <span class="px-2">{{ selectedStatus || "Any Status" }}</span>
         
          <span class="px-2">{{ selectedRooms || 'Any Rooms' }}</span>
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
        selectedLocation: "",
        selectedRoomType: "",
        selectedStatus: "",
       
        selectedRooms: "",
        showFilterOptions: false,
      };
    },
    computed: {
        uniqueLocations() {
      if (this.properties && this.properties.length > 0) {
        return [...new Set(this.properties.map((p) => p.location))];
      } else {
        return []; 
      }
    },
    uniqueRoomTypes() {
      if (this.properties && this.properties.length > 0) {
        return [...new Set(this.properties.map((p) => p.type))];
      } else {
        return [];
      }
    },
    uniqueStatuses() {
      if (this.properties && this.properties.length > 0) {
        return [...new Set(this.properties.map((p) => p.status))];
      } else {
        return [];
      }
    },
   
    uniqueRooms() {
      if (this.properties && this.properties.length > 0) {
        return [...new Set(this.properties.map((p) => p.rooms))];
      } else {
        return [];
      }
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
        selectedLocation: this.selectedLocation,
        selectedRoomType: this.selectedRoomType,
        selectedStatus: this.selectedStatus,
        selectedFurnished: this.selectedFurnished,
        selectedRooms: this.selectedRooms,
      });
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












