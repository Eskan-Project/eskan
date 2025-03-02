<template>
  <div>
    <!-- Hero Section -->
    <section
      class="relative h-screen w-full bg-fixed bg-cover bg-center flex items-center justify-center text-white px-4"
      :style="{ backgroundImage: `url(${ImgForHeroSection})` }"
    >
      <div class="text-center bg-[#36436585] p-5 rounded-lg w-[70%]">
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

    <!-- Features Section -->
    <section class="container mx-auto py-16">
      <h2 class="text-4xl font-semibold text-[#364365] text-center mb-12">
        Find Everything you need in one place
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
        <!-- Feature 1 -->
        <div class="flex flex-col items-center">
          <div
            class="w-24 h-24 rounded-full border-2 border-[#364365] flex items-center justify-center mb-4"
          >
            <i class="fas fa-shield-alt text-3xl text-[#364365]">
              <img src="../assets/images/icons/VerifyForHomePage.png" alt="" />
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

        <!-- Feature 2 -->
        <div class="flex flex-col items-center">
          <div
            class="w-24 h-24 rounded-full border-2 border-[#364365] flex items-center justify-center mb-4"
          >
            <i class="fas fa-dollar-sign text-3xl text-[#364365]">
              <img
                src="../assets/images/icons/BudgetForHomePage.png"
                alt="this is icon for $"
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

        <!-- Feature 3 -->
        <div class="flex flex-col items-center">
          <div
            class="w-24 h-24 rounded-full border-2 border-[#364365] flex items-center justify-center mb-4"
          >
            <i class="fas fa-user text-3xl text-[#364365]">
              <img src="../assets/images/icons/ContactForHomePage.png" alt="" />
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

        <!-- Feature 4 -->
        <div class="flex flex-col items-center">
          <div
            class="w-24 h-24 rounded-full border-2 border-[#364365] flex items-center justify-center mb-4"
          >
            <i class="fas fa-search text-3xl text-[#364365]">
              <img src="../assets/images/icons/SmartForHomePage.png" alt="" />
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

        <!-- Feature 5 -->
        <div class="flex flex-col items-center">
          <div
            class="w-24 h-24 rounded-full border-2 border-[#364365] flex items-center justify-center mb-4"
          >
            <i class="fas fa-lock text-3xl text-[#364365]">
              <img src="../assets/images/icons/SecureForHomePage.png" alt="" />
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

        <!-- Feature 6 -->
        <div class="flex flex-col items-center">
          <div
            class="w-24 h-24 rounded-full border-2 border-[#364365] flex items-center justify-center mb-4"
          >
            <i class="fas fa-sync text-3xl text-[#364365]">
              <img
                src="../assets/images/icons/CurvedArrowForHomePage.png"
                alt=""
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

    <!-- Latest Properties Section -->
    <section class="py-16">
      <div class="container mx-auto text-center">
        <h2 class="text-3xl font-bold mb-6">Latest Properties for Rent</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <PropertyCard
            v-for="(property, index) in properties"
            :key="index"
            :property="property"
          />
        </div>
      </div>
    </section>
    <!-- Stats Section -->
    <section class="py-16 bg-[#DDE1EB] text-[#364365] text-center mb-16">
      <div class="container mx-auto grid grid-cols-1 sm:grid-cols-3 gap-12">
        <div class="p-6">
          <h3 class="text-4xl font-bold mb-3">300+</h3>
          <p class="text-lg">Properties Listed</p>
        </div>
        <div class="p-6">
          <h3 class="text-4xl font-bold mb-3">1000+</h3>
          <p class="text-lg">Happy Customers</p>
        </div>
        <div class="p-6">
          <h3 class="text-4xl font-bold mb-3">150+</h3>
          <p class="text-lg">Verified Owners</p>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <section
      class="relative h-[508px] w-full bg-fixed bg-cover bg-center mt-16"
      :style="{ backgroundImage: `url(${ContactUsHomePage})` }"
    >
      <div class="absolute inset-0 bg-[#053052]/80"></div>
      <div class="relative h-full flex flex-col items-center justify-center">
        <div class="max-w-4xl mx-auto text-center space-y-8">
          <div
            class="text-white text-[40px] font-semibold font-['Inter'] leading-[48px]"
          >
            Find Your Perfect Home
          </div>
          <div
            class="text-[#edeff6] text-xl font-normal font-['Inter'] leading-7 max-w-[696px] px-4"
          >
            Have questions or need assistance? Reach out to us, we're here to
            make your housing search seamless and stress-free
          </div>
          <div class="mt-12">
            <router-link
              to="./contact"
              class="px-8 py-4 border border-white text-white text-base font-medium font-['Inter'] rounded hover:bg-white hover:text-[#053052] transition-colors"
            >
              Contact Us
            </router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.bg-primary {
  background-color: #364365;
}
</style>

<script>
import ContactUsHomePage from "../assets/images/ContactUsHomePage.jpg";
import PropertyCard from "@/components/PropertyCard.vue";
import heroSection from "../assets/images/heroSection.jpg";
export default {
  components: { PropertyCard },
  data() {
    return {
      ImgForHeroSection: heroSection,
      ContactUsHomePage: ContactUsHomePage,
      properties: [
        {
          title: "Apartment for sale",
          location: "London, Oxford St.",
          price: "290,000",
          size: "150",
          rooms: "3",
          units: "10",
        },
        {
          title: "Luxury Condo",
          location: "New York, Times Sq.",
          price: "450,000",
          size: "180",
          rooms: "4",
          units: "5",
        },
        {
          title: "Apartment for sale",
          location: "London, Oxford St.",
          price: "290,000",
          size: "150",
          rooms: "3",
          units: "10",
        },
        {
          title: "Apartment for sale",
          location: "London, Oxford St.",
          price: "290,000",
          size: "150",
          rooms: "3",
          units: "10",
        },
        {
          title: "Luxury Condo",
          location: "New York, Times Sq.",
          price: "450,000",
          size: "180",
          rooms: "4",
          units: "5",
        },
        {
          title: "Apartment for sale",
          location: "London, Oxford St.",
          price: "290,000",
          size: "150",
          rooms: "3",
          units: "10",
        },
      ],
    };
  },

  name: "HomeView",
};
</script>
<style scoped>
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
