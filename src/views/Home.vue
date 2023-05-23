<template>
  <v-container fluid fill-height>
    <v-row align="center" justify="center">
      <v-col
        cols="2"
        style="
          background-image: url('logo_cliente.png');
          background-size: contain;
          background-position: right;
          height: 300px;
        "
      ></v-col>
      <v-col
        cols="2"
        style="
          background-image: url('logo_nunsys.jpg');
          background-size: contain;
          background-position: center;
          height: 300px;
        "
      ></v-col>
      <v-col
        cols="2"
        style="
          background-image: url('logo_euroelettra.jpg');
          background-size: contain;
          background-position: left;
          height: 300px;
        "
      ></v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="text-center">
        <v-btn x-large color="success" elevation="4" @click="log">
          Seleccionar Cliente
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "HomeView",
};
</script>
<script setup>
import { routerStore, userStore } from "../stores/index";

function log() {
  if (userStore().usuarioValido) {
    routerStore().cliente();
  } else {
    routerStore().login();
  }
}
</script>
