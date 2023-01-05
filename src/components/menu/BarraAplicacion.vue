<template>
  <v-app-bar app color="primary" dark>
    <v-app-bar-nav-icon @click="nav.displayMensaje"></v-app-bar-nav-icon>

    <v-toolbar-title>GestProd</v-toolbar-title>

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
import { userStore, navStore } from "../../stores/index";
const user = userStore();
const nav = navStore();

const logout = () => user.logout();

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
