import { createApp } from "vue";
import { createI18n } from "vue-i18n";
import App from "./App.vue";
import router from "./router/index";
import "./assets/styles/main.css";
import "aos/dist/aos.css";
import "leaflet/dist/leaflet.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import En from "./locale/en.json";
import Ar from "./locale/ar.json";

import store from "./store";

const app = createApp(App);
const i18n = createI18n({
  locale: sessionStorage.getItem("locale") || "en",
  fallbackLocale: "en",
  messages: {
    en: En,
    ar: Ar,
  },
});

app.use(i18n);
app.use(router);
app.use(store);
store.dispatch("auth/checkAuth").then(() => {
  app.mount("#app");
});
