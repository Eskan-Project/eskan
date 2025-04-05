<template>
  <div class="pt-6 sm:pt-8">
    <property-info />
    <router-view></router-view>
  </div>
</template>

<script>
import PropertyInfo from "@/components/createProperty/CreationProgress.vue";

export default {
  components: {
    PropertyInfo,
  },
};
</script>
