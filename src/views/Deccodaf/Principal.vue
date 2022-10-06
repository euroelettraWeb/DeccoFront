<template>
  <v-container> <Estado /> <FrutaProcesada /> </v-container>
</template>

<script>
export default {
  name: "DECCODAFPrincipal",
};
</script>
<script setup>
import Estado from "../../components/cards/comun/Estado.vue";
import Marcha from "../../components/cards/comun/Marcha.vue";
import FrutaProcesada from "../../components/cards/comun/FrutaProcesada.vue";
</script>
