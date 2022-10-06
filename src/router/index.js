import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import SistemasView from "../views/SistemasView.vue";
import VariablesView from "../views/VariablesView.vue";
import HistoricoView from "../views/HistoricoView.vue";
import InformeView from "../views/InformeView.vue";
import DECCODAFPrincipal from "../views/Deccodaf/Principal.vue";
import DECCODOSPrincipal from "../views/Deccodos/Principal.vue";
import DECCOWASHERPrincipal from "../views/Deccowasher/Principal.vue";
import DECCOCONTROLPrincipal from "../views/Deccocontrol/Principal.vue";
import DECCODAFTotales from "../views/Deccodaf/Totales.vue";
import DECCODAFEstado from "../views/Deccodaf/Estado.vue";
import DeccodafRegistros from "../views/Deccodaf/Registros.vue";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: { title: "DECCO" },
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: { title: "DECCO - Login" },
  },
  {
    path: "/sistemas",
    name: "Sistemas",
    component: SistemasView,
    meta: { title: "DECCO - Sistemas" },
  },
  {
    path: "/variables",
    name: "Variables",
    component: VariablesView,
    meta: { title: "DECCO - Variables" },
  },
  {
    path: "/historico",
    name: "Historico",
    component: HistoricoView,
    meta: { title: "DECCO - Historico" },
  },
  {
    path: "/informe",
    name: "Informe",
    component: InformeView,
    meta: { title: "DECCO - Informe" },
  },
  {
    path: "/sistemas/deccodaf",
    name: "DECCODAF",
    component: DECCODAFPrincipal,
    meta: { title: "DECCO - DECCODAF" },
  },
  {
    path: "/sistemas/deccodaf/estado",
    name: "DECCODAF - MarchaParo",
    component: DECCODAFEstado,
    meta: { title: "DECCO - DECCODAF" },
  },
  {
    path: "/sistemas/deccodaf/consumo",
    name: "DECCODAF - Consumo",
    component: DECCODAFTotales,
    meta: { title: "DECCO - DECCODAF" },
  },
  {
    path: "/sistemas/deccodaf/registros",
    name: "DECCODAF - Registros",
    component: DeccodafRegistros,
    meta: { title: "DECCO - DECCODAF" },
  },
  {
    path: "/sistemas/deccodos",
    name: "DECCODOS",
    component: DECCODOSPrincipal,
    meta: { title: "DECCO - DECCODOS" },
  },
  {
    path: "/sistemas/deccodos/estado",
    name: "DECCODOS - MarchaParo",
    component: DECCODOSPrincipal,
    meta: { title: "DECCO - DECCODOS" },
  },
  {
    path: "/sistemas/deccodos/consumo",
    name: "DECCODOS -Consumo",
    component: DECCODOSPrincipal,
    meta: { title: "DECCO - DECCODOS" },
  },
  {
    path: "/sistemas/deccodos/registros",
    name: "DECCODOS -Registros",
    component: DECCODOSPrincipal,
    meta: { title: "DECCO - DECCODOS" },
  },
  {
    path: "/sistemas/deccowasher",
    name: "DECCOWASHER",
    component: DECCOWASHERPrincipal,
    meta: { title: "DECCO - DECCOWASHER" },
  },
  {
    path: "/sistemas/deccowasher/estado",
    name: "DECCOWASHER - MarchaParo",
    component: DECCOWASHERPrincipal,
    meta: { title: "DECCO - DECCOWASHER" },
  },
  {
    path: "/sistemas/deccowasher/consumo",
    name: "DECCOWASHER - Consumo",
    component: DECCOWASHERPrincipal,
    meta: { title: "DECCO - DECCOWASHER" },
  },
  {
    path: "/sistemas/deccowasher/registros",
    name: "DECCOWASHER - Registros",
    component: DECCOWASHERPrincipal,
    meta: { title: "DECCO - DECCOWASHER" },
  },
  {
    path: "/sistemas/deccocontrol",
    name: "DECCOCONTROL",
    component: DECCOCONTROLPrincipal,
    meta: { title: "DECCO - DECCOCONTROL" },
  },
];
const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});
router.beforeEach((to, from, next) => {
  document.title = to.meta.title;
  next();
});
export default router;
