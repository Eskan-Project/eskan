<template>
  <div
    class="flex flex-col gap-8 md:w-[80vw] w-[90vw] mx-auto my-6 md:my-10 max-w-screen-lg"
  >
    <PropertyForm />
    <PropertyLocation />
    <PropertyImages @images="handleImages" />
    <p v-if="errorMessage" class="text-lg text-red-500 mt-1 text-center">
      {{ errorMessage }}
    </p>
    <CreateBtn
      title="Next"
      name="propertyPreview"
      @validateAndProceed="validateForm"
    />
  </div>
</template>

<script>
import PropertyForm from "./PropertyForm.vue";
import PropertyImages from "./PropertyImages.vue";
import CreateBtn from "./CreateBtn.vue";
import PropertyLocation from "./PropertyLocation.vue";
import { mapState } from "vuex";
export default {
  components: {
    PropertyForm,
    PropertyImages,
    CreateBtn,
    PropertyLocation,
  },
  data() {
    return {
      errorMessage: "",
      images: JSON.parse(localStorage.getItem("localImages")) || [],
    };
  },
  computed: {
    ...mapState("property", ["propertyDetails"]),
  },
  watch: {
    propertyDetails: {
      handler() {
        this.errorMessage = "";
      },
    },
  },
  methods: {
    handleImages(images) {
      this.images = images;
    },
    validateForm(callback) {
      if (
        this.propertyDetails.title &&
        this.propertyDetails.description &&
        this.propertyDetails.rooms &&
        this.propertyDetails.livingRooms &&
        this.propertyDetails.bathrooms &&
        this.propertyDetails.price &&
        this.propertyDetails.area &&
        this.propertyDetails.floor &&
        this.propertyDetails.coordinates &&
        this.images.length > 0
      ) {
        callback(true);
      } else if (this.propertyDetails.neighborhood === "") {
        this.errorMessage = "Please select property location on map";
        callback(false);
      } else {
        this.errorMessage = "Please fill all the fields";
        callback(false);
      }
    },
  },
};
</script>
