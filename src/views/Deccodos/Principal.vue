<template>
  <v-container>
    <h1 class="transition-swing text-h2">
      {{ nombreCliente }} - DECCODOS - {{ nombreLinea }}
    </h1>
    <v-row>
      <v-col>
        <TablaTurnos />
        <TablaTotalTurnos />
        <Estado />
        <DosisDOSb />
        <FrutaProcesada />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "DECCODOSPrincipal",
};
</script>
<script setup>
import Estado from "../../components/cards/deccodos/Estado.vue";
import FrutaProcesada from "../../components/cards/deccodos/FrutaProcesada.vue";
import TablaTurnos from "../../components/tablas/comun/TablaTurnos.vue";
import { routerStore } from "../../stores/index";
import axios from "axios";
import { onMounted, ref } from "vue";
import TablaTotalTurnos from "../../components/tablas/deccodos/TablaTotalTurnos.vue";
import DosisDOSb from "../../components/cards/deccodos/DosisDOSb.vue";

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
