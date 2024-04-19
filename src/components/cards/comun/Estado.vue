<template>
  <v-row no-gutters>
    <v-col>
      <v-switch v-model="mostrar" color="info">
        <template #label>
          <span style="font-weight: bold">Estado</span>
        </template>
      </v-switch>
      <v-card v-if="mostrar">
        <v-row no-gutters>
          <v-col v-if="cargado">
            <div v-if="noData" class="d-flex justify-center align-center">
              <h1>Maquina desconectada</h1>
            </div>
            <ApexChart
              v-else
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
import { onMounted, ref, computed, onUnmounted, watch } from "vue";
import es from "apexcharts/dist/locales/es.json";
import moment from "moment";
import { routerStore } from "../../../stores/index";

const chartRef = ref(null);

const cargado = ref(false);
const noData = ref(false);
const mostrar = ref(true);
const series = ref([]);
let interval = null;
let lastZoom = null;
const chartOptions = computed(() => {
  return {
    chart: {
      id: "estado",
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
        minWidth: 70,
        formatter: (value) => {
          if (value === "Falta de consenso") {
            value = "Consenso";
          }
          return value;
        },
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

async function cargarDatos() {
  let maquinaID = (
    await obtenerMaquina("lineaTipo", routerStore().lineasID, props.tipo)
  )[0].id;
  let modoMaquina = await obtenerDatosVariableGeneral(
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

  let autoManual = await obtenerDatosVariableGeneral(
    "24H",
    "registros",
    "individual",
    "formatoRangos",
    props.autoManual,
    maquinaID,
    routerStore().clienteID
  );
  if (autoManual[1]) {
    modoMaquina[1].data.push(...autoManual[1].data);
  }

  let marcha = await obtenerDatosVariableGeneral(
    "24H",
    "registros",
    "multiple",
    "marchaFormatoRangos",
    props.marcha,
    maquinaID,
    routerStore().clienteID
  );
  if (marcha[0] && modoMaquina[0]) {
    modoMaquina[0].data.push(...marcha[0].data);
  }
  if (marcha[1] && modoMaquina[1]) {
    modoMaquina[1].data.push(...marcha[1].data);
  }

  let funcMaquina = await obtenerDatosVariableGeneral(
    "24H",
    "registros",
    "individual",
    "formatoRangos",
    props.alarma,
    maquinaID,
    routerStore().clienteID
  );
  if (funcMaquina[1].data.length > 0) {
    for (let index = 0; index < funcMaquina[1].data.length; index++) {
      let element = funcMaquina[1].data[index];
      if (element.x == "Alarma") {
        element.fillColor = "#fdd835";
      } else if (element.x == "Falta de consenso") {
        element.fillColor = "#d50000";
      } else {
        element.fillColor = "#00c853";
      }
      modoMaquina[1].data.push(element);
    }
  }
  if (funcMaquina[0].data.length > 0) {
    for (let index = 0; index < funcMaquina[0].data.length; index++) {
      let element = funcMaquina[0].data[index];
      if (element.x == "Falta de consenso") {
        element.fillColor = "#00c853";
      }
      modoMaquina[0].data.push(element);
    }
  }
  if (modoMaquina[1].data.length == 0) {
    noData.value = true;
  } else {
    series.value = modoMaquina;
  }
}

watch(
  () => routerStore().lineasID,
  async () => {
    cargado.value = false;
    await cargarDatos();
    cargado.value = true;
  }
);

onMounted(async () => {
  cargado.value = false;
  await cargarDatos();
  cargado.value = true;
  interval = setInterval(() => {
    cargarDatos();
  }, 90000);
});

onUnmounted(() => {
  clearInterval(interval);
  series.value = [];
});
</script>
