<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card>
          <v-row
            ><v-col><v-card-title>Niveles garrafas</v-card-title></v-col>
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
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  name: "EstadoNivelGarrafas",
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
let nP1 = [];
let nP2 = [];
let nP3 = [];
let nP4 = [];
let nP5 = [];
let series = ref([]);

let chartOptions = {
  chart: {
    height: 100,
    type: "rangeBar",
  },
  plotOptions: {
    bar: {
      horizontal: true,
    },
  },
  xaxis: {
    type: "datetime",
    datetimeUTC: true,
  },
  tooltip: {
    x: {
      format: "dd MMM yyyy hh:mm:ss",
    },
  },
};
onMounted(async () => {
  cargado.value = false;
  nP1 = await obtenerDatosVariable("8h", "registros", "rangos", 20);
  nP2 = await obtenerDatosVariable("8h", "registros", "rangos", 21);
  nP3 = await obtenerDatosVariable("8h", "registros", "rangos", 22);
  nP4 = await obtenerDatosVariable("8h", "registros", "rangos", 23);
  nP5 = await obtenerDatosVariable("8h", "registros", "rangos", 24);

  series.value = [
    { name: "Nivel P1", data: range("Nivel P1", nP1.registros) },
    { name: "Nivel P2", data: range("Nivel P2", nP2.registros) },
    { name: "Nivel P3", data: range("Nivel P3", nP3.registros) },
    {
      name: "Nivel P4",
      data: range("Nivel P4", nP4.registros),
    },
    { name: "Nivel P5", data: range("Nivel P5", nP5.registros) },
  ];
  cargado.value = true;
});
</script>
