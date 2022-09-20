<template>
  <v-container>
    <v-row> <LineChart :data="props.series" :options="chartOptionsL" /> </v-row>
  </v-container>
</template>
<script>
export default {
  name: "GraficaTotalAgua",
};
</script>
<script setup>
import LineChart from "../graficas-modelo/apexChartJs/LineChart.vue";
const props = defineProps({ series: { type: Array, default: () => [] } });
const chartOptionsL = {
  xaxis: {
    type: "datetime",
  },
};
</script>
