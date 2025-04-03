<template>
  <main class="min-h-screen bg-gray-100 flex-1 p-4 md:p-8">
    <div class="md:flex block">
      <div class="flex-1 p-4 md:p-8">
        <!-- Loading State -->
        <div v-if="loading" class="text-center py-10">
          <div
            class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto"
          ></div>
          <p class="mt-4 text-gray-600">Loading property details...</p>
        </div>

        <form v-else @submit.prevent="handleSubmit" class="max-w-4xl mx-auto">
          <div class="space-y-8">
            <div class="border-b border-gray-900/10 pb-12">
              <h2 class="text-2xl font-semibold text-gray-900 mb-4">
                Edit Property
              </h2>

              <!-- Basic Information -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >Title</label
                  >
                  <input
                    v-model="propertyData.title"
                    type="text"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >Price</label
                  >
                  <input
                    v-model="propertyData.price"
                    type="number"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >Floor Location</label
                  >
                  <input
                    v-model="propertyData.floor"
                    type="number"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >Area (m²)</label
                  >
                  <input
                    v-model="propertyData.area"
                    type="number"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              <!-- Description -->
              <div class="mt-6">
                <label class="block text-sm font-medium text-gray-700"
                  >Description</label
                >
                <textarea
                  v-model="propertyData.description"
                  rows="4"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter property description..."
                ></textarea>
              </div>

              <!-- Room Details -->
              <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >Rooms</label
                  >
                  <input
                    v-model="propertyData.rooms"
                    type="number"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >Living Rooms</label
                  >
                  <input
                    v-model="propertyData.livingRooms"
                    type="number"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >Bathrooms</label
                  >
                  <input
                    v-model="propertyData.bathrooms"
                    type="number"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >Kitchens</label
                  >
                  <input
                    v-model="propertyData.kitchens"
                    type="number"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              <!-- Property Status and Furnishing -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >Property Status</label
                  >
                  <select
                    v-model="propertyData.propertyStatus"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="for-sale">For Sale</option>
                    <option value="for-rent">For Rent</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >Furnished</label
                  >
                  <select
                    v-model="propertyData.furnished"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option :value="true">Yes</option>
                    <option :value="false">No</option>
                  </select>
                </div>
              </div>

              <!-- Location Information -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >Governorate</label
                  >
                  <select
                    v-model="propertyData.governorate"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option
                      v-for="gov in governorates"
                      :key="gov.id"
                      :value="gov.id"
                    >
                      {{ gov.governorate_name_en }}
                    </option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >City</label
                  >
                  <select
                    v-model="propertyData.city"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option
                      v-for="city in filteredCities"
                      :key="city.id"
                      :value="city.id"
                    >
                      {{ city.city_name_en }}
                    </option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >Neighborhood</label
                  >
                  <input
                    v-model="propertyData.neighborhood"
                    type="text"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              <!-- Contact Information -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >Contact Name</label
                  >
                  <input
                    v-model="propertyData.propertyContact.name"
                    type="text"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >Contact Phone</label
                  >
                  <input
                    v-model="propertyData.propertyContact.phone"
                    type="tel"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >Contact Email</label
                  >
                  <input
                    v-model="propertyData.propertyContact.email"
                    type="email"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              <!-- Contract Document -->
              <div class="mt-6">
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >Contract Document Image</label
                >
                <div
                  class="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center"
                  :class="{ 'border-green-500': contractImage }"
                >
                  <div
                    v-if="!contractImage"
                    class="flex flex-col items-center gap-3 py-4"
                  >
                    <i
                      class="bi bi-file-earmark-text text-4xl text-gray-500"
                    ></i>
                    <p class="text-gray-500 text-sm text-center">
                      Upload contract document image
                    </p>
                    <label class="cursor-pointer">
                      <span
                        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
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
                <label class="block text-sm font-medium text-gray-700"
                  >Add New Images</label
                >
                <input
                  type="file"
                  multiple
                  @change="handleImageChange"
                  accept="image/*"
                  class="mt-1 block w-full"
                />

                <!-- Existing Images Preview -->
                <div
                  v-if="propertyData.images && propertyData.images.length"
                  class="grid grid-cols-4 gap-4 mt-4"
                >
                  <div
                    v-for="(img, index) in propertyData.images"
                    :key="index"
                    class="relative"
                  >
                    <img
                      :src="img"
                      class="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      @click="removeImage(index)"
                      class="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Submit Buttons -->
            <div class="flex justify-end space-x-4">
              <button
                type="button"
                @click="$router.go(-1)"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
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

        // Convert numeric strings to numbers
        const cleanedData = {
          ...this.propertyData,
          price: Number(this.propertyData.price),
          floor: Number(this.propertyData.floor),
          area: Number(this.propertyData.area),
          rooms: Number(this.propertyData.rooms),
          livingRooms: Number(this.propertyData.livingRooms),
          bathrooms: Number(this.propertyData.bathrooms),
          kitchens: Number(this.propertyData.kitchens),
        };

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
      this.newImages = files; // Store the actual files

      // Clear previous preview images
      this.uploadedNewImages = [];

      // Generate previews
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.uploadedNewImages.push(e.target.result);
        };
        reader.readAsDataURL(file);
      });
    },

    removeImage(index) {
      this.propertyData.images.splice(index, 1);
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
