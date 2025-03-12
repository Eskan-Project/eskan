<template>
  <div v-if="property" class="container mx-auto py-10 px-5 mt-15">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="col-span-2 space-y-6">
        <div
          class="flex flex-col sm:flex-row justify-between items-start gap-4"
        >
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
            {{ property.price }} EGP
          </p>
        </div>

        <div
          class="relative w-full h-80 sm:h-96 rounded-lg overflow-hidden shadow-lg group"
        >
          <img
            :src="currentImage"
            alt="Property Image"
            class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          <button
            @click="prevImage"
            class="cursor-pointer absolute top-1/2 left-4 transform -translate-y-1/2 bg-white text-gray-700 w-12 h-12 flex items-center justify-center rounded-full shadow-md hover:bg-gray-200 active:scale-90 transition opacity-0 group-hover:opacity-100"
            aria-label="Previous Image"
          >
            <i class="bi bi-chevron-left text-xl"></i>
          </button>
          <button
            @click="nextImage"
            class="cursor-pointer absolute top-1/2 right-4 transform -translate-y-1/2 bg-white text-gray-700 w-12 h-12 flex items-center justify-center rounded-full shadow-md hover:bg-gray-200 active:scale-90 transition opacity-0 group-hover:opacity-100"
            aria-label="Next Image"
          >
            <i class="bi bi-chevron-right text-xl"></i>
          </button>
          <button
            @click="openFullScreen"
            class="cursor-pointer absolute bottom-4 right-4 bg-white text-gray-700 w-10 h-10 flex items-center justify-center rounded-full shadow-md hover:bg-gray-200 transition opacity-0 group-hover:opacity-100"
            aria-label="View Fullscreen"
          >
            <i class="bi bi-arrows-fullscreen text-lg"></i>
          </button>
          <div
            class="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-sm"
          >
            {{ currentImageIndex + 1 }} / {{ property.images.length }}
          </div>
        </div>

        <div class="relative">
          <div
            ref="thumbnailContainer"
            class="flex overflow-x-auto gap-2 py-2 scroll-smooth scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
          >
            <img
              v-for="(img, index) in property.images"
              :key="index"
              :src="img"
              loading="lazy"
              class="h-20 w-20 sm:h-24 sm:w-37 object-cover rounded-lg cursor-pointer border-2 transition-all duration-200 hover:border-blue-600 flex-shrink-0"
              :class="{ 'border-blue-500': currentImageIndex === index }"
              @click="
                currentImageIndex = index;
                scrollToActiveThumbnail();
              "
              :alt="`Thumbnail ${index + 1}`"
            />
          </div>
          <button
            v-if="property.images.length > visibleThumbnails"
            @click="scrollThumbnails(-1)"
            class="cursor-pointer absolute top-1/2 left-0 transform -translate-y-1/2 bg-white text-gray-700 w-8 h-8 flex items-center justify-center rounded-full shadow-md hover:bg-gray-200 transition"
            aria-label="Scroll Left"
          >
            <i class="bi bi-chevron-left"></i>
          </button>
          <button
            v-if="property.images.length > visibleThumbnails"
            @click="scrollThumbnails(1)"
            class="cursor-pointer absolute top-1/2 right-0 transform -translate-y-1/2 bg-white text-gray-700 w-8 h-8 flex items-center justify-center rounded-full shadow-md hover:bg-gray-200 transition"
            aria-label="Scroll Right"
          >
            <i class="bi bi-chevron-right"></i>
          </button>
        </div>
      </div>

      <div
        class="bg-white rounded-lg p-6 shadow-lg flex flex-col justify-center items-center"
      >
        <PropertyDetails
          :property="property"
          :id="id"
          @viewOwner="handleViewOwner"
        />
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

    <transition name="fade">
      <div
        v-if="isFullScreen"
        class="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
      >
        <div class="relative w-full max-w-5xl">
          <img
            :src="currentImage"
            class="w-full h-auto max-h-screen object-contain"
            alt="Full-screen Property Image"
          />
          <button
            @click="prevImage"
            class="cursor-pointer absolute top-1/2 left-4 transform -translate-y-1/2 bg-white text-gray-700 w-12 h-12 flex items-center justify-center rounded-full shadow-md hover:bg-gray-200 transition"
          >
            <i class="bi bi-chevron-left text-xl"></i>
          </button>
          <button
            @click="nextImage"
            class="cursor-pointer absolute top-1/2 right-4 transform -translate-y-1/2 bg-white text-gray-700 w-12 h-12 flex items-center justify-center rounded-full shadow-md hover:bg-gray-200 transition"
          >
            <i class="bi bi-chevron-right text-xl"></i>
          </button>
          <button
            @click="closeFullScreen"
            class="cursor-pointer absolute top-4 right-4 bg-white text-gray-700 w-10 h-10 flex items-center justify-center rounded-full shadow-md hover:bg-gray-200 transition"
          >
            <i class="bi bi-x-lg text-lg"></i>
          </button>
          <div
            class="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm"
          >
            {{ currentImageIndex + 1 }} / {{ property.images.length }}
          </div>
        </div>
      </div>
    </transition>
  </div>
  <div v-else class="min-h-screen flex items-center justify-center">
    <div class="text-gray-600 text-xl">Property Not Found</div>
  </div>
</template>

<script>
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import PropertyDetails from "../components/PropertyDetails.vue";
import { mapActions, mapState } from "vuex";
import governorates from "@/assets/data/governorates.json";
import cities from "@/assets/data/cities.json";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

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
      visibleThumbnails: 4,
    };
  },
  computed: {
    ...mapState("property", ["property", "loading"]),
    ...mapState("auth", ["userDetails", "isAuth"]),
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
        this.scrollToActiveThumbnail();
      });
      this.updateGalleryStartIndex();
      console.log("userDetails", this.userDetails);
      if (
        this.userDetails.paidProperties.includes(this.id) ||
        this.userDetails.freeViewsRemaining === 0
      ) {
        return;
      }
      this.updateFreeViews(this.userDetails.uid);
      this.addPaidProperty({ uid: this.userDetails.uid, propertyId: this.id });
    });
  },
  beforeDestroy() {
    if (this.mapInstance) {
      this.mapInstance.remove();
    }
  },
  methods: {
    ...mapActions("property", ["getProperty"]),
    ...mapActions("auth", ["updateFreeViews", "addPaidProperty"]),
    nextImage() {
      if (!this.property?.images?.length) return;
      this.currentImageIndex =
        (this.currentImageIndex + 1) % this.property.images.length;
      this.updateGalleryStartIndex();
      this.scrollToActiveThumbnail();
    },
    prevImage() {
      if (!this.property?.images?.length) return;
      this.currentImageIndex =
        (this.currentImageIndex - 1 + this.property.images.length) %
        this.property.images.length;
      this.updateGalleryStartIndex();
      this.scrollToActiveThumbnail();
    },
    scrollThumbnails(direction) {
      const container = this.$refs.thumbnailContainer;
      if (!container) return;
      const thumbnailWidth = container.querySelector("img").offsetWidth + 8;
      container.scrollBy({
        left: direction * thumbnailWidth,
        behavior: "smooth",
      });
    },
    scrollToActiveThumbnail() {
      const container = this.$refs.thumbnailContainer;
      if (!container) return;
      const thumbnailWidth = container.querySelector("img").offsetWidth + 8;
      const scrollPosition =
        this.currentImageIndex * thumbnailWidth -
        (container.offsetWidth - thumbnailWidth) / 2;
      container.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
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
