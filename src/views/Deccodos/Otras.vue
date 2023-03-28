<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <GraficaEstadoCard
          :variables="[44, 81]"
          :height="300"
          title="Activacion limpieza cepillos y presencia de fruta"
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
