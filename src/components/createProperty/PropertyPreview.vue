<template>
  <div class="w-full max-w-5xl mx-auto px-4 sm:px-6">
    <!-- Swiper Carousel -->
    <div class="relative w-full mt-6 sm:mt-10">
      <swiper
        :slides-per-view="slidesPerView"
        :effect="'coverflow'"
        :centered-slides="true"
        :coverflowEffect="{
          rotate: 0,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }"
        :autoplay="{
          delay: 2500,
          disableOnInteraction: false,
        }"
        :pagination="{
          clickable: true,
        }"
        :space-between="10"
        :loop="images.length > 1"
        :modules="swiperModules"
        @swiper="onSwiper"
        @slideChange="onSlideChange"
        class="pb-12 sm:pb-0"
      >
        <swiper-slide v-for="(image, index) in images" :key="index">
          <img
            :src="image"
            class="w-full h-48 sm:h-64 md:h-80 object-cover rounded-lg"
          />
        </swiper-slide>
      </swiper>
      <button
        class="cursor-pointer absolute border border-[var(--secondary-color)] dark:border-[#3D8BFF] -left-15 top-1/2 transform -translate-y-1/2 bg-[var(--secondary-color)] dark:bg-[#3D8BFF] text-white rounded-full px-2 py-1 hover:text-[var(--secondary-color)] dark:hover:text-[#3D8BFF] hover:bg-white dark:hover:bg-gray-800"
        @click="swiper.slidePrev()"
      >
        <i class="bi bi-arrow-left"></i>
      </button>
      <button
        class="cursor-pointer absolute border border-[var(--secondary-color)] dark:border-[#3D8BFF] -right-15 top-1/2 transform -translate-y-1/2 bg-[var(--secondary-color)] dark:bg-[#3D8BFF] text-white rounded-full px-2 py-1 hover:text-[var(--secondary-color)] dark:hover:text-[#3D8BFF] hover:bg-white dark:hover:bg-gray-800"
        @click="swiper.slideNext()"
      >
        <i class="bi bi-arrow-right"></i>
      </button>
    </div>

    <!-- Property Info -->
    <div
      class="relative bg-white dark:bg-[#1F2937] shadow-lg rounded-lg overflow-hidden p-4 sm:p-6 mt-6 sm:-mt-10 z-10"
    >
      <div
        class="border-t dark:border-gray-600 pt-4 flex flex-row justify-between gap-4"
      >
        <div class="flex flex-col gap-2">
          <h2
            class="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-white capitalize"
          >
            {{ propertyDetails.title || "Untitled" }}
          </h2>
          <p
            class="text-gray-500 dark:text-gray-300 flex items-center text-sm sm:text-base"
          >
            <i
              :class="`bi bi-geo-alt-fill text-yellow-500 ${
                this.$i18n.locale === 'ar' ? 'ml-2' : 'mr-2'
              } text-base sm:text-xl`"
            ></i>
            <span>
              {{
                `${
                  propertyDetails.neighborhood
                    ? propertyDetails.neighborhood + ", "
                    : ""
                }${cityName}, ${governorateName}`
              }}
            </span>
          </p>
        </div>
        <p class="text-lg sm:text-xl font-bold text-gray-800 dark:text-white">
          {{
            propertyDetails.price
              ? `${formattedPrice(propertyDetails.price)} ${$t(
                  "profile.currency"
                )}`
              : "N/A"
          }}
        </p>
      </div>

      <!-- General Information -->
      <div class="pt-4 border-t dark:border-gray-600">
        <h3
          class="text-base sm:text-lg font-semibold text-gray-800 dark:text-white mb-4 sm:mb-6"
        >
          {{ $t("createProperty.preview.basicInfo") }}
        </h3>
        <div
          class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 text-sm sm:text-base text-gray-800 dark:text-gray-200"
        >
          <div class="space-y-6">
            <div class="flex items-center gap-2">
              <span class="w-52 font-normal"
                >{{ $t("createProperty.form.propertyStatus") }}:</span
              >
              <span class="font-semibold">{{
                $t(`createProperty.form.${propertyDetails.propertyStatus}`) ||
                "N/A"
              }}</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="w-52 font-normal"
                >{{ $t("createProperty.form.area") }}:</span
              >
              <span class="font-semibold"
                >{{ formattedPrice(propertyDetails.area) || "N/A" }}
                {{ $t("createProperty.preview.m2") }}</span
              >
            </div>
            <div class="flex items-center gap-2">
              <span class="w-52 font-normal"
                >{{ $t("createProperty.form.rooms") }}:</span
              >
              <span class="font-semibold">{{
                formattedPrice(propertyDetails.rooms) || "N/A"
              }}</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="w-52 font-normal"
                >{{ $t("createProperty.form.bathrooms") }}:</span
              >
              <span class="font-semibold">{{
                formattedPrice(propertyDetails.bathrooms) || "N/A"
              }}</span>
            </div>

            <div class="flex items-center gap-2">
              <span class="w-52 font-normal"
                >{{ $t("createProperty.form.floor") }}:</span
              >
              <span class="font-semibold">{{
                formattedPrice(propertyDetails.floor) || "N/A"
              }}</span>
            </div>
          </div>
          <div class="space-y-6">
            <div class="flex items-center gap-2">
              <span class="w-52 font-normal"
                >{{ $t("createProperty.form.furnished") }}:</span
              >
              <span class="font-semibold capitalize">{{
                $t(`createProperty.form.${propertyDetails.furnished}`) || "N/A"
              }}</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="w-52 font-normal"
                >{{ $t("createProperty.form.livingRooms") }}:</span
              >
              <span class="font-semibold">{{
                formattedPrice(propertyDetails.livingRooms) || "N/A"
              }}</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="w-52 font-normal"
                >{{ $t("createProperty.form.kitchens") }}:</span
              >
              <span class="font-semibold">{{
                formattedPrice(propertyDetails.kitchens) || "N/A"
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Description -->
    <div
      class="relative bg-white dark:bg-[#1F2937] shadow-lg rounded-lg overflow-hidden p-4 sm:p-6 mt-6"
    >
      <div>
        <h3
          class="text-base sm:text-lg font-semibold text-gray-800 dark:text-white mb-4"
        >
          {{ $t("createProperty.form.description") }}
        </h3>
        <p class="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
          {{ propertyDetails.description || "No description available" }}
        </p>
      </div>
    </div>

    <!-- Next Button -->
    <div class="flex justify-center my-6 sm:my-10">
      <CreateBtn
        :title="$t('createProperty.buttons.next')"
        name="propertyContact"
      />
    </div>
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from "swiper/vue";
import { Autoplay, Pagination, EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import "swiper/css/effect-coverflow";
import CreateBtn from "./CreateBtn.vue";
import { mapState } from "vuex";
import governorates from "@/assets/data/governorates.json";
import cities from "@/assets/data/cities.json";

export default {
  components: { Swiper, SwiperSlide, CreateBtn },
  data() {
    return {
      swiper: null,
      images: JSON.parse(localStorage.getItem("localImages")) || [],
      swiperModules: [Autoplay, Pagination, EffectCoverflow],
    };
  },
  computed: {
    ...mapState("property", ["propertyDetails"]),
    governorateName() {
      const governorate = governorates.find(
        (governorate) => governorate.id === this.propertyDetails.governorate
      );
      return governorate
        ? this.$i18n.locale === "ar"
          ? governorate.governorate_name_ar
          : governorate.governorate_name_en
        : "Unknown";
    },
    cityName() {
      const city = cities.find((city) => city.id === this.propertyDetails.city);
      return city
        ? this.$i18n.locale === "ar"
          ? city.city_name_ar
          : city.city_name_en
        : "Unknown";
    },
    slidesPerView() {
      if (this.images.length <= 1) return 1;
      if (this.images.length === 2) return 2;
      return window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 2 : 3;
    },
  },
  created() {
    const savedData = localStorage.getItem("propertyDetails");
    if (savedData) {
      this.$store.commit("property/updateProperty", JSON.parse(savedData));
    }
  },
  mounted() {
    window.addEventListener("resize", this.updateSlidesPerView);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.updateSlidesPerView);
  },
  methods: {
    onSwiper(swiper) {
      this.swiper = swiper;
    },
    updateSlidesPerView() {
      this.swiper.update(); // Update Swiper on resize
    },
    formattedPrice(price) {
      if (typeof price !== "number" && isNaN(Number(price))) {
        return price; // Return as-is if price isn’t a valid number
      }
      const locale = this.$i18n.locale === "ar" ? "ar-EG" : "en-US";
      return new Intl.NumberFormat(locale, {
        minimumFractionDigits: 0, // No decimals unless needed
        maximumFractionDigits: 2, // Up to 2 decimals if present
      }).format(price);
    },
  },
};
</script>

<style scoped>
/* Smooth transitions for buttons */
button {
  transition: all 0.3s ease;
}

/* Ensure images are contained */
img {
  max-width: 100%;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .grid-cols-2 {
    grid-template-columns: 1fr; /* Stack on mobile */
  }
  .w-28 {
    width: 100px; /* Smaller label width on mobile */
  }
  .pb-12 {
    padding-bottom: 3rem; /* Space for buttons on mobile */
  }
}

@media (min-width: 640px) and (max-width: 1024px) {
  .grid-cols-2 {
    grid-template-columns: repeat(2, 1fr); /* Two columns on tablet */
  }
}
</style>
