<template>
  <div v-if="loading">Loading...</div>
  <div v-else-if="property" class="container mx-auto py-10 px-5 mt-15">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="col-span-2 relative">
        <div class="relative w-full h-96">
          <img
            :src="property.images[currentImageIndex]"
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
            :class="{
              'border-blue-500':
                currentImageIndex ===
                (galleryStartIndex + index) % property.images.length,
            }"
            @click="
              currentImageIndex =
                (galleryStartIndex + index) % property.images.length
            "
          />
        </div>
      </div>

      <div class="p-5 bg-white shadow-lg rounded-lg text-center relative">
        <div class="property-item">
          <PropertyDetails :property="property" :id="id" />
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      <div class="p-5 bg-white shadow-lg rounded-lg">
        <h3 class="text-lg font-bold">Property Details</h3>
        <ul class="mt-2 text-gray-600 space-y-1">
          <li><strong>Title:</strong> {{ property.title }}</li>
          <li><strong>Description:</strong> {{ property.description }}</li>
          <li><strong>Price:</strong> {{ property.price }}</li>
          <li><strong>Area:</strong> {{ property.area }}</li>
          <li><strong>Rooms:</strong> {{ property.rooms }}</li>
          <li><strong>Bathrooms:</strong> {{ property.bathrooms }}</li>
          <li><strong>Kitchens:</strong> {{ property.kitchens }}</li>
          <li><strong>Living Rooms:</strong> {{ property.livingRooms }}</li>
          <li><strong>Floor:</strong> {{ property.floor }}</li>
          <li><strong>Furnished:</strong> {{ property.furnished }}</li>
          <li><strong>Property Status:</strong> {{ property.propertyStatus }}</li>
          <li><strong>City:</strong> {{ property.city }}</li>
          <li><strong>Governorate:</strong> {{ property.governorate }}</li>
          <li><strong>Neighborhood:</strong> {{ property.neighborhood }}</li>
          <li><strong>Status:</strong> {{ property.status }}</li>
        </ul>
      </div>

      <div class="p-5 bg-white shadow-lg rounded-lg">
        <h3 class="text-lg font-bold">Contact Information</h3>
        <ul class="mt-2 text-gray-600 space-y-1">
          <li><strong>Name:</strong> {{ property.propertyContact.name }}</li>
          <li><strong>Email:</strong> {{ property.propertyContact.email }}</li>
          <li><strong>Phone:</strong> {{ property.propertyContact.phone }}</li>
          <li v-if="property.propertyContact.phone2"><strong>Phone 2:</strong> {{ property.propertyContact.phone2 }}</li>
        </ul>
      </div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      <div>
        <div class="p-5 bg-white shadow-lg rounded-lg">
          <h3 class="text-lg font-bold">Location Information</h3>
          <div id="map" class="w-full h-64 mt-2 rounded-lg"></div>
          <p v-if="distance && duration" class="mt-3 text-gray-700">
            Distance: {{ distance.toFixed(2) }} km | ⏳ Time:
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
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";

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
      loading: true,
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
        const docRef = doc(db, "properties", this.id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          this.property = { id: docSnap.id, ...docSnap.data() };
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
      if (this.property && this.property.images) {
        this.visibleGallery = [];
        for (let i = 0; i < 4; i++) {
          this.visibleGallery.push(
            this.property.images[
              (this.galleryStartIndex + i) % this.property.images.length
            ]
          );
        }
      }
    },
    nextImage() {
      this.currentImageIndex =
        (this.currentImageIndex + 1) % this.property.images.length;
      this.galleryStartIndex =
        this.currentImageIndex - (this.currentImageIndex % 4);
      this.updateVisibleGallery();
    },
    prevImage() {
      this.currentImageIndex =
        (this.currentImageIndex - 1 + this.property.images.length) %
        this.property.images.length;
      this.galleryStartIndex =
        this.currentImageIndex - (this.currentImageIndex % 4);
      this.updateVisibleGallery();
    },
    initMap() {
      if (!this.property.coordinates) return;
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
        .bindPopup(`<b><span class="math-inline">\{this\.property\.title\}</b\><br\></span>{this.property.neighborhood}`)
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
    iconUrl: `https://maps.google.com/mapfiles/ms/icons/$${color}-dot.png`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
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
