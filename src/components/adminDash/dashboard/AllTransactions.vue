<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg p-4">
    <div class="flex justify-between items-center mb-6">
      <h3 class="text-gray-900 dark:text-white text-lg font-semibold">All Transactions</h3>
    </div>

    <div v-if="loading" class="text-gray-900 dark:text-white">Loading...</div>
    <div v-else-if="error" class="text-red-500">Error: {{ error }}</div>
    <div v-else style="max-height: 300px; overflow-y: auto;">
      <div v-for="(user, userId) in users" 
           :key="userId" 
           class="mb-4 p-3 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-between">
        
        <div class="flex items-center">
          <img :src="user.photo || '/images/default-avatar.png'" 
               alt="User Image" 
               class="w-8 h-8 rounded-full mr-3">
          <div>
            <p class="text-gray-900 dark:text-white text-xs truncate max-w-[100px]">
              {{ user.name }}
            </p>
            <p class="text-gray-600 dark:text-gray-400 text-[10px] truncate max-w-[120px]">
              {{ user.email }}
            </p> 
          </div>
        </div>

        <span class="text-green-600 dark:text-green-400 font-light text-xs">
          {{ formatAmount(user.totalAmount) }}
        </span>

      </div>
    </div>
  </div>
</template>

<script>
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "@/config/firebase";

async function getTransactions() {
  try {
    const users = {};
    const querySnapshot = await getDocs(collection(db, "payments")); // 🟢 جلب المدفوعات فقط
    
    for (const doc of querySnapshot.docs) {
      let transactionData = { id: doc.id, ...doc.data() };
      
      if (transactionData.userId) {
        if (!users[transactionData.userId]) {
          const user = await getUserDetails(transactionData.userId);
          if (user) {
            users[transactionData.userId] = { ...user, totalAmount: 0 };
          }
        }
        if (users[transactionData.userId]) {
          users[transactionData.userId].totalAmount += transactionData.amount;
        }
      }
    }

    return users;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
}

async function getUserDetails(userId) {
  if (!userId) return null;
  try {
    const ownerRef = doc(db, "owners", userId);
    const ownerSnap = await getDoc(ownerRef);
    if (ownerSnap.exists()) {
      return ownerSnap.data();
    }

    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      return userSnap.data();
    }

    return null;
  } catch (error) {
    console.error(`Error fetching user (${userId}):`, error);
    return null;
  }
}

export default {
  data() {
    return {
      users: {},
      loading: true,
      error: null,
    };
  },
  async mounted() {
    try {
      this.users = await getTransactions();
    } catch (err) {
      this.error = err.message || "Failed to fetch transactions.";
    } finally {
      this.loading = false;
    }
  },
  methods: {
    formatAmount(amount) {
      return `$${amount.toLocaleString("en-US", { notation: "compact", maximumFractionDigits: 1 })}`;
    },
  },
};
</script>

<style scoped>
.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
