<template>
  <div class="flex justify-center mt-10 text-gray-500">
    <button
      class="px-3 py-2 border rounded-md mx-1 disabled:opacity-50"
      @click="$emit('prev')"
      :disabled="currentPage === 1"
    >
      Previous
    </button>
    <button
      v-for="page in visiblePages"
      :key="page"
      class="px-3 py-2 border rounded-md mx-1"
      :class="{ 'bg-gray-300': page === currentPage }"
      @click="$emit('go-to', page)"
    >
      {{ page }}
    </button>
    <button
      class="px-3 py-2 border rounded-md mx-1 disabled:opacity-50"
      @click="$emit('next')"
      :disabled="currentPage === totalPages"
    >
      Next
    </button>
  </div>
</template>

<script>
export default {
  name: "Pagination",
  props: {
    currentPage: Number,
    totalPages: Number,
    visiblePages: Array,
  },
};
</script>
