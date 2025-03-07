<template>
  <main class="min-h-screen bg-gray-100 flex-1 p-4 md:p-8">
    <div class="md:flex block">
      <!-- Main Content -->
      <div class="flex-1 p-4 md:p-8">
        <div class="container mx-auto py-10 px-5 mt-15">
          <div v-if="property" class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="col-span-2 relative">
              <div class="relative w-full h-96">
                <img
                  :src="property.data.gallery[0]"
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
                  v-for="(img, index) in property.data.gallery"
                  :key="index"
                  :src="img"
                  class="h-24 w-full object-cover rounded-lg cursor-pointer border-2"
                  :class="{ 'border-blue-500': currentImageIndex === index }"
                  @click="currentImageIndex = index"
                />
              </div>
            </div>

            <div class="p-5 bg-white shadow-lg rounded-lg text-center relative">
              <div>
                <img
                  :src="property.owner.profilePic"
                  alt="Owner"
                  class="w-24 h-24 rounded-full mx-auto mb-3 mt-5"
                />
                <h3 class="text-lg font-bold text-[#364365]">
                  {{ property.owner.name }}
                </h3>
                <p class="text-gray-600">📞 {{ property.owner.phone }}</p>

                <p class="text-gray-600">✉️ {{ property.owner.email }}</p>
                <p class="text-gray-600">📍 {{ property.owner.address }}</p>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div class="p-5 bg-white shadow-lg rounded-lg">
              <h3 class="text-lg font-bold">Property Video</h3>
              <video
                v-if="property.data.video"
                controls
                class="w-full h-64 mt-2 rounded-lg"
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

            <div class="p-5 bg-white shadow-lg rounded-lg">
              <h3 class="text-lg font-bold text-gray-600">
                General Information
              </h3>
              <ul class="mt-2 text-gray-600 space-y-1">
                <li>
                  <strong>Published Date:</strong> {{ property.data.date }}
                </li>
                <li>
                  <strong>BathRoom Number:</strong>
                  {{ property.data.bathRooms }}
                </li>
                <li>
                  <strong>Furnished:</strong>
                  {{ property.data.Furnished ? "Yes" : "No" }}
                </li>
                <li><strong>Rooms:</strong> {{ property.data.rooms }}</li>
                <li><strong>Size:</strong> {{ property.data.size }} m²</li>
              </ul>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <div class="p-5 bg-white shadow-lg rounded-lg">
                <h3 class="text-lg font-bold text-[#364365]">
                  Interior Features
                </h3>
                <ul class="mt-2 text-gray-600 space-y-1">
                  <li
                    v-for="feature in property.data.interiorFeatures"
                    :key="feature"
                  >
                    ✔ {{ feature }}
                  </li>
                </ul>
              </div>

              <div class="p-5 bg-white shadow-lg rounded-lg mt-6">
                <h3 class="text-lg font-bold text-[#364365]">
                  External Features
                </h3>
                <ul class="mt-2 text-gray-600 space-y-1">
                  <li
                    v-for="feature in property.data.externalFeatures"
                    :key="feature"
                  >
                    ✔ {{ feature }}
                  </li>
                </ul>
              </div>
            </div>
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
    </div>
  </main>
</template>

<script>
import L from "leaflet";

export default {
  data() {
    return {
      id: this.$route.params.id,
      property: {},
      currentImageIndex: 0,
      userLocation: null,
      distance: null,
      duration: null,

      currentImageIndex: 0,

      isOwnerDetailsVisible: false,
      isOwnerDetailsLocked: false,
      ownerClickCount: 0,
      showUnlockModal: false,
    };
  },
  async mounted() {
    if (this.property && this.property.coordinates) {
      this.initMap();
    }
  },
  async created() {
    console.log(this.id);
    try {
      await this.getData();
    } catch (error) {
      console.error("Error in created:", error);
    }
    console.log(this.property.data.interiorFeatures);
  },

  methods: {
    async getData() {
      this.isLoading = true;
      try {
        const response = await fetch(
          `https://eskan-project-14c3b-default-rtdb.europe-west1.firebasedatabase.app/properties/${this.id}.json`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (!data) {
          this.property = [];
          return;
        }

        // Transform the data and enforce a consistent structure
        this.property = data;
      } catch (error) {
        console.error("Error fetching data:", error);
        this.property = [];
      } finally {
        this.isLoading = false;
      }
    },
    nextImage() {
      this.currentImageIndex =
        (this.currentImageIndex + 1) % this.property.data.gallery.length;
    },
    prevImage() {
      this.currentImageIndex =
        (this.currentImageIndex - 1 + this.property.data.gallery.length) %
        this.property.data.gallery.length;
    },
    initMap() {
      const { latitude, longitude } = this.property.data.coordinates;
      const map = L.map("map", { scrollWheelZoom: false }).setView(
        [latitude, longitude],
        13
      );
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map);

      L.marker([latitude, longitude], { icon: this.getCustomIcon("red") })
        .addTo(map)
        .bindPopup(
          `<b>${this.property.data.title}</b><br>${this.property.data.location}`
        )
        .openPopup();

      this.getUserLocation(map, lat, lng);
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
        iconUrl: `https://maps.google.com/mapfiles/ms/icons/${color}-dot.png`,
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
