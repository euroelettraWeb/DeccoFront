<template>
  <MainView />
</template>

<script>
import { io } from "socket.io-client";
import axios from "axios";
import moment from "moment";
import MainView from "./views/MainView.vue";
import { ref, provide, watch, onMounted } from "vue";
import { routerStore } from "./stores";
export default {
  name: "App",
  metaInfo: {
    title: "DECCO",
  },
};
</script>
<script setup>
let ahora = ref(null);
let socket = ref(null);
// const router = routerStore();

// let usuarioValidado = ref(null);
// let usuarioConectado = ref(null);

// const registrarEvento = async (evento) => {
//   await axios.post(`${process.env.VUE_APP_RUTA_API}/eventos/crear/`, evento);
// };

// // let establecerUsuario = () => {
// //   if (usuarioValidado.value) {
// //     window.localStorage.setItem("usuarioValidado", usuarioValidado.value);
// //     socket.value = io(process.env.VUE_APP_RUTA_API, { forceNew: true });
// //     redirigirTrasExcesoDeConexiones(socket, router, usuarioConectado);
// //     logoutClientesMismaIPLocal(socket, usuarioValidado);
// //     usuarioConectado.value = true;
// //     router.homeRoute();
// //   } else {
// //     window.localStorage.removeItem("usuarioValidado");
// //     socket.value.emit("logoutCliente");
// //     usuarioConectado.value = false;
// //     socket.value = null;
// //     router.login();
// //   }
// // };

// let establecerAhora = () => {
//   let fecha = new Date();
//   let horarioActual = new Date(
//     fecha.getTime() - fecha.getTimezoneOffset() * 60000
//   );
//   ahora.value = moment(horarioActual);
// };

// // watch(usuarioValidado, establecerUsuario);

// // if (window.localStorage.getItem("usuarioValidado")) {
// //   usuarioValidado.value = window.localStorage.getItem("usuarioValidado");
// // }

// // onMounted(async () => {
// //   setInterval(establecerAhora, 1000);
// // });
// provide("ahora", ahora);
// provide("socket", socket);

// provide("usuarioValidado", usuarioValidado);
// provide("usuarioConectado", usuarioConectado);
// provide("registrarEvento", registrarEvento);
// function redirigirTrasExcesoDeConexiones(socket, router, usuarioConectado) {
//   if (socket.value) {
//     socket.value.on("desconexionServidor", () => {
//       router.error();
//       usuarioConectado.value = false;
//       socket.value.disconnect(true);
//       socket.value = null;
//     });
//   }
// }

// function logoutClientesMismaIPLocal(socket, usuarioValidado) {
//   if (socket.value) {
//     socket.value.on("logoutServidor", () => {
//       usuarioValidado.value = null;
//     });
//   }
// }
</script>

<style>
html {
  overflow: hidden !important;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

html::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.v-card {
  max-height: 100%;
  display: flex !important;
  flex-direction: column;
}

.v-card__text {
  flex-grow: 1;
  overflow-y: auto;
}

/* width */
::-webkit-scrollbar {
  width: 5px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #e1bee7;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #ce93d8;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #ba68c8;
}

.no-clickable {
  pointer-events: none;
}

.v-btn {
  text-transform: none !important;
}

.v-list-item__title:hover {
  cursor: pointer;
}

.bg {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: url("./assets/imagenFondoApp.jpg") no-repeat center center;
  background-size: cover;
  transform: scale(1.1);
  opacity: 0.4;
}
</style>
