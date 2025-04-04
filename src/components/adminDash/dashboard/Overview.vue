<template>
  <div>
    <h1 class="text-2xl font-bold my-4 text-gray-700 ml-4 dark:text-white">
      Dashboard Overview
    </h1>

    <div class="flex flex-wrap">
      <div class="w-full sm:w-1/3 p-4">
        <AllUsers />
      </div>

      <div class="w-full sm:w-1/3 p-4">
        <AllOwners />
      </div>

      <div class="w-full sm:w-1/3 p-4">
        <AllProperties />
      </div>
    </div>

    <div class="flex flex-wrap">
      <div class="w-full sm:w-2/3 p-4 flex flex-col space-y-4">
        <TransactionOverview />
      </div>

      <div class="w-full sm:w-1/3 p-4 flex flex-col space-y-4">
        <AllTransactions />
        <CreditCard />
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
};
</script>
