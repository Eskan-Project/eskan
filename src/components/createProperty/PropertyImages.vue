<template>
  <div class="bg-white rounded-lg p-4 shadow-sm w-full mx-auto">
    <div class="rounded-lg p-4 w-full mx-auto">
      <h2 class="text-lg font-semibold mb-2 text-center sm:text-left">
        Posting Photos
      </h2>
      <div class="flex flex-col items-center space-y-2 py-4">
        <i
          class="bi bi-images text-4xl text-gray-500"
          v-if="images.length === 0"
        ></i>
        <p class="text-gray-500 text-center" v-if="images.length === 0">
          You can add up to 30 photos to your ad
        </p>
        <label
          class="border border-[var(--secondary-color)] bg-[var(--secondary-color)] text-white px-4 py-2 rounded-md cursor-pointer hover:bg-white hover:text-[var(--secondary-color)] transition"
        >
          Download From Computer
          <input
            type="file"
            multiple
            @change="handleUpload"
            class="hidden"
            accept="image/*"
          />
        </label>
      </div>
      <div
        class="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center mt-4 w-full"
      >
        <div
          v-if="images.length === 0"
          class="flex flex-col items-center text-center"
        >
          <span class="text-4xl text-gray-400">+</span>
          <p class="text-gray-500">You can add up to 30 photos to your ad</p>
        </div>
        <div
          v-else
          class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-2"
        >
          <img
            v-for="(image, index) in images"
            :key="index"
            :src="image"
            class="w-24 h-24 object-cover rounded-lg sm:w-32 sm:h-32 md:w-36 md:h-36"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      images: [],
    };
  },
  methods: {
    handleUpload(event) {
      const files = event.target.files;
      if (files.length + this.images.length > 30) {
        alert("You can only upload up to 30 images.");
        return;
      }
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.images.push(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    },
  },
};
</script>
