<template>
  <main class="min-h-screen bg-gray-100 flex-1 p-4 md:p-8">
    <div class="md:flex block">
      <!-- Main Content -->

      <div class="flex-1 p-4 md:p-8">
        <!-- Loading State -->
        <div v-if="loading" class="container mx-auto py-10 px-5 mt-15">
          <div class="flex items-center justify-center h-96">
            <div class="text-center">
              <div
                class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto"
              ></div>
              <p class="mt-4 text-gray-600">Loading property details...</p>
            </div>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="container mx-auto py-10 px-5 mt-15">
          <div
            class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded"
          >
            <p class="font-bold">Error</p>
            <p>{{ error }}</p>
            <button
              @click="getData"
              class="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Try Again
            </button>
          </div>
        </div>

        <!-- Content when data is loaded -->

        <div v-else class="container mx-auto py-10 px-5 mt-15">
          <div class="flex sm:flex-row justify-between items-start gap-4">
            <div class="space-y-2">
              <h1 class="text-3xl font-bold text-gray-900 capitalize">
                {{ property.title || "Untitled Property" }}
              </h1>
              <p class="text-lg text-gray-600 flex items-center capitalize">
                <i class="bi bi-geo-alt mr-2 text-gray-500"></i>
                {{ locationText }}
              </p>
            </div>
            <p class="text-2xl font-semibold text-blue-700 whitespace-nowrap">
              Property Price :{{ property.price }} EGP
            </p>
          </div>
          <div v-if="property" class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Property Gallery Section -->
            <div class="col-span-2 relative">
              <div class="relative w-full h-96">
                <img
                  v-if="
                    property && property.images && property.images.length > 0
                  "
                  :src="property.images[currentImageIndex]"
                  alt="Property Image"
                  loading="lazy"
                  class="w-full h-96 object-cover rounded-lg"
                  @load="imageLoaded = true"
                  v-show="imageLoaded"
                />
                <div
                  v-if="!imageLoaded"
                  class="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center"
                >
                  <span class="text-gray-500">Loading image...</span>
                </div>

                <!-- Gallery Navigation Buttons -->
                <button
                  v-if="
                    property && property.images && property.images.length > 1
                  "
                  @click="prevImage"
                  class="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white text-gray-700 w-10 h-10 flex items-center justify-center rounded-full shadow-md hover:bg-gray-200 active:scale-90 transition"
                >
                  ❮
                </button>

                <button
                  v-if="
                    property && property.images && property.images.length > 1
                  "
                  @click="nextImage"
                  class="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white text-gray-700 w-10 h-10 flex items-center justify-center rounded-full shadow-md hover:bg-gray-200 active:scale-90 transition"
                >
                  ❯
                </button>
              </div>

              <!-- Thumbnail Gallery -->
              <div
                v-if="property && property.images && property.images.length > 0"
                class="grid grid-cols-4 gap-2 mt-4"
              >
                <img
                  v-for="(img, index) in property.images"
                  :key="index"
                  :src="img"
                  loading="lazy"
                  class="h-24 w-full object-cover rounded-lg cursor-pointer border-2"
                  :class="{ 'border-blue-500': currentImageIndex === index }"
                  @click="currentImageIndex = index"
                />
              </div>
            </div>

            <!-- Owner Information Section -->
            <div class="bg-white rounded-lg p-6 shadow-lg">
              <div class="mt-2 text-gray-900">
                <h2 class="text-xl font-semibold text-center mb-4">
                  Owner Details
                </h2>
                <div class="flex flex-col items-center space-y-3">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                    alt="Profile Picture"
                    class="w-24 h-24 rounded-full shadow-md border-2 border-gray-300"
                  />
                  <p class="flex flex-col items-center space-y-1">
                    <span class="font-semibold">Name:</span>
                    <span class="text-sm capitalize">{{
                      property.propertyContact.name
                    }}</span>
                  </p>
                  <p class="flex flex-col items-center space-y-1">
                    <span class="font-semibold">Phone:</span>
                    <span class="text-sm">{{
                      property.propertyContact.phone
                    }}</span>
                  </p>
                  <p class="flex flex-col items-center space-y-1">
                    <span class="font-semibold">Email:</span>
                    <span class="text-sm">{{
                      property.propertyContact.email
                    }}</span>
                  </p>
                  <p class="flex flex-col items-center space-y-1">
                    <span class="font-semibold">Address:</span>
                    <span class="text-sm capitalize">{{
                      property.address
                    }}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="p-6 bg-white shadow-lg rounded-lg">
              <h2 class="text-xl font-semibold text-gray-900 mb-6 text-center">
                General Information
              </h2>
              <div class="grid grid-cols-2 gap-4 text-gray-700">
                <div class="space-y-4">
                  <p><strong>Published Date:</strong></p>
                  <p><strong>Floor Location:</strong></p>
                  <p><strong>Furnished:</strong></p>
                  <p><strong>Property Status:</strong></p>
                  <p><strong>Rooms:</strong></p>
                  <p><strong>Living Rooms:</strong></p>
                  <p><strong>Bathrooms:</strong></p>
                  <p><strong>Kitchens:</strong></p>
                  <p><strong>Area:</strong></p>
                </div>
                <div class="space-y-4 font-semibold">
                  <p>{{ formatDate(property.createdAt) }}</p>
                  <p>{{ property.floor }}</p>
                  <p>{{ property.furnished ? "Yes" : "No" }}</p>
                  <p>{{ property.propertyStatus }}</p>
                  <p>{{ property.rooms }}</p>
                  <p>{{ property.livingRooms }}</p>
                  <p>{{ property.bathrooms }}</p>
                  <p>{{ property.kitchens }}</p>
                  <p>{{ property.area }} m²</p>
                </div>
              </div>
            </div>
            <div class="p-6 bg-white shadow-lg rounded-lg">
              <h2 class="text-xl font-semibold text-gray-900 mb-4 text-center">
                Location Information
              </h2>
              <div id="map" class="w-full h-64 rounded-lg"></div>
              <p v-if="mapLoading" class="mt-3 text-gray-700 text-center">
                Loading map...
              </p>
            </div>
          </div>
        </div>
        <div class="text-center py-4" v-if="!loading">
          <!-- Replace the existing Edit button -->
          <router-link
            :to="`/admin/properties/edit/${id}`"
            class="w-[25%] text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-bold rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
          >
            Edit Property
          </router-link>

          <button
            @click="handleDeleteProperty"
            type="button"
            class="w-[25%] text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-bold rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
          >
            Delete Property
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import L from "leaflet";
import { nextTick } from "vue";
import Swal from "sweetalert2";
import { mapActions, mapState } from "vuex";
import PropertyDetails from "../components/PropertyDetails.vue";
import governorates from "@/assets/data/governorates.json";
import cities from "@/assets/data/cities.json";

