<template>
  <router-link :to="`/property/${property.id}`" class="block">
    <div class="bg-white text-gray-800 shadow-lg rounded-lg overflow-hidden cursor-pointer transition hover:shadow-xl">
      <img :src="property.image" :alt="`${property.title} - ${property.location}`" class="w-full h-48 object-cover" loading="lazy" />
      <div class="p-4">
        <h2 class="font-bold text-md truncate">{{ property.title }}</h2>
        <p class="text-gray-500 text-sm">{{ property.location }}</p>
        <p class="font-bold text-sm mt-1">${{ property.price }}</p>
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
