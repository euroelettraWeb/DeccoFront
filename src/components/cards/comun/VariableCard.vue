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
                multiple
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
  obtenerDatosVariableGeneral,
} from "../../../helpers/bd";
import { onMounted, ref, computed } from "vue";
import es from "apexcharts/dist/locales/es.json";
import { routerStore } from "../../../stores/index";

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
let chartOptions = computed(() => {
  return {
    chart: {
      locales: [es],
      defaultLocale: "es",
      animations: { enabled: false },
      zoom: {
        type: "xy",
        autoScaleYaxis: true,
      },
    },
    xaxis: {
      type: "datetime",
      datetimeUTC: false,
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
  let IOs = value.map((x) => {
    if (value.unidadMedida == "I/0") {
      return x.id;
    }
  });
  let line = value.map((x) => {
    if (value.unidadMedida != "I/0") {
      return x.id;
    }
  });
  if (IOs.length > 0) {
    lineas.value = false;
    variable = await obtenerDatosVariableGeneral(
      "24H",
      "registros",
      "individual",
      "formatoRangos",
      IOs,
      select2.value.id,
      routerStore().clienteID
    );
    series2.value = variable;
  }
  if (line.length > 0) {
    lineas.value = true;
    variable = await obtenerDatosVariableGeneral(
      "24H",
      "registros",
      "individual",
      "formatoLinea",
      line,
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
        id: element.modelo,
        name: element.nombreCorto,
        unidadMedida: element.unidadMedida,
      });
    }
  }
}
</script>
