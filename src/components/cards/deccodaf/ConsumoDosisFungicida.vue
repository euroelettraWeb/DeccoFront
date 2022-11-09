<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card
          ><v-row>
            <v-col>
              <v-card-title> Dosis de fungicida </v-card-title>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <ApexChart
                v-if="cargado"
                ref="chartRef"
                height="350"
                type="line"
                :options="chartOptions"
                :series="registrosT"
              />
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  name: "DosisFungicida",
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

let cargado = ref(false);
let tP1 = {};
let tP2 = {};
let tP3 = {};
let tP4 = {};
let tP5 = {};

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
      tickAmount: 15,
      labels: {
        minHeight: 125,
        rotate: -70,
        rotateAlways: true,
        formatter: function (value, timestamp) {
          return moment.utc(value).format("DD/MM/yyyy HH:mm:ss"); // The formatter function overrides format property
        },
      },
    },
    stroke: {
      width: 1.9,
    },
  };
});
onMounted(async () => {
  cargado.value = false;
  tP1 = await obtenerDatosVariable("8h", "registros", "formatoLinea", 7);
  tP2 = await obtenerDatosVariable("8h", "registros", "formatoLinea", 8);
  tP3 = await obtenerDatosVariable("8h", "registros", "formatoLinea", 9);
  tP4 = await obtenerDatosVariable("8h", "registros", "formatoLinea", 10);
  tP5 = await obtenerDatosVariable("8h", "registros", "formatoLinea", 11);
  registrosT.value = [
    tP1.registros[0],
    tP2.registros[0],
    tP3.registros[0],
    tP4.registros[0],
    tP5.registros[0],
  ];
  socket.on("variable_7_actualizada", (data) => {
    registrosT.value[0].data.push({
      x: new Date(moment(data.x).toISOString()).getTime(),
      y: data.y,
    });
    if (chartRef.value) {
      chartRef.value.updateSeries(registrosT.value);
      if (lastZoom) chartRef.value.zoomX(lastZoom[0], lastZoom[1]);
    }
  });
  socket.on("variable_8_actualizada", (data) => {
    registrosT.value[1].data.push({
      x: new Date(moment(data.x).toISOString()).getTime(),
      y: data.y,
    });
    if (chartRef.value) {
      chartRef.value.updateSeries(registrosT.value);
      if (lastZoom) chartRef.value.zoomX(lastZoom[0], lastZoom[1]);
    }
  });
  socket.on("variable_9_actualizada", (data) => {
    registrosT.value[2].data.push({
      x: new Date(moment(data.x).toISOString()).getTime(),
      y: data.y,
    });
    if (chartRef.value) {
      chartRef.value.updateSeries(registrosT.value);
      if (lastZoom) chartRef.value.zoomX(lastZoom[0], lastZoom[1]);
    }
  });
  socket.on("variable_10_actualizada", (data) => {
    registrosT.value[3].data.push({
      x: new Date(moment(data.x).toISOString()).getTime(),
      y: data.y,
    });
    if (chartRef.value) {
      chartRef.value.updateSeries(registrosT.value);
      if (lastZoom) chartRef.value.zoomX(lastZoom[0], lastZoom[1]);
    }
  });
  socket.on("variable_11_actualizada", (data) => {
    registrosT.value[4].data.push({
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
