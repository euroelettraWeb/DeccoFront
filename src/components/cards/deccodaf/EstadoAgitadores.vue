<template>
  <v-container
    ><v-row>
      <v-col>
        <v-card>
          <v-row>
            <v-col><v-card-title>Agitadores</v-card-title></v-col>
          </v-row>
          <v-row>
            <v-col v-if="cargado">
              <ApexChart
                ref="chartRef"
                type="rangeBar"
                height="300"
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
            </v-col> </v-row
        ></v-card>
      </v-col> </v-row
  ></v-container>
</template>
<script>
export default {
  name: "EstadoAgitadores",
};
</script>
<script setup>
import axios from "axios";
import { onMounted, ref, computed } from "vue";
import es from "apexcharts/dist/locales/es.json";
import io from "socket.io-client";
import moment from "moment";
import { routerStore } from "../../../stores/index";

async function obtenerDatosVariables(
  operacion,
  modo,
  filtrado,
  variables,
  maquinaID
) {
  return (
    await axios.post(
      `${process.env.VUE_APP_RUTA_API}/variable/multiple/${operacion}/${modo}/${filtrado}/`,
      { variables, maquinaID }
    )
  ).data;
}

// function range(rangeName, array) {
//   let returnt = [];
//   for (let index = 0; index < array.length; index++) {
//     const element = array[index];
//     let startR = new Date(element.x).getTime();
//     let endR = new Date(element.y).getTime();
//     let obj = { x: rangeName, y: [startR, endR] };
//     returnt.push(obj);
//   }
//   return returnt;
// }

function updateValue(series, data, chartRef, lastZoom, index, nameX) {
  let start = ultimoValor[index].start;
  let end = ultimoValor[index].end;

  if (start == null) {
    if (data.y !== 0) {
      ultimoValor[index].start = { x: data.x, y: data.y };
    }
  } else {
    if (data.y == 0) {
      if (end == null) {
        series.value[index].data.push({
          x: nameX,
          y: [new Date(start.x).getTime(), new Date(data.x).getTime() + 1000],
        });
      } else {
        if (end.y !== 0) {
          series.value[index].data.push({
            x: nameX,
            y: [new Date(start.x).getTime(), new Date(end.x).getTime()],
          });
        } else {
          series.value[index].data[series.value[index].data.length - 1].y[1] =
            new Date(data.x).getTime();
        }
      }
      ultimoValor[index].start = null;
      ultimoValor[index].end = null;
    } else {
      series.value[index].data[series.value[index].data.length - 1].y[1] =
        new Date(data.x).getTime();
      ultimoValor[index].end = { x: data.x, y: data.y };
    }
  }

  if (chartRef.value) {
    chartRef.value.updateSeries(series.value);
    if (lastZoom) chartRef.value.zoomX(lastZoom[0], lastZoom[1]);
  }
}

const socket = io("http://localhost:3000");
const chartRef = ref(null);
var lastZoom = null;
let cargado = ref(false);
let agitadores = [];
let series = ref([]);
let ultimoValor = [
  { start: { x: 1, y: 1 }, end: { x: 1, y: 1 } },
  { start: { x: 1, y: 1 }, end: { x: 1, y: 1 } },
  { start: { x: 1, y: 1 }, end: { x: 1, y: 1 } },
  { start: { x: 1, y: 1 }, end: { x: 1, y: 1 } },
  { start: { x: 1, y: 1 }, end: { x: 1, y: 1 } },
];

let chartOptions = computed(() => {
  return {
    chart: {
      height: "100%",
      type: "rangeBar",
      locales: [es],
      defaultLocale: "es",
      animations: { enabled: false },
      events: {
        beforeZoom: (e, { xaxis }) => {
          if (moment(xaxis.min).isBefore(moment().subtract(8, "hours"))) {
            return {
              xaxis: {
                min: new Date(moment().subtract(8, "hours")).getTime(),
                max: xaxis.max,
              },
            };
          }
          if (moment(xaxis.max).isAfter(moment())) {
            return {
              xaxis: {
                min: xaxis.min,
                max: moment(),
              },
            };
          }
        },
        beforeResetZoom: function () {
          lastZoom = null;
          return {
            xaxis: {
              min: new Date(moment().subtract(8, "hours")).getTime(),
              max: moment(),
            },
          };
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
        barHeight: "100%",
      },
    },
    xaxis: {
      type: "datetime",
      datetimeUTC: false,
      min: new Date(moment().subtract(8, "hours")).getTime(),
      max: moment(),
      tickAmount: 15,
      labels: {
        minHeight: 125,
        rotate: -70,
        minHeight: 125,
        rotateAlways: true,
        formatter: function (value, timestamp) {
          return moment.utc(value).format("DD/MM/yyyy HH:mm:ss"); // The formatter function overrides format property
        },
      },
    },
    yaxis: {
      minWidth: 1,
      axisTicks: {
        width: 1,
      },
    },
    tooltip: {
      x: {
        format: "dd/MM/yyyy HH:mm:ss",
      },
    },
  };
});
onMounted(async () => {
  cargado.value = false;

  agitadores = await obtenerDatosVariables(
    "8H",
    "registros",
    "formatoRangos",
    [2, 3, 4, 5, 6],
    routerStore().lineasID
  );

  series.value = agitadores;
  // ultimoValor = [
  //   {
  //     start: {
  //       x: series.value[0].data[series.value[0].data.length - 1].y[1],
  //       y: 1,
  //     },
  //     end: {
  //       x: series.value[0].data[series.value[0].data.length - 1].y[1],
  //       y: 1,
  //     },
  //   },
  //   {
  //     start: {
  //       x: series.value[1].data[series.value[1].data.length - 1].y[1],
  //       y: 1,
  //     },
  //     end: {
  //       x: series.value[1].data[series.value[1].data.length - 1].y[1],
  //       y: 1,
  //     },
  //   },
  //   {
  //     start: {
  //       x: series.value[2].data[series.value[2].data.length - 1].y[1],
  //       y: 1,
  //     },
  //     end: {
  //       x: series.value[2].data[series.value[2].data.length - 1].y[1],
  //       y: 1,
  //     },
  //   },
  //   {
  //     start: {
  //       x: series.value[3].data[series.value[3].data.length - 1].y[1],
  //       y: 1,
  //     },
  //     end: {
  //       x: series.value[3].data[series.value[3].data.length - 1].y[1],
  //       y: 1,
  //     },
  //   },
  //   {
  //     start: {
  //       x: series.value[4].data[series.value[4].data.length - 1].y[1],
  //       y: 1,
  //     },
  //     end: {
  //       x: series.value[4].data[series.value[4].data.length - 1].y[1],
  //       y: 1,
  //     },
  //   },
  // ];
  // socket.on("variable_2_actualizada", (data) => {
  //   updateValue(series, data, chartRef, lastZoom, 0, "Agitador P1");
  // });
  // socket.on("variable_3_actualizada", (data) => {
  //   updateValue(series, data, chartRef, lastZoom, 1, "Agitador P2");
  // });
  // socket.on("variable_4_actualizada", (data) => {
  //   updateValue(series, data, chartRef, lastZoom, 2, "Agitador P3");
  // });
  // socket.on("variable_5_actualizada", (data) => {
  //   updateValue(series, data, chartRef, lastZoom, 3, "Agitador P4");
  // });
  // socket.on("variable_6_actualizada", (data) => {
  //   updateValue(series, data, chartRef, lastZoom, 4, "Agitador P5");
  // });
  cargado.value = true;
});
</script>
