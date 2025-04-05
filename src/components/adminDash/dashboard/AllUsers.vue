<template>
  <div class="max-w-6xl mx-auto">
    <div class="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4">
      <div :class="[
        'flex items-center justify-center mb-4',
        isStacked ? 'flex-col text-center' : 'md:flex-row text-left'
      ]">
    
        <div class="flex-shrink-0 w-32 h-28 relative">
          <canvas ref="chartCanvas" class="w-full h-full"></canvas>
        </div>

    
        <div :class="[isStacked ? 'mt-4' : 'ml-4']">
          <p class="text-xl font-semibold text-gray-500 dark:text-gray-300">
            {{ users.length }} Users
          </p>
          <div class="text-sm text-gray-400 dark:text-gray-400">
            Users distribution {{ totalAmount }}
          </div>
        </div>
      </div>


      <div v-if="users.length === 0" class="p-4 text-center text-gray-500 dark:text-gray-400">
        No users found.
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
    ...mapState("users", ["users"]),
    isStacked() {
      return this.windowWidth <= 1225;
    },
    totalAmount() {
      return this.users.length; 
    }
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
  watch: {
    users: {
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
    ...mapActions("users", ["getUsers"]),
    async loadData() {
      try {
        await this.getUsers();
      } catch (error) {
        console.error("Fetch users error:", error);
      }
    },
    updateWindowWidth() {
      this.windowWidth = window.innerWidth;
    },
    renderChart() {
      if (this.users.length > 0) {
        const ctx = this.$refs.chartCanvas.getContext("2d");
        this.chart = new Chart(ctx, {
          type: "doughnut",
          data: {
            datasets: [{
              data: [this.users.length, 1],
              backgroundColor: ["#364365", "#E0E0E0"],
            }],
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
};
</script>
