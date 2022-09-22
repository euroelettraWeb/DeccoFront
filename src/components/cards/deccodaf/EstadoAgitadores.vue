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

async function obtenerDatosVariable(operacion, modo, filtrado, variableID) {
  return (
    await axios.get(
      `${process.env.VUE_APP_RUTA_API}/variable/${operacion}/${modo}/${filtrado}/${variableID}`
    )
  ).data;
}
function range(rangeName, array) {
  let returnt = [];
  for (let index = 0; index < array.length; index++) {
    const element = array[index];
    let startR = new Date(element.x).getTime();
    let endR = new Date(element.y).getTime();
    let obj = { x: rangeName, y: [startR, endR] };
    returnt.push(obj);
  }
  return returnt;
}

function updateValue(series, data, chartRef, lastZoom, index, nameX) {
  series.value[index].data.push({
    x: nameX,
    y: [
      new Date(moment(data.x).toISOString()).getTime(),
      new Date(moment(data.x).toISOString()).getTime() + 1000,
    ],
  });
  if (chartRef.value) {
    chartRef.value.updateSeries(series.value);
    if (lastZoom) chartRef.value.zoomX(lastZoom[0], lastZoom[1]);
  }
}

const socket = io("http://localhost:3000");
const chartRef = ref(null);
var lastZoom = null;
let cargado = ref(false);
let agP1 = [];
let agP2 = [];
let agP3 = [];
let agP4 = [];
let agP5 = [];
let series = ref([]);

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
        barHeight: "100%",
      },
    },
    xaxis: {
      type: "datetime",
      datetimeUTC: false,
      min: new Date(moment().subtract(8, "hours")).getTime(),
      max: moment(),
    },
    yaxis: {
      show: false,
      minWidth: 1,
      axisTicks: {
        width: 1,
      },
    },
    tooltip: {
      x: {
        format: "dd MMM yyyy hh:mm:ss",
      },
    },
  };
});
onMounted(async () => {
  cargado.value = false;
  agP1 = await obtenerDatosVariable("8h", "registros", "rangos", 2);
  agP2 = await obtenerDatosVariable("8h", "registros", "rangos", 3);
  agP3 = await obtenerDatosVariable("8h", "registros", "rangos", 4);
  agP4 = await obtenerDatosVariable("8h", "registros", "rangos", 5);
  agP5 = await obtenerDatosVariable("8h", "registros", "rangos", 6);

  series.value = [
    { name: "Agitador P1", data: range("Agitador P1", agP1.registros) },
    { name: "Agitador P2", data: range("Agitador P2", agP2.registros) },
    { name: "Agitador P3", data: range("Agitador P3", agP3.registros) },
    {
      name: "Agitador P4",
      data: range("Agitador P4", agP4.registros),
    },
    { name: "Agitador P5", data: range("Agitador P5", agP5.registros) },
  ];
  socket.on("variable_2_actualizada", (data) => {
    updateValue(series, data, chartRef, lastZoom, 0, "Agitador P1");
  });
  socket.on("variable_3_actualizada", (data) => {
    updateValue(series, data, chartRef, lastZoom, 1, "Agitador P2");
  });
  socket.on("variable_4_actualizada", (data) => {
    updateValue(series, data, chartRef, lastZoom, 2, "Agitador P3");
  });
  socket.on("variable_5_actualizada", (data) => {
    updateValue(series, data, chartRef, lastZoom, 3, "Agitador P4");
  });
  socket.on("variable_6_actualizada", (data) => {
    updateValue(series, data, chartRef, lastZoom, 4, "Agitador P5");
  });
  cargado.value = true;
});
</script>
