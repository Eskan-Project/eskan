<template>
  <div
    class="flex items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-700/30 rounded-lg transition-colors duration-200 group cursor-pointer border-b border-gray-100 dark:border-gray-700"
    @click="$emit('click', id)"
  >
    <div class="relative">
      <div
        :class="[
          'flex items-center justify-center w-10 h-10 rounded-full mr-4 overflow-hidden',
          categoryBackground,
        ]"
      >
        <img
          v-if="isImage(icon)"
          :src="icon"
          :alt="title"
          class="w-full h-full object-cover"
          @error="handleImageError"
        />
        <span v-else class="text-white text-lg">
          <i :class="icon"></i>
        </span>
      </div>
      <span
        v-if="status"
        :class="[
          'absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800',
          status === 'completed'
            ? 'bg-green-500'
            : status === 'pending'
            ? 'bg-yellow-500'
            : status === 'failed'
            ? 'bg-red-500'
            : status === 'processing'
            ? 'bg-blue-500'
            : 'bg-gray-500',
        ]"
        :title="status"
      ></span>
    </div>
    <div class="flex-grow min-w-0">
      <div class="flex items-center">
        <h4 class="font-semibold text-gray-800 dark:text-gray-200 truncate">
          {{ title }}
        </h4>
        <span
          v-if="category"
          :class="['ml-2 px-2 py-0.5 text-xs rounded-full', categoryClass]"
        >
          {{ category }}
        </span>
      </div>
      <p class="text-sm text-gray-500 dark:text-gray-400 truncate">
        {{ subtitle }}
      </p>
    </div>
    <div class="flex flex-col items-end ml-4">
      <span
        :class="[
          'font-semibold transition-all duration-200',
          type === 'credit'
            ? 'text-green-600 dark:text-green-400 group-hover:text-green-700 dark:group-hover:text-green-300'
            : type === 'debit'
            ? 'text-red-600 dark:text-red-400 group-hover:text-red-700 dark:group-hover:text-red-300'
            : 'text-gray-700 dark:text-gray-300',
        ]"
      >
        {{ formattedAmount }}
      </span>
      <span class="text-xs text-gray-400 dark:text-gray-500">{{
        formattedDate
      }}</span>
    </div>

    <div
      class="opacity-0 group-hover:opacity-100 transition-opacity ml-3"
      v-if="!isSmallScreen"
    >
      <button
        class="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-gray-300"
        title="More options"
        @click.stop="$emit('options', id)"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    id: {
      type: [String, Number],
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      required: true,
    },
    amount: {
      type: [String, Number],
      required: true,
    },
    type: {
      type: String,
      default: "neutral",
      validator: (value) => ["credit", "debit", "neutral"].includes(value),
    },
    status: {
      type: String,
      default: "",
      validator: (value) =>
        ["", "completed", "pending", "failed", "processing"].includes(value),
    },
    category: {
      type: String,
      default: "",
    },
    date: {
      type: [String, Date],
      default: null,
    },
    reference: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      isSmallScreen: window.innerWidth < 640,
      fallbackIcon: "fa fa-money-bill",
    };
  },
  computed: {
    formattedAmount() {
      // Add currency symbol and format based on transaction type
      const prefix =
        this.type === "credit" ? "+" : this.type === "debit" ? "-" : "";
      const amount =
        typeof this.amount === "number"
          ? this.amount.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
              minimumFractionDigits: 2,
            })
          : this.amount;

      return `${prefix}${amount.replace(/^\$/, "")}`;
    },
    formattedDate() {
      if (!this.date) return "";

      const date = this.date instanceof Date ? this.date : new Date(this.date);

      // Check if date is valid
      if (isNaN(date.getTime())) return "";

      // Format relative time if recent (within last 24 hours)
      const now = new Date();
      const diffMinutes = Math.floor((now - date) / (1000 * 60));
      const diffHours = Math.floor(diffMinutes / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMinutes < 5) {
        return "Just now";
      } else if (diffMinutes < 60) {
        return `${diffMinutes}m ago`;
      } else if (diffHours < 24) {
        return `${diffHours}h ago`;
      } else if (diffDays < 7) {
        return `${diffDays}d ago`;
      } else {
        // Format date based on how old it is
        return date.toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
          year:
            now.getFullYear() !== date.getFullYear() ? "numeric" : undefined,
        });
      }
    },
    categoryClass() {
      const categories = {
        payment:
          "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
        refund:
          "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
        deposit:
          "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
        withdrawal:
          "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
        transfer:
          "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
        subscription:
          "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
        fee: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
      };

      return (
        categories[this.category.toLowerCase()] ||
        "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
      );
    },
    categoryBackground() {
      const backgrounds = {
        payment: "bg-green-500",
        refund: "bg-purple-500",
        deposit: "bg-blue-500",
        withdrawal: "bg-red-500",
        transfer: "bg-indigo-500",
        subscription: "bg-amber-500",
        fee: "bg-gray-500",
      };

      return backgrounds[this.category.toLowerCase()] || "bg-gray-500";
    },
  },
  mounted() {
    window.addEventListener("resize", this.handleResize);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.handleResize);
  },
  methods: {
    isImage(src) {
      return (
        src &&
        (src.startsWith("http") ||
          src.startsWith("/") ||
          src.match(/\.(jpeg|jpg|gif|png|webp)$/) !== null)
      );
    },
    handleImageError(e) {
      // Replace with default icon
      e.target.style.display = "none";
      e.target.parentNode.innerHTML = `<i class="${this.fallbackIcon} text-white text-lg"></i>`;
    },
    handleResize() {
      this.isSmallScreen = window.innerWidth < 640;
    },
  },
  emits: ["click", "options"],
};
</script>

<style scoped>
.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}
</style>
