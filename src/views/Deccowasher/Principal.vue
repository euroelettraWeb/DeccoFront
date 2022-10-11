<template>
  <v-container> <Estado /> <Dosis /> <FrutaProcesada /></v-container>
</template>

<script>
export default {
  name: "DECCOWASHERPrincipal",
};
</script>
<script setup>
import Estado from "../../components/cards/deccowasher/Estado.vue";
import FrutaProcesada from "../../components/cards/deccowasher/FrutaProcesada.vue";
import Dosis from "../../components/cards/deccowasher/Dosis.vue";
</script>
