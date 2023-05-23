<template>
  <v-container>
    <v-row>
      <v-col><!-- <Temperatura /> <EvolucionC02 /> <Humedad /> --></v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "DECCOCONTROLPrincipal",
};
</script>
<script setup>
import EvolucionC02 from "../../components/cards/deccontrol/EvolucionC02.vue";
import Humedad from "../../components/cards/deccontrol/Humedad.vue";
import Temperatura from "../../components/cards/deccontrol/Temperatura.vue";
</script>
