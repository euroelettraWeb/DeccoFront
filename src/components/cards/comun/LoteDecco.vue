<template>
  <v-row>
    <v-col>
      <v-switch v-model="mostrar" color="info" :label="props.title">
        {{ props.title }}
      </v-switch>
      <v-card v-if="mostrar">
        <v-row>
          <v-col v-if="cargado">
            <ApexChart
              ref="chartRef"
              type="rangeBar"
              :height="300"
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
            ></v-progress-circular> </v-col></v-row
      ></v-card> </v-col
  ></v-row>
</template>
<script>
export default {
  name: "LoteDecco",
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

const socket = io("http://localhost:3000");

const cargado = ref(false);
const mostrar = ref(true);

const series = ref([]);

let chartOptions = computed(() => {
  return {
    chart: {
      id: "Product",
      // group: "actual",
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
          return "#f0ec07";
        } else {
          return "#00c853";
        }
      },
    ],
    xaxis: {
      type: "datetime",
      datetimeUTC: false,
      tickAmount: 20,
      // categories: props.categories,
      labels: {
        minHeight: 125,
        rotate: -45,
        rotateAlways: true,
        formatter: function (value, timestamp) {
          return moment.utc(value).format("DD/MM/yyyy HH:mm:ss");
        },
      },
    },
    yaxis: {
      labels: {
        minWidth: 60,
      },
    },
    tooltip: {
      x: {
        format: "dd/MM/yyyy HH:mm:ss",
      },
      y: {
        title: {
          formatter: (seriesName) => "",
        },
      },
    },
    legend: {
      show: false,
    },
  };
});

const props = defineProps({
  tipo: { type: Number, default: 1 },
  title: { type: String, default: "" },
});
onMounted(async () => {
  cargado.value = false;
  let maquinaID = (
    await obtenerMaquina("lineaTipo", routerStore().lineasID, props.tipo)
  )[0].id;
  //TODO asignar valores de prueba
  // let serie = [
  //   {
  //     name: "Producto",
  //     data: [
  //       {
  //         x: "Product 1",
  //         y: [1694353200000, 1694373200000],
  //         fillColor: "#ff8000",
  //       },

  //       {
  //         x: "PRD1",
  //         y: [1694364800000, 1694378000000],
  //       },

  //       {
  //         x: "Product 2",
  //         y: [1694356800000, 1694375000000],
  //         fillColor: "#ff8000",
  //       },
  //       {
  //         x: "PRD2",
  //         y: [1694358000000, 1694376800000],
  //       },
  //       {
  //         x: "Product 3",
  //         y: [1694360400000, 1694375600000],
  //         fillColor: "#ff8000",
  //       },
  //       {
  //         x: "PRD3",
  //         y: [1694360400000, 1694375600000],
  //       },
  //     ],
  //   },
  // ];
  let serie = obtenerDatosVariableGeneral(
    "24H",
    "registrosYZ",
    "individual",
    "totalZValor",
    [82, 83],
    maquinaID,
    routerStore().clienteID
  );
  series.value = serie;
  socket.on(
    `variable_${maquinaID}_${props.variable}_actualizada`,
    async (data) => {
      let loteFruta = await obtenerDatosVariableGeneral(
        "24H",
        "ultimo",
        "individual",
        "sinfiltro",
        [props.variable],
        maquinaID,
        routerStore().clienteID
      );
      lote.value = loteFruta;
    }
  );
  cargado.value = true;
});
onUnmounted(() => {
  socket.removeAllListeners();
});
</script>
