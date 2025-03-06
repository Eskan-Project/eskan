<template>
  <LoadingSpinner v-if="loading" />
  <router-view />
</template>

<script>
import { mapState } from "vuex";
import LoadingSpinner from "@/components/LoadingSpinner.vue";

export default {
  components: { LoadingSpinner },
  computed: {
    ...mapState(["loading"]),
  },
};
</script>
