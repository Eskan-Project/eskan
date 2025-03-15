<template>
  <router-link
    :to="`/property/${property.id}`"
    class="block group focus:outline-none w-full max-w-[22rem] mx-auto"
    :aria-label="`View details for ${property.title || 'property'}`"
  >
    <article
      class="bg-white text-gray-800 shadow-md rounded-xl overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1 focus-within:ring-2 focus-within:ring-blue-500 flex flex-col h-full"
    >
 
      <div class="relative h-52 sm:h-56 w-full overflow-hidden rounded-t-xl">
        <img
          v-if="property.images?.length"
          :src="property.images[0]"
          :alt="property.title ? `${property.title} property image` : 'Property image'"
          class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-101"
          loading="lazy"
        />
        <div
          v-else
          class="w-full h-full flex items-center justify-center text-gray-500 text-sm bg-gray-300"
        >
          <span>No Image Available</span>
        </div>
        <span
          v-if="property.propertyStatus"
          class="absolute top-3 right-3 px-3 py-1 text-xs font-semibold text-white rounded-full capitalize bg-gradient-to-r from-[#124365] to-[#364365] shadow-md"
        >
          {{ property.propertyStatus }}
        </span>
      </div>

      
      <div class="p-4 flex-1 flex flex-col justify-between">
  <div class="space-y-1 leading-tight"> 
    <h2
      style="text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);"
      class="font-semibold text-md sm:text-sm lg:text-lg line-clamp-2 text-ellipsis text-gray-900 truncate transition-colors capitalize leading-snug"
      :title="property.title || 'Untitled Property'"
    >
      {{ property.title || "Untitled Property" }}
    </h2>

    <div class="flex justify-between items-center text-sm text-gray-600 leading-tight">
      <p class="flex items-center gap-1">
        <i class="bi bi-geo-alt text-blue-900 font-extrabold"></i>
        {{ locationText }}
      </p>
      <p class="flex items-center gap-1">
        <i class="bi bi-house-door text-blue-900 font-extrabold"></i>
        {{ property.rooms }} {{ property.rooms === 1 ? "Room" : "Rooms" }}
      </p>
    </div>
  </div>


        
        <div class="mt-3 flex justify-between items-center">
          <p class="font-semibold text-base sm:text-lg ">
            {{ formattedPrice }} EGP
          </p>
        
        </div>
      </div>
    </article>
  </router-link>
</template>



<script>
import governorates from "@/assets/data/governorates.json";
import cities from "@/assets/data/cities.json";

export default {
  name: "PropertyCard",
  props: {
    property: {
      type: Object,
      required: true,
      default: () => ({}),
    },
    id: {
      type: String,
      required: true,
    },
  },
  computed: {
    governorateName() {
      return (
        governorates.find((g) => g.id === this.property.governorate)
          ?.governorate_name_en || "Unknown "
      );
    },
    cityName() {
      return (
        cities.find((c) => c.id === this.property.city)?.city_name_en ||
        "Unknown "
      );
    },
    locationText() {
      return `${this.governorateName} - ${this.cityName}`;
    },
    formattedPrice() {
      return this.property.price
        ? Number(this.property.price).toLocaleString("en-US", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
          })
        : "N/A";
    },
  },
};
</script>
