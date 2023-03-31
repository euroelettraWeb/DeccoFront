<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <GraficaEstadoCard
          :variables="[64, 65]"
          :height="250"
          title="Estado de las bombas"
          :tipo="3"
          :estados="['Paro', 'Marcha']"
        />
        <GraficaEstadoCard
          :variables="[84, 85, 86, 87]"
          :height="300"
          title="Estado de niveles y bidon"
          :tipo="3"
          :colores="['#00c853', '#d50000']"
          :estados="['', 'Aviso']"
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
