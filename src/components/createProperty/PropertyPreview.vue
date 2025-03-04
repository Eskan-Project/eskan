<template>
  <div class="relative w-[50vw] mx-auto">
    <swiper
      :slides-per-view="3"
      :space-between="10"
      :loop="true"
      @swiper="onSwiper"
      @slideChange="onSlideChange"
    >
      <swiper-slide v-for="(image, index) in property.gallery" :key="index">
        <img :src="image" class="w-full h-80 object-cover" />
      </swiper-slide>
    </swiper>
    <button
      class="absolute border border-[var(--secondary-color)] -left-15 top-1/2 transform -translate-y-1/2 bg-[var(--secondary-color)] text-white rounded-full px-2 py-1 hover:text-[var(--secondary-color)] hover:bg-white"
      @click="swiper.slidePrev()"
    >
      <i class="bi bi-arrow-left"></i>
    </button>
    <button
      class="absolute border border-[var(--secondary-color)] -right-15 top-1/2 transform -translate-y-1/2 bg-[var(--secondary-color)] text-white rounded-full px-2 py-1 hover:text-[var(--secondary-color)] hover:bg-white"
      @click="swiper.slideNext()"
    >
      <i class="bi bi-arrow-right"></i>
    </button>
  </div>
  <div
    class="relative max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden p-4 z-10 -top-10"
  >
    <div class="p-4 border-t flex justify-between">
      <div class="flex flex-col gap-2">
        <h2 class="text-xl font-semibold text-gray-800">
          {{ property.title }}
        </h2>
        <p class="text-gray-500 flex items-center">
          <i class="bi bi-geo-alt-fill text-yellow-500 mr-2 text-2xl"></i>
          {{ property.location }}
        </p>
      </div>
      <p class="text-2xl font-bold text-gray-800">{{ property.price }} $</p>
    </div>

    <div class="p-4 border-t">
      <h3 class="text-lg font-semibold text-gray-800 mb-8">
        General Information
      </h3>
      <div class="grid grid-cols-2 gap-4 mt-2 text-sm text-gray-800 ml-10">
        <div>
          <div class="flex items-center mb-5 gap-2">
            <span class="w-50 font-normal">Advertise No:</span>
            <span class="font-semibold">1</span>
          </div>
          <div class="flex items-center mb-5 gap-2">
            <span class="w-50 font-normal">Published Date:</span>
            <span class="font-semibold">1-1-2025</span>
          </div>
          <div class="flex items-center mb-5 gap-2">
            <span class="w-50 font-normal">Area:</span>
            <span class="font-semibold">{{ property.size }} m<sup>2</sup></span>
          </div>
          <div class="flex items-center mb-5 gap-2">
            <span class="w-50 font-normal">Number of Rooms:</span>
            <span class="font-semibold">{{ property.rooms }}</span>
          </div>
          <div class="flex items-center mb-5 gap-2">
            <span class="w-50 font-normal">Number of Bathrooms:</span>
            <span class="font-semibold">1</span>
          </div>
        </div>
        <div>
          <div class="flex items-center mb-5 gap-2">
            <span class="w-50 font-normal">Floor Location:</span>
            <span class="font-semibold">Second Floor</span>
          </div>
          <div class="flex items-center mb-5 gap-2">
            <span class="w-50 font-normal">Status:</span>
            <span class="font-semibold">Zero</span>
          </div>
          <div class="flex items-center mb-5 gap-2">
            <span class="w-50 font-normal">Furnished:</span>
            <span class="font-semibold capitalize">{{
              property.furnished
            }}</span>
          </div>
          <div class="flex items-center mb-5 gap-2">
            <span class="w-50 font-normal">Number of Living Rooms:</span>
            <span class="font-semibold">{{ property.rooms }}</span>
          </div>
          <div class="flex items-center mb-5 gap-2">
            <span class="w-50 font-normal">Number of Kitchens:</span>
            <span class="font-semibold">1</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div
    class="relative max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden p-4"
  >
    <div class="p-4">
      <h3 class="text-lg font-semibold text-gray-800 mb-4">Explanation</h3>
      <p class="text-gray-600 text-sm">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Egestas ac
        convallis tellus pellentesque non odio consectetur bibendum. Auctor leo
        risus in tristique sit enim nec sed. Ridiculus vulputate facilisi a
        velit cursus sapien egestas nec, accumsan.
      </p>
    </div>
  </div>
  <div class="flex justify-center my-10">
    <CreateBtn title="Next" name="propertyContact" />
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";

import CreateBtn from "./CreateBtn.vue";
import properties from "@/data/properties";

export default {
  components: { Swiper, SwiperSlide, CreateBtn },
  data() {
    return {
      property: properties[0],
      swiper: null,
    };
  },
  methods: {
    onSwiper(swiper) {
      this.swiper = swiper;
    },
    onSlideChange() {
      console.log("slide changed");
    },
    prevSlide() {
      this.swiper.slidePrev();
    },
    nextSlide() {
      this.swiper.slideNext();
    },
  },
};
</script>

<style>
.swiper-button-prev,
.swiper-button-next {
  color: #333;
}
</style>
