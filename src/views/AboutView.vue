<template>
  <main
    class="min-h-screen bg-gray-50 pt-20 sm:pt-24 md:pt-28 lg:pt-32 pb-8 sm:pb-12 lg:pb-16"
  >
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Who We Are Section -->
      <section class="max-w-6xl mx-auto mb-12 sm:mb-16 lg:mb-20">
        <h1
          :class="[
            'text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#364365] mb-4 sm:mb-6 lg:mb-8',
            {
              'text-right': $i18n.locale === 'ar',
              'text-left': $i18n.locale === 'en',
            },
          ]"
        >
          {{ $t("about.who_we_are.title") }}
        </h1>
        <p
          :class="[
            'text-gray-700 text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed max-w-3xl',
            {
              'text-right mr-0': $i18n.locale === 'ar',
              'text-left ml-0': $i18n.locale === 'en',
            },
          ]"
        >
          {{ $t("about.who_we_are.description") }}
        </p>
      </section>

      <!-- Our Mission Section -->
      <section class="max-w-6xl mx-auto mb-12 sm:mb-16 lg:mb-20">
        <h2
          :class="[
            'text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[#364365] mb-4 sm:mb-6 lg:mb-8',
            {
              'text-right': $i18n.locale === 'ar',
              'text-left': $i18n.locale === 'en',
            },
          ]"
        >
          {{ $t("about.our_mission.title") }}
        </h2>
        <p
          :class="[
            'text-gray-700 text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed max-w-3xl',
            {
              'text-right mr-0': $i18n.locale === 'ar',
              'text-left ml-0': $i18n.locale === 'en',
            },
          ]"
        >
          {{ $t("about.our_mission.description") }}
        </p>
      </section>

      <!-- Our Values Section -->
      <section class="max-w-6xl mx-auto">
        <h2
          :class="[
            'text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[#364365] mb-8 sm:mb-12 lg:mb-16',
            {
              'text-right': $i18n.locale === 'ar',
              'text-left': $i18n.locale === 'en',
            },
          ]"
        >
          {{ $t("about.our_values.title") }}
        </h2>
        <div
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10"
        >
          <div
            v-for="(card, key) in valueCards"
            :key="key"
            class="bg-white p-4 sm:p-5 md:p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105 border border-gray-100"
          >
            <div class="flex items-center mb-3 sm:mb-4">
              <i
                :class="
                  card.icon +
                  ' text-xl sm:text-2xl md:text-3xl text-[#364365] mr-3'
                "
              ></i>
              <h3
                class="text-base sm:text-lg md:text-xl font-semibold text-[#364365]"
              >
                {{ $t(`about.our_values.cards.${key}.title`) }}
              </h3>
            </div>
            <p class="text-gray-600 text-sm sm:text-base md:text-lg">
              {{ $t(`about.our_values.cards.${key}.description`) }}
            </p>
          </div>
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
        people_first: {
          icon: "bi bi-people-fill",
        },
        best_quality: {
          icon: "bi bi-star-fill",
        },
        comprehensive: {
          icon: "bi bi-grid-fill",
        },
        verified_owners: {
          icon: "bi bi-shield-check",
        },
      },
    };
  },
};
</script>

<style scoped>
/* Optional: Add subtle animation for section entrances */
section {
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.6s ease forwards;
}

section:nth-child(2) {
  animation-delay: 0.2s;
}

section:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
