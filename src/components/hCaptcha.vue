<script>
import VueHcaptcha from "@hcaptcha/vue3-hcaptcha";
export default {
  name: "hCaptcha",
  components: { VueHcaptcha },
  data() {
    return {
      captchaToken: null,
      siteKey: import.meta.env.VITE_HCAPTCHA_SITE_KEY,
    };
  },
  methods: {
    onCaptchaVerified(token) {
      this.captchaToken = token;
      this.$emit("captchaVerified", token);
    },
    onCaptchaExpired() {
      this.captchaToken = null;
      this.$emit("captchaExpired");
    },
    onCaptchaError(error) {
      this.captchaToken = null;
      this.$emit("captchaError", error);
    },
  },
};
</script>

<template>
  <div>
    <VueHcaptcha
      :sitekey="siteKey"
      @verify="onCaptchaVerified"
      @expired="onCaptchaExpired"
      @error="onCaptchaError"
    />
  </div>
</template>
