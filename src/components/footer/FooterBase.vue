<template>
  <footer class="bg-[var(--secondary-color)] dark:bg-[#1F2937] text-white py-4">
    <div class="container mx-auto w-3/4 ml-auto">
      <div class="flex flex-col md:flex-row w-full items-center">
        <!-- Logo -->
        <div class="w-full md:w-1/2 flex flex-col items-center mb-6 md:mb-0">
          <img :src="logoSrc" alt="Eskan Logo" class="w-[150px] mb-2" />
          <p class="mb-2 text-sm text-center">
            {{ $t("footer.tagline") }}
          </p>
        </div>

        <!-- Social Media -->
        <div class="w-full md:w-1/2 flex justify-center md:justify-end gap-2">
          <a
            v-for="(icon, index) in socialIcons"
            :key="index"
            :href="icon.link"
            target="_blank"
            rel="noopener noreferrer"
            class="w-10 h-10 flex items-center justify-center bg-white dark:bg-gray-700 rounded-lg text-[var(--secondary-color)] dark:text-[#3D8BFF] hover:bg-[var(--secondary-color)] dark:hover:bg-[#3D8BFF] hover:border hover:text-white dark:hover:text-white hover:bg-opacity-80 transition-all"
            :aria-label="$t(`footer.social.${icon.name.toLowerCase()}`)"
          >
            <i :class="`bi bi-${icon.icon} text-xl`"></i>
          </a>
        </div>
      </div>
    </div>
  </footer>
  <!-- Copyright -->
  <div
    class="bg-[#001c3ac9] dark:bg-[#111827] text-center text-white py-3 w-full"
  >
    <h3>
      {{ $t("footer.copyright") }} <strong>Eskan</strong>.
      {{ $t("footer.all_rights_reserved") }}
    </h3>
  </div>
</template>

<script>
import arLogo from "@/assets/images/logo_ar.png";
import enLogo from "@/assets/images/logo.png";
export default {
  data() {
    return {
      socialIcons: [
        { name: "Facebook", icon: "facebook", link: "#" },
        { name: "Dribbble", icon: "dribbble", link: "#" },
        { name: "LinkedIn", icon: "linkedin", link: "#" },
        { name: "Instagram", icon: "instagram", link: "#" },
        { name: "Behance", icon: "behance", link: "#" },
      ],
    };
  },
  computed: {
    logoSrc() {
      const logoPath = this.$t("nav.logo");
      return logoPath.includes("logo_ar") ? arLogo : enLogo;
    },
  },
};
</script>

<style scoped>
.transition-all {
  transition: all 0.3s ease-in-out;
}
</style>
