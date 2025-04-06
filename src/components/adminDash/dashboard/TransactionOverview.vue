<template>
  <!-- Template remains unchanged -->
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
            :aria-label="`View ${period} transactions`"
          >
            {{ period }}
          </button>
        </div>
        <button
          @click="exportToCSV"
          class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title="Export to CSV"
          aria-label="Export transactions to CSV"
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
          Check your payments collection in Firestore.
        </p>
      </div>
    </div>

    <div v-else class="chart-wrapper">
      <div
        class="stats-summary grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6"
      >
        <div
          v-for="(stat, index) in stats"
          :key="index"
          class="stat-card group relative bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm dark:shadow-gray-700 hover:shadow-md transition-all duration-200"
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
            aria-label="Select chart type"
          >
            <option value="bar">Bar Chart</option>
            <option value="line">Line Chart</option>
          </select>
        </div>
        <div id="chart-container" class="w-full h-[350px]">
          <canvas
            ref="chartCanvas"
            class="w-full h-full"
            aria-label="Transactions chart"
          ></canvas>
        </div>
      </div>
      <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
        Last updated: {{ lastUpdated }}
      </p>
    </div>
  </div>
</template>

<script>
import {
  collection,
  getDocs,
  onSnapshot,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import Chart from "chart.js/auto";
import { nextTick } from "vue";

async function fetchPayments() {
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

// Optimized property details fetching with caching
const propertyCache = new Map();
async function getPropertyDetails(propertyId) {
  if (!propertyId) return null;

  // Return from cache if available
  if (propertyCache.has(propertyId)) {
    return propertyCache.get(propertyId);
  }

  try {
    const propertyRef = doc(db, "properties", propertyId);
    const propertySnap = await getDoc(propertyRef);

    if (propertySnap.exists()) {
      const data = propertySnap.data();
      // Store in cache
      propertyCache.set(propertyId, data);
      return data;
    }
    // Cache null results too to avoid repeat lookups for missing properties
    propertyCache.set(propertyId, null);
    return null;
  } catch (error) {
    console.error(`Error fetching property (${propertyId}):`, error);
    return null;
  }
}

// Optimized user details fetching with caching
const userCache = new Map();
async function getUserDetails(userId) {
  if (!userId) return null;

  // Return from cache if available
  if (userCache.has(userId)) {
    return userCache.get(userId);
  }

  try {
    // Try owner collection first
    const ownerRef = doc(db, "owners", userId);
    const ownerSnap = await getDoc(ownerRef);
    if (ownerSnap.exists()) {
      const data = ownerSnap.data();
      userCache.set(userId, data);
      return data;
    }

    // Try users collection next
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const data = userSnap.data();
      userCache.set(userId, data);
      return data;
    }

    // Try admins collection last
    const adminRef = doc(db, "admins", userId);
    const adminSnap = await getDoc(adminRef);
    if (adminSnap.exists()) {
      const data = adminSnap.data();
      userCache.set(userId, data);
      return data;
    }

    // Cache null results too
    userCache.set(userId, null);
    return null;
  } catch (error) {
    console.error(`Error fetching user (${userId}):`, error);
    return null;
  }
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
      renderPending: false,
      isRendering: false,
      totalAmount: 0,
      exportProgress: {
        isExporting: false,
        processed: 0,
        total: 0,
        status: "",
      },
      chartLock: false,
      themeObserver: null,
    };
  },
  computed: {
    stats() {
      return [
        {
          label: "Total Payments",
          value: this.filteredTransactions.length,
          color: "text-indigo-600 dark:text-indigo-400",
          tooltip: "Number of payments processed",
        },
        {
          label: "Total Amount",
          value: this.formatAmount(this.getTotalAmount()),
          color: "text-green-600 dark:text-green-400",
          tooltip: "Sum of all payment amounts",
        },
        {
          label: "Avg Payment",
          value: this.formatAmount(this.getAvgAmount()),
          color: "text-purple-600 dark:text-purple-400",
          tooltip: "Average amount per payment",
        },
      ];
    },
    chartData() {
      if (!this.filteredTransactions.length) return null;

      const dataPoints = this.filteredTransactions
        .filter(
          (p) =>
            p.timestamp?.seconds &&
            !isNaN(p.timestamp.seconds) &&
            Number.isFinite(Number(p.amount))
        )
        .map((payment) => ({
          x: new Date(payment.timestamp.seconds * 1000),
          y: Math.floor(Number(payment.amount)),
        }));

      if (!dataPoints.length) {
        console.warn("No valid payment data for chart");
        return null;
      }

      const periodData = {};
      if (this.selectedPeriod === "Weekly") {
        // Get the last 7 days
        const today = new Date();
        today.setHours(23, 59, 59, 999); // End of today
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - 6); // 7 days total
        startDate.setHours(0, 0, 0, 0); // Start of the day

        // Initialize periodData with the last 7 days
        for (let i = 0; i < 7; i++) {
          const date = new Date(startDate);
          date.setDate(startDate.getDate() + i);
          const dateKey = date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          });
          periodData[dateKey] = 0;
        }

        // Aggregate data by date
        dataPoints.forEach((point) => {
          const date = new Date(point.x);
          const dateKey = date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          });
          if (date >= startDate && date <= today) {
            periodData[dateKey] = (periodData[dateKey] || 0) + point.y;
          }
        });
      } else if (this.selectedPeriod === "Monthly") {
        dataPoints.forEach((point) => {
          const date = new Date(point.x);
          const dateKey = `${date.toLocaleString("en-US", {
            month: "short",
          })} ${date.getFullYear()}`;
          periodData[dateKey] = (periodData[dateKey] || 0) + point.y;
        });
      } else {
        // Yearly
        dataPoints.forEach((point) => {
          const date = new Date(point.x);
          const dateKey = date.getFullYear().toString();
          periodData[dateKey] = (periodData[dateKey] || 0) + point.y;
        });
      }

      const labels = Object.keys(periodData);
      const values = Object.values(periodData);
      const maxAmount = Math.max(...values);
      const stepSize = this.calculateOptimalStepSize(maxAmount);

      return {
        labels,
        datasets: [
          {
            label: "Payment Amounts",
            data: values,
            backgroundColor: this.createGradient,
            borderColor: "rgba(79, 70, 229, 1)",
            borderWidth: 3,
            tension: 0.4,
            pointRadius: this.chartType === "line" ? 5 : 0,
            pointHoverRadius: this.chartType === "line" ? 8 : 0,
            pointBackgroundColor: "rgba(79, 70, 229, 1)",
            pointBorderColor: "#fff",
            pointBorderWidth: this.chartType === "line" ? 2 : 0,
            pointStyle: "circle",
            borderRadius: this.chartType === "bar" ? 6 : 0,
            fill: this.chartType === "line",
          },
        ],
        stepSize,
      };
    },
  },
  mounted() {
    this.setupRealtimeListener();
    window.addEventListener("resize", this.handleResize);

    // Add theme change detection
    this.themeObserver = new MutationObserver(() => {
      if (this.chart) {
        this.rerenderChart();
      }
    });

    // Observe the html element for class changes (dark mode toggle)
    this.themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
  },
  beforeUnmount() {
    this.cleanupChart();
    if (this.unsubscribe) this.unsubscribe();
    if (this.renderTimeout) clearTimeout(this.renderTimeout);
    window.removeEventListener("resize", this.handleResize);

    // Disconnect theme observer
    if (this.themeObserver) {
      this.themeObserver.disconnect();
    }
  },
  methods: {
    async fetchTransactions() {
      try {
        const cached = localStorage.getItem("paymentsCache");
        if (cached) {
          this.transactions = JSON.parse(cached);
        }

        const payments = await fetchPayments();
        this.totalAmount = payments.reduce(
          (sum, p) => sum + (Number(p.amount) || 0),
          0
        );
        localStorage.setItem("totalAmount", this.totalAmount);
        const normalizedPayments = payments.map((p) => ({
          ...p,
          amount:
            typeof p.amount === "string"
              ? Number.parseFloat(p.amount.replace(/,/g, ""))
              : Number(p.amount) || 0,
          timestamp:
            p.timestamp && typeof p.timestamp.seconds === "number"
              ? p.timestamp
              : { seconds: Date.now() / 1000 },
        }));

        this.transactions = normalizedPayments;
        this.filterTransactionsByPeriod();
        localStorage.setItem(
          "paymentsCache",
          JSON.stringify(normalizedPayments)
        );
        this.lastUpdated = new Date().toLocaleString();
        this.retryCount = 0;
        this.error = null;
      } catch (err) {
        throw err;
      }
    },
    filterTransactionsByPeriod() {
      const now = new Date();
      let startDate;

      if (this.selectedPeriod === "Weekly") {
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 6); // Last 7 days
        startDate.setHours(0, 0, 0, 0); // Start of the first day
      } else if (this.selectedPeriod === "Monthly") {
        startDate = new Date(now.setMonth(now.getMonth() - 1));
      } else {
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
      }

      this.filteredTransactions = this.transactions.filter((t) => {
        const txDate = new Date(t.timestamp.seconds * 1000);
        return txDate >= startDate;
      });
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
        this.error = `Failed to connect after ${this.maxRetries} attempts. Please check your network or contact support.`;
        return;
      }

      this.loading = true;
      const delay = Math.pow(2, this.retryCount) * 1000;
      await new Promise((resolve) => setTimeout(resolve, delay));
      this.retryCount++;
      try {
        await this.fetchTransactions();
        await this.renderChart();
      } catch (err) {
        this.handleError(err);
      } finally {
        this.loading = false;
      }
    },
    handleError(err) {
      this.error =
        err.code === "permission-denied"
          ? "You don't have permission to access this data. Contact your administrator."
          : err.message || "Failed to load payments. Please try again.";
    },
    handleResize() {
      if (this.chart) {
        this.chart.resize();
      }
    },
    cleanupChart() {
      if (this.renderTimeout) {
        clearTimeout(this.renderTimeout);
        this.renderTimeout = null;
      }

      if (this.chart) {
        try {
          this.chart.destroy();
        } catch (err) {
          console.warn("Chart cleanup warning:", err);
        }
        this.chart = null;
      }
      this.isRendering = false;
      this.renderPending = false;
    },
    createGradient(ctx, chartArea) {
      if (this.chartType !== "line") return "rgba(79, 70, 229, 0.6)";
      const gradient = ctx.createLinearGradient(
        0,
        chartArea.bottom,
        0,
        chartArea.top
      );
      gradient.addColorStop(0, "rgba(79, 70, 229, 0.1)");
      gradient.addColorStop(0.5, "rgba(79, 70, 229, 0.3)");
      gradient.addColorStop(1, "rgba(79, 70, 229, 0.5)");
      return gradient;
    },
    async renderChart() {
      // Use a lock to prevent concurrent rendering attempts
      if (this.chartLock) {
        console.log("Chart rendering locked, queueing render for later");
        this.renderPending = true;
        return;
      }

      if (!this.chartData) {
        console.log("No chart data available");
        return;
      }

      this.chartLock = true;

      try {
        await nextTick();

        // Clean up existing chart first
        this.cleanupChart();

        // Get canvas after cleanup
        const canvas = this.$refs.chartCanvas;
        if (!canvas || !document.body.contains(canvas)) {
          console.warn(
            "Canvas element not found or not in DOM, deferring chart render"
          );
          this.renderPending = true;
          this.renderTimeout = setTimeout(() => {
            this.chartLock = false;
            this.renderChart();
          }, 200);
          return;
        }

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          throw new Error("Canvas context unavailable");
        }

        const { stepSize } = this.chartData;
        const maxValue = Math.max(...this.chartData.datasets[0].data);
        const yAxisMax = Math.ceil(maxValue / stepSize) * stepSize;
        const dataLength = this.chartData.labels.length;
        const maxLabelLength = Math.max(
          ...this.chartData.labels.map((l) => l.length)
        );
        const rotation = dataLength > 12 || maxLabelLength > 10 ? 45 : 0;
        const isDarkMode = document.documentElement.classList.contains("dark");

        this.chartData.datasets[0].backgroundColor = (context) => {
          const chart = context.chart;
          const { ctx: chartCtx, chartArea } = chart;
          if (!chartArea) return "rgba(79, 70, 229, 0.6)";
          return this.createGradient(chartCtx, chartArea);
        };

        // Create new chart with proper configuration
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
                max: yAxisMax,
                grid: {
                  color: isDarkMode
                    ? "rgba(255, 255, 255, 0.08)"
                    : "rgba(0, 0, 0, 0.05)",
                  drawBorder: false,
                  drawTicks: false,
                },
                title: {
                  display: true,
                  text: "Amount (EGP)",
                  color: isDarkMode
                    ? "rgba(229, 231, 235, 0.8)"
                    : "rgba(0, 0, 0, 0.7)",
                  font: { size: 12, weight: "500" },
                },
                ticks: {
                  callback: (value) =>
                    `EGP ${value.toLocaleString("en-US", {
                      maximumFractionDigits: 0,
                    })}`,
                  stepSize: stepSize,
                  color: isDarkMode
                    ? "rgba(229, 231, 235, 0.7)"
                    : "rgba(0, 0, 0, 0.6)",
                  padding: 10,
                },
              },
              x: {
                grid: {
                  display: false,
                  color: isDarkMode
                    ? "rgba(255, 255, 255, 0.08)"
                    : "rgba(0, 0, 0, 0.05)",
                },
                title: {
                  display: true,
                  text: this.selectedPeriod,
                  color: isDarkMode
                    ? "rgba(229, 231, 235, 0.8)"
                    : "rgba(0, 0, 0, 0.7)",
                  font: { size: 12, weight: "500" },
                },
                ticks: {
                  autoSkip: false, // Show all days
                  maxTicksLimit: this.selectedPeriod === "Weekly" ? 7 : 10,
                  maxRotation: rotation,
                  minRotation: rotation,
                  color: isDarkMode
                    ? "rgba(229, 231, 235, 0.7)"
                    : "rgba(0, 0, 0, 0.6)",
                  padding: 10,
                },
              },
            },
            plugins: {
              legend: { display: false },
              tooltip: {
                backgroundColor: isDarkMode
                  ? "rgba(17, 24, 39, 0.9)"
                  : "rgba(0, 0, 0, 0.85)",
                padding: 12,
                cornerRadius: 8,
                bodyFont: { size: 12 },
                titleFont: { size: 14, weight: "bold" },
                titleColor: "rgba(255, 255, 255, 0.95)",
                bodyColor: "rgba(255, 255, 255, 0.9)",
                callbacks: {
                  label: (context) => {
                    const value = Math.floor(context.raw);
                    const prevValue =
                      context.dataset.data[context.dataIndex - 1] || 0;
                    const diff = value - prevValue;
                    const trend = diff > 0 ? "↑" : diff < 0 ? "↓" : "→";
                    return `EGP ${value.toLocaleString()} (${trend} ${Math.abs(
                      diff
                    ).toLocaleString()})`;
                  },
                  title: (tooltipItems) => tooltipItems[0].label,
                },
              },
            },
            hover: {
              mode: "nearest",
              intersect: true,
              animationDuration: 200,
            },
          },
        });

        // The chart was successfully rendered
        this.renderPending = false;
      } catch (error) {
        console.error("Chart rendering error:", error);

        // Queue a retry with increasing delay if needed
        if (this.renderPending) {
          this.renderTimeout = setTimeout(() => {
            this.chartLock = false;
            this.renderChart();
          }, 300);
        }
      } finally {
        // Release the lock after a short delay to prevent rapid consecutive renders
        setTimeout(() => {
          this.chartLock = false;

          // If there's a pending render request, process it
          if (this.renderPending) {
            this.renderPending = false;
            this.renderTimeout = setTimeout(() => this.renderChart(), 100);
          }
        }, 100);
      }
    },
    getTotalAmount() {
      return this.filteredTransactions.reduce(
        (sum, t) => sum + (Number(t.amount) || 0),
        0
      );
    },
    getAvgAmount() {
      const total = this.getTotalAmount();
      return this.filteredTransactions.length
        ? total / this.filteredTransactions.length
        : 0;
    },
    formatAmount(amount) {
      if (isNaN(amount) || !Number.isFinite(amount)) return "EGP 0";
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "EGP",
        maximumFractionDigits: 0,
      }).format(Math.floor(amount));
    },
    async exportToCSV() {
      if (this.exportProgress.isExporting) {
        // Prevent multiple export operations
        this.$emit("export-notification", "Export already in progress");
        return;
      }

      // Reset and initialize progress tracking
      this.exportProgress = {
        isExporting: true,
        processed: 0,
        total: this.filteredTransactions.length,
        status: "Preparing export...",
      };

      try {
        // Define all exportable fields with proper escaping for CSV format
        const headers = [
          "Payment ID",
          "Amount",
          "Date",
          "Time",
          "Property ID",
          "Property Title",
          "User ID",
          "User Name",
          "Status",
          "Payment Method",
        ];

        // Helper function to escape CSV field values properly
        const escapeCSV = (field) => {
          if (field === null || field === undefined) return "";
          const str = String(field);
          // If the field contains commas, quotes, or newlines, wrap it in quotes and escape any quotes
          if (str.includes(",") || str.includes('"') || str.includes("\n")) {
            return `"${str.replace(/"/g, '""')}"`;
          }
          return str;
        };

        // Add metadata row showing export information
        const metadataRow = [
          `Exported: ${new Date().toLocaleString()}`,
          `Period: ${this.selectedPeriod}`,
          `Total Transactions: ${this.filteredTransactions.length}`,
          `Total Amount: ${this.formatAmount(this.getTotalAmount())}`,
        ];

        this.exportProgress.status = "Collecting property and user data...";

        // Optimize by pre-gathering all unique property and user IDs first
        const uniquePropertyIds = new Set();
        const uniqueUserIds = new Set();

        this.filteredTransactions.forEach((t) => {
          if (t.propertyId) uniquePropertyIds.add(t.propertyId);
          if (t.userId) uniqueUserIds.add(t.userId);
        });

        this.exportProgress.status = `Loading ${uniquePropertyIds.size} properties and ${uniqueUserIds.size} users...`;

        // Pre-load properties and users in parallel batches
        await Promise.all([
          ...Array.from(uniquePropertyIds).map((id) => getPropertyDetails(id)),
          ...Array.from(uniqueUserIds).map((id) => getUserDetails(id)),
        ]);

        // Process transactions in batches to prevent UI freezing
        const BATCH_SIZE = 20;
        const processedRows = [];
        const totalBatches = Math.ceil(
          this.filteredTransactions.length / BATCH_SIZE
        );

        for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
          const start = batchIndex * BATCH_SIZE;
          const end = Math.min(
            start + BATCH_SIZE,
            this.filteredTransactions.length
          );
          const batch = this.filteredTransactions.slice(start, end);

          this.exportProgress.status = `Processing batch ${
            batchIndex + 1
          }/${totalBatches}...`;

          // Process each transaction in the current batch
          for (const t of batch) {
            // Format date and time separately for better readability
            const date = t.timestamp?.seconds
              ? new Date(t.timestamp.seconds * 1000)
              : new Date();

            // Get property details (should be from cache now)
            let propertyTitle = "N/A";
            if (t.propertyId) {
              const propertyDetails = await getPropertyDetails(t.propertyId);
              propertyTitle = propertyDetails?.title || "Unknown Property";
            }

            // Get user details (should be from cache now)
            let userName = "N/A";
            if (t.userId) {
              const userDetails = await getUserDetails(t.userId);
              userName =
                userDetails?.name || userDetails?.email || "Unknown User";
            }

            processedRows.push([
              escapeCSV(t.id),
              escapeCSV(t.amount),
              escapeCSV(date.toLocaleDateString()),
              escapeCSV(date.toLocaleTimeString()),
              escapeCSV(t.propertyId || "N/A"),
              escapeCSV(propertyTitle),
              escapeCSV(t.userId || "N/A"),
              escapeCSV(userName),
              escapeCSV(t.status || "Completed"),
              escapeCSV(t.paymentMethod || "N/A"),
            ]);

            this.exportProgress.processed++;
          }

          // Allow UI to update between batches
          await new Promise((resolve) => setTimeout(resolve, 0));
        }

        this.exportProgress.status = "Generating CSV file...";

        // Combine all rows with proper line breaks
        const csvContent = [
          metadataRow.join(","),
          "", // Empty line as separator
          headers.join(","),
          ...processedRows.map((row) => row.join(",")),
        ].join("\n");

        // Create and download the file
        const blob = new Blob([csvContent], {
          type: "text/csv;charset=utf-8;",
        });
        const link = document.createElement("a");
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

        link.href = URL.createObjectURL(blob);
        link.download = `eskan_payments_${this.selectedPeriod.toLowerCase()}_${timestamp}.csv`;
        link.style.display = "none";
        document.body.appendChild(link);

        this.exportProgress.status = "Downloading file...";
        link.click();

        // Clean up
        setTimeout(() => {
          document.body.removeChild(link);
          URL.revokeObjectURL(link.href);
          this.$emit("export-success", "CSV export completed successfully");
        }, 100);
      } catch (error) {
        console.error("Error exporting CSV:", error);
        // Show user-friendly error notification
        this.$emit(
          "export-error",
          `Failed to export CSV: ${error.message || "Unknown error"}`
        );
      } finally {
        this.exportProgress.isExporting = false;
        this.exportProgress.status = "";
      }
    },
    calculateOptimalStepSize(maxValue) {
      if (maxValue <= 0) return 100;
      const magnitude = Math.pow(10, Math.floor(Math.log10(maxValue)));
      const normalizedMax = maxValue / magnitude;
      let step =
        normalizedMax <= 1.5
          ? 0.2 * magnitude
          : normalizedMax <= 3
          ? 0.5 * magnitude
          : normalizedMax <= 7
          ? 1 * magnitude
          : 2 * magnitude;
      step = Math.ceil(step / (magnitude / 10)) * (magnitude / 10);
      const steps = maxValue / step;
      if (steps > 10) return step * 2;
      if (steps < 4) return step / 2;
      return step;
    },
    rerenderChart() {
      // Mark as pending and schedule a render
      this.renderPending = true;
      if (this.renderTimeout) {
        clearTimeout(this.renderTimeout);
      }

      // Clean up first, then schedule redraw
      this.cleanupChart();
      this.renderTimeout = setTimeout(() => this.renderChart(), 200);
    },
  },
  watch: {
    chartData: {
      handler() {
        if (this.renderTimeout) clearTimeout(this.renderTimeout);
        this.renderTimeout = setTimeout(() => this.renderChart(), 150);
      },
      deep: true,
    },
    chartType() {
      // When chart type changes, do a complete cleanup and redraw
      this.cleanupChart();
      // Use a longer timeout to ensure DOM is ready
      this.renderTimeout = setTimeout(() => this.renderChart(), 250);
    },
    selectedPeriod(newPeriod) {
      this.filterTransactionsByPeriod();
      this.rerenderChart();
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
