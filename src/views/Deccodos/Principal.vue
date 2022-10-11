<template>
  <v-container> <Estado /> <FrutaProcesada /> </v-container>
</template>

<script>
export default {
  name: "DECCODOSPrincipal",
};
</script>
<script setup>
import Estado from "../../components/cards/deccodos/Estado.vue";
import FrutaProcesada from "../../components/cards/deccodos/FrutaProcesada.vue";
</script>
