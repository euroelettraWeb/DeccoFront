<template>
  <v-row no-gutters>
    <v-col>
      <v-switch v-model="mostrar" color="info" :label="props.title">
        {{ props.title }}
      </v-switch>
      <v-card v-if="mostrar">
        <v-row no-gutters>
          <v-col v-if="cargado">
            <ApexChart
              ref="chartRef"
              type="rangeBar"
              :height="props.height"
              :options="chartOptions"
              :series="series"
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
  name: "GraficasEstado",
};
</script>
<script setup>
import {
  obtenerMaquina,
  obtenerDatosVariableGeneral,
} from "../../../helpers/bd";
import { onMounted, ref, computed } from "vue";
import es from "apexcharts/dist/locales/es.json";
import io from "socket.io-client";
import moment from "moment";
import { routerStore } from "../../../stores/index";

const socket = io("http://localhost:3000");
const chartRef = ref(null);
var lastZoom = null;
let cargado = ref(false);
let mostrar = ref(true);
let series = ref([]);
let formatoVariables = [];
let chartOptions = computed(() => {
  return {
    chart: {
      type: "rangeBar",
      locales: [es],
      defaultLocale: "es",
      animations: { enabled: false },
      events: {
        beforeResetZoom: function () {
          lastZoom = null;
        },
        zoomed: function (_, value) {
          lastZoom = [value.xaxis.min, value.xaxis.max];
        },
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        rangeBarGroupRows: true,
        barHeight: "50%",
      },
    },
    colors: [
      function ({ value, seriesIndex, w }) {
        if (seriesIndex == 0) {
          return "#d50000";
        } else {
          return "#00c853";
        }
      },
    ],
    xaxis: {
      type: "datetime",
      datetimeUTC: false,
      tickAmount: 20,
      labels: {
        minHeight: 125,
        rotate: -45,
        rotateAlways: true,
        formatter: function (value, timestamp) {
          return moment.utc(value).format("DD/MM/yyyy HH:mm:ss");
        },
      },
    },
    tooltip: {
      x: {
        format: "dd/MM/yyyy HH:mm:ss",
      },
    },
    legend: {
      height: 20,
    },
  };
});

const props = defineProps({
  variables: { type: Array, default: () => [] },
  title: { type: String, default: "" },
  height: { type: Number, default: 300 },
  tipo: { type: Number, default: 1 },
});

onMounted(async () => {
  cargado.value = false;

  let maquinaID = (
    await obtenerMaquina("lineaTipo", routerStore().lineasID, props.tipo)
  )[0].id;

  formatoVariables = await obtenerDatosVariableGeneral(
    "24H",
    "registros",
    "individual",
    "formatoRangos",
    props.variables,
    maquinaID,
    routerStore().clienteID
  );
  series.value = formatoVariables;
  for (let index = 0; index < props.variables.length; index++) {
    socket.on(
      `variable_${maquinaID}_${props.variables[index]}_actualizada`,
      async (data) => {
        let formatoVariable = await obtenerDatosVariableGeneral(
          "24H",
          "registros",
          "individual",
          "formatoRangos",
          props.variables,
          maquinaID,
          routerStore().clienteID
        );
        if (chartRef.value) {
          chartRef.value.updateSeries(formatoVariable);
          if (lastZoom) chartRef.value.zoomX(lastZoom[0], lastZoom[1]);
        }
      }
    );
  }
  cargado.value = true;
});
</script>
