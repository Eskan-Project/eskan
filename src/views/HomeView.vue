<template>
  <div>
    <!-- Hero Section -->
    <section
      class="relative h-screen md:h-screen w-full bg-fixed bg-cover bg-center flex items-center justify-center text-white px-4 sm:px-6 lg:px-8"
      :style="{
        backgroundImage: ImgForHeroSection
          ? `url(${ImgForHeroSection})`
          : `url('/fallback-hero.jpg')`,
      }"
      data-aos="fade-in"
    >
      <div
        class="text-center bg-[#36436585] p-4 sm:p-6 md:p-8 rounded-lg w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-4xl backdrop-blur-sm"
        data-aos="zoom-in"
      >
        <h1
          class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight"
        >
          {{ $t("home.hero.title") }}
        </h1>
        <p
          class="mt-3 sm:mt-4 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl max-w-md sm:max-w-lg md:max-w-xl mx-auto"
        >
          {{ $t("home.hero.description") }}
        </p>
      </div>
    </section>

    <!-- Features Section -->
    <section
      class="container mx-auto my-16 px-4 sm:px-6 lg:px-8 bg-white rounded-lg relative"
      data-aos="fade-up"
    >
      <h2
        class="w-full text-center text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-[#364365] absolute -top-5 left-1/2 -translate-x-1/2 px-4 bg-white"
      >
        {{ $t("home.features.section_title") }}
      </h2>
      <div
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 pt-14 sm:pt-16"
      >
        <feature-card
          v-for="(feature, index) in features"
          :key="feature.title"
          :feature="feature"
          :delay="index * 100"
          data-aos="flip-left"
          data-aos-delay="50"
        />
      </div>
    </section>

    <!-- Latest Properties Section -->
    <section
      class="py-8 sm:py-12 lg:py-20 relative overflow-hidden"
      data-aos="fade-up"
    >
      <!-- Background decorative elements -->
      <div
        class="absolute -top-20 -left-20 w-40 h-40 bg-[#364365]/5 rounded-full blur-3xl"
      ></div>
      <div
        class="absolute -bottom-20 -right-20 w-40 h-40 bg-[#364365]/5 rounded-full blur-3xl"
      ></div>

      <div class="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        <h2
          class="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8 text-[#364365] text-center relative"
        >
          <span class="relative inline-block">
            {{ $t("home.properties.section_title") }}
          </span>
        </h2>
        <div
          v-if="isLoading"
          class="text-gray-500 text-sm flex justify-center items-center py-6"
        >
          <div class="flex flex-col items-center">
            <div
              class="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#364365] mb-2"
            ></div>
            <span>{{ $t("home.properties.loading") }}</span>
          </div>
        </div>

        <!-- Swiper for Properties -->
        <div
          v-else-if="latestProperties.length && !error"
          class="relative swiper-container"
        >
          <swiper
            :slides-per-view="1"
            :space-between="20"
            :pagination="{
              clickable: true,
              dynamicBullets: true,
              el: '.swiper-pagination',
            }"
            :navigation="{
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            }"
            :autoplay="{ delay: 3000, disableOnInteraction: false }"
            :breakpoints="{
              '640': { slidesPerView: 2, spaceBetween: 20 },
              '768': { slidesPerView: 2, spaceBetween: 30 },
              '1024': { slidesPerView: 3, spaceBetween: 30 },
            }"
            :modules="swiperModules"
            @swiper="onSwiper"
            class="pb-16"
          >
            <swiper-slide
              v-for="(property, index) in latestProperties"
              :key="property.id"
              class="animate-slide-up"
              :style="{ animationDelay: `${index * 150}ms` }"
            >
              <property-card
                :property="property"
                :id="property.id"
                class="h-full transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:-translate-y-1 bg-white rounded-lg overflow-hidden shadow-md"
              />
            </swiper-slide>
          </swiper>

          <!-- Custom navigation and pagination elements -->
          <div class="swiper-pagination mt-6"></div>
        </div>

        <!-- Error State -->
        <p
          v-else-if="error"
          class="text-red-500 text-sm md:text-base py-4 text-center"
        >
          {{ $t("home.properties.error") }}
          <button
            @click="fetchProperties"
            class="text-blue-500 underline ml-2 mt-2 block sm:inline hover:text-blue-700 transition-colors duration-200"
          >
            {{ $t("home.properties.retry") }}
          </button>
        </p>

        <!-- Empty State -->
        <p
          v-if="latestProperties.length === 0"
          class="text-gray-500 text-sm md:text-base py-4 text-center"
        >
          {{ $t("home.properties.no_properties") }}
        </p>

        <!-- View All Button with Animation -->
        <div
          v-if="latestProperties.length > 3 && !error"
          class="mt-8 text-center"
        >
          <router-link
            to="/properties"
            class="inline-flex items-center px-5 py-2.5 bg-[#364365] text-white rounded-full hover:bg-[#4c5b87] transition-colors duration-300 text-sm group shadow-md hover:shadow-lg"
          >
            {{ $t("home.properties.view_all") }}
            <span
              class="ml-2 group-hover:translate-x-1 transition-transform duration-300"
              >→</span
            >
          </router-link>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section
      class="py-8 sm:py-12 lg:py-20 bg-[#DDE1EB] text-[#364365] text-center"
      data-aos="fade-up"
    >
      <div
        id="countup-section"
        class="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10"
      >
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="p-4 sm:p-6 bg-white/50 rounded-lg shadow-sm"
        >
          <count-up
            v-if="startCounting"
            :end-val="stat.value"
            :duration="stat.duration"
            class="text-2xl sm:text-3xl md:text-4xl font-bold"
          />
          <p class="text-base sm:text-lg md:text-xl mt-2">
            {{ $t(`home.stats.${stat.key}`) }}
          </p>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section
      class="relative min-h-[350px] sm:min-h-[400px] md:min-h-[450px] lg:min-h-[500px] w-full bg-fixed bg-cover bg-center"
      :style="{
        backgroundImage: ContactUsHomePage
          ? `url(${ContactUsHomePage})`
          : `url('/fallback-contact.jpg')`,
      }"
      data-aos="fade-in"
    >
      <div class="absolute inset-0 bg-[#053052]/80"></div>
      <div
        class="relative min-h-[450px] flex items-center justify-center px-4 sm:px-6 lg:px-8"
      >
        <div class="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8 py-10">
          <h2
            class="text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold leading-tight"
            data-aos="zoom-in"
          >
            {{ $t("home.contact.title") }}
          </h2>
          <p
            class="text-[#edeff6] text-xs sm:text-sm md:text-base lg:text-lg leading-5 sm:leading-6 max-w-md sm:max-w-lg md:max-w-2xl mx-auto"
            data-aos="zoom-in"
            data-aos-delay="100"
          >
            {{ $t("home.contact.description") }}
          </p>
          <router-link
            to="/contact"
            class="inline-block px-6 sm:px-8 py-3 sm:py-4 border border-white text-white text-base font-medium rounded-md hover:bg-white hover:text-[#053052] transition-colors"
            data-aos="fade-up"
          >
            {{ $t("home.contact.button") }}
          </router-link>
        </div>
      </div>
    </section>

    <!-- Back-to-Top Button -->
    <transition name="fade">
      <button
        v-if="showBackToTop"
        @click="scrollToTop"
        class="fixed bottom-4 right-4 bg-[#1d2f5e] text-white px-2 py-2 md:px-4 md:py-3 rounded-md shadow-lg hover:bg-[#607bbe] transition-colors cursor-pointer z-50"
        aria-label="Back to top"
      >
        <i class="bi bi-arrow-up text-base md:text-xl"></i>
      </button>
    </transition>
  </div>
