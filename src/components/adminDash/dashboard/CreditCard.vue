<template>
  <div
    class="w-full mt-2 bg-white dark:bg-gray-800 shadow rounded-xl p-6 shadow-lg"
  >
    <div class="flex items-center mb-4">
      <div class="text-xl font-bold text-gray-700 dark:text-white">VISA</div>
    </div>

    <div class="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-4">
      <div>{{ formattedAmountEGP }}</div>
    </div>

    <div class="flex flex-col justify-between mb-3">
      <div class="text-sm text-gray-600 dark:text-gray-400">Credit Details</div>
      <div class="text-lg font-semibold text-gray-700 dark:text-white">
        42424 4242 **** ****
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
    };
  },
  async created() {
    await this.calculateTotalAmount();
  },
  methods: {
    async calculateTotalAmount() {
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
      } catch (error) {
        console.error("Error fetching payments:", error);
      }
    },
  },
  computed: {
    formattedAmountEGP() {
      const amount = this.totalAmount * this.exchangeRateEGP;
      if (amount < 1000) return `EGP ${amount.toFixed(2)}`;
      if (amount < 1_000_000) return `EGP ${(amount / 1000).toFixed(1)}K`;
      return `EGP ${(amount / 1_000_000).toFixed(1)}M`;
    },
  },
};
</script>
