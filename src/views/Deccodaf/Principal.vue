<template>
  <v-container>
    <h1 class="transition-swing text-h2">DECCODAF - {{ nombre }}</h1>
    <Estado /> <ConsumoDosisFungicida /> <FrutaProcesada />
  </v-container>
</template>

<script>
export default {
  name: "DECCODAFPrincipal",
};
</script>
<script setup>
import { routerStore } from "../../stores/index";
import axios from "axios";
import Estado from "../../components/cards/deccodaf/Estado.vue";
import FrutaProcesada from "../../components/cards/deccodaf/FrutaProcesada.vue";
import ConsumoDosisFungicida from "../../components/cards/deccodaf/ConsumoDosisFungicida.vue";
import { onMounted, ref } from "vue";
async function obtenerLinea(id) {
  return (await axios.get(`${process.env.VUE_APP_RUTA_API}/lineas/${id}`)).data;
}
let nombre = ref("");
onMounted(async () => {
  nombre.value = (await obtenerLinea(routerStore().lineasID))[0].nombre;
});
</script>
