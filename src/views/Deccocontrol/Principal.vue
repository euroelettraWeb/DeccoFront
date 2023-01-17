<template>
  <v-container>
    <h1 class="transition-swing text-h2">
      {{ nombreCliente }} - DECCOCONTROL - {{ nombreLinea }}
    </h1>
    <v-row>
      <v-col><!-- <Temperatura /> <EvolucionC02 /> <Humedad /> --></v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "DECCOCONTROLPrincipal",
};
</script>
<script setup>
import EvolucionC02 from "../../components/cards/deccontrol/EvolucionC02.vue";
import Humedad from "../../components/cards/deccontrol/Humedad.vue";
import Temperatura from "../../components/cards/deccontrol/Temperatura.vue";
import { routerStore } from "../../stores/index";
import { obtenerLinea, obtenerCliente } from "../../helpers/bd";
import { onMounted, ref } from "vue";

let nombreLinea = ref("");
let nombreCliente = ref("");
onMounted(async () => {
  nombreLinea.value = (await obtenerLinea(routerStore().lineasID))[0].nombre;
  nombreCliente.value = (
    await obtenerCliente(routerStore().clienteID)
  )[0].nombre;
});
</script>
