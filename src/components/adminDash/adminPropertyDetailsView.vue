<template>
  <main class="min-h-screen bg-gray-100 dark:bg-gray-900 flex-1 p-4 md:p-8">
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
              <p class="mt-4 text-gray-600 dark:text-gray-400">
                Loading property details...
              </p>
            </div>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="container mx-auto py-10 px-5 mt-15">
          <div
            class="bg-red-100 dark:bg-red-900 border-l-4 border-red-500 text-red-700 dark:text-red-200 p-4 rounded"
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

        <div v-else class="container mx-auto py-5 px-5">
          <div class="flex sm:flex-row justify-between items-start gap-4 mb-4">
            <div class="space-y-2">
              <h1
                class="text-3xl font-bold text-gray-900 dark:text-white capitalize"
              >
                {{ property.title || "Untitled Property" }}
              </h1>
              <p
                class="text-lg text-gray-600 dark:text-gray-300 flex items-center capitalize"
              >
                <i
                  class="bi bi-geo-alt mr-2 text-gray-500 dark:text-gray-400"
                ></i>
                {{ locationText }}
              </p>
            </div>
            <p
              class="text-2xl font-semibold text-blue-700 dark:text-blue-400 whitespace-nowrap"
            >
              Price: {{ property.price }} EGP
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
                  class="w-full h-96 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center"
                >
                  <span class="text-gray-500 dark:text-gray-400"
                    >Loading image...</span
                  >
                </div>

                <!-- Gallery Navigation Buttons -->
                <button
                  v-if="
                    property && property.images && property.images.length > 1
                  "
                  @click="prevImage"
                  class="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 w-10 h-10 flex items-center justify-center rounded-full shadow-md hover:bg-gray-200 dark:hover:bg-gray-700 active:scale-90 transition"
                >
                  ❮
                </button>

                <button
                  v-if="
                    property && property.images && property.images.length > 1
                  "
                  @click="nextImage"
                  class="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 w-10 h-10 flex items-center justify-center rounded-full shadow-md hover:bg-gray-200 dark:hover:bg-gray-700 active:scale-90 transition"
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
            <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <div class="mt-2 text-gray-900 dark:text-white">
                <h2 class="text-xl font-semibold text-center mb-4">
                  Owner Details
                </h2>
                <div class="flex flex-col items-center space-y-3">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                    alt="Profile Picture"
                    class="w-24 h-24 rounded-full shadow-md border-2 border-gray-300 dark:border-gray-600"
                  />
                  <p class="flex flex-col items-center space-y-1">
                    <span class="font-semibold">Name:</span>
                    <span class="text-sm capitalize dark:text-gray-300">{{
                      property.propertyContact.name
                    }}</span>
                  </p>
                  <p class="flex flex-col items-center space-y-1">
                    <span class="font-semibold">Phone:</span>
                    <span class="text-sm dark:text-gray-300">{{
                      property.propertyContact.phone
                    }}</span>
                  </p>
                  <p class="flex flex-col items-center space-y-1">
                    <span class="font-semibold">Email:</span>
                    <span class="text-sm dark:text-gray-300">{{
                      property.propertyContact.email
                    }}</span>
                  </p>
                  <p
                    v-if="property.propertyContact.address"
                    class="flex flex-col items-center space-y-1"
                  >
                    <span class="font-semibold">Address:</span>
                    <span class="text-sm capitalize dark:text-gray-300">{{
                      property.propertyContact.address
                    }}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Description Section -->
          <div
            class="mt-8 w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6"
          >
            <h2
              class="text-xl font-semibold text-gray-900 dark:text-white mb-4 text-center"
            >
              Property Description
            </h2>
            <div class="prose max-w-none text-gray-700 dark:text-gray-300">
              <p v-if="property.description" class="whitespace-pre-line">
                {{ property.description }}
              </p>
              <p
                v-else
                class="text-gray-500 dark:text-gray-400 italic text-center"
              >
                No description available
              </p>
            </div>
          </div>

          <div class="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
              <h2
                class="text-xl font-semibold text-gray-900 dark:text-white mb-6 text-center"
              >
                General Information
              </h2>
              <div
                class="grid grid-cols-2 gap-4 text-gray-700 dark:text-gray-300"
              >
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
            <div class="p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
              <h2
                class="text-xl font-semibold text-gray-900 dark:text-white mb-4 text-center"
              >
                Location Information
              </h2>
              <div
                v-if="mapError"
                class="w-full h-64 rounded-lg flex items-center justify-center bg-gray-100 dark:bg-gray-700"
              >
                <div class="text-center p-4">
                  <i
                    class="bi bi-map text-gray-400 dark:text-gray-500 text-4xl mb-2"
                  ></i>
                  <p class="text-gray-600 dark:text-gray-300">{{ mapError }}</p>
                  <p class="text-gray-500 dark:text-gray-400 text-sm mt-2">
                    {{ locationText || "No location information available" }}
                  </p>
                </div>
              </div>
              <div v-else id="map" class="w-full h-96 rounded-lg"></div>
              <p
                v-if="mapLoading"
                class="mt-3 text-gray-700 dark:text-gray-300 text-center"
              >
                Loading map...
              </p>
            </div>
          </div>
        </div>
        <div class="text-center py-4" v-if="!loading">
          <!-- Replace the existing Edit button -->
          <router-link :to="`/admin/properties/edit/${id}`">
            <button
              class="w-[25%] text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-bold rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
            >
              Edit Property
            </button>
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
import { nextTick } from "vue";
import Swal from "sweetalert2";
import { mapActions, mapState } from "vuex";
import PropertyDetails from "../PropertyDetails.vue";
import governorates from "@/assets/data/governorates.json";
import cities from "@/assets/data/cities.json";
import "leaflet/dist/leaflet.css";
import { initializePropertyMap, geocodeLocation } from "@/services/mapService";

