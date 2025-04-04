<template>
  <transition name="fade">
    <div
      v-if="loading"
      class="fixed inset-0 bg-[var(--secondary-color)] dark:bg-[#111827] flex items-center justify-center z-50"
    >
      <div class="loader-container">
        <img
          src="../assets/images/logo.png"
          alt="Eskan Logo"
          class="logo-spinner"
          loading="lazy"
        />
        <div
          class="orbit-ring dark:border-top-[#3D8BFF] dark:border-right-[#1a4b8c]"
        ></div>
        <div class="pulse-ring dark:bg-pulse-dark"></div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
      required: true,
    },
  },
};
</script>

<style scoped>
.loader-container {
  position: relative;
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-spinner {
  width: 60px;
  height: 60px;
  animation: spin 1.5s ease-in-out infinite, pulse 2s ease infinite alternate;
  z-index: 10;
}

.orbit-ring {
  position: absolute;
  width: 100px;
  height: 100px;
  border: 4px solid transparent;
  border-top: 4px solid #607bbe;
  border-right: 4px solid #3a528f;
  border-radius: 50%;
  animation: orbit 2s linear infinite;
  z-index: 5;
}

.pulse-ring {
  position: absolute;
  width: 120px;
  height: 120px;
  background: radial-gradient(circle, rgba(54, 67, 101, 0.3), transparent);
  border-radius: 50%;
  animation: pulse 1.5s ease infinite;
  z-index: 1;
}

:root.dark .orbit-ring {
  border-top: 4px solid #3d8bff;
  border-right: 4px solid #1a4b8c;
}

:root.dark .pulse-ring {
  background: radial-gradient(circle, rgba(61, 139, 255, 0.3), transparent);
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes orbit {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes pulse {
  0% {
    transform: scale(0.8);
    opacity: 0.7;
  }
  100% {
    transform: scale(1.2);
    opacity: 0;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
