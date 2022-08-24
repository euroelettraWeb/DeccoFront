<template>
  <v-app-bar app color="red accent-4" dark>
    <v-app-bar-nav-icon @click="nav.displayMensaje"></v-app-bar-nav-icon>

    <v-toolbar-title>GestProd</v-toolbar-title>

    <v-spacer></v-spacer>

    <v-btn v-if="!existeUsuario" to="/login" outlined>
      <v-icon left>mdi-account-circle</v-icon>
      Iniciar sesion
    </v-btn>

    <v-menu v-else offset-y>
      <template #activator="{ on, attrs }">
        <v-btn v-bind="attrs" outlined v-on="on">
          <v-icon left>mdi-account-circle</v-icon>
          <!-- {{ usuarioLogeado.nombre }} -->
        </v-btn>
      </template>
      <v-list>
        <v-list-item>
          <!-- @click="logout(evento())" -->
          <v-list-item-title class="text-center">Logout</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <!-- <template v-if="existeUsuario && esRutaMaquina" #extension>
      <v-tabs align-with-title>
        <v-tab @click="vistaOFs"> OF planificadas </v-tab>
        <v-tab @click="vistaMotivosParo"> Definir motivos de paro </v-tab>
        <v-tab @click="vistaHistorico"> Historico OF </v-tab>
      </v-tabs>
    </template> -->
  </v-app-bar>
</template>

<script>
export default {
  name: "BarraAplicacion",
};
</script>
<script setup>
import moment from "moment";
import { userStore, navStore } from "../../stores/index";
import { reactive } from "vue";
// const datosLogin = reactive({
//   usuario: "",
//   password: "",
// });
const user = userStore();
const nav = navStore();
const { usuario } = user;
const existeUsuario = usuario.nombre ? true : false;

//...mapState(userStore, ["usuarioLogeado", "maquina"]),

// const pathOFs = () => {
//   return `/${this.maquina.codigo}/ordenes`;
// };

// const pathMotivosParo = () => {
//   return `/${this.maquina.codigo}/motivosparo`;
// };

// const pathHistorico = () => {
//   return `/${this.maquina.codigo}/historico`;
// };

// const existeUsuario = () => {
//   return this.usuarioLogeado ? "nombre" in this.usuarioLogeado : false;
// };

// const esRutaMaquina = () => {
//   return this.$route.name !== "Login" &&
//     this.$route.name !== "Maquinas" &&
//     this.$route.name !== "Home"
//     ? true
//     : false;
// };

// const estadoPanel = () => {
//   return this.estadoPanelLateral;
// };

// const logout = user.logout();

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