export default {
  components: { PropertyDetails },
  data() {
    return {
      title: null,
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
      mapError: null,
    };
  },
  computed: {
    ...mapState("property", ["property"]), // Add this computed property
    locationText() {
      if (!this.property) return "";

      const governorateName =
        governorates.find((g) => g.id == this.property.governorate)
          ?.governorate_name_en || "";

      const cityName =
        cities.find((c) => c.id == this.property.city)?.city_name_en || "";

      const neighborhood = this.property?.neighborhood || "";

      return `${governorateName}-${cityName}${
        neighborhood ? `-${neighborhood}` : ""
      }`;
    },
  },
  mounted() {
    // Safely get the ID from route params
    this.title = this.$route?.params?.title;

    if (!this.title) {
      this.error = "Property title is missing";
      this.loading = false;
      return;
    }

    // Fetch data immediately
    this.loadData();
  },
  created() {
    // Remove the initMapWithFallback call from here
  },
  mounted() {
    // Remove initMap call since we're using initMapWithFallback
  },

  // Use watch to handle route changes
  watch: {
    "$route.params.title": {
      handler(newTitle) {
        if (newTitle && newTitle !== this.title) {
          this.title = newTitle;
          this.loadData();
        }
      },
      immediate: true,
    },
    // Property watcher to initialize map when property data changes
    property: {
      handler(newProperty) {
        if (newProperty && !this.loading) {
          console.log("Property data changed:", newProperty);
          this.$nextTick(() => {
            this.initMapWithFallback();
          });
        }
      },
      deep: true,
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
        await this.deleteProperty(this.title);

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
      console.log("initMapWithFallback called, property:", this.property);

      if (!this.property) {
        console.warn("No property data available");
        return;
      }

      console.log("Property coordinates:", this.property.coordinates);

      // Ensure the map element exists before trying to initialize
      const mapElement = document.getElementById("map");
      if (!mapElement) {
        console.error("Map container not found");
        return;
      }

      // Remove existing map instance if it exists
      if (this.mapInstance) {
        console.log("Removing existing map instance");
        this.mapInstance.remove();
        this.mapInstance = null;
      }

      this.mapLoading = true;
      let lat, lng;
      try {
        // Check the format of coordinates - they might be in a different format
        if (this.property.coordinates) {
          console.log(
            "Raw coordinates data:",
            JSON.stringify(this.property.coordinates)
          );

          // Try different possible coordinate formats
          if (typeof this.property.coordinates === "object") {
            // Format 1: {latitude, longitude}
            if (
              "latitude" in this.property.coordinates &&
              "longitude" in this.property.coordinates
            ) {
              lat = this.property.coordinates.latitude;
              lng = this.property.coordinates.longitude;
              console.log("Using latitude/longitude format:", lat, lng);
            }
            // Format 2: {lat, lng}
            else if (
              "lat" in this.property.coordinates &&
              "lng" in this.property.coordinates
            ) {
              lat = this.property.coordinates.lat;
              lng = this.property.coordinates.lng;
              console.log("Using lat/lng format:", lat, lng);
            }
          }

          // If coordinates are invalid or in an unknown format, try to geocode from location text
          if (!lat || !lng) {
            console.log("Coordinates not in expected format, trying geocoding");
            const coords = await geocodeLocation(this.locationText);
            if (coords) {
              lat = coords.lat;
              lng = coords.lon;
              console.log("Using geocoded coordinates:", lat, lng);
            } else {
              throw new Error("Geocoding failed");
            }
          }
        } else {
          console.log("No coordinates in property data, trying geocoding");
          const coords = await geocodeLocation(this.locationText);
          if (coords) {
            lat = coords.lat;
            lng = coords.lon;
            console.log("Using geocoded coordinates:", lat, lng);
          } else {
            throw new Error("Geocoding failed");
          }
        }

        // Final validation before creating map
        if (!lat || !lng) {
          console.error("Could not determine coordinates for map");
          throw new Error("Could not determine coordinates for map");
        }

        console.log("Initializing map with coordinates:", lat, lng);

        // Use the map service instead of direct Leaflet implementation
        const { map } = initializePropertyMap(
          "map",
          { lat, lng },
          this.property.title || "Property",
          this.locationText || "Unknown Location",
          "red"
        );

        this.mapInstance = map;
        console.log("Map initialization complete");
      } catch (error) {
        console.error("Map initialization error:", error);
        this.mapError = "Failed to initialize map. Please try again later.";
      } finally {
        this.mapLoading = false;
      }
    },

    // This method is no longer needed as it's available in mapService
    async geocodeLocation(locationText) {
      console.warn(
        "Using deprecated local geocodeLocation. Consider using mapService.geocodeLocation instead"
      );
      return await geocodeLocation(locationText);
    },

    // Optimized data fetching
    async loadData() {
      this.loading = true;
      this.mapError = null; // Reset map error on new data load

      try {
        this.error = null;
        await this.getProperty(this.title);

        if (!this.property) {
          throw new Error("Property not found");
        }

        // Initialize map after property data is loaded and DOM is updated
        setTimeout(() => {
          if (!this.loading) {
            this.initMapWithFallback();
          }
        }, 500); // Short delay to ensure DOM is ready
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
    async initMap() {
      // Don't initialize map if we're in loading state or don't have coordinates
      if (this.loading || !this.property.coordinates) {
        return;
      }

      try {
        this.mapLoading = true;

        // Wait for the DOM to be ready
        await this.$nextTick();

        // Make sure the map container exists
        const mapContainer = document.getElementById("map");
        if (!mapContainer) {
          console.error("Map container not found");
          return;
        }

        // Remove existing map instance if it exists
        if (this.mapInstance) {
          this.mapInstance.remove();
          this.mapInstance = null;
        }

        let lat, lng;

        // Determine coordinates format
        if (
          "latitude" in this.property.coordinates &&
          "longitude" in this.property.coordinates
        ) {
          lat = this.property.coordinates.latitude;
          lng = this.property.coordinates.longitude;
        } else if (
          "lat" in this.property.coordinates &&
          "lng" in this.property.coordinates
        ) {
          lat = this.property.coordinates.lat;
          lng = this.property.coordinates.lng;
        } else {
          console.error("Invalid coordinates format");
          return;
        }

        // Use the map service instead of direct Leaflet
        const { map } = initializePropertyMap(
          "map",
          { lat, lng },
          this.property.title || "Property",
          this.locationText || "Unknown Location",
          "red"
        );

        this.mapInstance = map;
      } catch (error) {
        console.error("Map initialization error:", error);
      } finally {
        this.mapLoading = false;
      }
    },

    // Method to get Custom Icon
    getCustomIcon(color) {
      console.warn(
        "getCustomIcon is deprecated, use mapService.getCustomIcon instead"
      );
      return {};
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
