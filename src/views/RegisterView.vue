<template>
  <auth-header />
  <div
    class="md:p-10 flex justify-center items-center min-h-screen bg-gray-50 dark:bg-[#111827] py-8"
  >
    <div
      class="bg-white dark:bg-[#1F2937] rounded-xl w-screen max-w-5xl text-black dark:text-white lg:w-[80vw] shadow-lg overflow-hidden transition-all duration-300"
    >
      <!-- Page Title and Introduction -->
      <div class="text-center p-6 md:p-10">
        <h1
          class="text-2xl md:text-4xl font-semibold text-[#364365] dark:text-white mb-2"
        >
          {{ $t("auth.select_role.welcome") }}
        </h1>
        <p
          class="text-lg md:text-xl text-stone-500 dark:text-gray-300 max-w-2xl mx-auto"
        >
          {{ $t("auth.select_role.subtitle") }}
        </p>
      </div>

      <!-- Role Selection Cards -->
      <div
        class="grid md:grid-cols-2 grid-cols-1 gap-6 md:gap-10 p-6 md:px-20 md:pb-20"
      >
        <!-- User Role Card -->
        <button
          class="group cursor-pointer p-6 rounded-xl text-left shadow-md hover:shadow-lg dark:shadow-gray-900 dark:hover:shadow-gray-800 transition-all duration-300 hover:scale-102 bg-white dark:bg-[#1F2937] border border-gray-100 dark:border-gray-800 relative overflow-hidden"
          @click="$router.push({ name: 'registerUser' })"
        >
          <!-- Background Pattern -->
          <div
            class="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 opacity-10 bg-[#364365] rounded-full -mr-10 -mt-10 group-hover:scale-110 transition-transform duration-500"
          ></div>

          <!-- Content -->
          <div class="flex flex-col gap-4 relative">
            <!-- Icon and Title -->
            <div class="flex items-center gap-4 mb-2">
              <div class="bg-[#EEF2FF] dark:bg-[#2D3748] p-3 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-8 w-8 text-[#364365] dark:text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h2
                class="text-2xl font-semibold text-[#364365] dark:text-white group-hover:text-[#506298] dark:group-hover:text-blue-400 transition-colors"
              >
                {{ $t("auth.select_role.user") }}
              </h2>
            </div>

            <!-- Description -->
            <p class="text-gray-600 dark:text-gray-300 text-base md:text-lg">
              {{ $t("auth.select_role.user_description") }}
            </p>

            <!-- CTA -->
            <div class="mt-4 flex justify-end">
              <span
                class="inline-flex items-center text-[#364365] dark:text-blue-400 font-medium group-hover:translate-x-1 transition-transform duration-300"
              >
                Get started
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 ml-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
              </span>
            </div>
          </div>
        </button>

        <!-- Owner Role Card -->
        <button
          class="group cursor-pointer p-6 rounded-xl text-left shadow-md hover:shadow-lg dark:shadow-gray-900 dark:hover:shadow-gray-800 transition-all duration-300 hover:scale-102 bg-white dark:bg-[#1F2937] border border-gray-100 dark:border-gray-800 relative overflow-hidden"
          @click="$router.push({ name: 'registerOwner' })"
        >
          <!-- Background Pattern -->
          <div
            class="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 opacity-10 bg-[#364365] rounded-full -mr-10 -mt-10 group-hover:scale-110 transition-transform duration-500"
          ></div>

          <!-- Content -->
          <div class="flex flex-col gap-4 relative">
            <!-- Icon and Title -->
            <div class="flex items-center gap-4 mb-2">
              <div class="bg-[#EEF2FF] dark:bg-[#2D3748] p-3 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-8 w-8 text-[#364365] dark:text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <h2
                class="text-2xl font-semibold text-[#364365] dark:text-white group-hover:text-[#506298] dark:group-hover:text-blue-400 transition-colors"
              >
                {{ $t("auth.select_role.owner") }}
              </h2>
            </div>

            <!-- Description -->
            <p class="text-gray-600 dark:text-gray-300 text-base md:text-lg">
              {{ $t("auth.select_role.owner_description") }}
            </p>

            <!-- CTA -->
            <div class="mt-4 flex justify-end">
              <span
                class="inline-flex items-center text-[#364365] dark:text-blue-400 font-medium group-hover:translate-x-1 transition-transform duration-300"
              >
                Get started
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 ml-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
              </span>
            </div>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import AuthHeader from "@/components/AuthHeader.vue";
export default {
  components: { AuthHeader },
};
</script>

<style scoped>
.hover\:scale-102:hover {
  transform: scale(1.02);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.group {
  animation: fadeIn 0.5s ease-out;
}
</style>
