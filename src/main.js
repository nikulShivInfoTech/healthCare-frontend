
import { createApp } from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import { createPinia } from 'pinia';
import router from "./router/router";
// Create Pinia instance
const pinia = createPinia();


createApp(App)
  .use(pinia) 
  .use(router)
  .use(vuetify)
  .mount("#app");