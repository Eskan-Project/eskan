<template>
  <div
    class="flex flex-col items-center my-4"
    :data-aos-delay="delay"
    data-aos="flip-left"
  >
    <div
      class="w-24 h-24 rounded-full border-2 border-[#364365] flex items-center justify-center mb-4"
    >
      <img :src="feature.icon" :alt="feature.title + ' Icon'" loading="lazy" />
    </div>
    <h3 class="text-[#364365] text-lg font-semibold mb-2">
      {{ feature.title }}
    </h3>
    <p class="text-[#364365] text-sm text-center">{{ feature.description }}</p>
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
