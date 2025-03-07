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
            class="h-24 w-full object-cover rounded-lg cursor-pointer border-2"
            :class="{ 'border-blue-500': currentImageIndex === (galleryStartIndex + index) % property.gallery.length }"
            @click="currentImageIndex = (galleryStartIndex + index) % property.gallery.length"
          />
        </div>
      </div>

      <div class="p-5 bg-white shadow-lg rounded-lg text-center relative">
        <template v-if="isOwnerDetailsLocked">
          <div
            class="absolute inset-0 bg-white bg-opacity-90 flex flex-col items-center justify-center p-5 rounded-lg"
          >
            <span class="text-4xl text-gray-500 mb-2">🔒</span>
            <h3 class="text-lg font-bold text-[#364365]">
              This Information is Locked
            </h3>
            <p class="text-gray-600 mb-3">
              This is a paid service. Unlock to access owner details.
            </p>
            <button
              @click="showUnlockModal = true"
              class="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              🔓 Unlock Information
            </button>
          </div>
        </template>
        <template v-else-if="property && property.owner && isOwnerDetailsVisible">
          <img
            :src="property.owner.profilePic "
            alt="Owner"
            class="w-24 h-24 rounded-full mx-auto mb-3 mt-5"
          />
          <h3 class="text-lg font-bold text-[#364365]">
            {{ property.owner.name }}
          </h3>
          <p class="text-gray-600">📞 {{ property.owner.phone }}</p>
          <p class="text-gray-600">✉️ {{ property.owner.email }}</p>
          <p class="text-gray-600">📍 {{ property.owner.address }}</p>
          <button
            @click="toggleOwnerDetails"
            class="mt-3 w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-700"
          >
            ❌ Hide Owner Information
          </button>
          <button
            @click="handleOwnerLock"
            class="mt-3 w-full bg-yellow-500 text-white py-2 rounded-md hover:bg-yellow-700"
          >
            🔒 Lock Owner Info Test
          </button>
        </template>
        <template v-else>
          <div class="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-3 mt-5"></div>
          <div class="w-50 h-10 bg-gray-300 mx-auto mb-3"></div>
          <h3 class="text-lg font-bold text-[#364365]">Real Estate Owner</h3>
          <button
            @click="toggleOwnerDetails"
            class="mt-2 w-full bg-[#364365] text-white py-2 rounded-md hover:bg-gray-800"
          >
            📞 View Owner Information
          </button>
        </template>

        <div
          v-if="showUnlockModal"
          class="fixed inset-0 bg-gray-900 bg-opacity-40 z-10 flex items-center justify-center"
        >
          <div class="bg-white p-6 rounded-lg shadow-lg text-center w-96">
            <h3 class="text-lg font-bold text-gray-800">
              🔓 Unlock Information
            </h3>
            <p class="text-gray-600 mt-2 mb-4">
              This is a paid service. Do you want to proceed?
            </p>
            <div class="flex justify-center space-x-3">
              <button
                @click="confirmUnlock"
                class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                ✅ OK
              </button>
              <button
                @click="showUnlockModal = false"
                class="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                ❌ Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      <div class="p-5 bg-white shadow-lg rounded-lg">
        <h3 class="text-lg font-bold">Property Video</h3>
        <video v-if="property.video" controls class="w-full h-64 mt-2 rounded-lg">
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
          <li><strong>Furnished:</strong> {{ property.furnished ? "Yes" : "No" }}</li>
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
            <li v-for="(feature, index) in property.interiorFeatures" :key="index">
              ✔ {{ feature }}
            </li>
          </ul>
        </div>

        <div class="p-5 bg-white shadow-lg rounded-lg mt-6">
          <h3 class="text-lg font-bold text-[#364365]">External Features</h3>
     
          <ul class="mt-2 text-gray-600 space-y-1">
            <li v-for="(feature, index) in property.externalFeatures" :key="index">
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
    };
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
          this.visibleGallery.push(this.property.gallery[(this.galleryStartIndex + i) % this.property.gallery.length]);
        }
      }
    },
    nextImage() {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.property.gallery.length;
      this.galleryStartIndex = (this.currentImageIndex - (this.currentImageIndex % 4));
      this.updateVisibleGallery();
    },
    prevImage() {
      this.currentImageIndex = (this.currentImageIndex - 1 + this.property.gallery.length) % this.property.gallery.length;
      this.galleryStartIndex = (this.currentImageIndex - (this.currentImageIndex % 4));
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
        iconUrl: `https://maps.google.com/mapfiles/ms/icons/$$${color}-dot.png`,
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








