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
        router.push("/sistemas");
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
      home: "/",
      login: "/login",
      error: "/error",
      sistemas: "/sistemas",
      variables: "/variables",
      historico: "/historico",
      informe: "/informe",
      deccodaf: "/sistemas/deccodaf",
      deccodafMarchaParo: "/sistemas/deccodaf/estado",
      deccodafConsumo: "/sistemas/deccodaf/consumo",
      deccodafRegistros: "/sistemas/deccodaf/registros",
      deccodos: "/sistemas/deccodos/",
      deccodosMarchaParo: "/sistemas/deccodos/estado",
      deccodosConsumo: "/sistemas/deccodos/consumo",
      deccodosRegistros: "/sistemas/deccodos/registros",
      deccowasher: "/sistemas/deccowasher",
      deccowasherMarchaParo: "/sistemas/deccowasher/estado",
      deccowasherConsumo: "/sistemas/deccowasher/consumo",
      deccowasherRegistros: "/sistemas/deccowasher/registros",
      deccocontrol: "/sistemas/deccocontrol",
    },
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
    sistemas: async function ({}) {
      router.push(this.routes.sistemas);
    },
    historico: async function ({}) {
      router.push(this.routes.historico);
    },
    informe: async function ({}) {
      router.push(this.routes.informe);
    },
    deccodaf: async function ({}) {
      router.push(this.routes.deccodaf);
    },
    deccodos: async function ({}) {
      router.push(this.routes.deccodos);
    },
    deccowasher: async function ({}) {
      router.push(this.routes.deccowasher);
    },
    deccocontrol: async function ({}) {
      router.push(this.routes.deccocontrol);
    },
    menu: async function (route) {
      switch (route) {
        case "home":
          router.push(this.routes.home).catch((failure) => {
            if (
              isNavigationFailure(failure, NavigationFailureType.duplicated)
            ) {
            }
          });
          break;
        case "login":
          router.push(this.routes.login).catch((failure) => {
            if (
              isNavigationFailure(failure, NavigationFailureType.duplicated)
            ) {
            }
          });
          break;
        case "sistemas":
          router.push(this.routes.sistemas).catch((failure) => {
            if (
              isNavigationFailure(failure, NavigationFailureType.duplicated)
            ) {
            }
          });
          break;
        case "variables":
          router.push(this.routes.variables).catch((failure) => {
            if (
              isNavigationFailure(failure, NavigationFailureType.duplicated)
            ) {
            }
          });
          break;
        case "historico":
          router.push(this.routes.historico).catch((failure) => {
            if (
              isNavigationFailure(failure, NavigationFailureType.duplicated)
            ) {
            }
          });
          break;
        case "informe":
          router.push(this.routes.informe).catch((failure) => {
            if (
              isNavigationFailure(failure, NavigationFailureType.duplicated)
            ) {
            }
          });
          break;
        case "deccodaf:Principal":
          router.push(this.routes.deccodaf).catch((failure) => {
            if (
              isNavigationFailure(failure, NavigationFailureType.duplicated)
            ) {
            }
          });
          break;
        case "deccodaf:MarchaParo":
          router.push(this.routes.deccodafMarchaParo).catch((failure) => {
            if (
              isNavigationFailure(failure, NavigationFailureType.duplicated)
            ) {
            }
          });
          break;
        case "deccodaf:Consumo":
          router.push(this.routes.deccodafConsumo).catch((failure) => {
            if (
              isNavigationFailure(failure, NavigationFailureType.duplicated)
            ) {
            }
          });
          break;
        case "deccodaf:Registros":
          router.push(this.routes.deccodafRegistros).catch((failure) => {
            if (
              isNavigationFailure(failure, NavigationFailureType.duplicated)
            ) {
            }
          });
          break;
        case "deccodos:Principal":
          router.push(this.routes.deccodos).catch((failure) => {
            if (
              isNavigationFailure(failure, NavigationFailureType.duplicated)
            ) {
            }
          });
          break;
        case "deccodos:MarchaParo":
          router.push(this.routes.deccodosMarchaParo).catch((failure) => {
            if (
              isNavigationFailure(failure, NavigationFailureType.duplicated)
            ) {
            }
          });
          break;
        case "deccodos:Consumo":
          router.push(this.routes.deccodosConsumo).catch((failure) => {
            if (
              isNavigationFailure(failure, NavigationFailureType.duplicated)
            ) {
            }
          });
          break;
        case "deccodos:Registros":
          router.push(this.routes.deccodosRegistros).catch((failure) => {
            if (
              isNavigationFailure(failure, NavigationFailureType.duplicated)
            ) {
            }
          });
          break;
        case "deccowasher:Principal":
          router.push(this.routes.deccowasher).catch((failure) => {
            if (
              isNavigationFailure(failure, NavigationFailureType.duplicated)
            ) {
            }
          });
          break;
        case "deccowasher:MarchaParo":
          router.push(this.routes.deccowasherMarchaParo).catch((failure) => {
            if (
              isNavigationFailure(failure, NavigationFailureType.duplicated)
            ) {
            }
          });
          break;
        case "deccowasher:Consumo":
          router.push(this.routes.deccowasherConsumo).catch((failure) => {
            if (
              isNavigationFailure(failure, NavigationFailureType.duplicated)
            ) {
            }
          });
          break;
        case "deccowasher:Registros":
          router.push(this.routes.deccowasherRegistros).catch((failure) => {
            if (
              isNavigationFailure(failure, NavigationFailureType.duplicated)
            ) {
            }
          });
          break;
        case "deccocontrol:Principal":
          router.push(this.routes.deccocontrol).catch((failure) => {
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
