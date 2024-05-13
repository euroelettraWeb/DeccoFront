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
          <v-col v-if="props.cargado">
            <v-chip
              v-if="noData"
              class="ma-2"
              color="pink"
              label
              text-color="white"
            >
              <v-icon left> mdi-alert </v-icon>
              Sin datos
            </v-chip>
            <ApexChart
              v-else
              ref="chartRef"
              type="rangeBar"
              :height="props.height"
              :options="chartOptions"
              :series="props.series"
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
  name: "GraficasReposiciones",
};
</script>
<script setup>
import { ref, computed } from "vue";
import es from "apexcharts/dist/locales/es.json";
import moment from "moment";

const chartRef = ref(null);
let lastZoom = null;
const mostrar = ref(true);
const chartOptions = computed(() => {
  return {
    chart: {
      id: "grafica estado " + props.title,
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
          return moment.utc(value).format("DD/MM/YYYY HH:mm:ss");
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
        show: true,
        format: "dd/MM/yyyy HH:mm:ss",
      },
      y: {
        formatter: function (value, ctx) {
          // Comprueba si 'ctx' existe
          if (ctx) {
            // Desestructura 'ctx'
            let { series, seriesIndex, dataPointIndex, w } = ctx;
            // Accede a los datos de la serie actual
            let data = w.config.series[seriesIndex].data[dataPointIndex];
            // Comprueba si 'reposicion' existe
            let tooltip = "";
            if (data && data.reposicion) {
              // Itera sobre 'reposicion'
              for (let i = 0; i < data.reposicion.length; i++) {
                // Añade cada 'nombreCorto' y 'y' al tooltip
                tooltip += `${data.reposicion[i].nombreProducto}: ${data.reposicion[i].y} ml<br>`;
              }
            }
            return tooltip;
          }
          return value;
        },
      },
    },
    legend: {
      height: 20,
    },
  };
});

const props = defineProps({
  series: { type: Array, default: () => [] },
  cargado: { type: Boolean, default: false },
  title: { type: String, default: "" },
  height: { type: Number, default: 300 },
  colores: { type: Array, default: () => ["#d50000", "#00c853"] },
  estados: { type: Array, default: () => ["Paro", "Marcha"] },
  categories: { type: Array, default: () => [] },
});

const noData = computed(() => {
  return (
    props.cargado && props.series.every((objeto) => objeto.data.length === 0)
  );
});
</script>
