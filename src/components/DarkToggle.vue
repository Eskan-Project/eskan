<template>
  <button
    @click="toggleDarkMode"
    class="relative w-12 h-6 flex items-center bg-gray-300 dark:bg-gray-700 rounded-full p-1 transition-all duration-300 cursor-pointer"
  >
    <!-- Toggle Knob -->
    <div
      class="absolute w-5 h-5 bg-white dark:bg-gray-200 rounded-full shadow-md transition-transform duration-300 transform"
      :class="{
        'translate-x-6 ltr:translate-x-6 rtl:-translate-x-6': isDarkMode,
        'translate-x-0': !isDarkMode,
      }"
    ></div>

    <!-- Moon Icon (Dark Mode) -->
    <svg
      v-if="isDarkMode"
      class="absolute rtl:right-1 ltr:left-1 w-4 h-4 text-yellow-300 transition-all duration-300"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M12.74 2a10.94 10.94 0 0 0 0 20 9.22 9.22 0 0 1 0-20Z" />
    </svg>

    <!-- Sun Icon (Light Mode) -->
    <svg
      v-else
      class="absolute rtl:left-1 ltr:right-1 w-4 h-4 text-yellow-500 transition-all duration-300"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  </button>
</template>

<script>
export default {
  data() {
    return {
      isDarkMode: false,
    };
  },
  methods: {
    toggleDarkMode() {
      this.isDarkMode = !this.isDarkMode;
      if (this.isDarkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      localStorage.setItem("darkMode", this.isDarkMode);
    },
  },
  mounted() {
    const darkMode = localStorage.getItem("darkMode");
    this.isDarkMode = darkMode === "true";
    if (this.isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  },
};
</script>
