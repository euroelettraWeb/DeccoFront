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
import DECCODAFOtras from "../views/Deccodaf/Otras.vue";
import DECCODOSOtras from "../views/Deccodos/Otras.vue";
import DECCOWSOtras from "../views/Deccowasher/Otras.vue";
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
    if (to.meta.administrador && !(userStore().rol == "ADMINISTRADOR")) {
      routerStore().clienteID = userStore().clienteUsuario;
      next("/cliente/" + userStore().clienteUsuario + "/sistemas");
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
    meta: {
      title: "DECCO - Cliente",
      rutaProtegida: true,
      administrador: true,
    },
    beforeEnter: checkLogin,
  },
  {
    path: "/cliente/nuevo",
    name: "NuevoCliente",
    component: NuevoClienteView,
    meta: {
      title: "DECCO - Cliente",
      rutaProtegida: true,
      administrador: true,
    },
    beforeEnter: checkLogin,
  },
  {
    path: "/cliente/nuevo/lineas",
    name: "AsignadorNuevoCliente",
    component: AsignadorNuevoClienteView,
    meta: {
      title: "DECCO - Cliente",
      rutaProtegida: true,
      administrador: true,
    },
    beforeEnter: checkLogin,
  },
  {
    path: "/cliente/:id/editar",
    name: "EditarCliente",
    component: EditarClienteView,
    meta: {
      title: "DECCO - Cliente",
      rutaProtegida: true,
      administrador: true,
    },
    beforeEnter: checkLogin,
  },
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
    path: "/cliente/:id/sistemas/:linea/deccodos/otras",
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
  scrollBehavior(to, from, savedPosition) {
    return { x: 0, y: 0 };
  },
});
export default router;
