<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card
          ><v-row>
            <v-col><v-card-title>Bombas</v-card-title></v-col>
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
  name: "DosisBomba",
};
</script>
<script setup>
import axios from "axios";
import { onMounted, ref, computed, reactive } from "vue";
import es from "apexcharts/dist/locales/es.json";
import io from "socket.io-client";
import moment from "moment";
import { routerStore } from "../../../stores/index";

const socket = io("http://localhost:3000");

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

let cargado = ref(false);
let totales = {};
let tB2 = {};
let tB3 = {};
let tB4 = {};
let tB5 = {};

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
      width: 1.1,
    },
  };
});
onMounted(async () => {
  cargado.value = false;

  totales = await obtenerDatosVariables(
    "8H",
    "registros",
    "sinfiltro",
    [51, 52, 53, 54, 55],
    routerStore().lineasID
  );
  registrosT.value = totales;
  // socket.on("variable_51_actualizada", (data) => {
  //   registrosT.value[0].data.push({
  //     x: new Date(moment(data.x).toISOString()).getTime(),
  //     y: data.y,
  //   });
  //   if (chartRef.value) {
  //     chartRef.value.updateSeries(registrosT.value);
  //     if (lastZoom) chartRef.value.zoomX(lastZoom[0], lastZoom[1]);
  //   }
  // });
  // socket.on("variable_52_actualizada", (data) => {
  //   registrosT.value[1].data.push({
  //     x: new Date(moment(data.x).toISOString()).getTime(),
  //     y: data.y,
  //   });
  //   if (chartRef.value) {
  //     chartRef.value.updateSeries(registrosT.value);
  //     if (lastZoom) chartRef.value.zoomX(lastZoom[0], lastZoom[1]);
  //   }
  // });
  // socket.on("variable_53_actualizada", (data) => {
  //   registrosT.value[2].data.push({
  //     x: new Date(moment(data.x).toISOString()).getTime(),
  //     y: data.y,
  //   });
  //   if (chartRef.value) {
  //     chartRef.value.updateSeries(registrosT.value);
  //     if (lastZoom) chartRef.value.zoomX(lastZoom[0], lastZoom[1]);
  //   }
  // });
  // socket.on("variable_54_actualizada", (data) => {
  //   registrosT.value[3].data.push({
  //     x: new Date(moment(data.x).toISOString()).getTime(),
  //     y: data.y,
  //   });
  //   if (chartRef.value) {
  //     chartRef.value.updateSeries(registrosT.value);
  //     if (lastZoom) chartRef.value.zoomX(lastZoom[0], lastZoom[1]);
  //   }
  // });
  // socket.on("variable_55_actualizada", (data) => {
  //   registrosT.value[4].data.push({
  //     x: new Date(moment(data.x).toISOString()).getTime(),
  //     y: data.y,
  //   });
  //   if (chartRef.value) {
  //     chartRef.value.updateSeries(registrosT.value);
  //     if (lastZoom) chartRef.value.zoomX(lastZoom[0], lastZoom[1]);
  //   }
  // });
  cargado.value = true;
});
</script>
