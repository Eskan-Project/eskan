<template>
  <div class="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-[#364365]">
    <div class="bg-white p-8 rounded-3xl shadow-2xl max-w-md text-center animate-fade-in">
      <h1 class="text-7xl font-bold text-[#364365]">404</h1>
      <p class="text-gray-600 text-lg mt-4">Oops! The page you're looking for doesn't exist.</p>
      <router-link to="/" class="mt-6 inline-block px-6 py-3 bg-[#364365] text-white rounded-full text-lg font-semibold hover:bg-white hover:text-[#364365] hover:border-2 transition duration-300">
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
