<template>
  <div v-if="loading">Loading...</div>
  <div v-else-if="property" class="container mx-auto py-10 px-5 mt-15">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="col-span-2 space-y-4">
        <div class="mb-8 text-center sm:text-left flex justify-between">
          <div class="flex flex-col items-start gap-2">
            <h1 class="text-3xl font-bold text-gray-900 capitalize">
              {{ property.title || "Untitled Property" }}
            </h1>
            <p class="text-lg text-gray-600 mt-2">
              <i class="bi bi-geo-alt mr-1 text-gray-500"></i>
              {{ locationText }}
            </p>
          </div>
          <p class="text-2xl font-semibold text-blue-700 mt-1">
            {{ property.price }} EGP
          </p>
        </div>
        <div
          class="relative w-full h-80 sm:h-96 rounded-lg overflow-hidden shadow-lg"
        >
          <img
            :src="property.images[currentImageIndex]"
            alt="Property Image"
            class="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            loading="lazy"
          />
          <button
            @click="prevImage"
            class="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white text-gray-700 w-10 h-10 flex items-center justify-center rounded-full shadow-md hover:bg-gray-200 active:scale-90 transition"
            aria-label="Previous Image"
          >
            ❮
          </button>
          <button
            @click="nextImage"
            class="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white text-gray-700 w-10 h-10 flex items-center justify-center rounded-full shadow-md hover:bg-gray-200 active:scale-90 transition"
            aria-label="Next Image"
          >
            ❯
          </button>
        </div>
        <div class="grid grid-cols-4 gap-2">
          <img
            v-for="(img, index) in visibleGallery"
            :key="index"
            :src="img"
            loading="lazy"
            class="h-20 sm:h-24 w-full object-cover rounded-lg cursor-pointer border-2 transition-all duration-200 hover:border-blue-600"
            :class="{
              'border-blue-500':
                currentImageIndex ===
                (galleryStartIndex + index) % property.images.length,
            }"
            @click="
              currentImageIndex =
                (galleryStartIndex + index) % property.images.length
            "
            :alt="`Thumbnail ${index + 1}`"
          />
        </div>
      </div>

      <div class="bg-white rounded-lg">
        <div class="property-item">
          <PropertyDetails :property="property" :id="id" />
        </div>
      </div>
    </div>

    <div class="mt-10 flex gap-6">
      <div class="w-1/2">
        <!-- <div class="p-5 bg-white shadow-lg rounded-lg">
        <h3 class="text-lg font-bold">Property Video</h3>
        <video
          v-if="property.video"
          controls
          class="w-full h-64 mt-2 rounded-lg"
          loading="lazy"
        >
          <source :src="property.video" type="video/mp4" />
        </video>
        <div
          v-else
          class="mt-2 bg-gray-200 h-64 flex items-center justify-center rounded-lg"
        >
          <span class="text-gray-500">No Video Available</span>
        </div>
      </div> -->

        <div class="p-6 bg-white shadow-lg rounded-lg">
          <h2 class="text-gray-900 text-xl font-semibold mb-6 text-center">
            General Information
          </h2>
          <div class="flex gap-20">
            <ul class="text-gray-700 space-y-4">
              <li>
                <strong>Published Date:</strong>
              </li>
              <li><strong>Floor Location:</strong></li>
              <li>
                <strong>Furnished:</strong>
              </li>
              <li><strong>Rooms:</strong></li>
              <li><strong>Size:</strong></li>
            </ul>
            <ul class="text-gray-700 space-y-4">
              <li class="font-semibold">
                {{ formatDate(property.createdAt) }}
              </li>
              <li class="font-semibold">{{ property.floor }}</li>
              <li class="font-semibold">
                {{ property.furnished ? "Yes" : "No" }}
              </li>
              <li class="font-semibold">{{ property.rooms }}</li>
              <li class="font-semibold">{{ property.area }} m²</li>
            </ul>
          </div>
        </div>
      </div>
      <div class="w-1/2">
        <!-- <div>
        <div class="p-5 bg-white shadow-lg rounded-lg">
          <h3 class="text-lg font-bold text-[#364365]">Interior Features</h3>
          <ul class="mt-2 text-gray-600 space-y-1">
            <li
              v-for="(feature, index) in property.interiorFeatures"
              :key="index"
            >
              ✔ {{ feature }}
            </li>
          </ul>
        </div>

        <div class="p-5 bg-white shadow-lg rounded-lg mt-6">
          <h3 class="text-lg font-bold text-[#364365]">External Features</h3>
          <ul class="mt-2 text-gray-600 space-y-1">
            <li
              v-for="(feature, index) in property.externalFeatures"
              :key="index"
            >
              ✔ {{ feature }}
            </li>
          </ul>
        </div>
      </div> -->
        <div>
          <div class="p-5 bg-white shadow-lg rounded-lg">
            <h3 class="text-lg font-bold text-gray-900 mb-4 text-center">
              Location Information
            </h3>
            <div id="map" class="w-full h-64 mt-2 rounded-lg"></div>
            <p v-if="mapLoading" class="mt-3 text-gray-700">Loading map...</p>
            <!-- <p v-if="distance && duration" class="mt-3 text-gray-700">
            📍 Distance: {{ distance.toFixed(2) }} km | ⏳ Time:
            {{ formatDuration(duration) }}
          </p> -->
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else>Property Not Found</div>
</template>

