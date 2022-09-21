<template>
  <v-container>
    <ApexChart
      ref="chart"
      type="rangeBar"
      height="300"
      :options="chartOptions"
      :series="chartData"
    ></ApexChart>
  </v-container>
</template>

<script>
import { ref } from "vue";
export default {
  name: "StatusChart",
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    options: {
      type: Object,
      default: () => {},
    },
  },
  setup(props) {
    const chart = ref(null);
    return {
      chart,
      chartData: props.data,
      chartOptions: props.options,
    };
  },
};
</script>
