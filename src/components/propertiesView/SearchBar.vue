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
            :value="selectedGovernorate"
            @change="$emit('update:selectedGovernorate', $event.target.value)"
            class="text-[#364365] p-2 rounded-md text-sm border hover:bg-gray-100 cursor-pointer w-40"
          >
            <option value="" disabled selected>Governorate</option>
            <option
              v-for="loc in governorates"
              :key="loc.value"
              :value="loc.value"
            >
              {{ loc.label }}
            </option>
          </select>
          <select
            :value="selectedCity"
            @change="$emit('update:selectedCity', $event.target.value)"
            class="text-[#364365] p-2 rounded-md text-sm border hover:bg-gray-100 cursor-pointer w-40"
          >
            <option value="" disabled selected>City</option>
            <option
              v-for="city in cities"
              :key="city.value"
              :value="city.value"
            >
              {{ city.label }}
            </option>
          </select>

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
                :value="selectedGovernorate"
                @change="
                  $emit('update:selectedGovernorate', $event.target.value)
                "
                class="text-[#364365] p-2 rounded-md text-sm w-full border hover:bg-gray-100 mb-2 cursor-pointer"
              >
                <option value="" disabled selected>Governorate</option>
                <option
                  v-for="loc in governorates"
                  :key="loc.value"
                  :value="loc.value"
                >
                  {{ loc.label }}
                </option>
              </select>
              <select
                :value="selectedCity"
                @change="$emit('update:selectedCity', $event.target.value)"
                class="text-[#364365] p-2 rounded-md text-sm w-full border hover:bg-gray-100 mb-2 cursor-pointer"
              >
                <option value="" disabled selected>City</option>
                <option
                  v-for="city in cities"
                  :key="city.value"
                  :value="city.value"
                >
                  {{ city.label }}
                </option>
              </select>
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
          <span class="px-2">{{ selectedGovernorateName || "Anywhere" }}</span>
          <span class="px-2">{{ selectedCityName || "Any City" }}</span>
          <button
            class="bg-[#364365] text-white w-8 h-8 ml-auto mr-3 rounded-full hover:scale-110 transition-transform cursor-pointer"
            @click="$emit('toggle-search')"
          >
            Q
          </button>
          <button
            v-if="selectedGovernorate"
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
    selectedCity: String,
  },
  emits: [
    "update:searchQuery",
    "update:selectedGovernorate",
    "update:selectedCity",
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
  }),
  computed: {
    selectedGovernorateName() {
      return (
        this.governorates.find((g) => g.value === this.selectedGovernorate)
          ?.label || "Anywhere"
      );
    },
    selectedCityName() {
      return (
        this.cities.find((c) => c.value === this.selectedCity)?.label || ""
      );
    },
  },
  watch: {
    selectedGovernorate(newVal) {
      this.updateCities(newVal);
      if (!this.cities.some((c) => c.value === this.selectedCity)) {
        this.$emit("update:selectedCity", "");
      }
    },
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
      if (!this.showFilterOptions) this.$emit("search");
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
