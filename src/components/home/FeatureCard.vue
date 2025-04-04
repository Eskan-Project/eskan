<template>
  <div class="flex flex-col items-center p-4">
    <img
      :src="feature.icon"
      :alt="$t(feature.titleKey)"
      class="w-12 sm:w-14 md:w-16 h-auto mb-3"
    />
    <h3
      class="text-sm sm:text-base md:text-lg font-semibold text-[#364365] dark:text-[#3D8BFF] text-center"
    >
      {{ $t(feature.titleKey) }}
    </h3>
    <p
      class="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-300 text-center"
    >
      {{ $t(feature.descriptionKey) }}
    </p>
  </div>
</template>

<script>
export default {
  props: {
    feature: {
      type: Object,
      required: true,
      validator: (prop) => {
        return prop.icon && prop.titleKey && prop.descriptionKey;
      },
    },
    delay: { type: Number, default: 0 },
  },
};
</script>
