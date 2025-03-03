<template>
  <div
    class="flex flex-col gap-8 md:w-[80vw] w-[90vw] mx-auto my-6 md:my-10 max-w-screen-lg min-h-[56vh]"
  >
    <div class="p-6 bg-white shadow-sm rounded-lg">
      <h2 class="text-xl font-semibold mb-10 text-gray-700 text-center">
        Contact Information
      </h2>

      <form
        class="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-6 items-center justify-center"
      >
        <InputField
          v-model="formData.title"
          label="Name"
          required
          class="w-full md:w-[70%] mx-auto"
        />

        <InputField
          v-model="formData.title"
          label="Email"
          required
          class="w-full md:w-[70%]"
        />

        <InputField
          v-model="formData.title"
          label="Phone Number 1"
          required
          class="w-full md:w-[70%] mx-auto"
        />
        <InputField
          v-model="formData.title"
          label="Phone Number 2"
          class="w-full md:w-[70%]"
        />
      </form>
    </div>
    <button
      class="w-fit mx-auto border border-[var(--secondary-color)] bg-[var(--secondary-color)] text-white px-6 py-2 rounded-md cursor-pointer hover:bg-white hover:text-[var(--secondary-color)] transition"
    >
      Submit
    </button>
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
        name: "",
        email: "",
        phoneNumber1: "",
        phoneNumber2: "",
      },
    };
  },
};
</script>
