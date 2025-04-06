<template>
  <div class="max-w-6xl mx-auto">
    <div class="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4">
      <div :class="['flex', isStacked ? 'flex-col' : 'md:flex-row', 'items-center', 'justify-center', 'mb-4']">
        <div class="flex-shrink-0 w-32 h-28 relative">
          <canvas ref="chartCanvas" class="w-full h-full"></canvas>
        </div>
        <div :class="[isStacked ? 'mt-4 text-center' : 'ml-4']">
          <p class="text-xl font-semibold text-gray-500 dark:text-gray-300">
            {{ users.length }} Users
          </p>
          <p class="text-sm text-gray-400 dark:text-gray-400">
            Users distribution
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import Chart from "chart.js/auto";

export default {
  data() {
    return {
      windowWidth: window.innerWidth,
      chart: null,
      isStacked: window.innerWidth <= 1225,
    };
  },
  computed: {
    ...mapState("users", ["users"]),
    ...mapState("owners", ["owners"]),
    ...mapState("property", ["properties"]),
  },
  async created() {
    await this.loadData();
  },
  mounted() {
    this.renderChart();
    window.addEventListener("resize", this.updateWindowWidth);
  },
  beforeDestroy() {
    if (this.chart) this.chart.destroy();
    window.removeEventListener("resize", this.updateWindowWidth);
  },
  methods: {
    ...mapActions("users", ["getUsers"]),
    ...mapActions("owners", ["getOwners"]),
    ...mapActions("property", ["getProperties"]),
    async loadData() {
      await Promise.all([this.getUsers(), this.getOwners(), this.getProperties()]);
    },
    updateWindowWidth() {
      this.windowWidth = window.innerWidth;
      this.isStacked = this.windowWidth <= 1225;
    },
    renderChart() {
      if (!this.$refs.chartCanvas) return;
      if (this.chart) this.chart.destroy();

      const userCount = this.users.length;
      const othersCount = this.owners.length + this.properties.length;

      const ctx = this.$refs.chartCanvas.getContext("2d");
      this.chart = new Chart(ctx, {
        type: "doughnut",
        data: {
          datasets: [
            {
              data: [userCount, othersCount],
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
    },
  },
  watch: {
    users: "renderChart",
    owners: "renderChart",
    properties: "renderChart",
  },
};
</script>
