<template>
  <router-link :to="`/property/${property.id}`" class="block">
    <div class="bg-white text-gray-800 shadow-lg rounded-lg overflow-hidden cursor-pointer transition hover:shadow-xl">
      <img
        v-if="property.gallery && property.gallery.length > 0"
        :src="property.gallery[0]"
        :alt="property.title || 'Property'"
        class="w-full h-48 object-cover"
        loading="lazy"
      />
      <div class="p-4">
        <h2 class="font-bold text-md truncate">{{ property.title || 'No Title' }}</h2>
        <p class="text-gray-500 text-sm">{{ property.location || 'No Location' }}</p>
        <p class="font-bold text-sm mt-1">${{ property.price || 'N/A' }}</p>
      </div>
    </div>
  </router-link>
</template>

<script>
export default {
  props: {
    property: Object,
  },
};
</script>


