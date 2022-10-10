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
//   let elemento0 = newArray[0].data.findLast((node) => node.x == names[nameI]);
//   let elemento1 = newArray[1].data.findLast((node) => node.x == names[nameI]);
//   let last = moment(elemento0.y[1]).isAfter(elemento1.y[1]) ? 0 : 1;
//   let index = newArray[last].data.findLastIndex(
//     (node) => node.x == names[nameI]
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
//       x: names[nameI],
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
var lastZoom = null;
let cargado = ref(false);
let activo = {};
let auto = [];
let manual = [];
let faltaConsenso = [];
let alarma = [];
let series = ref([]);
let names = ["Activo", "Auto", "Manual", "Falta de consenso", "Alarma"];
let nameEstado = ["Apagado", "Encendido"];
let chartOptions = computed(() => {
  return {
    chart: {
      height: 100,
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
      },
    },
    xaxis: {
      type: "datetime",
      datetimeUTC: false,
      min: new Date(moment().subtract(8, "hours")).getTime(),
      max: moment(),
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
  let estados = [];
  activo = await obtenerDatosVariable("8h", "registros", "rangosTodos", 1);
  alarma = await obtenerDatosVariable("8h", "registros", "rangosTodos", 12);
  auto = await obtenerDatosVariable("8h", "registros", "rangosTodos", 13);
  faltaConsenso = await obtenerDatosVariable(
    "8h",
    "registros",
    "rangosTodos",
    14
  );
  manual = await obtenerDatosVariable("8h", "registros", "rangosTodos", 15);
  estados = [
    activo.registros,
    auto.registros,
    manual.registros,
    faltaConsenso.registros,
    alarma.registros,
  ];
  series.value = range(estados, names); //TODO Obtener nombre de la variable
  socket.on("variable_1_actualizada", (data) => {
    newValue(series, data, chartRef, lastZoom, 0);
  });
  socket.on("variable_12_actualizada", (data) => {
    newValue(series, data, chartRef, lastZoom, 4);
  });
  socket.on("variable_13_actualizada", (data) => {
    newValue(series, data, chartRef, lastZoom, 1);
  });
  socket.on("variable_14_actualizada", (data) => {
    newValue(series, data, chartRef, lastZoom, 3);
  });
  socket.on("variable_15_actualizada", (data) => {
    newValue(series, data, chartRef, lastZoom, 2);
  });
  cargado.value = true;
});
</script>
