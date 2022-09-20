<template>
  <v-container>
    <ApexChart
      type="rangeBar"
      height="300"
      :options="chartOptions"
      :series="chartData"
    ></ApexChart>
  </v-container>
</template>

<script>
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
    return {
      chartData: props.data,
      chartOptions: props.options,
    };
  },
};
</script>
