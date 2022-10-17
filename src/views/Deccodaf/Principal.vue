<template>
  <v-container>
    <h1>DECCODAF</h1>
    <Estado /> <ConsumoDosisFungicida /> <FrutaProcesada />
  </v-container>
</template>

<script>
export default {
  name: "DECCODAFPrincipal",
};
</script>
<script setup>
import Estado from "../../components/cards/deccodaf/Estado.vue";
import FrutaProcesada from "../../components/cards/deccodaf/FrutaProcesada.vue";
import ConsumoDosisFungicida from "../../components/cards/deccodaf/ConsumoDosisFungicida.vue";
</script>
