<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <GraficaEstadoCard
          :variables="[44]"
          :height="200"
          title="Activacion limpieza cepillos"
          :tipo="2"
          :categories="['Limpieza Cepillos']"
        />
        <GraficaLineaCard
          :variables="[45, 46]"
          :tipo="2"
          title="Cajas por Ciclo y Peso por Caja"
        />
        <GraficaLineaCard
          :variables="[47]"
          :tipo="2"
          title="Cajas/min"
          tipodatos="unidadTiempo"
          labelvar="Cajas/Min"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "DECCODOSOtras",
};
</script>
<script setup>
import GraficaLineaCard from "../../components/cards/comun/GraficaLineaCard.vue";
import GraficaEstadoCard from "../../components/cards/comun/GraficaEstadoCard.vue";
</script>
