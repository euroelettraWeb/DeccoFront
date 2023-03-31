<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <GraficaEstadoCard
          :variables="[64, 65, 84, 85, 86, 87]"
          :height="300"
          title="Estado de las bombas, niveles y bidon"
          :tipo="3"
        />
        <CajasComun :caja1="45" :caja2="46" :total="47" :tipo="2" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "DECCOWASHEROtras",
};
</script>
<script setup>
import CajasComun from "../../components/cards/comun/CajasComun.vue";
import GraficaEstadoCard from "../../components/cards/comun/GraficaEstadoCard.vue";
</script>
