<template>
  <div class="text-center text-black">
    <p class="font-medium p-2" :class="{ 'text-green-500': idImage }">
      {{ idImage ? "ID uploaded successfully" : "Please upload your ID" }}
    </p>
    <div
      v-if="!idImage"
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
        @change="handleFileChange"
        accept="image/png, image/jpeg, image/jpg"
      />
      <p class="p-5 text-sm text-stone-400">Supports JPEG, PNG, JPG</p>
    </div>

    <div v-if="idImage">
      <img :src="idImage" alt="ID" class="w-1/2 mx-auto" />
    </div>

    <p v-if="error" class="text-red-500 my-5">{{ error }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      file: null,
      idImage: null,
      error: null,
    };
  },
  methods: {
    handleFileChange(event) {
      const file = event.target.files[0];
      this.file = file;

      if (this.file) {
        const reader = new FileReader();
        reader.readAsDataURL(this.file);
        reader.onload = () => {
          this.idImage = reader.result;
        };
      }
      this.$emit("idUploaded", this.file);
    },
  },
};
</script>
