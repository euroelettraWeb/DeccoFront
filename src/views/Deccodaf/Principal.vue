<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <LoteCliente :tipo="1" />
        <v-switch v-model="turnos" color="info" label="Turnos">Turnos</v-switch>
        <TablaTurnos v-if="turnos" />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-row>
          <v-col>
            <TablaTotalTurnos
              v-if="turnos && turnosA.length > 1"
              :variables="[25, 26, 27, 28, 29, 30]"
              :marcha="[1, 12, 14]"
              :tipo="1"
            />
            <TablaTotal
              v-else
              :variables="[25, 26, 27, 28, 29, 30]"
              :marcha="[1, 12, 14]"
            />
          </v-col>
          <v-col>
            <TablaAlarmasTurnos
              v-if="turnos && turnosA.length > 1"
              :variables="[12, 14, 73, 74, 75]"
              :marcha="[1, 12, 14, 73, 74, 75]"
              :tipo="1"
            />
            <TablaAlarmas
              v-else
              :variables="[12, 14, 73, 74, 75]"
              :marcha="[1, 12, 14, 73, 74, 75]"
              :tipo="1"
            />
          </v-col>
        </v-row>
        <LoteDecco :tipo="1" title="Lote Fungicida" />
        <Estado
          :activo="1"
          :auto-manual="[13, 15]"
          :marcha="[1, 12, 14, 73, 74, 75]"
          :alarma="[12, 14, 73, 74, 75]"
          :tipo="1"
          :categories="[
            'Activo',
            'MarchaParo',
            'Remoto',
            'Manual',
            'Falta de consenso',
          ]"
        />
        <GraficaEstadoCard
          :variables="[12, 73, 74, 75]"
          :height="300"
          title="Alarmas"
          :tipo="1"
          :estados="['', 'Aviso']"
          :categories="[
            'Falta Inicio Ciclo',
            'Tope Palets Alcanzado',
            'Termico Agitador',
            'Fallo Agua',
            'Fallo Aire',
            'Agitador',
          ]"
          :colores="['#00c853', '#d50000']"
        />
        <GraficaLineaCard
          title="Dosis de fungicida"
          :variables="[7, 8, 9, 10, 11]"
          :tipo="1"
        />
        <!-- <div>
           Tabla Reposiciones y consumo por modo
        </div> -->
        <!-- <ModosReposiciones :tipo="1" title="Modo Reposiciones" />
        <GraficaLineaCard title="Reposiciones" :variables="[7]" /> -->
        <FrutaProcesadaComun :variables="48" :tipo="2" />
        <!-- <GraficaEstadoCard
          :variables="[2, 3, 4, 5, 6]"
          :height="300"
          title="Estado de los agitadores"
          :tipo="1"
          :categories="[
            'Agitador Producto 1',
            'Agitador Producto 2',
            'Agitador Producto 3',
            'Agitador Producto 4',
            'Agitador Producto 5',
          ]"
        /> -->
        <GraficaEstadoCard
          :variables="[20, 21, 22, 23, 24]"
          :height="300"
          title="Estado de los niveles de las garrafas"
          :tipo="1"
          :estados="['Aviso', '']"
          :categories="[
            'Nivel Garrafa P1',
            'Nivel Garrafa P2',
            'Nivel Garrafa P3',
            'Nivel Garrafa P4',
            'Nivel Garrafa P5',
            'Flujo de producto P1',
            'Flujo de producto P2',
            'Flujo de producto P3',
            'Flujo de producto P4',
            'Flujo de producto P5',
          ]"
        />
        <TablaNivelesGarrafa />
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
import { obtenerTurnos } from "../../helpers/bd";
import Estado from "../../components/cards/comun/Estado.vue";
import GraficaLineaCard from "../../components/cards/comun/GraficaLineaCard.vue";
import TablaTotal from "../../components/tablas/comun/TablaTotal.vue";
import { onMounted, ref } from "vue";
import TablaTurnos from "../../components/tablas/comun/TablaTurnos.vue";
import TablaTotalTurnos from "../../components/tablas/comun/TablaTotalTurnos.vue";
import FrutaProcesadaComun from "../../components/cards/comun/FrutaProcesadaComun.vue";
import TablaAlarmas from "../../components/tablas/comun/TablaAlarmas.vue";
import TablaAlarmasTurnos from "../../components/tablas/comun/TablaAlarmasTurnos.vue";
import TablaNivelesGarrafa from "../../components/tablas/deccodaf/TablaNivelesGarrafa.vue";
import GraficaEstadoCard from "../../components/cards/comun/GraficaEstadoCard.vue";
import LoteCliente from "../../components/cards/comun/LoteCliente.vue";
import LoteDecco from "../../components/cards/comun/LoteDecco.vue";
import ModosReposiciones from "../../components/cards/deccodaf/ModosReposiciones.vue";

const turnos = ref(true);
const cargado = ref(false);
const turnosA = ref([]);
onMounted(async () => {
  cargado.value = false;
  turnosA.value = await obtenerTurnos(routerStore().clienteID);
  turnos.value = turnosA.value.length > 0 ? true : false;
  cargado.value = true;
});
</script>
