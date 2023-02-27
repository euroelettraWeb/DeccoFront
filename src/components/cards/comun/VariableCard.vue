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
              ><v-card-subtitle>Linea</v-card-subtitle>
              <v-select
                v-model="select"
                :items="nombres"
                label="Linea"
                item-text="nombre"
                item-value="id"
                :hide-selected="true"
                return-object
                dense
                solo
                @change="changeItem2"
              />
            </v-col>
            <v-col cols="6"
              ><v-card-subtitle>Sistema</v-card-subtitle>
              <v-select
                v-model="select2"
                :items="nombres2"
                label="Sistema"
                item-text="nombre"
                item-value="id"
                :hide-selected="true"
                return-object
                dense
                solo
                @change="changeItem3"
              ></v-select
            ></v-col>
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
import {
  obtenerLineas,
  obtenerMaquina,
  obtenerVariables,
} from "../../../helpers/bd";
import { onMounted, ref, computed, reactive } from "vue";
import es from "apexcharts/dist/locales/es.json";
import io from "socket.io-client";
import moment from "moment";
import { routerStore } from "../../../stores/index";
const socket = io("http://localhost:3000");

let cargado = ref(false);
let lineas = ref(true);
let variables = {};
let variable = {};
let selectItems = ref([]);
let lineaList = ref({});
let nombres = ref([]);
let select = ref(null);
let nombres2 = ref([]);
let select2 = ref({ id: 0, nombre: "" });

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
  lineaList.value = await obtenerLineas(routerStore().clienteID);
  let lista = [];
  for (const iterator of lineaList.value) {
    let sistemas = await obtenerMaquina("linea", iterator.id, 0);
    lista.push({
      id: iterator.id,
      nombre: iterator.nombre,
      sistemas: sistemas,
    });
  }
  nombres.value = lista;
  cargado.value = true;
});
async function changeItem(value) {
  if (value.unidadMedida == "I/0") {
    lineas.value = false;
    variable = await obtenerDatosVariableGeneral(
      "24H",
      "registros",
      "individual",
      "formatoRangos",
      [value.id],
      select2.value.id,
      routerStore().clienteID
    );
    series2.value = variable;
  } else {
    lineas.value = true;
    variable = await obtenerDatosVariableGeneral(
      "24H",
      "registros",
      "individual",
      "formatoLinea",
      [value.id],
      select2.value.id,
      routerStore().clienteID
    );
    series.value = variable;
  }
}
function changeItem2() {
  nombres2.value = select.value.sistemas;
}
async function changeItem3(value) {
  variables = await obtenerVariables();
  for (let index = 0; index < variables.length; index++) {
    const element = variables[index];

    if (element.maquinaID == value.id) {
      selectItems.value.push({
        id: element.id,
        name: element.nombreCorto,
        unidadMedida: element.unidadMedida,
      });
    }
  }
}
</script>
