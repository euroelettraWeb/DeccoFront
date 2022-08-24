<template>
  <!-- <v-container><GraficaLineas altura-grafico="100" /> </v-container> -->
  <v-container><BarChart chart-id="BarChart" :data="data" /></v-container>
</template>

<script>
export default {
  name: "GraficaFruta",
};
</script>
<script setup>
import BarChart from "../graficas-modelo/chartJs/BarChart.vue";

const data = {
  labels: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  datasets: [
    {
      label: "Data One",
      backgroundColor: "#f87979",
      data: [80, 20, 12, 39, 10, 40, 39, 80, 40, 20, 12, 11],
    },
  ],
};
</script>
