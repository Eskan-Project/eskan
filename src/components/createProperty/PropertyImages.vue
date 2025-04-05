<template>
  <div
    class="bg-white dark:bg-[#1F2937] rounded-lg p-4 shadow-sm w-full mx-auto"
  >
    <div class="rounded-lg p-4 w-full mx-auto">
      <h2
        class="font-semibold mb-2 text-center text-gray-700 dark:text-white text-lg md:text-xl"
      >
        {{ $t("createProperty.images.title") }}
      </h2>

      <div class="flex flex-col items-center space-y-4 py-4">
        <div
          class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 flex flex-col gap-4 items-center justify-center mt-4 w-full"
        >
          <i
            class="bi bi-images text-4xl text-gray-500 dark:text-gray-400"
            v-if="localImages.length === 0"
          ></i>
          <p class="text-gray-500 dark:text-gray-400 text-center">
            {{ $t("createProperty.images.maxImages") }}
          </p>
          <label
            :class="
              localImages.length >= 15
                ? 'border border-[var(--secondary-color)] dark:border-gray-500 bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-4 py-2 rounded-md cursor-not-allowed'
                : 'border border-[var(--secondary-color)] dark:border-[#3D8BFF] bg-[var(--secondary-color)] dark:bg-[#3D8BFF] text-white px-4 py-2 rounded-md cursor-pointer hover:bg-white dark:hover:bg-gray-800 hover:text-[var(--secondary-color)] dark:hover:text-[#3D8BFF] transition'
            "
          >
            {{ $t("createProperty.images.orClick") }}
            <input
              :disabled="localImages.length >= 15"
              type="file"
              multiple
              @change="handleUpload"
              class="hidden"
              accept="image/png, image/jpeg, image/jpg, image/webp"
            />
          </label>

          <p v-if="errorMessage" class="text-red-500 text-sm text-center mt-2">
            {{ errorMessage }}
          </p>

          <div
            v-else
            class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 mt-2"
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
  </div>
</template>

<script>
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
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

      if (files.length + this.localImages.length > 15) {
        toast.error(this.$t("createProperty.images.maxImages"));
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
        this.errorMessage = this.$t("createProperty.validation.uploadImages");
        return false;
      }
      return true;
    },
  },
};
</script>