<script>
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import PropertyDetails from "../components/PropertyDetails.vue";
import { mapActions, mapState } from "vuex";
import governorates from "@/assets/data/governorates.json";
import cities from "@/assets/data/cities.json";

export default {
  name: "PropertyDetail",
  props: ["id"],
  components: { PropertyDetails },
  data() {
    return {
      currentImageIndex: 0,
      galleryStartIndex: 0,
      mapInstance: null,
      mapLoading: false,
      // userLocation: null,
      // distance: null,
      // duration: null,
    };
  },
  computed: {
    ...mapState("property", ["property", "loading"]),
    currentImage() {
      return (
        this.property?.images?.[this.currentImageIndex] ||
        "path/to/placeholder.jpg"
      );
    },
    visibleGallery() {
      return (
        this.property?.images?.slice(
          this.galleryStartIndex,
          this.galleryStartIndex + 4
        ) || []
      );
    },
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
    this.getProperty(this.id).then(() => {
      console.log("Fetched property:", this.property);
      this.$nextTick(() => {
        this.initMapWithFallback();
      });
      this.updateGalleryStartIndex();
    });
  },
  beforeDestroy() {
    if (this.mapInstance) {
      this.mapInstance.remove();
    }
  },
  methods: {
    ...mapActions("property", ["getProperty"]),
    nextImage() {
      if (!this.property?.images?.length) return;
      this.currentImageIndex =
        (this.currentImageIndex + 1) % this.property.images.length;
      this.updateGalleryStartIndex();
    },
    prevImage() {
      if (!this.property?.images?.length) return;
      this.currentImageIndex =
        (this.currentImageIndex - 1 + this.property.images.length) %
        this.property.images.length;
      this.updateGalleryStartIndex();
    },
    updateGalleryStartIndex() {
      if (!this.property?.images?.length) return;
      this.galleryStartIndex = Math.floor(this.currentImageIndex / 4) * 4;
    },
    async initMapWithFallback() {
      this.mapLoading = true;
      let lat, lng;
      if (this.property.coordinates) {
        ({ latitude: lat, longitude: lng } = this.property.coordinates);
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
    // getUserLocation(map, targetLat, targetLng) {
    //   if (navigator.geolocation) {
    //     navigator.geolocation.getCurrentPosition(
    //       (position) => {
    //         this.userLocation = {
    //           lat: position.coords.latitude,
    //           lng: position.coords.longitude,
    //         };
    //         L.marker([this.userLocation.lat, this.userLocation.lng], {
    //           icon: this.getCustomIcon("blue"),
    //         })
    //           .addTo(map)
    //           .bindPopup("You are here");
    //         this.calculateDistance(
    //           targetLat,
    //           targetLng,
    //           this.userLocation.lat,
    //           this.userLocation.lng
    //         );
    //       },
    //       (error) => console.error("Geolocation error:", error)
    //     );
    //   }
    // },
    // calculateDistance(lat1, lng1, lat2, lng2) {
    //   const R = 6371; // Earth's radius in km
    //   const dLat = this.degToRad(lat2 - lat1);
    //   const dLng = this.degToRad(lng2 - lng1);
    //   const a =
    //     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    //     Math.cos(this.degToRad(lat1)) *
    //       Math.cos(this.degToRad(lat2)) *
    //       Math.sin(dLng / 2) *
    //       Math.sin(dLng / 2);
    //   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    //   this.distance = R * c;
    //   this.duration = (this.distance / 50) * 60; // 50 km/h average speed
    // },
    // formatDuration(minutes) {
    //   const hours = Math.floor(minutes / 60);
    //   const remainingMinutes = Math.round(minutes % 60);
    //   return `${hours}h ${remainingMinutes}m`;
    // },
    // degToRad(deg) {
    //   return deg * (Math.PI / 180);
    // },
    getCustomIcon(color) {
      return L.icon({
        iconUrl: `https://maps.google.com/mapfiles/ms/icons/${color}-dot.png`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      });
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
};
</script>

<style scoped>
.container {
  max-width: 1200px;
}
#map {
  z-index: 0 !important;
  position: relative;
  height: 300px;
  border-radius: 10px;
}
</style>
