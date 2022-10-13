import Vue, { reactive, ref } from "vue";
import { defineStore } from "pinia";
import axios from "axios";
import router from "../router/index";
import VueRouter from "vue-router";
import moment from "moment";
import CryptoJS from "crypto-js";

const { isNavigationFailure, NavigationFailureType } = VueRouter;

export const userStore = defineStore("user", {
  state: () => ({
    usuario: reactive({}),
    usuarioValido: ref(true),
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
        router.push("/home");
      } else {
        this.mensajeError = resultadoConsulta.mensaje;
      }
    },
    vaciarMensaje() {
      this.mensajeError = "";
    },
    logout() {
      axios.post(`${process.env.VUE_APP_RUTA_API}/eventos/crear/`, evento);
      Vue.prototype.$socket.client.emit("logoutCliente");
      this.usuario = {};
      this.maquinaID = null;
      if (evento.ruta !== "/") router.push("/");
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
      variables: "Variables",
      historico: "Historico",
      informe: "Informe",
      deccodaf: "DECCODAF",
      deccodafMarchaParo: "DECCODAF - Estado",
      deccodafConsumo: "DECCODAF - Consumo",
      // deccodafRegistros: "/sistemas/deccodaf/registros",
      deccodos: "DECCODOS",
      deccodosMarchaParo: "DECCODOS - Estado",
      deccodosConsumo: "DECCODOS -Consumo",
      // deccodosRegistros: "/sistemas/deccodos/registros",
      deccowasher: "DECCOWASHER",
      deccowasherMarchaParo: "DECCOWASHER - Estado",
      deccowasherConsumo: "DECCOWASHER - Consumo",
      // deccowasherRegistros: "/deccowasher/registros",
      deccocontrol: "DECCOCONTROL",
    },
    id: 0,
    lineas: 0,
  }),
  actions: {
    homeRoute: async function ({}) {
      router.push(this.routes.home);
    },
    login: async function ({}) {
      router.push(this.routes.login);
    },
    error: async function ({}) {
      router.push(this.routes.error);
    },
    sistemas: async function (id) {
      router.push({
        name: this.routes.sistemas,
        params: { id },
      });
    },
    historico: async function (id) {
      router.push({
        name: this.routes.historico,
        params: { id },
      });
    },
    informe: async function (id) {
      router.push({
        name: this.routes.informe,
        params: { id },
      });
    },
    deccodaf: async function (id, linea) {
      router.push({
        name: this.routes.deccodaf,
        params: { id, linea },
      });
    },
    deccodos: async function (id, linea) {
      router.push({
        name: this.routes.deccodos,
        params: { id, linea },
      });
    },
    deccowasher: async function (id, linea) {
      router.push({
        name: this.routes.deccowasher,
        params: { id, linea },
      });
    },
    deccocontrol: async function (id, linea) {
      router.push({
        name: this.routes.deccocontrol,
        params: { id, linea },
      });
    },
    menu: async function (route, id, linea) {
      this.id = id;
      this.lineas = linea;
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
        case "deccodaf:MarchaParo":
          router
            .push({
              name: this.routes.deccodafMarchaParo,
              params: { id, linea },
            })
            .catch((failure) => {
              if (
                isNavigationFailure(failure, NavigationFailureType.duplicated)
              ) {
              }
            });
          break;
        case "deccodaf:Consumo":
          router
            .push({ name: this.routes.deccodafConsumo, params: { id, linea } })
            .catch((failure) => {
              if (
                isNavigationFailure(failure, NavigationFailureType.duplicated)
              ) {
              }
            });
          break;
          // case "deccodaf:Registros":
          //   router.push(this.routes.deccodafRegistros).catch((failure) => {
          //     if (
          //       isNavigationFailure(failure, NavigationFailureType.duplicated)
          //     ) {
          //     }
          //   });
          break;
        case "deccodos:Principal":
          router
            .push({ name: this.routes.deccodos, params: { id, linea } })
            .catch((failure) => {
              if (
                isNavigationFailure(failure, NavigationFailureType.duplicated)
              ) {
              }
            });
          break;
        case "deccodos:MarchaParo":
          router
            .push({
              name: this.routes.deccodosMarchaParo,
              params: { id, linea },
            })
            .catch((failure) => {
              if (
                isNavigationFailure(failure, NavigationFailureType.duplicated)
              ) {
              }
            });
          break;
        case "deccodos:Consumo":
          router
            .push({ name: this.routes.deccodosConsumo, params: { id, linea } })
            .catch((failure) => {
              if (
                isNavigationFailure(failure, NavigationFailureType.duplicated)
              ) {
              }
            });
          break;
        // case "deccodos:Registros":
        //   router.push(this.routes.deccodosRegistros).catch((failure) => {
        //     if (
        //       isNavigationFailure(failure, NavigationFailureType.duplicated)
        //     ) {
        //     }
        //   });
        //   break;
        case "deccowasher:Principal":
          router
            .push({ name: this.routes.deccowashe, params: { id, linea } })
            .catch((failure) => {
              if (
                isNavigationFailure(failure, NavigationFailureType.duplicated)
              ) {
              }
            });
          break;
        case "deccowasher:MarchaParo":
          router
            .push({
              name: this.routes.deccowasherMarchaParo,
              params: { id, linea },
            })
            .catch((failure) => {
              if (
                isNavigationFailure(failure, NavigationFailureType.duplicated)
              ) {
              }
            });
          break;
        case "deccowasher:Consumo":
          router
            .push({
              name: this.routes.deccowasherConsumo,
              params: { id, linea },
            })
            .catch((failure) => {
              if (
                isNavigationFailure(failure, NavigationFailureType.duplicated)
              ) {
              }
            });
          break;
        // case "deccowasher:Registros":
        //   router.push(this.routes.deccowasherRegistros).catch((failure) => {
        //     if (
        //       isNavigationFailure(failure, NavigationFailureType.duplicated)
        //     ) {
        //     }
        //   });
        //   break;
        case "deccocontrol:Principal":
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
