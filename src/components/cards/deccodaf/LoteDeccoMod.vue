<template>
  <v-row>
    <v-col>
      <v-switch v-model="mostrar" color="info">
        <template #label>
          <span style="font-weight: bold">Lotes Fungicida</span>
        </template>
      </v-switch>
      <v-card v-if="mostrar">
        <v-row>
          <v-col v-if="cargado">
            <ApexChart
              ref="chartRef"
              type="rangeBar"
              :height="320"
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
    </v-col>
  </v-row>
</template>
<script>
export default {
  name: "LotesFungicidas",
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
const series = ref([]);

let chartOptions = computed(() => {
  return {
    chart: {
      id: "fungicidas",
      // group: "actual",
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
      // categories: props.categories,
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
        minWidth: 150,
        maxWidth: 300,
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
  lotesfungicidas: { type: Array, default: () => [] },
  nombresproductos: { type: Array, default: () => [] },
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

  let lotesFungicidas = [];
  let valores = [
    {
      name: "Lotes Fungicidas",
      data: [...lotesCliente],
    },
  ];
  let index = 0;
  for (let lotefungicida of props.lotesfungicidas) {
    lotesFungicidas[index] = await obtenerDatosVariableGeneral(
      "24H",
      "registros",
      "multiple",
      "formatoLotesFungicida",
      [lotefungicida, props.nombresproductos[index]],
      maquinaID,
      routerStore().clienteID
    );
    valores[0].data = [...valores[0].data, ...lotesFungicidas[index]];
    index++;
  }
  series.value = valores;
};

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
