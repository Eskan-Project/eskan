<template>
  <div class="p-5 h-full">
    <div
      class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4"
    >
      <h3
        class="text-xl font-semibold text-gray-800 dark:text-white flex items-center"
      >
        <span class="inline-block w-1.5 h-6 bg-indigo-500 mr-3 rounded"></span>
        Transactions Overview
      </h3>

      <div class="flex items-center gap-3 flex-wrap">
        <div class="flex space-x-2">
          <button
            v-for="period in periods"
            :key="period"
            @click="selectedPeriod = period"
            :class="[
              'px-4 py-2 text-sm rounded-md transition-all duration-200',
              selectedPeriod === period
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white text-gray-600 dark:bg-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700',
            ]"
          >
            {{ period }}
          </button>
        </div>
        <button
          @click="exportToCSV"
          class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title="Export to CSV"
        >
          <svg
            class="w-5 h-5 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="h-[340px] flex items-center justify-center">
      <div class="flex flex-col items-center gap-4">
        <div class="relative">
          <svg
            class="animate-spin h-12 w-12 text-indigo-500"
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
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="w-4 h-4 bg-indigo-200 rounded-full animate-pulse"></div>
          </div>
        </div>
        <p class="text-sm text-gray-600 dark:text-gray-300">
          Loading transaction data...
        </p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="h-[340px] flex items-center justify-center">
      <div
        class="bg-red-50 dark:bg-red-900/20 rounded-xl p-6 text-center max-w-md shadow-lg"
      >
        <svg
          class="h-12 w-12 mx-auto text-red-500 mb-4"
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
        <p class="text-red-600 dark:text-red-400 mb-4 font-medium">
          {{ error }}
        </p>
        <button
          @click="retryFetch"
          class="bg-red-500 text-white px-5 py-2 rounded-lg text-sm hover:bg-red-600 transition-colors shadow-md"
        >
          Retry Now
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="filteredTransactions.length === 0"
      class="h-[340px] flex items-center justify-center"
    >
      <div class="text-center max-w-md">
        <div
          class="rounded-full bg-gray-100 dark:bg-gray-800 p-5 mx-auto w-24 h-24 flex items-center justify-center mb-5 shadow-sm"
        >
          <svg
            class="h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <p class="text-gray-700 dark:text-gray-300 text-xl font-medium mb-3">
          No transactions found
        </p>
        <p class="text-gray-500 dark:text-gray-400 text-sm">
          Try adjusting the period or check your data source.
        </p>
      </div>
    </div>

    <!-- Chart and Stats -->
    <div v-else class="chart-wrapper">
      <div
        class="stats-summary grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6"
      >
        <div
          v-for="(stat, index) in stats"
          :key="index"
          class="stat-card group relative bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200"
        >
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">
            {{ stat.label }}
          </p>
          <p class="text-2xl font-semibold" :class="stat.color">
            {{ stat.value }}
          </p>
          <div
            class="absolute invisible group-hover:visible top-full mt-2 bg-gray-800 text-white text-xs rounded py-1 px-2 z-10"
          >
            {{ stat.tooltip }}
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
        <div class="flex justify-end items-center mb-3">
          <select
            v-model="chartType"
            class="text-sm bg-gray-100 dark:bg-gray-700 rounded-md px-3 py-1 border-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="bar">Bar Chart</option>
            <option value="line">Line Chart</option>
          </select>
        </div>
        <div id="chart-container" class="w-full h-[240px]">
          <canvas ref="chartCanvas" class="w-full h-full"></canvas>
        </div>
      </div>
      <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
        Last updated: {{ lastUpdated }}
      </p>
    </div>
  </div>
</template>

<script>
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "@/config/firebase";
import Chart from "chart.js/auto";
import { nextTick } from "vue";

