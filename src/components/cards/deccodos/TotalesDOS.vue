<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card>
          <ApexChart
            v-if="cargado"
            ref="chartRef"
            height="350"
            type="line"
            :options="chartOptions"
            :series="registrosT"
          ></ApexChart>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  name: "TotalesDOS",
};
</script>
<script setup>
import axios from "axios";
import { onMounted, ref, computed, reactive } from "vue";
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
let tA2D = {};
let tA3D = {};
let tB1 = {};
let tB2 = {};
let tB3 = {};
let tB4 = {};
let tB5 = {};
let tCera = {};

const chartRef = ref(null);
let registrosT = ref([]);
var lastZoom = null;
let chartOptions = computed(() => {
  return {
    chart: {
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
    xaxis: {
      type: "datetime",
      datetimeUTC: false,
      min: new Date(moment().subtract(8, "hours")).getTime(),
      max: moment(),
    },
    stroke: {
      width: 1.9,
    },
  };
});
onMounted(async () => {
  cargado.value = false;
  tA2D = await obtenerDatosVariable("8h", "registros", "sinfiltro", 49);
  tA3D = await obtenerDatosVariable("8h", "registros", "sinfiltro", 50);
  tB1 = await obtenerDatosVariable("8h", "registros", "sinfiltro", 51);
  tB2 = await obtenerDatosVariable("8h", "registros", "sinfiltro", 52);
  tB3 = await obtenerDatosVariable("8h", "registros", "sinfiltro", 53);
  tB4 = await obtenerDatosVariable("8h", "registros", "sinfiltro", 54);
  tB5 = await obtenerDatosVariable("8h", "registros", "sinfiltro", 55);
  tCera = await obtenerDatosVariable("8h", "registros", "sinfiltro", 56);
  registrosT.value = [
    formatData("Aplicador 2", tA2D.registros),
    formatData("Aplicador 3", tA3D.registros),
    formatData("Bomba 1", tB1.registros),
    formatData("Bomba 2", tB2.registros),
    formatData("Bomba 3", tB3.registros),
    formatData("Bomba 4", tB4.registros),
    formatData("Bomba 5", tB5.registros),
    formatData("Cera", tCera.registros),
  ];

  socket.on("variable_49_actualizada", (data) => {
    registrosT.value[0].data.push({
      x: new Date(moment(data.x).toISOString()).getTime(),
      y: data.y,
    });
    if (chartRef.value) {
      chartRef.value.updateSeries(registrosT.value);
      if (lastZoom) chartRef.value.zoomX(lastZoom[0], lastZoom[1]);
    }
  });
  socket.on("variable_50_actualizada", (data) => {
    registrosT.value[1].data.push({
      x: new Date(moment(data.x).toISOString()).getTime(),
      y: data.y,
    });
    if (chartRef.value) {
      chartRef.value.updateSeries(registrosT.value);
      if (lastZoom) chartRef.value.zoomX(lastZoom[0], lastZoom[1]);
    }
  });
  socket.on("variable_51_actualizada", (data) => {
    registrosT.value[2].data.push({
      x: new Date(moment(data.x).toISOString()).getTime(),
      y: data.y,
    });
    if (chartRef.value) {
      chartRef.value.updateSeries(registrosT.value);
      if (lastZoom) chartRef.value.zoomX(lastZoom[0], lastZoom[1]);
    }
  });
  socket.on("variable_52_actualizada", (data) => {
    registrosT.value[3].data.push({
      x: new Date(moment(data.x).toISOString()).getTime(),
      y: data.y,
    });
    if (chartRef.value) {
      chartRef.value.updateSeries(registrosT.value);
      if (lastZoom) chartRef.value.zoomX(lastZoom[0], lastZoom[1]);
    }
  });
  socket.on("variable_53_actualizada", (data) => {
    registrosT.value[4].data.push({
      x: new Date(moment(data.x).toISOString()).getTime(),
      y: data.y,
    });
    if (chartRef.value) {
      chartRef.value.updateSeries(registrosT.value);
      if (lastZoom) chartRef.value.zoomX(lastZoom[0], lastZoom[1]);
    }
  });
  socket.on("variable_54_actualizada", (data) => {
    registrosT.value[5].data.push({
      x: new Date(moment(data.x).toISOString()).getTime(),
      y: data.y,
    });
    if (chartRef.value) {
      chartRef.value.updateSeries(registrosT.value);
      if (lastZoom) chartRef.value.zoomX(lastZoom[0], lastZoom[1]);
    }
  });
  socket.on("variable_55_actualizada", (data) => {
    registrosT.value[6].data.push({
      x: new Date(moment(data.x).toISOString()).getTime(),
      y: data.y,
    });
    if (chartRef.value) {
      chartRef.value.updateSeries(registrosT.value);
      if (lastZoom) chartRef.value.zoomX(lastZoom[0], lastZoom[1]);
    }
  });
  socket.on("variable_56_actualizada", (data) => {
    registrosT.value[7].data.push({
      x: new Date(moment(data.x).toISOString()).getTime(),
      y: data.y,
    });
    if (chartRef.value) {
      chartRef.value.updateSeries(registrosT.value);
      if (lastZoom) chartRef.value.zoomX(lastZoom[0], lastZoom[1]);
    }
  });
  cargado.value = true;
});
</script>
