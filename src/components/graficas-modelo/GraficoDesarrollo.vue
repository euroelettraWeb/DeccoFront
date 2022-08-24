<!-- <template>
  <v-row>
    <v-col cols="12" @contextmenu="show">
      <LineChart v-bind="lineChartProps" />
      <v-menu
        v-model="showMenu"
        :position-x="x"
        :position-y="y"
        absolute
        offset-y
      >
        <v-list>
          <v-list-item>
            <v-list-item-title @click="zoomReset">Reset Zoom</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-col>
  </v-row>
</template>

<script>
import { LineChart, useLineChart } from "vue-chart-3";
import {
  ref,
  computed,
  defineComponent,
  onBeforeUnmount,
  onMounted,
} from "vue";
import moment from "moment";
export default defineComponent({
  name: "GraficaDesarrollo",

  components: {
    LineChart,
  },
  props: {
    alturaGrafico: { type: Number },
    desarrollo: { type: Array },
    empalmes: { type: Array },
    eje: { type: Array },
  },

  setup(props, context) {
    const store = context.root.$store;
    let ordenEnCurso = computed(() => store.getters.ofEnCurso);
    let zoomMin = ref(null);
    let zoomMax = ref(null);

    let rangoMinimo = function () {
      return (
        parseFloat(ordenEnCurso.value.desarrolloN) +
        parseFloat(props.desarrollo[0].rangoMinimo)
      );
    };

    // console.log('Rango minimo', rangoMinimo)

    let rangoMaximo = function () {
      return (
        parseFloat(ordenEnCurso.value.desarrolloN) +
        parseFloat(props.desarrollo[0].rangoMaximo)
      );
    };

    let fechas = function () {
      return props.desarrollo[0].registros.map((registro) => registro.x);
    };

    let escalas = function () {
      return {
        x: {
          type: "time",
          min: zoomMin.value
            ? zoomMin.value
            : moment().subtract(8, "hours").format("YYYY-MM-DDTHH:mm:ss"),
          max: zoomMax.value
            ? zoomMax.value
            : moment().format("YYYY-MM-DDTHH:mm:ss"),
          ticks: {
            sampleSize: 60,
          },
          time: {
            unit: "minute",
            displayFormats: {
              minute: "DD/MM HH:mm",
            },
          },
          title: {
            display: false,
            text: `Límite superior: ${rangoMaximo()} | Límite inferior: ${rangoMinimo()}`,
            font: {
              size: 20,
              weight: "600",
            },
          },
        },
        y: {
          min:
            parseFloat(ordenEnCurso.value.desarrolloN) +
            parseFloat(props.desarrollo[0].ejeMinimo),
          max:
            parseFloat(ordenEnCurso.value.desarrolloN) +
            parseFloat(props.desarrollo[0].ejeMaximo),
          ticks: {
            stepSize: 0.1,
            autoSkip: false,
          },
          title: {
            display: true,
            text: props.desarrollo[0].unidadMedida,
            font: {
              size: 20,
              weight: "600",
            },
          },
        },
      };
    };

    let zonasFondo = function () {
      return {
        box1: {
          type: "box",
          drawTime: "beforeDatasetsDraw",
          xMin: zoomMin.value
            ? zoomMin.value
            : moment().subtract(8, "hours").format("YYYY-MM-DDTHH:mm:ss"),
          xMax: zoomMax.value
            ? zoomMax.value
            : moment().format("YYYY-MM-DDTHH:mm:ss"),
          // xMin: zoomMin.value ? zoomMin.value : fechas()[0],
          // xMax: zoomMax.value ? zoomMax.value : fechas()[fechas().length - 1],
          yMin:
            parseFloat(ordenEnCurso.value.desarrolloN) +
            parseFloat(props.desarrollo[0].ejeMinimo),
          yMax:
            parseFloat(ordenEnCurso.value.desarrolloN) +
            parseFloat(props.desarrollo[0].rangoMinimo),
          backgroundColor: `#${props.desarrollo[0].colorFueraRango}`,
        },
        box2: {
          type: "box",
          drawTime: "beforeDatasetsDraw",
          xMin: zoomMin.value
            ? zoomMin.value
            : moment().subtract(8, "hours").format("YYYY-MM-DDTHH:mm:ss"),
          xMax: zoomMax.value
            ? zoomMax.value
            : moment().format("YYYY-MM-DDTHH:mm:ss"),
          // xMin: zoomMin.value ? zoomMin.value : fechas()[0],
          // xMax: zoomMax.value ? zoomMax.value : fechas()[fechas().length - 1],
          yMin:
            parseFloat(ordenEnCurso.value.desarrolloN) +
            parseFloat(props.desarrollo[0].rangoMaximo),
          yMax:
            parseFloat(ordenEnCurso.value.desarrolloN) +
            parseFloat(props.desarrollo[0].ejeMaximo),
          backgroundColor: `#${props.desarrollo[0].colorFueraRango}`,
        },
        box3: {
          type: "box",
          drawTime: "beforeDatasetsDraw",
          xMin: zoomMin.value
            ? zoomMin.value
            : moment().subtract(8, "hours").format("YYYY-MM-DDTHH:mm:ss"),
          xMax: zoomMax.value
            ? zoomMax.value
            : moment().format("YYYY-MM-DDTHH:mm:ss"),
          // xMin: zoomMin.value ? zoomMin.value : fechas()[0],
          // xMax: zoomMax.value ? zoomMax.value : fechas()[fechas().length - 1],
          yMin:
            parseFloat(ordenEnCurso.value.desarrolloN) +
            parseFloat(props.desarrollo[0].rangoMinimo),
          yMax:
            parseFloat(ordenEnCurso.value.desarrolloN) +
            parseFloat(props.desarrollo[0].rangoMaximo),
          backgroundColor: `#${props.desarrollo[0].colorDentroRango}`,
        },
        setpoint: {
          type: "line",
          drawTime: "afterDatasetsDraw",
          // xMin: zoomMin.value ? zoomMin.value : fechas()[0],
          // xMax: zoomMax.value ? zoomMax.value : fechas()[fechas().length - 1],
          yMin: parseFloat(ordenEnCurso.value.desarrolloN),
          yMax: parseFloat(ordenEnCurso.value.desarrolloN),
          borderColor: "#09d939",
          // borderWidth: 2,
        },
      };
    };

    let lineasEmpalmes = function () {
      let lv = {};
      for (let [
        index,
        registro,
      ] of props.empalmes[0].registrosFiltrados.entries()) {
        lv[`empalmes${index}`] = {
          type: "line",
          xMin: registro.x,
          xMax: registro.x,
          borderColor: `#${props.empalmes[0].colorLinea}`,
          borderWidth: 5,
          label: {
            enabled: false,
            // rotation:270,
            content: `Empalme: ${moment(registro.x).format("DD/MM HH:mm:ss")}`,
          },
          enter: muestraTooltip,
          leave: muestraTooltip,
        };
      }
      return lv;
    };

    let lineasEje = () => {
      let lv = {};
      for (let [index, registro] of props.eje[0].registrosFiltrados.entries()) {
        lv[`eje${index}`] = {
          type: "line",
          xMin: registro.x,
          xMax: registro.x,
          borderColor: `#${props.eje[0].colorLinea}`,
          borderWidth: 5,
          label: {
            enabled: false,
            // rotation:270,
            content: `Cambio de eje: ${moment(registro.x).format(
              "DD/MM HH:mm:ss"
            )}`,
          },
          enter: muestraTooltip,
          leave: muestraTooltip,
        };
      }
      return lv;
    };

    let anotaciones = () => {
      return Object.assign(zonasFondo(), lineasEmpalmes(), lineasEje());
    };

    let conjuntosDatos = () => {
      let conjunto = new Array();
      for (let [index, variable] of props.desarrollo.entries()) {
        let elemento = {};
        elemento.label = variable.nombreCorto;
        elemento.backgroundColor = `#${variable.colorFondo}`;
        elemento.borderColor = `#${variable.colorLinea}`;
        elemento.data = props.desarrollo[index].registros;
        // elemento.spanGaps = false;
        // elemento.lineTension = 0.5;
        // elemento.parsing = false;
        // elemento.hidden = false;
        conjunto.push(elemento);
      }
      return conjunto;
    };

    const chartData = computed(() => ({
      labels: fechas(),
      datasets: conjuntosDatos(),
    }));

    const options = computed(() => ({
      spanGaps: true,
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
          borderWidth: 1,
          radius: 2,
        },
      },
      animation: {
        duration: 0,
      },
      hover: {
        animationDuration: 0,
      },
      responsiveAnimationDuration: 0,
      scales: escalas(),
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
              enabled: false,
              borderColor: "rgba(225,13,13)",
              borderWidth: 1,
            },
            pinch: {
              enabled: true,
            },
            mode: "x",
            onZoom: ({ chart }) => {
              zoomMin.value = chart.getDatasetMeta(0)._scaleRanges.xmin;
              zoomMax.value = chart.getDatasetMeta(0)._scaleRanges.xmax;
            },
          },
          pan: {
            enabled: true,
            mode: "x",
            onPan: ({ chart }) => {
              zoomMin.value = chart.getDatasetMeta(0)._scaleRanges.xmin;
              zoomMax.value = chart.getDatasetMeta(0)._scaleRanges.xmax;
            },
          },
        },
        autocolors: false,
        annotation: {
          annotations: anotaciones(),
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

    let { lineChartProps, lineChartRef } = useLineChart({
      chartData,
      options,
      height: props.alturaGrafico,
    });

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
        zoomMin.value = null;
        zoomMax.value = null;
      }
    };

    let muestraTooltip = function (ctx) {
      if (lineChartRef.value) {
        let annotation = ctx.id;
        let mostrado =
          lineChartRef.value.chartInstance.config.options.plugins.annotation
            .annotations[annotation].label.enabled;
        lineChartRef.value.chartInstance.config.options.plugins.annotation.annotations[
          annotation
        ].label.enabled = !mostrado;
      }
    };

    onBeforeUnmount(() => {
      lineChartRef.value.chartInstance.destroy();
      lineChartRef.value = null;
    });

    return {
      lineChartProps,
      lineChartRef,
      showMenu,
      x,
      y,
      show,
      zoomReset,
      muestraTooltip,
    };
  },
});
</script> -->
