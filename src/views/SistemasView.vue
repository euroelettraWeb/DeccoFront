<template>
  <v-container fluid class="fill-height">
    <v-row justify="center">
      <v-col v-for="item in nombres" :key="item.id">
        <CardLineas :linea="item" /><!-- :linea="item.linea" -->
      </v-col>
    </v-row>
    <v-row>
      <v-spacer />
      <v-col cols="auto">
        <v-btn
          disabled
          @click="routerStore().deccocontrol(routerStore().clienteID)"
          ><v-icon light>mdi-snowflake</v-icon> DECCOCONTROL</v-btn
        >
      </v-col>
      <v-spacer />
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "LineasView",
};
</script>

<script setup>
import axios from "axios";
import { onMounted, ref, computed } from "vue";
import { routerStore } from "../stores/index";
import CardLineas from "../components/cards/comun/CardLineas.vue";

async function obtenerVariable(clienteID) {
  return (
    await axios.get(`${process.env.VUE_APP_RUTA_API}/${clienteID}/lineas/all`)
  ).data;
}
let linea = [];
let nombres = ref([]);
let cargado = ref(false);

onMounted(async () => {
  cargado.value = false;
  linea = await obtenerVariable(routerStore().clienteID); //TODO pasar cliente
  nombres.value = linea;
  cargado.value = true;
});
</script>
