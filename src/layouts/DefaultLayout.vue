<template>
  <div class="layout">
    <navbar-base />
    <main class="content">
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
