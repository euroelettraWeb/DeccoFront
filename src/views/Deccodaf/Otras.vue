<template>
  <v-container>
    <h1 class="transition-swing text-h2">
      {{ nombreCliente }} - DECCODAF - {{ nombreLinea }}
    </h1>
    <v-row>
      <v-col>
        <CajasComun :caja1="16" :caja2="17" :total="18" :tipo="1" />
        <GraficaEstadoCard
          :variables="[2, 3, 4, 5, 6]"
          :height="300"
          title="Estado de los agitadores"
          :tipo="1" />
        <!-- <GraficaEstadoCard
          :variables="[20]"
          :height="300"
          title="Señal del nivel"
          :tipo="1" /> -->
        <GraficaEstadoCard
          :variables="[20, 21, 22, 23, 24]"
          :height="300"
          title="Estado de los niveles de las garrafas"
          :tipo="1" />
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
import { routerStore } from "../../stores/index";
import { obtenerLinea, obtenerCliente } from "../../helpers/bd";
import { onMounted, ref } from "vue";
import CajasComun from "../../components/cards/comun/CajasComun.vue";
import TablaNivelesGarrafa from "../../components/tablas/deccodaf/TablaNivelesGarrafa.vue";
import GraficaEstadoCard from "../../components/cards/comun/GraficaEstadoCard.vue";

let nombreLinea = ref("");
let nombreCliente = ref("");
onMounted(async () => {
  nombreLinea.value = (await obtenerLinea(routerStore().lineasID))[0].nombre;
  nombreCliente.value = (
    await obtenerCliente(routerStore().clienteID)
  )[0].nombre;
});
</script>
