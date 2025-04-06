<template>
  <div
    class="fixed inset-0 z-50 overflow-y-auto backdrop-blur-md bg-white/30 dark:bg-gray-900/30 flex items-center justify-center p-4"
  >
    <div
      class="bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-xl shadow-xl max-w-md w-full p-6 relative"
    >
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
          Reject Property Request
        </h2>
        <button
          @click="$emit('close')"
          class="text-gray-500 hover:text-gray-700 focus:outline-none"
          aria-label="Close"
        >
          <i class="bi bi-x-lg"></i>
        </button>
      </div>

      <form @submit.prevent="handleRejection" class="space-y-4">
        <div class="flex flex-col space-y-2">
          <label class="text-gray-700 dark:text-gray-300 font-medium">
            Rejection Reason:
          </label>
          <textarea
            v-model="localRejectionData.reason"
            required
            rows="4"
            class="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            placeholder="Please provide a detailed reason for rejection..."
          ></textarea>
        </div>

        <div class="flex flex-col space-y-2">
          <label class="text-gray-700 dark:text-gray-300 font-medium">
            Owner Email:
          </label>
          <input
            type="email"
            v-model="localRejectionData.ownerEmail"
            required
            :placeholder="request.propertyContact?.email || 'Owner email'"
            class="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          />
        </div>

        <div class="flex gap-3 mt-6">
          <button
            type="button"
            @click="$emit('close')"
            class="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="flex-1 bg-red-600 dark:bg-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700 dark:hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:ring-offset-2 transition-colors"
          >
            Reject Request
          </button>
        </div>
      </form>
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
