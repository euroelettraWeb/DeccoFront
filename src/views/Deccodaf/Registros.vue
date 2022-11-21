<template>
  <v-container>
    <h1 class="transition-swing text-h2">
      {{ nombreCliente }} - DECCODAF - {{ nombreLinea }}
    </h1>
    <ConsumoDosisFungicida /> <TablaDosis
  /></v-container>
</template>
<script>
export default {
  name: "TotalesView",
};
</script>
<script setup>
import ConsumoDosisFungicida from "../../components/cards/deccodaf/ConsumoDosisFungicida.vue";
import TablaDosis from "../../components/tablas/deccodaf/TablaDosis.vue";

import { routerStore } from "../../stores/index";
import axios from "axios";
import { onMounted, ref } from "vue";

async function obtenerLinea(id) {
  return (await axios.get(`${process.env.VUE_APP_RUTA_API}/lineas/${id}`)).data;
}
async function obtenerCliente(id) {
  return (await axios.get(`${process.env.VUE_APP_RUTA_API}/clientes/${id}`))
    .data;
}
let nombreLinea = ref("");
let nombreCliente = ref("");
onMounted(async () => {
  nombreLinea.value = (await obtenerLinea(routerStore().lineasID))[0].nombre;
  nombreCliente.value = (
    await obtenerCliente(routerStore().clienteID)
  )[0].nombre;
});
</script>
