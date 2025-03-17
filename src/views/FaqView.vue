<template>
  <div
    class="faq-container min-h-screen bg-gray-50 py-8 sm:py-12 px-4 sm:px-6 lg:px-8 mt-10 sm:mt-0"
  >
    <div class="max-w-4xl mx-auto text-center mb-8 sm:mb-12">
      <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
        Frequently Asked Questions
      </h1>
      <p class="text-base sm:text-lg text-gray-600">
        Find answers to common questions about using Eskan for your housing
        needs
      </p>
    </div>
    <div class="max-w-4xl mx-auto">
      <div class="space-y-3 sm:space-y-4">
        <div
          v-for="(faq, index) in faqs"
          :key="index"
          class="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <button
            @click="toggleFaq(index)"
            class="w-full flex justify-between items-center p-4 sm:p-5 text-left focus:outline-none cursor-pointer"
            :class="{ 'bg-indigo-50': activeIndex === index }"
          >
            <span class="text-base sm:text-lg font-medium text-gray-900 pr-2">
              {{ faq.question }}
            </span>
            <span class="text-indigo-600 flex-shrink-0">
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
              class="p-4 sm:p-5 border-t border-gray-200"
            >
              <p class="text-sm sm:text-base text-gray-700">{{ faq.answer }}</p>
            </div>
          </transition>
        </div>
      </div>
    </div>

    <div class="mt-8 sm:mt-12 text-center">
      <p class="text-gray-600 mb-4">
        Still have questions? We're here to help!
      </p>
      <a
        href="/contact"
        class="inline-block bg-[var(--secondary-color)] border border-[var(--secondary-color)] text-white font-semibold py-2 px-4 sm:py-3 sm:px-6 rounded-lg hover:text-[var(--secondary-color)] hover:bg-white transition-colors text-sm sm:text-base"
      >
        Contact Support
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
      faqs: [
        {
          question: "How do I search for housing on Eskan?",
          answer:
            "Simply log in as a regular user, select your target governorate, and use the search and filter options to find shared housing that matches your preferences like price, location, and amenities.",
        },
        {
          question: "How can I list my property?",
          answer:
            "Register as a property owner, submit your legal documents for verification, attend an online verification meeting, and then create your listing. Your first listing is free for three days!",
        },
        {
          question: "What does the verification process entail?",
          answer:
            "Property owners must submit legal documents and attend an online meeting via Zoom or Microsoft Teams. Our admins will review everything to ensure safety and authenticity.",
        },
        {
          question: "How does the subscription work for property owners?",
          answer:
            "After the free 3-day period for your first listing, you can choose a per-listing subscription or an annual plan to continue posting and managing your properties.",
        },
        {
          question: "How can I contact a property owner?",
          answer:
            "Regular users get 1-2 free contacts. For unlimited access to owner details, you can subscribe monthly or purchase a package with a set number of unlocks.",
        },
      ],
    };
  },
  methods: {
    toggleFaq(index) {
      this.activeIndex = this.activeIndex === index ? null : index;
    },
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
