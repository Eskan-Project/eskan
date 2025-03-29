<template>
  <button
    @click="nextStep"
    :name="name"
    :disabled="isLoading"
    class="w-fit py-2 mx-auto border border-[var(--secondary-color)] bg-[var(--secondary-color)] text-white px-6 rounded-md cursor-pointer hover:bg-white hover:text-[var(--secondary-color)] transition"
  >
    {{ isLoading ? $t("createProperty.buttons.loading") : title }}
  </button>
</template>

<script>
import { mapActions, mapMutations, mapGetters } from "vuex";

export default {
  props: {
    name: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
  computed: {
    ...mapGetters(["isLoading"]),
  },
  methods: {
    ...mapActions("property", ["createProperty"]),
    ...mapMutations("property", ["updateProperty"]),
    ...mapActions(["startLoading", "stopLoading"]),

    async nextStep() {
      this.startLoading();
      try {
        let storedStep = localStorage.getItem("activeStep");
        let activeStep = Number(storedStep);
        if (activeStep === 0) {
          let callback = this.$emit(
            "validateAndProceed",
            this.proceed.bind(this)
          );
        } else if (activeStep === 1) {
          if (this.name === "propertyPreview") {
            this.$router.push(`/createProperty/${this.name}`);
          } else {
            this.$router.push(`/createProperty/${this.name}`);
          }
        } else if (activeStep === 2) {
          const storedImages = localStorage.getItem("localImages");
          if (storedImages) {
            const files = JSON.parse(storedImages);
            await this.createProperty(files);
            this.$router.push(`/createProperty/completed`);
          } else {
            this.$router.push(`/createProperty/completed`);
          }
        }
      } catch (error) {
        console.log("Error:", error);
      } finally {
        this.stopLoading();
      }
    },
    proceed(isValid) {
      if (isValid) {
        this.$router.push(`/createProperty/${this.name}`);
        localStorage.setItem("activeStep", 1);
      } else {
        this.stopLoading();
      }
    },
  },
};
</script>
