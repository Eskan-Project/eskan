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
              <p class="mt-4 text-gray-600">Loading Request details...</p>
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
                {{ request.title || "Untitled request" }}
              </h1>
              <p class="text-lg text-gray-600 flex items-center capitalize">
                <i class="bi bi-geo-alt mr-2 text-gray-500"></i>
                {{ locationText }}
              </p>
            </div>
            <p class="text-2xl font-semibold text-blue-700 whitespace-nowrap">
              Property Price :{{ request.price }} EGP
            </p>
          </div>
          <div v-if="request" class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- request Gallery Section -->
            <div class="col-span-2 relative">
              <div class="relative w-full h-96">
                <img
                  v-if="request && request.images && request.images.length > 0"
                  :src="request.images[currentImageIndex]"
                  alt="request Image"
                  loading="lazy"
                  class="w-full h-96 object-cover rounded-lg"
                  @load="imageLoaded = true"
                  v-show="imageLoaded"
                />
                <div
                  v-if="request.images.length == 0"
                  class="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center"
                >
                  <span class="text-gray-500">No image</span>
                </div>
                <div
                  v-if="!imageLoaded && request.images != 0"
                  class="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center"
                >
                  <span class="text-gray-500">Loading image...</span>
                </div>

                <!-- Gallery Navigation Buttons -->
                <button
                  v-if="request && request.images && request.images.length > 1"
                  @click="prevImage"
                  class="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white text-gray-700 w-10 h-10 flex items-center justify-center rounded-full shadow-md hover:bg-gray-200 active:scale-90 transition"
                >
                  ❮
                </button>

                <button
                  v-if="request && request.images && request.images.length > 1"
                  @click="nextImage"
                  class="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white text-gray-700 w-10 h-10 flex items-center justify-center rounded-full shadow-md hover:bg-gray-200 active:scale-90 transition"
                >
                  ❯
                </button>
              </div>

              <!-- Thumbnail Gallery -->
              <div
                v-if="request && request.images && request.images.length > 0"
                class="grid grid-cols-4 gap-2 mt-4"
              >
                <img
                  v-for="(img, index) in request.images"
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
                      request.propertyContact.name
                    }}</span>
                  </p>
                  <p class="flex flex-col items-center space-y-1">
                    <span class="font-semibold">Phone:</span>
                    <span class="text-sm">{{
                      request.propertyContact.phone
                    }}</span>
                  </p>
                  <p class="flex flex-col items-center space-y-1">
                    <span class="font-semibold">Email:</span>
                    <span class="text-sm">{{
                      request.propertyContact.email
                    }}</span>
                  </p>
                  <p class="flex flex-col items-center space-y-1">
                    <span class="font-semibold">Address:</span>
                    <span class="text-sm capitalize">{{
                      request.address
                    }}</span>
                  </p>

                  <router-link :to="`/admin/owners/edit/${request.ownerId}`">
                    <button
                      class="w-[100%] text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-bold rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
                    >
                      owner Profile
                    </button>
                  </router-link>
                </div>
              </div>
            </div>
          </div>

          <!-- Description Section -->
          <div class="mt-8 w-full bg-white shadow-lg rounded-lg p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-4 text-center">
              Property Description
            </h2>
            <div class="prose max-w-none text-gray-700">
              <p v-if="request.description" class="whitespace-pre-line">
                {{ request.description }}
              </p>
              <p v-else class="text-gray-500 italic text-center">
                No description available
              </p>
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
                  <p>{{ formatDate(request.createdAt) }}</p>
                  <p>{{ request.floor }}</p>
                  <p>{{ request.furnished ? "Yes" : "No" }}</p>
                  <p>{{ request.status }}</p>
                  <p>{{ request.propertyStatus }}</p>
                  <p>{{ request.rooms }}</p>
                  <p>{{ request.livingRooms }}</p>
                  <p>{{ request.bathrooms }}</p>
                  <p>{{ request.kitchens }}</p>
                  <p>{{ request.area }} m²</p>
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

        <div
          v-if="meetingInfo"
          class="mt-8 w-full bg-white shadow-lg rounded-lg p-6"
        >
          <h2 class="text-xl font-semibold text-gray-900 mb-6 text-center">
            Schedule Verification Meeting
          </h2>
          <form @submit.prevent="scheduleMeeting" class="space-y-4">
            <div class="flex flex-col space-y-2">
              <label class="text-gray-700 font-medium"
                >Meeting Date/Time:</label
              >
              <input
                type="datetime-local"
                v-model="meetingData.date"
                required
                class="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div class="flex flex-col space-y-2">
              <label class="text-gray-700 font-medium"
                >Duration (minutes):</label
              >
              <input
                type="number"
                v-model="meetingData.duration"
                required
                min="15"
                max="180"
                class="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div class="flex flex-col space-y-2">
              <label class="text-gray-700 font-medium">Owner Email:</label>
              <input
                type="email"
                v-model="request.propertyContact.email"
                required
                class="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              class="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Schedule Meeting
            </button>
          </form>
        </div>
        <div class="text-center py-4" v-if="!loading">
          <!-- Replace the existing Edit button -->

          <button
            @click="acceptRequest"
            type="button"
            class="w-[25%] text-green-700 hover:text-white border border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-bold rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-green-500 dark:text-green-500 dark:hover:text-white dark:hover:bg-green-500 dark:focus:ring-green-800"
          >
            Accept Request
          </button>
          <button
            @click="showMeetingForm"
            class="w-[25%] text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-bold rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
          >
            Setup Meeting
          </button>

          <button
            @click="handleDeleteRequest"
            type="button"
            class="w-[25%] text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-bold rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
          >
            Reject Request
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
import emailjs from "emailjs-com";
import { createEvent } from "ics";

