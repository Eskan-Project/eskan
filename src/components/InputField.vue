<template>
  <div class="relative">
    <label
      :class="`absolute -top-3 start-3 bg-white dark:bg-[#1F2937] px-2 text-sm text-gray-700 dark:text-white rounded-full z-10`"
    >
      {{ label }} <span v-if="required" class="text-red-500">*</span>
    </label>
    <template v-if="type === 'textarea'">
      <textarea
        v-model="inputValue"
        :class="[
          'text-gray-700 dark:text-white w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none h-32 resize-none dark:bg-[#1F2937]',
          errorMessage
            ? 'border-red-500 focus:outline-none'
            : 'focus:ring-2 focus:ring-blue-500 dark:focus:ring-[#3D8BFF]',
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
          class="text-gray-700 dark:text-white cursor-pointer w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-[#3D8BFF] appearance-none text-start dark:bg-[#1F2937]"
          :required="required"
          @blur="validateInput"
        >
          <option
            value=""
            disabled
            selected
            class="text-start dark:bg-[#1F2937] dark:text-white"
          >
            {{ $t("createProperty.form.select") }}
          </option>
          <option
            v-for="option in options"
            :key="option.value"
            :value="option.value"
            class="text-start dark:bg-[#1F2937] dark:text-white"
          >
            {{ option.label }}
          </option>
        </select>
        <i
          class="bi bi-chevron-down absolute end-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 pointer-events-none"
        ></i>
      </div>
    </template>
    <template v-else-if="type === 'checkbox'">
      <div
        v-for="option in options"
        :key="option"
        class="flex items-center gap-2 ms-40 my-5"
      >
        <input
          type="checkbox"
          :value="option"
          :id="option"
          v-model="inputValue"
          class="mr-2 dark:bg-[#1F2937] dark:border-gray-600"
        />
        <label :for="option" class="text-gray-700 dark:text-white">{{
          option
        }}</label>
      </div>
    </template>

    <input
      v-else
      :type="type"
      :disabled="disabled"
      v-model="inputValue"
      :class="[
        'text-gray-700 dark:text-white w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md outline-none dark:bg-[#1F2937]',
        errorMessage
          ? 'border-red-500 focus:outline-none'
          : 'focus:ring-2 focus:ring-blue-500 dark:focus:ring-[#3D8BFF]',
      ]"
      :required="required"
      :placeholder="placeholder"
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
        this.errorMessage = `${this.$t("createProperty.form.required")}`;
      } else {
        this.errorMessage = "";
      }
    },
  },
};
</script>

<style scoped>
/* Dark mode placeholder styles */
.dark input::placeholder,
.dark textarea::placeholder {
  color: #9ca3af !important;
}

/* Ensure text is white in dark mode */
.dark input,
.dark textarea,
.dark select,
.dark option {
  color: white !important;
}

/* Fix for select dropdown in dark mode */
.dark select option {
  background-color: #1f2937;
}
</style>
