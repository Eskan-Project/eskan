<template>
  <div class="p-6 bg-white shadow-sm rounded-lg">
    <h2 class="text-xl font-semibold mb-10 text-gray-700 text-center">
      General Information
    </h2>

    <form
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-6"
    >
      <div class="md:col-span-2 lg:col-span-3">
        <InputField
          v-model="propertyDetails.title"
          label="Title"
          required
          class="w-full md:w-[50%]"
        />
      </div>
      <div class="md:col-span-2 lg:col-span-3">
        <InputField
          v-model="propertyDetails.description"
          label="Description"
          required
          type="textarea"
        />
      </div>
      <InputField
        v-model="propertyDetails.rooms"
        label="Number of Rooms"
        type="number"
        required
      />
      <InputField
        v-model="propertyDetails.livingRooms"
        label="Number of Living Rooms"
        type="number"
        required
      />
      <InputField
        v-model="propertyDetails.bathrooms"
        label="Number of Bathrooms"
        type="select"
        required
        :options="[
          { value: '1', label: '1' },
          { value: '2', label: '2' },
          { value: '3+', label: '3+' },
        ]"
      />
      <InputField v-model="propertyDetails.price" label="Price" required />
      <InputField
        v-model="propertyDetails.kitchens"
        label="Number of Kitchens"
        type="number"
        required
      />
      <InputField v-model="propertyDetails.area" label="Area (M²)" required />
      <InputField
        v-model="propertyDetails.floor"
        label="Floor Location"
        required
      />
      <InputField
        v-model="propertyDetails.furnished"
        label="Furnished"
        type="select"
        required
        :options="[
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
        ]"
      />
      <InputField
        v-model="propertyDetails.status"
        label="Status"
        type="select"
        required
        :options="[
          { value: 'new', label: 'New' },
          { value: 'second-hand', label: 'Second Hand' },
          { value: 'renovated', label: 'Renovated' },
        ]"
      />
    </form>
  </div>
</template>

<script>
import InputField from "@/components/InputField.vue";
import { mapState } from "vuex";

export default {
  components: {
    InputField,
  },
  computed: {
    ...mapState("property", ["propertyDetails"]),
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
    }
  },
};
</script>
