<template>
  <v-container>
    <h1 class="transition-swing text-h2">
      {{ nombreCliente }} -DECCODOS - {{ nombreLinea }}
    </h1>
    <v-row>
      <v-col>
        <TablaTurnos />
        <Estado /> <FrutaProcesada />
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
