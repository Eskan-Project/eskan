<template>
  <button
    @click="nextStep"
    :name="name"
    class="w-fit py-2 mx-auto border border-[var(--secondary-color)] bg-[var(--secondary-color)] text-white px-6 rounded-md cursor-pointer hover:bg-white hover:text-[var(--secondary-color)] transition"
  >
    {{ title }}
  </button>
</template>

<script>
import { mapActions, mapMutations } from "vuex";
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
  methods: {
    ...mapActions("property", ["createProperty"]),
    ...mapMutations("property", ["updateProperty"]),
    nextStep() {
      let storedStep = localStorage.getItem("activeStep");

      if (this.name === "propertyPreview") {
        this.$emit("validateAndProceed", (valid) => {
          if (valid) {
            storedStep++;
            localStorage.setItem("activeStep", storedStep);
            this.$router.push({ name: this.name });
          }
        });
      } else if (this.name === "propertyContact") {
        storedStep++;
        localStorage.setItem("activeStep", storedStep);
        this.$router.push({ name: this.name });
      } else if (this.name === "completed") {
        storedStep++;
        localStorage.setItem("activeStep", storedStep);
        const localImages = JSON.parse(localStorage.getItem("localImages"));
        console.log(localImages);
        const propertyDetails = localStorage.getItem("propertyDetails");
        console.log(propertyDetails);
        this.updateProperty(JSON.parse(propertyDetails));
        this.createProperty(localImages);
        console.log("Property created");
        this.$router.push({ name: "completed" });
      } else {
        this.$router.push({ name: this.name });
        localStorage.removeItem("localImages");
        localStorage.removeItem("propertyDetails");
        localStorage.removeItem("activeStep");
        localStorage.removeItem("maxSteps");
      }
    },
  },
};
</script>
