<template>
  <div class="credit-card-wrapper p-4">
    <div
      class="credit-card bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-5 shadow-lg relative overflow-hidden"
    >
      <!-- Background decoration elements -->
      <div class="credit-card-decoration">
        <div class="credit-card-circle-1"></div>
        <div class="credit-card-circle-2"></div>
      </div>

      <!-- Card content -->
      <div class="flex justify-between items-center mb-8">
        <div class="text-xl font-bold text-white">VISA</div>
        <div class="h-8 w-12">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            class="text-white"
            stroke-width="1.5"
          >
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
            <line x1="1" y1="10" x2="23" y2="10"></line>
          </svg>
        </div>
      </div>

      <!-- Chip -->
      <div class="mb-6 flex">
        <div
          class="w-12 h-9 bg-gradient-to-br from-yellow-200 to-yellow-100 rounded-md mr-2 shadow-sm overflow-hidden relative"
        >
          <div class="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-px">
            <div class="bg-yellow-300 opacity-30"></div>
            <div class="bg-yellow-300 opacity-30"></div>
            <div class="bg-yellow-300 opacity-30"></div>
            <div class="bg-yellow-300 opacity-30"></div>
            <div class="bg-yellow-300 opacity-30"></div>
            <div class="bg-yellow-300 opacity-30"></div>
            <div class="bg-yellow-300 opacity-30"></div>
            <div class="bg-yellow-300 opacity-30"></div>
            <div class="bg-yellow-300 opacity-30"></div>
          </div>
        </div>
      </div>

      <!-- Card Number -->
      <div class="text-white text-lg font-mono mb-6 tracking-wider">
        4242 4242 **** ****
      </div>

      <!-- Card Details -->
      <div class="flex justify-between">
        <div>
          <p class="text-white text-opacity-70 text-xs mb-1">CARD HOLDER</p>
          <p class="text-white text-sm font-medium">Eskan Admin</p>
        </div>
        <div>
          <p class="text-white text-opacity-70 text-xs mb-1">BALANCE</p>
          <p class="text-white text-sm font-semibold">
            {{ formattedAmountEGP }}
          </p>
        </div>
        <div>
          <p class="text-white text-opacity-70 text-xs mb-1">EXPIRES</p>
          <p class="text-white text-sm font-medium">12/28</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from "@/config/firebase";
import { collection, getDocs } from "firebase/firestore";

export default {
  data() {
    return {
      totalAmount: 0,
      exchangeRateEGP: 30.0,
      loading: false,
    };
  },
  async created() {
    await this.calculateTotalAmount();
  },
  methods: {
    async calculateTotalAmount() {
      this.loading = true;
      try {
        const querySnapshot = await getDocs(collection(db, "payments"));
        let total = 0;

        querySnapshot.forEach((doc) => {
          const paymentData = doc.data();
          if (paymentData.amount) {
            total += paymentData.amount;
          }
        });

        this.totalAmount = total;
        return this.totalAmount;
      } catch (error) {
        console.error("Error fetching payments:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
  computed: {
    formattedAmountEGP() {
      const amount = localStorage.getItem("totalAmount");
      if (amount < 1000) return `EGP ${amount.toFixed(2)}`;
      if (amount < 1000000) return `EGP ${(amount / 1000).toFixed(2)}K`;
      return `EGP ${(amount / 1000000).toFixed(2)}M`;
    },
  },
};
</script>

<style scoped>
.credit-card {
  transition: all 0.3s ease;
  transform-style: preserve-3d;
}

.credit-card:hover {
  transform: translateY(-5px) rotateX(5deg);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.credit-card-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  z-index: 0;
}

.credit-card-circle-1 {
  position: absolute;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  top: -50px;
  right: -20px;
}

.credit-card-circle-2 {
  position: absolute;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  bottom: -100px;
  left: -50px;
}

.credit-card > * {
  position: relative;
  z-index: 1;
}
</style>
