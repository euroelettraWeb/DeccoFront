<template>
  <v-container fluid>
    <LoteCliente />
    <v-row>
      <v-col>
        <v-switch v-model="turnos" color="info" label="Turnos">Turnos</v-switch>
        <TablaTurnos v-if="turnos" />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
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
      </v-col>
      <v-col>
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
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col>
        <LoteDecco :tipo="3" />
        <Estado
          :activo="57"
          :auto-manual="[61, 63]"
          :marcha="[57, 60, 62]"
          :alarma="[62, 88]"
          :tipo="3"
          :categories="[
            'Activo',
            'MarchaParo',
            'Remoto',
            'Manual',
            'Falta de consenso',
            'Presencia Fruta',
          ]"
        />
        <GraficaEstadoCard
          :variables="[60, 84, 85, 86, 87]"
          :height="300"
          title="Alarmas"
          :tipo="3"
          :colores="['#00c853', '#d50000']"
          :estados="['', 'Aviso']"
          :categories="[
            'Alarma',
            'Mínimo Nivel Desinfectante',
            'Bidon Desinfectante Vacio',
            'Mínimo Nivel Jabon',
            'Bidon Jabon Vacio',
          ]"
        />
        <GraficaLineaCard
          title="Dosis de Desinfectante y Jabon"
          :variables="[58, 59]"
          :tipo="3"
        />
        <FrutaProcesadaComun :fruta="48" :tipo="2" />
        <GraficaEstadoCard
          :variables="[64, 65]"
          :height="250"
          title="Estado de las bombas"
          :tipo="3"
          :estados="['Paro', 'Marcha']"
          :categories="['Bomba Desinfectante', 'Bomba Jabon']"
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
    <!-- <v-btn
      class="mt-2"
      color="info"
      @click="
        routerStore().menu(
          'deccowasher:Otras',
          routerStore().clienteID,
          routerStore().lineasID
        )
      "
      >Otras Variables</v-btn
    > -->
  </v-container>
</template>

<script>
export default {
  name: "DECCOWASHERPrincipal",
};
</script>
<script setup>
import Estado from "../../components/cards/comun/Estado.vue";
import GraficaLineaCard from "../../components/cards/comun/GraficaLineaCard.vue";
import GraficaEstadoCard from "../../components/cards/comun/GraficaEstadoCard.vue";
import TablaTurnos from "../../components/tablas/comun/TablaTurnos.vue";
import TablaTotal from "../../components/tablas/comun/TablaTotal.vue";
import FrutaProcesadaComun from "../../components/cards/comun/FrutaProcesadaComun.vue";
import { routerStore } from "../../stores/index";
import { obtenerTurnos } from "../../helpers/bd";
import { onMounted, ref } from "vue";
import TablaTotalTurnos from "../../components/tablas/comun/TablaTotalTurnos.vue";
import TablaAlarmas from "../../components/tablas/comun/TablaAlarmas.vue";
import TablaAlarmasTurnos from "../../components/tablas/comun/TablaAlarmasTurnos.vue";
import LoteCliente from "../../components/cards/comun/LoteCliente.vue";
import LoteDecco from "../../components/cards/deccowasher/LoteDecco.vue";

let turnos = ref(true);
let turnosA = ref([]);
onMounted(async () => {
  turnosA.value = await obtenerTurnos(routerStore().clienteID);
  turnos.value = turnosA.value.length > 0 ? true : false;
});
</script>
