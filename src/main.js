import Vue from "vue";
import App from "./App.vue";

import { Chart, registerables } from "chart.js";

import "chartjs-adapter-moment";
import zoomPlugin from "chartjs-plugin-zoom";
import annotationPlugin from "chartjs-plugin-annotation";
import streamingPlugin from "chartjs-plugin-streaming";
import { createPinia, PiniaVuePlugin } from "pinia";
Chart.register(...registerables, zoomPlugin, annotationPlugin, streamingPlugin);
Vue.use(PiniaVuePlugin);

const pinia = createPinia();

import router from "./router";
import vuetify from "./plugins/vuetify";
import "@mdi/font/css/materialdesignicons.css";

import VueApexCharts from "vue-apexcharts";
Vue.use(VueApexCharts);

Vue.component("ApexChart", VueApexCharts);

// import Socketio from "./plugins/socketio";

// Vue.use(Socketio, {
//   connection: "http://192.168.55.54:3000",
//   options: {
//     forceNew: true
//   }
// });

Vue.config.productionTip = false;

new Vue({
  router,
  vuetify,
  pinia,
  render: (h) => h(App),
}).$mount("#app");
