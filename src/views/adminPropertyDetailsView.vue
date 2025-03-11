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
          <div v-if="property" class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Property Gallery Section -->
            <div class="col-span-2 relative">
              <div class="relative w-full h-96">
                <img
                  v-if="
                    property.data &&
                    property.data.gallery &&
                    property.data.gallery.length > 0
                  "
                  :src="property.data.gallery[currentImageIndex]"
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
                    property.data &&
                    property.data.gallery &&
                    property.data.gallery.length > 1
                  "
                  @click="prevImage"
                  class="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white text-gray-700 w-10 h-10 flex items-center justify-center rounded-full shadow-md hover:bg-gray-200 active:scale-90 transition"
                >
                  ❮
                </button>

                <button
                  v-if="
                    property.data &&
                    property.data.gallery &&
                    property.data.gallery.length > 1
                  "
                  @click="nextImage"
                  class="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white text-gray-700 w-10 h-10 flex items-center justify-center rounded-full shadow-md hover:bg-gray-200 active:scale-90 transition"
                >
                  ❯
                </button>
              </div>

              <!-- Thumbnail Gallery -->
              <div
                v-if="
                  property.data &&
                  property.data.gallery &&
                  property.data.gallery.length > 0
                "
                class="grid grid-cols-4 gap-2 mt-4"
              >
                <img
                  v-for="(img, index) in property.data.gallery"
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
            <div class="p-5 bg-white shadow-lg rounded-lg text-center relative">
              <div v-if="property.owner">
                <img
                  :src="property.owner.profilePic"
                  alt="Owner"
                  loading="lazy"
                  class="w-24 h-24 rounded-full mx-auto mb-3 mt-5"
                />
                <h3 class="text-lg font-bold text-[#364365]">
                  {{ property.owner.name }}
                </h3>
                <p class="text-gray-600">📞 {{ property.owner.phone }}</p>
                <p class="text-gray-600">✉️ {{ property.owner.email }}</p>
                <p class="text-gray-600">📍 {{ property.owner.address }}</p>
              </div>
              <div v-else class="flex items-center justify-center h-full">
                <p class="text-gray-600">Owner information not available</p>
              </div>
            </div>
          </div>

          <!-- Property Details Section -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <!-- Video Section -->
            <div class="p-5 bg-white shadow-lg rounded-lg">
              <h3 class="text-lg font-bold text-gray-500">Property Video</h3>
              <video
                v-if="property.data && property.data.video"
                controls
                class="w-full h-64 mt-2 rounded-lg"
                loading="lazy"
              >
                <source :src="property.data.video" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div
                v-else
                class="mt-2 bg-gray-200 h-64 flex items-center justify-center rounded-lg"
              >
                <span class="text-gray-500">No Video Available</span>
              </div>
            </div>

            <!-- General Information Section -->
            <div class="p-5 bg-white shadow-lg rounded-lg">
              <h3 class="text-lg font-bold text-gray-600">
                General Information
              </h3>
              <ul v-if="property.data" class="mt-2 text-gray-600 space-y-1">
                <li>
                  <strong>Published Date:</strong>
                  {{ property.data.date || "N/A" }}
                </li>
                <li>
                  <strong>BathRoom Number:</strong>
                  {{ property.data.bathRooms || "N/A" }}
                </li>
                <li>
                  <strong>Furnished:</strong>
                  {{ property.data.Furnished ? "Yes" : "No" }}
                </li>
                <li>
                  <strong>Rooms:</strong> {{ property.data.rooms || "N/A" }}
                </li>
                <li>
                  <strong>Size:</strong> {{ property.data.size || "N/A" }} m²
                </li>
              </ul>
            </div>
          </div>

          <!-- Features Section -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <!-- Interior Features -->
              <div class="p-5 bg-white shadow-lg rounded-lg">
                <h3 class="text-lg font-bold text-[#364365]">
                  Interior Features
                </h3>
                <ul
                  v-if="property.data && property.data.interiorFeatures"
                  class="mt-2 text-gray-600 space-y-1"
                >
                  <li
                    v-for="feature in property.data.interiorFeatures"
                    :key="feature"
                  >
                    ✔ {{ feature }}
                  </li>
                </ul>
                <p v-else class="mt-2 text-gray-600">
                  No interior features listed
                </p>
              </div>

              <!-- External Features -->
              <div class="p-5 bg-white shadow-lg rounded-lg mt-6">
                <h3 class="text-lg font-bold text-[#364365]">
                  External Features
                </h3>
                <ul
                  v-if="property.data && property.data.externalFeatures"
                  class="mt-2 text-gray-600 space-y-1"
                >
                  <li
                    v-for="feature in property.data.externalFeatures"
                    :key="feature"
                  >
                    ✔ {{ feature }}
                  </li>
                </ul>
                <p v-else class="mt-2 text-gray-600">
                  No external features listed
                </p>
              </div>
            </div>

            <!-- Map Section -->
            <div class="p-5 bg-white shadow-lg rounded-lg">
              <h3 class="text-lg font-bold text-[#364365]">
                Location Information
              </h3>
              <div id="map" class="w-full h-70 mt-2 rounded-lg"></div>
              <p v-if="distance && duration" class="mt-3 text-gray-700">
                📍 Distance: {{ distance.toFixed(2) }} km | ⏳ Time:
                {{ formatDuration(duration) }}
              </p>
              <p v-else-if="mapLoaded && !distance" class="mt-3 text-gray-700">
                Location information not available or allow location access to
                see distance
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
            @click="deleteProperty"
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

