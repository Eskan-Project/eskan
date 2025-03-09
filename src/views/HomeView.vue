<template>
  <div>
    <section
      class="relative h-screen w-full bg-fixed bg-cover bg-center flex items-center justify-center text-white px-4"
      :style="{ backgroundImage: `url(${ImgForHeroSection})` }"
      data-aos="fade-in"
    >
      <div
        class="text-center bg-[#36436585] p-5 rounded-lg w-[70%]"
        data-aos="zoom-in"
      >
        <h1 class="text-4xl md:text-6xl font-bold">
          Your New Home Away from Home
        </h1>
        <p class="mt-4 text-lg w-[60%] text-center m-auto">
          Find your perfect shared accommodation with ease. Whether you're
          moving for work, study, or adventure, Eskan connects you with safe,
          affordable, and verified housing options tailored to your needs.
        </p>
      </div>
    </section>
    <section
      class="container mx-auto pb-6 my-16 px-2 bg-white rounded-lg"
      data-aos="fade-up"
    >
      <h2 class="text-4xl font-semibold text-[#364365] text-center py-6">
        Find Everything you need in one place
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
        <div class="flex flex-col items-center" data-aos="flip-left">
          <div
            class="w-24 h-24 rounded-full border-2 border-[#364365] flex items-center justify-center mb-4"
          >
            <i class="fas fa-shield-alt text-3xl text-[#364365]">
              <img
                loading="lazy"
                src="../assets/images/icons/VerifyForHomePage.png"
                alt="Verified Icon"
              />
            </i>
          </div>
          <h3 class="text-[#364365] text-lg font-semibold mb-2">
            Verified & Safe Listings
          </h3>
          <p class="text-[#364365] text-sm text-center">
            Browse properties screened for safety, with verified owners and
            legal documentation
          </p>
        </div>

        <div
          class="flex flex-col items-center"
          data-aos="flip-left"
          data-aos-delay="100"
        >
          <div
            class="w-24 h-24 rounded-full border-2 border-[#364365] flex items-center justify-center mb-4"
          >
            <i class="fas fa-dollar-sign text-3xl text-[#364365]">
              <img
                loading="lazy"
                src="../assets/images/icons/BudgetForHomePage.png"
                alt="Budget Icon"
              />
            </i>
          </div>
          <h3 class="text-[#364365] text-lg font-semibold mb-2">
            Budget-Friendly Options
          </h3>
          <p class="text-[#364365] text-sm text-center">
            Discover shared accommodations designed for affordability without
            compromising comfort
          </p>
        </div>

        <div
          class="flex flex-col items-center"
          data-aos="flip-left"
          data-aos-delay="200"
        >
          <div
            class="w-24 h-24 rounded-full border-2 border-[#364365] flex items-center justify-center mb-4"
          >
            <i class="fas fa-user text-3xl text-[#364365]">
              <img
                loading="lazy"
                src="../assets/images/icons/ContactForHomePage.png"
                alt="Contact Icon"
              />
            </i>
          </div>
          <h3 class="text-[#364365] text-lg font-semibold mb-2">
            Free Initial Contact
          </h3>
          <p class="text-[#364365] text-sm text-center">
            Reach out to property owners for free—unlock unlimited access with
            flexible subscriptions
          </p>
        </div>

        <div
          class="flex flex-col items-center"
          data-aos="flip-left"
          data-aos-delay="300"
        >
          <div
            class="w-24 h-24 rounded-full border-2 border-[#364365] flex items-center justify-center mb-4"
          >
            <i class="fas fa-search text-3xl text-[#364365]">
              <img
                loading="lazy"
                src="../assets/images/icons/SmartForHomePage.png"
                alt="Smart Search Icon"
              />
            </i>
          </div>
          <h3 class="text-[#364365] text-lg font-semibold mb-2">
            Smart Search Filters
          </h3>
          <p class="text-[#364365] text-sm text-center">
            Refine your search by price, location, amenities, and room type—find
            your ideal match in seconds
          </p>
        </div>

        <div
          class="flex flex-col items-center"
          data-aos="flip-left"
          data-aos-delay="400"
        >
          <div
            class="w-24 h-24 rounded-full border-2 border-[#364365] flex items-center justify-center mb-4"
          >
            <i class="fas fa-lock text-3xl text-[#364365]">
              <img
                loading="lazy"
                src="../assets/images/icons/SecureForHomePage.png"
                alt="Secure Payments Icon"
              />
            </i>
          </div>
          <h3 class="text-[#364365] text-lg font-semibold mb-2">
            Secure Payments
          </h3>
          <p class="text-[#364365] text-sm text-center">
            Enjoy hassle-free transactions with trusted payment gateways like
            Stripe or PayPal
          </p>
        </div>

        <div
          class="flex flex-col items-center"
          data-aos="flip-left"
          data-aos-delay="500"
        >
          <div
            class="w-24 h-24 rounded-full border-2 border-[#364365] flex items-center justify-center mb-4"
          >
            <i class="fas fa-sync text-3xl text-[#364365]">
              <img
                loading="lazy"
                src="../assets/images/icons/CurvedArrowForHomePage.png"
                alt="Flexible Subscriptions Icon"
              />
            </i>
          </div>
          <h3 class="text-[#364365] text-lg font-semibold mb-2">
            Flexible Subscriptions
          </h3>
          <p class="text-[#364365] text-sm text-center">
            Owners: List your first property free for 3 days. Users: Unlock
            premium features with tailored plans
          </p>
        </div>
      </div>
    </section>

    <section class="py-16" data-aos="fade-up">
    <div class="container mx-auto text-center">
      <h2 class="text-3xl font-bold mb-6 text-[#364365]">
        Latest Properties for Rent
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <PropertyCard
          v-for="(property, index) in latestProperties"
          :key="index"
          :property="property"
          data-aos="zoom-in"
        />
      </div>
    </div>
  </section>

    <section
      class="py-16 bg-[#DDE1EB] text-[#364365] text-center mb-16"
      data-aos="fade-up"
    >
      <div
        id="countup-section"
        class="container mx-auto grid grid-cols-1 sm:grid-cols-3 gap-12"
      >
        <div class="p-6 text-center">
          <CountUp
            v-if="startCounting"
            :end-val="300"
            :duration="2"
            class="text-2xl font-bold"
          />
          <p class="text-lg mt-2">Properties Listed</p>
        </div>
        <div class="p-6 text-center">
          <CountUp
            v-if="startCounting"
            :end-val="1000"
            :duration="2.5"
            class="text-2xl font-bold"
          />
          <p class="text-lg mt-2">Happy Customers</p>
        </div>
        <div class="p-6 text-center">
          <CountUp
            v-if="startCounting"
            :end-val="150"
            :duration="2"
            class="text-2xl font-bold"
          />
          <p class="text-lg mt-2">Verified Owners</p>
        </div>
      </div>
    </section>

    <section
      class="relative h-[508px] w-full bg-fixed bg-cover bg-center mt-16"
      :style="{ backgroundImage: `url(${ContactUsHomePage})` }"
      data-aos="fade-in"
    >
      <div class="absolute inset-0 bg-[#053052]/80"></div>
      <div class="relative h-full flex flex-col items-center justify-center">
        <div class="max-w-4xl mx-auto text-center space-y-8">
          <div
            class="text-white text-[40px] font-semibold leading-[48px]"
            data-aos="zoom-in"
          >
            Find Your Perfect Home
          </div>
          <div
            class="text-[#edeff6] text-xl font-normal leading-7 max-w-[696px] px-4"
            data-aos="zoom-in"
            data-aos-delay="100"
          >
            Have questions or need assistance? Reach out to us, we're here to
            make your housing search seamless and stress-free
          </div>
          <div class="mt-12" data-aos="fade-up">
            <router-link
              to="./contact"
              class="px-8 py-4 border border-white text-white text-base font-medium rounded hover:bg-white hover:text-[#053052] transition-colors"
            >
              Contact Us
            </router-link>
            <button @click="getData">Get</button>
          </div>
        </div>
      </div>
    </section>
    <button
      v-show="showBackToTop"
      @click="scrollToTop"
      class="fixed cursor-pointer bottom-5 right-5 bg-[#1d2f5e] text-white px-5 py-4 rounded-md shadow-lg transition-opacity duration-300 hover:bg-[#607bbe]"
    >
      <i class="bi bi-arrow-up text-xl"></i>
    </button>
  </div>
