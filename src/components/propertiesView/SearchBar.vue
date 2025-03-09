<template>
  <div
    class="shadow-lg w-full fixed left-0 z-50 transition-all duration-500 flex justify-center"
    :class="{
      'bg-white top-[70px] py-5': isScrolled || isExpanded,
      'bg-transparent top-[200px] -translate-y-1/2': !isScrolled && !isExpanded,
    }"
  >
    <div class="flex items-center justify-center">
      <div
        v-if="isExpanded || !isScrolled"
        class="inline-flex items-center gap-2 px-4 py-3 mt-5 mb-3 shadow-lg transition-all duration-300 bg-white rounded-lg"
      >
        <template v-if="!isSmallScreen">
          <input
            :value="searchQuery"
            @input="$emit('update:searchQuery', $event.target.value)"
            type="text"
            placeholder="Search by keyword"
            class="px-2 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#364365]"
          />
          <select
            :value="selectedLocation"
            @change="$emit('update:selectedLocation', $event.target.value)"
            class="text-[#364365] p-2 rounded-md text-sm border hover:bg-gray-100 cursor-pointer"
          >
            <option value="" disabled selected>Location</option>
            <option v-for="loc in locations" :key="loc" :value="loc">
              {{ loc }}
            </option>
          </select>
          <select
            :value="selectedCheckIn"
            @change="$emit('update:selectedCheckIn', $event.target.value)"
            class="p-2 rounded-md text-sm border hover:bg-gray-100 text-[#364365] cursor-pointer"
          >
            <option value="" disabled selected>Check-in</option>
            <option v-for="opt in checkOptions" :key="opt" :value="opt">
              {{ opt }}
            </option>
          </select>
          <select
            :value="selectedCheckOut"
            @change="$emit('update:selectedCheckOut', $event.target.value)"
            class="p-2 rounded-md text-sm border hover:bg-gray-100 text-[#364365] cursor-pointer"
          >
            <option value="" disabled selected>Check-out</option>
            <option v-for="opt in checkOptions" :key="opt" :value="opt">
              {{ opt }}
            </option>
          </select>
          <select
            :value="selectedGuests"
            @change="$emit('update:selectedGuests', $event.target.value)"
            class="p-2 rounded-md text-sm border hover:bg-gray-100 text-[#364365] cursor-pointer"
          >
            <option value="" disabled selected>Guests</option>
            <option v-for="opt in guestOptions" :key="opt" :value="opt">
              {{ opt }}
            </option>
          </select>
          <button
            class="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition cursor-pointer"
            @click="handleSearch"
          >
            Search
          </button>
          <button
            class="bg-gray-200 border border-[var(--secondary-color)] text-[var(--secondary-color)] px-4 py-2 rounded-md hover:bg-gray-300 transition cursor-pointer"
            @click="$emit('reset')"
          >
            Reset
          </button>
        </template>

        <template v-else>
          <div class="relative w-full flex items-center">
            <input
              :value="searchQuery"
              @input="$emit('update:searchQuery', $event.target.value)"
              type="text"
              placeholder="Search by keyword"
              class="px-4 py-2 rounded-md text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              class="absolute right-3 bg-[#364365] p-2 text-white rounded-full"
              @click="toggleFilterOptions"
            >
              <i class="bi bi-filter-circle"></i>
            </button>
          </div>
          <transition name="fade-slide">
            <div
              v-if="showFilterOptions"
              class="absolute top-full mt-2 right-0 bg-white rounded-md shadow-lg p-4 w-64 z-10"
            >
              <select
                :value="selectedLocation"
                @change="$emit('update:selectedLocation', $event.target.value)"
                class="text-[#364365] p-2 rounded-md text-sm w-full border hover:bg-gray-100 mb-2"
              >
                <option value="" disabled selected>Location</option>
                <option v-for="loc in locations" :key="loc" :value="loc">
                  {{ loc }}
                </option>
              </select>
              <select
                :value="selectedCheckIn"
                @change="$emit('update:selectedCheckIn', $event.target.value)"
                class="p-2 rounded-md text-sm w-full border hover:bg-gray-100 mb-2"
              >
                <option value="" disabled selected>Check-in</option>
                <option v-for="opt in checkOptions" :key="opt" :value="opt">
                  {{ opt }}
                </option>
              </select>
              <select
                :value="selectedCheckOut"
                @change="$emit('update:selectedCheckOut', $event.target.value)"
                class="p-2 rounded-md text-sm w-full border hover:bg-gray-100 mb-2"
              >
                <option value="" disabled selected>Check-out</option>
                <option v-for="opt in checkOptions" :key="opt" :value="opt">
                  {{ opt }}
                </option>
              </select>
              <select
                :value="selectedGuests"
                @change="$emit('update:selectedGuests', $event.target.value)"
                class="p-2 rounded-md text-sm w-full border hover:bg-gray-100 mb-2"
              >
                <option value="" disabled selected>Guests</option>
                <option v-for="opt in guestOptions" :key="opt" :value="opt">
                  {{ opt }}
                </option>
              </select>
              <button
                class="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition w-full"
                @click="handleSearch"
              >
                Search
              </button>
              <button
                class="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition w-full"
                @click="$emit('reset')"
              >
                Reset
              </button>
            </div>
          </transition>
        </template>
      </div>

      <div
        v-else
        class="flex items-center justify-center p-3 transition-all duration-300"
      >
        <div
          class="border rounded-full flex items-center p-2 bg-white shadow-md text-[#364365]"
        >
          <span class="px-2">{{ selectedLocation || "Anywhere" }}</span>
          <span class="px-2">{{ selectedCheckIn || "Any week" }}</span>
          <span class="px-2">{{ selectedGuests || "Add guests" }}</span>
          <button
            class="bg-[#364365] text-white w-8 h-8 ml-auto mr-3 rounded-full hover:scale-110 transition-transform cursor-pointer"
            @click="$emit('toggle-search')"
          >
            Q
          </button>
          <button
            v-if="
              selectedLocation ||
              selectedCheckIn ||
              selectedCheckOut ||
              selectedGuests
            "
            class="bg-[#364365] text-white w-8 h-8 ml-auto mr-3 rounded-full hover:scale-110 transition-transform cursor-pointer"
            @click="$emit('reset')"
          >
            X
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SearchBar",
  props: {
    isScrolled: {
      type: Boolean,
      default: false,
    },
    isExpanded: {
      type: Boolean,
      default: false,
    },
    isSmallScreen: {
      type: Boolean,
      default: false,
    },
    searchQuery: {
      type: String,
      default: "",
    },
    selectedLocation: {
      type: String,
      default: "",
    },
    selectedCheckIn: {
      type: String,
      default: "",
    },
    selectedCheckOut: {
      type: String,
      default: "",
    },
    selectedGuests: {
      type: String,
      default: "",
    },
  },
  emits: [
    "update:searchQuery",
    "update:selectedLocation",
    "update:selectedCheckIn",
    "update:selectedCheckOut",
    "update:selectedGuests",
    "search",
    "toggle-search",
    "reset",
  ],
  data() {
    return {
      showFilterOptions: false,
      locations: [
        "New York",
        "Los Angeles",
        "San Francisco",
        "Chicago",
        "Washington, D.C.",
      ],
      checkOptions: ["Today", "Tomorrow", "This week"],
      guestOptions: ["1 guest", "2 guests", "3 guests"],
    };
  },
  methods: {
    toggleFilterOptions() {
      this.showFilterOptions = !this.showFilterOptions;
      if (!this.showFilterOptions) this.$emit("search");
    },
    handleSearch() {
      this.$emit("search");
      this.showFilterOptions = false;
      if (this.isExpanded) this.$emit("toggle-search");
    },
  },
};
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

@media (max-width: 859px) {
  .rounded-full {
    width: 70vw;
  }
}
</style>
