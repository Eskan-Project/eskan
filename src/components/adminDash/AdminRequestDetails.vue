<template>
  <main class="min-h-screen bg-gray-100 dark:bg-gray-900 flex-1 p-4">
    <div class="md:flex block">
      <!-- Main Content -->

      <div class="flex-1 p-4 md:p-8">
        <!-- Back button -->
        <div class="mb-6">
          <router-link
            to="/admin/requests"
            class="inline-flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg transition-colors"
          >
            <i class="bi bi-arrow-left mr-2"></i> Back to Requests
          </router-link>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="container mx-auto py-10 px-5 mt-15">
          <div class="flex items-center justify-center h-96">
            <div class="text-center">
              <div
                class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto"
              ></div>
              <p class="mt-4 text-gray-600 dark:text-gray-400">
                Loading Request details...
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
              @click="loadData"
              class="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Try Again
            </button>
          </div>
        </div>

        <!-- Content when data is loaded -->

        <div v-else class="container mx-auto py-10 px-5 mt-10">
          <div class="flex sm:flex-row justify-between items-start gap-4 mb-4">
            <div class="space-y-2">
              <h1
                class="text-3xl font-bold text-gray-900 dark:text-white capitalize"
              >
                {{ request.title || "Untitled request" }}
              </h1>
              <p class="text-lg text-gray-600 flex items-center capitalize">
                <i class="bi bi-geo-alt mr-2 text-gray-500"></i>
                {{ locationText }}
              </p>
            </div>
            <div
              class="text-xl bg-blue-50 p-3 rounded-lg border border-blue-100 shadow-sm flex items-center justify-center"
            >
              <p class="text-blue-600 font-medium mr-2">Price:</p>
              <p class="font-semibold text-blue-700">
                {{ Number(request.price).toLocaleString() }}
                <span class="text-lg">EGP</span>
              </p>
            </div>
          </div>
          <div v-if="request" class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- request Gallery Section -->
            <div class="col-span-2 relative">
              <div class="relative w-full h-96">
                <div
                  v-if="
                    !imageLoaded && request.images && request.images.length > 0
                  "
                  class="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg"
                >
                  <div
                    class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
                  ></div>
                </div>
                <img
                  v-if="request && request.images && request.images.length > 0"
                  :src="request.images[currentImageIndex]"
                  alt="Property Image"
                  loading="lazy"
                  class="w-full h-96 object-cover rounded-lg shadow-lg property-image transition"
                  @load="imageLoaded = true"
                  v-show="imageLoaded"
                />
                <div
                  v-if="request.images.length == 0"
                  class="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center"
                >
                  <span class="text-gray-500">No image</span>
                </div>

                <!-- Gallery Navigation Buttons -->
                <button
                  v-if="request && request.images && request.images.length > 1"
                  @click="prevImage"
                  class="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white text-gray-700 w-10 h-10 flex items-center justify-center rounded-full shadow-md hover:bg-gray-200 active:scale-90 transition"
                  aria-label="Previous image"
                >
                  <i class="bi bi-chevron-left"></i>
                </button>

                <button
                  v-if="request && request.images && request.images.length > 1"
                  @click="nextImage"
                  class="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white text-gray-700 w-10 h-10 flex items-center justify-center rounded-full shadow-md hover:bg-gray-200 active:scale-90 transition"
                  aria-label="Next image"
                >
                  <i class="bi bi-chevron-right"></i>
                </button>

                <button
                  v-if="request && request.images && request.images.length > 0"
                  @click="viewFullImage(request.images[currentImageIndex])"
                  class="absolute bottom-4 right-4 bg-white text-gray-700 w-10 h-10 flex items-center justify-center rounded-full shadow-md hover:bg-gray-200 transition opacity-80 hover:opacity-100"
                  aria-label="View Fullscreen"
                >
                  <i class="bi bi-arrows-fullscreen"></i>
                </button>

                <div
                  v-if="request && request.images && request.images.length > 1"
                  class="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white px-2 py-1 rounded-full text-xs"
                >
                  {{ currentImageIndex + 1 }} / {{ request.images.length }}
                </div>
              </div>

              <!-- Thumbnail Gallery -->
              <div
                v-if="request && request.images && request.images.length > 0"
                class="relative mt-4"
              >
                <div
                  ref="thumbnailContainer"
                  class="flex overflow-x-auto gap-2 py-2 scroll-smooth thumbnail-gallery px-2"
                >
                  <img
                    v-for="(img, index) in request.images"
                    :key="index"
                    :src="img"
                    loading="lazy"
                    class="h-50 w-50 object-cover rounded-lg cursor-pointer transition-all duration-200 hover:opacity-100 flex-shrink-0 hover:shadow-lg"
                    :class="{
                      'ring-2 ring-blue-500 shadow-md opacity-100':
                        currentImageIndex === index,
                      'opacity-70 hover:opacity-90':
                        currentImageIndex !== index,
                    }"
                    @click="currentImageIndex = index"
                  />
                </div>
                <button
                  v-if="request.images.length > 4"
                  @click="scrollThumbnails(-1)"
                  class="cursor-pointer absolute top-1/2 left-0 transform -translate-y-1/2 bg-white text-gray-700 w-8 h-8 hidden md:flex items-center justify-center rounded-full shadow-md hover:bg-gray-200 transition"
                  aria-label="Scroll Left"
                >
                  <i class="bi bi-chevron-left"></i>
                </button>
                <button
                  v-if="request.images.length > 4"
                  @click="scrollThumbnails(1)"
                  class="cursor-pointer absolute top-1/2 right-0 transform -translate-y-1/2 bg-white text-gray-700 w-8 h-8 hidden md:flex items-center justify-center rounded-full shadow-md hover:bg-gray-200 transition"
                  aria-label="Scroll Right"
                >
                  <i class="bi bi-chevron-right"></i>
                </button>
              </div>
            </div>

            <!-- Owner Information Section -->
            <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <div class="mt-2 text-gray-900 dark:text-gray-100">
                <h2 class="text-xl font-semibold text-center mb-4">
                  Owner Details
                </h2>
                <div class="flex flex-col items-center space-y-3">
                  <img
                    :src="
                      request.propertyContact?.profilePicture ||
                      'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'
                    "
                    alt="Profile Picture"
                    class="w-24 h-24 rounded-full shadow-md border-2 border-gray-300 dark:border-gray-600 object-cover"
                  />
                  <p class="flex flex-col items-center space-y-1">
                    <span class="font-semibold text-gray-900 dark:text-gray-100"
                      >Name:</span
                    >
                    <span
                      class="text-sm capitalize text-gray-800 dark:text-gray-200"
                      >{{ request.propertyContact.name }}</span
                    >
                  </p>
                  <p class="flex flex-col items-center space-y-1">
                    <span class="font-semibold text-gray-900 dark:text-gray-100"
                      >Phone:</span
                    >
                    <span class="text-sm text-gray-800 dark:text-gray-200">{{
                      request.propertyContact.phone
                    }}</span>
                  </p>
                  <p class="flex flex-col items-center space-y-1">
                    <span class="font-semibold text-gray-900 dark:text-gray-100"
                      >Email:</span
                    >
                    <span class="text-sm text-gray-800 dark:text-gray-200">{{
                      request.propertyContact.email
                    }}</span>
                  </p>
                  <p
                    v-if="request.propertyContact.address"
                    class="flex flex-col items-center space-y-1"
                  >
                    <span class="font-semibold text-gray-900 dark:text-gray-100"
                      >Address:</span
                    >
                    <span
                      class="text-sm capitalize text-gray-800 dark:text-gray-200"
                      >{{ request.propertyContact.address }}</span
                    >
                  </p>

                  <!-- Contract Document -->
                  <div
                    v-if="request.propertyContact?.contract"
                    class="mt-3 w-full"
                  >
                    <p
                      class="font-semibold text-center mb-2 text-gray-900 dark:text-gray-100"
                    >
                      Contract Document:
                    </p>
                    <div class="relative w-full">
                      <img
                        :src="request.propertyContact.contract"
                        class="max-h-40 mx-auto object-contain rounded border border-gray-300 dark:border-gray-600"
                        alt="Contract"
                        @click="
                          openContractImage(request.propertyContact.contract)
                        "
                      />
                    </div>
                  </div>

                  <router-link :to="`/admin/owners/edit/${request.ownerId}`">
                    <button
                      class="cursor-pointer w-[100%] text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-bold rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
                    >
                      owner Profile
                    </button>
                  </router-link>
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
              <p v-if="request.description" class="whitespace-pre-line">
                {{ request.description }}
              </p>
              <p v-else class="text-gray-500 italic text-center">
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
                  <p>{{ formatDate(request.createdAt) }}</p>
                  <p>{{ request.floor }}</p>
                  <p>{{ request.furnished ? "Yes" : "No" }}</p>
                  <p>{{ request.propertyStatus }}</p>
                  <p>{{ request.rooms }}</p>
                  <p>{{ request.livingRooms }}</p>
                  <p>{{ request.bathrooms }}</p>
                  <p>{{ request.kitchens }}</p>
                  <p>{{ request.area }} m²</p>
                </div>
              </div>
            </div>
            <div
              class="p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg relative"
            >
              <h2
                class="text-xl font-semibold text-gray-900 dark:text-white mb-4 text-center"
              >
                Location Information
              </h2>
              <!-- Only show map if data is loaded and not in loading state -->
              <div v-if="!loading && request.coordinates">
                <div id="map" class="w-full h-96 rounded-lg"></div>
              </div>
              <!-- Loading state -->
              <div
                v-else-if="loading || mapLoading"
                class="w-full h-96 rounded-lg flex items-center justify-center bg-gray-100"
              >
                <div class="text-center">
                  <div
                    class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"
                  ></div>
                  <p class="text-gray-600">Loading map...</p>
                </div>
              </div>
              <!-- Error state -->
              <div
                v-else
                class="w-full h-96 rounded-lg flex items-center justify-center bg-gray-100"
              >
                <p class="text-gray-600">No location data available</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Meeting Form Modal -->
        <div
          v-if="meetingInfo"
          class="fixed inset-0 z-50 overflow-y-auto backdrop-blur-md bg-white/30 dark:bg-gray-900/30 flex items-center justify-center p-4"
        >
          <div
            class="bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-xl shadow-xl max-w-md w-full p-6 relative"
          >
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
                Schedule Verification Meeting
              </h2>
              <button
                @click="meetingInfo = false"
                class="text-gray-500 hover:text-gray-700 focus:outline-none"
                aria-label="Close"
              >
                <i class="bi bi-x-lg"></i>
              </button>
            </div>

            <form @submit.prevent="scheduleMeeting" class="space-y-4">
              <div class="flex flex-col space-y-2">
                <label class="text-gray-700 dark:text-gray-300 font-medium"
                  >Meeting Date/Time:</label
                >
                <input
                  type="datetime-local"
                  v-model="meetingData.date"
                  required
                  class="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                />
              </div>

              <div class="flex flex-col space-y-2">
                <label class="text-gray-700 dark:text-gray-300 font-medium"
                  >Duration (minutes):</label
                >
                <input
                  type="number"
                  v-model="meetingData.duration"
                  required
                  min="15"
                  max="180"
                  class="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                />
              </div>

              <div class="flex flex-col space-y-2">
                <label class="text-gray-700 dark:text-gray-300 font-medium"
                  >Owner Email:</label
                >
                <input
                  type="email"
                  v-model="meetingData.ownerEmail"
                  :placeholder="request.propertyContact?.email || 'Owner email'"
                  required
                  class="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                />
              </div>

              <div class="flex flex-col space-y-2">
                <label class="text-gray-700 dark:text-gray-300 font-medium"
                  >Admin Email:</label
                >
                <input
                  type="email"
                  v-model="meetingData.adminEmail"
                  required
                  placeholder="Your email for meeting notifications"
                  class="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                />
              </div>

              <div class="flex gap-3 mt-6">
                <button
                  type="button"
                  @click="meetingInfo = false"
                  class="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  class="flex-1 bg-blue-600 dark:bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 transition-colors"
                >
                  Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
        <!-- Rejection Form Modal -->
        <reject-email
          v-if="rejectionInfo"
          :request="request"
          :location-text="locationText"
          @close="rejectionInfo = false"
          @rejection-complete="handleRejectionComplete"
        ></reject-email>
        <div class="text-center py-8 mt-4" v-if="!loading">
          <div class="flex flex-col md:flex-row justify-center gap-4">
            <button
              @click="acceptRequest"
              type="button"
              class="cursor-pointer w-full md:w-auto px-8 text-green-700 hover:text-white border-2 border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-bold rounded-lg text-sm py-3 text-center transition-all duration-200 flex items-center justify-center"
            >
              <i class="bi bi-check-circle mr-2"></i> Accept Request
            </button>
            <button
              @click="showMeetingForm"
              class="cursor-pointer w-full md:w-auto px-8 text-blue-700 hover:text-white border-2 border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-bold rounded-lg text-sm py-3 text-center transition-all duration-200 flex items-center justify-center"
            >
              <i class="bi bi-calendar-event mr-2"></i> Setup Meeting
            </button>
            <button
              @click="handleDeleteRequest"
              type="button"
              class="cursor-pointer w-full md:w-auto px-8 text-red-700 hover:text-white border-2 border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-bold rounded-lg text-sm py-3 text-center transition-all duration-200 flex items-center justify-center"
            >
              <i class="bi bi-x-circle mr-2"></i> Reject Request
            </button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import Swal from "sweetalert2";
