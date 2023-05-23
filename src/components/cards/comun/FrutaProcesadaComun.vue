<template>
  <v-row no-gutters>
    <v-col>
      <v-switch v-model="mostrar" color="info" label="Fruta procesada">
        T Fruta procesada
      </v-switch>
      <v-card v-if="mostrar">
        <v-row no-gutters>
          <v-col v-if="cargado">
            <ApexChart
              ref="chartRef3"
              height="350"
              type="line"
              :options="chartOptions"
              :series="kilos"
            />
          </v-col>
          <v-col v-else class="d-flex justify-center align-center">
            <v-progress-circular
              :size="100"
              :width="7"
              color="purple"
              indeterminate
            ></v-progress-circular>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
export default {
  name: "FrutaProcesada",
};
</script>
<script setup>
import {
  obtenerMaquina,
  obtenerDatosVariableGeneral,
} from "../../../helpers/bd";
import { onMounted, ref, computed, onUnmounted } from "vue";
import es from "apexcharts/dist/locales/es.json";
import io from "socket.io-client";
import moment from "moment";
import { routerStore } from "../../../stores/index";

const socket = io(process.env.VUE_APP_RUTA_API);

const cargado = ref(false);
const mostrar = ref(true);
const kilos = ref([]);

const props = defineProps({
  variables: { type: Number, default: 1 },
  tipo: { type: Number, default: 1 },
});
const chartRef3 = ref(null);
const chartOptions = computed(() => {
  return {
    chart: {
      id: "Kilos",
      group: "actual",
      locales: [es],
      defaultLocale: "es",
      animations: { enabled: false },
      zoom: {
        type: "xy",
        autoScaleYaxis: true,
      },
    },
    xaxis: {
      type: "datetime",
      datetimeUTC: false,
      tickAmount: 25,
      labels: {
        minHeight: 125,
        rotate: -45,
        rotateAlways: true,
        formatter: function (value) {
          return moment.utc(value).format("DD/MM/yyyy HH:mm:ss");
        },
      },
    },
    yaxis: [
      {
        axisTicks: {
          show: true,
        },
        axisBorder: {
          show: true,
        },

        labels: {
          minWidth: 60,
        },
      },
      {
        opposite: true,
        axisTicks: {
          show: true,
        },
        axisBorder: {
          show: true,
        },
      },
    ],
    stroke: {
      width: 1.9,
    },
    legend: {
      showForSingleSeries: true,
    },
  };
});
onMounted(async () => {
  cargado.value = false;

  let maquinaID = (
    await obtenerMaquina("lineaTipo", routerStore().lineasID, props.tipo)
  )[0].id;

  let tKg = await obtenerDatosVariableGeneral(
    "24H",
    "registros",
    "individual",
    "formatoAcumuladores",
    [props.variables],
    maquinaID,
    routerStore().clienteID
  );
  let kilosM = await obtenerDatosVariableGeneral(
    "24H",
    "registros",
    "individual",
    "unidadTiempo",
    [props.variables],
    maquinaID,
    routerStore().clienteID,
    null,
    null,
    "Kg/min"
  );
  tKg.push(...kilosM);
  kilos.value = tKg;
  socket.on(
    `variable_${maquinaID}_${props.variables}_actualizada`,
    async () => {
      let acc = await obtenerDatosVariableGeneral(
        "24H",
        "registros",
        "individual",
        "formatoAcumuladores",
        [props.variables],
        maquinaID,
        routerStore().clienteID
      );
      kilosM = await obtenerDatosVariableGeneral(
        "24H",
        "registros",
        "individual",
        "unidadTiempo",
        [props.total],
        maquinaID,
        routerStore().clienteID
      );
      tKg.push(...kilosM);
      if (chartRef3.value) {
        chartRef3.value.updateSeries(acc);
      }
    }
  );
  cargado.value = true;
});
onUnmounted(() => {
  socket.removeAllListeners();
});
</script>
