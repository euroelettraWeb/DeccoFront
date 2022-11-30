<template>
  <v-container>
    <h1 class="transition-swing text-h2">
      {{ nombreCliente }} - DECCODAF - {{ nombreLinea }}
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
          :variables="[25, 26, 27, 28, 29, 30]"
          :marcha="[1, 12, 14]"
        />
        <TablaTotal
          v-else
          :variables="[25, 26, 27, 28, 29, 30]"
          :marcha="[1, 12, 14]"
        />
        <Estado :activo="1" :auto="13" :manual="15" :alarma="12" :fc="14" />
        <Dosis title="Dosis de fungicida" :variables="[7, 8, 9, 10, 11]" />
        <FrutaProcesadaComun :fruta="19" />
        <v-btn
          color="info"
          @click="
            routerStore().menu(
              'deccodaf:Otras',
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
  name: "DECCODAFPrincipal",
};
</script>
<script setup>
import { routerStore } from "../../stores/index";
import bd from "../../helpers/bd";
import Estado from "../../components/cards/comun/Estado.vue";
import Dosis from "../../components/cards/comun/Dosis.vue";
import TablaTotal from "../../components/tablas/comun/TablaTotal.vue";
import { onMounted, ref } from "vue";
import TablaTurnos from "../../components/tablas/comun/TablaTurnos.vue";
import TablaTotalTurnos from "../../components/tablas/comun/TablaTotalTurnos.vue";
import FrutaProcesadaComun from "../../components/cards/comun/FrutaProcesadaComun.vue";

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
