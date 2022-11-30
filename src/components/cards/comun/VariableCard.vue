<template>
  <v-container
    ><v-row>
      <v-col>
        <v-card class="pa-8">
          <v-row
            ><v-col><v-card-title>Variable</v-card-title></v-col>
          </v-row>
          <v-row>
            <v-col
              ><v-select
                :items="selectItems"
                label="Variable"
                item-text="name"
                item-value="id"
                persistent-hint
                return-object
                single-line
                @change="changeItem"
              ></v-select
            ></v-col>
          </v-row>
          <v-row>
            <v-col v-if="cargado">
              <ApexChart
                v-if="lineas"
                ref="chartRef"
                type="line"
                height="300"
                :options="chartOptions"
                :series="series"
              />
              <ApexChart
                v-else
                ref="chartRef2"
                type="rangeBar"
                height="300"
                :options="chartOptions2"
                :series="series2"
              />
            </v-col>
            <v-col v-else class="d-flex justify-center align-center">
              <v-progress-circular
                :size="100"
                :width="7"
                color="purple"
                indeterminate
              ></v-progress-circular>
            </v-col>
          </v-row>
        </v-card>
      </v-col> </v-row
  ></v-container>
</template>
<script>
export default {
  name: "VariableCard",
};
</script>
<script setup>
import bd from "../../../helpers/bd";
import { onMounted, ref, computed, reactive } from "vue";
import es from "apexcharts/dist/locales/es.json";
import io from "socket.io-client";
import moment from "moment";
const socket = io("http://localhost:3000");

async function changeItem(value) {
  if (value.unidadMedida == "I/0") {
    lineas.value = false;
    variable = await bd.obtenerDatosVariable(
      "8H",
      "registros",
      "formatoRangos",
      value.id
    );
    series2.value = variable.registros;
  } else {
    lineas.value = true;
    variable = await bd.obtenerDatosVariable(
      "8H",
      "registros",
      "formatoLinea",
      value.id
    );
    series.value = variable.registros;
  }
}

let cargado = ref(false);
let lineas = ref(true);
let variables = {};
let variable = {};
let selectItems = ref([]);

const chartRef = ref(null);
const chartRef2 = ref(null);
let series = ref([]);
let series2 = ref([]);
var lastZoom = null;
let chartOptions = computed(() => {
  return {
    chart: {
      locales: [es],
      defaultLocale: "es",
      animations: { enabled: false },
      events: {
        beforeZoom: (e, { xaxis }) => {
          if (moment(xaxis.min).isBefore(moment().subtract(8, "hours"))) {
            return {
              xaxis: {
                min: new Date(moment().subtract(8, "hours")).getTime(),
                max: xaxis.max,
              },
            };
          }
          if (moment(xaxis.max).isAfter(moment())) {
            return {
              xaxis: {
                min: xaxis.min,
                max: moment(),
              },
            };
          }
        },
        beforeResetZoom: function () {
          lastZoom = null;
          return {
            xaxis: {
              min: new Date(moment().subtract(8, "hours")).getTime(),
              max: moment(),
            },
          };
        },
        zoomed: function (_, value) {
          lastZoom = [value.xaxis.min, value.xaxis.max];
        },
      },
    },
    xaxis: {
      type: "datetime",
      datetimeUTC: false,
      min: new Date(moment().subtract(8, "hours")).getTime(),
      max: moment(),
    },
    stroke: {
      width: 1.9,
    },
  };
});

let chartOptions2 = computed(() => {
  return {
    chart: {
      height: 100,
      type: "rangeBar",
      locales: [es],
      defaultLocale: "es",
      animations: { enabled: false },
      events: {
        beforeZoom: (e, { xaxis }) => {
          if (moment(xaxis.min).isBefore(moment().subtract(8, "hours"))) {
            return {
              xaxis: {
                min: new Date(moment().subtract(8, "hours")).getTime(),
                max: xaxis.max,
              },
            };
          }
          if (moment(xaxis.max).isAfter(moment())) {
            return {
              xaxis: {
                min: xaxis.min,
                max: moment(),
              },
            };
          }
        },
        beforeResetZoom: function () {
          lastZoom = null;
          return {
            xaxis: {
              min: new Date(moment().subtract(8, "hours")).getTime(),
              max: moment(),
            },
          };
        },
        zoomed: function (_, value) {
          lastZoom = [value.xaxis.min, value.xaxis.max];
        },
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        rangeBarGroupRows: true,
      },
    },
    xaxis: {
      type: "datetime",
      datetimeUTC: false,
      min: new Date(moment().subtract(8, "hours")).getTime(),
      max: moment(),
    },
    tooltip: {
      x: {
        format: "dd/MM/yyyy HH:mm:ss",
      },
    },
  };
});

onMounted(async () => {
  cargado.value = false;
  variables = await bd.obtenerVariables();
  for (let index = 0; index < variables.length; index++) {
    const element = variables[index];
    selectItems.value.push({
      id: element.id,
      name: element.columna,
      unidadMedida: element.unidadMedida,
    });
  }
  //   socket.on("variable_46_actualizada", (data) => {
  //     series.value[0].data.push({
  //       x: new Date(moment(data.x).toISOString()).getTime(),
  //       y: data.y,
  //     });
  //     if (chartRef.value) {
  //       chartRef.value.updateSeries(series.value);
  //       if (lastZoom) chartRef.value.zoomX(lastZoom[0], lastZoom[1]);
  //     }
  //   });
  cargado.value = true;
});
</script>
