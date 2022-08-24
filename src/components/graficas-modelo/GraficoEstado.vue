<template>
  <v-row>
    <v-col cols="12" @contextmenu="show">
      <LineChart class="graficoMP" v-bind="lineChartProps" />
      <v-menu
        v-model="showMenu"
        :position-x="x"
        :position-y="y"
        absolute
        offset-y
      >
        <v-list>
          <v-list-item @click="zoomReset">
            <v-list-item-title>Reset Zoom</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-col>
  </v-row>
</template>

<script>
import moment from "moment";
import { LineChart, useLineChart } from "vue-chart-3";
import { ref, computed, defineComponent, onBeforeUnmount } from "vue";
export default defineComponent({
  name: "GraficaEstado",
  components: {
    LineChart,
  },
  props: {
    alturaGrafico: { type: Number },
    variableIO: { type: Array },
    labelX: { type: Boolean },
  },
  setup(props, context) {
    let _variableIO = computed(() => {
      return props.variableIO ? props.variableIO : new Array();
    });

    let rangoMinimo = ref(0);
    let rangoMaximo = ref(1);

    let fechas = computed(function () {
      if (_variableIO.value[0]) {
        return _variableIO.value[0].registros.map((registro) => registro.x);
      } else {
        return new Array();
      }
    });

    let escalas = computed(function () {
      return {
        x: {
          type: "time",
          // min: fechas.value ? fechas.value[0] : 0,
          // max: fechas.value ? fechas.value[fechas.value.length-1] : 0,
          // min: zoomMin.value ? zoomMin.value : moment().subtract(8, 'hours').format('YYYY-MM-DDTHH:mm:ss'),
          // max: zoomMax.value ? zoomMax.value : moment().format('YYYY-MM-DDTHH:mm:ss'),
          min: moment().subtract(8, "hours").format("YYYY-MM-DDTHH:mm:ss"),
          max: moment().format("YYYY-MM-DDTHH:mm:ss"),
          ticks: {
            display: props.labelX,
            maxTicksLimit: 7,
            // sampleSize: 60,
            // maxRotation: 35,
            // minRotation: 35,
          },
          grid: {
            display: true,
          },
          time: {
            unit: "minute",
            displayFormats: {
              minute: "DD/MM HH:mm",
            },
          },
          title: {
            display: false,
            text: `Límite superior: ${rangoMaximo.value} | Límite inferior: ${rangoMinimo.value}`,
            font: {
              size: 20,
              weight: "600",
            },
          },
        },
        y: {
          // min: _variableIO.value[0] ? _variableIO.value[0].ejeMinimo : 0,
          // max: _variableIO.value[0] ? _variableIO.value[0].ejeMaximo : 0,
          min: rangoMinimo.value,
          max: rangoMaximo.value,
          ticks: {
            display: false,
            // sampleSize: 60,
          },
          grid: {
            display: false,
          },
          title: {
            display: true,
            text: _variableIO.value[0]
              ? _variableIO.value[0].unidadMedida
              : "unidad",
            font: {
              size: 20,
              weight: "600",
            },
          },
        },
      };
    });

    let zonasFondo = computed(function () {
      return {
        box1: {
          type: "box",
          drawTime: "beforeDatasetsDraw",
          xMin: moment().subtract(8, "hours").format("YYYY-MM-DDTHH:mm:ss"),
          xMax: moment().format("YYYY-MM-DDTHH:mm:ss"),
          yMin: 0,
          yMax: 1,
          backgroundColor: _variableIO.value[0]
            ? `#${_variableIO.value[0].colorFueraRango}`
            : "#fff",
        },
      };
    });

    let conjuntosDatos = computed(function () {
      if (_variableIO.value.length > 0) {
        let conjunto = new Array();
        for (let [index, variable] of _variableIO.value.entries()) {
          if (_variableIO.value[index]) {
            let elemento = {};
            elemento.label = variable.nombreCorto;
            elemento.backgroundColor = `#${variable.colorDentroRango}`;
            elemento.borderColor = `#${variable.colorDentroRango}`;
            elemento.borderWidth = 0;
            elemento.data = _variableIO.value[index].registros;
            elemento.stepped = true;
            elemento.fill = true;
            elemento.spanGaps = true;
            // elemento.lineTension = 0.5;
            // elemento.parsing = false;
            // elemento.hidden = false;
            conjunto.push(elemento);
          }
        }
        return conjunto;
      } else {
        return new Array();
      }
    });

    const chartData = computed(() => ({
      labels: fechas.value,
      datasets: conjuntosDatos.value,
    }));

    const options = computed(() => ({
      mantainAspectRatio: false,
      // parsing: {
      //     xAxisKey: "fecha",
      //     yAxisKey: "valor",
      // },
      elements: {
        line: {
          tension: 0,
        },
        point: {
          borderWidth: 0,
          radius: 0,
          hitRadius: 4,
        },
      },
      animation: {
        duration: 0,
      },
      hover: {
        animationDuration: 0,
      },
      responsiveAnimationDuration: 0,
      scales: escalas.value,
      interaction: {
        mode: "index",
      },
      plugins: {
        zoom: {
          zoom: {
            wheel: {
              enabled: true,
            },
            drag: {
              enabled: true,
              borderColor: "rgba(225,13,13)",
              borderWidth: 1,
            },
            pinch: {
              enabled: true,
            },
            mode: "x",
          },
        },
        autocolors: false,
        annotation: {
          annotations: zonasFondo.value,
        },
        tooltip: {
          enabled: true,
          intersect: true,
          position: "nearest",
        },
        legend: {
          display: false,
          position: "top",
        },
      },
    }));

    const { lineChartProps, lineChartRef } = useLineChart({
      chartData,
      options,
      height: props.alturaGrafico,
    });

    let gfInterval = ref(null);
    let showMenu = ref(false);
    let x = ref(0);
    let y = ref(0);
    let show = (e) => {
      e.preventDefault();
      showMenu.value = false;
      x.value = e.clientX;
      y.value = e.clientY;
      context.root.$nextTick(() => {
        showMenu.value = true;
      });
    };

    let zoomReset = function () {
      if (lineChartRef.value) {
        lineChartRef.value.chartInstance.resetZoom();
      }
    };

    onBeforeUnmount(() => {
      clearInterval(gfInterval.value);
    });

    return {
      rangoMinimo,
      rangoMaximo,
      _variableIO,
      fechas,
      escalas,
      zonasFondo,
      conjuntosDatos,
      lineChartProps,
      lineChartRef,
      showMenu,
      x,
      y,
      show,
      zoomReset,
    };
  },
});
</script>
