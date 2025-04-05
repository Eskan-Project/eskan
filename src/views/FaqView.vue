<template>
  <div
    class="faq-container min-h-screen bg-gray-50 dark:bg-[#111827] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 mt-10 sm:mt-0"
    :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'"
  >
    <div class="max-w-4xl mx-auto text-center mb-8 sm:mb-12">
      <h1
        class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4"
      >
        {{ $t("faq.title") }}
      </h1>
      <p class="text-base sm:text-lg text-gray-600 dark:text-gray-300">
        {{ $t("faq.subtitle") }}
      </p>
    </div>
    <div class="max-w-4xl mx-auto">
      <div class="space-y-3 sm:space-y-4">
        <div
          v-for="(faq, index) in localizedFaqs"
          :key="index"
          class="bg-white dark:bg-[#1F2937] rounded-lg shadow-md overflow-hidden"
        >
          <button
            @click="toggleFaq(index)"
            class="w-full flex justify-between items-center p-4 sm:p-5 text-left focus:outline-none cursor-pointer"
            :class="{ 'bg-indigo-50 dark:bg-gray-700': activeIndex === index }"
          >
            <span
              class="text-base sm:text-lg font-medium text-gray-900 dark:text-white pe-2"
            >
              {{ faq.question }}
            </span>
            <span class="text-indigo-600 dark:text-[#3D8BFF] flex-shrink-0">
              <svg
                class="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300"
                :class="{ 'rotate-180': activeIndex === index }"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </span>
          </button>

          <transition name="fade">
            <div
              v-show="activeIndex === index"
              class="p-4 sm:p-5 border-t border-gray-200 dark:border-gray-600"
            >
              <p class="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                {{ faq.answer }}
              </p>
            </div>
          </transition>
        </div>
        <div
          v-if="!localizedFaqs.length"
          class="bg-white dark:bg-[#1F2937] rounded-lg shadow-md p-4 text-center text-gray-600 dark:text-gray-300"
        >
          {{
            $t(
              "faq.no_faqs",
              "No FAQs available. Please check back later or contact support for assistance."
            )
          }}
        </div>
      </div>
    </div>

    <div class="mt-8 sm:mt-12 text-center">
      <p class="text-gray-600 dark:text-gray-300 mb-4">
        {{ $t("faq.still_questions") }}
      </p>
      <a
        href="/contact"
        class="inline-block bg-[var(--secondary-color)] border border-[var(--secondary-color)] text-white font-semibold py-2 px-4 sm:py-3 sm:px-6 rounded-lg hover:text-[var(--secondary-color)] dark:hover:text-[#3D8BFF] hover:bg-white dark:hover:bg-[#1F2937] transition-colors text-sm sm:text-base"
      >
        {{ $t("faq.contact_support") }}
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: "FAQPage",
  data() {
    return {
      activeIndex: null,
    };
  },
  computed: {
    localizedFaqs() {
      try {
        const currentLocale = this.$i18n.locale;
        const faqs = this.$i18n.getLocaleMessage(currentLocale)?.faq?.questions;

        if (Array.isArray(faqs) && faqs.length > 0) {
          return faqs;
        }

        console.warn(
          "FAQ questions not available in the current language:",
          currentLocale
        );

        if (currentLocale !== "en") {
          const fallbackFaqs =
            this.$i18n.getLocaleMessage("en")?.faq?.questions;
          if (Array.isArray(fallbackFaqs) && fallbackFaqs.length > 0) {
            return fallbackFaqs;
          }
        }

        return [];
      } catch (error) {
        console.error("Error getting FAQs:", error);
        return [];
      }
    },
  },
  methods: {
    toggleFaq(index) {
      this.activeIndex = this.activeIndex === index ? null : index;
    },
  },
  mounted() {
    console.log("FAQ Page mounted with locale:", this.$i18n.locale);
  },
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
