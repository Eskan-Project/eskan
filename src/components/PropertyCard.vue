<template>
  <router-link
    :to="`/property/${property.id}`"
    class="block group focus:outline-none w-full max-w-[18rem] sm:max-w-sm mx-auto"
    :aria-label="`View details for ${property.title || 'property'}`"
  >
    <article
      class="bg-white text-gray-800 shadow-md rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 focus-within:ring-2 focus-within:ring-blue-500 flex flex-col h-full min-h-[22rem] sm:min-h-[24rem]"
    >
      <div class="relative h-48 sm:h-52 w-full overflow-hidden">
        <img
          v-if="property.images?.length"
          :src="property.images[0]"
          :alt="
            property.title
              ? `${property.title} property image`
              : 'Property image'
          "
          class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div
          v-else
          class="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm"
        >
          <span>No Image Available</span>
        </div>
      </div>
      <div
        class="p-4 flex-1 flex flex-col items-center justify-evenly space-y-3"
      >
        <div class="w-full text-center">
          <h2
            class="font-semibold text-lg sm:text-xl text-gray-900 truncate group-hover:text-blue-600 transition-colors capitalize"
            :title="property.title || 'Untitled Property'"
          >
            {{ property.title || "Untitled Property" }}
          </h2>
        </div>
        <p class="text-gray-600 text-sm mt-1 flex items-center justify-center">
          <i class="bi bi-geo-alt mr-1 text-gray-500"></i>
          {{ locationText }}
        </p>
        <p class="font-bold text-base sm:text-lg text-blue-700">
          {{ formattedPrice }} EGP
        </p>
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
  },
  computed: {
    governorateName() {
      return (
        governorates.find((g) => g.id === this.property.governorate)
          ?.governorate_name_en || "Unknown Governorate"
      );
    },
    cityName() {
      return (
        cities.find((c) => c.id === this.property.city)?.city_name_en ||
        "Unknown City"
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