</template>
<script>
import AOS from "aos";
import ContactUsHomePage from "../assets/images/ContactUsHomePage.jpg?url";
import heroSection from "../assets/images/heroSection.jpg?url";
import PropertyCard from "@/components/PropertyCard.vue";
import FeatureCard from "@/components/home/FeatureCard.vue";
import CountUp from "vue-countup-v3";
import { mapActions, mapGetters } from "vuex";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/autoplay";

export default {
  name: "HomeView",
  components: {
    PropertyCard,
    FeatureCard,
    CountUp,
    Swiper,
    SwiperSlide,
  },
  data: () => ({
    observer: null,
    startCounting: false,
    showBackToTop: false,
    ImgForHeroSection: heroSection,
    ContactUsHomePage,
    latestProperties: [],
    error: null,
    swiperModules: [Autoplay, Pagination, Navigation],
    features: [
      {
        icon: new URL(
          "../assets/images/icons/VerifyForHomePage.png",
          import.meta.url
        ).href,
        titleKey: "home.features.verified.title",
        descriptionKey: "home.features.verified.description",
      },
      {
        icon: new URL(
          "../assets/images/icons/BudgetForHomePage.png",
          import.meta.url
        ).href,
        titleKey: "home.features.budget.title",
        descriptionKey: "home.features.budget.description",
      },
      {
        icon: new URL(
          "../assets/images/icons/ContactForHomePage.png",
          import.meta.url
        ).href,
        titleKey: "home.features.contact.title",
        descriptionKey: "home.features.contact.description",
      },
      {
        icon: new URL(
          "../assets/images/icons/SmartForHomePage.png",
          import.meta.url
        ).href,
        titleKey: "home.features.smart.title",
        descriptionKey: "home.features.smart.description",
      },
      {
        icon: new URL(
          "../assets/images/icons/SecureForHomePage.png",
          import.meta.url
        ).href,
        titleKey: "home.features.secure.title",
        descriptionKey: "home.features.secure.description",
      },
      {
        icon: new URL(
          "../assets/images/icons/CurvedArrowForHomePage.png",
          import.meta.url
        ).href,
        titleKey: "home.features.flexible.title",
        descriptionKey: "home.features.flexible.description",
      },
    ],
    stats: [
      { value: 300, duration: 2, key: "properties_listed" },
      { value: 1000, duration: 2.5, key: "happy_customers" },
      { value: 150, duration: 2, key: "verified_owners" },
    ],
  }),
  computed: {
    ...mapGetters(["isLoading"]),
  },
  mounted() {
    AOS.init({ duration: 800, once: true });
    this.observeCountupSection();
    window.addEventListener("scroll", this.handleScroll, { passive: true });
    this.fetchProperties();
    this.fetchUserDetails();
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
    this.observer?.disconnect();
  },
  methods: {
    ...mapActions("property", ["getProperties"]),
    ...mapActions("auth", ["fetchUserDetails"]),
    async fetchProperties() {
      this.error = null;
      try {
        const properties = await this.getProperties();
        if (!Array.isArray(properties)) {
          throw new Error("Expected an array of properties");
        }
        this.latestProperties = properties.slice(0, 6);
        console.log("Fetched properties:", this.latestProperties);
      } catch (error) {
        this.error = "Failed to load properties. Please try again later.";
        console.error("Fetch properties error:", error.message);
      }
    },
    observeCountupSection() {
      const countupSection = document.getElementById("countup-section");
      if (!countupSection) return;

      this.observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            this.startCounting = true;
            this.observer.disconnect();
          }
        },
        { threshold: 0.5 }
      );
      this.observer.observe(countupSection);
    },
    handleScroll() {
      this.showBackToTop = window.scrollY > 110;
    },
    scrollToTop() {
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    onSwiper(swiper) {
      this.swiper = swiper;
      // Make sure modules are properly initialized
      setTimeout(() => {
        if (swiper && swiper.pagination && swiper.navigation) {
          swiper.pagination.update();
          swiper.navigation.update();
        }
      }, 100);
    },
  },
};
</script>

