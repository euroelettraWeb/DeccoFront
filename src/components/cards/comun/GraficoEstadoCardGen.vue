<template>
  <v-row no-gutters>
    <v-col>
      <v-switch v-model="mostrar" color="info" :label="props.title">
        {{ props.title }}
      </v-switch>
      <div v-if="mostrar">
        <v-row no-gutters>
          <v-col v-if="props.cargado">
            <ApexChart
              type="rangeBar"
              :height="props.height"
              :options="chartOptions"
              :series="props.serie"
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
      </div>
    </v-col>
  </v-row>
</template>
<script>
export default {
  name: "GraficasEstado",
};
</script>
<script setup>
import { ref } from "vue";
import es from "apexcharts/dist/locales/es.json";
import moment from "moment";

const mostrar = ref(true);
const chartOptions = {
  chart: {
    type: "rangeBar",
    locales: [es],
    defaultLocale: "es",
    animations: { enabled: false },
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
        return props.colores[0];
      } else {
        return props.colores[1];
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
        formatter: (seriesName) => (props.tooltipy ? seriesName : ""),
      },
    },
  },
  legend: {
    height: 20,
    show: props.legend,
  },
};
const props = defineProps({
  serie: { type: Array, default: () => [] },
  title: { type: String, default: "" },
  height: { type: Number, default: 300 },
  colores: { type: Array, default: () => ["#d50000", "#00c853"] },
  categories: { type: Array, default: () => [] },
  tooltipy: { type: Boolean, default: true },
  legend: { type: Boolean, default: true },
  cargado: { type: Boolean, default: true },
});
</script>
