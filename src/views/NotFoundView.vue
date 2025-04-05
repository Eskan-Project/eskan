<template>
  <div
    class="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-[#364365] dark:from-[#1F2937] dark:to-[#111827]"
  >
    <div
      class="bg-white dark:bg-[#1F2937] p-8 rounded-3xl shadow-2xl max-w-md text-center animate-fade-in"
    >
      <h1 class="text-7xl font-bold text-[#364365] dark:text-[#3D8BFF]">404</h1>
      <p class="text-gray-600 dark:text-gray-300 text-lg mt-4">
        Oops! The page you're looking for doesn't exist.
      </p>
      <router-link
        to="/"
        class="mt-6 inline-block px-6 py-3 bg-[#364365] dark:bg-[#3D8BFF] text-white rounded-full text-lg font-semibold hover:bg-white hover:text-[#364365] dark:hover:bg-[#1F2937] dark:hover:text-[#3D8BFF] hover:border-2 hover:border-[#364365] dark:hover:border-[#3D8BFF] transition duration-300"
      >
        Go Home
      </router-link>
    </div>
  </div>
</template>

<style>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in {
  animation: fade-in 0.8s ease-out;
}
</style>
