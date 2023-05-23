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
          :categories="['Bomba Desinfectante', 'Bomba Jabon']"
        />
        <GraficaEstadoCard
          :variables="[84, 85, 86, 87]"
          :height="300"
          title="Estado de niveles y bidon"
          :tipo="3"
          :colores="['#00c853', '#d50000']"
          :estados="['', 'Aviso']"
          :categories="[
            'Aviso Nivel Desinfectante',
            'Aviso Nivel Jabon',
            'Bidon Desinfectante Vacio',
            'Bidon Jabon Vacio',
          ]"
        />
        <GraficaLineaCard
          :variables="[45, 46]"
          :tipo="2"
          title="Cajas por Ciclo y Peso por Caja"
        />
        <GraficaLineaCard
          title="Cajas/Min"
          :variables="[47]"
          :tipo="2"
          tipodatos="unidadTiempo"
          labelvar="Cajas/Min"
        />
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
import GraficaLineaCard from "../../components/cards/comun/GraficaLineaCard.vue";
import GraficaEstadoCard from "../../components/cards/comun/GraficaEstadoCard.vue";
</script>
