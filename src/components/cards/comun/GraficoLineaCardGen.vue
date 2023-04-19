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
              type="line"
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

let mostrar = ref(true);
let chartOptions = {
  chart: {
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
      minWidth: 60,
    },
  },
  stroke: {
    width: 1.9,
    height: 60,
    showForSingleSeries: true,
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
    showForSingleSeries: true,
  },
};

const props = defineProps({
  serie: { type: Array, default: () => [] },
  title: { type: String, default: "" },
  height: { type: Number, default: 300 },
  tooltipy: { type: Boolean, default: true },
  legend: { type: Boolean, default: true },
  cargado: { type: Boolean, default: true },
});
</script>
