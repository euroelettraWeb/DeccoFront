<template>
  <v-row>
    <v-col>
      <div v-if="lotejabonvisualizar">
        <v-switch v-model="mostrar" color="info">
          <template #label>
            <span style="font-weight: bold">Lote Jabon</span>
          </template>
        </v-switch>
        <v-card v-if="mostrar">
          <v-row>
            <v-col v-if="cargado">
              <ApexChart
                ref="chartRef"
                type="rangeBar"
                :height="200"
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
              />
            </v-col>
          </v-row>
        </v-card>
      </div>
      <div v-if="lotedesinfvisualizar">
        <v-switch v-model="mostrar2" color="info">
          <template #label>
            <span style="font-weight: bold">Lote Desinfectante</span>
          </template>
        </v-switch>
        <v-card v-if="mostrar2">
          <v-row>
            <v-col v-if="cargado2">
              <ApexChart
                ref="chartRef2"
                type="rangeBar"
                :height="200"
                :options="chartOptions2"
                :series="series2"
              />
            </v-col>
            <v-col v-else class="d-flex justify-center align-center">
              <v-progress-circular
                :size="100"
                :width="7"
                color="purple"
                indeterminate
              />
            </v-col>
          </v-row>
        </v-card>
      </div>
    </v-col>
  </v-row>
</template>
<script>
export default {
  name: "LoteDecco",
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

let lastZoom = null;
let interval = null;
const cargado = ref(false);
const mostrar = ref(true);

const cargado2 = ref(false);
const mostrar2 = ref(true);

const series = ref([]);
const series2 = ref([]);

let chartOptions = computed(() => {
  return {
    chart: {
      id: "jabon",
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
          return "#f0ec07";
        } else {
          return "#00c853";
        }
      },
    ],
    xaxis: {
      type: "datetime",
      datetimeUTC: false,
      tickAmount: 20,
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
        minWidth: 200,
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
let chartOptions2 = computed(() => {
  return {
    chart: {
      id: "desinfectante",
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
          return "#f0ec07";
        } else {
          return "#00c853";
        }
      },
    ],
    xaxis: {
      type: "datetime",
      datetimeUTC: false,
      tickAmount: 20,
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
        minWidth: 200,
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
  tipo: { type: Number, default: 1 },
  lotecliente: { type: Number, default: 0 },
  lotedeccodesinf: { type: Number, default: 0 },
  lotedeccojabon: { type: Number, default: 0 },
  nombredesinf: { type: Number, default: 0 },
  nombrejabon: { type: Number, default: 0 },
  lotejabonvisualizar: { type: Boolean, default: true },
  lotedesinfvisualizar: { type: Boolean, default: true },
});

const cargarDatos = async () => {
  let maquinaID = (
    await obtenerMaquina("lineaTipo", routerStore().lineasID, props.tipo)
  )[0].id;
  const lotesCliente = await obtenerDatosVariableGeneral(
    "24H",
    "registros",
    "individual",
    "formatoLotesCliente",
    [props.lotecliente],
    maquinaID,
    routerStore().clienteID
  );

  const lotesDeccoDesinfectante = await obtenerDatosVariableGeneral(
    "24H",
    "registros",
    "multiple",
    "formatoLotesDesinf",
    [props.lotedeccodesinf, props.nombredesinf],
    maquinaID,
    routerStore().clienteID
  );

  const lotesDeccoJabon = await obtenerDatosVariableGeneral(
    "24H",
    "registros",
    "multiple",
    "formatoLotesJabon",
    [props.lotedeccojabon, props.nombrejabon],
    maquinaID,
    routerStore().clienteID
  );

  series.value = [
    {
      name: "Lotes Jabon",
      data: [...lotesCliente, ...lotesDeccoJabon],
    },
  ];
  series2.value = [
    {
      name: "Lotes Desinfectante",
      data: [...lotesCliente, ...lotesDeccoDesinfectante],
    },
  ];
};

watch(
  () => routerStore().lineasID,
  async () => {
    cargado.value = false;
    cargado2.value = false;
    await cargarDatos();
    cargado.value = true;
    cargado2.value = true;
  }
);

onMounted(async () => {
  cargado.value = false;
  cargado2.value = false;
  await cargarDatos();
  cargado.value = true;
  cargado2.value = true;
  interval = setInterval(() => {
    cargarDatos();
  }, 90000);
});

onUnmounted(() => {
  clearInterval(interval);
  series.value = [];
  series2.value = [];
});
</script>
