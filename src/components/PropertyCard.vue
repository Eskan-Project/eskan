<template>
  <router-link
    :to="`/property/${property.id}`"
    class="block group focus:outline-none w-full h-full"
    :aria-label="`View details for ${property.title || 'property'}`"
  >
    <article
      class="bg-white text-gray-800 shadow-md rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 focus-within:ring-2 focus-within:ring-blue-500 flex flex-col h-full relative"
    >
      <!-- Property Image with Skeleton Loader -->
      <div class="relative h-40 sm:h-48 md:h-56 lg:h-64 w-full overflow-hidden">
        <div
          v-if="!imageLoaded && property.images?.length"
          class="absolute inset-0 bg-gray-200 animate-pulse"
        ></div>
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
          @load="imageLoaded = true"
        />
        <div
          v-else
          class="w-full h-full flex items-center justify-center text-gray-500 text-sm bg-gray-200"
        >
          <span>No Image Available</span>
        </div>

        <!-- Property Status Badge -->
        <span
          v-if="property.propertyStatus"
          class="absolute top-2 right-2 px-2 py-1 text-xs font-semibold text-white rounded-full capitalize bg-gradient-to-r from-[#124365] to-[#364365] shadow-md"
        >
          {{ property.propertyStatus }}
        </span>

        <!-- Price Badge -->
        <div
          class="absolute bottom-0 right-0 bg-[#364365]/90 text-white px-3 py-1 rounded-tl-lg font-bold text-sm"
        >
          {{ formattedPrice }} EGP
        </div>

        <!-- Image Gallery Indicator -->
        <div
          v-if="property.images?.length > 1"
          class="absolute bottom-0 left-0 px-2 py-1 bg-black/50 text-white text-xs rounded-tr-lg flex items-center"
        >
          <i class="bi bi-images mr-1"></i>
          <span>{{ property.images.length }}</span>
        </div>
      </div>

      <div class="p-3 sm:p-4 md:p-5 flex-1 flex flex-col justify-between gap-2">
        <!-- Property Title -->
        <h2
          class="font-semibold text-sm sm:text-base md:text-lg text-gray-900 transition-colors capitalize line-clamp-2"
          :title="property.title || 'Untitled Property'"
        >
          {{ property.title || "Untitled Property" }}
        </h2>

        <!-- Property Details -->
        <div class="mt-1 sm:mt-2">
          <!-- Location -->
          <p
            class="flex items-center gap-1 text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2"
          >
            <i class="bi bi-geo-alt text-[#364365]"></i>
            <span class="truncate">{{ locationText }}</span>
          </p>

          <!-- Property Highlights - Column for mobile, Grid for larger screens -->
          <div
            class="flex flex-col sm:grid sm:grid-cols-2 gap-1.5 sm:gap-2 mt-2"
          >
            <div
              class="flex items-center gap-1 text-xs bg-gray-100 rounded-md p-1.5 hover:bg-gray-200 transition-colors"
            >
              <i class="bi bi-house-door text-[#364365]"></i>
              <span
                >{{ property.rooms }}
                {{ property.rooms === 1 ? "Room" : "Rooms" }}</span
              >
            </div>

            <div
              v-if="property.area"
              class="flex items-center gap-1 text-xs bg-gray-100 rounded-md p-1.5 hover:bg-gray-200 transition-colors"
            >
              <i class="bi bi-rulers text-[#364365]"></i>
              <span>{{ property.area }} m²</span>
            </div>

            <div
              v-if="property.furnished !== undefined"
              class="flex items-center gap-1 text-xs bg-gray-100 rounded-md p-1.5 hover:bg-gray-200 transition-colors"
            >
              <i class="bi bi-lamp text-[#364365]"></i>
              <span>{{
                property.furnished ? "Furnished" : "Unfurnished"
              }}</span>
            </div>
          </div>
        </div>

        <!-- View Details Button with Touch-friendly tap target -->
        <div class="mt-2 sm:mt-3 md:mt-4 text-center">
          <span
            class="inline-block text-xs sm:text-sm font-medium text-white bg-[#364365] px-3 py-1.5 rounded-full group-hover:bg-[#4c5b87] transition-all duration-200"
          >
            View Details
            <i
              class="bi bi-arrow-right text-xs ml-1 group-hover:translate-x-1 transition-transform"
            ></i>
          </span>
        </div>
      </div>

      <!-- New Label for recently added properties -->
      <div v-if="isNewProperty" class="absolute top-0 left-0">
        <div
          class="bg-[#f59e0b] text-white px-3 py-1 text-xs font-bold rounded-br-lg shadow-md"
        >
          NEW
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
  data() {
    return {
      imageLoaded: false,
    };
  },
  computed: {
    governorateName() {
      return (
        governorates.find((g) => g.id === this.property.governorate)
          ?.governorate_name_en || "Unknown"
      );
    },
    cityName() {
      return (
        cities.find((c) => c.id === this.property.city)?.city_name_en ||
        "Unknown"
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
    isNewProperty() {
      // Check if property was added in the last 7 days
      if (!this.property.createdAt) return false;

      const createdDate = new Date(this.property.createdAt);
      const now = new Date();
      const diffTime = Math.abs(now - createdDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return diffDays <= 7;
    },
  },
};
</script>

<style scoped>
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Make hover effects work on touch devices */
@media (hover: none) {
  .touch\:opacity-100 {
    opacity: 1;
  }
}
</style>