<style scoped>
.bg-primary {
  background-color: #364365;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 640px) {
  .bg-fixed {
    /* Fix for iOS Safari background-attachment: fixed issue */
    background-attachment: scroll;
  }
}

@keyframes slide-up {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-up {
  animation: slide-up 0.5s ease-out forwards;
}

@keyframes expand-line {
  0% {
    width: 0;
  }
  100% {
    width: 100%;
  }
}

.animate-expand-line {
  animation: expand-line 1s ease-out forwards;
  animation-delay: 0.5s;
}

/* Swiper pagination customization */
:deep(.swiper-pagination-bullet) {
  background-color: #364365;
  opacity: 0.5;
  transition: all 0.3s ease;
  width: 8px;
  height: 8px;
  margin: 0 4px;
}

:deep(.swiper-pagination-bullet-active) {
  background-color: #364365;
  opacity: 1;
  width: 12px;
  border-radius: 5px;
}

/* Swiper navigation buttons */
:deep(.swiper-button-next),
:deep(.swiper-button-prev) {
  color: #364365;
  background-color: rgba(255, 255, 255, 0.7);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

:deep(.swiper-button-next:after),
:deep(.swiper-button-prev:after) {
  font-size: 16px;
  font-weight: bold;
}

:deep(.swiper-button-disabled) {
  opacity: 0.35;
}

/* Container for proper positioning */
.swiper-container {
  position: relative;
  padding-bottom: 40px;
}

/* Swiper slide hover effect */
:deep(.swiper-slide) {
  transition: transform 0.3s ease;
}

:deep(.swiper-slide:hover) {
  z-index: 2;
}
</style>
