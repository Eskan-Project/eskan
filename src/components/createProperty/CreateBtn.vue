<template>
  <button
    @click="nextStep"
    :name="name"
    :disabled="isLoading"
    class="w-fit py-2 mx-auto border border-[var(--secondary-color)] dark:border-[#3D8BFF] bg-[var(--secondary-color)] dark:bg-[#3D8BFF] text-white px-6 rounded-md cursor-pointer hover:bg-white dark:hover:bg-gray-800 hover:text-[var(--secondary-color)] dark:hover:text-[#3D8BFF] transition"
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
        let storedStep = parseInt(localStorage.getItem("activeStep")) || 0;

        if (this.name === "propertyPreview") {
          await this.handlePropertyPreview(storedStep);
        } else if (this.name === "propertyContact") {
          await this.handlePropertyContact(storedStep);
        } else if (this.name === "completed") {
          await this.handleCompleted(storedStep);
        } else {
          await this.$router.push({ name: this.name });
        }
      } catch (error) {
        console.error("Error in nextStep:", error);
      } finally {
        this.stopLoading();
      }
    },

    async handlePropertyPreview(storedStep) {
      return new Promise((resolve) => {
        this.$emit("validateAndProceed", (valid) => {
          if (valid) {
            storedStep++;
            localStorage.setItem("activeStep", storedStep);
            this.$router.push({ name: this.name }).then(resolve);
          } else {
            resolve();
          }
        });
      });
    },

    async handlePropertyContact(storedStep) {
      storedStep++;
      localStorage.setItem("activeStep", storedStep);
      await this.$router.push({ name: this.name });
    },

    async handleCompleted(storedStep) {
      const parentComponent = this.$parent;

      // Validate before submission
      if (
        parentComponent &&
        typeof parentComponent.validateBeforeSubmit === "function"
      ) {
        const isValid = parentComponent.validateBeforeSubmit();
        if (!isValid) {
          return;
        }
      }

      // Increment step and prepare data
      storedStep++;
      localStorage.setItem("activeStep", storedStep);
      const localImages = JSON.parse(
        localStorage.getItem("localImages") || "[]"
      );
      const propertyDetails = JSON.parse(
        localStorage.getItem("propertyDetails") || "{}"
      );
      this.updateProperty(propertyDetails);

      // Submit property and clean up
      await this.createProperty(localImages);
      await this.$router.push({ name: "completed" });
      this.clearLocalStorage();
    },

    clearLocalStorage() {
      localStorage.removeItem("localImages");
      localStorage.removeItem("propertyDetails");
      localStorage.removeItem("activeStep");
      localStorage.removeItem("maxSteps");
      localStorage.removeItem("isCompleted");
      // Clear property details in Vuex store
      this.updateProperty({});
    },
  },
};
</script>
