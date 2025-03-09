<template>
  <main class="min-h-screen bg-white flex-1 p-4 md:p-8">
    <div class="md:flex block">
      <div class="flex-1 p-4 md:p-8">
        <form @submit.prevent="submitProperty">
          <div class="space-y-12">
            <div class="border-b border-gray-900/10 pb-12">
              <h2 class="text-base/7 font-semibold text-gray-900">
                Add Property
              </h2>
              <p class="mt-1 text-sm/6 text-gray-600">
                This information will be displayed to users to see the details
                about the property.
              </p>
            </div>
            <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div
                v-for="field in propertyInfo"
                :class="field.type === 'textarea' ? 'col-span-5' : 'col-span-2'"
                :key="field.key"
              >
                <InputField
                  v-if="field.type !== 'file'"
                  :label="field.label"
                  v-model="propertyDetails[field.key]"
                  :type="field.type"
                  :required="field.required"
                  :options="field.options"
                />
              </div>
              <div
                v-for="field in propertyContact"
                :key="field.key"
                class="col-span-2"
              >
                <InputField
                  :label="field.label"
                  v-model="propertyDetails.propertyContact[field.key]"
                  :type="field.type"
                  :required="field.required"
                />
              </div>
            </div>
            <div class="rounded-lg p-4 w-full mx-auto">
              <h2 class="text-lg font-semibold mb-2 text-center sm:text-left">
                Property Images
              </h2>

              <div class="flex flex-col items-center space-y-2 py-4">
                <i
                  class="bi bi-images text-4xl text-gray-500"
                  v-if="uploadedImages.length === 0"
                ></i>
                <p class="text-gray-500 text-center">
                  You can add up to 30 photos to your ad
                </p>
                <label
                  class="border border-[var(--secondary-color)] bg-[var(--secondary-color)] text-white px-4 py-2 rounded-md cursor-pointer hover:bg-white hover:text-[var(--secondary-color)] transition"
                >
                  Upload From Computer
                  <input
                    type="file"
                    multiple
                    @change="handleImageUpload"
                    class="hidden"
                    accept="image/png, image/jpeg, image/jpg, image/webp"
                  />
                </label>
              </div>

              <div
                class="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center mt-4 w-full"
              >
                <div
                  v-if="uploadedImages.length === 0"
                  class="flex flex-col items-center text-center"
                >
                  <span class="text-4xl text-gray-400">+</span>
                  <p class="text-gray-500">
                    You can add up to 30 photos to your ad
                  </p>
                </div>

                <div
                  v-else
                  class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-2"
                >
                  <div
                    v-for="(image, index) in uploadedImages"
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
              <p
                v-if="errorMessage"
                class="text-red-500 text-sm text-center mt-2"
              >
                {{ errorMessage }}
              </p>
            </div>

            <div class="col-span-full flex gap-4 justify-center">
              <button
                type="submit"
                class="text-white rounded-md bg-[var(--secondary-color)] px-4 py-2 text-sm/6 font-semibold border border-[var(--secondary-color)] hover:bg-white hover:text-[var(--secondary-color)] cursor-pointer"
              >
                Add Property
              </button>
              <button
                @click="resetForm"
                type="reset"
                class="text-white rounded-md bg-red-500 px-4 py-2 text-sm/6 font-semibold border border-red-500 hover:bg-white hover:text-red-500 cursor-pointer"
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
  components: {
    InputField,
  },
  data() {
    return {
      savedData: null,
      errorMessage: "",
      initialPropertyDetails: {
        title: "",
        governorate: "",
        city: "",
        neighborhood: "",
        description: "",
        price: "",
        area: "",
        rooms: "",
        livingRooms: "",
        bathrooms: "",
        kitchens: "",
        propertyStatus: "",
        floor: "",
        furnished: "",
        propertyContact: {
          name: "",
          email: "",
          phone: "",
          phone2: "",
        },
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
        .map((c) => {
          return {
            value: c.id,
            label: c.city_name_en,
          };
        });
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
    propertyDetails: {
      deep: true,
      handler(newData) {
        localStorage.setItem("propertyDetails", JSON.stringify(newData));
      },
    },
  },
  created() {
    this.savedData = localStorage.getItem("propertyDetails");
    if (this.savedData) {
      this.$store.commit("property/updateProperty", JSON.parse(this.savedData));
    }
  },
  methods: {
    ...mapActions("property", ["createProperty"]),
    ...mapMutations("property", ["updateProperty"]),
    handleImageUpload(event) {
      this.errorMessage = "";
      const files = Array.from(event.target.files);
      if (files.length + this.uploadedImages.length > 30) {
        this.errorMessage = "You can only upload up to 30 images.";
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
    async submitProperty() {
      if (this.uploadedImages.length === 0) {
        this.errorMessage = "Please upload at least one image.";
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

        this.updateProperty(JSON.parse(this.savedData));
        this.createProperty({
          files: this.uploadedImages,
          role: "admin",
        });

        await Swal.fire("Done!", "Your property has been added.", "success");
        this.$store.commit(
          "property/updateProperty",
          this.initialPropertyDetails
        );
        this.uploadedImages = [];
        localStorage.removeItem("propertyDetails");
        localStorage.removeItem("propertyImages");
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

        this.$store.commit(
          "property/updateProperty",
          this.initialPropertyDetails
        );
        this.uploadedImages = [];
        localStorage.removeItem("propertyDetails");
        localStorage.removeItem("propertyImages");

        await Swal.fire("Done!", "Your property has been reset.", "success");
      } catch (error) {
        this.errorMessage = `Failed to reset property: ${error.message}`;
      }
    },
  },
};
</script>
