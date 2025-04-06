<template>
  <main class="min-h-screen bg-white text-black dark:bg-[#111827] dark:text-white pt-20 pb-16">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">

      <section class="flex flex-col-reverse lg:flex-row items-center gap-12 mb-16" :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'">
  <div class="lg:w-1/2 text-center sm:text-center lg:text-left" :class="{'text-right lg:text-right': $i18n.locale === 'ar'}">
    <h1 class="text-4xl sm:text-5xl font-extrabold text-[#364365] dark:text-white leading-tight">
      {{ $t("about.who_we_are.title") }}
    </h1>
    <p class="text-gray-600 dark:text-gray-300 text-lg sm:text-xl max-w-xl mt-4">
      {{ $t("about.who_we_are.description") }}
    </p>
  </div>

  <div class="lg:w-1/2 relative w-full max-w-lg">
    <div class="relative w-full h-auto animate-float">
      <svg viewBox="0 0 800 600" class="w-full h-auto">
        <defs>
          <clipPath id="complex-blob" clipPathUnits="objectBoundingBox">
            <path d="M0.596,0.036 C0.752,0.063,0.929,0.164,0.976,0.33 C1.023,0.496,0.926,0.728,0.786,0.844 C0.647,0.961,0.466,0.962,0.301,0.925 C0.135,0.889,-0.007,0.814,0.001,0.673 C0.01,0.532,0.196,0.397,0.308,0.279 C0.421,0.16,0.44,0.009,0.596,0.036 Z" />
          </clipPath>
          <linearGradient id="blueGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#00072D" />
            <stop offset="100%" stop-color="#051650" />
          </linearGradient>
          <linearGradient id="darkBlueGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%">
              <animate attributeName="stop-color" values="#0A2472; #134074; #0A2472" dur="6s" repeatCount="indefinite" />
            </stop>
            <stop offset="100%">
              <animate attributeName="stop-color" values="#1A43BF; #2A62D1; #1A43BF" dur="6s" repeatCount="indefinite" />
            </stop>
          </linearGradient>
        </defs>
        <path
          d="M440,30 C580,60 720,180 750,330 C780,480 660,600 510,570 C360,540 180,480 120,340 C60,200 240,0 440,30 Z"
          :fill="$style?.isDark ? 'url(#darkBlueGradient)' : 'url(#blueGradient)'"
          opacity="0.9"
        />
        <image
          href="../assets/images/about.ca_"
          width="800"
          height="600"
          clip-path="url(#complex-blob)"
          preserveAspectRatio="xMidYMid slice"
          style="filter: drop-shadow(0 10px 20px rgba(0,0,0,0.2));"
        />
      </svg>
    </div>
  </div>
</section>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
        <div
          v-for="(card, key) in valueCards"
          :key="key"
          class="relative bg-white dark:bg-[#364365] p-6 rounded-2xl dark:rounded shadow-md hover:shadow-xl transition-transform transform hover:scale-105 border border-gray-100 dark:shadow-[#1E1E1E]  dark:border-gray-800"
        >
          <div class="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-tr from-[#00072D] to-[#051650] dark:from-[#0A2472] dark:to-[#1A43BF] text-white mb-4">
            <i :class="card.icon + ' text-2xl'"></i>
          </div>
          <h3 class="text-lg font-semibold text-[#364365] dark:text-white my-3">
            {{ $t(`about.our_values.cards.${key}.title`) }}
          </h3>
          <p class="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
            {{ $t(`about.our_values.cards.${key}.description`) }}
          </p>
        </div>
      </div>


      <section class="max-w-6xl mx-auto mb-12 sm:mb-16 lg:mb-20 mt-12 sm:mt-16 lg:mt-20">
        <div class="relative inline-block mb-4 sm:mb-6 lg:mb-8">
          <h2
            :class="[
              'relative z-10 flex items-center gap-3 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[#364365] dark:text-white',
              {
                'justify-end': $i18n.locale === 'ar',
                'justify-start': $i18n.locale === 'en',
              }
            ]"
          >
            <i class="bi bi-lightbulb-fill text-[#364365] dark:text-white text-2xl"></i>
            {{ $t("about.our_mission.title") }}
          </h2>
        </div>

        <div
          :class="[
            'relative bg-[#f5f7fa] py-8 dark:bg-[#364365] p-6 sm:p-8 rounded-2xl shadow-inner border-l-4 border-[#364365] dark:border-[#00072D] max-w-7xl',
            {
              'text-right': $i18n.locale === 'ar',
              'text-left': $i18n.locale === 'en',
            },
          ]"
        >
          <p class="text-gray-700 dark:text-gray-200 text-base sm:text-lg lg:text-xl leading-relaxed">
            {{ $t("about.our_mission.description") }}
          </p>
          <div class="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-[#0A2472] to-[#1A43BF] opacity-10 rounded-b-2xl"></div>
        </div>
      </section>

    </div>
  </main>
</template>

<script>
export default {
  name: "AboutView",
  data() {
    return {
      valueCards: {
        people_first: { icon: "bi bi-people-fill" },
        best_quality: { icon: "bi bi-star-fill" },
        comprehensive: { icon: "bi bi-grid-fill" },
        verified_owners: { icon: "bi bi-shield-check" },
      },
    };
  },
};
</script>

<style scoped>
@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
}
.animate-float {
  animation: float 4s ease-in-out infinite;
}
</style>