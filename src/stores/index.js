import { reactive, ref } from "vue";
import { defineStore } from "pinia";
import axios from "axios";
import router from "../router/index";
import VueRouter from "vue-router";
import CryptoJS from "crypto-js";

const { isNavigationFailure, NavigationFailureType } = VueRouter;

export const userStore = defineStore("user", {
  state: () => ({
    usuario: reactive({}),
    usuarioValido: ref(false),
    mensajeError: ref(""),
  }),
  getters: {},

  actions: {
    login: async function ({ datosLogin, evento }) {
      let credenciales = {
        usuario: datosLogin.usuario,
        password: CryptoJS.MD5(datosLogin.password).toString(),
      };
      let resultadoConsulta = (
        await axios.post(`${process.env.VUE_APP_RUTA_API}/login/`, credenciales)
      ).data;
      if (!resultadoConsulta.error) {
        axios.post(`${process.env.VUE_APP_RUTA_API}/eventos/crear/`, evento);
        this.usuario = resultadoConsulta;
        this.usuarioValido = true;
        router.push({ name: "Home" });
      } else {
        this.usuarioValido = false;
        this.mensajeError = resultadoConsulta.mensaje;
      }
    },
    vaciarMensaje() {
      this.mensajeError = "";
    },
    logout() {
      // Vue.prototype.$socket.client.emit("logoutCliente");
      this.usuario = {};
      this.usuarioValido = false;
      router.push({ name: "Home" }).catch((failure) => {
        if (isNavigationFailure(failure, NavigationFailureType.duplicated)) {
        }
      });
    },
  },
});

