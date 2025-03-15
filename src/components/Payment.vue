<template>
  <div class="flex items-center justify-center min-h-screen bg-[#f1f5ff] via-indigo-300 to-purple-400 px-4 py-6">
    <div class="grid grid-cols-1 md:grid-cols-2 bg-white shadow-2xl rounded-3xl overflow-hidden max-w-5xl w-full">
      <div v-if="propertyDetails" class="p-8 flex flex-col bg-[#364365] text-white w-full">
        <h2 class="text-4xl font-extrabold mb-6 text-center">🏡 Property Details</h2>

        <div class="flex justify-center mb-6">
          <img
            :src="propertyDetails.images[0]"
            alt="Property"
            class="w-3/4 h-52 border border-gray-300 object-cover rounded-2xl shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl"
          />
        </div>

        <div class="text-lg space-y-2 text-center">
          <p><strong>📌 Title:</strong> {{ propertyDetails.title || "No Tittle" }}</p>
          <p><strong>💰 Price:</strong> {{ propertyDetails.price || "No Price"}}</p>
          <p><strong>📏 Area:</strong> {{ propertyDetails.area || "No Area" }}</p>
          <p><strong>📍 City:</strong> {{ propertyDetails.city || "No City"}}</p>
        </div>
      </div>

      <div class="p-8 flex flex-col justify-center">
        <div v-if="success" class="bg-gradient-to-br from-green-400 to-green-600 text-white p-10 text-center animate-fade-in rounded-xl">
          <h2 class="text-5xl font-bold mb-4">🎉 Payment Successful!</h2>
          <p class="text-lg ">Thank you for your payment. Enjoy exclusive access!</p>
          <div v-if="redirecting" class="flex justify-center mt-6">
            <svg class="animate-spin h-10 w-10 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 0116 0h-4a4 4 0 00-8 0H4z"></path>
            </svg>
          </div>
        </div>

        <div v-else>
          <h2 class="text-4xl font-extrabold text-gray-900 mb-4 text-center"> Confirm Payment</h2>
          <h4></h4>
          <p class="text-lg text-gray-700 mb-6 text-center">
            A <span class="text-indigo-600 font-bold">$50</span> fee will be charged to view the owner's contact details.
          </p>

          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">Card Details</label>
            <div id="card-element" class="p-4 border rounded-xl bg-gray-50 shadow-sm"></div>
          </div>

          <button
            @click="handlePayment"
            :disabled="loading"
            class="w-full py-3 px-6 text-white font-semibold rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-purple-600 hover:to-blue-500 transition-all duration-300 flex items-center justify-center text-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            <svg v-if="loading" class="animate-spin h-6 w-6 mr-2 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 0116 0h-4a4 4 0 00-8 0H4z"></path>
            </svg>
            {{ loading ? "Processing..." : "Pay Now" }}
          </button>

          <p v-if="message" :class="success ? 'text-green-600' : 'text-red-600'" class="mt-4 text-center text-lg font-medium">
            {{ message }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { loadStripe } from "@stripe/stripe-js";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  doc,
  collection,
  runTransaction,
  arrayUnion,
  getDoc,
} from "firebase/firestore";

export default {
  data() {
    return {
      stripe: null,
      card: null,
      loading: false,
      message: "",
      success: false,
      propertyId: null,
      paymentAmount: 5000,
      propertyDetails: null,
      redirecting: false,
    };
  },
  async mounted() {
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
    });

    await this.fetchPropertyDetails();
  },
  methods: {
    async fetchPropertyDetails() {
      if (!this.propertyId) return;
      const db = getFirestore();
      const propertyRef = doc(db, "properties", this.propertyId);
      const docSnap = await getDoc(propertyRef);

      if (docSnap.exists()) {
        this.propertyDetails = { id: docSnap.id, ...docSnap.data() };
      } else {
        this.propertyDetails = null;
      }
    },
    async handlePayment() {
      this.loading = true;
      this.message = "";
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) {
          this.message = "User not authenticated.";
          this.success = false;
          this.loading = false;
          return;
        }

        const db = getFirestore();
        await runTransaction(db, async (transaction) => {
          const userRef = doc(db, `users/${user.uid}`);
          const paymentRef = doc(collection(db, "payments"));

          transaction.set(paymentRef, {
            userId: user.uid,
            propertyId: this.propertyId,
            amount: this.paymentAmount,
            timestamp: new Date(),
          });

          transaction.update(userRef, {
            paidProperties: arrayUnion(this.propertyId),
          });
        });

        const response = await fetch(
          "http://localhost:3001/create-payment-intent",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount: this.paymentAmount }),
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
        const result = await this.stripe.confirmCardPayment(
          data.clientSecret,
          {
            payment_method: paymentMethod.id,
          }
        );

        if (result.error) {
          throw new Error(result.error.message);
        } else {
          this.success = true;
          this.message = "✅ Payment successful!";
          
        
          this.redirecting = true; 
          setTimeout(() => {
            window.location.href = `/property/${this.propertyId}`;
          }, 2000); 
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










