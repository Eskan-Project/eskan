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
    nextStep() {
      this.$router.push({ name: this.name });
      var storedStep = localStorage.getItem("activeStep");
      storedStep++;
      localStorage.setItem("activeStep", storedStep);
    },
  },
};
</script>
