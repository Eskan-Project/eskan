<template>
  <div class="p-5">
    <div class="flex justify-between items-center mb-5">
      <h3
        class="text-gray-800 dark:text-white text-lg font-semibold flex items-center"
      >
        <span class="inline-block w-1 h-5 bg-indigo-500 mr-2 rounded"></span>
        Recent Payments
      </h3>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="min-h-[200px] flex items-center justify-center">
      <div class="flex flex-col items-center">
        <svg
          class="animate-spin h-8 w-8 text-indigo-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
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
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <p class="mt-3 text-sm text-gray-500 dark:text-gray-400">
          Loading payments...
        </p>
      </div>
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="bg-red-50 dark:bg-red-900/10 rounded-lg p-4 text-center"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-10 w-10 mx-auto text-red-500 mb-2"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
      <p class="text-red-600 dark:text-red-400 mb-2">{{ error }}</p>
      <button
        @click="retryFetch"
        class="bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 px-3 py-1 rounded-md text-sm"
      >
        Try Again
      </button>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="payments.length === 0"
      class="min-h-[200px] flex items-center justify-center text-center"
    >
      <div>
        <div
          class="rounded-full bg-gray-100 dark:bg-gray-800 p-3 mx-auto w-16 h-16 flex items-center justify-center mb-3"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-8 w-8 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <p class="text-gray-600 dark:text-gray-400 mb-1">No payments found</p>
        <p class="text-gray-500 dark:text-gray-500 text-sm">
          Recent payments will appear here
        </p>
      </div>
    </div>

    <!-- Payment List -->
    <div
      v-else
      class="payment-list"
      style="max-height: 280px; overflow-y: auto"
    >
      <div
        v-for="payment in sortedPayments"
        :key="payment.id"
        class="payment-item mb-3 rounded-lg border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-3 hover:shadow-md transition-all duration-200 flex items-center justify-between"
      >
        <div class="flex items-center">
          <div class="relative mr-3">
            <img
              :src="payment.userPhoto || '/images/default-avatar.png'"
              alt="User Avatar"
              class="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100 dark:ring-gray-700"
              @error="handleImageError"
            />
            <span
              class="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white dark:border-gray-700"
            ></span>
          </div>

          <div>
            <p class="text-gray-800 dark:text-white text-sm font-medium">
              {{ payment.userName || "Unknown User" }}
            </p>
            <p
              class="text-gray-500 dark:text-gray-400 text-xs truncate max-w-[140px]"
            >
              {{ payment.userEmail || "No email" }}
            </p>
          </div>
        </div>

        <div class="flex flex-col items-end">
          <span
            :class="[
              'font-medium text-sm',
              payment.amount > 0
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-600 dark:text-red-400',
            ]"
          >
            {{ formatAmount(payment.amount) }}
          </span>
          <span class="text-gray-400 dark:text-gray-500 text-xs">
            {{ formatDate(payment.timestamp) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "@/config/firebase";

async function getPayments() {
  const payments = [];
  const querySnapshot = await getDocs(collection(db, "payments"));
  querySnapshot.forEach((doc) => {
    payments.push({
      id: doc.id,
      ...doc.data(),
    });
  });
  return payments;
}

export default {
  data() {
    return {
      payments: [],
      loading: true,
      error: null,
      unsubscribe: null,
    };
  },
  computed: {
    sortedPayments() {
      return this.payments
        .slice()
        .sort((a, b) => {
          const dateA = a.timestamp?.seconds ? a.timestamp.seconds * 1000 : 0;
          const dateB = b.timestamp?.seconds ? b.timestamp.seconds * 1000 : 0;
          return dateB - dateA; // Sort by newest first
        })
        .slice(0, 10); // Limit to 10 most recent
    },
  },
  mounted() {
    this.setupRealtimeListener();
  },
  beforeUnmount() {
    if (this.unsubscribe) this.unsubscribe();
  },
  methods: {
    formatAmount(amount) {
      if (isNaN(amount) || !Number.isFinite(amount)) return "EGP 0";
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "EGP",
        maximumFractionDigits: 0,
      }).format(Math.floor(amount));
    },
    formatDate(timestamp) {
      if (!timestamp?.seconds) return "N/A";
      const date = new Date(timestamp.seconds * 1000);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    },
    handleImageError(e) {
      e.target.src = "/images/default-avatar.png";
    },
    async fetchPayments() {
      this.loading = true;
      this.error = null;
      try {
        const payments = await getPayments();
        const enrichedPayments = await Promise.all(
          payments.map(async (payment) => {
            return {
              ...payment,
              userName: payment.userName || "Unknown User",
              userEmail: payment.userEmail || "No email",
              userPhoto: payment.userPhoto || null,
              amount: Number(payment.amount) || 0,
              // Use createdAt if it exists, otherwise fallback to current time
              timestamp: payment.createdAt ||
                payment.timestamp || { seconds: Date.now() / 1000 },
            };
          })
        );
        this.payments = enrichedPayments;
      } catch (err) {
        this.error = err.message || "Failed to fetch payments.";
        throw err;
      } finally {
        this.loading = false;
      }
    },
    setupRealtimeListener() {
      this.loading = true;
      this.unsubscribe = onSnapshot(
        collection(db, "payments"),
        async () => {
          try {
            await this.fetchPayments();
          } catch (err) {
            this.error = err.message || "Failed to load payments.";
          } finally {
            this.loading = false;
          }
        },
        (err) => {
          this.error = err.message || "Failed to load payments.";
          this.loading = false;
        }
      );
    },
    retryFetch() {
      this.fetchPayments();
    },
  },
};
</script>

<style scoped>
.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.payment-list {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.3) transparent;
}

.payment-list::-webkit-scrollbar {
  width: 4px;
}

.payment-list::-webkit-scrollbar-track {
  background: transparent;
}

.payment-list::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.3);
  border-radius: 4px;
}

.payment-item {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
