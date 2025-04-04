<template>
  <div class="max-w-6xl mx-auto">
    <div class="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4">
      <div class="flex flex-col md:flex-row items-center justify-center mb-4">
       
        <div class="flex-shrink-0 w-32 h-28 relative mb-4 sm:mb-0 sm:w-32 sm:h-32">
          <canvas ref="chartCanvas" width="100" height="100"></canvas>
        </div>

      
        <div class="ml-0 sm:ml-4 text-center sm:text-left">
          <p class="text-xl font-semibold text-gray-500 dark:text-gray-300">{{ users.length }} Users</p>
          <div class="text-sm text-gray-400 dark:text-gray-400">Users distribution {{ totalAmount }}</div>
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
  };
  </script>


