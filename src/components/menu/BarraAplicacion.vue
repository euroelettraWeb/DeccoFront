<template>
  <v-app-bar app color="primary" dark>
    <v-app-bar-nav-icon @click="nav.displayMensaje"></v-app-bar-nav-icon>

    <v-toolbar-title
      ><v-img
        max-width="40"
        src="../../assets/Decco_Horizontal_Logo_Mono_White_RGB.png"
      ></v-img
    ></v-toolbar-title>

    <v-spacer></v-spacer>

    <v-toolbar-title v-if="routerStore().maquina">
      {{ maquina }}
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn v-if="!user.usuarioValido" to="/login" outlined>
      <v-icon left>mdi-account-circle</v-icon>
      Iniciar sesion
    </v-btn>

    <v-menu v-else offset-y>
      <template #activator="{ on, attrs }">
        <v-btn v-bind="attrs" outlined v-on="on">
          <v-icon left>mdi-account-circle</v-icon>
          {{ user.usuario.nombre }}
        </v-btn>
      </template>
      <v-list>
        <v-list-item>
          <v-list-item-title class="text-center" @click="logout()"
            >Logout</v-list-item-title
          >
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script>
export default {
  name: "BarraAplicacion",
};
</script>
<script setup>
import { ref, onMounted, computed, watchEffect } from "vue";
import { obtenerCliente, obtenerLinea } from "../../helpers/bd";
import { userStore, navStore, routerStore } from "../../stores/index";
// import io from "socket.io-client";

const user = userStore();
const nav = navStore();
// const socket = io(process.env.VUE_APP_RUTA_API);
const nombreLinea = ref("");
const nombreCliente = ref("");
const maquina = computed(() => {
  switch (routerStore().maquina) {
    case "Historico":
      return routerStore().maquina;
    case "Clientes":
      return "";
    case "Variables":
      return routerStore().maquina;
    case "Lineas":
      return routerStore().maquina;
    case "Home":
      return "";
    case "GestionUsuarios":
      return "";
    default:
      return (
        nombreCliente.value +
        " - " +
        routerStore().maquina +
        " - " +
        nombreLinea.value
      );
  }
});

const logout = () => {
  // socket.emit("logoutCliente");
  user.logout();
};
onMounted(async () => {
  watchEffect(async () => {
    switch (routerStore().maquina) {
      case "Historico":
        return routerStore().maquina;
      case "Clientes":
        return "";
      case "Variables":
        return routerStore().maquina;
      case "Lineas":
        return routerStore().maquina;
      case "Home":
        return "";
      case "GestionUsuarios":
        return "";
      default:
        if (routerStore().lineasID != null) {
          nombreLinea.value = (
            await obtenerLinea(routerStore().lineasID)
          )[0].nombre;
          nombreCliente.value = (
            await obtenerCliente(routerStore().clienteID)
          )[0].nombre;
        }
    }
  });
});
</script>
