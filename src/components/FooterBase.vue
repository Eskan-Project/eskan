<template>
  <footer class="bg-[var(--secondary-color)] text-white py-4">
    <div class="container mx-auto w-3/4 ml-auto">
      <div class="flex flex-col md:flex-row items-end w-full">
        <!-- Left Section: Logo, Text, and Navigation -->
        <div class="w-full md:w-1/2 flex flex-col items-center mb-6 md:mb-0">
          <img
            src="../assets/images/logo.png"
            alt="Eskan Logo"
            class="w-[150px] mb-2"
          />
          <p class="mb-2 text-sm text-center">
            Your Gateway to Safe and Affordable Shared Housing
          </p>
          <nav class="flex justify-center gap-3">
            <router-link
              to="/"
              class="text-white font-bold hover:text-gray-200 transition-colors"
            >
              HOME
            </router-link>
            <router-link
              to="/about"
              class="text-white font-bold hover:text-gray-200 transition-colors"
            >
              ABOUT
            </router-link>
            <router-link
              to="/properties"
              class="text-white font-bold hover:text-gray-200 transition-colors"
            >
              PROPERTIES
            </router-link>
            <router-link
              to="/contact"
              class="text-white font-bold hover:text-gray-200 transition-colors"
            >
              CONTACT
            </router-link>
          </nav>
        </div>

        <!-- Right Section: Social Media Icons -->
        <div class="w-full md:w-1/2 flex justify-center md:justify-end gap-2">
          <a
            href="#"
            class="w-10 h-10 flex items-center justify-center bg-white rounded-lg text-[#2f3a5a] hover:bg-opacity-80 transition-all"
          >
            <i class="bi bi-facebook text-xl"></i>
          </a>
          <a
            href="#"
            class="w-10 h-10 flex items-center justify-center bg-white rounded-lg text-[#2f3a5a] hover:bg-opacity-80 transition-all"
          >
            <i class="bi bi-dribbble text-xl"></i>
          </a>
          <a
            href="#"
            class="w-10 h-10 flex items-center justify-center bg-white rounded-lg text-[#2f3a5a] hover:bg-opacity-80 transition-all"
          >
            <i class="bi bi-linkedin text-xl"></i>
          </a>
          <a
            href="#"
            class="w-10 h-10 flex items-center justify-center bg-white rounded-lg text-[#2f3a5a] hover:bg-opacity-80 transition-all"
          >
            <i class="bi bi-instagram text-xl"></i>
          </a>
          <a
            href="#"
            class="w-10 h-10 flex items-center justify-center bg-white rounded-lg text-[#2f3a5a] hover:bg-opacity-80 transition-all"
          >
            <i class="bi bi-behance text-xl"></i>
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: "Footer",
};
</script>

<style scoped>
/* Custom styles for transitions */
.transition-all {
  transition: all 0.3s ease-in-out;
}
</style>
