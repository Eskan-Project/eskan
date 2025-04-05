<template>
  <div
    class="flex flex-col gap-8 md:w-[80vw] w-[90vw] mx-auto my-6 md:my-10 max-w-screen-lg min-h-[56vh]"
  >
    <div class="px-3 py-6 bg-white dark:bg-[#1F2937] shadow-sm rounded-lg">
      <h2
        class="text-xl font-semibold mb-10 text-gray-700 dark:text-white text-center"
      >
        {{ $t("createProperty.contact.title") }}
      </h2>

      <form
        class="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-6 items-center justify-center pb-5"
        novalidate
      >
        <InputField
          v-model="propertyDetails.propertyContact.name"
          :label="$t('createProperty.contact.name')"
          required
          class="w-full md:w-[70%] mx-auto"
        />

        <InputField
          v-model="propertyDetails.propertyContact.email"
          :label="$t('createProperty.contact.email')"
          required
          class="w-full md:w-[70%]"
        />

        <InputField
          v-model="propertyDetails.propertyContact.phone"
          :label="$t('createProperty.contact.phone')"
          required
          class="w-full md:w-[70%] mx-auto"
        />
        <InputField
          v-model="propertyDetails.propertyContact.phone2"
          :label="$t('createProperty.contact.alternatePhone')"
          class="w-full md:w-[70%]"
        />
      </form>
      <div class="w-full md:w-[70%] mx-auto">
        <label class="block text-gray-700 dark:text-white mb-2 font-medium">
          {{ $t("createProperty.contact.contract") }}
          <span class="text-red-500">*</span>
        </label>
        <div
          class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 flex flex-col items-center justify-center"
          :class="{
            'border-green-500': contractImage,
            'border-red-500': isSubmitAttempted && !contractImage,
          }"
        >
          <div v-if="!contractImage" class="flex flex-col items-center gap-2">
            <i
              class="bi bi-file-earmark-text text-4xl text-gray-500 dark:text-gray-400"
            ></i>
            <label class="cursor-pointer">
              <span
                class="border border-[var(--secondary-color)] dark:border-[#3D8BFF] bg-[var(--secondary-color)] dark:bg-[#3D8BFF] text-white px-4 py-2 rounded-md hover:bg-white dark:hover:bg-gray-800 hover:text-[var(--secondary-color)] dark:hover:text-[#3D8BFF] transition"
              >
                {{ $t("createProperty.images.orClick") }}
              </span>
              <input
                type="file"
                class="hidden"
                @change="handleContractUpload"
                accept="image/png, image/jpeg, image/jpg, image/webp"
              />
            </label>
            <p
              class="text-gray-500 dark:text-gray-400 text-sm text-center mt-2"
            >
              {{
                $t("createProperty.contact.uploadContract") ||
                "Upload contract image"
              }}
            </p>
          </div>
          <div v-else class="relative w-1/3">
            <img :src="contractImage" class="max-h-40 mx-auto" alt="Contract" />
            <button
              @click="removeContractImage"
              class="cursor-pointer absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
            >
              &times;
            </button>
          </div>
        </div>
        <p v-if="contractError" class="text-red-500 text-sm mt-1">
          {{ contractError }}
        </p>
        <p
          v-if="isSubmitAttempted && !contractImage && !contractError"
          class="text-red-500 text-sm mt-1"
        >
          {{
            $t("createProperty.validation.contractRequired") ||
            "Contract image is required"
          }}
        </p>
      </div>
    </div>
    <CreateBtn
      :title="$t('createProperty.buttons.submit')"
      name="completed"
      @click="validateBeforeSubmit"
    />
  </div>
</template>

<script>
import InputField from "@/components/InputField.vue";
import CreateBtn from "./CreateBtn.vue";
import { mapState } from "vuex";
export default {
  components: {
    InputField,
    CreateBtn,
  },
  data() {
    return {
      contractImage: null,
      contractError: null,
      isSubmitAttempted: false,
    };
  },
  computed: {
    ...mapState("property", ["propertyDetails"]),
    ...mapState("auth", ["userDetails"]),
  },
  mounted() {
    this.propertyDetails.propertyContact.image = this.userDetails.photo;
    // If contract is already an image URL, display it
    if (
      this.propertyDetails.propertyContact.contract &&
      this.propertyDetails.propertyContact.contract.startsWith("data:image")
    ) {
      this.contractImage = this.propertyDetails.propertyContact.contract;
    }
  },
  methods: {
    handleContractUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      this.contractError = null;

      // Validate file type
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      if (!validTypes.includes(file.type)) {
        this.contractError =
          "Please upload a valid image file (JPG, PNG, or WEBP)";
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.contractError = "File size should not exceed 5MB";
        return;
      }

      // Read and display the image
      const reader = new FileReader();
      reader.onload = (e) => {
        this.contractImage = e.target.result;
        this.propertyDetails.propertyContact.contract = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    removeContractImage() {
      this.contractImage = null;
      this.propertyDetails.propertyContact.contract = "";
    },
    validateBeforeSubmit() {
      this.isSubmitAttempted = true;

      if (!this.contractImage) {
        // Scroll to form and highlight the error
        this.$nextTick(() => {
          const formElement = document.querySelector(".border-red-500");
          if (formElement) {
            formElement.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        });
        return false;
      }

      return true;
    },
  },
  watch: {
    propertyDetails: {
      deep: true,
      handler(newData) {
        localStorage.setItem("propertyDetails", JSON.stringify(newData));
      },
    },
  },
  created() {
    const savedData = localStorage.getItem("propertyDetails");
    if (savedData) {
      this.$store.commit("property/updateProperty", JSON.parse(savedData));

      // Check if contract is an image URL from saved data
      const parsedData = JSON.parse(savedData);
      if (
        parsedData.propertyContact?.contract &&
        parsedData.propertyContact.contract.startsWith("data:image")
      ) {
        this.contractImage = parsedData.propertyContact.contract;
      }
    }
  },
};
</script>