async function getTransactions() {
  try {
    const transactions = [];
    const querySnapshot = await getDocs(collection(db, "payments"));
    querySnapshot.forEach((doc) => {
      transactions.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    return transactions.length > 0 ? transactions : generateSampleData();
  } catch (err) {
    throw err;
  }
}

function generateSampleData() {
  const sample = [];
  const now = new Date();
  for (let i = 30; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);
    sample.push({
      id: `sample-${i}`,
      amount: Math.min(Math.floor(Math.random() * 1000) + 50, 1000), // Cap at $1,000
      timestamp: { seconds: Math.floor(date.getTime() / 1000) },
    });
  }
  console.log("Generated sample data:", sample);
  return sample;
}

export default {
  data() {
    return {
      transactions: [],
      filteredTransactions: [],
      loading: false,
      error: null,
      chart: null,
      chartType: "bar",
      selectedPeriod: "Weekly",
      periods: ["Weekly", "Monthly", "Yearly"],
      lastUpdated: null,
      unsubscribe: null,
      retryCount: 0,
      maxRetries: 3,
      renderTimeout: null,
      isRendering: false,
    };
  },
  computed: {
    stats() {
      return [
        {
          label: "Total Transactions",
          value: this.filteredTransactions.length,
          color: "text-indigo-600 dark:text-indigo-400",
          tooltip: "Number of transactions processed",
        },
        {
          label: "Total Amount",
          value: this.formatAmount(this.getTotalAmount()),
          color: "text-green-600 dark:text-green-400",
          tooltip: "Sum of all transaction amounts",
        },
        {
          label: "Avg Transaction",
          value: this.formatAmount(this.getAvgAmount()),
          color: "text-purple-600 dark:text-purple-400",
          tooltip: "Average amount per transaction",
        },
      ];
    },
    chartData() {
      if (!this.filteredTransactions.length) return null;

      const periodData = {};
      this.filteredTransactions.forEach((transaction) => {
        if (!transaction.timestamp?.seconds) {
          console.warn(
            `Skipping transaction ${transaction.id} due to missing timestamp`
          );
          return;
        }

        let dateFormat;
        switch (this.selectedPeriod) {
          case "Yearly":
            dateFormat = { year: "numeric" };
            break;
          case "Monthly":
            dateFormat = { month: "short", year: "numeric" };
            break;
          default:
            dateFormat = { month: "short", day: "numeric" };
        }

        const date = new Date(
          transaction.timestamp.seconds * 1000
        ).toLocaleDateString("en-US", dateFormat);
        const amount = Number(transaction.amount) || 0;
        if (isNaN(amount)) {
          console.warn(
            `Invalid amount in transaction ${transaction.id}: ${transaction.amount}`
          );
        }
        periodData[date] = (periodData[date] || 0) + amount;
      });

      const chartData = {
        labels: Object.keys(periodData),
        datasets: [
          {
            label: "Transaction Amounts",
            data: Object.values(periodData),
            backgroundColor:
              this.chartType === "bar"
                ? "rgba(79, 70, 229, 0.6)"
                : "rgba(79, 70, 229, 0.2)",
            borderColor: "rgba(79, 70, 229, 1)",
            borderWidth: 2,
            tension: this.chartType === "line" ? 0.3 : 0,
            pointRadius: this.chartType === "line" ? 4 : 0,
            pointBackgroundColor:
              this.chartType === "line" ? "rgba(79, 70, 229, 1)" : undefined,
            borderRadius: this.chartType === "bar" ? 6 : 0,
            fill: this.chartType === "line" ? true : false,
          },
        ],
      };
      console.log("Chart data:", chartData); // Debug chart data
      return chartData;
    },
  },
  mounted() {
    this.setupRealtimeListener();
    window.addEventListener("resize", this.handleResize);
  },
  beforeUnmount() {
    this.cleanupChart();
    if (this.unsubscribe) this.unsubscribe();
    if (this.renderTimeout) clearTimeout(this.renderTimeout);
    window.removeEventListener("resize", this.handleResize);
  },
  methods: {
    async fetchTransactions() {
      try {
        const cached = localStorage.getItem("transactionsCache");
        if (cached) {
          this.transactions = JSON.parse(cached);
          console.log("Cached transactions:", this.transactions);
        }

        const data = await getTransactions();
        const normalizedData = data.map((t) => ({
          ...t,
          amount:
            typeof t.amount === "string"
              ? Number.parseFloat(t.amount.replace(/,/g, ""))
              : Number(t.amount),
        }));
        console.log("Normalized transactions:", normalizedData);
        this.transactions = normalizedData;
        this.filteredTransactions = [...normalizedData];
        localStorage.setItem(
          "transactionsCache",
          JSON.stringify(normalizedData)
        );
        this.lastUpdated = new Date().toLocaleTimeString();
        this.retryCount = 0;
        this.error = null;
      } catch (err) {
        throw err;
      }
    },
    setupRealtimeListener() {
      this.loading = true;
      this.unsubscribe = onSnapshot(
        collection(db, "payments"),
        async () => {
          try {
            await this.fetchTransactions();
            await nextTick();
            await this.renderChart();
          } catch (err) {
            this.handleError(err);
          } finally {
            this.loading = false;
          }
        },
        (err) => this.handleError(err)
      );
    },
    async retryFetch() {
      if (this.retryCount >= this.maxRetries) {
        this.error =
          "Unable to connect after several attempts. Please check your network or try again later.";
        return;
      }

      this.loading = true;
      const delay = Math.pow(2, this.retryCount) * 1000;
      await new Promise((resolve) => setTimeout(resolve, delay));
      this.retryCount++;
      await this.fetchTransactions();
      this.loading = false;
    },
    async refreshData() {
      this.loading = true;
      await this.fetchTransactions();
      await this.renderChart();
      this.loading = false;
    },
    handleError(err) {
      this.error =
        err.code === "permission-denied"
          ? "You don't have permission to access this data. Contact your administrator."
          : err.message || "Failed to load transactions. Please try again.";
      this.retryFetch();
    },
    handleResize() {
      if (this.chart) {
        this.chart.resize();
      }
    },
    cleanupChart() {
      if (this.chart) {
        this.chart.destroy();
        this.chart = null;
      }
      this.isRendering = false;
    },
    async renderChart() {
      if (this.isRendering || !this.chartData) return;

      if (this.renderTimeout) {
        clearTimeout(this.renderTimeout);
      }

      this.isRendering = true;

      try {
        await nextTick();

        const canvas = this.$refs.chartCanvas;
        if (!canvas || !canvas.getContext) {
          console.warn("Canvas not available, scheduling retry");
          this.scheduleRenderRetry();
          return;
        }

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          console.warn("Canvas context not available, scheduling retry");
          this.scheduleRenderRetry();
          return;
        }

        const container = document.getElementById("chart-container");
        if (!container || container.offsetParent === null) {
          console.warn("Chart container not visible, scheduling retry");
          this.scheduleRenderRetry();
          return;
        }

        this.cleanupChart();
        await new Promise((resolve) => setTimeout(resolve, 50));

        this.chart = new Chart(ctx, {
          type: this.chartType,
          data: this.chartData,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
              duration: 1000,
              easing: "easeOutQuart",
            },
            scales: {
              y: {
                beginAtZero: true,
                grid: { color: "rgba(0, 0, 0, 0.05)" },
                title: { display: true, text: "Amount (USD)" },
                ticks: {
                  callback: (value) => `$${value.toLocaleString()}`,
                },
              },
              x: {
                grid: { display: false },
                title: { display: true, text: this.selectedPeriod },
              },
            },
            plugins: {
              legend: { display: false },
              tooltip: {
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                padding: 12,
                cornerRadius: 8,
                callbacks: {
                  label: (context) => `$${context.raw.toLocaleString()}`,
                },
              },
            },
          },
        });
      } catch (error) {
        console.error("Chart rendering error:", error);
        this.scheduleRenderRetry();
      } finally {
        this.isRendering = false;
      }
    },
    scheduleRenderRetry() {
      this.cleanupChart();
      this.renderTimeout = setTimeout(() => {
        this.renderChart();
      }, 200);
    },
    getTotalAmount() {
      const total = this.filteredTransactions.reduce((sum, t) => {
        const amount = Number(t.amount) || 0;
        if (isNaN(amount)) {
          console.warn(
            `Invalid amount found in transaction ${t.id}: ${t.amount}`
          );
        }
        return sum + amount;
      }, 0);
      console.log("Calculated Total Amount:", total);
      return total;
    },
    getAvgAmount() {
      const total = this.getTotalAmount();
      const avg = this.filteredTransactions.length
        ? total / this.filteredTransactions.length
        : 0;
      console.log("Calculated Avg Amount:", avg);
      return avg;
    },
    formatAmount(amount) {
      if (isNaN(amount) || amount === Infinity) return "$0";
      if (amount > Number.MAX_SAFE_INTEGER) {
        console.warn("Amount exceeds safe integer limit:", amount);
        return (
          "$" + amount.toLocaleString("en-US", { maximumFractionDigits: 0 })
        );
      }
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(amount);
    },
    exportToCSV() {
      const headers = ["ID", "Amount", "Date"];
      const rows = this.filteredTransactions.map((t) => [
        t.id,
        this.formatAmount(t.amount),
        t.timestamp
          ? new Date(t.timestamp.seconds * 1000).toISOString()
          : "N/A",
      ]);
      const csvContent = [
        headers.join(","),
        ...rows.map((row) => row.join(",")),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `transactions_${this.selectedPeriod.toLowerCase()}_${
        new Date().toISOString().split("T")[0]
      }.csv`;
      link.click();
    },
  },
  watch: {
    chartData: {
      handler() {
        if (this.renderTimeout) clearTimeout(this.renderTimeout);
        this.renderTimeout = setTimeout(() => {
          this.renderChart();
        }, 100);
      },
      deep: true,
    },
    chartType() {
      if (this.renderTimeout) clearTimeout(this.renderTimeout);
      this.renderTimeout = setTimeout(() => {
        this.renderChart();
      }, 50);
    },
    selectedPeriod() {
      if (this.renderTimeout) clearTimeout(this.renderTimeout);
      this.renderTimeout = setTimeout(() => {
        this.renderChart();
      }, 100);
    },
  },
};
</script>

<style scoped>
.chart-wrapper {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.stat-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-3px);
}

@media (max-width: 640px) {
  .stats-summary {
    grid-template-columns: 1fr;
  }
}
</style>
