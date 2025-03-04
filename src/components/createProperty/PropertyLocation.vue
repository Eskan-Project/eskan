<template>
  <div class="p-6 bg-white shadow-sm rounded-lg">
    <h2 class="text-xl font-bold text-[#364365] mb-10 text-center">
      Location Information
    </h2>
    <form class="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6 mb-10">
      <InputField
        v-model="governorate"
        label="Governorate"
        type="select"
        required
        :options="governorates"
        class="w-full"
        @change="updateCities"
      />
      <InputField
        v-model="city"
        label="City"
        type="select"
        required
        :options="cities"
        class="w-full"
      />
      <button
        @click.prevent="getUserLocation"
        class="px-4 py-2 border border-[var(--secondary-color)] bg-[var(--secondary-color)] text-white rounded-lg hover:bg-[var(--primary-color)] hover:text-[var(--secondary-color)] transition-colors duration-300"
      >
        Locate Me
      </button>
    </form>

    <div id="map" class="w-full h-64 mt-2 rounded-lg z-10"></div>
  </div>
</template>

<script>
import L from "leaflet";
import governoratesData from "@/assets/data/governorates.json";
import citiesData from "@/assets/data/cities.json";
import InputField from "../InputField.vue";

export default {
  components: {
    InputField,
  },
  data() {
    return {
      governorate: "",
      city: "",
      neighborhood: "",
      coordinates: null,
      defaultCoordinates: {
        lat: 30.0444,
        lng: 31.2357,
      },
      governorates: governoratesData.map((g) => ({
        value: g.id,
        label: g.governorate_name_en,
      })),
      cities: [],
      map: null,
    };
  },
  mounted() {
    this.updateCities();
    this.initMap();
  },
  watch: {
    governorate: {
      handler(value) {
        this.governorate = value;
      },
      immediate: true,
    },
    city: {
      handler(value) {
        this.city = value;
      },
      immediate: true,
    },
  },
  methods: {
    updateCities() {
      const selectedGov = this.governorates.find(
        (g) => g.value === this.governorate
      );
      this.cities = selectedGov
        ? citiesData
            .filter((c) => c.governorate_id === selectedGov.value)
            .map((c) => ({
              value: c.id,
              label: c.city_name_en,
            }))
        : [];
    },
    initMap() {
      const { lat, lng } = this.defaultCoordinates;
      this.map = L.map("map", { scrollWheelZoom: false }).setView(
        [lat, lng],
        13
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(this.map);

      this.updateMarker(lat, lng);
    },
    updateMarker(lat, lng) {
      if (this.map) {
        L.marker([lat, lng]).addTo(this.map);
        this.map.setView([lat, lng], 13);
      }
    },
    async getUserLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            console.log("User Location Retrieved:", { lat, lng });

            this.coordinates = { lat, lng };
            this.updateMarker(lat, lng);
          },
          (error) => {
            console.error("Geolocation error:", error);

            if (error.code === error.PERMISSION_DENIED) {
              alert(
                "You have denied location access. Please refresh the page and enable location access."
              );
            }
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
      } else {
        console.log("Geolocation is not supported by your browser.");
      }
    },
  },
};
</script>
