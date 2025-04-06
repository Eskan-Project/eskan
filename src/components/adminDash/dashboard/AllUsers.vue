<template>
  <div
    class="stat-card bg-white dark:bg-gray-800 shadow-sm rounded-xl p-5 h-full hover:shadow-md transition-shadow duration-300"
  >
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center">
        <div class="p-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30 mr-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 text-indigo-600 dark:text-indigo-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
        <h3 class="text-gray-700 dark:text-gray-300 font-medium">
          Members Overview
        </h3>
      </div>

      <button
        v-if="loading"
        class="flex items-center justify-center h-7 w-7 rounded-full bg-indigo-50 dark:bg-indigo-900/20"
      >
        <div
          class="h-4 w-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"
        ></div>
      </button>
    </div>

    <div
      v-if="loading && members.length === 0"
      class="flex items-center justify-center py-8"
    >
      <div class="flex flex-col items-center">
        <div
          class="h-8 w-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin mb-2"
        ></div>
        <p class="text-gray-400 dark:text-gray-500 text-sm">
          Loading members...
        </p>
      </div>
    </div>

    <div
      v-else-if="members.length === 0"
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
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      </div>
      <p class="text-gray-600 dark:text-gray-400">No members found</p>
    </div>

    <div v-else class="flex flex-col md:flex-row items-center">
      <div class="chart-container relative w-32 h-32">
        <canvas ref="chartCanvas" class="w-full h-full"></canvas>
        <div class="absolute inset-0 flex items-center justify-center flex-col">
          <span class="text-2xl font-bold text-gray-600 dark:text-gray-400">{{
            members
          }}</span>
          <span class="text-xs text-gray-500 dark:text-gray-400">Members</span>
        </div>
      </div>

      <div class="ml-0 md:ml-6 mt-4 md:mt-0 text-center md:text-left">
        <div class="grid grid-cols-1 gap-2">
          <div class="flex items-center">
            <span class="h-3 w-3 rounded-full bg-indigo-500 mr-2"></span>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Users: <span class="font-medium">{{ usersCount }}</span>
            </p>
          </div>
          <div class="flex items-center">
            <span
              class="h-3 w-3 rounded-full bg-gray-300 dark:bg-gray-600 mr-2"
            ></span>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Owners: <span class="font-medium">{{ ownersCount }}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import Chart from "chart.js/auto";
import { nextTick } from "vue";

export default {
  data() {
    return {
      windowWidth: window.innerWidth,
      chart: null,
      loading: false,
      targetUsers: 100,
    };
  },
  computed: {
    ...mapState("users", ["users"]),
    ...mapState("owners", ["owners"]),
    isStacked() {
      return this.windowWidth <= 1225;
    },
    members() {
      return (this.users?.length || 0) + (this.owners?.length || 0);
    },
    usersCount() {
      return this.users?.length || 0;
    },
    ownersCount() {
      return this.owners?.length || 0;
    },
    growthPercentage() {
      return Math.min(
        100,
        Math.round(((this.users?.length || 0) / this.targetUsers) * 100)
      );
    },
  },
  async created() {
    await this.refreshData();
  },
  async mounted() {
    window.addEventListener("resize", this.updateWindowWidth);

    if (this.users?.length > 0) {
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
  watch: {
    users: {
      async handler() {
        if (this.chart) {
          this.chart.destroy();
          this.chart = null;
        }

        if (this.users?.length > 0) {
          await nextTick();
          this.renderChart();
        }
      },
      deep: true,
    },
  },
  methods: {
    ...mapActions("users", ["getUsers"]),
    ...mapActions("owners", ["getOwners"]),
    async refreshData() {
      this.loading = true;
      try {
        this.users = await this.getUsers();
        this.owners = await this.getOwners();
      } catch (error) {
        console.error("Fetch users error:", error);
      } finally {
        this.loading = false;
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
                data: [
                  this.usersCount,
                  Math.max(1, this.targetUsers - this.usersCount),
                ],
                backgroundColor: ["#4F46E5", "#E5E7EB"],
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
    getGrowthMessage() {
      const percentage = this.growthPercentage;
      if (percentage < 30) return "User acquisition needed to meet targets";
      if (percentage < 70) return "Growing steadily towards target";
      return "Near or at target user count";
    },
  },
  watch: {
    users: "renderChart",
    owners: "renderChart",
    properties: "renderChart",
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
