<template>
  <div class="p-4 sm:p-6 bg-white shadow-sm rounded-lg">
    <h2
      class="text-lg sm:text-xl font-semibold mb-6 sm:mb-10 text-gray-700 text-center"
    >
      {{ $t("createProperty.form.generalInfo") }}
    </h2>

    <form class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      <!-- Title -->
      <div class="sm:col-span-2 lg:col-span-3">
        <InputField
          v-model="propertyDetails.title"
          :label="$t('createProperty.form.title')"
          required
          class="w-full"
        />
      </div>

      <!-- Description -->
      <div class="sm:col-span-2 lg:col-span-3">
        <InputField
          v-model="propertyDetails.description"
          :label="$t('createProperty.form.description')"
          required
          type="textarea"
          class="w-full"
        />
      </div>

      <!-- Single-column fields -->
      <InputField
        v-model="propertyDetails.rooms"
        :label="$t('createProperty.form.rooms')"
        type="number"
        required
        class="w-full"
      />
      <InputField
        v-model="propertyDetails.livingRooms"
        :label="$t('createProperty.form.livingRooms')"
        type="number"
        required
        class="w-full"
      />
      <InputField
        v-model="propertyDetails.bathrooms"
        :label="$t('createProperty.form.bathrooms')"
        type="select"
        required
        :options="[
          { value: '1', label: '1' },
          { value: '2', label: '2' },
          { value: '3+', label: '3+' },
        ]"
        class="w-full"
      />
      <InputField
        v-model="propertyDetails.price"
        :label="$t('createProperty.form.price')"
        required
        class="w-full"
      />
      <InputField
        v-model="propertyDetails.kitchens"
        :label="$t('createProperty.form.kitchens')"
        type="number"
        required
        class="w-full"
      />
      <InputField
        v-model="propertyDetails.area"
        :label="$t('createProperty.form.area')"
        required
        class="w-full"
      />
      <InputField
        v-model="propertyDetails.floor"
        :label="$t('createProperty.form.floor')"
        required
        class="w-full"
      />
      <InputField
        v-model="propertyDetails.furnished"
        :label="$t('createProperty.form.furnished')"
        type="select"
        required
        :options="[
          { value: 'yes', label: $t('createProperty.form.yes') },
          { value: 'no', label: $t('createProperty.form.no') },
        ]"
        class="w-full"
      />
      <InputField
        v-model="propertyDetails.propertyStatus"
        :label="$t('createProperty.form.propertyStatus')"
        type="select"
        required
        :options="[
          { value: 'new', label: $t('createProperty.form.new') },
          {
            value: 'second-hand',
            label: $t('createProperty.form.second-hand'),
          },
          { value: 'renovated', label: $t('createProperty.form.renovated') },
        ]"
        class="w-full"
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

<style scoped>
/* Ensure form elements are touch-friendly on mobile */
input,
select,
textarea {
  min-height: 44px; /* Minimum touch target size */
}

/* Adjust grid spacing and alignment */
.grid {
  row-gap: 1rem; /* Consistent spacing between rows */
}

/* Responsive tweaks for smaller screens */
@media (max-width: 640px) {
  .grid {
    gap: 1rem; /* Smaller gap on mobile */
  }
}

@media (min-width: 640px) and (max-width: 1024px) {
  .grid {
    gap: 1.5rem; /* Slightly larger gap for tablets */
  }
}

/* Ensure full-width fields on mobile */
.w-full {
  width: 100%;
}
</style>
