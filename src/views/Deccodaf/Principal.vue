<template>
  <v-container>
    <h1 class="transition-swing text-h2">DECCODAF - {{ nombre }}</h1>
    <v-row>
      <v-col>
        <TablaTurnos />
        <TablaTotalTurnos />
        <Estado />
        <ConsumoDosisFungicida />
        <FrutaProcesada />
      </v-col>
    </v-row>
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
import TablaTurnos from "../../components/tablas/deccodaf/TablaTurnos.vue";
import TablaTotalTurnos from "../../components/tablas/deccodaf/TablaTotalTurnos.vue";
async function obtenerLinea(id) {
  return (await axios.get(`${process.env.VUE_APP_RUTA_API}/lineas/${id}`)).data;
}
let nombre = ref("");
onMounted(async () => {
  nombre.value = (await obtenerLinea(routerStore().lineasID))[0].nombre;
});
</script>
