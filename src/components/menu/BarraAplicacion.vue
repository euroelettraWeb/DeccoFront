<template>
  <v-app-bar app color="primary" dark>
    <v-app-bar-nav-icon @click="nav.displayMensaje"></v-app-bar-nav-icon>

    <v-toolbar-title>GestProd</v-toolbar-title>

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
const user = userStore();
const nav = navStore();
let nombreLinea = ref("");
let nombreCliente = ref("");
let maquina = computed(() => {
  switch (routerStore().maquina) {
    case "Historico":
      return routerStore().maquina;
    case "Variables":
      return routerStore().maquina;
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

const logout = () => user.logout();
onMounted(async () => {
  watchEffect(async () => {
    if (routerStore().maquina) {
      nombreLinea.value = (
        await obtenerLinea(routerStore().lineasID)
      )[0].nombre;
      nombreCliente.value = (
        await obtenerCliente(routerStore().clienteID)
      )[0].nombre;
    }
  });
});
// const evento = () => {
//   let ahora = new Date().toLocaleString();
//   let partes = ahora.split(", ");
//   let fecha = partes[0].split("/").reverse();
//   if (fecha[1] < 10) fecha[1] = "0" + fecha[1];
//   if (fecha[2] < 10) fecha[2] = "0" + fecha[2];
//   partes[0] = fecha.join("-");
//   let horaInicio = partes.join("T");
//   return {
//     ruta: this.$route.path,
//     variableID: null,
//     usuario: this.usuarioLogeado.username,
//     descripcion: "Logout",
//     estado: 1,
//     horaInicio,
//   };
// };

// const vistaOFs = () => {
//   if (this.$route.path !== this.pathOFs) this.$router.push(this.pathOFs);
// };

// const vistaMotivosParo = () => {
//   if (this.$route.path !== this.pathMotivosParo)
//     this.$router.push(this.pathMotivosParo);
// };

// const vistaHistorico = () => {
//   if (this.$route.path !== this.pathHistorico)
//     this.$router.push(this.pathHistorico);
// };
</script>
