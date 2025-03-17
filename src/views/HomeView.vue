<template>
  <div>
    <!-- Hero Section -->
    <section
      class="relative h-screen w-full bg-fixed bg-cover bg-center flex items-center justify-center text-white px-4 sm:px-6 lg:px-8"
      :style="{
        backgroundImage: ImgForHeroSection
          ? `url(${ImgForHeroSection})`
          : `url('/fallback-hero.jpg')`,
      }"
      data-aos="fade-in"
    >
      <div
        class="text-center bg-[#36436585] p-4 sm:p-6 md:p-8 rounded-lg w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-4xl"
        data-aos="zoom-in"
      >
        <h1
          class="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
        >
          Your New Home Away from Home
        </h1>
        <p
          class="mt-3 sm:mt-4 text-xs sm:text-base md:text-lg lg:text-xl max-w-md sm:max-w-lg md:max-w-xl mx-auto"
        >
          Find your perfect shared accommodation with ease. Whether you're
          moving for work, study, or adventure, Eskan connects you with safe,
          affordable, and verified housing options tailored to your needs.
        </p>
      </div>
    </section>

    <!-- Features Section -->
    <section
      class="container mx-auto my-12 sm:my-16 lg:my-20 px-4 sm:px-6 lg:px-8 bg-white rounded-lg relative"
      data-aos="fade-up"
    >
      <h2
        class="text-lg sm:text-3xl md:text-4xl font-semibold text-[#364365] absolute -top-5 left-1/2 -translate-x-1/2"
      >
        Find Everything You Need in One Place
      </h2>
      <div
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 pt-12 sm:pt-16"
      >
        <feature-card
          v-for="(feature, index) in features"
          :key="feature.title"
          :feature="feature"
          :delay="index * 100"
          data-aos="flip-left"
        />
      </div>
    </section>

    <!-- Latest Properties Section -->
    <section class="py-12 sm:py-16 lg:py-20" data-aos="fade-up">
      <div class="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2
          class="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 text-[#364365] text-center"
        >
          Latest Properties for Rent
        </h2>
        <div
          v-if="isLoading"
          class="text-gray-500 text-sm sm:text-base md:text-lg"
        >
          Loading properties...
        </div>
        <div
          v-else-if="latestProperties.length && !error"
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10"
        >
          <property-card
            v-for="property in latestProperties"
            :key="property.id"
            :property="property"
            data-aos="zoom-in"
          />
        </div>
        <p
          v-else-if="error"
          class="text-red-500 text-sm sm:text-base md:text-lg"
        >
          {{ error }}
          <button @click="fetchProperties" class="text-blue-500 underline ml-2">
            Retry
          </button>
        </p>
        <p v-else class="text-gray-500 text-sm sm:text-base md:text-lg">
          No properties available.
        </p>
      </div>
    </section>

    <!-- Stats Section -->
    <section
      class="py-12 sm:py-16 lg:py-20 bg-[#DDE1EB] text-[#364365] text-center"
      data-aos="fade-up"
    >
      <div
        id="countup-section"
        class="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12"
      >
        <div v-for="stat in stats" :key="stat.label" class="p-4 sm:p-6">
          <count-up
            v-if="startCounting"
            :end-val="stat.value"
            :duration="stat.duration"
            class="text-xl sm:text-2xl md:text-3xl font-bold"
          />
          <p class="text-base sm:text-lg md:text-xl mt-2">{{ stat.label }}</p>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section
      class="relative min-h-[400px] sm:min-h-[450px] md:min-h-[500px] w-full bg-fixed bg-cover bg-center"
      :style="{
        backgroundImage: ContactUsHomePage
          ? `url(${ContactUsHomePage})`
          : `url('/fallback-contact.jpg')`,
      }"
      data-aos="fade-in"
    >
      <div class="absolute inset-0 bg-[#053052]/80"></div>
      <div class="relative min-h-[400px] flex items-center justify-center">
        <div
          class="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8 px-4 sm:px-6 lg:px-8"
        >
          <h2
            class="text-white text-2xl sm:text-3xl md:text-4xl font-semibold leading-tight"
            data-aos="zoom-in"
          >
            Find Your Perfect Home
          </h2>
          <p
            class="text-[#edeff6] text-sm sm:text-base md:text-lg lg:text-xl leading-6 sm:leading-7 max-w-md sm:max-w-lg md:max-w-2xl"
            data-aos="zoom-in"
            data-aos-delay="100"
          >
            Have questions or need assistance? Reach out to us—we're here to
            make your housing search seamless and stress-free.
          </p>
          <router-link
            to="/contact"
            class="inline-block px-6 sm:px-8 py-3 sm:py-4 border border-white text-white text-sm sm:text-base font-medium rounded-md hover:bg-white hover:text-[#053052] transition-colors"
            data-aos="fade-up"
          >
            Contact Us
          </router-link>
        </div>
      </div>
    </section>

    <!-- Back-to-Top Button -->
    <transition name="fade">
      <button
        v-if="showBackToTop"
        @click="scrollToTop"
        class="fixed bottom-4 sm:bottom-5 right-2 sm:right-5 bg-[#1d2f5e] text-white px-2 sm:px-5 py-1 sm:py-4 rounded-md shadow-lg hover:bg-[#607bbe] transition-colors cursor-pointer"
      >
        <i class="bi bi-arrow-up text-base sm:text-xl"></i>
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

