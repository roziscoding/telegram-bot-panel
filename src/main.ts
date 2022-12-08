import { createApp } from "vue";
import App from "./App.vue";
import { router } from "./router/router";
import { pinia } from "./store/store";
import "./style.scss";

createApp(App).use(router).use(pinia).mount("#app");
