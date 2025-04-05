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
    const savedLocale = sessionStorage.getItem("locale") || "en";
    document.documentElement.dir = savedLocale === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = savedLocale;
  },
  watch: {
    "$i18n.locale"(newLocale) {
      sessionStorage.setItem("locale", newLocale);
      document.documentElement.dir = newLocale === "ar" ? "rtl" : "ltr";
      document.documentElement.lang = newLocale;
    },
  },
};
</script>

<style>
#app {
  position: relative;
}
</style>