export const routerStore = defineStore("router", {
  state: () => ({
    routes: {
      home: "Home",
      login: "Login",
      error: "Error",
      sistemas: "Sistemas",
      cliente: "Cliente",
      clienteNuevo: "NuevoCliente",
      clienteNuevoLinea: "AsignadorNuevoCliente",
      clienteEditar: "EditarCliente",
      variables: "Variables",
      historico: "Historico",
      informe: "Informe",
      deccodaf: "DECCODAF",
      deccodafOtras: "DECCODAF - Otras",
      deccodos: "DECCODOS",
      deccodosOtras: "DECCODOS - Otras",
      deccowasher: "DECCOWASHER",
      deccowasherOtras: "DECCOWASHER - Otras",
      deccocontrol: "DECCOCONTROL",
    },
    clienteID: ref(null),
    lineasID: ref(null),
    maquina: ref(null),
  }),
  getters: {
    getId(state) {
      return state.clienteID;
    },
    getLinea(state) {
      return state.lineasID;
    },
  },
  actions: {
    homeRoute: async function ({}) {
      router.push({ name: this.routes.home });
    },
    login: async function () {
      router.push({ name: this.routes.login });
    },
    error: async function ({}) {
      router.push({ name: this.routes.error });
    },
    cliente: async function () {
      router.push({ name: this.routes.cliente });
    },
    clienteNuevo: async function ({}) {
      router.push({ name: this.routes.clienteNuevo });
    },
    clienteNuevoLinea: async function (id) {
      this.clienteID = id;
      router.push({ name: this.routes.clienteNuevoLinea });
    },
    clienteEditar: async function (id) {
      this.clienteID = id;
      router.push({
        name: this.routes.clienteEditar,
        params: { id },
      });
    },
    sistemas: async function (id, linea) {
      this.clienteID = id;
      this.maquina = null;
      router.push({
        name: this.routes.sistemas,
        params: { id, linea },
      });
    },
    historico: async function (id) {
      this.maquina = "Historico";
      router.push({
        name: this.routes.historico,
        params: { id },
      });
    },
    informe: async function (id) {
      this.maquina = null;
      router.push({
        name: this.routes.informe,
        params: { id },
      });
    },
    deccodaf: async function (id, linea) {
      this.maquina = "DECCODAF";
      router.push({
        name: this.routes.deccodaf,
        params: { id, linea },
      });
    },
    deccodos: async function (id, linea) {
      this.maquina = "DECCODOS";
      router.push({
        name: this.routes.deccodos,
        params: { id, linea },
      });
    },
    deccowasher: async function (id, linea) {
      this.maquina = "DECCOWASHER";
      router.push({
        name: this.routes.deccowasher,
        params: { id, linea },
      });
    },
    deccocontrol: async function (id) {
      this.maquina = "DECCOCONTROL";
      router.push({
        name: this.routes.deccocontrol,
        params: { id },
      });
    },
    menu: async function (route, id, linea, maquina) {
      this.clienteID = id;
      this.lineasID = linea;
      this.maquina = maquina;
      switch (route) {
        case "home":
          router.push({ name: this.routes.home }).catch((failure) => {
            if (
              isNavigationFailure(failure, NavigationFailureType.duplicated)
            ) {
            }
          });
          break;
        case "login":
          router.push({ name: this.routes.login }).catch((failure) => {
            if (
              isNavigationFailure(failure, NavigationFailureType.duplicated)
            ) {
            }
          });
          break;
        case "sistemas":
          router
            .push({
              name: this.routes.sistemas,
              params: { id: id, linea: linea },
            })
            .catch((failure) => {
              if (
                isNavigationFailure(failure, NavigationFailureType.duplicated)
              ) {
              }
            });
          break;
        case "variables":
          this.maquina = "Variables";
          router
            .push({ name: this.routes.variables, params: { id, linea } })
            .catch((failure) => {
              if (
                isNavigationFailure(failure, NavigationFailureType.duplicated)
              ) {
              }
            });
          break;
        case "historico":
          this.maquina = "Historico";
          router
            .push({ name: this.routes.historico, params: { id, linea } })
            .catch((failure) => {
              if (
                isNavigationFailure(failure, NavigationFailureType.duplicated)
              ) {
              }
            });
          break;
        case "informe":
          router
            .push({ name: this.routes.informe, params: { id, linea } })
            .catch((failure) => {
              if (
                isNavigationFailure(failure, NavigationFailureType.duplicated)
              ) {
              }
            });
          break;
        case "deccodaf:Principal":
          this.maquina = "DECCODAF";
          router
            .push({
              name: this.routes.deccodaf,
              params: { id, linea },
            })
            .catch((failure) => {
              if (
                isNavigationFailure(failure, NavigationFailureType.duplicated)
              ) {
              }
            });
          break;
        case "deccodaf:Otras":
          this.maquina = "DECCODAF";
          router
            .push({
              name: this.routes.deccodafOtras,
              params: { id, linea },
            })
            .catch((failure) => {
              if (
                isNavigationFailure(failure, NavigationFailureType.duplicated)
              ) {
              }
            });
          break;
        case "deccodos:Principal":
          this.maquina = "DECCODOS";
          router
            .push({ name: this.routes.deccodos, params: { id, linea } })
            .catch((failure) => {
              if (
                isNavigationFailure(failure, NavigationFailureType.duplicated)
              ) {
              }
            });
          break;
        case "deccodos:Otras":
          this.maquina = "DECCODOS";
          router
            .push({
              name: this.routes.deccodosOtras,
              params: { id, linea },
            })
            .catch((failure) => {
              if (
                isNavigationFailure(failure, NavigationFailureType.duplicated)
              ) {
              }
            });
          break;
        case "deccowasher:Principal":
          this.maquina = "DECCOWASHER";
          router
            .push({ name: this.routes.deccowasher, params: { id, linea } })
            .catch((failure) => {
              if (
                isNavigationFailure(failure, NavigationFailureType.duplicated)
              ) {
              }
            });
          break;
        case "deccowasher:Otras":
          this.maquina = "DECCOWASHER";
          router
            .push({
              name: this.routes.deccowasherOtras,
              params: { id, linea },
            })
            .catch((failure) => {
              if (
                isNavigationFailure(failure, NavigationFailureType.duplicated)
              ) {
              }
            });
          break;
        case "deccocontrol:Principal":
          this.maquina = "DECCOCONTROL";
          router
            .push({ name: this.routes.deccocontrol, params: { id, linea } })
            .catch((failure) => {
              if (
                isNavigationFailure(failure, NavigationFailureType.duplicated)
              ) {
              }
            });
          break;
        default:
          break;
      }
    },
  },
});

export const navStore = defineStore("nav", {
  state: () => ({
    estadoPanelLateral: ref(false),
  }),
  getters: {
    getEstadoPanelLateral(state) {
      return state.estadoPanelLateral;
    },
  },
  actions: {
    displayMensaje: function ({}) {
      this.estadoPanelLateral = !this.estadoPanelLateral;
    },
  },
});
