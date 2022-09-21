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
              <StatusChart
                ref="chartRef"
                :data="series"
                :options="chartOptions"
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
import { onMounted, ref } from "vue";
import StatusChart from "../../graficas-modelo/apexChartJs/StatusChart.vue";
import es from "apexcharts/dist/locales/es.json";
import io from "socket.io-client";

async function obtenerDatosVariable(operacion, modo, filtrado, variableID) {
  return (
    await axios.get(
      `${process.env.VUE_APP_RUTA_API}/variable/${operacion}/${modo}/${filtrado}/${variableID}`
    )
  ).data;
}
function range(array) {
  let todos = [];
  let apagado = [];
  let encendido = [];
  for (let index = 0; index < array.length; index++) {
    const element = array[index];
    let startR = new Date(element.x).getTime();
    let endR = new Date(element.y).getTime();
    let obj = { x: "Estado", y: [startR, endR] };
    if (element.z == 0) apagado.push(obj);
    else encendido.push(obj);
  }
  todos.push({ name: "Apagado", data: apagado });
  todos.push({ name: "Encedido", data: encendido });
  return todos;
}
function newValue(newArray, value) {
  console.log(
    new Date(newArray[0].data[newArray[0].data.length - 1].y[1]),
    new Date(newArray[1].data[newArray[1].data.length - 1].y[1])
  );
  let ultimoValor =
    newArray[0].data[newArray[0].data.length - 1].y[1] <
    newArray[1].data[newArray[1].data.length - 1].y[1]
      ? 0
      : 1;
  console.log(ultimoValor);
  if (value.y == ultimoValor) {
    console.log("Añadir");
    // console.log(ultimoValor);
    // console.log(newArray[ultimoValor].data[newArray[1].data.length - 1].y[1]);
    newArray[value.y].data[newArray[value.y].data.length - 1].y[1] = new Date(
      value.x
    ).getTime();
  } else {
    if (value.y == 0) {
      console.log("Apagado");
      newArray[0].data.push({
        x: "Estado",
        y: [new Date(value.x).getTime(), new Date(value.x).getTime() + 1000],
      });
    } else {
      console.log("Encendido");
      newArray[1].data.push({
        x: "Estado",
        y: [new Date(value.x).getTime(), new Date(value.x).getTime() + 1000],
      });
    }
  }
  return newArray;
}
const socket = io("http://localhost:3000");
const chartRef = ref(null);
var lastZoom = null;
let cargado = ref(false);
let activo = {};
let series = ref([]);

let chartOptions = {
  chart: {
    height: 100,
    type: "rangeBar",
    locales: [es],
    defaultLocale: "es",
    animations: { enabled: false },
    events: {
      beforeResetZoom: function () {
        lastZoom = null;
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
  },
  tooltip: {
    x: {
      format: "dd MMM yyyy hh:mm:ss",
    },
  },
};
onMounted(async () => {
  cargado.value = false;
  activo = await obtenerDatosVariable("8h", "registros", "rangosTodos", 1);
  series.value = range(activo.registros);
  socket.on("variable_1_actualizada", (data) => {
    // series.value[data.y].data.push({
    //   x: "Estado",
    //   y: [
    //     new Date(moment(data.x).toISOString()).getTime(),
    //     new Date(moment(data.x).toISOString()).getTime() + 1000,
    //   ],
    // });
    // console.log(chartRef.value.chart);
    // console.log(series.value);
    chartRef.value.chart.updateSeries(newValue(series.value, data));
    if (lastZoom) chartRef.value.chart.zoomX(lastZoom[0], lastZoom[1]);
  });
  cargado.value = true;
});
</script>
