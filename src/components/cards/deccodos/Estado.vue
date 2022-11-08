<template>
  <v-container
    ><v-row>
      <v-col>
        <v-card>
          <v-row
            ><v-col><v-card-title>Estado</v-card-title></v-col>
          </v-row>
          <v-row>
            <v-col v-if="cargado">
              <v-row>
                <v-col>
                  <ApexChart
                    ref="chartRef"
                    type="rangeBar"
                    height="300"
                    :options="chartOptions"
                    :series="series" />
                  <ApexChart
                    ref="chartRef3"
                    type="rangeBar"
                    height="300"
                    :options="chartOptions"
                    :series="series3" /><ApexChart
                    ref="chartRef2"
                    type="rangeBar"
                    height="200"
                    :options="chartOptions"
                    :series="series2"
                /></v-col>
              </v-row>
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
      </v-col> </v-row
  ></v-container>
</template>
<script>
export default {
  name: "EstadoSistema",
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
async function obtenerDatosVariables(operacion, modo, filtrado, variables) {
  return (
    await axios.post(
      `${process.env.VUE_APP_RUTA_API}/variable/multiple/${operacion}/${modo}/${filtrado}/`,
      { variables }
    )
  ).data;
}
async function obtenerMarcha(modo, variables, operacion) {
  return (
    await axios.post(
      `${process.env.VUE_APP_RUTA_API}/variable/marcha/${modo}/${operacion}`,
      {
        variables,
      }
    )
  ).data;
}

function newValue(series, value, chartRef, lastZoom, nameI) {
  let elemento0 = series.value[0].data.findLast(
    (node) => node.x == names[nameI]
  );
  let elemento1 = series.value[1].data.findLast(
    (node) => node.x == names[nameI]
  );
  if (elemento0 && elemento1) {
    let last = moment(elemento0.y[1]).isBefore(moment(elemento1.y[1])) ? 0 : 1;

    if (value.y == last) {
      let index = series.value[value.y].data.findLastIndex(
        (node) => node.x == names[nameI]
      );
      series.value[value.y].data[index].y[1] = new Date(value.x).getTime();
    } else {
      let index = series.value[1].data.findLastIndex(
        (node) => node.x == names[nameI]
      );
      series.value[value.y].data.push({
        x: names[nameI],
        y: [
          new Date(series.value[value.y].data[index].y[1]).getTime(),
          new Date(value.x).getTime(),
        ],
      });
    }
  } else {
    if (elemento0) {
      let index = series.value[0].data.findLastIndex(
        (node) => node.x == names[nameI]
      );
      series.value[0].data.push({
        x: names[nameI],
        y: [
          new Date(series.value[0].data[index].y[1]).getTime(),
          new Date(value.x).getTime(),
        ],
      });
    } else {
      if (elemento1) {
        let index = series.value[1].data.findLastIndex(
          (node) => node.x == names[nameI]
        );
        series.value[1].data.push({
          x: names[nameI],
          y: [
            new Date(series.value[1].data[index].y[1]).getTime(),
            new Date(value.x).getTime(),
          ],
        });
      } else {
        series.value[value.y].data.push({
          x: names[nameI],
          y: [new Date(value.x).getTime(), new Date(value.x).getTime() + 500],
        });
      }
    }
    if (chartRef.value) {
      chartRef.value.updateSeries(series.value);
      if (lastZoom) chartRef.value.zoomX(lastZoom[0], lastZoom[1]);
    }
  }
}

const socket = io("http://localhost:3000");
const chartRef = ref(null);
const chartRef2 = ref(null);
const chartRef3 = ref(null);
var lastZoom = null;
let cargado = ref(false);
let marcha = [];
let series = ref([]);
let series2 = ref([]);
let series3 = ref([]);
let modoMaquina = [];
let funcMaquina = [];
let cepillos = [];
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
        rangeBarGroupRows: true,
        barHeight: "50%",
      },
    },
    colors: [
      function ({ value, seriesIndex, w }) {
        if (seriesIndex == 0) {
          return "#d50000";
        } else {
          return "#00c853";
        }
      },
    ],
    xaxis: {
      type: "datetime",
      datetimeUTC: false,
      min: new Date(moment().subtract(8, "hours")).getTime(),
      max: moment(),
      tickAmount: 25,
      labels: {
        rotate: -45,
        minHeight: 75,
        rotateAlways: true,
        formatter: function (value, timestamp) {
          return new Date(value).toLocaleTimeString(); // The formatter function overrides format property
        },
      },
    },
    yaxis: {
      minWidth: 1,
      axisTicks: {
        width: 1,
      },
    },
    tooltip: {
      x: {
        format: "dd MMM yyyy HH:mm:ss",
      },
    },
  };
});
onMounted(async () => {
  cargado.value = false;
  modoMaquina = await obtenerDatosVariables(
    "8h",
    "registros",
    "formatoRangos",
    [31]
  );
  let autoManual = await obtenerDatosVariables(
    "8h",
    "registros",
    "formatoRangos",
    [41, 43]
  );
  for (let index = 0; index < autoManual[1].data.length; index++) {
    const element = autoManual[1].data[index];
    modoMaquina[1].data.push(element);
  }
  marcha = await obtenerMarcha("8h", [31, 41, 43, 40, 42], "registros");
  funcMaquina = await obtenerDatosVariables(
    "8h",
    "registros",
    "formatoRangos",
    [40, 42]
  );
  cepillos = await obtenerDatosVariables("8h", "registros", "formatoRangos", [
    44,
  ]);
  series.value = modoMaquina;
  for (let index = 0; index < funcMaquina[1].data.length; index++) {
    const element = funcMaquina[1].data[index];
    marcha[1].data.push(element);
    if (element.x == "alarma") {
      element.fillColor = "#fdd835";
    } else {
      element.fillColor = "#3949ab";
    }
  }
  series2.value = cepillos;
  series3.value = marcha;

  // socket.on("variable_31_actualizada", (data) => {
  //   newValue(series, data, chartRef, lastZoom, 0);
  // });
  // socket.on("variable_40_actualizada", (data) => {
  //   newValue(series, data, chartRef, lastZoom, 4);
  // });
  // socket.on("variable_41_actualizada", (data) => {
  //   newValue(series, data, chartRef, lastZoom, 1);
  // });
  // socket.on("variable_42_actualizada", (data) => {
  //   newValue(series, data, chartRef, lastZoom, 3);
  // });
  // socket.on("variable_43_actualizada", (data) => {
  //   newValue(series, data, chartRef, lastZoom, 2);
  // });
  // socket.on("variable_44_actualizada", (data) => {
  //   newValue(series, data, chartRef, lastZoom, 5);
  // });
  cargado.value = true;
});
</script>
