import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/index";
import "./assets/styles/main.css";
import "aos/dist/aos.css";
import "bootstrap-icons/font/bootstrap-icons.css";
const app = createApp(App);
app.use(router);
app.mount("#app");
