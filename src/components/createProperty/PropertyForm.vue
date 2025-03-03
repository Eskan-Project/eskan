<template>
  <div class="w-[60vw] mx-auto p-6 bg-white shadow-md rounded-lg">
    <h2 class="text-xl font-semibold mb-4">General Information</h2>

    <form class="grid grid-cols-1 md:grid-cols-3 gap-10">
      <div class="md:cols-span-3">
        <InputField
          v-model="formData.title"
          label="Title"
          required
          class="w-90"
        />
      </div>
      <div class="md:col-span-3">
        <InputField
          v-model="formData.description"
          label="Description"
          required
          type="textarea"
        />
      </div>
      <InputField
        v-model="formData.rooms"
        label="Number of Room"
        type="number"
        required
      />
      <InputField
        v-model="formData.livingRooms"
        label="Number of Living Room"
        type="number"
        required
      />
      <InputField
        v-model="formData.bathrooms"
        label="Number of Bathroom"
        type="select"
        required
        :options="[
          { value: '1', label: '1' },
          { value: '2', label: '2' },
          { value: '3+', label: '3+' },
        ]"
      />
      <InputField v-model="formData.price" label="Price" required />
      <InputField
        v-model="formData.kitchens"
        label="Number of Kitchen"
        type="number"
        required
      />
      <InputField v-model="formData.area" label="Area M²" required />
      <InputField v-model="formData.floor" label="Floor Location" required />
      <InputField
        v-model="formData.furnished"
        label="Furnished"
        type="select"
        required
        :options="[
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
        ]"
      />
      <InputField
        v-model="formData.status"
        label="Status"
        type="select"
        required
        :options="[
          { value: 'zero', label: 'Zero' },
          { value: 'second-hand', label: 'Second hand' },
        ]"
      />
    </form>
  </div>
</template>

<script>
import InputField from "@/components/InputField.vue";

export default {
  components: {
    InputField,
  },
  data() {
    return {
      formData: {
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
        status: "",
      },
    };
  },
};
</script>
