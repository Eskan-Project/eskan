<template>
  <div class="bg-gray-50 dark:bg-gray-900 min-h-screen p-4">
    <div class="flex justify-between items-center mb-6">
      <h1
        class="text-2xl font-bold text-gray-800 dark:text-white flex items-center"
      >
        <span class="inline-block w-2 h-6 bg-indigo-500 mr-3 rounded"></span>
        Dashboard Overview
        <span v-if="isRefreshing" class="ml-3">
          <div
            class="h-4 w-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"
          ></div>
        </span>
      </h1>

      <div class="flex items-center">
        <button
          @click="refreshDashboard"
          class="flex items-center text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1.5 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors"
          :disabled="isRefreshing"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            :class="{ 'animate-spin': isRefreshing }"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <span class="text-sm">Refresh</span>
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
      <div class="shadow-sm rounded-xl overflow-hidden">
        <AllUsers ref="usersComponent" />
      </div>

      <div class="shadow-sm rounded-xl overflow-hidden">
        <AllOwners ref="ownersComponent" />
      </div>

      <div class="shadow-sm rounded-xl overflow-hidden">
        <AllProperties ref="propertiesComponent" />
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div
        class="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
      >
        <TransactionOverview ref="transactionOverviewComponent" />
      </div>

      <div class="space-y-5">
        <div
          class="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
        >
          <AllTransactions ref="transactionsComponent" />
        </div>
        <div
          class="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
        >
          <CreditCard ref="creditCardComponent" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AllUsers from "./AllUsers.vue";
import AllOwners from "./AllOwners.vue";
import AllProperties from "./AllProperties.vue";
import TransactionOverview from "./TransactionOverview.vue";
import AllTransactions from "./AllTransactions.vue";
import CreditCard from "./CreditCard.vue";

export default {
  components: {
    AllUsers,
    AllOwners,
    AllProperties,
    TransactionOverview,
    AllTransactions,
    CreditCard,
  },
  data() {
    return {
      isRefreshing: false,
    };
  },
  methods: {
    async refreshDashboard() {
      if (this.isRefreshing) return;

      this.isRefreshing = true;

      try {
        const refreshPromises = [];

        // Refresh users data if component exists
        if (this.$refs.usersComponent?.refreshData) {
          refreshPromises.push(this.$refs.usersComponent.refreshData());
        }

        // Refresh owners data if component exists
        if (this.$refs.ownersComponent?.refreshData) {
          refreshPromises.push(this.$refs.ownersComponent.refreshData());
        }

        // Refresh properties data if component exists
        if (this.$refs.propertiesComponent?.refreshData) {
          refreshPromises.push(this.$refs.propertiesComponent.refreshData());
        }

        // Refresh transactions overview if component exists
        if (this.$refs.transactionOverviewComponent?.fetchTransactions) {
          refreshPromises.push(
            this.$refs.transactionOverviewComponent.fetchTransactions()
          );
        }

        // Refresh transactions list if component exists
        if (this.$refs.transactionsComponent?.fetchTransactions) {
          refreshPromises.push(
            this.$refs.transactionsComponent.fetchTransactions()
          );
        }

        // Refresh credit card data if component exists
        if (this.$refs.creditCardComponent?.calculateTotalAmount) {
          refreshPromises.push(
            this.$refs.creditCardComponent.calculateTotalAmount()
          );
        }

        await Promise.allSettled(refreshPromises);
      } catch (error) {
        console.error("Error refreshing dashboard:", error);
      } finally {
        this.isRefreshing = false;
      }
    },
  },
};
</script>

<style scoped>
.rounded-xl {
  border-radius: 0.75rem;
}
</style>
