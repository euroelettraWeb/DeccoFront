<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card
          ><v-row>
            <v-col>
              <v-card-title> Fruta procesada </v-card-title>
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

function formatData(name, arrays) {
  let data = [];
  for (let variable of arrays) {
    let obj = { x: new Date(variable.x).getTime(), y: variable.y };
    data.push(obj);
  }
  return { name: name, data: data };
}
let cargado = ref(false);
let cajaPCiclo = {};
let kgPCaja = {};
let tCajas = {};
let tKg = {};

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
  cajaPCiclo = await obtenerDatosVariable("8h", "registros", "sinfiltro", 16);
  kgPCaja = await obtenerDatosVariable("8h", "registros", "sinfiltro", 17);
  tCajas = await obtenerDatosVariable("8h", "registros", "sinfiltro", 18);
  tKg = await obtenerDatosVariable("8h", "registros", "sinfiltro", 19);
  registrosT.value = [
    formatData("Caja por ciclo", cajaPCiclo.registros),
    formatData("Peso por caja", kgPCaja.registros),
    formatData("Total cajas", tCajas.registros),
    formatData("Total kilos", tKg.registros),
  ];
  socket.on("variable_16_actualizada", (data) => {
    registrosT.value[0].data.push({
      x: new Date(moment(data.x).toISOString()).getTime(),
      y: data.y,
    });
    if (chartRef.value) {
      chartRef.value.updateSeries(registrosT.value);
      if (lastZoom) chartRef.value.zoomX(lastZoom[0], lastZoom[1]);
    }
  });
  socket.on("variable_17_actualizada", (data) => {
    registrosT.value[1].data.push({
      x: new Date(moment(data.x).toISOString()).getTime(),
      y: data.y,
    });
    if (chartRef.value) {
      chartRef.value.updateSeries(registrosT.value);
      if (lastZoom) chartRef.value.zoomX(lastZoom[0], lastZoom[1]);
    }
  });
  socket.on("variable_18_actualizada", (data) => {
    registrosT.value[2].data.push({
      x: new Date(moment(data.x).toISOString()).getTime(),
      y: data.y,
    });
    if (chartRef.value) {
      chartRef.value.updateSeries(registrosT.value);
      if (lastZoom) chartRef.value.zoomX(lastZoom[0], lastZoom[1]);
    }
  });
  socket.on("variable_19_actualizada", (data) => {
    registrosT.value[3].data.push({
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
