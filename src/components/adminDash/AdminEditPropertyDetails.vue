<template>
  <main class="min-h-screen bg-gray-100 dark:bg-gray-900 flex-1 p-4 md:p-8">
    <div class="md:flex block">
      <div class="flex-1 p-4 md:p-8">
        <!-- Loading State -->
        <div v-if="loading" class="text-center py-10">
          <div
            class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto"
          ></div>
          <p class="mt-4 text-gray-600 dark:text-gray-400">
            Loading property details...
          </p>
        </div>

        <form v-else @submit.prevent="handleSubmit" class="max-w-4xl mx-auto">
          <div class="space-y-8">
            <div class="border-b border-gray-900/10 dark:border-gray-700 pb-12">
              <h2
                class="text-2xl font-semibold text-gray-900 dark:text-white mb-4"
              >
                Edit Property
              </h2>

              <!-- Basic Information -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >Title</label
                  >
                  <input
                    v-model="propertyData.title"
                    type="text"
                    class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900 dark:text-white dark:bg-gray-700"
                    :class="{ 'border-red-500': formErrors.title }"
                  />
                  <p v-if="formErrors.title" class="mt-1 text-sm text-red-500">
                    {{ formErrors.title }}
                  </p>
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >Price</label
                  >
                  <input
                    v-model.number="propertyData.price"
                    type="number"
                    min="0"
                    class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:text-white dark:bg-gray-700"
                    :class="{ 'border-red-500': formErrors.price }"
                  />
                  <p v-if="formErrors.price" class="mt-1 text-sm text-red-500">
                    {{ formErrors.price }}
                  </p>
                </div>

                <!-- Similar changes for other input fields -->
                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >Floor Location</label
                  >
                  <input
                    v-model.number="propertyData.floor"
                    type="number"
                    class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:text-white dark:bg-gray-700"
                  />
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >Area (m²)</label
                  >
                  <input
                    v-model.number="propertyData.area"
                    type="number"
                    min="0"
                    class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:text-white dark:bg-gray-700"
                    :class="{ 'border-red-500': formErrors.area }"
                  />
                  <p v-if="formErrors.area" class="mt-1 text-sm text-red-500">
                    {{ formErrors.area }}
                  </p>
                </div>
              </div>

              <!-- Description -->
              <div class="mt-6">
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >Description</label
                >
                <textarea
                  v-model="propertyData.description"
                  rows="4"
                  class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:text-white dark:bg-gray-700"
                  placeholder="Enter property description..."
                ></textarea>
              </div>

              <!-- Room Details -->
              <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >Rooms</label
                  >
                  <input
                    v-model.number="propertyData.rooms"
                    type="number"
                    min="0"
                    class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:text-white dark:bg-gray-700"
                  />
                </div>

                <!-- Similar changes for other room detail fields -->
                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >Living Rooms</label
                  >
                  <input
                    v-model.number="propertyData.livingRooms"
                    type="number"
                    min="0"
                    class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:text-white dark:bg-gray-700"
                  />
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >Bathrooms</label
                  >
                  <input
                    v-model.number="propertyData.bathrooms"
                    type="number"
                    min="0"
                    class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:text-white dark:bg-gray-700"
                  />
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >Kitchens</label
                  >
                  <input
                    v-model.number="propertyData.kitchens"
                    type="number"
                    min="0"
                    class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:text-white dark:bg-gray-700"
                  />
                </div>
              </div>

              <!-- Property Status and Furnishing -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >Property Status</label
                  >
                  <select
                    v-model="propertyData.propertyStatus"
                    class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:text-white dark:bg-gray-700"
                    :class="{ 'border-red-500': formErrors.propertyStatus }"
                  >
                    <option value="new">New</option>
                    <option value="second-hand">Second Hand</option>
                    <option value="renovated">Renovated</option>
                  </select>
                  <p
                    v-if="formErrors.propertyStatus"
                    class="mt-1 text-sm text-red-500"
                  >
                    {{ formErrors.propertyStatus }}
                  </p>
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >Furnished</label
                  >
                  <select
                    v-model="propertyData.furnished"
                    class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:text-white dark:bg-gray-700"
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
              </div>

              <!-- Location Information -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >Governorate</label
                  >
                  <select
                    v-model="propertyData.governorate"
                    class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:text-white dark:bg-gray-700"
                    :class="{ 'border-red-500': formErrors.governorate }"
                  >
                    <option
                      v-for="gov in governorates"
                      :key="gov.id"
                      :value="gov.id"
                    >
                      {{ gov.governorate_name_en }}
                    </option>
                  </select>
                  <p
                    v-if="formErrors.governorate"
                    class="mt-1 text-sm text-red-500"
                  >
                    {{ formErrors.governorate }}
                  </p>
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >City</label
                  >
                  <select
                    v-model="propertyData.city"
                    class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:text-white dark:bg-gray-700"
                    :class="{ 'border-red-500': formErrors.city }"
                  >
                    <option
                      v-for="city in filteredCities"
                      :key="city.id"
                      :value="city.id"
                    >
                      {{ city.city_name_en }}
                    </option>
                  </select>
                  <p v-if="formErrors.city" class="mt-1 text-sm text-red-500">
                    {{ formErrors.city }}
                  </p>
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >Neighborhood</label
                  >
                  <input
                    v-model="propertyData.neighborhood"
                    type="text"
                    class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:text-white dark:bg-gray-700"
                  />
                </div>
              </div>

              <!-- Contact Information -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >Contact Name</label
                  >
                  <input
                    v-model="propertyData.propertyContact.name"
                    type="text"
                    class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:text-white dark:bg-gray-700"
                    :class="{ 'border-red-500': formErrors.contact_name }"
                  />
                  <p
                    v-if="formErrors.contact_name"
                    class="mt-1 text-sm text-red-500"
                  >
                    {{ formErrors.contact_name }}
                  </p>
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >Contact Phone</label
                  >
                  <input
                    v-model="propertyData.propertyContact.phone"
                    type="tel"
                    class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:text-white dark:bg-gray-700"
                    :class="{ 'border-red-500': formErrors.contact_phone }"
                  />
                  <p
                    v-if="formErrors.contact_phone"
                    class="mt-1 text-sm text-red-500"
                  >
                    {{ formErrors.contact_phone }}
                  </p>
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >Contact Email</label
                  >
                  <input
                    v-model="propertyData.propertyContact.email"
                    type="email"
                    class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:text-white dark:bg-gray-700"
                    :class="{ 'border-red-500': formErrors.contact_email }"
                  />
                  <p
                    v-if="formErrors.contact_email"
                    class="mt-1 text-sm text-red-500"
                  >
                    {{ formErrors.contact_email }}
                  </p>
                </div>
              </div>

              <!-- Contract Document -->
              <div class="mt-6">
                <label
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >Contract Document Image</label
                >
                <div
                  class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 flex flex-col items-center justify-center"
                  :class="{ 'border-green-500': contractImage }"
                >
                  <div
                    v-if="!contractImage"
                    class="flex flex-col items-center gap-3 py-4"
                  >
                    <i
                      class="bi bi-file-earmark-text text-4xl text-gray-500 dark:text-gray-400"
                    ></i>
                    <p
                      class="text-gray-500 dark:text-gray-400 text-sm text-center"
                    >
                      Upload contract document image
                    </p>
                    <label class="cursor-pointer">
                      <span
                        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-800 transition"
                      >
                        Upload Contract
                      </span>
                      <input
                        type="file"
                        class="hidden"
                        @change="handleContractUpload"
                        accept="image/png, image/jpeg, image/jpg, image/webp"
                      />
                    </label>
                  </div>
                  <div v-else class="relative w-full max-w-md py-4">
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
                <p v-if="contractError" class="text-red-500 text-sm mt-1">
                  {{ contractError }}
                </p>
              </div>

              <!-- Images -->
              <div class="mt-6">
                <div class="flex items-center gap-2">
                  <label
                    class="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Add New Images
                  </label>
                  <label for="imageUpload" class="cursor-pointer">
                    <i
                      class="bi bi-plus-circle-fill text-2xl text-blue-600"
                    ></i>
                  </label>
                  <input
                    id="imageUpload"
                    type="file"
                    multiple
                    @change="handleImageChange"
                    accept="image/*"
                    class="hidden"
                  />
                </div>
                <!-- Existing Images Preview -->
                <div
                  v-if="propertyData.images && propertyData.images.length"
                  class="mt-4"
                >
                  <p
                    class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Existing Images:
                  </p>
                  <div class="grid grid-cols-4 gap-4">
                    <div
                      v-for="(img, index) in propertyData.images"
                      :key="`existing-${index}`"
                      class="relative"
                    >
                      <img
                        :src="img"
                        class="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        @click="removeImage(index)"
                        class="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs"
                        type="button"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Submit Buttons -->
            <div class="flex justify-end space-x-4">
              <button
                type="button"
                @click="$router.go(-1)"
                class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </main>
