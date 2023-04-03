<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <GraficaEstadoCard
          :variables="[44]"
          :height="200"
          title="Activacion limpieza cepillos"
          :tipo="2"
        />
        <CajasComun :caja1="45" :caja2="46" :total="47" :tipo="2" />
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
import CajasComun from "../../components/cards/comun/CajasComun.vue";
import GraficaEstadoCard from "../../components/cards/comun/GraficaEstadoCard.vue";
</script>