import { mapActions, mapState } from "vuex";
import emailjs from "emailjs-com";
import { createEvent } from "ics";
import { nextTick } from "vue";
import RejectEmail from "./RejectEmail.vue";
import "leaflet/dist/leaflet.css";
import { initializePropertyMap } from "@/services/mapService";

// Initialize EmailJS
emailjs.init(import.meta.env.VITE_EMAILJS_USER_ID);

import governorates from "@/assets/data/governorates.json";
import cities from "@/assets/data/cities.json";

export default {
  components: {
    RejectEmail,
  },
  data() {
    return {
      meetingData: {
        date: "",
        duration: 30,
        ownerEmail: "",
        adminEmail: "",
      },
      rejectionInfo: false,
      id: null,
      currentImageIndex: 0,
      loading: true,
      error: null,
      mapInitialized: false,
      imageLoaded: false,
      mapLoaded: false,
      mapLoading: false,
      mapInstance: null,
      meetingInfo: false,
    };
  },
  computed: {
    ...mapState("requests", ["requestInfo"]),
    request() {
      return this.requestInfo || {};
    },
    locationText() {
      const governorateName = governorates.find(
        (g) => g.id == this.request.governorate
      )?.governorate_name_en;
      const cityName = cities.find(
        (c) => c.id == this.request.city
      )?.city_name_en;
      return `${governorateName || ""}-${cityName || ""} ${
        this.request?.neighborhood ? `-${this.request?.neighborhood}` : ""
      }`;
    },
  },
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
  mounted() {
    this.id = this.$route?.params?.id;
    if (!this.id) {
      this.error = "Request ID is missing";
      this.loading = false;
      return;
    }
    this.loadData();
  },
  methods: {
    ...mapActions("requests", ["getRequestById", "deleteRequest"]),
    ...mapActions("property", ["createPropertyFromRequest"]),
    ...mapActions("notifications", ["addNotification"]),

    // Add method to view full image
    viewFullImage(imageUrl) {
      if (!imageUrl) return;

      Swal.fire({
        imageUrl: imageUrl,
        imageAlt: "Property Image",
        width: "auto",
        padding: "1em",
        showConfirmButton: false,
        showCloseButton: true,
        background: "#fff",
        customClass: {
          image: "max-h-screen max-w-full object-contain",
        },
      });
    },

    // Add method to scroll thumbnails
    scrollThumbnails(direction) {
      const container = this.$refs.thumbnailContainer;
      if (!container) return;

      const scrollAmount = direction * 200; // Adjust scroll amount as needed
      container.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    },

    // Add method to open contract image in larger view
    openContractImage(imageUrl) {
      if (!imageUrl) return;

      Swal.fire({
        imageUrl: imageUrl,
        imageAlt: "Contract Document",
        width: "auto",
        padding: "1em",
        showConfirmButton: false,
        showCloseButton: true,
        background: "#fff",
        customClass: {
          image: "max-h-screen max-w-full object-contain",
        },
      });
    },

    // Add missing gallery navigation methods
    prevImage() {
      if (this.request.images && this.request.images.length > 0) {
        this.currentImageIndex =
          (this.currentImageIndex - 1 + this.request.images.length) %
          this.request.images.length;
      }
    },

    nextImage() {
      if (this.request.images && this.request.images.length > 0) {
        this.currentImageIndex =
          (this.currentImageIndex + 1) % this.request.images.length;
      }
    },

    // Generate meet link
    generateMeetLink() {
      // Generate a unique meeting ID based on timestamp and random string
      const timestamp = new Date().getTime();
      const randomStr = Math.random().toString(36).substring(2, 8);

      // Create a meeting ID that's URL-friendly
      const meetingId = `eskan-meeting-${timestamp}-${randomStr}`;

      // Use Jitsi Meet which is an open-source video conferencing solution
      return `https://meet.jit.si/${meetingId}`;
    },

    // Update the scheduleMeeting method
    async scheduleMeeting() {
      try {
        // Validate meeting date
        const meetingDate = new Date(this.meetingData.date);
        const now = new Date();

        // Check if meeting date is in the past
        if (meetingDate < now) {
          Swal.fire({
            title: "Invalid Date",
            text: "Meeting cannot be scheduled in the past. Please select a future date and time.",
            icon: "error",
            confirmButtonText: "OK",
          });
          return;
        }

        // Check if meeting is within 48 hours
        const hoursDifference = (meetingDate - now) / (1000 * 60 * 60);
        if (hoursDifference < 48) {
          const result = await Swal.fire({
            title: "Short Notice",
            text: "It's recommended to schedule meetings at least 48 hours in advance. Do you want to proceed anyway?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, proceed",
            cancelButtonText: "No, change date",
          });

          if (!result.isConfirmed) {
            return;
          }
        }

        // Check if admin email is provided
        if (!this.meetingData.adminEmail) {
          Swal.fire({
            title: "Admin Email Required",
            text: "Please provide your email to receive meeting notifications",
            icon: "warning",
            confirmButtonText: "OK",
          });
          return;
        }

        // Show loading indicator
        Swal.fire({
          title: "Scheduling meeting...",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        // Generate meeting link
        const meetLink = this.generateMeetLink();

        // Format meeting date for display
        const formattedDate = meetingDate.toLocaleString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });

        // Set owner email from request data if not already set
        if (
          this.request.propertyContact?.email &&
          !this.meetingData.ownerEmail
        ) {
          this.meetingData.ownerEmail = this.request.propertyContact.email;
        }

        // Generate calendar file content
        const calendarFile = await this.generateCalendarFile(meetLink);

        // Create a downloadable link for the calendar file
        const blob = new Blob([calendarFile], { type: "text/calendar" });
        const calendarUrl = window.URL.createObjectURL(blob);

        // Create calendar details in HTML format for the email
        const calendarDetails = `
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>📅 Add to your calendar:</strong></p>
            <p>Title: Eskan Property Verification - ${
              this.request.title || "Property"
            }</p>
            <p>Date: ${formattedDate}</p>
            <p>Duration: ${this.meetingData.duration} minutes</p>
            <p>Location: <a href="${meetLink}" target="_blank">${meetLink}</a></p>
            <p>Description: Property verification meeting for ${
              this.request.title || "property"
            } located at ${this.locationText || "address"}.</p>
          </div>
        `;

        // Prepare EmailJS parameters with calendar details in HTML
        const templateParams = {
          to_name: this.request.propertyContact?.name || "Property Owner",
          property_title: this.request.title || "Property Verification",
          meeting_date: formattedDate,
          meeting_duration: this.meetingData.duration + " minutes",
          meet_link: meetLink,
          owner_email: this.meetingData.ownerEmail,
          admin_email: this.meetingData.adminEmail,
          property_address: this.locationText || "Property Location",
          calendar_details: calendarDetails,
        };

        // Send email through EmailJS
        await emailjs.send(
          import.meta.env.VITE_EMAILJS_SERVICE_ID,
          import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
          templateParams
        );

        // Download calendar file for admin
        const link = document.createElement("a");
        link.href = calendarUrl;
        link.setAttribute("download", "eskan_meeting.ics");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Update request status
        try {
          await this.updateRequestStatus(this.id, {
            status: "Meeting Scheduled",
            meetingDetails: {
              date: meetingDate,
              duration: this.meetingData.duration,
              meetLink: meetLink,
            },
          });
        } catch (error) {
          console.error("Failed to update request status:", error);
          // Continue with the process even if status update fails
        }

        // Show success message
        Swal.fire({
          title: "Meeting Scheduled!",
          html: `
            <p>Meeting details have been sent to ${this.meetingData.ownerEmail} and ${this.meetingData.adminEmail}</p>
          `,
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          this.$router.push("/admin/requests");
        });

        // Reset form and hide it
        this.meetingData.date = "";
        this.meetingData.duration = 30;
        this.meetingData.ownerEmail = "";
        this.meetingData.adminEmail = "";
        this.meetingInfo = false;
      } catch (error) {
        console.error("Scheduling failed:", error);
        Swal.fire({
          title: "Error",
          text: `Failed to schedule meeting: ${error.message}`,
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    },

    showMeetingForm() {
      // Pre-fill owner email if available
      if (this.request.propertyContact?.email) {
        this.meetingData.ownerEmail = this.request.propertyContact.email;
      }

      // Set default date to now + 3 days at 10:00 AM
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 3);
      defaultDate.setHours(10, 0, 0, 0);

      this.meetingData.date = defaultDate.toISOString().slice(0, 16);
      this.meetingInfo = true;
    },

    async acceptRequest() {
      try {
        await nextTick();
        const result = await Swal.fire({
          title: "Are you sure?",
          text: "Do you want to accept this request and send a payment request to the owner?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, accept it!",
          cancelButtonText: "No, cancel!",
        });

        if (result.isConfirmed) {
          // Create a new property object with isPaid set to false
          const propertyData = {
            ...this.request,
          };

          // Create the property with the modified data
          await this.createPropertyFromRequest(propertyData);
          await this.deleteRequest(this.id);

          if (propertyData.ownerId) {
            await this.sendAcceptanceNotification(
              propertyData.ownerId,
              propertyData.title
            );
          } else {
            console.warn(
              "Owner ID not found, cannot send acceptance notification to the owner."
            );
          }

          await nextTick();
          Swal.fire({
            title: "Success!",
            text: "Request accepted",
            icon: "success",
          });

          this.$router.push("/admin/properties");
        }
      } catch (error) {
        console.error("Error accepting request:", error);
        await nextTick();
        Swal.fire({
          title: "Error",
          text: "Failed to accept the request. Please try again.",
          icon: "error",
        });
      }
    },
    async sendAcceptanceNotification(ownerId, propertyTitle) {
      try {
        const notificationMessage = `"${propertyTitle}" has been approved! Click here to complete the payment. ✅`;

        await this.$store.dispatch("notifications/addNotification", {
          type: "property_accepted",
          ownerId: ownerId,
          message: notificationMessage,
          link: `/userProfile/${ownerId}`,
        });

        console.log(`Acceptance notification sent for owner ID: ${ownerId}`);
      } catch (error) {
        console.error("Error sending acceptance notification:", error);
      }
    },

    async loadData() {
      this.loading = true;
      this.imageLoaded = false;
      try {
        this.error = null;
        const result = await this.getRequestById(this.id);

        if (!result) {
          throw new Error("Request not found");
        }

        await this.$nextTick();
        if (!this.loading && this.request && this.request.coordinates) {
          await this.initMap();
        }
      } catch (error) {
        this.error = "Failed to load Request. Please try again later.";
        console.error("Fetch Request error:", error);
      } finally {
        this.loading = false;
      }
    },

    async initMap() {
      // Don't initialize map if we're in loading state or don't have coordinates
      if (this.loading || !this.request.coordinates) {
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

        const { lat, lng } = this.request.coordinates;

        // Use the map service instead of direct Leaflet implementation
        const { map } = initializePropertyMap(
          "map",
          { lat, lng },
          this.request.title || "Property Request",
          this.locationText,
          "red"
        );

        this.mapInstance = map;
        this.mapLoaded = true;
      } catch (error) {
        console.error("Map initialization error:", error);
      } finally {
        this.mapLoading = false;
      }
    },

    // Method to get Custom Icon - No longer needed as it's handled by mapService
    getCustomIcon(color) {
      console.warn(
        "getCustomIcon is deprecated, use mapService.getCustomIcon instead"
      );
      return {};
    },

    // Add the missing generateCalendarFile method
    async generateCalendarFile(meetLink) {
      const startDate = new Date(this.meetingData.date);
      const endDate = new Date(
        startDate.getTime() + this.meetingData.duration * 60000
      );

      // Format date components for ICS
      const start = [
        startDate.getFullYear(),
        startDate.getMonth() + 1,
        startDate.getDate(),
        startDate.getHours(),
        startDate.getMinutes(),
      ];

      const event = {
        start,
        duration: { minutes: this.meetingData.duration },
        title: `Eskan Property Verification: ${
          this.request.title || "Property"
        }`,
        description: `Property verification meeting for ${
          this.request.title || "property"
        } located at ${
          this.locationText || "address"
        }.\n\nJoin the meeting: ${meetLink}`,
        location: meetLink,
        url: meetLink,
        status: "CONFIRMED",
        busyStatus: "BUSY",
        organizer: { name: "Eskan Admin", email: this.meetingData.adminEmail },
        attendees: [
          {
            name: this.request.propertyContact?.name || "Property Owner",
            email: this.request.propertyContact?.email,
            rsvp: true,
            partstat: "ACCEPTED",
            role: "REQ-PARTICIPANT",
          },
          {
            name: "Eskan Admin",
            email: this.meetingData.adminEmail,
            rsvp: true,
            partstat: "ACCEPTED",
            role: "CHAIR",
          },
        ],
        productId: "Eskan/Property/Verification",
      };

      return new Promise((resolve, reject) => {
        createEvent(event, (error, value) => {
          if (error) {
            reject(error);
          } else {
            resolve(value);
          }
        });
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
        date = new Date(timestamp * 1000);
      } else if (
        timestamp &&
        timestamp.seconds !== undefined &&
        timestamp.nanoseconds !== undefined
      ) {
        date = new Date(
          timestamp.seconds * 1000 + Math.floor(timestamp.nanoseconds / 1000000)
        );
      } else if (timestamp instanceof Date) {
        date = timestamp;
      } else if (typeof timestamp === "string") {
        date = new Date(timestamp);
      } else {
        return "Invalid Date";
      }

      return date.toLocaleDateString("en-GB", { dateStyle: "short" });
    },

    beforeDestroy() {
      // Cleanup map instance
      if (this.mapInstance) {
        this.mapInstance.remove();
        this.mapInstance = null;
      }
    },
    // Add this to your methods section in AdminRequestDetails.vue
    async updateRequestStatus(requestId, updateData) {
      try {
        // Call the existing updateRequest action from your Vuex store
        await this.$store.dispatch("requests/updateRequest", {
          uid: requestId, // Note: using uid parameter as expected by the action
          requestData: {
            // Note: using requestData parameter as expected by the action
            status: updateData.status,
            meetingDetails: updateData.meetingDetails,
          },
        });
        return true;
      } catch (error) {
        console.error("Error updating request status:", error);
        throw error;
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
    async handleDeleteRequest() {
      this.rejectionInfo = true;
    },
    handleRejectionComplete() {
      this.rejectionInfo = false;
    },
  },
};
</script>

<style scoped>
.transition {
  transition: all 0.3s ease;
}

/* Add a subtle hover effect to the property images */
.property-image:hover {
  transform: scale(1.02);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

/* Style the action buttons */
button {
  transition: all 0.2s ease;
}

button:hover {
  transform: translateY(-2px);
}

button:active {
  transform: translateY(0);
}

/* Add these new styles */
.fixed {
  z-index: 50;
}

#map {
  z-index: 1;
  position: relative;
}

/* Ensure modal appears above map */
.modal-overlay {
  z-index: 100;
}

/* Thumbnail gallery styles */
.thumbnail-gallery {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e0 #edf2f7;
  -ms-overflow-style: none;
}

.thumbnail-gallery::-webkit-scrollbar {
  height: 6px;
}

.thumbnail-gallery::-webkit-scrollbar-track {
  background: #edf2f7;
  border-radius: 10px;
}

.thumbnail-gallery::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 10px;
}

/* Add dark mode specific styles */
.dark input,
.dark textarea,
.dark select {
  color: white;
  background-color: #374151;
  border-color: #4b5563;
}

input,
textarea,
select {
  color: #111827;
}

.dark .leaflet-control-container .leaflet-control {
  background-color: #1f2937;
  color: white;
  border-color: #4b5563;
}

.dark .leaflet-control-container .leaflet-control a {
  color: white;
}
</style>
