<template>
  <button
    @click="nextStep"
    :name="name"
    :disabled="isLoading"
    class="w-fit py-2 mx-auto border border-[var(--secondary-color)] bg-[var(--secondary-color)] text-white px-6 rounded-md cursor-pointer hover:bg-white hover:text-[var(--secondary-color)] transition"
  >
    {{ isLoading ? "Loading..." : title }}
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

        if (this.name === "propertyPreview") {
          this.$emit("validateAndProceed", (valid) => {
            if (valid) {
              storedStep++;
              localStorage.setItem("activeStep", storedStep);
              this.$router.push({ name: this.name }).then(() => {
                  this.stopLoading();
              });
            } else {
              this.stopLoading();
            }
          });
        } else if (this.name === "propertyContact") {
          storedStep++;
          localStorage.setItem("activeStep", storedStep);
          await this.$router.push({ name: this.name });
          this.stopLoading();
        } else if (this.name === "completed") {
          storedStep++;
          localStorage.setItem("activeStep", storedStep);
          const localImages = JSON.parse(localStorage.getItem("localImages"));
          const propertyDetails = localStorage.getItem("propertyDetails");
          this.updateProperty(JSON.parse(propertyDetails));
          await this.createProperty(localImages);
          await this.$router.push({ name: "completed" });
          this.stopLoading();
        } else {
          await this.$router.push({ name: this.name });
          setTimeout(() => {
            localStorage.removeItem("localImages");
            localStorage.removeItem("propertyDetails");
            localStorage.removeItem("activeStep");
            localStorage.removeItem("maxSteps");
          }, 0);
          this.stopLoading();
        }
      } catch (error) {
        console.error("Error in nextStep:", error);
        this.stopLoading();
      }
    },
  },
};
</script>
