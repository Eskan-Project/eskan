<!-- src/App.vue -->
<template>
  <div id="app">
    <loading-spinner :loading="isLoading" />
    <router-view />
  </div>
</template>

<script>
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import { mapGetters } from "vuex";

export default {
  name: "App",
  components: { LoadingSpinner },
  computed: {
    ...mapGetters(["isLoading"]),
  },
};
</script>

<style>
#app {
  position: relative;
}
</style>
