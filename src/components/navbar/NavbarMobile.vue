<template>
  <div class="inset-0 fixed" @click="closeMenu"></div>
  <ul
    class="md:hidden flex flex-col bg-white p-3 absolute top-full right-0 shadow-lg w-[200px] h-[30vh] text-lg items-center"
  >
    <li v-for="(item, index) in navLinks" :key="index">
      <router-link
        class="block py-4 px-4 text-[var(--secondary-color)] hover:bg-gray-100"
        :to="item.path"
        @click="closeMenu"
      >
        {{ item.label }}
      </router-link>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    navLinks: Array,
  },
  methods: {
    closeMenu() {
      this.$emit("closeMenu");
    },
  },
};
</script>