export default {
  name: "HomeView",
  components: { PropertyCard, FeatureCard, CountUp },
  data: () => ({
    observer: null,
    startCounting: false,
    showBackToTop: false,
    ImgForHeroSection: heroSection,
    ContactUsHomePage,
    latestProperties: [],
    error: null,
    features: [
      {
        icon: new URL(
          "../assets/images/icons/VerifyForHomePage.png",
          import.meta.url
        ).href,
        title: "Verified & Safe Listings",
        description:
          "Browse properties screened for safety, with verified owners and legal documentation",
      },
      {
        icon: new URL(
          "../assets/images/icons/BudgetForHomePage.png",
          import.meta.url
        ).href,
        title: "Budget-Friendly Options",
        description:
          "Discover shared accommodations designed for affordability without compromising comfort",
      },
      {
        icon: new URL(
          "../assets/images/icons/ContactForHomePage.png",
          import.meta.url
        ).href,
        title: "Free Initial Contact",
        description:
          "Reach out to property owners for free—unlock unlimited access with flexible subscriptions",
      },
      {
        icon: new URL(
          "../assets/images/icons/SmartForHomePage.png",
          import.meta.url
        ).href,
        title: "Smart Search Filters",
        description:
          "Refine your search by price, location, amenities, and room type—find your ideal match in seconds",
      },
      {
        icon: new URL(
          "../assets/images/icons/SecureForHomePage.png",
          import.meta.url
        ).href,
        title: "Secure Payments",
        description:
          "Enjoy hassle-free transactions with trusted payment gateways like Stripe or PayPal",
      },
      {
        icon: new URL(
          "../assets/images/icons/CurvedArrowForHomePage.png",
          import.meta.url
        ).href,
        title: "Flexible Subscriptions",
        description:
          "Owners: List your first property free for 3 days. Users: Unlock premium features with tailored plans",
      },
    ],
    stats: [
      { value: 300, duration: 2, label: "Properties Listed" },
      { value: 1000, duration: 2.5, label: "Happy Customers" },
      { value: 150, duration: 2, label: "Verified Owners" },
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
        console.log(properties);
        this.latestProperties = properties?.slice(0, 3) || [];
        console.log(this.latestProperties);
      } catch (error) {
        this.error = "Failed to load properties. Please try again later.";
        console.error("Fetch properties error:", error);
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
</style>