</template>

<script>
import AOS from "aos";
import ContactUsHomePage from "../assets/images/ContactUsHomePage.jpg";
import PropertyCard from "@/components/PropertyCard.vue";
import heroSection from "../assets/images/heroSection.jpg";
import CountUp from "vue-countup-v3";

export default {
  name: "HomeView",
  components: { PropertyCard, CountUp },
  data() {
    return {
      startCounting: false,
      showBackToTop: false,
      ImgForHeroSection: heroSection,
      ContactUsHomePage: ContactUsHomePage,
      latestProperties: [],
     
    };
  },
  mounted() {
    AOS.init({
      duration: 800,
      once: true,
    });
    window.addEventListener("scroll", this.handleScroll);
    this.fetchProperties();
  },
  methods: {
    async fetchProperties() {
      try {
        const response = await fetch(
          "https://eskan-project-14c3b-default-rtdb.europe-west1.firebasedatabase.app/properties.json"
        );
        const data = await response.json();
        if (data) {
          const propertiesArray = Object.entries(data).map(([key, value]) => ({
            id: key,
            ...value.data,
          }));

        
          this.latestProperties = propertiesArray.slice(0, 6);
          console.log("Latest Properties:", this.latestProperties);
        }
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    },
  
    handleScroll() {
      const countupSection = document.getElementById("countup-section");
      if (countupSection) {
        const rect = countupSection.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom >= 0) {
          this.startCounting = true;
          window.removeEventListener("scroll", this.handleScroll);
        }
      }
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
.home {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
h1 {
  text-align: center;
  color: #fff;
}
</style>
