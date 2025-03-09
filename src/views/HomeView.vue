<template>
  <div>
    <section
      class="relative h-screen w-full bg-fixed bg-cover bg-center flex items-center justify-center text-white px-4"
      :style="{
        backgroundImage: ImgForHeroSection
          ? `url(${ImgForHeroSection})`
          : 'none',
      }"
      data-aos="fade-in"
    >
      <div
        class="text-center bg-[#36436585] p-5 rounded-lg w-full max-w-3xl"
        data-aos="zoom-in"
      >
        <h1 class="text-4xl md:text-6xl font-bold">
          Your New Home Away from Home
        </h1>
        <p class="mt-4 text-lg max-w-xl mx-auto">
          Find your perfect shared accommodation with ease. Whether you're
          moving for work, study, or adventure, Eskan connects you with safe,
          affordable, and verified housing options tailored to your needs.
        </p>
      </div>
    </section>

    <section
      class="container mx-auto my-16 px-4 bg-white rounded-lg relative"
      data-aos="fade-up"
    >
      <h2
        class="text-4xl font-semibold text-[#364365] text-center absolute -top-5 left-1/2 -translate-x-1/2"
      >
        Find Everything You Need in One Place
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-10">
        <feature-card
          v-for="(feature, index) in features"
          :key="index"
          :feature="feature"
          :delay="index * 100"
          data-aos="flip-left"
        />
      </div>
    </section>

    <section class="py-16" data-aos="fade-up">
      <div class="container mx-auto text-center">
        <h2 class="text-3xl font-bold mb-6 text-[#364365]">
          Latest Properties for Rent
        </h2>
        <div
          v-if="latestProperties.length && !error"
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
        >
          <property-card
            v-for="property in latestProperties"
            :key="property.id"
            :property="property"
            data-aos="zoom-in"
          />
        </div>
        <p v-else-if="!error" class="text-gray-500">Loading properties...</p>
        <p v-else class="text-red-500">
          Failed to load properties. Please try again later.
        </p>
      </div>
    </section>

    <section
      class="py-16 bg-[#DDE1EB] text-[#364365] text-center"
      data-aos="fade-up"
    >
      <div
        id="countup-section"
        class="container mx-auto grid grid-cols-1 sm:grid-cols-3 gap-12"
      >
        <div v-for="(stat, index) in stats" :key="index" class="p-6">
          <count-up
            v-if="startCounting"
            :end-val="stat.value"
            :duration="stat.duration"
            class="text-2xl font-bold"
          />
          <p class="text-lg mt-2">{{ stat.label }}</p>
        </div>
      </div>
    </section>

    <section
      class="relative h-[508px] w-full bg-fixed bg-cover bg-center"
      :style="{
        backgroundImage: ContactUsHomePage
          ? `url(${ContactUsHomePage})`
          : 'none',
      }"
      data-aos="fade-in"
    >
      <div class="absolute inset-0 bg-[#053052]/80"></div>
      <div class="relative h-full flex items-center justify-center">
        <div class="max-w-4xl mx-auto text-center space-y-8 px-4">
          <h2
            class="text-white text-4xl font-semibold leading-tight"
            data-aos="zoom-in"
          >
            Find Your Perfect Home
          </h2>
          <p
            class="text-[#edeff6] text-xl leading-7 max-w-3xl"
            data-aos="zoom-in"
            data-aos-delay="100"
          >
            Have questions or need assistance? Reach out to us—we're here to
            make your housing search seamless and stress-free.
          </p>
          <router-link
            to="/contact"
            class="inline-block px-8 py-4 border border-white text-white text-base font-medium rounded hover:bg-white hover:text-[#053052] transition-colors"
            data-aos="fade-up"
          >
            Contact Us
          </router-link>
        </div>
      </div>
    </section>

    <transition name="fade">
      <button
        v-if="showBackToTop"
        @click="scrollToTop"
        class="fixed bottom-5 right-5 bg-[#1d2f5e] text-white px-5 py-4 rounded-md shadow-lg hover:bg-[#607bbe] transition-colors cursor-pointer"
      >
        <i class="bi bi-arrow-up text-xl"></i>
      </button>
    </transition>
  </div>
</template>

<script>
import AOS from "aos";
import ContactUsHomePage from "../assets/images/ContactUsHomePage.jpg?url"; // Add ?url for Vite
import heroSection from "../assets/images/heroSection.jpg?url"; // Add ?url for Vite
import PropertyCard from "@/components/PropertyCard.vue";
import FeatureCard from "@/components/home/FeatureCard.vue";
import CountUp from "vue-countup-v3";
import { mapActions } from "vuex";

export default {
  name: "HomeView",
  components: { PropertyCard, FeatureCard, CountUp },
  data() {
    return {
      startCounting: false,
      showBackToTop: false,
      ImgForHeroSection: null,
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
    };
  },
  mounted() {
    AOS.init({ duration: 800, once: true });
    this.observeCountupSection();
    window.addEventListener("scroll", this.handleScroll, { passive: true });
    this.fetchProperties();
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
    this.observer?.disconnect();
  },
  methods: {
    ...mapActions(["startLoading", "stopLoading"]),
    async fetchProperties() {
      this.startLoading();
      this.error = null;

      try {
        const imagePromise = this.preloadImage(heroSection);

        const propertiesPromise = fetch(
          "https://eskan-project-14c3b-default-rtdb.europe-west1.firebasedatabase.app/properties.json",
          { cache: "no-store" }
        ).then(async (response) => {
          if (!response.ok)
            throw new Error(`HTTP error! Status: ${response.status}`);
          const data = await response.json();
          if (!data) throw new Error("No properties data received");
          return Object.entries(data)
            .map(([id, value]) => ({ id, ...value.data }))
            .slice(0, 6);
        });

        const [_, properties] = await Promise.all([
          imagePromise,
          propertiesPromise,
        ]);
        this.ImgForHeroSection = heroSection;
        this.latestProperties = properties;
      } catch (error) {
        console.error("Error fetching properties:", error);
        this.error = error.message;
        this.latestProperties = [];
      } finally {
        this.stopLoading();
      }
    },
    preloadImage(url) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = url;
        img.onload = resolve;
        img.onerror = () => reject(new Error("Failed to load hero image"));
      });
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