export default {
  data() {
    return {
      id: null,
      property: null,
      currentImageIndex: 0,
      userLocation: null,
      distance: null,
      duration: null,
      loading: true,
      error: null,
      mapInitialized: false,
    };
  },

  created() {
    // Safely get the ID from route params
    this.id = this.$route?.params?.id;

    if (!this.id) {
      this.error = "Property ID is missing";
      this.loading = false;
      return;
    }

    // Fetch data immediately
    this.fetchPropertyData();
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
          this.fetchPropertyData();
        }
      },
      immediate: true,
    },
  },

  methods: {
    async deleteProperty() {
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

        // If user cancels, exit the function
        if (!result.isConfirmed) return;

        this.loading = true;
        this.error = null;

        const response = await fetch(
          `https://eskan-project-14c3b-default-rtdb.europe-west1.firebasedatabase.app/properties/${this.id}.json`,
          { method: "DELETE" }
        );

        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`);

        // Show success notification
        await Swal.fire(
          "Deleted!",
          "Your property has been deleted.",
          "success"
        );
        // Redirect to homepage after successful deletion
        this.$router.push("/admin/properties");
      } catch (error) {
        console.error("Delete failed:", error);
        this.error = `Failed to delete property: ${error.message}`;
      } finally {
        this.loading = false;
      }
    },
    // Optimized data fetching
    async fetchPropertyData() {
      this.loading = true;
      this.error = null;

      try {
        // Use Promise.race to set a timeout for the fetch
        const fetchPromise = fetch(
          `https://eskan-project-14c3b-default-rtdb.europe-west1.firebasedatabase.app/properties/${this.id}.json`
        );

        const response = await fetchPromise;

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (!data) {
          throw new Error("Property not found");
        }

        // Preload images for better performance

        this.property = data;
        this.loading = false;
        nextTick(() => {
          this.initMap();
        });
        // Init map after data is loaded
      } catch (error) {
        console.error("Error fetching data:", error);
        this.error = `Failed to load property: ${error.message}`;
        this.loading = false;
      }
    },
    // Image gallery controls
    nextImage() {
      this.currentImageIndex =
        (this.currentImageIndex + 1) % this.property.data.gallery.length;
    },
    prevImage() {
      this.currentImageIndex =
        (this.currentImageIndex - 1 + this.property.data.gallery.length) %
        this.property.data.gallery.length;
    },
    // Map related methods
    initMap() {
      const { latitude, longitude } = this.property.data.coordinates;
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
          `<b>${this.property.data.title}</b><br>${this.property.data.location}`
        )
        .openPopup();

      this.getUserLocation(map, latitude, longitude);
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
  },
};
</script>
