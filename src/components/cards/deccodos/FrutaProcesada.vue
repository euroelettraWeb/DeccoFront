<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card class="mb-2"
          ><v-row>
            <v-col>
              <v-card-subtitle>
                Cajas por Ciclo y Peso por Caja
              </v-card-subtitle>
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
        <v-card class="mb-2">
          <v-row>
            <v-col>
              <v-card-subtitle> Total Cajas </v-card-subtitle>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <ApexChart
                v-if="cargado"
                ref="chartRef2"
                height="350"
                type="line"
                :options="chartOptions"
                :series="cajas"
              />
            </v-col> </v-row
        ></v-card>
        <v-card>
          <v-row>
            <v-col>
              <v-card-title> Fruta procesada </v-card-title>
              <v-card-subtitle> Total Kilos </v-card-subtitle>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <ApexChart
                v-if="cargado"
                ref="chartRef3"
                height="350"
                type="line"
                :options="chartOptions"
                :series="kilos"
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
  name: "FrutaProcesada",
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
let cajaPCiclo = {};
let kgPCaja = {};
let tCajas = {};
let tKg = {};

const chartRef = ref(null);
const chartRef2 = ref(null);
const chartRef3 = ref(null);
let registrosT = ref([]);
let cajas = ref([]);
let kilos = ref([]);
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
    legend: {
      showForSingleSeries: true,
    },
  };
});
onMounted(async () => {
  cargado.value = false;
  cajaPCiclo = await obtenerDatosVariable(
    "8h",
    "registros",
    "formatoLinea",
    45
  );
  kgPCaja = await obtenerDatosVariable("8h", "registros", "formatoLinea", 46);
  tCajas = await obtenerDatosVariable("8h", "registros", "formatoLinea", 47);
  tKg = await obtenerDatosVariable("8h", "registros", "formatoLinea", 48);
  registrosT.value = [cajaPCiclo.registros[0], kgPCaja.registros[0]];
  cajas.value = tCajas.registros;
  kilos.value = tKg.registros;
  // socket.on("variable_45_actualizada", (data) => {
  //   registrosT.value[0].data.push({
  //     x: new Date(moment(data.x).toISOString()).getTime(),
  //     y: data.y,
  //   });
  //   if (chartRef.value) {
  //     chartRef.value.updateSeries(registrosT.value);
  //     if (lastZoom) chartRef.value.zoomX(lastZoom[0], lastZoom[1]);
  //   }
  // });
  // socket.on("variable_46_actualizada", (data) => {
  //   registrosT.value[1].data.push({
  //     x: new Date(moment(data.x).toISOString()).getTime(),
  //     y: data.y,
  //   });
  //   if (chartRef.value) {
  //     chartRef.value.updateSeries(registrosT.value);
  //     if (lastZoom) chartRef.value.zoomX(lastZoom[0], lastZoom[1]);
  //   }
  // });
  // socket.on("variable_47_actualizada", (data) => {
  //   registrosT.value[0].data.push({
  //     x: new Date(moment(data.x).toISOString()).getTime(),
  //     y: data.y,
  //   });
  //   if (chartRef.value) {
  //     chartRef.value.updateSeries(registrosT.value);
  //     if (lastZoom) chartRef.value.zoomX(lastZoom[0], lastZoom[1]);
  //   }
  // });
  // socket.on("variable_48_actualizada", (data) => {
  //   registrosT.value[1].data.push({
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
