<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100 px-2">
    <div
      v-if="success"
      class="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg text-center animate-fade-in"
    >
      <h2 class="text-3xl font-bold text-green-600">✅ Payment Successful!</h2>
      <p class="text-gray-600 mt-2">Thank you for your payment.</p>
    </div>
    <div
      v-else
      class="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg text-center animate-fade-in"
    >
      <h2 class="text-3xl font-bold text-gray-800">Your Post is Approved!</h2>
      <p class="text-gray-600 mt-2">
        Complete your payment to publish your post.
      </p>
      <div class="mt-6 space-y-4 animate-slide-up">
        <div class="flex flex-col text-left">
          <label class="text-gray-700 font-medium mb-1">Card Details</label>
          <div
            id="card-element"
            class="p-4 border rounded-xl bg-gray-50 shadow-sm"
          ></div>
        </div>
      </div>
      <button
        @click="handlePayment"
        :disabled="loading"
        class="w-full mt-6 py-3 px-6 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center animate-slide-up text-lg"
        :class="
          loading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-[#364365] hover:bg-[#394465] transform hover:scale-105'
        "
      >
        <span v-if="loading" class="animate-spin mr-2">🔄</span>
        {{ loading ? "Processing..." : "Pay Now" }}
      </button>

      <p
        v-if="message"
        :class="success ? 'text-green-600' : 'text-red-600'"
        class="mt-4 text-center text-lg"
      >
        {{ message }}
      </p>
    </div>
  </div>
</template>

<script>
import { loadStripe } from "@stripe/stripe-js";

export default {
  data() {
    return {
      stripe: null,
      card: null,
      loading: false,
      message: "",
      success: false,
    };
  },
  async mounted() {
    this.stripe = await loadStripe(
      "pk_test_51Qz4y8FtCSCr88l3ZSWOi0AJ66ihq5nPNab2SHJBTyi60oyWPxfIbFS5EEPjpCsIyn6Q3zOKFi2DoDjchngDSuRU00pvUfcZuQ"
    );
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
  },
  methods: {
    async handlePayment() {
      this.loading = true;
      this.message = "";
      try {
        const response = await fetch(
          "http://localhost:3001/create-payment-intent",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount: 5000 }),
          }
        );

        const data = await response.json();
        if (!response.ok)
          throw new Error(data.error || "Failed to create payment");
        const { paymentMethod, error } = await this.stripe.createPaymentMethod({
          type: "card",
          card: this.card,
        });

        if (error) throw new Error(error.message);
        const result = await this.stripe.confirmCardPayment(data.clientSecret, {
          payment_method: paymentMethod.id,
        });

        if (result.error) {
          throw new Error(result.error.message);
        } else {
          this.success = true;
          this.message = "✅ Payment successful!";
        }
      } catch (error) {
        this.success = false;
        this.message = `❌ Error: ${error.message}`;
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
