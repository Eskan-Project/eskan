<template>
  <div class="flex justify-center mt-10 text-gray-500">
    <button
      :class="`px-3 py-2 border rounded-md mx-1 disabled:opacity-50  ${
        currentPage === 1
          ? 'cursor-not-allowed bg-gray-300'
          : 'cursor-pointer hover:bg-gray-200'
      }`"
      @click="$emit('prev')"
      :disabled="currentPage === 1"
    >
      {{ $t("pagination.previous") }}
    </button>
    <button
      v-for="page in visiblePages"
      :key="page"
      :class="[
        'px-3 py-2 border rounded-md mx-1 cursor-pointer hover:bg-gray-200',
        { 'bg-gray-300': page === currentPage },
      ]"
      @click="$emit('go-to', page)"
      :aria-label="`${$t('pagination.page')} ${page}`"
      :aria-current="page === currentPage ? 'page' : null"
    >
      {{ page }}
    </button>
    <button
      :class="`px-3 py-2 border rounded-md mx-1 disabled:opacity-50  ${
        currentPage === totalPages
          ? 'cursor-not-allowed bg-gray-300'
          : 'cursor-pointer hover:bg-gray-200'
      }`"
      @click="$emit('next')"
      :disabled="currentPage === totalPages"
    >
      {{ $t("pagination.next") }}
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
  emits: ["prev", "next", "go-to"],
};
</script>
