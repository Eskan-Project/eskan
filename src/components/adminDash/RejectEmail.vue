<template>
  <div
    class="fixed inset-0 z-50 overflow-y-auto bg-black/50 dark:bg-black/70 flex items-center justify-center p-4"
  >
    <div
      class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-0 relative transform transition-all duration-300 ease-in-out"
    >
      <!-- Header with gradient background -->
      <div
        class="bg-gradient-to-r from-red-500 to-red-700 dark:from-red-600 dark:to-red-800 rounded-t-2xl p-5"
      >
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-bold text-white">Reject Property Request</h2>
          <button
            @click="$emit('close')"
            class="text-white/80 hover:text-white focus:outline-none transition-colors duration-200"
            aria-label="Close"
          >
            <i class="bi bi-x-lg text-lg"></i>
          </button>
        </div>
      </div>

      <!-- Form content -->
      <div class="p-6">
        <form @submit.prevent="handleRejection" class="space-y-5">
          <div class="flex flex-col space-y-2">
            <label
              class="text-gray-700 dark:text-gray-300 font-medium flex items-center"
            >
              <i class="bi bi-exclamation-circle mr-2 text-red-500"></i>
              Rejection Reason:
            </label>
            <textarea
              v-model="localRejectionData.reason"
              required
              rows="4"
              class="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 dark:bg-gray-700 dark:text-white text-sm"
              placeholder="Please provide a detailed reason for rejection..."
            ></textarea>
          </div>

          <div class="flex flex-col space-y-2">
            <label
              class="text-gray-700 dark:text-gray-300 font-medium flex items-center"
            >
              <i class="bi bi-envelope mr-2 text-red-500"></i>
              Owner Email:
            </label>
            <input
              type="email"
              v-model="localRejectionData.ownerEmail"
              required
              :placeholder="request.propertyContact?.email || 'Owner email'"
              class="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 dark:bg-gray-700 dark:text-white text-sm"
            />
          </div>

          <div class="flex gap-4 mt-8">
            <button
              type="button"
              @click="$emit('close')"
              class="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium py-3 px-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 text-sm flex items-center justify-center"
            >
              <i class="bi bi-x mr-2"></i>
              Cancel
            </button>
            <button
              type="submit"
              class="flex-1 bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white font-medium py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:ring-offset-2 transition-all duration-200 shadow-md hover:shadow-lg text-sm flex items-center justify-center"
            >
              <i class="bi bi-x-circle mr-2"></i>
              Reject Request
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import emailjs from "emailjs-com";
import Swal from "sweetalert2";
import { mapActions } from "vuex";
emailjs.init("aQTbmvnAXB72PTixL"); // Initialize EmailJS with your user ID
export default {
  name: "RejectEmail",
  props: {
    request: {
      type: Object,
      required: true,
    },
    locationText: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      localRejectionData: {
        reason: "",
        ownerEmail: this.request.propertyContact?.email || "",
      },
    };
  },
  methods: {
    ...mapActions("requests", ["deleteRequest"]),
    ...mapActions("notifications", ["addNotification"]),

    async handleRejection() {
      try {
        // Show loading indicator
        Swal.fire({
          title: "Sending rejection...",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        // Prepare email template parameters
        const templateParams = {
          to_name: this.request.propertyContact?.name || "Property Owner",
          property_title: this.request.title || "Property Request",
          rejection_reason: this.localRejectionData.reason,
          owner_email: this.localRejectionData.ownerEmail,
          property_address: this.locationText || "Property Location",
        };

        // Send email through EmailJS
        const serviceID = import.meta.env.VITE_EMAILJS_SERVICE_ID2;
        console.log(serviceID);
        await emailjs.send(
          "service_itsyzca",
          import.meta.env.VITE_EMAILJS_TEMPLATE_ID3,
          templateParams
        );

        // Delete the request and send notification
        await this.deleteRequest(this.request.id);

        if (this.request.ownerId) {
          await this.sendRejectionNotification(
            this.request.ownerId,
            this.request.title
          );
        }

        // Show success message
        await Swal.fire({
          title: "Request Rejected",
          text: "The owner has been notified of the rejection.",
          icon: "success",
          confirmButtonText: "OK",
        });

        // Emit success event
        this.$emit("rejection-complete");
        this.$emit("close");

        // Navigate back to requests
        this.$router.push("/admin/requests");
      } catch (error) {
        console.error("Error sending rejection:", error);
        Swal.fire({
          title: "Error",
          text: `Failed to send rejection: ${error.message}`,
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    },

    async sendRejectionNotification(ownerId, propertyTitle) {
      try {
        const notificationMessage = `"${propertyTitle}" has been rejected! Please Check your mail ❌`;
        await this.addNotification({
          type: "property_rejected",
          ownerId: ownerId,
          message: notificationMessage,
        });
      } catch (error) {
        console.error("Error sending rejection notification:", error);
      }
    },
  },
};
</script>
