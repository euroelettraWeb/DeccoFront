<template>
  <v-container>
    <h1 class="transition-swing text-h2">
      {{ nombreCliente }} - DECCODAF - {{ nombreLinea }}
    </h1>
    <EstadoAgitadores />
    <EstadoNivelGarrafas />
    <!-- <TablaNivelesGarrafa /> -->
  </v-container>
</template>
<script>
export default {
  name: "EstadoView",
};
</script>
<script setup>
import EstadoNivelGarrafas from "../../components/cards/deccodaf/EstadoNivelGarrafas.vue";
import TablaNivelesGarrafa from "../../components/tablas/deccodaf/TablaNivelesGarrafa.vue";
import EstadoAgitadores from "../../components/cards/deccodaf/EstadoAgitadores.vue";

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
