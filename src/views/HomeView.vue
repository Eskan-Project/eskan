<template >
  <div :dir="isRTL ? 'rtl' : 'ltr'" class="bg-gradient-to-br from-[#364365] via-[#2c3e50] to-[#1e2a38] 
  dark:bg-gradient-to-br dark:from-[#111827] dark:via-[#111827] dark:to-[##111827]">
   <section
     class="relative w-full flex items-center justify-center text-white px-4 sm:px-8 md:px-12 lg:px-20"
     style="min-height: 100vh;"
   >
     <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center w-full max-w-7xl p-4 sm:p-6 md:p-8 lg:p-12 rounded-xl">
 
       <div class="relative flex justify-center items-center order-1 md:order-2 ">
         <div class="relative overflow-visible" :style="{ width: imageSize.width, height: imageSize.height }">
           <div
             class="absolute bg-gray-300 dark:bg-gray-300 rounded-3xl p-5 flex items-center justify-center skew-x-6 rotate-6"
             :style="{ width: imageSize.width, height: imageSize.height }"
           >
             <img
               :src="ImgForHeroSection ? ImgForHeroSection : '/fallback-hero.jpg'"
               alt="Property Image"
               class="w-[90%] h-[90%] object-cover sm:mt-4 rounded-xl border-4 dark:border-2 border-gray-400 dark:border-[#0F318E] transform rotate-[-6deg]"
             />
           </div>
         </div>
       </div>
 
       <div class="text-left order-2 md:order-1" >
         <h1
           class="text-2xl sm:text-3xl md:text-2xl lg:text-4xl xl:text-5xl font-extrabold leading-tight text-white dark:text-gray-200 drop-shadow-[0_5px_10px_rgba(0,0,0,0.5)] dark:drop-shadow-[0_5px_10px_rgba(0,0,55,0.5)]"
           :class="{ 'text-right': isRTL, 'text-left': !isRTL }"
         >
           {{ $t('home.hero.title') }} <br />
         </h1>
 
         <p
           class="mt-3 md:max-w-lg text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-gray-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
           :class="{ 'text-right': isRTL, 'text-left': !isRTL }"
         >
           {{ $t('home.hero.description') }}
         </p>
 
         <div class="mt-5 flex justify-center md:justify-start">
           <button
             @click="$router.push('/properties')"
             class="px-4 sm:px-6 py-2 sm:py-3 bg-gray-300 dark:bg-[#0F318E] text-[#364365] dark:text-white font-semibold text-xs sm:text-sm md:text-base lg:text-lg rounded-full hover:bg-gray-400 shadow-[0_4px_8px_rgba(0,0,0,0.4)] transition transform hover:scale-110"
           >
             {{ $t('home.hero.find_home_button') }}
           </button>
         </div>
         <div class="mt-6 flex flex-wrap md:flex-nowrap lg:flex-wrap lg:gap-4 md:gap-2 sm:gap-6 justify-center md:justify-start" :class="{ 'flex-row-reverse': isRTL }">
           <div class="text-center drop-shadow-[0_3px_6px_rgba(0,0,0,0.3)]" :class="{ 'ml-0 md:ml-auto': isRTL, 'mr-0 md:mr-auto': !isRTL }">
             <span class="text-xl sm:text-xl md:text-md lg:text-3xl xl:text-4xl font-bold text-gray-200">{{ $t('home.hero.premium_product_count') }}</span>
             <p class="text-gray-400 text-xs sm:text-sm md:text-sm">{{ $t("home.hero.premium_product_label") }}</p>
           </div>
           <div class="text-center drop-shadow-[0_3px_6px_rgba(0,0,0,0.3)]" :class="{ 'ml-0 md:ml-auto': isRTL, 'mr-0 md:mr-auto': !isRTL }">
             <span class="text-xl sm:text-xl md:text-md lg:text-3xl xl:text-4xl font-bold text-gray-200">{{ $t('home.hero.happy_customers_count') }}</span>
             <p class="text-gray-400 text-xs sm:text-sm md:text-sm">{{ $t('home.hero.happy_customers_label') }}</p>
           </div>
           <div class="text-center drop-shadow-[0_3px_6px_rgba(0,0,0,0.3)]" :class="{ 'ml-0 md:ml-auto': isRTL, 'mr-0 md:mr-auto': !isRTL }">
             <span class="text-xl sm:text-xl md:text-md lg:text-3xl xl:text-4xl font-bold text-gray-200">{{ $t('home.hero.award_winning_count') }}</span>
             <p class="text-gray-400 text-xs sm:text-sm md:text-sm">{{ $t('home.hero.award_winning_label') }}</p>
           </div>
         </div>
       </div>
     </div>
   </section>
   <section
   class="container mx-auto px-4 py-12 sm:py-16 pb-16 sm:px-6 lg:px-8 relative overflow-hidden -mt-0.5 md:-mt-1"
   style="z-index: 2; "
 >
 <svg
   class="absolute top-0 left-0 w-full h-full opacity-10 text-blue-300"
   style="z-index: -1; filter: blur(1px);"
   viewBox="0 0 100 30"
   xmlns="http://www.w3.org/2000/svg"
   preserveAspectRatio="xMidYMid slice"
 >
   <defs>
     <pattern id="building-pattern" width="20" height="30" patternUnits="userSpaceOnUse">
       <rect x="1" y="1" width="18" height="28" fill="none" stroke="currentColor" stroke-width="1" />
       <rect x="5" y="5" width="4" height="4" fill="currentColor" fill-opacity="0.2" />
       <rect x="11" y="5" width="4" height="4" fill="currentColor" fill-opacity="0.2" />
       <rect x="5" y="15" width="4" height="4" fill="currentColor" fill-opacity="0.2" />
       <rect x="11" y="15" width="4" height="4" fill="currentColor" fill-opacity="0.2" />
       <rect x="5" y="25" width="10" height="3" fill="currentColor" fill-opacity="0.3" />
     </pattern>
 
     <pattern id="roof-pattern" width="40" height="15" patternUnits="userSpaceOnUse">
       <polygon points="0,15 20,0 40,15" fill="currentColor" fill-opacity="0.15" />
     </pattern>
   </defs>
 
   <rect x="5" y="0" width="15" height="22" fill="url(#building-pattern)" transform="translate(0, 8)" />
   <rect x="5" y="0" width="15" height="8" fill="url(#roof-pattern)" transform="translate(0, 0)" />
 
   <rect x="25" y="0" width="20" height="25" fill="url(#building-pattern)" transform="translate(0, 5)" />
   <rect x="25" y="0" width="20" height="7" fill="url(#roof-pattern)" transform="translate(0, -2)" />
 
   <rect x="50" y="0" width="10" height="18" fill="url(#building-pattern)" transform="translate(0, 12)" />
   <rect x="50" y="0" width="10" height="5" fill="url(#roof-pattern)" transform="translate(0, 7)" />
 
   <rect x="65" y="0" width="25" height="30" fill="url(#building-pattern)" />
   <rect x="65" y="0" width="25" height="10" fill="url(#roof-pattern)" transform="translate(0, -0)" />
 
   <rect x="95" y="0" width="10" height="20" fill="url(#building-pattern)" transform="translate(-5, 10)" />
   <rect x="95" y="0" width="10" height="6" fill="url(#roof-pattern)" transform="translate(-5, 4)" />
 </svg>
 
   <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 pt-16 sm:pt-20">
     <div
       v-for="(feature, index) in features.slice(0, 4)"
       :key="feature.titleKey"
       class="text-gray-800 bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-transform duration-300 hover:-translate-y-2 flex flex-col items-start"
       :class="{ 'text-right': isRTL, 'text-left': !isRTL }"
       style="perspective: 1000px; opacity: 0.6;"
     >
       <div class="transform-style-3d transition-transform duration-300 hover:rotate-y-6 hover:-rotate-x-3">
         <component
           :is="feature.icon"
           class="w-14 h-14 mb-6 text-[#364365] dark:text-[#0F318E]"
           :class="{ 'ml-auto': isRTL, 'mr-auto': !isRTL }"
         />
         <h3 class="text-xl font-semibold mb-2 text-gray-700">
           {{ $t(feature.titleKey) }}
         </h3>
         <p class="text-gray-500 text-sm">
           {{ $t(feature.descriptionKey) }}
         </p>
       </div>
     </div>
   </div>
 </section>
 <section class="py-12 mt-15 c sm:py-12 lg:py-20  relative overflow-hidden" >
 
   
  <svg
  class="absolute top-1/2 right-0 transform -translate-y-1/2 h-[115%] w-[50%] rotate-[-90deg]"
  viewBox="0 0 100 100"
  preserveAspectRatio="none"
  style="z-index: 0;"
>
  <defs>
    <linearGradient id="triangleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" class="stop-light" stop-color="#2c3e50" />
      <stop offset="100%" class="stop-light" stop-color="#364365" />

      <stop offset="0%" class="dark:stop-dark" stop-color="#000000" />
      <stop offset="100%" class="dark:stop-dark" stop-color="#000000" />
    </linearGradient>
  </defs>


 
     
     <polygon
       points="50,0 0,86.6 100,86.6"
       fill="url(#triangleGradient)"
       style="filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));"
     />
   </svg>
 
  
   <div
     class="absolute top-1/2 right-0 transform -translate-y-1/2 w-40 h-40 bg-[#364365]/10 rounded-full blur-3xl"
   ></div>
 
 
 
   
   <div class="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
     <h2 class="text-xl sm:text-2xl md:text-3xl lg:text-5xl  font-bold mb-[12] sm:mb-8 text-white text-center relative" style="text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);">
   <span class="relative inline-block text-white py-4">
     {{ $t("home.properties.section_title") }}
   </span>
 </h2>
 
  
     <div v-if="isLoading" class="text-gray-300 text-sm flex justify-center items-center py-6">
       <div class="flex flex-col items-center">
         <div class="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-gray-300 mb-2"></div>
         <span>{{ $t("home.properties.loading") }}</span>
       </div>
     </div>
     <div v-else-if="latestProperties.length && !error" class="relative swiper-container">
       <swiper
         :slides-per-view="1"
         :space-between="20"
         :pagination="{ clickable: true, dynamicBullets: true, el: '.swiper-pagination' }"
         :navigation="{ nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' }"
         :autoplay="{ delay: 3000, disableOnInteraction: false }"
         :breakpoints="{ '640': { slidesPerView: 2, spaceBetween: 20 }, '768': { slidesPerView: 2, spaceBetween: 30 }, '1024': { slidesPerView: 3, spaceBetween: 30 } }"
         :modules="swiperModules"
         @swiper="onSwiper"
         class="pb-16"
       >
         <swiper-slide v-for="(property, index) in latestProperties" :key="property.id"
           class="animate-slide-up" :style="{ animationDelay: `${index * 150}ms` }">
           <property-card
             :property="property"
             :id="property.id"
             class="h-full transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:-translate-y-1 bg-white rounded-lg overflow-hidden shadow-md"
           />
         </swiper-slide>
       </swiper>
       <div class="swiper-pagination mt-6"></div>
     </div>
     <p v-else-if="error" class="text-red-400 text-sm md:text-base py-4 text-center">
       {{ $t("home.properties.error") }}
       <button @click="fetchProperties"
         class="text-blue-300 underline ml-2 mt-2 block sm:inline hover:text-blue-400 transition-colors duration-200">
         {{ $t("home.properties.retry") }}
       </button>
     </p>
     <p v-if="latestProperties.length === 0" class="text-gray-300 text-sm md:text-base py-4 text-center">
       {{ $t("home.properties.no_properties") }}
     </p>
     <div v-if="latestProperties.length > 3 && !error" class="mt-8 text-center">
       <router-link to="/properties"
         class="inline-flex items-center px-5 py-2.5 bg-[#364365] text-white rounded-full hover:bg-[#4c5b87] transition-colors duration-300 text-sm group shadow-md hover:shadow-lg">
         {{ $t("home.properties.view_all") }}
         <span class="ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
       </router-link>
     </div>
   </div>
 </section>
 
 
 <section
   class="py-12 sm:py-16 lg:py-24 bg-[#f8fafc] dark:bg-[#111827] text-[#364365] text-center"
   data-aos="fade-up"
 >
   <div
     id="countup-section"
     class="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10"
   >
     <div
       v-for="stat in stats"
       :key="stat.label"
       class="p-6 sm:p-8 bg-white/70 backdrop-blur-md border border-white/40 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] animate-fade-in"
     >
       <count-up
         v-if="startCounting"
         :end-val="stat.value"
         :duration="stat.duration"
         class="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#264365]"
       />
       <p class="text-base sm:text-lg md:text-xl mt-4 font-medium text-[#364365]">
         {{ $t(`home.stats.${stat.key}`) }}
       </p>
     </div>
   </div>
 </section>
 
 
     <section
       class="relative  min-h-[350px] sm:min-h-[400px] md:min-h-[450px] lg:min-h-[500px] w-full bg-fixed bg-cover bg-center"
       :style="{
         backgroundImage: ContactUsHomePage
           ? `url(${ContactUsHomePage})`
           : `url('/fallback-contact.jpg')`,
       }"
       data-aos="fade-in"
     >
       <div class="absolute inset-0 bg-[#053052]/80 dark:bg-[#1E1E1E]/85"></div>
       <div
         class="relative min-h-[450px] flex items-center justify-center px-4 sm:px-6 lg:px-8"
       >
         <div class="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8 py-10">
           <h2
             class="text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold leading-tight"
            
           >
             {{ $t("home.contact.title") }}
           </h2>
           <p
             class="text-[#edeff6] text-xs sm:text-sm md:text-base lg:text-lg leading-5 sm:leading-6 max-w-md sm:max-w-lg md:max-w-2xl mx-auto"
            
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
 import heroSection from "../assets/images/home.jpg?url";
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
 import {
   ShieldCheckIcon,
   ScaleIcon,
   PhoneIcon,
   LightBulbIcon,
   LockClosedIcon,
   ArrowPathIcon,
 } from '@heroicons/vue/24/outline'; 
 
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
     imageSize: {
       width: '450px',
       height: '350px',
     },
     ImgForHeroSection: null,
     fontSize: 'text-base',
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
           icon: ShieldCheckIcon, // Icon component instead of image path
           titleKey: "home.features.verified.title",
           descriptionKey: "home.features.verified.description",
         },
         {
           icon: ScaleIcon,
           titleKey: "home.features.budget.title",
           descriptionKey: "home.features.budget.description",
         },
         {
           icon: PhoneIcon,
           titleKey: "home.features.contact.title",
           descriptionKey: "home.features.contact.description",
         },
         {
           icon: LightBulbIcon,
           titleKey: "home.features.smart.title",
           descriptionKey: "home.features.smart.description",
         },
         {
           icon: LockClosedIcon,
           titleKey: "home.features.secure.title",
           descriptionKey: "home.features.secure.description",
         },
         {
           icon: ArrowPathIcon,
           titleKey: "home.features.flexible.title",
           descriptionKey: "home.features.flexible.description",
         },
       ],
     stats: [
       { value: 300, duration: 2, key: "properties_listed" },
       { value: 1000, duration: 2.5, key: "happy_customers" },
       { value: 150, duration: 2, key: "verified_owners" },
     ],
     isRTL: false,
   }),
   computed: {
     ...mapGetters(["isLoading"]),
     currentLocale() {
       return this.$i18n.locale;
     },
   },
   mounted() {
     this.updateImageSize();
     window.addEventListener('resize', this.updateImageSize);
     AOS.init({ duration: 800, once: true });
     this.observeCountupSection();
     window.addEventListener("scroll", this.handleScroll, { passive: true });
     this.fetchProperties();
     this.fetchUserDetails();
     this.updateFontSize();
     window.addEventListener('resize', this.updateFontSize);
     this.isRTL = this.$i18n.locale === 'ar';
   },
   beforeUnmount() {
     window.removeEventListener("scroll", this.handleScroll);
     this.observer?.disconnect();
     window.removeEventListener('resize', this.updateImageSize);
     window.removeEventListener('resize', this.updateFontSize);
   },
   methods: {
     ...mapActions("property", ["getProperties"]),
     ...mapActions("auth", ["fetchUserDetails"]),
     updateImageSize() {
       const screenWidth = window.innerWidth;
 
       if (screenWidth <= 480) {
 
         this.imageSize.width = '200px';
         this.imageSize.height = '160px';
       } else if (screenWidth <= 768) {
 
         this.imageSize.width = '280px';
         this.imageSize.height = '220px';
       } else if (screenWidth <= 1024) {
 
         this.imageSize.width = '320px';
         this.imageSize.height = '260px';
       } else if (screenWidth <= 1220) {
 
         this.imageSize.width = '350px';
         this.imageSize.height = '280px';
       } else if (screenWidth <= 1440) {
 
         this.imageSize.width = '450px';
         this.imageSize.height = '370px';
       } else {
 
         this.imageSize.width = '550px';
         this.imageSize.height = '450px';
       }
     },
     updateFontSize() {
       const screenWidth = window.innerWidth;
 
       if (screenWidth <= 480) {
         this.fontSize = 'text-sm';
       } else if (screenWidth <= 768) {
         this.fontSize = 'text-base';
       } else if (screenWidth <= 1024) {
         this.fontSize = 'text-lg';
       } else if (screenWidth <= 1440) {
         this.fontSize = 'text-xl';
       } else {
         this.fontSize = 'text-2xl';
       }
     },
 
 
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
   watch: {
     currentLocale(newLocale) {
       this.isRTL = newLocale === 'ar';
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
 .transform-style-3d {
   transform-style: preserve-3d;
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
@media (prefers-color-scheme: dark) {
      svg {
        --gradient-start: #00050f;
        --gradient-end: #010614;
      }
    }

/* Add this to your existing styles */
button {
  transform: translateY(0);
  transition: all 0.3s ease;
}

button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

button:active {
  transform: translateY(0);
}

.group:hover {
  width: auto;
  min-width: 200px;
}

.dark .stop-light {
    stop-color: transparent;
  }
  .stop-dark {
    display: none;
  }
  .dark .stop-dark {
    display: inline;
  }
</style>
