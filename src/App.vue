<!-- src/App.vue -->
<template>
  <div id="app" :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'">
    <loading-spinner :loading="isLoading" />
    <router-view />
  </div>
</template>

<script>
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import { mapGetters } from "vuex";

export default {
  name: "App",
  components: {
    LoadingSpinner,
  },
  computed: {
    ...mapGetters(["isLoading"]),
  },
  created() {
    const savedLocale = localStorage.getItem("locale") || "en";
    this.$i18n.locale = savedLocale;
    document.documentElement.dir = savedLocale === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = savedLocale;
  },
};
</script>

<style>
#app {
  position: relative;
}
</style>
