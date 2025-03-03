<template>
  <div
    class="flex flex-col gap-8 md:w-[80vw] w-[90vw] mx-auto my-6 md:my-10 max-w-screen-lg"
  >
    <PropertyForm />
    <PropertyImages />
    <button
      class="w-fit py-2 mx-auto border border-[var(--secondary-color)] bg-[var(--secondary-color)] text-white px-6 rounded-md cursor-pointer hover:bg-white hover:text-[var(--secondary-color)] transition"
    >
      Next
    </button>
  </div>
</template>

<script>
import PropertyForm from "./PropertyForm.vue";
import PropertyImages from "./PropertyImages.vue";

export default {
  components: {
    PropertyForm,
    PropertyImages,
  },
};
</script>
