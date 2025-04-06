<template>
  <div
    class="stat-card shadow-sm bg-white dark:bg-gray-800 rounded-xl p-5 h-full hover:shadow-md transition-shadow duration-300"
  >
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center">
        <div class="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 mr-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 text-blue-600 dark:text-blue-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
        </div>
        <h3 class="text-gray-700 dark:text-gray-300 font-medium">
          Properties Overview
        </h3>
      </div>

      <button
        v-if="isLoading"
        class="flex items-center justify-center h-7 w-7 rounded-full bg-blue-50 dark:bg-blue-900/20"
      >
        <div
          class="h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"
        ></div>
      </button>
    </div>

    <div
      v-if="isLoading && properties.length === 0"
      class="flex items-center justify-center py-8"
    >
      <div class="flex flex-col items-center">
        <div
          class="h-8 w-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mb-2"
        ></div>
        <p class="text-gray-400 dark:text-gray-500 text-sm">
          Loading properties...
        </p>
      </div>
    </div>

    <div
      v-else-if="properties.length === 0"
      class="flex flex-col items-center justify-center py-8 text-center"
    >
      <div class="rounded-full bg-gray-100 dark:bg-gray-700 p-3 mb-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      </div>
      <p class="text-gray-600 dark:text-gray-400">No properties found</p>
    </div>

    <div v-else class="flex flex-col md:flex-row items-center">
      <div class="chart-container relative w-32 h-32">
        <canvas ref="chartCanvas" class="w-full h-full"></canvas>
        <div class="absolute inset-0 flex items-center justify-center flex-col">
          <span class="text-2xl font-bold text-gray-600 dark:text-gray-400">{{
            properties.length
          }}</span>
          <span class="text-xs text-gray-500 dark:text-gray-400"
            >Properties</span
          >
        </div>
      </div>

      <div class="ml-0 md:ml-6 mt-4 md:mt-0 text-center md:text-left">
        <div class="grid grid-cols-1 gap-2">
          <div class="flex items-center">
            <span class="h-3 w-3 rounded-full bg-blue-500 mr-2"></span>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Available: <span class="font-medium">{{ availableCount }}</span>
            </p>
          </div>
          <div class="flex items-center">
            <span
              class="h-3 w-3 rounded-full bg-gray-300 dark:bg-gray-600 mr-2"
            ></span>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Expired: <span class="font-medium">{{ expiredCount }}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import Chart from "chart.js/auto";
import { nextTick } from "vue";

export default {
  data() {
    return {
      properties: [],
      chart: null,
      isStacked: window.innerWidth <= 1225,
      isLoading: false,
    };
  },
  computed: {
    availableCount() {
      return Math.round(
        this.properties.filter((property) => property.status === "completed")
          .length
      ); // Simulated data
    },
    expiredCount() {
      return this.properties.filter((property) => property.status === "expired")
        .length;
    },
  },
  async created() {
    await this.refreshData();
  },
  async mounted() {
    window.addEventListener("resize", this.updateLayout);

    // Wait for the next DOM update cycle before trying to render the chart
    if (this.properties.length > 0) {
      await nextTick();
      this.renderChart();
    }
  },
  beforeUnmount() {
    if (this.chart) {
      this.chart.destroy();
    }
    window.removeEventListener("resize", this.updateLayout);
  },
  watch: {
    properties: {
      async handler() {
        if (this.chart) {
          this.chart.destroy();
          this.chart = null;
        }

        if (this.properties.length > 0) {
          // Ensure DOM is updated before attempting to render chart
          await nextTick();
          this.renderChart();
        }
      },
      deep: true,
    },
  },
  methods: {
    ...mapActions("property", ["getProperties"]),
    async refreshData() {
      this.isLoading = true;
      try {
        this.properties = (await this.getProperties()) || [];
      } catch (error) {
        console.error("Fetch properties error:", error);
      } finally {
        this.isLoading = false;
      }
    },
    updateLayout() {
      this.isStacked = window.innerWidth <= 1225;
    },
    async renderChart() {
      await nextTick();

      const canvas = this.$refs.chartCanvas;
      if (!canvas) {
        console.error("Chart canvas element not found");
        return;
      }

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        console.error("Canvas context not available");
        return;
      }

      if (this.chart) {
        this.chart.destroy();
      }

      try {
        this.chart = new Chart(ctx, {
          type: "doughnut",
          data: {
            datasets: [
              {
                data: [this.availableCount, this.expiredCount],
                backgroundColor: ["#3B82F6", "#E5E7EB"],
                borderWidth: 0,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
            cutout: "75%",
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                enabled: false,
              },
            },
            animation: {
              animateRotate: true,
              animateScale: true,
            },
          },
        });
      } catch (error) {
        console.error("Error rendering chart:", error);
      }
    },
    getStatusMessage() {
      const percentage = Math.round(
        (this.availableCount / this.properties.length) * 100
      );
      if (percentage < 40) return "Low inventory available";
      if (percentage < 70) return "Balanced inventory";
      return "High availability rate";
    },
  },
};
</script>

<style scoped>
.chart-container {
  position: relative;
}

.stat-card {
  transition: all 0.3s ease;
}
</style>
