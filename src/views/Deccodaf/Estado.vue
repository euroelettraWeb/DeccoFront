<template>
  <v-container>
    <EstadoDAF />
    <EstadoNivelGarrafas />
    <EstadoAgitadores />
    <TablaNivelesGarrafa />
  </v-container>
</template>
<script>
export default {
  name: "EstadoView",
};
</script>
<script setup>
import EstadoDAF from "../../components/cards/deccodaf/EstadoDAF.vue";
import EstadoNivelGarrafas from "../../components/cards/deccodaf/EstadoNivelGarrafas.vue";
import TablaNivelesGarrafa from "../../components/tablas/deccodaf/TablaNivelesGarrafa.vue";
import EstadoAgitadores from "../../components/cards/deccodaf/EstadoAgitadores.vue";
</script>
