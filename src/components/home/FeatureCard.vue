<template>
  <div class="flex flex-col items-center p-4">
    <i
      :class="feature.icon"
      :aria-label="$t(feature.titleKey)"
      class="text-3xl sm:text-4xl md:text-5xl mb-3 text-[#364365] dark:text-white"
    ></i>
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
