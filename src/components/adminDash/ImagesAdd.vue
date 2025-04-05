<template>
  <div
    :class="{ 'w-[50%]': !isMultiple, 'w-full': isMultiple }"
    class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm mx-auto"
  >
    <div class="rounded-lg p-4 w-full mx-auto">
      <h2
        class="text-lg font-semibold mb-2 text-center sm:text-left text-black dark:text-white"
      >
        <slot name="header"></slot>
      </h2>

      <div class="flex flex-col items-center space-y-2 py-4">
        <i
          :class="icon"
          class="text-4xl text-gray-500 dark:text-gray-400"
          v-if="localImages.length === 0"
        ></i>
        <p class="text-gray-500 dark:text-gray-400 text-center">
          <slot name="underIcon"></slot>
        </p>
        <label
          class="border border-[var(--secondary-color)] bg-[var(--secondary-color)] text-white px-4 py-2 rounded-md cursor-pointer hover:bg-white hover:text-[var(--secondary-color)] dark:hover:bg-gray-700 transition"
        >
          Upload From Computer
          <input
            required
            type="file"
            :multiple="isMultiple"
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
        class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 flex flex-col items-center justify-center mt-4 w-full"
      >
        <div
          v-if="localImages.length === 0"
          class="flex flex-col items-center text-center"
        >
          <span class="text-4xl text-gray-400 dark:text-gray-500">+</span>
          <p class="text-gray-500 dark:text-gray-400"></p>
        </div>

        <div
          v-else
          :class="{
            'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-2':
              isMultiple,
            'gap-2 mt-2': !isMultiple,
          }"
        >
          <div
            v-for="(image, index) in localImages"
            :key="index"
            class="relative group"
          >
            <img
              :src="image"
              class="w-24 h-24 object-cover rounded-lg sm:w-32 sm:h-32 md:w-36 md:h-36 text-center border dark:border-gray-600"
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

<style>
/* Add dark mode styles for inputs */
.dark input {
  color: white;
}

/* Fix any potential light mode issues */
input {
  color: #111827; /* gray-900 for better contrast in light mode */
}
</style>

<script>
export default {
  props: {
    isMultiple: Boolean,
    icon: String,
    images: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      localImages: this.images,
      errorMessage: "",
    };
  },
  watch: {
    localImages: {
      deep: true,
      handler(newValue) {
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
