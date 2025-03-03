<template>
  <div class="h-screen">
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
