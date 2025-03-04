<template>
  <div
    class="flex flex-col gap-8 md:w-[80vw] w-[90vw] mx-auto my-6 md:my-10 max-w-screen-lg"
  >
    <PropertyForm />
    <PropertyLocation />
    <PropertyImages />
    <CreateBtn title="Next" name="propertyPreview" />
  </div>
</template>

<script>
import PropertyForm from "./PropertyForm.vue";
import PropertyImages from "./PropertyImages.vue";
import CreateBtn from "./CreateBtn.vue";
import PropertyLocation from "./PropertyLocation.vue";
export default {
  components: {
    PropertyForm,
    PropertyImages,
    CreateBtn,
    PropertyLocation,
  },
};
</script>
