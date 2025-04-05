<template>
  <div>
    <loading-spinner :loading="isLoading" />
    <navbar-base />
    <main class="pt-0 sm:pt-[78px]">
      <router-view />
    </main>
    <footer-base />
  </div>
</template>

<script>
import NavbarBase from "@/components/navbar/NavbarBase.vue";
import FooterBase from "@/components/footer/FooterBase.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import { mapGetters } from "vuex";

export default {
  components: {
    NavbarBase,
    FooterBase,
    LoadingSpinner,
  },
  computed: {
    ...mapGetters(["isLoading"]),
  },
};
</script>
