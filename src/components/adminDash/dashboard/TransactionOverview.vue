<template>
    <div class="bg-gray-800 rounded-lg p-4 h-full">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold text-white">Transactions Overview</h3>
        
      </div>
      <div v-if="loading" class="text-white">Loading...</div>
      <div v-else-if="error" class="text-red-500">Error: {{ error }}</div>
      <div v-else-if="transactions.length > 0" class="mb-4">
        <canvas ref="chartCanvas" width="400" height="300"></canvas>
      </div>
      <div v-else>
        <p class="text-gray-400">No transactions available.</p>
      </div>
    </div>
  </template>
  
  <script>
  import { collection, getDocs } from "firebase/firestore";
  import { db } from "@/config/firebase";
  import Chart from "chart.js/auto";
  import { nextTick } from "vue";
  
  // جلب البيانات من Firestore
  async function getTransactions() {
    try {
      const transactions = [];
      const querySnapshot = await getDocs(collection(db, "payments"));
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log("🔍 Transaction Data:", data); 
        transactions.push({
          id: doc.id,
          ...data,
        });
      });
      return transactions;
    } catch (error) {
      console.error("🚨 Error fetching transactions:", error);
      throw error;
    }
  }
  
  export default {
    data() {
      return {
        transactions: [],
        loading: true,
        error: null,
        chart: null, 
      };
    },
    async mounted() {
      try {
        this.transactions = await getTransactions();
        console.log("✅ Fetched Transactions:", this.transactions);
        await nextTick();
        if (this.transactions.length > 0) {
          this.renderChart();
        }
      } catch (err) {
        this.error = err.message || "Failed to fetch transactions.";
      } finally {
        this.loading = false;
      }
    },
    methods: {
      async renderChart() {
        await nextTick(); 
  
        const canvas = this.$refs.chartCanvas;
        if (!canvas) {
          console.error("❌ Error: Canvas element not found!");
          return;
        }
  
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          console.error("❌ Error: Canvas context is null.");
          return;
        }
  
        console.log("✅ Canvas found, rendering chart...");
        if (this.chart) {
          this.chart.destroy();
        }


        const dailyAmounts = {};
        this.transactions.forEach((transaction) => {
          if (!transaction.timestamp || !transaction.timestamp.seconds) {
            console.warn("⚠️ Skipping transaction with missing timestamp:", transaction);
            return; 
          }
  
          const date = new Date(transaction.timestamp.seconds * 1000).toLocaleDateString();
          dailyAmounts[date] = (dailyAmounts[date] || 0) + transaction.amount;
        });
  
        const labels = Object.keys(dailyAmounts);
        const data = Object.values(dailyAmounts);
  
        console.log("📊 Chart Labels:", labels);
        console.log("📊 Chart Data:", data);
        this.chart = new Chart(ctx, {
          type: "bar",
          data: {
            labels: labels,
            datasets: [{
              label: "Daily Amounts",
              data: data,
              backgroundColor: "rgba(54, 162, 235, 0.2)",
              borderColor: "rgba(54, 162, 235, 1)",
              borderWidth: 1,
            }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });
      },
    },
    watch: {
      transactions: {
        async handler() {
          await nextTick();
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
  
