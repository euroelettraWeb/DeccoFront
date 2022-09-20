<template>
  <v-container>
    <ApexChart
      height="350"
      type="line"
      :options="chartOptions"
      :series="chartData"
    ></ApexChart>
  </v-container>
</template>

<script>
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
    return {
      chartData: props.data,
      chartOptions: props.options,
    };
  },
};
</script>
