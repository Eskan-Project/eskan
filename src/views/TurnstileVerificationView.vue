<script>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import TurnstileVerification from "@/components/TurnstileVerification.vue";
import { useStore } from "vuex";

export default {
  name: "TurnstileVerificationView",
  components: {
    TurnstileVerification,
  },
  setup() {
    const router = useRouter();
    const store = useStore();
    onMounted(() => {
      store.dispatch("stopLoading");
      if (sessionStorage.getItem("turnstileVerified")) {
        const redirectPath =
          sessionStorage.getItem("turnstileRedirectPath") || "/";
        sessionStorage.removeItem("turnstileRedirectPath");
        router.replace(redirectPath);
      }
    });

    const handleVerified = () => {
      const redirectPath =
        sessionStorage.getItem("turnstileRedirectPath") || "/";
      sessionStorage.removeItem("turnstileRedirectPath");
      router.replace(redirectPath);
    };

    return {
      handleVerified,
    };
  },
};
</script>

<template>
  <TurnstileVerification @verified="handleVerified" />
</template>
