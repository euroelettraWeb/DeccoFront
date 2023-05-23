<template>
  <v-row
    ><v-col
      ><ApexCharts
        type="rangeBar"
        height="300"
        :options="chartOptions"
        :series="data" /></v-col
  ></v-row>
</template>
<script setup>
import { onMounted, ref } from "vue";
let chartOptions = {};
let data = ref([]);
onMounted({}); //TODO añadir colores
</script>
