<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card>
          <v-row>
            <v-col><v-card-title>Estados</v-card-title></v-col>
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
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  name: "EstadoDAF",
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
let activo = [];
let auto = [];
let manual = [];
let faltaConsenso = [];
let alarma = [];

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
  activo = await obtenerDatosVariable("8h", "registros", "rangos", 1);
  alarma = await obtenerDatosVariable("8h", "registros", "rangos", 12);
  auto = await obtenerDatosVariable("8h", "registros", "rangos", 13);
  faltaConsenso = await obtenerDatosVariable("8h", "registros", "rangos", 14);
  manual = await obtenerDatosVariable("8h", "registros", "rangos", 15);

  series.value = [
    { name: "Activo", data: range("Activo", activo.registros) },
    { name: "Auto", data: range("Auto", auto.registros) },
    { name: "Manual", data: range("Manual", manual.registros) },
    {
      name: "Falta de consenso",
      data: range("Falta de consenso", faltaConsenso.registros),
    },
    { name: "Alarma", data: range("Alarma", alarma.registros) },
  ];
  socket.on("variable_1_actualizada", (data) => {
    updateValue(series, data, chartRef, lastZoom, 0, "Activo");
  });
  socket.on("variable_12_actualizada", (data) => {
    updateValue(series, data, chartRef, lastZoom, 1, "Auto");
  });
  socket.on("variable_13_actualizada", (data) => {
    updateValue(series, data, chartRef, lastZoom, 2, "Manual");
  });
  socket.on("variable_14_actualizada", (data) => {
    updateValue(series, data, chartRef, lastZoom, 0, "Falta de consenso");
  });
  socket.on("variable_15_actualizada", (data) => {
    updateValue(series, data, chartRef, lastZoom, 0, "Alarma");
  });
  cargado.value = true;
});
</script>
