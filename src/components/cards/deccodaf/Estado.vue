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
                    :series="series"
                /></v-col>
              </v-row>
              <v-row>
                <v-col>
                  <ApexChart
                    ref="chartRef3"
                    type="rangeBar"
                    height="300"
                    :options="chartOptions"
                    :series="series3"
                /></v-col>
              </v-row>
              <v-row>
                <v-col
                  ><ApexChart
                    ref="chartRef2"
                    type="rangeBar"
                    height="300"
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

async function obtenerMarcha(id, id2, id3, id4, id5) {
  return (
    await axios.get(
      `${process.env.VUE_APP_RUTA_API}/variables/${id}/${id2}/${id3}/${id4}/${id5}`
    )
  ).data;
}

function range(array, names) {
  let todos = [];
  let apagado = [];
  let encendido = [];
  for (let i = 0; i < names.length; i++) {
    for (let index = 0; index < array[i].length; index++) {
      const element = array[i][index];
      let startR = new Date(element.x).getTime();
      let endR = new Date(element.y).getTime();
      let obj = { x: names[i], y: [startR, endR] };
      if (element.z == 0) apagado.push(obj);
      else encendido.push(obj);
    }
  }

  todos.push({ name: "Apagado", data: apagado });
  todos.push({ name: "Encedido", data: encendido });
  return todos;
}
// function newValue(newArray, value, nameI) {
//   let elemento0 = newArray[0].data.findLast((node) => node.x == nameI);
//   let elemento1 = newArray[1].data.findLast((node) => node.x == nameI);
//   let last = moment(elemento0.y[1]).isAfter(elemento1.y[1]) ? 0 : 1;
//   let index = newArray[last].data.findLastIndex(
//     (node) => node.x == nameI
//   );
//   // console.log("last", last);
//   // console.log(index);
//   // console.log(newArray[value.y].data);
//   // console.log(newArray[value.y].data[index].y[1]);
//   if (value.y == last) {
//     // console.log(newArray[value.y].data[index].y[1]);
//     newArray[value.y].data[index].y[1] = new Date(value.x).getTime();
//     // console.log(newArray[value.y].data[index]);
//   } else {
//     // console.log(newArray[value.y].data[index].y[1]);
//     let obj = {
//       x: nameI,
//       y: [
//         new Date(newArray[value.y].data[index].y[1]).getTime(),
//         new Date(value.x).getTime(),
//       ],
//     };
//     // newArray[value.y].data.push(obj);
//     // console.log(newArray[value.y].data.push(obj));
//   }
//   return newArray;
// }

function newValue(series, value, chartRef, lastZoom, nameI) {
  let elemento0 = series.value[0].data.findLast((node) => node.x == nameI);
  let elemento1 = series.value[1].data.findLast((node) => node.x == nameI);
  if (elemento0 && elemento1) {
    let last = moment(elemento0.y[1]).isBefore(moment(elemento1.y[1])) ? 0 : 1;

    if (value.y == last) {
      let index = series.value[value.y].data.findLastIndex(
        (node) => node.x == nameI
      );
      series.value[value.y].data[index].y[1] = new Date(value.x).getTime();
    } else {
      let index = series.value[1].data.findLastIndex((node) => node.x == nameI);
      series.value[value.y].data.push({
        x: nameI,
        y: [
          new Date(series.value[value.y].data[index].y[1]).getTime(),
          new Date(value.x).getTime(),
        ],
      });
    }
  } else {
    if (elemento0) {
      let index = series.value[0].data.findLastIndex((node) => node.x == nameI);
      series.value[0].data.push({
        x: nameI,
        y: [
          new Date(series.value[0].data[index].y[1]).getTime(),
          new Date(value.x).getTime(),
        ],
      });
    } else {
      if (elemento1) {
        let index = series.value[1].data.findLastIndex(
          (node) => node.x == nameI
        );
        series.value[1].data.push({
          x: nameI,
          y: [
            new Date(series.value[1].data[index].y[1]).getTime(),
            new Date(value.x).getTime(),
          ],
        });
      } else {
        series.value[value.y].data.push({
          x: nameI,
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
let activo = {};
let auto = [];
let manual = [];
let faltaConsenso = [];
let alarma = [];
let marcha = [];
let series = ref([]);
let series2 = ref([]);
let series3 = ref([]);
let names = ["Activo", "Auto", "Manual"];
let names2 = ["Falta de consenso", "Alarma"]; /* "marchaParo", */
let nameEstado = ["Apagado", "Encendido"];
let chartOptions = computed(() => {
  return {
    chart: {
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
        rotateAlways: true,
        formatter: function (value, timestamp) {
          return new Date(value).toLocaleTimeString(); // The formatter function overrides format property
        },
      },
    },
    tooltip: {
      x: {
        format: "dd MMM yyyy hh:mm:ss",
      },
    },
    legend: {
      height: 60,
    },
  };
});
onMounted(async () => {
  cargado.value = false;
  let estados = [];
  let estados2 = [];
  activo = await obtenerDatosVariable("8h", "registros", "rangosTodos", 1);
  alarma = await obtenerDatosVariable("8h", "registros", "rangosTodos", 12);
  auto = await obtenerDatosVariable("8h", "registros", "rangosTodos", 13);
  marcha = await obtenerMarcha(1, 12, 13, 14, 15);
  faltaConsenso = await obtenerDatosVariable(
    "8h",
    "registros",
    "rangosTodos",
    14
  );

  manual = await obtenerDatosVariable("8h", "registros", "rangosTodos", 15);
  estados = [activo.registros, auto.registros, manual.registros];
  estados2 = [faltaConsenso.registros, alarma.registros];
  series.value = range(estados, names); //TODO Obtener nombre de la variable
  series2.value = range(estados2, names2); //TODO Obtener nombre de la variable
  series3.value = marcha;
  // socket.on("variable_1_actualizada", (data) => {
  //   newValue(series, data, chartRef, lastZoom, names[0]);
  // });
  // socket.on("variable_12_actualizada", (data) => {
  //   newValue(series2, data, chartRef2, lastZoom, names2[0]);
  // });
  // socket.on("variable_13_actualizada", (data) => {
  //   newValue(series, data, chartRef, lastZoom, names[1]);
  // });
  // socket.on("variable_14_actualizada", (data) => {
  //   newValue(series2, data, chartRef2, lastZoom, names2[1]);
  // });
  // socket.on("variable_15_actualizada", (data) => {
  //   newValue(series, data, chartRef, lastZoom, names[2]);
  // });
  cargado.value = true;
});
</script>
