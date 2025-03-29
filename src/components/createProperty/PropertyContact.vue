<template>
  <div
    class="flex flex-col gap-8 md:w-[80vw] w-[90vw] mx-auto my-6 md:my-10 max-w-screen-lg min-h-[56vh]"
  >
    <div class="px-3 py-6 bg-white shadow-sm rounded-lg">
      <h2 class="text-xl font-semibold mb-10 text-gray-700 text-center">
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
    </div>
    <CreateBtn :title="$t('createProperty.buttons.submit')" name="completed" />
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
  computed: {
    ...mapState("property", ["propertyDetails"]),
    ...mapState("auth", ["userDetails"]),
  },
  mounted() {
    this.propertyDetails.propertyContact.image = this.userDetails.photo;
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
