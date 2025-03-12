import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/index";
import "./assets/styles/main.css";
import "aos/dist/aos.css";
import "leaflet/dist/leaflet.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import store from "./store";

const app = createApp(App);
app.use(router);
app.use(store);
store.dispatch("auth/checkAuth").then(() => {
  app.mount("#app");
});
