import Vue from "vue";
import bd from "./bd";
export default {
  install: () => {
    Vue.prototype.bd = bd;
    Vue.bd = bd;
  },
};