// Initialize EmailJS
emailjs.init(import.meta.env.VITE_EMAILJS_USER_ID);

import governorates from "@/assets/data/governorates.json";
import cities from "@/assets/data/cities.json";

export default {
  data() {
    return {
      meetingData: {
        date: "",
        duration: 30,
        ownerEmail: "",
        adminEmail: "",
      },
      id: null,
      currentImageIndex: 0,
      userLocation: null,
      distance: null,
      duration: null,
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
      return `${governorateName || ""}-${cityName || ""}-${
        this.request?.neighborhood || ""
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
      this.error = "request ID is missing";
      this.loading = false;
      return;
    }
    this.loadData();
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
  created() {
    // Empty created hook
  },
  methods: {
    // Add this to your methods section

    ...mapActions("requests", ["getRequestById", "deleteRequest"]),
    ...mapActions("property", ["createPropertyFromRequest"]),
    ...mapActions("notifications", ["addNotification"]),

    // Replace the existing generateMeetLink method with this one
    generateMeetLink() {
      // Generate a unique meeting ID based on timestamp and random string
      const timestamp = new Date().getTime();
      const randomStr = Math.random().toString(36).substring(2, 8);

      // Create a meeting ID that's URL-friendly
      const meetingId = `eskan-meeting-${timestamp}-${randomStr}`;

      // Use Jitsi Meet which is an open-source video conferencing solution
      return `https://meet.jit.si/${meetingId}`;
    },

    // Update the scheduleMeeting method to fix the calendar issue
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
        if (this.request.propertyContact?.email) {
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
          owner_email: this.request.propertyContact?.email || "",
          admin_email: this.meetingData.adminEmail,
          property_address: this.locationText || "Property Location",
          calendar_details: calendarDetails,
        };

        console.log("Sending email with params:", templateParams);

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
            <p>Meeting details have been sent to ${this.meetingData.ownermail} and ${this.meetingData.adminEmail}</p>
         
          `,
          icon: "success",
          confirmButtonText: "OK",
        });

        // Reset form and hide it
        this.meetingData.date = "";
        this.meetingData.duration = 30;
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
      this.meetingInfo = true;
    },
    async acceptRequest() {
      try {
        const result = await Swal.fire(/* ... */);

        if (result.isConfirmed) {
          const requestData = { ...this.request };

          await this.createPropertyFromRequest(requestData);
          await this.deleteRequest(this.id);

          if (requestData.ownerId) {
            await this.sendAcceptanceNotification(
              requestData.ownerId,
              requestData.title
            );
          } else {
            console.warn(
              "Owner ID not found, cannot send acceptance notification to the owner."
            );
          }

          await Swal.fire(
            "Accepted!",
            "The request has been converted to a property listing.",
            "success"
          );

          this.$router.push("/admin/properties");
        }
      } catch (error) {
        console.error("Error accepting request:", error);
        Swal.fire(
          "Error",
          "Failed to accept the request. Please try again.",
          "error"
        );
      }
    },

    async sendAcceptanceNotification(ownerId, propertyTitle) {
      try {
        const notificationMessage = `"${propertyTitle}" is approved`;
        await this.$store.dispatch("notifications/addNotification", {
          type: "property_accepted",
          ownerId: ownerId,
          message: notificationMessage,
        });
        console.log(`Acceptance notification sent for owner ID: ${ownerId}`);
      } catch (error) {
        console.error("Error sending acceptance notification:", error);
      }
    },

    async sendAcceptanceNotification(ownerId, propertyTitle) {
      try {
        const notificationMessage = `"${propertyTitle} has been approved! Go to your profile to complete the payment. ✅`;
        await this.$store.dispatch("notifications/addNotification", {
          type: "property_accepted",
          ownerId: ownerId,
          message: notificationMessage,
        });
        console.log(`Acceptance notification sent for owner ID: ${ownerId}`);
      } catch (error) {
        console.error("Error sending acceptance notification:", error);
      }
    },
    async loadData() {
      this.loading = true;
      try {
        this.error = null;
        const result = await this.getRequestById(this.id);

        if (!result) {
          throw new Error("Request not found");
        }

        await this.$nextTick();
        if (!this.loading && this.request) {
          this.initMapWithFallback();
          console.log(this.request);
        }
      } catch (error) {
        this.error = "Failed to load Request. Please try again later.";
        console.error("Fetch Request error:", error);
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

      // Only try to initialize map if we have request data
      if (!this.request || !this.request.governorate) {
        this.mapLoading = false;
        return;
      }

      try {
        // Try to get coordinates from request data
        if (this.request.coordinates) {
          // Initialize map with coordinates
          this.initMap();
        } else {
          // Fallback to geocoding the location
          console.log("No coordinates found, using location text");
        }
      } catch (error) {
        console.error("Map initialization error:", error);
      } finally {
        this.mapLoading = false;
      }
    },

    // Use watch to handle route changes

    initMap() {
      const { lat, lng } = this.request.coordinates;
      console.log(lat, lng);
      const map = L.map("map", { scrollWheelZoom: false }).setView(
        [lat, lng],
        13
      );
      console.log(map);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map);

      L.marker([lat, lng], { icon: this.getCustomIcon("red") })
        .addTo(map)
        .bindPopup(`<b>${this.request.title}</b><br>${this.request.location}`)
        .openPopup();

      this.getUserLocation(map, lat, lng);
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
      try {
        const result = await Swal.fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, reject it!",
        });

        if (result.isConfirmed) {
          await this.deleteRequest(this.id);
          await Swal.fire(
            "Rejected!",
            "The request has been rejected.",
            "success"
          );
          this.$router.push("/admin/requests");
        }
      } catch (error) {
        console.error("Error deleting request:", error);
        Swal.fire(
          "Error",
          "Failed to reject the request. Please try again.",
          "error"
        );
      }
    },
  },
};
</script>
