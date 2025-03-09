<template>
  <div v-if="loading">Loading...</div>
  <div v-else-if="property" class="container mx-auto py-10 px-5 mt-15">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="col-span-2 relative">
        <div class="relative w-full h-96">
          <img
            :src="property.gallery[currentImageIndex]"
            alt="Property Image"
            class="w-full h-96 object-cover rounded-lg"
            loading="lazy"
          />
          <button
            @click="prevImage"
            class="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white text-gray-700 w-10 h-10 flex items-center justify-center rounded-full shadow-md hover:bg-gray-200 active:scale-90 transition"
          >
            ❮
          </button>
          <button
            @click="nextImage"
            class="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white text-gray-700 w-10 h-10 flex items-center justify-center rounded-full shadow-md hover:bg-gray-200 active:scale-90 transition"
          >
            ❯
          </button>
        </div>
        <div class="grid grid-cols-4 gap-2 mt-4">
          <img
            v-for="(img, index) in visibleGallery"
            :key="index"
            :src="img"
            loading="lazy"
            class="h-24 w-full object-cover rounded-lg cursor-pointer border-2"
            :class="{
              'border-blue-500':
                currentImageIndex ===
                (galleryStartIndex + index) % property.gallery.length,
            }"
            @click="
              currentImageIndex =
                (galleryStartIndex + index) % property.gallery.length
            "
          />
        </div>
      </div>

      <div class="p-5 bg-white shadow-lg rounded-lg text-center relative">
        <div class="property-item">
          <PropertyDetails :property="property" :id="property.id" />
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      <div class="p-5 bg-white shadow-lg rounded-lg">
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
      </div>

      <div class="p-5 bg-white shadow-lg rounded-lg">
        <h3 class="text-lg font-bold">General Information</h3>
        <ul class="mt-2 text-gray-600 space-y-1">
          <li><strong>Published Date:</strong> {{ property.date }}</li>
          <li><strong>Floor Location:</strong> {{ property.floor }}</li>
          <li>
            <strong>Furnished:</strong> {{ property.furnished ? "Yes" : "No" }}
          </li>
          <li><strong>Rooms:</strong> {{ property.rooms }}</li>
          <li><strong>Size:</strong> {{ property.size }} m²</li>
        </ul>
      </div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      <div>
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
      </div>
      <div>
        <div class="p-5 bg-white shadow-lg rounded-lg">
          <h3 class="text-lg font-bold">Location Information</h3>
          <div id="map" class="w-full h-64 mt-2 rounded-lg"></div>
          <p v-if="distance && duration" class="mt-3 text-gray-700">
            📍 Distance: {{ distance.toFixed(2) }} km | ⏳ Time:
            {{ formatDuration(duration) }}
          </p>
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

export default {
  props: ["id"],
  data() {
    return {
      currentImageIndex: 0,
      galleryStartIndex: 0,
      visibleGallery: [],
      userLocation: null,
      distance: null,
      duration: null,
      property: null,
      isOwnerDetailsVisible: false,
      isOwnerDetailsLocked: false,
      ownerClickCount: 0,
      showUnlockModal: false,
      loading: true,
      showDetails: false,
    };
  },
  components: {
    PropertyDetails,
  },
  mounted() {
    this.fetchProperty().then(() => {
      if (this.property && this.property.coordinates) {
        this.$nextTick(() => {
          this.initMap();
        });
      }
      this.updateVisibleGallery();
    });
  },
  methods: {
    async fetchProperty() {
      this.loading = true;
      try {
        const response = await fetch(
          `https://eskan-project-14c3b-default-rtdb.europe-west1.firebasedatabase.app/properties/${this.id}.json`
        );
        const data = await response.json();
        if (data) {
          this.property = { id: this.id, ...data.data, owner: data.owner };
        } else {
          this.property = null;
        }
      } catch (error) {
        console.error("Error fetching property:", error);
        this.property = null;
      } finally {
        this.loading = false;
      }
    },
    updateVisibleGallery() {
      if (this.property && this.property.gallery) {
        this.visibleGallery = [];
        for (let i = 0; i < 4; i++) {
          this.visibleGallery.push(
            this.property.gallery[
              (this.galleryStartIndex + i) % this.property.gallery.length
            ]
          );
        }
      }
    },
    nextImage() {
      this.currentImageIndex =
        (this.currentImageIndex + 1) % this.property.gallery.length;
      this.galleryStartIndex =
        this.currentImageIndex - (this.currentImageIndex % 4);
      this.updateVisibleGallery();
    },
    prevImage() {
      this.currentImageIndex =
        (this.currentImageIndex - 1 + this.property.gallery.length) %
        this.property.gallery.length;
      this.galleryStartIndex =
        this.currentImageIndex - (this.currentImageIndex % 4);
      this.updateVisibleGallery();
    },
    initMap() {
      const { latitude, longitude } = this.property.coordinates;
      const map = L.map("map", { scrollWheelZoom: false }).setView(
        [latitude, longitude],
        13
      );
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);
      L.marker([latitude, longitude], { icon: this.getCustomIcon("red") })
        .addTo(map)
        .bindPopup(`<b>${this.property.title}</b><br>${this.property.location}`)
        .openPopup();

      this.getUserLocation(map, latitude, longitude);
    },
    getUserLocation(map, targetLat, targetLng) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.userLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };

            L.marker([this.userLocation.lat, this.userLocation.lng], {
              icon: this.getCustomIcon("blue"),
            })
              .addTo(map)
              .bindPopup("You are here");

            this.calculateDistance(
              targetLat,
              targetLng,
              this.userLocation.lat,
              this.userLocation.lng
            );
          },
          () => {
            console.error("Could not retrieve location");
          }
        );
      }
    },
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
        iconUrl: `https://maps.google.com/mapfiles/ms/icons/$$$${color}-dot.png`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      });
    },
    toggleOwnerDetails() {
      this.isOwnerDetailsVisible = !this.isOwnerDetailsVisible;
      this.ownerClickCount = 0;
    },

    handleOwnerLock() {
      this.ownerClickCount++;

      if (this.ownerClickCount >= 2) {
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
