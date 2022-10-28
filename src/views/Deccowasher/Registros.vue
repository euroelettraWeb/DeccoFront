<template>
  <v-container>
    <h1>DECCOWASHER</h1>
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
</script>
