import Vue from "vue";
import App from "./App.vue";

import { createPinia, PiniaVuePlugin } from "pinia";
Vue.use(PiniaVuePlugin);

const pinia = createPinia();

import router from "./router";
import VueRouter from "vue-router";
Vue.use(VueRouter);

import vuetify from "./plugins/vuetify";
import "@mdi/font/css/materialdesignicons.css";

import VueApexCharts from "vue-apexcharts";
Vue.use(VueApexCharts);

Vue.component("ApexChart", VueApexCharts);

Vue.config.productionTip = false;

new Vue({
  pinia,
  router,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
