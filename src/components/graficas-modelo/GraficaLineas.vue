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
  watch,
  onBeforeUnmount,
  onMounted,
} from "vue";
export default defineComponent({
  name: "GraficaLineas",
  components: {
    LineChart,
  },
  props: {
    variables: { type: Array },
    alturaGrafico: { type: String },
  },
  setup(props, context) {
    let _variables = computed(() => {
      return props.variables ? props.variables : new Array();
    });
    let escalaSeleccionada = ref(0);

    let factorData = (data) => {
      let _data = data.map((e, i, a) => {
        let prev = a[i - 1];
        let next = a[i + 1];
        if (prev && next && e.y === prev.y && e.y === next.y) return null;
        return e;
      });
      return _data;
    };

    let rangoMinimo = computed(function () {
      if (_variables.value.length) {
        return _variables.value[escalaSeleccionada.value].rangoMinimo;
      } else {
        return 0;
      }
    });

    let rangoMaximo = computed(function () {
      if (_variables.value.length && escalaSeleccionada.value !== undefined) {
        return _variables.value[escalaSeleccionada.value].rangoMaximo;
      } else {
        return 0;
      }
    });

    let fechas = computed(() => {
      if (_variables.value.length && escalaSeleccionada.value !== undefined) {
        return _variables.value[escalaSeleccionada.value].registros.map(
          (registro) => registro.fecha.slice(0, -1)
        );
      } else {
        return new Array();
      }
    });

    let escalas = computed(() => {
      return {
        x: {
          type: "time",
          min: fechas.value ? fechas.value[0] : 0,
          max: fechas.value ? fechas.value[fechas.value.length - 1] : 0,
          ticks: {
            sampleSize: 60,
            // maxRotation: 35,
            // minRotation: 35,
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
          min: _variables.value[escalaSeleccionada.value]
            ? _variables.value[escalaSeleccionada.value].ejeMinimo
            : 0,
          max: _variables.value[escalaSeleccionada.value]
            ? _variables.value[escalaSeleccionada.value].ejeMaximo
            : 0,
          ticks: {
            sampleSize: 60,
          },
          title: {
            display: true,
            text: _variables.value[escalaSeleccionada.value]
              ? _variables.value[escalaSeleccionada.value].unidadMedida
              : "unidad",
            font: {
              size: 20,
              weight: "600",
            },
          },
        },
      };
    });

    let zonasFondo = computed(() => {
      return {
        box1: {
          type: "box",
          drawTime: "beforeDatasetsDraw",
          xMin: fechas.value ? fechas.value[0] : 0,
          xMax: fechas.value ? fechas.value[fechas.value.length - 1] : 0,
          yMin: _variables.value[escalaSeleccionada.value]
            ? _variables.value[escalaSeleccionada.value].ejeMinimo
            : 0,
          yMax: _variables.value[escalaSeleccionada.value]
            ? _variables.value[escalaSeleccionada.value].rangoMinimo
            : 0,
          backgroundColor: _variables.value[escalaSeleccionada.value]
            ? `#${_variables.value[escalaSeleccionada.value].colorFueraRango}`
            : "#fff",
        },
        box2: {
          type: "box",
          drawTime: "beforeDatasetsDraw",
          xMin: fechas.value ? fechas.value[0] : 0,
          xMax: fechas.value ? fechas.value[fechas.value.length - 1] : 0,
          yMin: _variables.value[escalaSeleccionada.value]
            ? _variables.value[escalaSeleccionada.value].rangoMaximo
            : 0,
          yMax: _variables.value[escalaSeleccionada.value]
            ? _variables.value[escalaSeleccionada.value].ejeMaximo
            : 0,
          backgroundColor: _variables.value[escalaSeleccionada.value]
            ? `#${_variables.value[escalaSeleccionada.value].colorFueraRango}`
            : "#fff",
        },
        box3: {
          type: "box",
          drawTime: "beforeDatasetsDraw",
          xMin: fechas.value ? fechas.value[0] : 0,
          xMax: fechas.value ? fechas.value[fechas.value.length - 1] : 0,
          yMin: _variables.value[escalaSeleccionada.value]
            ? _variables.value[escalaSeleccionada.value].rangoMinimo
            : 0,
          yMax: _variables.value[escalaSeleccionada.value]
            ? _variables.value[escalaSeleccionada.value].rangoMaximo
            : 0,
          backgroundColor: _variables.value[escalaSeleccionada.value]
            ? `#${_variables.value[escalaSeleccionada.value].colorDentroRango}`
            : "#fff",
        },
      };
    });

    let anotaciones = computed(() => {
      return Object.assign(zonasFondo.value);
    });

    let conjuntosDatos = computed(() => {
      if (_variables.value.length > 0) {
        let conjunto = new Array();
        for (let [index, variable] of _variables.value.entries()) {
          if (_variables.value[index]) {
            let elemento = {};
            elemento.label = variable.nombreCorto;
            elemento.backgroundColor = `#${variable.colorFondo}`;
            elemento.borderColor = `#${variable.colorLinea}`;
            elemento.data = factorData(
              _variables.value[index].registros.map((registro) => {
                return { x: registro.fecha.slice(0, -1), y: registro.valor };
              })
            );
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
          annotations: anotaciones.value,
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

    watch(lineChartRef, function () {
      if (lineChartRef.value) {
        gfInterval.value = setInterval(() => {
          lineChartRef.value.chartInstance.update();
        }, 10000);
      }
    });
    // });

    onMounted(() => {
      if (props.alturaGrafico) {
        lineChartRef.value.chartInstance.$streaming.canvas.parentNode.style[
          "max-height"
        ] = props.alturaGrafico + "px";
        lineChartRef.value.chartInstance.$streaming.canvas.parentNode.style[
          "height"
        ] = props.alturaGrafico + "px";
      }
    });

    onBeforeUnmount(() => {
      clearInterval(gfInterval.value);
    });

    return {
      rangoMinimo,
      rangoMaximo,
      factorData,
      _variables,
      anotaciones,
      fechas,
      escalas,
      escalaSeleccionada,
      zonasFondo,
      conjuntosDatos,
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
