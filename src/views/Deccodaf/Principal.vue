<template>
  <v-container> <Estado /> <Marcha /> </v-container>
</template>

<script>
export default {
  name: "DECCODAFPrincipal",
};
</script>
<script setup>
import Estado from "../../components/cards/comun/Estado.vue";
import Marcha from "../../components/cards/comun/Marcha.vue";
</script>
