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
import { onMounted, ref } from "vue";
import StatusChart from "../../graficas-modelo/apexChartJs/StatusChart.vue";
import moment from "moment";
import io from "socket.io-client";

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

const socket = io("http://localhost:3000");
let cargado = ref(false);
let activo = [];
let auto = [];
let manual = [];
let faltaConsenso = [];
let alarma = [];

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
    console.log(series.value);
    console.log(
      series.value[data.y].data[series.value[data.y].data.length - 1].y[1]
    );
    if (data.y == 0) {
      series.value[0].data.push({
        x: "Activo",
        y: [
          new Date(moment(data.x).toISOString()).getTime(),
          new Date(moment(data.x).toISOString()).getTime() + 1,
        ],
      });
    } else {
      series.value[data.y].data[series.value[data.y].data.length - 1].y[1] =
        new Date(moment(data.x).toISOString()).getTime();
    }
    // series.value.pop();
  });
  cargado.value = true;
});
</script>
