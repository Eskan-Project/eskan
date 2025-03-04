<template>
  <div class="flex flex-col items-center justify-center h-[58vh] p-4">
    <i
      class="bi bi-check-circle-fill text-green-500 text-6xl md:text-8xl sm:text-7xl"
    ></i>
    <p class="text-gray-600 text-sm md:text-lg font-bold mt-6 text-center">
      Your property has been created successfully and will be reviewed by our
      team.
    </p>
    <div class="flex justify-center mt-6">
      <CreateBtn title="Back to Home" name="Home" />
    </div>
  </div>
</template>

<script>
import CreateBtn from "./CreateBtn.vue";
export default {
  components: { CreateBtn },
};
</script>