</template>

<script>
import { mapActions, mapState } from "vuex";
import governorates from "@/assets/data/governorates.json";
import cities from "@/assets/data/cities.json";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      loading: true,
      propertyId: this.$route.params.id,
      contractImage: null,
      contractError: null,
      formErrors: {},
      propertyData: {
        title: "",
        description: "",
        price: null,
        floor: null,
        area: null,
        rooms: null,
        livingRooms: null,
        bathrooms: null,
        kitchens: null,
        propertyStatus: "",
        furnished: false,
        governorate: "",
        city: "",
        neighborhood: "",
        propertyContact: {
          name: "",
          phone: "",
          email: "",
          contract: "",
        },
        images: [],
      },
      governorates,
      cities,
      newImages: [],
      uploadedNewImages: [],
    };
  },

  computed: {
    ...mapState("property", ["property"]),
    filteredCities() {
      return this.cities.filter(
        (city) => city.governorate_id == this.propertyData.governorate
      );
    },
  },

  async created() {
    try {
      await this.getProperty(this.propertyId);
      this.propertyData = { ...this.property };

      // Set contract image if available
      if (this.propertyData.propertyContact?.contract) {
        this.contractImage = this.propertyData.propertyContact.contract;
      }

      this.loading = false;
    } catch (error) {
      console.error("Error loading property:", error);
    }
  },

  methods: {
    ...mapActions("property", ["getProperty", "updateProperty"]),

    async handleSubmit() {
      try {
        // Reset form errors
        this.formErrors = {};

        // Validate required fields
        const requiredFields = [
          "title",
          "price",
          "area",
          "propertyStatus",
          "governorate",
          "city",
        ];
        let hasErrors = false;

        requiredFields.forEach((field) => {
          if (!this.propertyData[field]) {
            this.formErrors[field] = `${
              field.charAt(0).toUpperCase() + field.slice(1)
            } is required`;
            hasErrors = true;
          }
        });

        // Validate contact information
        const contactFields = ["name", "phone"];
        contactFields.forEach((field) => {
          if (!this.propertyData.propertyContact[field]) {
            this.formErrors[
              `contact_${field}`
            ] = `Contact ${field} is required`;
            hasErrors = true;
          }
        });

        // Validate email format if provided
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (
          this.propertyData.propertyContact.email &&
          !emailRegex.test(this.propertyData.propertyContact.email)
        ) {
          this.formErrors.contact_email = "Please enter a valid email address";
          hasErrors = true;
        }

        if (hasErrors) {
          Swal.fire(
            "Validation Error",
            "Please fix the errors in the form",
            "error"
          );
          return;
        }

        const result = await Swal.fire({
          title: "Are you sure?",
          text: "Your edits will be saved",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, Save it!",
        });

        if (!result.isConfirmed) return;

        this.loading = true;

        // Using v-model.number so manual conversion is not needed
        const cleanedData = { ...this.propertyData };

        await this.updateProperty({
          propertyId: this.propertyId,
          updatedData: cleanedData,
          files: this.newImages,
        });

        await Swal.fire(
          "Saved!",
          "Property has been updated successfully.",
          "success"
        );

        this.$router.push(`/admin/properties/${this.propertyId}`);
      } catch (error) {
        console.error("Error updating property:", error);
        Swal.fire(
          "Error!",
          "Failed to update property. Please try again.",
          "error"
        );
      } finally {
        this.loading = false;
      }
    },

    async handleImageChange(event) {
      const files = Array.from(event.target.files);

      // Generate previews
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.propertyData.images.push(e.target.result);
        };
        reader.readAsDataURL(file);
      });
    },

    removeImage(index) {
      this.propertyData.images.splice(index, 1);
    },

    removeNewImage(index) {
      this.uploadedNewImages.splice(index, 1);
      this.newImages.splice(index, 1);
    },

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
        this.contractError = "Contract file size should not exceed 5MB";
        return;
      }

      // Read and display the image
      const reader = new FileReader();
      reader.onload = (e) => {
        this.contractImage = e.target.result;
        if (!this.propertyData.propertyContact) {
          this.propertyData.propertyContact = {};
        }
        this.propertyData.propertyContact.contract = e.target.result;
      };
      reader.readAsDataURL(file);
    },

    removeContractImage() {
      this.contractImage = null;
      if (this.propertyData.propertyContact) {
        this.propertyData.propertyContact.contract = "";
      }
    },
  },
};
</script>

<style>
input,
textarea,
select {
  padding: 0.5rem 0.75rem;
  color: #111827;
}
</style>
