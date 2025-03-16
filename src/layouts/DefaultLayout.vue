<template>
  <div>
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

export default {
  components: {
    NavbarBase,
    FooterBase,
  },
};
</script>
