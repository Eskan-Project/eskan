<template>
  <div class="relative">
    <label
      :class="`absolute -top-3 left-3 bg-white px-2 text-sm text-gray-700 rounded-full z-10`"
    >
      {{ label }} <span v-if="required" class="text-red-500">*</span>
    </label>
    <template v-if="type === 'textarea'">
      <textarea
        v-model="inputValue"
        :class="[
          'text-gray-700 w-full p-3 border border-gray-300 rounded-md focus:outline-none h-32 resize-none',
          errorMessage
            ? 'border-red-500 focus:outline-none'
            : 'focus:ring-2 focus:ring-blue-500',
        ]"
        :placeholder="placeholder"
        :required="required"
        @blur="validateInput"
      ></textarea>
    </template>
    <template v-else-if="type === 'select'">
      <div class="relative">
        <select
          v-model="inputValue"
          class="text-gray-700 cursor-pointer w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
          :required="required"
          @blur="validateInput"
        >
          <option value="" disabled selected>Select option</option>
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
    <template v-else-if="type === 'checkbox'">
      <div
        v-for="option in options"
        :key="option"
        class="flex items-center gap-2 ml-40 my-5"
      >
        <input
          type="checkbox"
          :value="option"
          :id="option"
          v-model="inputValue"
          class="mr-2"
        />
        <label :for="option" class="text-gray-700">{{ option }}</label>
      </div>
    </template>

    <input
      v-else
      :type="type"
      :disabled="disabled"
      v-model="inputValue"
      :class="[
        'text-gray-700 w-full p-3 border border-gray-300 rounded-md outline-none ',
        errorMessage
          ? 'border-red-500 focus:outline-none'
          : 'focus:ring-2 focus:ring-blue-500',
      ]"
      :required="required"
      @blur="validateInput"
    />

    <p v-if="errorMessage" class="text-red-500 text-sm mt-1">
      {{ errorMessage }}
    </p>
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
    disabled: Boolean,
    modelValue: [String, Number, Array],
    options: {
      type: Array,
    },
    placeholder: String,
  },
  data() {
    return {
      errorMessage: "",
    };
  },
  computed: {
    inputValue: {
      get() {
        return this.type === "checkbox" && !Array.isArray(this.modelValue)
          ? []
          : this.modelValue;
      },
      set(value) {
        this.$emit("update:modelValue", value);
        if (this.errorMessage && String(value).trim()) {
          this.errorMessage = "";
        }
      },
    },
  },
  methods: {
    validateInput() {
      if (this.required && !String(this.inputValue).trim()) {
        this.errorMessage = `${this.label} is required`;
      } else {
        this.errorMessage = "";
      }
    },
  },
};
</script>
