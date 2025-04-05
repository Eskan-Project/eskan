<template>
  <div class="max-w-6xl mx-auto">
    <div class="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4">
      <div
        :class="[
          'flex items-center justify-center mb-4',
          isStacked ? 'flex-col' : 'md:flex-row'
        ]"
      >

        <div class="flex-shrink-0 w-32 h-28 relative">
          <canvas ref="chartCanvas" class="w-full h-full"></canvas>
        </div>


        <div :class="[isStacked ? 'mt-4 text-center' : 'ml-4 text-left']">
          <p class="text-xl font-semibold text-gray-500 dark:text-gray-300">
            {{ properties.length }} Properties
          </p>
          <p class="text-sm text-gray-400 dark:text-gray-400">
            Property distribution
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import Chart from "chart.js/auto";

export default {
  data() {
    return {
      properties: [],
      chart: null,
      isStacked: window.innerWidth <= 1225,
    };
  },
  mounted() {
    this.renderChart();
    window.addEventListener("resize", this.updateLayout);
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
    window.removeEventListener("resize", this.updateLayout);
  },
  async created() {
    try {
      await this.loadData();
    } catch (error) {
      console.error("Error in created:", error);
    }
  },
  watch: {
    properties: {
      handler() {
        if (this.chart) {
          this.chart.destroy();
        }
        this.renderChart();
      },
      deep: true,
    },
  },
  methods: {
    ...mapActions("property", ["getProperties"]),
    async loadData() {
      try {
        this.properties = (await this.getProperties()) || [];
      } catch (error) {
        console.error("Fetch properties error:", error);
      }
    },
    updateLayout() {
      this.isStacked = window.innerWidth <= 1225;
    },
    renderChart() {
      if (this.properties.length > 0) {
        const ctx = this.$refs.chartCanvas.getContext("2d");
        this.chart = new Chart(ctx, {
          type: "doughnut",
          data: {
            datasets: [
              {
                data: [this.properties.length, 1],
                backgroundColor: ["#364365", "#E0E0E0"],
              },
            ],
          },
          options: {
            responsive: true,
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
};
</script>
