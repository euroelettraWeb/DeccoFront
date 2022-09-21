<template>
  <v-container>
    <ApexChart
      ref="chart"
      height="350"
      type="line"
      :options="chartOptions"
      :series="chartData"
    ></ApexChart>
  </v-container>
</template>

<script>
import { inject, onMounted, ref } from "vue";
export default {
  name: "LineChart",
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
    onMounted(() => {
      // console.log(chart);
      // chart.value.zoomX(zoom.value[0], zoom.value[1]);
    });
    return {
      chart,
      chartData: props.data,
      chartOptions: props.options,
    };
  },
};
</script>
