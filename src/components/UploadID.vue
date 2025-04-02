<template>
  <div class="text-center text-black">
    <p
      class="font-semibold text-xl md:text-2xl p-2 my-5"
      :class="{ 'text-green-500': idImage }"
    >
      {{ idImage ? "ID uploaded successfully" : "Please upload your ID" }}
    </p>
    <div
      v-if="!idImage && validating === null"
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
        <p class="p-5 text-sm text-stone-400">Supports JPEG, PNG, JPG</p>
      </label>
      <input
        type="file"
        id="file"
        class="hidden"
        @change="handleFileChange"
        accept="image/png, image/jpeg, image/jpg"
      />
    </div>

    <div v-if="idImage">
      <div class="w-1/3 mx-auto relative">
        <img :src="idImage" alt="Image Preview" />
        <button
          @click="removeImage"
          class="cursor-pointer absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
        >
          &times;
        </button>
      </div>
    </div>

    <p v-if="error" class="text-red-500 my-5">{{ error }}</p>
    <p v-if="validating" class="text-stone-400 my-5">{{ validating }}</p>
  </div>
</template>

<script>
import { validateImage } from "../services/imageValidationService";
export default {
  data() {
    return {
      file: null,
      idImage: null,
      error: null,
      validating: null,
      validLabels: [
        "card",
        "document",
        "paper",
        "text",
        "envelope",
        "label",
        "rectangle",
        "dust",
      ],
    };
  },
  methods: {
    async handleFileChange(event) {
      const file = event.target.files[0];
      this.file = file;
      this.error = null;
      this.idImage = null;
      this.validating = "Preparing image data...";
      try {
        const isValid = await validateImage(
          file,
          this.$t("auth.validation.validating_id"),
          (message) => {
            this.validating = message;
          }
        );
        if (isValid) {
          this.idImage = URL.createObjectURL(this.file);
          this.error = null;
          this.validating = null;
          this.$emit("idUploaded", this.file);
        } else {
          this.error = "Invalid ID image. Please upload a clear ID photo.";
          this.validating = null;
        }
      } catch (error) {
        this.error = "Error validating image. Please try again.";
        this.validating = null;
        console.log(error);
      }
    },
    removeImage() {
      this.idImage = null;
      this.error = null;
      this.validating = null;
    },
  },
};
</script>
