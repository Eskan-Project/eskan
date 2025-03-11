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

        <form v-else @submit.prevent="handleSubmit">
          <div class="space-y-12">
            <div class="border-b border-gray-900/10 pb-12">
              <h2 class="text-base/7 font-semibold text-gray-900">
                Edit Property
              </h2>
              <p class="mt-1 text-sm/6 text-gray-600">
                Update the property information below
              </p>
            </div>

            <!-- Property Details Form Fields -->
            <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <!-- Title -->
              <div class="sm:col-span-4">
                <label
                  for="title"
                  class="block text-sm/6 font-medium text-gray-900"
                  >Property Title</label
                >
                <div class="mt-2">
                  <input
                    v-model="propertyData.title"
                    type="text"
                    name="title"
                    id="title"
                    class="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline-1"
                  />
                </div>
              </div>

              <!-- Add all your other form fields here similar to AdminAddProperty.vue -->

              <!-- Submit Button -->
              <div class="col-span-full">
                <button
                  type="submit"
                  class="rounded-md bg-indigo-600 px-4 py-2 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </main>
</template>

<script>
import { mapActions } from "vuex";

export default {
  data() {
    return {
      loading: true,
      propertyId: this.$route.params.id,
      propertyData: {
        title: "",
        description: "",
        price: null,
        // Add all other property fields here
      },
    };
  },

  async created() {
    try {
      await this.fetchPropertyData();
    } catch (error) {
      console.error("Error loading property:", error);
    }
  },

  methods: {
    ...mapActions(["updateProperty"]),

    async fetchPropertyData() {
      try {
        const response = await fetch(
          `https://eskan-project-14c3b-default-rtdb.europe-west1.firebasedatabase.app/properties/${this.propertyId}.json`
        );

        if (!response.ok) throw new Error("Failed to fetch property data");

        const data = await response.json();
        this.propertyData = { ...data.data };
      } catch (error) {
        console.error("Error:", error);
      } finally {
        this.loading = false;
      }
    },

    async handleSubmit() {
      try {
        await this.updateProperty({
          propertyId: this.propertyId,
          updatedData: this.propertyData,
        });

        // Show success message and redirect
        this.$router.push(`/admin/properties/${this.propertyId}`);
      } catch (error) {
        console.error("Error updating property:", error);
      }
    },
  },
};
</script>
