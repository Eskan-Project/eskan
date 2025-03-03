<template>
  <div class="relative">
    <label
      class="absolute -top-3 left-3 bg-white px-2 text-sm text-gray-700 rounded-full z-10"
    >
      {{ label }} <span v-if="required" class="text-red-500">*</span>
    </label>

    <template v-if="type === 'textarea'">
      <textarea
        v-model="inputValue"
        class="text-black w-full p-3 border border-gray-400 rounded-md focus:outline-none focus:ring-blue-500 focus:ring-2 h-32 resize-none"
        :placeholder="placeholder"
        :required="required"
      ></textarea>
    </template>

    <template v-else-if="type === 'select'">
      <div class="relative">
        <select
          v-model="inputValue"
          class="text-black cursor-pointer w-full p-3 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
          :required="required"
        >
          <option value="">Select option</option>
          <option
            v-for="option in options"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
        <i
          class="bi bi-chevron-down absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"
        ></i>
      </div>
    </template>

    <input
      v-else
      :type="type"
      v-model="inputValue"
      class="text-black w-full p-3 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      :required="required"
    />
  </div>
</template>

<script>
export default {
  props: {
    label: String,
    type: {
      type: String,
      default: "text",
    },
    required: Boolean,
    modelValue: String,
    options: {
      type: Array,
    },
  },
  computed: {
    inputValue: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit("update:modelValue", value);
      },
    },
  },
};
</script>
