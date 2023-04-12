<template>
  <v-container>
    <v-row fluid>
      <v-col>
        <GraficaEstadoCard
          :variables="[2, 3, 4, 5, 6]"
          :height="300"
          title="Estado de los agitadores"
          :tipo="1"
          :categories="[
            'Agitador Producto 1',
            'Agitador Producto 2',
            'Agitador Producto 3',
            'Agitador Producto 4',
            'Agitador Producto 5',
          ]" />
        <GraficaEstadoCard
          :variables="[20, 21, 22, 23, 24]"
          :height="300"
          title="Estado de los niveles de las garrafas"
          :tipo="1"
          :estados="['Aviso', '']"
          :categories="[
            'Nivel Garrafa P1',
            'Nivel Garrafa P2',
            'Nivel Garrafa P3',
            'Nivel Garrafa P4',
            'Nivel Garrafa P5',
          ]" />
        <TablaNivelesGarrafa
      /></v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "DECCODAFOtras",
};
</script>
<script setup>
import TablaNivelesGarrafa from "../../components/tablas/deccodaf/TablaNivelesGarrafa.vue";
import GraficaEstadoCard from "../../components/cards/comun/GraficaEstadoCard.vue";
</script>
