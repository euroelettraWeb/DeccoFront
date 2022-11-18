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
  name: "TotalesWasher",
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

async function idMaquinaActual(linea, grupoID) {
  let lineas = (
    await axios.get(`${process.env.VUE_APP_RUTA_API}/maquinas/linea/${linea}/0`)
  ).data;
  return lineas.find((maquina) => maquina.grupoID == grupoID).id;
}
let cargado = ref(false);
let totales = {};
let tDes = {};
let tJabon = {};

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
  let maquinaID = await idMaquinaActual(routerStore().lineasID, 1);
  totales = await obtenerDatosVariables(
    "8H",
    "registros",
    "formatoLinea",
    [70, 71, 71],
    maquinaID
  );

  registrosT.value = totales;

  // socket.on("variable_70_actualizada", (data) => {
  //   registrosT.value[0].data.push({
  //     x: new Date(moment(data.x).toISOString()).getTime(),
  //     y: data.y,
  //   });
  //   if (chartRef.value) {
  //     chartRef.value.updateSeries(registrosT.value);
  //     if (lastZoom) chartRef.value.zoomX(lastZoom[0], lastZoom[1]);
  //   }
  // });
  // socket.on("variable_71_actualizada", (data) => {
  //   registrosT.value[1].data.push({
  //     x: new Date(moment(data.x).toISOString()).getTime(),
  //     y: data.y,
  //   });
  //   if (chartRef.value) {
  //     chartRef.value.updateSeries(registrosT.value);
  //     if (lastZoom) chartRef.value.zoomX(lastZoom[0], lastZoom[1]);
  //   }
  // });
  // socket.on("variable_72_actualizada", (data) => {
  //   registrosT.value[2].data.push({
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
