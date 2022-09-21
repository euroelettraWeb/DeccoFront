<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card>
          <LineChart
            v-if="cargado"
            ref="chartRef"
            :data="registrosT"
            :options="chartOptions"
          />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  name: "TotalesDAF",
};
</script>
<script setup>
import axios from "axios";
import { onMounted, ref, computed, reactive } from "vue";
import LineChart from "../../graficas-modelo/apexChartJs/LineChart.vue";
import es from "apexcharts/dist/locales/es.json";
import io from "socket.io-client";
import moment from "moment";
const socket = io("http://localhost:3000");

async function obtenerDatosVariable(operacion, modo, filtrado, variableID) {
  return (
    await axios.get(
      `${process.env.VUE_APP_RUTA_API}/variable/${operacion}/${modo}/${filtrado}/${variableID}`
    )
  ).data;
}

function formatData(name, arrays) {
  let data = [];
  for (let variable of arrays) {
    let obj = { x: new Date(variable.x).getTime(), y: variable.y };
    data.push(obj);
  }
  return { name: name, data: data };
}
let cargado = ref(false);
let tAgua = {};
let tP1 = {};
let tP2 = {};
let tP3 = {};
let tp4 = {};
let tp5 = {};

const chartRef = ref(null);
let registrosT = ref([]);
var lastZoom = null;
let chartOptions = {
  chart: {
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
  xaxis: {
    type: "datetime",
    datetimeUTC: false,
  },
  stroke: {
    width: 1.9,
  },
};

onMounted(async () => {
  cargado.value = false;
  tAgua = await obtenerDatosVariable("8h", "registros", "sinfiltro", 25);
  tP1 = await obtenerDatosVariable("8h", "registros", "sinfiltro", 26);
  tP2 = await obtenerDatosVariable("8h", "registros", "sinfiltro", 27);
  tP3 = await obtenerDatosVariable("8h", "registros", "sinfiltro", 28);
  tp4 = await obtenerDatosVariable("8h", "registros", "sinfiltro", 29);
  tp5 = await obtenerDatosVariable("8h", "registros", "sinfiltro", 30);
  registrosT.value = [
    formatData("Agua", tAgua.registros),
    formatData("Producto 1", tP1.registros),
    formatData("Producto 2", tP2.registros),
    formatData("Producto 3", tP3.registros),
    formatData("Producto 4", tp4.registros),
    formatData("Producto 5", tp5.registros),
  ];

  socket.on("variable_25_actualizada", (data) => {
    registrosT.value[0].data.push({
      x: new Date(moment(data.x).toISOString()).getTime(),
      y: data.y,
    });
    chartRef.value.chart.updateSeries(registrosT.value);
    if (lastZoom) chartRef.value.chart.zoomX(lastZoom[0], lastZoom[1]);
  });
  socket.on("variable_26_actualizada", (data) => {
    registrosT.value[1].data.push({
      x: new Date(moment(data.x).toISOString()).getTime(),
      y: data.y,
    });
    chartRef.value.chart.updateSeries(registrosT.value);
    if (lastZoom) chartRef.value.chart.zoomX(lastZoom[0], lastZoom[1]);
  });
  socket.on("variable_27_actualizada", (data) => {
    registrosT.value[2].data.push({
      x: new Date(moment(data.x).toISOString()).getTime(),
      y: data.y,
    });
    chartRef.value.chart.updateSeries(registrosT.value);
    if (lastZoom) chartRef.value.chart.zoomX(lastZoom[0], lastZoom[1]);
  });
  socket.on("variable_28_actualizada", (data) => {
    registrosT.value[3].data.push({
      x: new Date(moment(data.x).toISOString()).getTime(),
      y: data.y,
    });
    chartRef.value.chart.updateSeries(registrosT.value);
    if (lastZoom) chartRef.value.chart.zoomX(lastZoom[0], lastZoom[1]);
  });
  socket.on("variable_29_actualizada", (data) => {
    registrosT.value[4].data.push({
      x: new Date(moment(data.x).toISOString()).getTime(),
      y: data.y,
    });
    chartRef.value.chart.updateSeries(registrosT.value);
    if (lastZoom) chartRef.value.chart.zoomX(lastZoom[0], lastZoom[1]);
  });
  socket.on("variable_30_actualizada", (data) => {
    registrosT.value[5].data.push({
      x: new Date(moment(data.x).toISOString()).getTime(),
      y: data.y,
    });
    chartRef.value.chart.updateSeries(registrosT.value);
    if (lastZoom) chartRef.value.chart.zoomX(lastZoom[0], lastZoom[1]);
  });
  cargado.value = true;
});
</script>
