import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import ClienteView from "../views/ClienteView.vue";
import NuevoClienteView from "../views/Clientes/NuevoClienteView.vue";
import EditarClienteView from "../views/Clientes/EditarClienteView.vue";
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
import DECCODARegistros from "../views/Deccodaf/Registros.vue";
import DECCODOSFTotales from "../views/Deccodos/Totales.vue";
import DECCODOSEstado from "../views/Deccodos/Estado.vue";
import DECCODOSRegistros from "../views/Deccodos/Registros.vue";
import DECCOWSTotales from "../views/Deccowasher/Totales.vue";
import DECCOWSEstado from "../views/Deccowasher/Estado.vue";
import DECCOWSRegistros from "../views/Deccowasher/Registros.vue";
import { routerStore } from "../stores/index";
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
    path: "/cliente",
    name: "Cliente",
    component: ClienteView,
    meta: { title: "DECCO - Cliente" },
  },
  {
    path: "/cliente/nuevo",
    name: "NuevoCliente",
    component: NuevoClienteView,
    meta: { title: "DECCO - Cliente" },
  },
  {
    path: "/cliente/:id/editar",
    name: "EditarCliente",
    component: EditarClienteView,
    meta: { title: "DECCO - Cliente" },
  },
  // {
  //   path: "/cliente/:id",
  //   name: "Sistemas",
  //   component: SistemasView,
  //   meta: { title: "DECCO - Sistemas" },
  // },
  {
    path: "/cliente/:id/sistemas",
    name: "Sistemas",
    component: SistemasView,
    meta: { title: "DECCO - Sistemas" },
  },
  {
    path: "/cliente/:id/variables",
    name: "Variables",
    component: VariablesView,
    meta: { title: "DECCO - Variables" },
  },
  {
    path: "/cliente/:id/historico",
    name: "Historico",
    component: HistoricoView,
    meta: { title: "DECCO - Historico" },
  },
  {
    path: "/cliente/:id/informe",
    name: "Informe",
    component: InformeView,
    meta: { title: "DECCO - Informe" },
  },
  {
    path: "/cliente/:id/sistemas/:linea/deccodaf",
    name: "DECCODAF",
    component: DECCODAFPrincipal,
    meta: { title: "DECCO - DECCODAF" },
  },
  {
    path: "/cliente/:id/sistemas/:linea/deccodaf/estado",
    name: "DECCODAF - Estado",
    component: DECCODAFEstado,
    meta: { title: "DECCO - DECCODAF" },
  },
  {
    path: "/cliente/:id/sistemas/:linea/deccodaf/consumo",
    name: "DECCODAF - Consumo",
    component: DECCODAFTotales,
    meta: { title: "DECCO - DECCODAF" },
  },
  // {
  //   path: "/sistemas/deccodaf/registros",
  //   name: "DECCODAF - Registros",
  //   component: DECCODARegistros,
  //   meta: { title: "DECCO - DECCODAF" },
  // },
  {
    path: "/cliente/:id/sistemas/:linea/sistemas/deccodos",
    name: "DECCODOS",
    component: DECCODOSPrincipal,
    meta: { title: "DECCO - DECCODOS" },
  },
  {
    path: "/cliente/:id/sistemas/:linea/deccodos/estado",
    name: "DECCODOS - Estado",
    component: DECCODOSEstado,
    meta: { title: "DECCO - DECCODOS" },
  },
  {
    path: "/cliente/:id/sistemas/:linea/deccodos/consumo",
    name: "DECCODOS -Consumo",
    component: DECCODOSFTotales,
    meta: { title: "DECCO - DECCODOS" },
  },
  // {
  //   path: "/sistemas/deccodos/registros",
  //   name: "DECCODOS -Registros",
  //   component: DECCODOSRegistros,
  //   meta: { title: "DECCO - DECCODOS" },
  // },
  {
    path: "/cliente/:id/sistemas/:linea/deccowasher",
    name: "DECCOWASHER",
    component: DECCOWASHERPrincipal,
    meta: { title: "DECCO - DECCOWASHER" },
  },
  {
    path: "/cliente/:id/sistemas/:linea/deccowasher/estado",
    name: "DECCOWASHER - Estado",
    component: DECCOWSEstado,
    meta: { title: "DECCO - DECCOWASHER" },
  },
  {
    path: "/cliente/:id/sistemas/:linea/deccowasher/consumo",
    name: "DECCOWASHER - Consumo",
    component: DECCOWSTotales,
    meta: { title: "DECCO - DECCOWASHER" },
  },
  // {
  //   path: "/sistemas/deccowasher/registros",
  //   name: "DECCOWASHER - Registros",
  //   component: DECCOWSRegistros,
  //   meta: { title: "DECCO - DECCOWASHER" },
  // },
  {
    path: "/cliente/:id/sistemas/:linea/deccocontrol",
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
  // if (routerStore() && routerStore().id == 0) next({ name: "Home" });
  next();
});
export default router;
