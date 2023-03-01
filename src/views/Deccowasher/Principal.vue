<template>
  <v-container>
    <!--  -->
    <v-row>
      <v-col>
        <v-switch v-model="turnos" color="info" label="Turnos">Turnos</v-switch>
        <TablaTurnos v-if="turnos" :tipo="1" />
        <TablaTotalTurnos
          v-if="turnos && turnosA.length > 1"
          :variables="[70, 71, 72]"
          :marcha="[57, 60, 62]"
          :tipo="3"
        />
        <TablaTotal
          v-else
          :variables="[70, 71, 72]"
          :marcha="[57, 60, 62]"
          :tipo="3"
        />
        <TablaAlarmasTurnos
          v-if="turnos && turnosA.length > 1"
          :variables="[60, 62, 84, 85, 86, 87]"
          :marcha="[57, 60, 62]"
          :tipo="3"
        />
        <TablaAlarmas
          v-else
          :variables="[60, 62, 84, 85, 86, 87]"
          :marcha="[57, 60, 62]"
          :tipo="3"
        />
        <Estado
          :activo="57"
          :auto-manual="[61, 63]"
          :marcha="[57, 60, 62]"
          :alarma="[60, 62]"
          :tipo="3"
        />
        <Dosis
          title="Dosis de Desinfectante y Jabon"
          :variables="[58, 59]"
          :tipo="3"
        />
        <FrutaProcesadaComun :fruta="48" :tipo="2" />
        <v-btn
          color="info"
          @click="
            routerStore().menu(
              'deccowasher:Otras',
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
  name: "DECCOWASHERPrincipal",
};
</script>
<script setup>
import Estado from "../../components/cards/comun/Estado.vue";
import Dosis from "../../components/cards/comun/Dosis.vue";
import TablaTurnos from "../../components/tablas/comun/TablaTurnos.vue";
import TablaTotal from "../../components/tablas/comun/TablaTotal.vue";
import FrutaProcesadaComun from "../../components/cards/comun/FrutaProcesadaComun.vue";
import { routerStore } from "../../stores/index";
import { obtenerLinea, obtenerCliente, obtenerTurnos } from "../../helpers/bd";
import { onMounted, ref } from "vue";
import TablaTotalTurnos from "../../components/tablas/comun/TablaTotalTurnos.vue";
import TablaAlarmas from "../../components/tablas/comun/TablaAlarmas.vue";
import TablaAlarmasTurnos from "../../components/tablas/comun/TablaAlarmasTurnos.vue";

let nombreLinea = ref("");
let nombreCliente = ref("");
let turnos = ref(true);
let turnosA = ref([]);
onMounted(async () => {
  turnosA.value = await obtenerTurnos(routerStore().clienteID);
  turnos.value = turnosA.value.length > 0 ? true : false;
  // nombreLinea.value = (await obtenerLinea(routerStore().lineasID))[0].nombre;
  // nombreCliente.value = (
  //   await obtenerCliente(routerStore().clienteID)
  // )[0].nombre;
});
</script>
