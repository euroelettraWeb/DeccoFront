import Vue from "vue";
import { storeToRefs } from "pinia";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import ClienteView from "../views/ClienteView.vue";
import NuevoClienteView from "../views/Clientes/NuevoClienteView.vue";
import AsignadorNuevoClienteView from "../views/Clientes/AsignadorNuevoClienteView.vue";
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
import DECCODAFegistros from "../views/Deccodaf/Registros.vue";
import DECCODAFOtras from "../views/Deccodaf/Otras.vue";
import DECCODOSFTotales from "../views/Deccodos/Totales.vue";
import DECCODOSEstado from "../views/Deccodos/Estado.vue";
import DECCODOSRegistros from "../views/Deccodos/Registros.vue";
import DECCODOSOtras from "../views/Deccodos/Otras.vue";
import DECCOWSTotales from "../views/Deccowasher/Totales.vue";
import DECCOWSOtras from "../views/Deccowasher/Otras.vue";
import DECCOWSEstado from "../views/Deccowasher/Estado.vue";
import DECCOWSRegistros from "../views/Deccowasher/Registros.vue";
import { routerStore, userStore } from "../stores/index";

function checkLogin(to, from, next) {
  if (to.meta.rutaProtegida) {
    // let socket = Vue.prototype.$socket;
    // if (!socket) {
    //   next("/");
    //   return;
    // }
    if (!storeToRefs(userStore()).usuarioValido.value) {
      next("/login");
      return;
    }
  }
  document.title = to.meta.title;
  next();
}

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
    meta: { title: "DECCO - Cliente", rutaProtegida: true },
    beforeEnter: checkLogin,
  },
  {
    path: "/cliente/nuevo",
    name: "NuevoCliente",
    component: NuevoClienteView,
    meta: { title: "DECCO - Cliente", rutaProtegida: true },
    beforeEnter: checkLogin,
  },
  {
    path: "/cliente/nuevo/lineas",
    name: "AsignadorNuevoCliente",
    component: AsignadorNuevoClienteView,
    meta: { title: "DECCO - Cliente", rutaProtegida: false },
    beforeEnter: checkLogin,
  },
  {
    path: "/cliente/:id/editar",
    name: "EditarCliente",
    component: EditarClienteView,
    meta: { title: "DECCO - Cliente", rutaProtegida: true },
    beforeEnter: checkLogin,
  },
  // {
  //   path: "/cliente/:id",
  //   name: "Sistemas",
  //   component: SistemasView,
  //   meta: { title: "DECCO - Sistemas", rutaProtegida: true },
  // beforeEnter: checkLogin,
  // },
  {
    path: "/cliente/:id/sistemas",
    name: "Sistemas",
    component: SistemasView,
    meta: { title: "DECCO - Sistemas", rutaProtegida: true },
    beforeEnter: checkLogin,
  },
  {
    path: "/cliente/:id/variables",
    name: "Variables",
    component: VariablesView,
    meta: { title: "DECCO - Variables", rutaProtegida: true },
    beforeEnter: checkLogin,
  },
  {
    path: "/cliente/:id/historico",
    name: "Historico",
    component: HistoricoView,
    meta: { title: "DECCO - Historico", rutaProtegida: true },
    beforeEnter: checkLogin,
  },
  {
    path: "/cliente/:id/informe",
    name: "Informe",
    component: InformeView,
    meta: { title: "DECCO - Informe", rutaProtegida: true },
    beforeEnter: checkLogin,
  },
  {
    path: "/cliente/:id/sistemas/:linea/deccodaf",
    name: "DECCODAF",
    component: DECCODAFPrincipal,
    meta: { title: "DECCO - DECCODAF", rutaProtegida: true },
    beforeEnter: checkLogin,
  },
  {
    path: "/cliente/:id/sistemas/:linea/deccodaf/estado",
    name: "DECCODAF - Estado",
    component: DECCODAFEstado,
    meta: { title: "DECCO - DECCODAF", rutaProtegida: true },
    beforeEnter: checkLogin,
  },
  {
    path: "/cliente/:id/sistemas/:linea/deccodaf/consumo",
    name: "DECCODAF - Consumo",
    component: DECCODAFTotales,
    meta: { title: "DECCO - DECCODAF", rutaProtegida: true },
    beforeEnter: checkLogin,
  },
  // {
  //   path: "/sistemas/deccodaf/registros",
  //   name: "DECCODAF - Registros",
  //   component: DECCODARegistros,
  //   meta: { title: "DECCO - DECCODAF", rutaProtegida: true },
  // beforeEnter: checkLogin,
  // },
  {
    path: "/cliente/:id/sistemas/:linea/deccodaf/otras",
    name: "DECCODAF - Otras",
    component: DECCODAFOtras,
    meta: { title: "DECCO - DECCODAF", rutaProtegida: true },
    beforeEnter: checkLogin,
  },
  {
    path: "/cliente/:id/sistemas/:linea/sistemas/deccodos",
    name: "DECCODOS",
    component: DECCODOSPrincipal,
    meta: { title: "DECCO - DECCODOS", rutaProtegida: true },
    beforeEnter: checkLogin,
  },
  {
    path: "/cliente/:id/sistemas/:linea/deccodos/estado",
    name: "DECCODOS - Estado",
    component: DECCODOSEstado,
    meta: { title: "DECCO - DECCODOS", rutaProtegida: true },
    beforeEnter: checkLogin,
  },
  {
    path: "/cliente/:id/sistemas/:linea/deccodos/consumo",
    name: "DECCODOS - Consumo",
    component: DECCODOSFTotales,
    meta: { title: "DECCO - DECCODOS", rutaProtegida: true },
    beforeEnter: checkLogin,
  },
  // {
  //   path: "/sistemas/deccodos/registros",
  //   name: "DECCODOS -Registros",
  //   component: DECCODOSRegistros,
  //   meta: { title: "DECCO - DECCODOS", rutaProtegida: true },
  // beforeEnter: checkLogin,
  // },
  {
    path: "/cliente/:id/sistemas/:linea/deccowasher/otras",
    name: "DECCODOS - Otras",
    component: DECCODOSOtras,
    meta: { title: "DECCO - DECCODOS", rutaProtegida: true },
    beforeEnter: checkLogin,
  },
  {
    path: "/cliente/:id/sistemas/:linea/deccowasher",
    name: "DECCOWASHER",
    component: DECCOWASHERPrincipal,
    meta: { title: "DECCO - DECCOWASHER", rutaProtegida: true },
    beforeEnter: checkLogin,
  },
  {
    path: "/cliente/:id/sistemas/:linea/deccowasher/otras",
    name: "DECCOWASHER - Otras",
    component: DECCOWSOtras,
    meta: { title: "DECCO - DECCOWASHER", rutaProtegida: true },
    beforeEnter: checkLogin,
  },
  // {
  //   path: "/cliente/:id/sistemas/:linea/deccowasher/estado",
  //   name: "DECCOWASHER - Estado",
  //   component: DECCOWSEstado,
  //   meta: { title: "DECCO - DECCOWASHER", rutaProtegida: true },
  //   beforeEnter: checkLogin,
  // },
  // {
  //   path: "/cliente/:id/sistemas/:linea/deccowasher/consumo",
  //   name: "DECCOWASHER - Consumo",
  //   component: DECCOWSTotales,
  //   meta: { title: "DECCO - DECCOWASHER", rutaProtegida: true },
  //   beforeEnter: checkLogin,
  // },
  // {
  //   path: "/sistemas/deccowasher/registros",
  //   name: "DECCOWASHER - Registros",
  //   component: DECCOWSRegistros,
  //   meta: { title: "DECCO - DECCOWASHER", rutaProtegida: true },
  // beforeEnter: checkLogin,
  // },
  {
    path: "/cliente/:id/sistemas/deccocontrol",
    name: "DECCOCONTROL",
    component: DECCOCONTROLPrincipal,
    meta: { title: "DECCO - DECCOCONTROL", rutaProtegida: true },
    beforeEnter: checkLogin,
  },
];
const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});
export default router;
