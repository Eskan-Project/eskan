<script>
import { ref, onMounted, onBeforeUnmount } from "vue";

export default {
  name: "Turnstile",
  emits: ["turnstileVerified", "turnstileExpired", "turnstileError"],
  setup(props, { emit }) {
    const siteKey = ref(import.meta.env.VITE_TURNSTILE_SITE_KEY);
    const widgetId = ref(null);
    const turnstileContainer = ref(null);
    const isLoading = ref(true);

    const loadTurnstile = () => {
      // Check if script is already loaded
      if (window.turnstile) {
        isLoading.value = false;
        renderWidget();
        return;
      }

      const script = document.createElement("script");
      script.src =
        "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;

      script.onload = () => {
        isLoading.value = false;
        renderWidget();
      };

      script.onerror = () => {
        isLoading.value = false;
        emit("turnstileError", "Failed to load Turnstile script");
      };

      document.head.appendChild(script);
    };

    const renderWidget = () => {
      if (!window.turnstile || !turnstileContainer.value) return;

      // Reset if widget already exists
      if (widgetId.value) {
        window.turnstile.reset(widgetId.value);
      }

      widgetId.value = window.turnstile.render(turnstileContainer.value, {
        sitekey: siteKey.value,
        callback: (token) => {
          emit("turnstileVerified", token);
        },
        "expired-callback": () => {
          emit("turnstileExpired");
        },
        "error-callback": (error) => {
          emit("turnstileError", error);
        },
        theme: "light",
        size: "normal",
      });
    };

    const reset = () => {
      if (window.turnstile && widgetId.value) {
        window.turnstile.reset(widgetId.value);
      }
    };

    onMounted(() => {
      loadTurnstile();
    });

    onBeforeUnmount(() => {
      if (window.turnstile && widgetId.value) {
        window.turnstile.remove(widgetId.value);
      }
    });

    return {
      turnstileContainer,
      reset,
    };
  },
};
</script>

<template>
  <div>
    <p v-if="isLoading">{{ $t("createProperty.buttons.loading") }}</p>
    <div ref="turnstileContainer" class="cf-turnstile-container"></div>
  </div>
</template>

<style scoped>
.cf-turnstile-container {
  display: inline-block;
  min-width: 300px;
  min-height: 65px;
}
</style>
