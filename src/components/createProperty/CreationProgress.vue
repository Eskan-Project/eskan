<template>
  <div class="container mt-15 mb-10 mx-auto w-[90vw] md:w-full">
    <div class="flex justify-center items-center">
      <template v-for="(step, index) in steps" :key="step.path">
        <span
          @click="toggleActive(index)"
          :class="
            canToggleStep(index)
              ? 'cursor-pointer'
              : 'cursor-not-allowed opacity-50'
          "
        >
          <i
            :class="[
              step.icon,
              'text-base sm:text-2xl py-2 px-2 rounded-full transition-all ',
              index <= activeStep || isCompleted
                ? 'bg-[var(--secondary-color)] dark:bg-[#3D8BFF] text-white'
                : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300',
            ]"
          ></i>
        </span>
        <span
          v-if="index < steps.length - 1"
          :class="[
            'border border-b-1 w-20 mx-3 transition-all',
            index < activeStep || isCompleted
              ? 'border-[var(--secondary-color)] dark:border-[#3D8BFF]'
              : 'border-gray-300 dark:border-gray-600',
          ]"
        ></span>
      </template>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      steps: [
        {
          path: "/createProperty",
          icon: "bi bi-pencil",
          label: "createProperty.progress.general",
        },
        {
          path: "/createProperty/propertyPreview",
          icon: "bi bi-eye",
          label: "createProperty.progress.preview",
        },
        {
          path: "/createProperty/propertyContact",
          icon: "bi bi-telephone",
          label: "createProperty.progress.contact",
        },
        {
          path: "/createProperty/completed",
          icon: "bi bi-check-lg",
          label: "createProperty.progress.completed",
        },
      ],
      activeStep: 0,
      maxSteps: 0,
      isCompleted: false,
    };
  },
  watch: {
    $route: {
      handler(val) {
        this.loadState();
        this.updateStateBasedOnRoute(val.path);
      },
      immediate: true,
    },
  },
  computed: {
    ...mapGetters(["isLoading"]),
  },
  created() {
    this.loadState();
  },
  methods: {
    ...mapActions(["startLoading", "stopLoading"]),
    canToggleStep(index) {
      // Allow toggling if not completed and within maxSteps, or if it's the last step
      return (
        (!this.isCompleted && index <= this.maxSteps) ||
        index === this.steps.length - 1
      );
    },
    isStepActiveOrCompleted(index) {
      // Highlight step if it's active, or if it's the last step when completed
      return (
        index <= this.activeStep ||
        (this.isCompleted && index === this.steps.length - 1)
      );
    },
    toggleActive(index) {
      if (!this.canToggleStep(index)) {
        return; // Do nothing if step cannot be toggled
      }

      this.startLoading();
      this.activeStep = index;

      // Set isCompleted to true when reaching the last step
      if (index === this.steps.length - 1) {
        this.isCompleted = true;
      }

      this.updateMaxSteps();
      this.saveState();
      this.$router.push(this.steps[index].path).then(() => {
        this.stopLoading();
      });
    },
    updateMaxSteps() {
      if (this.activeStep > this.maxSteps) {
        this.maxSteps = this.activeStep;
      }
    },
    saveState() {
      localStorage.setItem("activeStep", this.activeStep);
      localStorage.setItem("maxSteps", this.maxSteps);
      localStorage.setItem("isCompleted", this.isCompleted);
    },
    loadState() {
      const storedStep = localStorage.getItem("activeStep");
      const storedMaxSteps = localStorage.getItem("maxSteps");
      const storedCompleted = localStorage.getItem("isCompleted");

      this.activeStep = storedStep !== null ? parseInt(storedStep) : 0;
      this.maxSteps = storedMaxSteps !== null ? parseInt(storedMaxSteps) : 0;
      this.isCompleted = storedCompleted === "true"; // Convert string to boolean
    },
    updateStateBasedOnRoute(currentPath) {
      const stepIndex = this.steps.findIndex(
        (step) => step.path === currentPath
      );
      if (stepIndex !== -1) {
        this.activeStep = stepIndex;
        if (stepIndex === this.steps.length - 1) {
          this.isCompleted = true;
        }
        this.updateMaxSteps();
        this.saveState();
      }
    },
  },
};
</script>
