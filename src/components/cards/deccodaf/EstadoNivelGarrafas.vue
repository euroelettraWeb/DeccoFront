<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card>
          <v-row
            ><v-col><v-card-title>Niveles garrafas</v-card-title></v-col>
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
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  name: "EstadoNivelGarrafas",
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
  if (ultimoValor[index]) {
    if (ultimoValor[index].y != 0) {
      series.value[data.y].data[series.value[data.y].data.length - 1].y[1] =
        new Date(data.x).getTime();
    }
  } else {
    if (data.y != 0) {
      series.value[index].data.push({
        x: nameX,
        y: [new Date(data.x).getTime(), new Date(data.x).getTime() + 1000],
      });
    }
  }
  ultimoValor[index].x = data.x;
  ultimoValor[index].y = data.y;

  if (chartRef.value) {
    chartRef.value.updateSeries(series.value);
    if (lastZoom) chartRef.value.zoomX(lastZoom[0], lastZoom[1]);
  }
}

const socket = io("http://localhost:3000");
const chartRef = ref(null);
var lastZoom = null;
let cargado = ref(false);
let nP1 = [];
let nP2 = [];
let nP3 = [];
let nP4 = [];
let nP5 = [];
let series = ref([]);
let ultimoValor = [
  { x: 1, y: 1 },
  { x: 1, y: 1 },
  { x: 1, y: 1 },
  { x: 1, y: 1 },
  { x: 1, y: 1 },
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
  nP1 = await obtenerDatosVariable("8h", "registros", "rangos", 20);
  nP2 = await obtenerDatosVariable("8h", "registros", "rangos", 21);
  nP3 = await obtenerDatosVariable("8h", "registros", "rangos", 22);
  nP4 = await obtenerDatosVariable("8h", "registros", "rangos", 23);
  nP5 = await obtenerDatosVariable("8h", "registros", "rangos", 24);

  series.value = [
    { name: "Nivel P1", data: range("Nivel P1", nP1.registros) },
    { name: "Nivel P2", data: range("Nivel P2", nP2.registros) },
    { name: "Nivel P3", data: range("Nivel P3", nP3.registros) },
    {
      name: "Nivel P4",
      data: range("Nivel P4", nP4.registros),
    },
    { name: "Nivel P5", data: range("Nivel P5", nP5.registros) },
  ];
  ultimoValor = [
    {
      x: series.value[0].data[series.value[0].data.length - 1].y[1],
      y: 1,
    },
    {
      x: series.value[1].data[series.value[1].data.length - 1].y[1],
      y: 1,
    },
    {
      x: series.value[2].data[series.value[2].data.length - 1].y[1],
      y: 1,
    },
    {
      x: series.value[3].data[series.value[3].data.length - 1].y[1],
      y: 1,
    },
    {
      x: series.value[4].data[series.value[4].data.length - 1].y[1],
      y: 1,
    },
  ];
  socket.on("variable_20_actualizada", (data) => {
    updateValue(series, data, chartRef, lastZoom, 0, "Nivel P1");
  });
  socket.on("variable_21_actualizada", (data) => {
    updateValue(series, data, chartRef, lastZoom, 1, "Nivel P2");
  });
  socket.on("variable_22_actualizada", (data) => {
    updateValue(series, data, chartRef, lastZoom, 2, "Nivel P3");
  });
  socket.on("variable_23_actualizada", (data) => {
    updateValue(series, data, chartRef, lastZoom, 3, "Nivel P4");
  });
  socket.on("variable_24_actualizada", (data) => {
    updateValue(series, data, chartRef, lastZoom, 4, "Nivel P5");
  });
  cargado.value = true;
});
</script>
