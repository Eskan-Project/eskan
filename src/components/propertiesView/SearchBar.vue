<template>
  <div class="filter-bar text-gray-900" :style="filterBarStyle">
    <div
      v-if="isExpanded || !isScrolled"
      class="inline-flex items-center gap-2 px-4 py-3 mt-5 mb-3 shadow-lg transition-all duration-300 transform bg-white rounded-lg text-center flex-wrap"
    >
      <div v-if="!isSmallScreen" class="flex flex-wrap gap-2">
        <input
          :value="searchQuery"
          @input="$emit('update:searchQuery', $event.target.value)"
          type="text"
          placeholder="Search by keyword"
          class="px-2 py-1 text-sm rounded-md"
        />

        <div class="relative w-48" ref="governorateDropdown">
          <div
            @click="toggleGovernorateDropdown"
            class="bg-white text-gray-700 text-sm rounded-md p-4 border-gray-300 cursor-pointer flex justify-between items-center"
          >
            <span>{{ selectedGovernorateLabel || "Governorate" }}</span>
            <span>🔽</span>
          </div>

          <ul
            v-if="isGovernorateOpen"
            class="absolute w-full bg-white border-gray-300 rounded-md mt-1 shadow-lg z-10 max-h-52 overflow-y-auto"
          >
            <li
              v-for="loc in governorates"
              :key="loc.value"
              @click="selectGovernorate(loc)"
              class="p-2 hover:bg-blue-100 cursor-pointer flex items-center gap-2"
            >
              <span>{{ loc.label }}</span>
            </li>
          </ul>
        </div>

        <div class="relative w-48" ref="propertyStatusDropdown">
          <div
            @click="togglePropertyStatusDropdown"
            class="bg-white text-gray-700 text-sm rounded-md p-4 cursor-pointer flex justify-between items-center"
          >
            <span>{{ selectedPropertyStatusLabel || " Property Status" }}</span>
            <span>🔽</span>
          </div>

          <ul
            v-if="isPropertyStatusOpen"
            class="absolute w-full bg-white border-gray-300 rounded-md mt-1 shadow-lg z-10"
          >
            <li
              v-for="option in propertyStatusOptions"
              :key="option.value"
              @click="selectPropertyStatus(option)"
              class="p-2 hover:bg-blue-100 cursor-pointer flex items-center gap-2"
            >
              <span>{{ option.label }}</span>
            </li>
          </ul>
        </div>

        <div class="relative w-48" ref="roomsDropdown">
          <div
            @click="toggleRoomsDropdown"
            class="bg-white text-gray-700 text-sm rounded-md p-4 cursor-pointer flex justify-between items-center"
          >
            <span>{{ selectedRoomsLabel || " Rooms Number" }}</span>
            <span>🔽</span>
          </div>

          <ul
            v-if="isRoomsOpen"
            class="absolute w-full bg-white rounded-md mt-1 shadow-lg z-10 max-h-32 overflow-y-auto"
          >
            <li
              v-for="room in roomsOptions"
              :key="room.value"
              @click="selectRooms(room)"
              class="p-2 hover:bg-blue-100 cursor-pointer flex items-center gap-2"
            >
              <span>{{ room.label }}</span>
            </li>
          </ul>
        </div>

        <button
          class="bg-black text-white px-4 py-2 rounded-md m-2 transition hover:bg-gray-800"
          @click="resetFilters"
        >
          Reset
        </button>
      </div>

      <div v-else class="rounded-full search-response flex items-center bg-white p-2 relative w-full">
        <div class="relative w-full">
          <input
            :value="searchQuery"
            @input="$emit('update:searchQuery', $event.target.value)"
            type="text"
            placeholder="Search by keyword"
            class="px-4 py-2 rounded-md text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            class="absolute inset-y-0 bg-[#364365] p-2 text-white bold rounded-[50%] right-3 flex items-center cursor-pointer"
            @click="toggleFilterOptions"
          >
            <i class="bi bi-filter-circle"></i>
          </button>
        </div>
        <transition name="fade-slide">
          <div
            v-if="showFilterOptions"
            ref="filterContainer"
            class="absolute top-full mt-2 right-0 bg-white rounded-md shadow-lg p-4 w-full z-10 grid grid-cols-1 gap-4"
          >
            <div class="relative w-full">
              <div
                @click="toggleGovernorateDropdown"
                class="bg-white text-gray-700 text-sm rounded-md p-4 cursor-pointer flex justify-between items-center border border-gray-300"
              >
                <span>{{ selectedGovernorateLabel || "Select Governorate" }}</span>
                <span>🔽</span>
              </div>

              <ul
                v-if="isGovernorateOpen"
                class="absolute w-full bg-white rounded-md mt-1 shadow-lg z-10 max-h-32 overflow-y-auto border border-gray-300"
              >
                <li
                  v-for="loc in governorates"
                  :key="loc.value"
                  @click="selectGovernorate(loc)"
                  class="p-2 hover:bg-blue-100 cursor-pointer flex items-center gap-2"
                >
                  <i class="bi bi-geo-alt"></i>
                  <span>{{ loc.label }}</span>
                </li>
              </ul>
            </div>

            <div class="relative w-full">
              <div
                @click="togglePropertyStatusDropdown"
                class="bg-white text-gray-700 text-sm rounded-md p-4 cursor-pointer flex justify-between items-center border border-gray-300"
              >
                <span>{{ selectedPropertyStatusLabel || "Select Status" }}</span>
                <span>🔽</span>
              </div>

              <ul
                v-if="isPropertyStatusOpen"
                class="absolute w-full bg-white rounded-md mt-1 shadow-lg z-10 max-h-32 overflow-y-auto border border-gray-300"
              >
                <li
                  v-for="option in propertyStatusOptions"
                  :key="option.value"
                  @click="selectPropertyStatus(option)"
                  class="p-2 hover:bg-blue-100 cursor-pointer flex items-center gap-2"
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
                class="block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2"
              />
            </div>

            <button
              class="bg-[#364365] text-white font-bold py-2 px-4 rounded hover:bg-[#2c3751] transition duration-300 w-full"
              @click="resetFilters"
            >
              Reset Filters
            </button>
          </div>
        </transition>
      </div>
    </div>

    <div v-else class="flex items-center justify-center p-3 transition-all duration-300 w-full">
      <div class="border rounded-full bg-white shadow-md text-[#364365] w-full px-4 py-2 flex items-center gap-2">
        <div class="grid grid-cols-3 flex-grow text-center">
<span class="px-2">{{ selectedGovernorateName || "Anywhere" }}</span>
<span class="px-2">{{ selectedPropertyStatus || "Any Status" }}</span>
<span class="px-2">{{ selectedRooms || "Any Rooms" }}</span>
</div>
<div class="flex gap-2">
      <button
        class="bg-[#364365] text-white w-[40px] h-[30px] rounded-full hover:scale-110 transition-transform cursor-pointer flex items-center justify-center"
        @click="$emit('toggle-search')"
      >
        Q
      </button>

      <button
        v-if="selectedGovernorate"
        class="bg-[#364365] text-white w-[40px] h-[30px] rounded-full hover:scale-110 transition-transform cursor-pointer flex items-center justify-center"
        @click="resetFilters"
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
selectedPropertyStatus: String,
selectedRooms: Number,
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
document.removeEventListener("click", this.handleClickOutside); 2 
},
methods: {
updateCities(governorateId) {
this.cities = governorateId
? cities
.filter((c) => c.governorate_id === governorateId)
.map((c) => ({
value: c.id,
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
if (this.$refs.roomsDropdown && !this.$refs.roomsDropdown.contains(event.target)) {
this.isRoomsOpen = false;
}
},
},
};
</script>
<style scoped>
@media (max-width: 859px) {
.search-response {
width: 80vw !important; 
}
select option {
padding: 8px;
cursor: pointer;
}   
select option:hover {
background-color: #f3f4f6;
}
}
</style>
