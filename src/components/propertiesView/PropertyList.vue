<template>
  <div>
    <div
      v-if="properties === null"
      class="text-gray-500 text-lg text-center py-10"
    >
      {{ $t("properties.loading") }}
    </div>
    <div
      v-else-if="properties.length"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      <property-card
        v-for="property in properties"
        :key="property.id"
        :id="property.id"
        :property="property"
      />
    </div>
    <p v-else class="text-gray-500 text-lg text-center py-10">
      {{ $t("properties.no_properties") }}
    </p>
  </div>
</template>

<script>
import PropertyCard from "@/components/PropertyCard.vue";

export default {
  name: "PropertyList",
  components: { PropertyCard },
  props: {
    properties: {
      type: Array,
      default: null, // Allow null as a valid initial value
    },
  },
};
</script>
