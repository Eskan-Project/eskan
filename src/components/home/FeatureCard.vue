<template>
  <div class="flex flex-col items-center p-4">
    <img
      :src="feature.icon"
      alt="Feature Icon"
      class="w-12 sm:w-14 md:w-16 h-auto mb-3"
    />
    <h3
      class="text-sm sm:text-base md:text-lg font-semibold text-[#364365] text-center"
    >
      {{ feature.title }}
    </h3>
    <p class="text-xs sm:text-sm md:text-base text-gray-600 text-center">
      {{ feature.description }}
    </p>
  </div>
</template>

<script>
export default {
  props: {
    feature: { type: Object, required: true },
    delay: { type: Number, default: 0 },
  },
};
</script>
