<template>
  <v-row no-gutters>
    <v-col>
      <v-switch v-model="mostrar" color="info" label="Estado">Estado</v-switch>
      <v-card v-if="mostrar">
        <v-row no-gutters>
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
            <div v-if="noData">
              <h1>Maquina desconectada</h1>
            </div>
            <div v-else>
              <v-progress-circular
                :size="100"
                :width="7"
                color="purple"
                indeterminate
              ></v-progress-circular>
            </div>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
export default {
  name: "EstadoSistema",
};
</script>
<script setup>
import {
  obtenerMaquina,
  obtenerDatosVariableGeneral,
} from "../../../helpers/bd";
import { onMounted, ref, computed } from "vue";
import es from "apexcharts/dist/locales/es.json";
import io from "socket.io-client";
import moment from "moment";
import { routerStore } from "../../../stores/index";

const socket = io("http://localhost:3000");
const chartRef = ref(null);

let cargado = ref(false);
let noData = ref(false);
let mostrar = ref(true);
let marcha = [];
let series = ref([]);
let modoMaquina = [];
let autoManual = [];
let funcMaquina = [];
let chartOptions = computed(() => {
  return {
    chart: {
      id: "estado",
      group: "actual",
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
      tickAmount: 20,
      categories: props.categories,
      labels: {
        minHeight: 125,
        rotate: -45,
        rotateAlways: true,
        formatter: function (value, timestamp) {
          return moment.utc(value).format("DD/MM/yyyy HH:mm:ss");
        },
      },
    },
    yaxis: {
      labels: {
        minWidth: 60,
      },
    },
    tooltip: {
      x: {
        format: "dd/MM/yyyy HH:mm:ss",
      },
      y: {
        title: {
          formatter: (seriesName) => "",
        },
      },
    },
    legend: {
      show: false,
    },
  };
});
const props = defineProps({
  activo: { type: Number, default: 1 },
  autoManual: { type: Array, default: () => [] },
  alarma: { type: Array, default: () => [] },
  marcha: { type: Array, default: () => [] },
  tipo: { type: Number, default: 1 },
  categories: { type: Array, default: () => [] },
});

async function dataGrafica(maquinaID) {
  modoMaquina = await obtenerDatosVariableGeneral(
    "24H",
    "registros",
    "individual",
    "formatoRangos",
    [props.activo],
    maquinaID,
    routerStore().clienteID,
    null,
    null,
    ["Paro", "Marcha"]
  );
  autoManual = await obtenerDatosVariableGeneral(
    "24H",
    "registros",
    "individual",
    "formatoRangos",
    props.autoManual,
    maquinaID,
    routerStore().clienteID
  );
  if (autoManual[1]) {
    for (let index = 0; index < autoManual[1].data.length; index++) {
      const element = autoManual[1].data[index];
      modoMaquina[1].data.push(element);
    }
  }

  marcha = await obtenerDatosVariableGeneral(
    "24H",
    "registros",
    "multiple",
    "marchaFormatoRangos",
    props.marcha,
    maquinaID,
    routerStore().clienteID
  );
  if (marcha[0] && modoMaquina[0]) {
    for (let index = 0; index < marcha[0].data.length; index++) {
      const element = marcha[0].data[index];
      modoMaquina[0].data.push(element);
    }
  }
  if (marcha[1] && modoMaquina[1]) {
    for (let index = 0; index < marcha[1].data.length; index++) {
      const element = marcha[1].data[index];
      modoMaquina[1].data.push(element);
    }
  }

  funcMaquina = await obtenerDatosVariableGeneral(
    "24H",
    "registros",
    "individual",
    "formatoRangos",
    props.alarma,
    maquinaID,
    routerStore().clienteID
  );
  if (funcMaquina[1]) {
    for (let index = 0; index < funcMaquina[1].data.length; index++) {
      let element = funcMaquina[1].data[index];
      if (element.x == "Alarma") {
        element.fillColor = "#fdd835";
      } else {
        element.fillColor = "#3949ab";
      }
      modoMaquina[1].data.push(element);
    }
  }
  if (!modoMaquina) {
    cargado.value = false;
    noData.value = true;
  } else series.value = modoMaquina;
}
onMounted(async () => {
  cargado.value = false;
  let maquinaID = (
    await obtenerMaquina("lineaTipo", routerStore().lineasID, props.tipo)
  )[0].id;
  await dataGrafica(maquinaID);

  // for (let index = 0; index < props.autoManual.length; index++) {
  //   const element = props.autoManual[index];
  //   socket.on(`variable_${maquinaID}_${element}_actualizada`, async (data) => {
  //     dataGrafica(maquinaID);
  //   });
  // }

  // for (let index = 0; index < props.alarma.length; index++) {
  //   const element = props.alarma[index];
  //   socket.on(`variable_${maquinaID}_${element}_actualizada`, async (data) => {
  //     dataGrafica(maquinaID);
  //   });
  // }

  socket.on(
    `variable_${maquinaID}_${props.activo}_actualizada`,
    async (data) => {
      dataGrafica(maquinaID);
    }
  );
  cargado.value = true;
});
</script>
