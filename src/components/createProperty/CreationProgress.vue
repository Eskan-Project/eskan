<template>
  <div class="container mt-15 mb-10 mx-auto w-[90vw] md:w-full">
    <div class="flex justify-center items-center">
      <template v-for="(step, index) in steps" :key="step.path">
        <span
          @click="toggleActive(index)"
          :class="
            index <= maxSteps && !isCompleted
              ? 'cursor-pointer'
              : 'cursor-not-allowed'
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
      handler: function (val) {
        this.loadActiveStep();
        this.loadMaxSteps();
        this.updateMaxSteps();
      },
      immediate: true,
    },
  },
  computed: {
    ...mapGetters(["isLoading"]),
  },
  created() {
    this.loadActiveStep();
    this.loadMaxSteps();
    this.updateMaxSteps();
  },
  methods: {
    ...mapActions(["startLoading", "stopLoading"]),
    toggleActive(index) {
      if (index > this.maxSteps) {
        return;
      }
      if (this.maxSteps === 3) {
        this.isCompleted = true;
        return;
      }
      this.startLoading();
      this.activeStep = index;
      this.saveActiveStep();
      this.$router.push(this.steps[index].path).then(() => {
        this.stopLoading();
      });
    },
    saveActiveStep() {
      localStorage.setItem("activeStep", this.activeStep);
      localStorage.setItem("maxSteps", this.maxSteps);
    },
    loadActiveStep() {
      const storedStep = localStorage.getItem("activeStep");
      if (storedStep !== null) {
        this.activeStep = parseInt(storedStep);
      }
    },
    loadMaxSteps() {
      const storedMaxSteps = localStorage.getItem("maxSteps");
      if (storedMaxSteps !== null) {
        this.maxSteps = parseInt(storedMaxSteps);
      }
    },
    updateMaxSteps() {
      if (this.activeStep > this.maxSteps) {
        this.maxSteps = this.activeStep;
        localStorage.setItem("maxSteps", this.maxSteps);
      }
    },
  },
};
</script>
