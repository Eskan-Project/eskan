<template>
  <main class="min-h-screen bg-white dark:bg-gray-900 flex-1 p-3 sm:p-4 md:p-8">
    <div class="w-full">
      <div class="max-w-7xl mx-auto">
        <form @submit.prevent="submitProperty">
          <div class="space-y-8">
            <div class="border-b border-gray-900/10 dark:border-gray-700 pb-8">
              <h2
                class="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white"
              >
                Add Property
              </h2>
              <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
                This information will be displayed to users to see the details
                about the property.
              </p>
            </div>

            <!-- Property Info Grid -->
            <div
              class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
            >
              <div
                v-for="field in propertyInfo"
                :key="field.key"
                :class="{
                  'col-span-1 sm:col-span-2 lg:col-span-3':
                    field.type === 'textarea',
                  'col-span-1': field.type !== 'textarea',
                }"
              >
                <InputField
                  v-if="field.type !== 'file'"
                  :label="field.label"
                  v-model="propertyDetails[field.key]"
                  :type="field.type"
                  :required="field.required"
                  :options="field.options"
                  class="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              </div>

              <!-- Contact Info -->
              <div
                v-for="field in propertyContact"
                :key="field.key"
                class="col-span-1"
              >
                <InputField
                  :label="field.label"
                  v-model="propertyDetails.propertyContact[field.key]"
                  :type="field.type"
                  :required="field.required"
                  class="dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              </div>

              <!-- Contract Image Upload -->
              <div class="col-span-1 sm:col-span-2 lg:col-span-3 mb-6">
                <label
                  class="block text-gray-700 dark:text-gray-300 font-medium mb-2"
                >
                  Contract Document <span class="text-red-500">*</span>
                </label>
                <div
                  class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 flex flex-col items-center justify-center"
                  :class="{
                    'border-green-500': contractImage,
                    'border-red-500': errorMessage && !contractImage,
                  }"
                >
                  <div
                    v-if="!contractImage"
                    class="flex flex-col items-center gap-3 py-4"
                  >
                    <i
                      class="bi bi-file-earmark-text text-4xl text-gray-500 dark:text-gray-400"
                    ></i>
                    <p
                      class="text-gray-500 dark:text-gray-400 text-sm sm:text-base text-center"
                    >
                      Upload contract document image
                    </p>
                    <label class="cursor-pointer">
                      <span
                        class="border border-[var(--secondary-color)] bg-[var(--secondary-color)] text-white px-4 py-2 rounded-md hover:bg-white hover:text-[var(--secondary-color)] dark:hover:bg-gray-800 transition text-sm sm:text-base"
                      >
                        Upload
                      </span>
                      <input
                        type="file"
                        class="hidden"
                        @change="handleContractUpload"
                        accept="image/png, image/jpeg, image/jpg, image/webp"
                      />
                    </label>
                  </div>
                  <div v-else class="relative w-1/3 py-4">
                    <img
                      :src="contractImage"
                      class="max-h-48 mx-auto object-contain"
                      alt="Contract"
                    />
                    <button
                      @click="removeContractImage"
                      class="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 flex items-center justify-center rounded-full"
                    >
                      ×
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Image Upload Section -->
            <div
              class="rounded-lg p-4 w-full mx-auto bg-gray-50 dark:bg-gray-800"
            >
              <h2
                class="text-lg sm:text-xl font-semibold mb-4 text-center text-gray-500 dark:text-gray-300"
              >
                Property Images
              </h2>
              <div
                class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-3 sm:p-4"
              >
                <div class="flex flex-col items-center space-y-4 py-4">
                  <i
                    class="bi bi-images text-3xl sm:text-4xl text-gray-500 dark:text-gray-400"
                    v-if="uploadedImages.length === 0"
                  ></i>
                  <p
                    class="text-gray-500 dark:text-gray-400 text-center text-sm sm:text-base"
                  >
                    You can add up to 15 photos to your ad
                  </p>
                  <label
                    class="border border-[var(--secondary-color)] bg-[var(--secondary-color)] text-white px-6 py-2.5 rounded-md cursor-pointer hover:bg-white hover:text-[var(--secondary-color)] dark:hover:bg-gray-800 transition text-sm sm:text-base"
                  >
                    Upload
                    <input
                      type="file"
                      multiple
                      @change="handleImageUpload"
                      class="hidden"
                      accept="image/png, image/jpeg, image/jpg, image/webp"
                    />
                  </label>
                </div>

                <!-- Image Preview Grid -->
                <div
                  v-if="uploadedImages.length > 0"
                  class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4"
                >
                  <div
                    v-for="(image, index) in uploadedImages"
                    :key="index"
                    class="relative group aspect-square"
                  >
                    <img
                      :src="image"
                      class="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      @click="removeImage(index)"
                      class="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                </div>

                <p
                  v-if="errorMessage"
                  class="text-red-500 text-sm text-center mt-4"
                >
                  {{ errorMessage }}
                </p>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-4 justify-center py-4">
              <button
                type="submit"
                class="text-white rounded-md bg-[var(--secondary-color)] px-6 py-2.5 text-sm sm:text-base font-semibold border border-[var(--secondary-color)] hover:text-[var(--secondary-color)] hover:bg-white dark:hover:bg-gray-800 transition-colors"
              >
                Add Property
              </button>
              <button
                @click="resetForm"
                type="reset"
                class="text-white rounded-md bg-red-500 px-6 py-2.5 text-sm sm:text-base font-semibold border border-red-500 hover:bg-white hover:text-red-500 dark:hover:bg-gray-800 dark:hover:text-red-400 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </main>
</template>

