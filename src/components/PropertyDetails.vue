<template>
  <div class="max-w-lg mx-auto my-auto p-6 bg-white rounded-lg h-[440px]">
    <p v-if="loading" class="text-center text-gray-600">
      {{ $t("propertyDetails.loading") }}
    </p>

    <template v-if="property">
      <!-- Case 1: Admin user -->
      <div
        v-if="isAuthenticated && userDetails?.role === 'admin'"
        class="text-gray-900 flex flex-col gap-10"
      >
        <h2 class="text-xl font-semibold text-center mb-4">
          {{ $t("propertyDetails.owner_details") }}
        </h2>
        <div class="flex flex-col items-center space-y-3">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="Profile Picture"
            class="w-24 h-24 rounded-full border-2 border-gray-300"
          />
          <p class="flex flex-col items-center space-y-1">
            <span class="font-semibold">{{ $t("propertyDetails.name") }}:</span>
            <span class="text-sm capitalize">{{
              property.propertyContact.name
            }}</span>
          </p>
          <p class="flex flex-col items-center space-y-1">
            <span class="font-semibold"
              >{{ $t("propertyDetails.phone") }}:</span
            >
            <span class="text-sm">{{ property.propertyContact.phone }}</span>
          </p>
          <p class="flex flex-col items-center space-y-1">
            <span class="font-semibold"
              >{{ $t("propertyDetails.email") }}:</span
            >
            <span class="text-sm">{{ property.propertyContact.email }}</span>
          </p>
          <p
            v-if="property.propertyContact.address"
            class="flex flex-col items-center space-y-1"
          >
            <span class="font-semibold"
              >{{ $t("propertyDetails.address") }}:</span
            >
            <span class="text-sm capitalize">{{
              property.propertyContact.address
            }}</span>
          </p>
        </div>
      </div>

      <!-- Case 2: User not authenticated -->
      <div v-else-if="!isAuthenticated" class="text-center">
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
          {{ $t("propertyDetails.register_prompt") }}
        </p>
        <button
          @click="redirectToRegister"
          class="cursor-pointer bg-gradient-to-r mt-4 from-[#124365] to-[#364365] text-white py-2 px-6 rounded-lg hover:scale-105 transition-transform"
        >
          📝 {{ $t("propertyDetails.register_button") }}
        </button>
      </div>

      <!-- Case 3: Authenticated user with free views available -->
      <div
        v-else-if="!paidProperties && userDetails?.freeViewsRemaining > 0"
        class="text-center"
      >
        <div
          class="flex justify-center mb-3 p-3 rounded-full bg-white w-16 h-16 mx-auto mt-10"
        >
          <svg
            class="w-10 h-10 text-[#124365] animate-bounce"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path
              d="M21 16.5V19a2 2 0 0 1-2 2c-8.28 0-15-6.72-15-15a2 2 0 0 1 2-2h2.5a1 1 0 0 0 1 1v3.18a1 1 0 0 1-.29.71L7.91 9.91A12.06 12.06 0 0 0 14.09 16.09l1.52-1.52a1 1 0 0 1 .71-.29H19a1 1 0 0 1 1Z"
            />
          </svg>
        </div>
        <p class="text-lg text-gray-700 mb-3">
          {{ $t("propertyDetails.unlock_prompt") }} <br />
          ({{ userDetails?.freeViewsRemaining }}
          {{ $t("propertyDetails.free_views_remaining") }})
        </p>
        <button
          @click="unlock"
          class="cursor-pointer bg-gradient-to-r mt-4 from-[#124365] to-[#364365] text-white py-2 px-6 rounded-lg hover:scale-105 transition-transform"
        >
          🔓 {{ $t("propertyDetails.unlock_button") }}
        </button>
      </div>

      <!-- Case 4: Showing owner details (only if paid or unlocked) -->
      <div
        v-else-if="paidProperties"
        class="text-gray-900 flex flex-col gap-10"
      >
        <h2 class="text-xl font-semibold text-center mb-4">
          {{ $t("propertyDetails.owner_details") }}
        </h2>
        <div class="flex flex-col items-center space-y-3">
          <img
            :src="
              property.propertyContact.image
                ? property.propertyContact.image
                : 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'
            "
            alt="Profile Picture"
            class="w-24 h-24 rounded-full border-2 border-gray-300"
          />
          <p class="flex flex-col items-center space-y-1">
            <span class="font-semibold">{{ $t("propertyDetails.name") }}:</span>
            <span class="text-sm capitalize">{{
              property.propertyContact.name
            }}</span>
          </p>
          <p class="flex flex-col items-center space-y-1">
            <span class="font-semibold"
              >{{ $t("propertyDetails.phone") }}:</span
            >
            <span class="text-sm">{{ property.propertyContact.phone }}</span>
          </p>
          <p class="flex flex-col items-center space-y-1">
            <span class="font-semibold"
              >{{ $t("propertyDetails.email") }}:</span
            >
            <span class="text-sm">{{ property.propertyContact.email }}</span>
          </p>
          <p class="flex flex-col items-center space-y-1">
            <span class="font-semibold"
              >{{ $t("propertyDetails.address") }}:</span
            >
            <span class="text-sm capitalize">{{ property.address }}</span>
          </p>
        </div>
      </div>

      <!-- Case 5: Payment prompt (when free views = 0 and not paid) -->
      <div
        v-else-if="
          isAuthenticated &&
          !paidProperties &&
          userDetails?.freeViewsRemaining === 0
        "
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
            {{ $t("propertyDetails.no_views_remaining") }}
          </p>
        </div>
        <button
          @click="redirectToPayment"
          class="cursor-pointer mt-3 bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition"
        >
          💳 {{ $t("propertyDetails.proceed_to_payment") }}
        </button>
      </div>
    </template>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

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
    };
  },
  computed: {
    ...mapState("auth", ["userDetails", "isAuth"]),
    isAuthenticated() {
      return this.isAuth;
    },
    paidProperties() {
      return this.userDetails?.paidProperties?.includes(this.id) || false;
    },
  },
  methods: {
    ...mapActions("auth", ["updateFreeViews", "addPaidProperty"]),
    redirectToPayment() {
      localStorage.setItem("property", JSON.stringify(this.property));
      window.location.href = `/payment?propertyId=${this.id}`;
    },
    redirectToRegister() {
      window.location.href = "/register";
    },
    async unlock() {
      try {
        this.loading = true;

        if (this.userDetails?.freeViewsRemaining > 0) {
          await this.updateFreeViews({
            uid: this.userDetails.uid,
            role: this.userDetails.role,
          });

          await this.addPaidProperty({
            uid: this.userDetails.uid,
            propertyId: this.id,
            role: this.userDetails.role,
          });
        }
      } catch (error) {
        console.error("Error unlocking property:", error);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