export default {
  components: { PropertyDetails },
  data() {
    return {
      id: null,
      currentImageIndex: 0,
      userLocation: null,
      distance: null,
      duration: null,
      loading: true,
      error: null,
      mapInitialized: false,
      imageLoaded: false, // Add this
      mapLoaded: false, // Add this
      mapLoading: false, // Add this property
      mapInstance: null, // Add this to store map instance
    };
  },
  computed: {
    ...mapState("property", ["property"]), // Add this computed property
    locationText() {
      const governorateName = governorates.find(
        (g) => g.id == this.property.governorate
      )?.governorate_name_en;
      const cityName = cities.find(
        (c) => c.id == this.property.city
      )?.city_name_en;
      return `${governorateName}-${cityName}-${this.property?.neighborhood}`;
    },
  },
  mounted() {
    // Safely get the ID from route params
    this.id = this.$route?.params?.id;

    if (!this.id) {
      this.error = "Property ID is missing";
      this.loading = false;
      return;
    }

    // Fetch data immediately
    this.loadData();
  },
  created() {
    this.initMapWithFallback();
  },
  // mounted() {
  //   this.initMap();
  // },

  // Use watch to handle route changes
  watch: {
    "$route.params.id": {
      handler(newId) {
        if (newId && newId !== this.id) {
          this.id = newId;
          this.loadData();
        }
      },
      immediate: true,
    },
  },

  methods: {
    ...mapActions("property", ["getProperty", "deleteProperty"]), // Add deleteProperty action

    // Update the deleteProperty method
    async handleDeleteProperty() {
      try {
        const result = await Swal.fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, delete it!",
        });

        if (!result.isConfirmed) return;

        this.loading = true;
        await this.deleteProperty(this.id);

        await Swal.fire(
          "Deleted!",
          "Property has been deleted successfully.",
          "success"
        );

        this.$router.push("/admin/properties");
      } catch (error) {
        console.error("Delete failed:", error);
        Swal.fire(
          "Error!",
          "Failed to delete property. Please try again.",
          "error"
        );
      } finally {
        this.loading = false;
      }
    },
    async initMapWithFallback() {
      // Remove existing map instance if it exists
      if (this.mapInstance) {
        this.mapInstance.remove();
        this.mapInstance = null;
      }

      this.mapLoading = true;
      let lat, lng;
      if (this.property.coordinates) {
        ({ latitude: lat, longitude: lng } = this.property.coordinates);
        console.log(lat, lng);
      } else {
        try {
          const coords = await this.geocodeLocation(this.locationText);
          if (coords) {
            lat = coords.lat;
            lng = coords.lon;
          } else {
            throw new Error("Geocoding failed");
          }
        } catch (error) {
          console.error("Geocoding error:", error);
          return;
        }
      }

      try {
        this.mapInstance = L.map("map", { scrollWheelZoom: false }).setView(
          [lat, lng],
          this.property.coordinates ? 13 : 10
        );
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap contributors",
        }).addTo(this.mapInstance);
        L.marker([lat, lng], { icon: this.getCustomIcon("red") })
          .addTo(this.mapInstance)
          .bindPopup(`<b>${this.property.title}</b><br>${this.locationText}`)
          .openPopup();
      } catch (error) {
        console.error("Map initialization error:", error);
      } finally {
        this.mapLoading = false;
      }
    },
    async geocodeLocation(locationText) {
      console.log(locationText);
      const locationParts = locationText.split("-");
      const filteredLocation = locationParts.slice(0, 2).join(" ");
      const query = encodeURIComponent(filteredLocation);
      console.log(query);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`
      );
      const data = await response.json();
      return data.length > 0 ? data[0] : null;
    },

    // Optimized data fetching
    async loadData() {
      this.loading = true;
      try {
        this.error = null;
        await this.getProperty(this.id);

        if (!this.property) {
          throw new Error("Property not found");
        }
      } catch (error) {
        this.error = "Failed to load property. Please try again later.";
        console.error("Fetch property error:", error);
      } finally {
        this.loading = false;
      }
    },

    // Image gallery controls
    nextImage() {
      this.currentImageIndex =
        (this.currentImageIndex + 1) % this.property.images.length;
    },
    prevImage() {
      this.currentImageIndex =
        (this.currentImageIndex - 1 + this.property.images.length) %
        this.property.images.length;
    },
    // Map related methods
    initMap() {
      const [latitude, longitude] = this.property.coordinates;
      console.log(latitude, longitude);
      const map = L.map("map", { scrollWheelZoom: false }).setView(
        [latitude, longitude],
        13
      );
      console.log(map);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map);

      L.marker([latitude, longitude], { icon: this.getCustomIcon("red") })
        .addTo(map)
        .bindPopup(
          `<b>${this.property.title}</b><br>${this.property.data.location}`
        )
        .openPopup();

      this.getUserLocation(map, latitude, longitude);
      this.mapLoaded = true; // Add this line
    },
    getUserLocation(map, targetLat, targetLng) {
      if (!navigator.geolocation) return;

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude: lat, longitude: lng } = position.coords;
          this.userLocation = { lat, lng };

          L.marker([lat, lng], { icon: this.getCustomIcon("blue") })
            .addTo(map)
            .bindPopup("You are here");

          this.calculateDistance(targetLat, targetLng, lat, lng);
        },
        () => console.error("Could not retrieve location")
      );
    },
    // Utility methods
    calculateDistance(lat1, lng1, lat2, lng2) {
      const R = 6371;
      const dLat = this.degToRad(lat2 - lat1);
      const dLng = this.degToRad(lng2 - lng1);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(this.degToRad(lat1)) *
          Math.cos(this.degToRad(lat2)) *
          Math.sin(dLng / 2) *
          Math.sin(dLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      this.distance = R * c;
      this.duration = (this.distance / 50) * 60;
    },
    formatDuration(minutes) {
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
      const remainingHours = hours % 24;
      return days > 0
        ? `${days} days, ${remainingHours} hours`
        : `${hours} hours`;
    },
    degToRad(deg) {
      return deg * (Math.PI / 180);
    },
    getCustomIcon(color) {
      return L.icon({
        iconUrl: `https://maps.google.com/mapfiles/ms/icons/${color}-dot.png`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      });
    },
    // Owner details methods
    toggleOwnerDetails() {
      this.isOwnerDetailsVisible = !this.isOwnerDetailsVisible;
      this.ownerClickCount = 0;
    },

    handleOwnerLock() {
      if (++this.ownerClickCount >= 2) {
        this.isOwnerDetailsLocked = true;
        this.isOwnerDetailsVisible = false;
        this.ownerClickCount = 0;
      }
    },

    confirmUnlock() {
      this.isOwnerDetailsLocked = false;
      this.isOwnerDetailsVisible = true;
      this.showUnlockModal = false;
    },
    formatDate(timestamp) {
      let date;
      if (typeof timestamp === "number") {
        // Handle seconds (e.g., 1741559808)
        date = new Date(timestamp * 1000); // Convert seconds to milliseconds
      } else if (
        timestamp.seconds !== undefined &&
        timestamp.nanoseconds !== undefined
      ) {
        // Handle Firestore Timestamp object (e.g., { seconds: 1741559808, nanoseconds: 450000000 })
        date = new Date(
          timestamp.seconds * 1000 + Math.floor(timestamp.nanoseconds / 1000000)
        );
      } else if (timestamp instanceof Date) {
        // Already a Date object
        date = timestamp;
      } else if (typeof timestamp === "string") {
        // ISO string or other string format
        date = new Date(timestamp);
      } else {
        return "Invalid Date";
      }

      return date.toLocaleDateString("en-GB", { dateStyle: "short" });
    },
  },
  beforeDestroy() {
    // Cleanup map instance
    if (this.mapInstance) {
      this.mapInstance.remove();
      this.mapInstance = null;
    }
  },

  beforeRouteLeave(to, from, next) {
    // Cleanup map before leaving
    if (this.mapInstance) {
      this.mapInstance.remove();
      this.mapInstance = null;
    }
    next();
  },
};
</script>