<script>
import Swal from "sweetalert2";
import InputField from "@/components/InputField.vue";
import governorates from "@/assets/data/governorates.json";
import cities from "@/assets/data/cities.json";
import { mapState, mapActions, mapMutations } from "vuex";

export default {
  components: { InputField },
  data() {
    return {
      errorMessage: "",
      contractImage: null,
      initialPropertyDetails: {
        title: "",
        description: "",
        rooms: "",
        livingRooms: "",
        bathrooms: "",
        price: "",
        kitchens: "",
        area: "",
        floor: "",
        furnished: "",
        propertyStatus: "",
        governorate: "",
        city: "",
        neighborhood: "",
        coordinates: null,
        images: [],
        createdAt: null,
        propertyContact: {
          name: "",
          email: "",
          phone: "",
          phone2: "",
          address: "",
        },
        isPaid: true,
        ownerProfile: "",
        status: "approved",
      },
      propertyInfo: [
        { key: "title", label: "Property Title", type: "text", required: true },
        {
          key: "governorate",
          label: "Governorate",
          type: "select",
          required: true,
          options: governorates.map((g) => ({
            value: g.id,
            label: g.governorate_name_en,
          })),
        },
        {
          key: "city",
          label: "City",
          type: "select",
          required: true,
          options: [],
        },
        {
          key: "neighborhood",
          label: "Neighborhood",
          type: "text",
          required: true,
        },
        {
          key: "description",
          label: "Description",
          type: "textarea",
          required: true,
        },
        { key: "price", label: "Price", type: "number", required: true },
        { key: "area", label: "Area", type: "number", required: true },
        { key: "rooms", label: "Rooms", type: "number", required: true },
        {
          key: "livingRooms",
          label: "Living Rooms",
          type: "number",
          required: true,
        },
        {
          key: "bathrooms",
          label: "Bathrooms",
          type: "number",
          required: true,
        },
        { key: "kitchens", label: "Kitchens", type: "number", required: true },
        {
          key: "propertyStatus",
          label: "Property Status",
          type: "select",
          required: true,
          options: [
            { value: "second-hand", label: "Second-hand" },
            { value: "new", label: "New" },
            { value: "renovated", label: "Renovated" },
          ],
        },
        { key: "floor", label: "Floor", type: "number", required: true },
        {
          key: "furnished",
          label: "Furnished",
          type: "select",
          required: true,
          options: [
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" },
          ],
        },
      ],
      propertyContact: [
        { key: "name", label: "Name", type: "text", required: true },
        { key: "email", label: "Email", type: "email", required: true },
        { key: "phone", label: "Phone", type: "text", required: true },
        { key: "phone2", label: "Phone 2", type: "text" },
        { key: "address", label: "Address", type: "text", required: true },
      ],
      uploadedImages: [],
    };
  },
  computed: {
    ...mapState("property", ["propertyDetails"]),
    filteredCities() {
      if (!this.propertyDetails.governorate) return [];
      return cities
        .filter(
          (city) => city.governorate_id === this.propertyDetails.governorate
        )
        .map((c) => ({ value: c.id, label: c.city_name_en }));
    },
  },
  watch: {
    "propertyDetails.governorate": {
      handler(newGovernorate) {
        if (newGovernorate) {
          const cityField = this.propertyInfo.find(
            (field) => field.key === "city"
          );
          if (cityField) {
            cityField.options = this.filteredCities;
          }
        }
      },
      immediate: true,
    },
  },
  created() {
    const savedData = localStorage.getItem("propertyDetails");
    if (savedData) {
      this.updateProperty(JSON.parse(savedData));
    }
  },
  methods: {
    ...mapActions("property", ["createProperty"]),
    ...mapMutations("property", ["updateProperty"]),
    handleImageUpload(event) {
      this.errorMessage = "";
      const files = Array.from(event.target.files);
      if (files.length + this.uploadedImages.length > 15) {
        this.errorMessage = "You can only upload up to 15 images.";
        return;
      }
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.uploadedImages.push(e.target.result);
        };
        reader.readAsDataURL(file);
      });
    },
    removeImage(index) {
      this.uploadedImages.splice(index, 1);
    },
    handleContractUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      // Validate file type
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      if (!validTypes.includes(file.type)) {
        this.errorMessage =
          "Please upload a valid image file (JPG, PNG, or WEBP)";
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.errorMessage = "Contract file size should not exceed 5MB";
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

    async submitProperty() {
      if (this.uploadedImages.length === 0) {
        this.errorMessage = "Please upload at least one image.";
        return;
      }

      if (!this.contractImage) {
        this.errorMessage = "Please upload a contract document image.";
        return;
      }

      try {
        const result = await Swal.fire({
          title: "Are you sure?",
          text: "This property is going to be added!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, confirm",
        });

        if (!result.isConfirmed) return;

        await this.createProperty(this.uploadedImages);

        await Swal.fire("Done!", "Your property has been added.", "success");
        this.uploadedImages = [];
        this.$router.push("/admin/properties");
      } catch (error) {
        this.errorMessage = `Failed to add property: ${error.message}`;
      }
    },
    async resetForm() {
      try {
        const result = await Swal.fire({
          title: "Are you sure?",
          text: "This property is going to be reset!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, reset",
        });

        if (!result.isConfirmed) return;

        this.updateProperty(this.initialPropertyDetails);
        this.uploadedImages = [];
        localStorage.removeItem("propertyDetails");

        await Swal.fire("Done!", "Your property has been reset.", "success");
      } catch (error) {
        this.errorMessage = `Failed to reset property: ${error.message}`;
      }
    },
  },
};
</script>
