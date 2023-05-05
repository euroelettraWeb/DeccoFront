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
import { onMounted, ref, computed, reactive, onUnmounted } from "vue";
import es from "apexcharts/dist/locales/es.json";
import io from "socket.io-client";
import moment from "moment";
import { routerStore } from "../../../stores/index";

const socket = io("http://localhost:3000");

let cargado = ref(false);
let mostrar = ref(true);
let tKg = {};
let kilosM = {};

const props = defineProps({
  fruta: { type: Number, default: 1 },
  tipo: { type: Number, default: 1 },
});
const chartRef3 = ref(null);
let kilos = ref([]);
var lastZoom = null;
let chartOptions = computed(() => {
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
        formatter: function (value, timestamp) {
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

  tKg = await obtenerDatosVariableGeneral(
    "24H",
    "registros",
    "individual",
    "formatoAcumuladores",
    [props.fruta],
    maquinaID,
    routerStore().clienteID
  );
  kilosM = await obtenerDatosVariableGeneral(
    "24H",
    "registros",
    "individual",
    "unidadTiempo",
    [props.fruta],
    maquinaID,
    routerStore().clienteID,
    null,
    null,
    "Kg/min"
  );
  tKg.push(...kilosM);
  kilos.value = tKg;
  socket.on(
    `variable_${maquinaID}_${props.fruta}_actualizada`,
    async (data) => {
      let acc = await obtenerDatosVariableGeneral(
        "24H",
        "registros",
        "individual",
        "formatoAcumuladores",
        [props.fruta],
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
        // if (lastZoom) chartRef2.value.zoomX(lastZoom[0], lastZoom[1]);
      }
    }
  );
  cargado.value = true;
});
onUnmounted(() => {
  socket.disconnect();
});
</script>
