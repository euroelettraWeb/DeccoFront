<template>
  <v-row no-gutters>
    <v-col>
      <v-switch v-model="mostrar" color="info">
        <template #label>
          <span style="font-weight: bold">{{ props.title }}</span>
        </template>
      </v-switch>
      <v-card v-if="mostrar">
        <v-row no-gutters>
          <v-col v-if="cargado">
            <ApexChart
              ref="chartRef"
              type="line"
              :height="props.height"
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
  name: "GraficasLinea",
};
</script>
<script setup>
import {
  obtenerMaquina,
  obtenerDatosVariableGeneral,
} from "../../../helpers/bd";
import { onMounted, onUnmounted, ref, computed, watch } from "vue";
import es from "apexcharts/dist/locales/es.json";
import moment from "moment";
import { routerStore } from "../../../stores/index";

const chartRef = ref(null);
let interval = null;
let lastZoom = null;
const cargado = ref(false);
const mostrar = ref(true);
const series = ref([]);

const props = defineProps({
  variables: { type: Array, default: () => [] },
  title: { type: String, default: "" },
  height: { type: Number, default: 300 },
  tipo: { type: Number, default: 1 },
  tipodatos: { type: String, default: "formatoLinea" },
  labelvar: { type: String, default: "" },
});

const chartOptions = computed(() => {
  return {
    chart: {
      id: props.title,
      locales: [es],
      defaultLocale: "es",
      animations: { enabled: false },
      zoom: {
        type: "xy",
        autoScaleYaxis: true,
      },
    },
    xaxis: {
      type: "datetime",
      datetimeUTC: false,
      tickAmount: 25,
      labels: {
        minHeight: 125,
        rotate: -45,
        rotateAlways: true,
        formatter: function (value) {
          return moment.utc(value).format("DD/MM/yyyy HH:mm:ss");
        },
      },
    },
    yaxis: {
      min: 0,
      axisTicks: {
        show: true,
      },
      axisBorder: {
        show: true,
      },
      labels: {
        minWidth: 60,
        formatter: function (val) {
          return val.toFixed(2);
          // return val;
        },
      },
    },
    stroke: {
      width: 1.9,
    },
    legend: {
      showForSingleSeries: true,
    },
  };
});

const cargarDatos = async () => {
  let maquinaID = (
    await obtenerMaquina("lineaTipo", routerStore().lineasID, props.tipo)
  )[0].id;
  let formatoVariables = await obtenerDatosVariableGeneral(
    "24H",
    "registros",
    "individual",
    props.tipodatos,
    props.variables,
    maquinaID,
    routerStore().clienteID,
    null,
    null,
    props.labelvar
  );
  series.value = formatoVariables;
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

  interval = setInterval(async () => {
    cargarDatos();
    // if (chartRef.value) {
    //   chartRef.value.updateSeries(formatoVariable);
    //   if (lastZoom) chartRef.value.zoomX(lastZoom[0], lastZoom[1]);
    // }
  }, 90000);
});

onUnmounted(() => {
  clearInterval(interval);
});
</script>
