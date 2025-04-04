<template>
  <div class="max-w-6xl mx-auto">
    <div class="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4">
      <div class="flex flex-col md:flex-row items-center justify-center mb-4">
        <div class="flex-shrink-0 w-32 h-28 relative">
          <canvas ref="chartCanvas" width="100" height="100"></canvas>
        </div>

        <div class="ml-4">
          <p class="text-xl font-semibold text-gray-500 dark:text-gray-300">
            {{ owners.length }} Owners
          </p>
          <p class="text-sm text-gray-400 dark:text-gray-400">
            Owners distribution
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import Chart from "chart.js/auto";

export default {
  data() {
    return {
      windowWidth: window.innerWidth,
      chart: null,
    };
  },
  computed: {
    ...mapState("owners", ["owners"]),
  },
  async created() {
    try {
      await this.loadData();
    } catch (error) {
      console.error("Error in created:", error);
    }
  },
  mounted() {
    this.renderChart();
    window.addEventListener("resize", this.updateWindowWidth);
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
    window.removeEventListener("resize", this.updateWindowWidth);
  },
  methods: {
    ...mapActions("owners", ["getOwners"]),
    async loadData() {
      try {
        await this.getOwners();
      } catch (error) {
        console.error("Fetch owners error:", error);
      }
    },
    updateWindowWidth() {
      this.windowWidth = window.innerWidth;
    },
    renderChart() {
      if (this.owners.length > 0) {
        const ctx = this.$refs.chartCanvas.getContext("2d");
        this.chart = new Chart(ctx, {
          type: "doughnut",
          data: {
            datasets: [
              {
                data: [this.owners.length, 1],
                backgroundColor: ["#364365", "#E0E0E0"],
              },
            ],
          },
          options: {
            responsive: false,
            maintainAspectRatio: false,
            cutout: "70%",
            plugins: {
              legend: {
                display: false,
              },
            },
          },
        });
      }
    },
  },
  watch: {
    owners: {
      handler() {
        if (this.chart) {
          this.chart.destroy();
        }
        this.renderChart();
      },
      deep: true,
    },
  },
};
</script>
