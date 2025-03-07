<template>
  <div class="text-center text-black">
    <p class="font-medium p-2" :class="{ 'text-green-500': imageUrl }">
      {{ imageUrl ? "ID uploaded successfully" : "Please upload your ID" }}
    </p>
    <div
      v-if="!imageUrl"
      class="border-1 border-stone-400 border-dashed p-5 mx-10"
    >
      <label for="file">
        <i
          class="bi bi-cloud-upload text-5xl text-stone-400 cursor-pointer"
        ></i>
        <p>
          Drag &amp; drop files or
          <span
            class="font-bold text-[#364365] cursor-pointer underline decoration-2"
            >Browse</span
          >
        </p>
      </label>
      <input
        type="file"
        id="file"
        class="hidden"
        @change="handleFileUpload"
        accept="image/png, image/jpeg, image/jpg"
      />
      <p class="p-5 text-sm text-stone-400">Supports JPEG, PNG, JPG</p>
    </div>

    <div v-if="imageUrl">
      <img :src="imageUrl" alt="ID" class="w-1/2 mx-auto" />
    </div>

    <p v-if="error" class="text-red-500 my-5">{{ error }}</p>
  </div>
</template>

<script>
import uploadToCloudinary from "../services/uploadToCloudinary";
export default {
  data() {
    return {
      idFile: null,
      imageUrl: "",
      error: null,
    };
  },
  methods: {
    async handleFileUpload(event) {
      this.idFile = event.target.files[0];

      if (!this.idFile) return;

      try {
        this.$store.commit("setLoading", true);
        const response = await uploadToCloudinary(
          this.idFile,
          import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
        );
        this.imageUrl = response;
        this.$emit("idUploaded", this.imageUrl);
      } catch (error) {
        this.error = error.response.data.error;
      } finally {
        this.$store.commit("setLoading", false);
      }
    },
  },
};
</script>
