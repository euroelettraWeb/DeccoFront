<template>
  <v-container>
    <v-row>
      <v-col>
        <GraficaEstadoCard
          :variables="[64, 65, 84, 85, 86, 87, 88]"
          :height="400"
          title="Estado de las bombas, niveles, bidon y presencia de fruta"
          :tipo="3"
        />
        <CajasComun :caja1="66" :caja2="67" :total="68" :tipo="3" />
        <!-- <GraficaEstadoCard
          :variables="[20]"
          :height="300"
          title="Presencia de fruta"
          :tipo="3"
        /> -->
        <!-- <GraficaEstadoCard
          :variables="[20]"
          :height="300"
          title="Señal de nivel"
          :tipo="3"
        /> -->
        <!-- <GraficaEstadoCard
          :variables="[20]"
          :height="300"
          title="Nivel de garrafas"
          :tipo="2"
        /> -->
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
import { routerStore } from "../../stores/index";
import { obtenerLinea, obtenerCliente } from "../../helpers/bd";
import { onMounted, ref } from "vue";
import CajasComun from "../../components/cards/comun/CajasComun.vue";
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
