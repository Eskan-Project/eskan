<script>
import { ref } from "vue";
import Turnstile from "@/components/Turnstile.vue";

export default {
  name: "TurnstileVerification",
  components: {
    Turnstile,
  },
  emits: ["verified"],
  setup(props, { emit }) {
    const isVerifying = ref(false);
    const error = ref(null);
    const turnstileToken = ref(null);

    const handleTurnstileVerified = async (token) => {
      turnstileToken.value = token;
      error.value = null;
      await verifyHuman();
    };

    const handleTurnstileExpired = () => {
      turnstileToken.value = null;
      error.value =
        "Security check expired. Please refresh the page and try again.";
    };

    const handleTurnstileError = () => {
      turnstileToken.value = null;
      error.value =
        "Security check failed. Please refresh the page and try again.";
    };

    const verifyHuman = async () => {
      if (!turnstileToken.value) {
        error.value = "Please complete the security check first";
        return;
      }

      isVerifying.value = true;
      error.value = null;

      try {
        sessionStorage.setItem("turnstileVerified", "true");
        sessionStorage.setItem("verifiedAt", Date.now().toString());
        setTimeout(() => {
          emit("verified");
        }, 1000);
      } catch (err) {
        console.error("Turnstile verification failed:", err);
        error.value =
          err.response?.data?.error || "Please start -> node server.js";
      } finally {
        setTimeout(() => {
          isVerifying.value = false;
        }, 500);
      }
    };

    return {
      isVerifying,
      error,
      handleTurnstileVerified,
      handleTurnstileExpired,
      handleTurnstileError,
    };
  },
};
</script>

<template>
  <div class="turnstile-verification-page">
    <div class="verification-container">
      <div class="logo-container">
        <img
          src="@/assets/images/logo-black.png"
          alt="Eskan Logo"
          class="logo"
        />
      </div>

      <h1 class="title">Security Check</h1>
      <p class="description">Verifying that you're human to access Eskan</p>

      <div class="turnstile-container">
        <Turnstile
          @turnstileVerified="handleTurnstileVerified"
          @turnstileExpired="handleTurnstileExpired"
          @turnstileError="handleTurnstileError"
        />
      </div>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <div class="footer">
        <p class="protection-info">
          Protected by <span class="cloudflare">Cloudflare Turnstile</span>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.turnstile-verification-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f7;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    sans-serif;
}

.verification-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 2.5rem;
  width: 100%;
  max-width: 480px;
  text-align: center;
  border-top: 4px solid #364365;
}

.logo-container {
  margin-bottom: 1.5rem;
}

.logo {
  height: 3.5rem;
}

.title {
  color: #364365;
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.description {
  color: #667085;
  font-size: 1rem;
  margin-bottom: 2rem;
}

.turnstile-container {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.verifying-text {
  color: #4e5d78;
  font-size: 0.875rem;
}

.error-message {
  background-color: #fee2e2;
  color: #dc2626;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
}

.footer {
  margin-top: 1.5rem;
}

.protection-info {
  color: #9ca3af;
  font-size: 0.75rem;
}

.cloudflare {
  color: #f6821f;
  font-weight: 500;
}
</style>
