<template>
  <div class="p-6 bg-white shadow-sm rounded-lg">
    <h2 class="text-xl font-bold text-[#364365] mb-10 text-center">
      Location Information
    </h2>
    <form class="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6 mb-10">
      <InputField
        v-model="propertyDetails.governorate"
        label="Governorate"
        type="select"
        required
        :options="governorates"
        class="w-full"
        @change="updateCities"
      />
      <InputField
        v-model="propertyDetails.city"
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
    <p class="text-sm text-gray-500 text-center mt-3">
      You can move the marker to the correct location
    </p>
  </div>
</template>

<script>
import L from "leaflet";
import governoratesData from "@/assets/data/governorates.json";
import citiesData from "@/assets/data/cities.json";
import InputField from "../InputField.vue";
import { mapState } from "vuex";
import { reverseGeocode } from "@/services/geocodingService";

export default {
  components: {
    InputField,
  },
  computed: {
    ...mapState("property", ["propertyDetails"]),
  },
  data() {
    return {
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
      marker: null,
    };
  },
  mounted() {
    this.updateCities();
    this.$nextTick(() => {
      this.initMap();
    });
  },
  watch: {
    propertyDetails: {
      deep: true,
      handler(newData) {
        localStorage.setItem("propertyDetails", JSON.stringify(newData));
      },
    },
  },
  created() {
    const savedData = localStorage.getItem("propertyDetails");
    if (savedData) {
      this.$store.commit("property/updateProperty", JSON.parse(savedData));
    }
  },
  methods: {
    updateCities() {
      const selectedGov = this.governorates.find(
        (g) => g.value === this.propertyDetails.governorate
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
      const { lat, lng } =
        this.propertyDetails.coordinates || this.defaultCoordinates;
      this.map = L.map("map", { scrollWheelZoom: false }).setView(
        [lat, lng],
        13
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(this.map);

      this.marker = L.marker([lat, lng], { draggable: true }).addTo(this.map);

      this.marker.on("dragend", (e) => {
        const { lat, lng } = e.target.getLatLng();
        this.updateLocation(lat, lng);
      });
    },
    updateMarker(lat, lng) {
      if (this.map) {
        this.marker.setLatLng([lat, lng]);
        this.map.setView([lat, lng], 13);
      }
    },
    async updateLocation(lat, lng) {
      this.$store.commit("property/updateProperty", {
        coordinates: { lat, lng },
      });
      const neighborhood = await reverseGeocode(lat, lng);
      this.$store.commit("property/updateProperty", {
        neighborhood,
      });
    },
    async getUserLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            this.updateMarker(lat, lng);
            this.updateLocation(lat, lng);
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
