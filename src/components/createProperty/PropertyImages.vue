<template>
  <div class="bg-white rounded-lg p-4 shadow-sm w-full mx-auto">
    <div class="rounded-lg p-4 w-full mx-auto">
      <h2 class="text-lg font-semibold mb-2 text-center sm:text-left">
        Posting Photos
      </h2>

      <div class="flex flex-col items-center space-y-2 py-4">
        <i
          class="bi bi-images text-4xl text-gray-500"
          v-if="localImages.length === 0"
        ></i>
        <p class="text-gray-500 text-center">
          You can add up to 30 photos to your ad
        </p>
        <label
          class="border border-[var(--secondary-color)] bg-[var(--secondary-color)] text-white px-4 py-2 rounded-md cursor-pointer hover:bg-white hover:text-[var(--secondary-color)] transition"
        >
          Upload
          <input
            type="file"
            multiple
            @change="handleUpload"
            class="hidden"
            accept="image/png, image/jpeg, image/jpg, image/webp"
          />
        </label>
      </div>

      <p v-if="errorMessage" class="text-red-500 text-sm text-center mt-2">
        {{ errorMessage }}
      </p>

      <div
        class="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center mt-4 w-full"
      >
        <div
          v-if="localImages.length === 0"
          class="flex flex-col items-center text-center"
        >
          <span class="text-4xl text-gray-400">+</span>
          <p class="text-gray-500">You can add up to 30 photos to your ad</p>
        </div>

        <div
          v-else
          class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-2"
        >
          <div
            v-for="(image, index) in localImages"
            :key="index"
            class="relative group"
          >
            <img
              :src="image"
              class="w-24 h-24 object-cover rounded-lg sm:w-32 sm:h-32 md:w-36 md:h-36"
            />
            <button
              @click="removeImage(index)"
              class="cursor-pointer absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              &times;
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    images: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      localImages:
        JSON.parse(localStorage.getItem("localImages")) || this.images,
      errorMessage: "",
    };
  },
  watch: {
    localImages: {
      deep: true,
      handler(newValue) {
        localStorage.setItem("localImages", JSON.stringify(newValue));
        this.$emit("images", newValue);
      },
    },
  },
  methods: {
    handleUpload(event) {
      const files = Array.from(event.target.files);
      this.errorMessage = "";

      if (files.length + this.localImages.length > 30) {
        this.errorMessage = "You can only upload up to 30 images.";
        return;
      }

      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.localImages.push(e.target.result);
        };
        reader.readAsDataURL(file);
      });
    },
    removeImage(index) {
      this.localImages.splice(index, 1);
    },
    validateForm() {
      if (this.localImages.length < 4) {
        this.errorMessage = "Please upload at least 4 images.";
        return false;
      }
      return true;
    },
  },
};
</script>
