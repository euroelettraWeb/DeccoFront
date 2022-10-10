<template>
  <v-container fluid class="fill-height">
    <v-row justify="center">
      <v-col>
        <CardCliente title="Linea 4" />
      </v-col>
      <v-col><CardCliente title="Linea 5" /> </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "SistemasView",
};
</script>

<script setup>
import { routerStore } from "../stores/index";
import CardCliente from "../components/cards/comun/CardCliente.vue";
const router = routerStore();
</script>
