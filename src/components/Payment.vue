<template>
  <div
    class="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#f1f5ff] via-indigo-300 to-purple-400 px-4 py-6"
  >
    <div
      class="grid grid-cols-1 md:grid-cols-2 bg-white shadow-2xl rounded-3xl overflow-hidden max-w-5xl w-full"
    >
      <div
        v-if="property"
        class="p-8 flex flex-col bg-[#364365] text-white w-full"
      >
        <h2 class="text-4xl font-extrabold mb-6 text-center">
          🏡 Property Details
        </h2>

        <div class="flex justify-center mb-6">
          <img
            :src="property.images[0]"
            alt="Property"
            class="w-3/4 h-52 border border-gray-300 object-cover rounded-2xl shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl"
          />
        </div>

        <div class="text-lg space-y-2 text-center">
          <p class="capitalize">
            <strong class="mr-3">📌 Title:</strong>
            {{ property.title || "No Tittle" }}
          </p>
          <p>
            <strong class="mr-3">💰 Price:</strong>
            {{ property.price || "No Price" }} EGP
          </p>
          <p>
            <strong class="mr-3">📏 Area:</strong>
            {{ property.area || "No Area" }} m²
          </p>
          <p>
            <strong class="mr-3">📍 City:</strong>
            {{ cityName || "No City" }}
          </p>
        </div>
      </div>

      <div class="p-8 flex flex-col justify-center">
        <div
          v-if="success"
          class="bg-gradient-to-br from-green-400 to-green-600 text-white p-10 text-center animate-fade-in rounded-xl"
        >
          <h2 class="text-5xl font-bold mb-4">🎉 Payment Successful!</h2>
          <p class="text-lg">
            Thank you for your payment. Enjoy exclusive access!
          </p>
          <div v-if="redirecting" class="flex justify-center mt-6">
            <svg
              class="animate-spin h-10 w-10 text-white"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 0116 0h-4a4 4 0 00-8 0H4z"
              ></path>
            </svg>
          </div>
        </div>

        <div v-else>
          <h2 class="text-4xl font-extrabold text-gray-900 mb-4 text-center">
            Confirm Payment
          </h2>
          <h4></h4>
          <p class="text-lg text-gray-700 mb-6 text-center">
            A <span class="text-indigo-600 font-bold">$50</span> fee will be
            charged to view the owner's contact details.
          </p>

          <div class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Payment Method</label
              >
              <div
                id="card-element"
                class="p-4 border rounded-xl bg-gray-50 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 transition-all"
              ></div>
            </div>

            <button
              @click="processPayment"
              :disabled="!isValidCard"
              class="cursor-pointer w-full py-3 px-6 text-white font-semibold rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            >
              <svg
                v-if="loading"
                class="animate-spin h-5 w-5 text-white"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 0116 0h-4a4 4 0 00-8 0H4z"
                ></path>
              </svg>
              {{ loading ? "Processing..." : "Pay $50 Now" }}
            </button>

            <p
              v-if="message"
              :class="error ? 'text-red-600' : 'text-green-600'"
              class="text-center text-sm"
            >
              {{ message }}
            </p>
          </div>
          <div
            class="mt-4 text-center text-xs text-gray-500 flex items-center justify-center gap-2"
          >
            <svg
              class="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 11c0-1.1.9-2 2-2s2 .9 2 2-2 5-2 5m-8-5c0-1.1.9-2 2-2s2 .9 2 2-2 5-2 5m4-10c0 2.2 1.8 4 4 4s4-1.8 4-4-1.8-4-4-4-4 1.8-4 4z"
              />
            </svg>
            Secure payment powered by Stripe
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import cities from "@/assets/data/cities.json";

export default {
  data() {
    return {
      stripe: null,
      card: false,
      message: "",
      success: false,
      error: false,
      redirecting: false,
      property: JSON.parse(localStorage.getItem("property")),
      isValidCard: false,
    };
  },
  computed: {
    cityName() {
      return cities.find((city) => city.id === this.property.city)
        ?.city_name_en;
    },
  },
  async mounted() {
    console.log(this.property);
    const { loadStripe } = await import("@stripe/stripe-js");
    const urlParams = new URLSearchParams(window.location.search);
    this.propertyId = urlParams.get("propertyId");

    this.stripe = await loadStripe(
      "pk_test_51Qz4y8FtCSCr88l3ZSWOi0AJ66ihq5nPNab2SHJBTyi60oyWPxfIbFS5EEPjpCsIyn6Q3zOKFi2DoDjchngDSuRU00pvUfcZuQ"
    );
    this.$nextTick(() => {
      const elements = this.stripe.elements();
      this.card = elements.create("card", {
        style: {
          base: {
            fontSize: "18px",
            color: "#333",
            "::placeholder": { color: "#888" },
          },
        },
      });
      this.card.mount("#card-element");
      this.card.on("change", (event) => {
        this.isValidCard = event.complete;
        if (event.error) {
          this.error = true;
          this.message = event.error.message;
        } else {
          this.error = false;
          this.message = "";
        }
      });
    });
  },
  beforeUnmount() {
    localStorage.removeItem("property");
  },
  methods: {
    ...mapActions("property", ["handlePayment"]),
    async processPayment() {
      try {
        const paymentId = await this.handlePayment(this.property.id);
        console.log(paymentId);
        if (paymentId) {
          this.success = true;

          this.redirecting = true;
          setTimeout(() => {
            this.redirecting = false;
            this.$router.push(`/property/${this.property.id}`);
          }, 3000);
        }
      } catch (error) {
        this.message = error.message;
        this.error = true;
      }
    },
  },
};
</script>
