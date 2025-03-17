<template>
  <div class="max-w-lg mx-auto my-auto p-6 bg-white rounded-lg">
    <p v-if="loading" class="text-center text-gray-600">Loading...</p>

    <template v-if="property">
      <div v-if="!isAuthenticated" class="text-center">
        <div
          class="flex justify-center mb-3 p-3 rounded-full bg-white w-16 h-16 mx-auto"
        >
          <svg
            class="w-10 h-10 text-[#124365] animate-bounce"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path
              d="M21 16.5V19a2 2 0 0 1-2 2c-8.28 0-15-6.72-15-15a2 2 0 0 1 2-2h2.5a1 1 0 0 1 1 1v3.18a1 1 0 0 1-.29.71L7.91 9.91A12.06 12.06 0 0 0 14.09 16.09l1.52-1.52a1 1 0 0 1 .71-.29H19a1 1 0 0 1 1Z"
            />
          </svg>
        </div>

        <p class="text-lg text-gray-700 mb-3">
          Please register to view the owner's contact details!
        </p>

        <button
          @click="redirectToRegister"
          class="cursor-pointer bg-gradient-to-r mt-4 from-[#124365] to-[#364365] text-white py-2 px-6 rounded-lg hover:scale-105 transition-transform"
        >
          📝 Register Now
        </button>
      </div>

      <div
        v-else-if="!paidProperties && freeViewsRemaining"
        class="text-center"
      >
        <div
          class="flex justify-center mb-3 p-3 rounded-full bg-white w-16 h-16 mx-auto"
        >
          <svg
            class="w-10 h-10 text-[#124365] animate-bounce"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path
              d="M21 16.5V19a2 2 0 0 1-2 2c-8.28 0-15-6.72-15-15a2 2 0 0 1 2-2h2.5a1 1 0 0 1 1 1v3.18a1 1 0 0 1-.29.71L7.91 9.91A12.06 12.06 0 0 0 14.09 16.09l1.52-1.52a1 1 0 0 1 .71-.29H19a1 1 0 0 1 1Z"
            />
          </svg>
        </div>

        <p class="text-lg text-gray-700 mb-3">
          Welcome! Would you like to view the owner's details? ({{
            freeViewsRemaining
          }}
          free views remaining)
        </p>

        <button
          @click="handleViewOwner"
          class="cursor-pointer bg-gradient-to-r mt-4 from-[#124365] to-[#364365] text-white py-2 px-6 rounded-lg hover:scale-105 transition-transform"
        >
          🔓 Click here to unlock information
        </button>
      </div>
      <div v-else class="text-gray-900 flex flex-col gap-10">
        <h2 class="text-xl font-semibold text-center mb-4">Owner Details</h2>
        <div class="flex flex-col items-center space-y-3">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="Profile Picture"
            class="w-24 h-24 rounded-full shadow-md border-2 border-gray-300"
          />
          <p class="flex flex-col items-center space-y-1">
            <span class="font-semibold">Name:</span>
            <span class="text-sm capitalize">{{
              property.propertyContact.name
            }}</span>
          </p>
          <p class="flex flex-col items-center space-y-1">
            <span class="font-semibold">Phone:</span>
            <span class="text-sm">{{ property.propertyContact.phone }}</span>
          </p>
          <p class="flex flex-col items-center space-y-1">
            <span class="font-semibold">Email:</span>
            <span class="text-sm">{{ property.propertyContact.email }}</span>
          </p>
          <p class="flex flex-col items-center space-y-1">
            <span class="font-semibold">Address:</span>
            <span class="text-sm capitalize">{{ property.address }}</span>
          </p>
        </div>
      </div>

      <div
        v-if="isAuthenticated && showPaymentPrompt"
        class="mt-4 p-4 bg-red-100 text-red-700 rounded-lg text-center"
      >
        <div class="flex items-center justify-center space-x-2">
          <svg
            class="w-6 h-6 text-red-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M12 3a9 9 0 100 18 9 9 0 000-18z"
            />
          </svg>
          <p>
            You have already viewed a property. To unlock this one, please
            proceed with the payment.
          </p>
        </div>
        <button
          @click="redirectToPayment"
          class="mt-3 bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition"
        >
          💳 Proceed to Payment
        </button>
      </div>
    </template>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  props: {
    property: {
      type: Object,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      loading: false,
      showPaymentPrompt: false,
      unLocked: false,
    };
  },
  computed: {
    ...mapState("auth", ["userDetails", "isAuth"]),
    isAuthenticated() {
      return this.isAuth;
    },
    paidProperties() {
      return this.userDetails?.paidProperties.includes(this.id);
    },
    freeViewsRemaining() {
      return this.userDetails?.freeViewsRemaining === 0;
    },
  },
  methods: {
    handleViewOwner() {
      this.showPaymentPrompt = true;
    },
    redirectToPayment() {
      localStorage.setItem("property", JSON.stringify(this.property));
      window.location.href = `/payment?propertyId=${this.id}`;
    },
    redirectToRegister() {
      window.location.href = "/register";
    },
  },
};
</script>
