<template>
  <v-container>
    <h1 class="transition-swing text-h2">
      {{ nombreCliente }} - DECCODOS - {{ nombreLinea }}
    </h1>
    <v-row>
      <v-col>
        <v-switch
          v-model="turnos"
          color="info"
          prepend-icon="mdi-clock"
          label="Turnos"
          >Turnos</v-switch
        >
        <TablaTurnos v-if="turnos" />
        <TablaTotalTurnos
          v-if="turnos"
          :variables="[49, 50, 51, 52, 53, 54, 55]"
          :marcha="[31, 40, 42]"
        />
        <TablaTotal
          v-else
          :variables="[49, 50, 51, 52, 53, 54, 55]"
          :marcha="[31, 40, 42]"
        />
        <TablaProductos />
        <SeleccionarProducto />
        <Estado :activo="31" :auto="41" :manual="43" :alarma="40" :fc="42" />
        <Dosis :variables="[34, 35, 36, 37, 38]" title="Dosis Bombas" />
        <DosisDOSe />
        <FrutaProcesadaComun :fruta="48" />
        <v-btn
          color="info"
          @click="
            routerStore().menu(
              'deccodos:Otras',
              routerStore().clienteID,
              routerStore().lineasID
            )
          "
          >Otras Variables</v-btn
        >
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "DECCODOSPrincipal",
};
</script>
<script setup>
import Estado from "../../components/cards/comun/Estado.vue";
import TablaTurnos from "../../components/tablas/comun/TablaTurnos.vue";
import TablaTotal from "../../components/tablas/comun/TablaTotal.vue";
import { routerStore } from "../../stores/index";
import bd from "../../helpers/bd";
import { onMounted, ref } from "vue";
import TablaTotalTurnos from "../../components/tablas/comun/TablaTotalTurnos.vue";
import Dosis from "../../components/cards/comun/Dosis.vue";
import FrutaProcesadaComun from "../../components/cards/comun/FrutaProcesadaComun.vue";
import TablaProductos from "../../components/tablas/deccodos/TablaProductos.vue";
import DosisDOSe from "../../components/cards/deccodos/DosisDOSe.vue";
import SeleccionarProducto from "../../components/cards/deccodos/SeleccionarProducto.vue";

let nombreLinea = ref("");
let nombreCliente = ref("");
let turnos = ref(true);
onMounted(async () => {
  nombreLinea.value = (await bd.obtenerLinea(routerStore().lineasID))[0].nombre;
  nombreCliente.value = (
    await bd.obtenerCliente(routerStore().clienteID)
  )[0].nombre;
});
</script>
