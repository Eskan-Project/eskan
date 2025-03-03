<template>
  <div class="container mt-15 mb-5 mx-auto">
    <div class="flex justify-center items-center">
      <template v-for="(step, index) in steps" :key="step.path">
        <span @click="toggleActive(index)">
          <i
            :class="[
              step.icon,
              'text-2xl py-2 px-2 rounded-full cursor-pointer transition-all',
              step.isActive
                ? 'bg-[var(--secondary-color)] text-white'
                : 'bg-gray-300 text-gray-600',
            ]"
          ></i>
        </span>
        <span
          v-if="index < steps.length - 1"
          :class="[
            'border border-b-1 w-20 mx-3 transition-all',
            steps[index + 1].isActive
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
        { path: "/createProperty", icon: "bi bi-pencil", isActive: true },
        {
          path: "/createProperty/propertyPreview",
          icon: "bi bi-eye",
          isActive: false,
        },
        {
          path: "/createProperty/propertyContact",
          icon: "bi bi-telephone",
          isActive: false,
        },
        {
          path: "/createProperty/completed",
          icon: "bi bi-check-lg",
          isActive: false,
        },
      ],
    };
  },
  methods: {
    toggleActive(index) {
      for (let i = 0; i <= index; i++) {
        this.steps[i].isActive = true;
      }
      for (let i = index + 1; i < this.steps.length; i++) {
        this.steps[i].isActive = false;
      }
      this.$router.push(this.steps[index].path);
    },
  },
};
</script>
