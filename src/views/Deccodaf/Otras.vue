<template>
  <v-container>
    <h1 class="transition-swing text-h2">
      {{ nombreCliente }} - DECCOWASHER - {{ nombreLinea }}
    </h1>
    <v-row>
      <v-col>
        <CajasComun :caja1="16" :caja2="17" :total="18" /> <EstadoAgitadores />
        <EstadoNivelGarrafas /> <TablaNivelesGarrafa
      /></v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "DECCOWASHERPrincipal",
};
</script>
<script setup>
import { routerStore } from "../../stores/index";
import bd from "../../helpers/bd";
import { onMounted, ref } from "vue";
import EstadoNivelGarrafas from "../../components/cards/deccodaf/EstadoNivelGarrafas.vue";
import EstadoAgitadores from "../../components/cards/deccodaf/EstadoAgitadores.vue";
import CajasComun from "../../components/cards/comun/CajasComun.vue";
import TablaNivelesGarrafa from "../../components/tablas/deccodaf/TablaNivelesGarrafa.vue";

let nombreLinea = ref("");
let nombreCliente = ref("");
onMounted(async () => {
  nombreLinea.value = (await bd.obtenerLinea(routerStore().lineasID))[0].nombre;
  nombreCliente.value = (
    await bd.obtenerCliente(routerStore().clienteID)
  )[0].nombre;
});
</script>
