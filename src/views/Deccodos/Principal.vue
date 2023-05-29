<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <LoteCliente :tipo="2" />
        <v-switch v-model="turnos" color="info" label="Turnos">Turnos</v-switch>
        <TablaTurnos v-if="turnos" />
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col>
        <v-row
          ><v-col>
            <TablaTotalTurnos
              v-if="turnos && turnosA.length > 1"
              :variables="[49, 50, 51, 52, 53, 54, 55]"
              :modo="[13, 15]"
              :tipo="2" />
            <TablaTotal
              v-else
              :variables="[49, 50, 51, 52, 53, 54, 55]"
              :marcha="[31, 40, 42]"
              :tipo="2" /></v-col
          ><v-col>
            <TablaAlarmasTurnos
              v-if="turnos && turnosA.length > 1"
              :variables="[40, 42]"
              :marcha="[31, 40, 42]"
              :tipo="2" />
            <TablaAlarmas
              v-else
              :variables="[40, 42]"
              :marcha="[31, 40, 42]"
              :tipo="2"
          /></v-col>
        </v-row>
        <LoteDecco :tipo="2" title="Lote Cera" />
        <Estado
          :activo="31"
          :auto-manual="[41, 43]"
          :marcha="[31, 40, 42]"
          :alarma="[40, 42, 81]"
          :tipo="2"
          :categories="[
            'Activo',
            'MarchaParo',
            'Remoto',
            'Manual',
            'Falta de consenso',
            'Alarma',
            'Presencia Fruta',
          ]"
        />
        <GraficaLineaCard
          :variables="[32, 33, 34, 35, 36, 37, 38, 39]"
          title="Dosis"
          :tipo="2"
        />
        <FrutaProcesadaComun :variables="48" :tipo="2" />
        <GraficaEstadoCard
          :variables="[44]"
          :height="200"
          title="Activacion limpieza cepillos"
          :tipo="2"
          :categories="['Limpieza Cepillos']"
        />
        <!-- <GraficaEstadoCard
          :variables="[100]"
          :height="200"
          title="Modos de trabajo"
          :tipo="2"
          :categories="['Modo 1']"
        /> -->
        <GraficaLineaCard
          :variables="[45, 46]"
          :tipo="2"
          title="Cajas por Ciclo y Peso por Caja"
        />
        <GraficaLineaCard
          :variables="[47]"
          :tipo="2"
          title="Cajas/min"
          tipodatos="unidadTiempo"
          labelvar="Cajas/Min"
        />
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
import { obtenerTurnos } from "../../helpers/bd";
import { onMounted, ref } from "vue";
import TablaTotalTurnos from "../../components/tablas/deccodos/TablaTotalTurnos.vue";
// import TablaTotalTurnos from "../../components/tablas/comun/TablaTotalTurnos.vue";
import GraficaLineaCard from "../../components/cards/comun/GraficaLineaCard.vue";
import GraficaEstadoCard from "../../components/cards/comun/GraficaEstadoCard.vue";
import FrutaProcesadaComun from "../../components/cards/comun/FrutaProcesadaComun.vue";
import TablaAlarmas from "../../components/tablas/comun/TablaAlarmas.vue";
import TablaAlarmasTurnos from "../../components/tablas/comun/TablaAlarmasTurnos.vue";
import LoteCliente from "../../components/cards/comun/LoteCliente.vue";
import LoteDecco from "../../components/cards/comun/LoteDecco.vue";

let turnos = ref(true);

let cargado = ref(false);

let turnosA = ref([]);
onMounted(async () => {
  cargado.value = false;
  turnosA.value = await obtenerTurnos(routerStore().clienteID);
  turnos.value = turnosA.value.length > 0 ? true : false;
  cargado.value = true;
});
</script>
