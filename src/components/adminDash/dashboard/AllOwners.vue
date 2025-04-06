<template>
  <div
    class="stat-card bg-white dark:bg-gray-800 shadow-sm rounded-xl p-5 h-full hover:shadow-md transition-shadow duration-300"
  >
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center">
        <div class="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30 mr-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 text-purple-600 dark:text-purple-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
        </div>
        <h3 class="text-gray-700 dark:text-gray-300 font-medium">
          Owners Requests
        </h3>
      </div>

      <button
        v-if="isLoading"
        class="flex items-center justify-center h-7 w-7 rounded-full bg-purple-50 dark:bg-purple-900/20"
      >
        <div
          class="h-4 w-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"
        ></div>
      </button>
    </div>

    <div
      v-if="isLoading && properties.length === 0"
      class="flex items-center justify-center py-8"
    >
      <div class="flex flex-col items-center">
        <div
          class="h-8 w-8 border-3 border-purple-500 border-t-transparent rounded-full animate-spin mb-2"
        ></div>
        <p class="text-gray-400 dark:text-gray-500 text-sm">
          Loading requests...
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
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      </div>
      <p class="text-gray-600 dark:text-gray-400">No property owners found</p>
    </div>

    <div v-else class="flex flex-col md:flex-row items-center">
      <div class="chart-container relative w-32 h-32">
        <canvas ref="chartCanvas" class="w-full h-full"></canvas>
        <div class="absolute inset-0 flex items-center justify-center flex-col">
          <span class="text-2xl font-bold text-gray-600 dark:text-gray-400">{{
            requests
          }}</span>
          <span class="text-xs text-gray-500 dark:text-gray-400">Requests</span>
        </div>
      </div>

      <div class="ml-0 md:ml-6 mt-4 md:mt-0 text-center md:text-left">
        <div class="grid grid-cols-1 gap-2">
          <div class="flex items-center">
            <span class="h-3 w-3 rounded-full bg-[#8B5CF6] mr-2"></span>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Unpaid: <span class="font-medium">{{ unpaidCount }}</span>
            </p>
          </div>
          <div class="flex items-center">
            <span
              class="h-3 w-3 rounded-full bg-gray-300 dark:bg-gray-600 mr-2"
            ></span>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Pending: <span class="font-medium">{{ pendingCount }}</span>
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
      windowWidth: window.innerWidth,
      chart: null,
      isLoading: false,
      isStacked: window.innerWidth <= 1225,
      properties: [],
    };
  },
  computed: {
    requests() {
      return this.unpaidCount + this.pendingCount;
    },
    unpaidCount() {
      return Math.round(
        this.properties.filter((property) => property.isPaid === false).length
      ); // Simulated data
    },
    pendingCount() {
      return this.properties.filter((property) => property.status === "pending")
        .length;
    },
  },
  async created() {
    await this.refreshData();
  },
  async mounted() {
    window.addEventListener("resize", this.updateWindowWidth);

    if (this.properties.length > 0) {
      await nextTick();
      this.renderChart();
    }
  },
  beforeUnmount() {
    if (this.chart) {
      this.chart.destroy();
    }
    window.removeEventListener("resize", this.updateWindowWidth);
  },
  methods: {
    ...mapActions("property", ["getProperties"]),
    async refreshData() {
      this.isLoading = true;
      try {
        this.properties = await this.getProperties();
      } catch (error) {
        console.error("Fetch owners error:", error);
      } finally {
        this.isLoading = false;
      }
    },
    updateWindowWidth() {
      this.windowWidth = window.innerWidth;
      this.isStacked = this.windowWidth <= 1225;
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
                data: [this.unpaidCount, this.pendingCount],
                backgroundColor: ["#8B5CF6", "#E5E7EB"],
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
        (this.unpaidCount / this.properties.length) * 100
      );
      if (percentage < 50) return "Many properties pending payment";
      if (percentage < 80) return "Payment process in progress";
      return "Most properties need payment";
    },
  },
  watch: {
    properties: {
      async handler() {
        if (this.chart) {
          this.chart.destroy();
          this.chart = null;
        }

        if (this.properties.length > 0) {
          await nextTick();
          this.renderChart();
        }
      },
      deep: true,
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
