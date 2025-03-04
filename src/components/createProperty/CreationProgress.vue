<template>
  <div class="container mt-15 mb-10 mx-auto w-[90vw] md:w-full">
    <div class="flex justify-center items-center">
      <template v-for="(step, index) in steps" :key="step.path">
        <span @click="toggleActive(index)">
          <i
            :class="[
              step.icon,
              'text-2xl py-2 px-2 rounded-full cursor-pointer transition-all',
              index <= activeStep
                ? 'bg-[var(--secondary-color)] text-white'
                : 'bg-gray-300 text-gray-600',
            ]"
          ></i>
        </span>
        <span
          v-if="index < steps.length - 1"
          :class="[
            'border border-b-1 w-20 mx-3 transition-all',
            index < activeStep
              ? 'border-[var(--secondary-color)]'
              : 'border-gray-300',
          ]"
        ></span>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      steps: [
        { path: "/createProperty", icon: "bi bi-pencil" },
        { path: "/createProperty/propertyPreview", icon: "bi bi-eye" },
        { path: "/createProperty/propertyContact", icon: "bi bi-telephone" },
        { path: "/createProperty/completed", icon: "bi bi-check-lg" },
      ],
      activeStep: 0,
    };
  },
  watch: {
    $route: {
      handler: function (val) {
        this.loadActiveStep();
      },
      immediate: true,
    },
  },
  created() {
    this.loadActiveStep();
  },
  methods: {
    toggleActive(index) {
      this.activeStep = index;
      this.saveActiveStep();
      this.$router.push(this.steps[index].path);
    },
    saveActiveStep() {
      localStorage.setItem("activeStep", this.activeStep);
    },
    loadActiveStep() {
      const storedStep = localStorage.getItem("activeStep");
      if (storedStep !== null) {
        this.activeStep = parseInt(storedStep);
      }
    },
  },
};
</script>
