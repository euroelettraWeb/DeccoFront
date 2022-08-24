<template>
  <LineChart
    :chart-options="chartOptions"
    :chart-data="chartData"
    :chart-id="idD"
    :dataset-id-key="datasetIdKeyD"
    :plugins="pluginsD"
    :css-classes="cssClassesD"
    :styles="stylesD"
    :width="widthD"
    :height="heightD"
  />
</template>

<script>
import { Line as LineChart } from "vue-chartjs/legacy";

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

export default {
  name: "LineChart",
  components: {
    LineChart,
  },
  props: {
    chartId: {
      type: String,
      default: "line-chart",
    },
    datasetIdKey: {
      type: String,
      default: "label",
    },
    width: {
      type: Number,
      default: 400,
    },
    height: {
      type: Number,
      default: 400,
    },
    cssClasses: {
      default: "",
      type: String,
    },
    styles: {
      type: Object,
      default: () => {},
    },
    plugins: {
      type: Array,
      default: () => [],
    },
    bar: {
      type: Object,
      default: () => {},
    },
    options: {
      type: Object,
      default: () => {},
    },
  },
  setup(props) {
    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        annotation: {},
      },
    };

    return {
      chartData: props.bar,
      chartOptions: props.options ? props.options : chartOptions,
      idD: props.chartId,
      datasetIdKeyD: props.datasetIdKey,
      widthD: props.width,
      heightD: props.height,
      cssClassesD: props.cssClasses,
      stylesD: props.styles,
      pluginsD: props.plugins,
    };
  },
};
</script>
