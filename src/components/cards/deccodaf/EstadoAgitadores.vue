<template>
  <v-container
    ><v-row>
      <v-col>
        <v-card>
          <v-row>
            <v-col><v-card-title>Agitadores</v-card-title></v-col>
          </v-row>
          <v-row>
            <v-col v-if="cargado">
              <StatusChart :data="series" :options="chartOptions" />
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
      </v-col> </v-row
  ></v-container>
</template>
<script>
export default {
  name: "EstadoAgitadores",
};
</script>
<script setup>
import axios from "axios";
import { onMounted, ref } from "vue";
import StatusChart from "../../graficas-modelo/apexChartJs/StatusChart.vue";
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
let cargado = ref(false);
let agP1 = [];
let agP2 = [];
let agP3 = [];
let agP4 = [];
let agP5 = [];
let series = ref([]);

let chartOptions = {
  chart: {
    height: "100%",
    type: "rangeBar",
  },
  plotOptions: {
    bar: {
      horizontal: true,
      barHeight: "100%",
    },
  },
  xaxis: {
    type: "datetime",
    datetimeUTC: true,
  },
  yaxis: {
    show: false,
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
onMounted(async () => {
  cargado.value = false;
  agP1 = await obtenerDatosVariable("8h", "registros", "rangos", 2);
  agP2 = await obtenerDatosVariable("8h", "registros", "rangos", 3);
  agP3 = await obtenerDatosVariable("8h", "registros", "rangos", 4);
  agP4 = await obtenerDatosVariable("8h", "registros", "rangos", 5);
  agP5 = await obtenerDatosVariable("8h", "registros", "rangos", 6);

  series.value = [
    { name: "Agitador P1", data: range("Agitador P1", agP1.registros) },
    { name: "Agitador P2", data: range("Agitador P2", agP2.registros) },
    { name: "Agitador P3", data: range("Agitador P3", agP3.registros) },
    {
      name: "Agitador P4",
      data: range("Agitador P4", agP4.registros),
    },
    { name: "Agitador P5", data: range("Agitador P5", agP5.registros) },
  ];
  cargado.value = true;
});
</script>
