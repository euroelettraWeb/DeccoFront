<template>
  <v-container
    ><v-row>
      <v-col>
        <v-card>
          <v-row>
            <v-col>
              <v-card-title> DECCODOS </v-card-title>
            </v-col>
          </v-row>
          <v-row class="pl-8">
            <v-col
              ><date-picker
                apply-button-label="Use"
                :date-input="dateInput"
                :format="'DD MM YYYY HH:mm'"
                :same-date-format="sameDateFormat"
                @date-applied="dateApplied"
                @on-reset="onReset"
            /></v-col>
          </v-row>
          <v-row>
            <v-col v-if="cargado">
              <v-col v-if="cargado7">
                <v-simple-table dense>
                  <template #default>
                    <thead>
                      <tr>
                        <th class="text-left"></th>
                        <th
                          v-for="item in consumos"
                          :key="item.id"
                          class="text-left"
                        >
                          {{ item.nombre }}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Total</td>
                        <td v-for="item in consumos" :key="item.id">
                          {{ item.total }}
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-col>
              <v-col v-if="cargado8">
                <v-simple-table dense>
                  <template #default>
                    <thead>
                      <tr>
                        <th class="text-left"></th>
                        <th
                          v-for="item in alarmas"
                          :key="item.id"
                          class="text-left"
                        >
                          {{ item.nombre }}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Total</td>
                        <td v-for="item in alarmas" :key="item.id">
                          {{ item.total }}
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-col>
              <v-col v-else class="d-flex justify-center align-center">
                <v-progress-circular
                  :size="100"
                  :width="7"
                  color="purple"
                  indeterminate
                ></v-progress-circular>
              </v-col>
              <v-col v-if="cargado1">
                <ApexChart
                  ref="chartRef"
                  type="rangeBar"
                  height="300"
                  :options="rangeOptions"
                  :series="series"
              /></v-col>
              <v-col v-else class="d-flex justify-center align-center">
                <v-progress-circular
                  :size="100"
                  :width="7"
                  color="purple"
                  indeterminate
                ></v-progress-circular>
              </v-col>
              <v-col v-if="cargado2">
                <ApexChart
                  ref="chartRef2"
                  type="rangeBar"
                  height="300"
                  :options="rangeOptions"
                  :series="series2"
              /></v-col>
              <v-col v-else class="d-flex justify-center align-center">
                <v-progress-circular
                  :size="100"
                  :width="7"
                  color="purple"
                  indeterminate
                ></v-progress-circular>
              </v-col>
              <!-- <ApexChart
                ref="chartRef3"
                type="rangeBar"
                height="200"
                :options="rangeOptions"
                :series="series3"
              /> -->
              <v-col v-if="cargado3">
                <ApexChart
                  ref="chartRef4"
                  type="line"
                  height="300"
                  :options="chartOptions"
                  :series="seriesL"
              /></v-col>
              <v-col v-else class="d-flex justify-center align-center">
                <v-progress-circular
                  :size="100"
                  :width="7"
                  color="purple"
                  indeterminate
                ></v-progress-circular>
              </v-col>
              <v-col v-if="cargado4">
                <ApexChart
                  ref="chartRef5"
                  type="line"
                  height="300"
                  :options="chartOptions"
                  :series="seriesL2"
              /></v-col>
              <v-col v-else class="d-flex justify-center align-center">
                <v-progress-circular
                  :size="100"
                  :width="7"
                  color="purple"
                  indeterminate
                ></v-progress-circular>
              </v-col>
              <v-col v-if="cargado5">
                <ApexChart
                  ref="chartRef6"
                  type="line"
                  height="300"
                  :options="chartOptions"
                  :series="seriesL3"
              /></v-col>
              <v-col v-else class="d-flex justify-center align-center">
                <v-progress-circular
                  :size="100"
                  :width="7"
                  color="purple"
                  indeterminate
                ></v-progress-circular>
              </v-col>
              <v-col v-if="cargado6">
                <ApexChart
                  ref="chartRef7"
                  type="line"
                  height="300"
                  :options="chartOptions"
                  :series="seriesL4"
              /></v-col>
              <v-col v-else class="d-flex justify-center align-center">
                <v-progress-circular
                  :size="100"
                  :width="7"
                  color="purple"
                  indeterminate
                ></v-progress-circular>
              </v-col>
            </v-col>
          </v-row>
        </v-card>
      </v-col> </v-row
  ></v-container>
</template>
<script>
export default {
  name: "DECCODOSHistoricoCard",
};
</script>
<script setup>
import { obtenerDatosVariableGeneral } from "../../../helpers/bd";
import { onMounted, ref, computed, reactive, onUnmounted } from "vue";
import { routerStore } from "../../../stores/index";
import es from "apexcharts/dist/locales/es.json";
import moment from "moment";
import DatePicker from "vue-time-date-range-picker/dist/vdprDatePicker";

const props = defineProps({
  linea: { type: Number, default: 1 },
  maquina: { type: Number, default: 1 },
});

function onReset() {
  inicio.value = "";
  fin.value = "";
}
async function dateApplied(date1, date2) {
  inicio.value = moment(date1).format("YYYY-MM-DDTHH:mm:ss");
  fin.value = moment(date2).format("YYYY-MM-DDTHH:mm:ss");
  let estado = {};
  let marcha = {};
  let funcMaquina = {};
  let dosis = {};
  let cporu = {};
  let cajas = {};
  let kilos = {};
  let alarma = {};
  series.value = [];
  series2.value = [];
  seriesL.value = [];
  seriesL2.value = [];
  seriesL3.value = [];
  seriesL4.value = [];

  cargado.value = false;
  cargado1.value = false;
  cargado2.value = false;
  cargado3.value = false;
  cargado4.value = false;
  cargado5.value = false;
  cargado6.value = false;
  cargado7.value = false;
  cargado.value = false;
  estado = await obtenerDatosVariableGeneral(
    "historico",
    "registros",
    "individual",
    "formatoRangos",
    [31],
    props.maquina,
    routerStore().clienteID,
    inicio.value,
    fin.value
  );
  let autoManual = await obtenerDatosVariableGeneral(
    "historico",
    "registros",
    "individual",
    "formatoRangos",
    [41, 43],
    props.maquina,
    routerStore().clienteID,
    inicio.value,
    fin.value
  );
  for (let index = 0; index < autoManual[1].data.length; index++) {
    const element = autoManual[1].data[index];
    estado[1].data.push(element);
  }
  series.value = estado;
  cargado1.value = true;
  marcha = await obtenerDatosVariableGeneral(
    "historico",
    "registros",
    "multiple",
    "marchaFormatoRangos",
    [31, 40, 42],
    props.maquina,
    routerStore().clienteID,
    inicio.value,
    fin.value
  );
  funcMaquina = await obtenerDatosVariableGeneral(
    "historico",
    "registros",
    "individual",
    "formatoRangos",
    [40, 42],
    props.maquina,
    routerStore().clienteID,
    inicio.value,
    fin.value
  );
  for (let index = 0; index < funcMaquina[1].data.length; index++) {
    const element = funcMaquina[1].data[index];
    if (element.x == "Alarma") {
      element.fillColor = "#fdd835";
    } else {
      element.fillColor = "#3949ab";
    }
    marcha[1].data.push(element);
  }
  series2.value = marcha;
  cargado2.value = true;
  dosis = await obtenerDatosVariableGeneral(
    "historico",
    "registros",
    "individual",
    "formatoLinea",
    [34, 35, 36, 37, 38],
    props.maquina,
    routerStore().clienteID,
    inicio.value,
    fin.value
  );
  seriesL.value = dosis;
  cargado3.value = true;
  kilos = await obtenerDatosVariableGeneral(
    "historico",
    "registros",
    "individual",
    "formatoLinea",
    [48],
    props.maquina,
    routerStore().clienteID,
    inicio.value,
    fin.value
  );
  seriesL4.value = kilos;
  cargado4.value = true;
  cajas = await obtenerDatosVariableGeneral(
    "historico",
    "registros",
    "individual",
    "unidadMinuto",
    [47],
    props.maquina,
    routerStore().clienteID,
    inicio.value,
    fin.value
  );
  seriesL3.value = cajas;
  cargado5.value = true;
  cporu = await obtenerDatosVariableGeneral(
    "historico",
    "registros",
    "individual",
    "formatoLinea",
    [45, 46],
    props.maquina,
    routerStore().clienteID,
    inicio.value,
    fin.value
  );
  seriesL2.value = cporu;
  cargado6.value = true;
  totales = await obtenerDatosVariableGeneral(
    "historico",
    "totales",
    "individual",
    "sinfiltro",
    [51, 52, 53, 54, 54, 56],
    props.maquina,
    routerStore().clienteID,
    inicio.value,
    fin.value
  );
  series.value = estado;
  let total = [];
  for (let index = 0; index < totales.length; index++) {
    const element = totales[index];
    total.push({
      id: index,
      nombre: element.nombreCorto + "( " + element.unidadMedida + " )",
      total: Math.max(0, element.registros[0].total),
    });
  }
  consumos.value = total;
  cargado7.value = true;
  alarma = await obtenerDatosVariableGeneral(
    "historico",
    "totales",
    "individual",
    "sinfiltro",
    [1, 12, 14, 73, 74, 75],
    props.maquina,
    routerStore().clienteID,
    inicio.value,
    fin.value
  );
  let totalA = [];
  for (let index = 0; index < alarma.length; index++) {
    const element = alarma[index];
    totalA.push({
      id: index,
      nombre: element.nombreCorto + "( " + element.unidadMedida + " )",
      total: Math.max(0, element.registros[0].total),
    });
  }
  alarmas.value = totalA;
  cargado8.value = true;
  cargado.value = true;
}

let cargado = ref(false);
let cargado1 = ref(false);
let cargado2 = ref(false);
let cargado3 = ref(false);
let cargado4 = ref(false);
let cargado5 = ref(false);
let cargado6 = ref(false);
let cargado7 = ref(false);

const chartRef = ref(null);
const chartRef2 = ref(null);
const chartRef3 = ref(null);
const chartRef4 = ref(null);
const chartRef5 = ref(null);
const chartRef6 = ref(null);
const chartRef7 = ref(null);
const chartRef8 = ref(null);
let series = ref([]);
let series2 = ref([]);
let series3 = ref([]);
let seriesL = ref([]);
let seriesL2 = ref([]);
let seriesL3 = ref([]);
let seriesL4 = ref([]);

let consumos = ref([]);
let alarmas = ref([]);
let totales = {};

let sameDateFormat = {
  from: "DD MM YYYY, HH:mm",
  to: "HH:mm",
};
let inicio = ref("");
let fin = ref("");

let dateInput = {
  placeholder: "Seleccionar fechas",
  inputClass: "selectdates",
};
let chartOptions = computed(() => {
  return {
    chart: {
      locales: [es],
      defaultLocale: "es",
      animations: { enabled: false },
    },
    xaxis: {
      type: "datetime",
      datetimeUTC: false,
      tickAmount: 25,
      labels: {
        minHeight: 125,
        rotate: -70,
        minHeight: 125,
        rotateAlways: true,
        formatter: function (value, timestamp) {
          return moment.utc(value).format("DD/MM/yyyy HH:mm:ss"); // The formatter function overrides format property
        },
      },
    },
    stroke: {
      width: 1.9,
      height: 60,
      showForSingleSeries: true,
    },
    tooltip: {
      x: {
        format: "dd/MM/yyyy HH:mm:ss",
      },
    },
    legend: {
      showForSingleSeries: true,
    },
  };
});

let rangeOptions = computed(() => {
  return {
    chart: {
      type: "rangeBar",
      locales: [es],
      defaultLocale: "es",
      animations: { enabled: false },
    },
    colors: [
      function ({ value, seriesIndex, w }) {
        if (seriesIndex == 0) {
          return "#d50000";
        } else {
          return "#00c853";
        }
      },
    ],
    plotOptions: {
      bar: {
        horizontal: true,
        rangeBarGroupRows: true,
      },
    },
    xaxis: {
      type: "datetime",
      datetimeUTC: false,
      tickAmount: 25,
      labels: {
        minHeight: 125,
        rotate: -70,
        rotateAlways: true,
        formatter: function (value, timestamp) {
          return moment.utc(value).format("DD/mmm/yyyy HH:mm:ss"); // The formatter function overrides format property
        },
      },
    },
    tooltip: {
      x: {
        format: "dd/MM/yyyy HH:mm:ss",
      },
    },
    legend: {
      showForSingleSeries: true,
    },
  };
});
let estado = {};
let marcha = {};
let funcMaquina = {};
let dosis = {};
let cporu = {};
let cajas = {};
let kilos = {};
let alarma = {};
onMounted(async () => {
  cargado.value = false;
  cargado1.value = false;
  estado = await obtenerDatosVariableGeneral(
    "8H",
    "registros",
    "individual",
    "formatoRangos",
    [31],
    props.maquina,
    routerStore().clienteID
  );
  let autoManual = await obtenerDatosVariableGeneral(
    "8H",
    "registros",
    "individual",
    "formatoRangos",
    [41, 43],
    props.maquina,
    routerStore().clienteID
  );
  for (let index = 0; index < autoManual[1].data.length; index++) {
    const element = autoManual[1].data[index];
    estado[1].data.push(element);
  }
  series.value = estado;
  cargado1.value = true;
  cargado2.value = false;
  marcha = await obtenerDatosVariableGeneral(
    "8H",
    "registros",
    "multiple",
    "marchaFormatoRangos",
    [31, 40, 42],
    props.maquina,
    routerStore().clienteID
  );
  funcMaquina = await obtenerDatosVariableGeneral(
    "8H",
    "registros",
    "individual",
    "formatoRangos",
    [40, 42],
    props.maquina,
    routerStore().clienteID
  );
  for (let index = 0; index < funcMaquina[1].data.length; index++) {
    let element = funcMaquina[1].data[index];
    if (element.x == "Alarma") {
      element.fillColor = "#fdd835";
    } else {
      element.fillColor = "#3949ab";
    }
    marcha[1].data.push(element);
  }
  series2.value = marcha;
  // let cepillos = await obtenerDatosVariableGeneral(
  //   "8H",
  //   "registros",
  //   "formatoRangos",
  //   [44],
  //   null,
  //   null,
  //   props.maquina
  // );
  // series3.value = cepillos;
  cargado2.value = true;
  cargado3.value = false;
  dosis = await obtenerDatosVariableGeneral(
    "8H",
    "registros",
    "individual",
    "formatoLinea",
    [34, 35, 36, 37, 38],
    props.maquina,
    routerStore().clienteID
  );
  seriesL.value = dosis;
  cargado3.value = true;
  cargado4.value = false;
  kilos = await obtenerDatosVariableGeneral(
    "8H",
    "registros",
    "individual",
    "formatoLinea",
    [48],
    props.maquina,
    routerStore().clienteID
  );
  seriesL4.value = kilos;
  cargado4.value = true;
  cargado5.value = false;
  cajas = await obtenerDatosVariableGeneral(
    "8H",
    "registros",
    "individual",
    "unidadMinuto",
    [47],
    props.maquina,
    routerStore().clienteID
  );
  seriesL3.value = cajas;
  cargado5.value = true;
  cargado6.value = false;
  cporu = await obtenerDatosVariableGeneral(
    "8H",
    "registros",
    "individual",
    "formatoLinea",
    [45, 46],
    props.maquina,
    routerStore().clienteID
  );
  seriesL2.value = cporu;
  cargado6.value = true;
  cargado7.value = false;
  totales = await obtenerDatosVariableGeneral(
    "8H",
    "totales",
    "individual",
    "sinfiltro",
    [51, 52, 53, 54, 54, 56],
    props.maquina,
    routerStore().clienteID
  );
  for (let index = 0; index < totales.length; index++) {
    const element = totales[index];
    consumos.value.push({
      id: index,
      nombre: element.nombreCorto + "( " + element.unidadMedida + " )",
      total: Math.max(0, element.registros[0].total),
    });
  }
  cargado7.value = true;
  cargado8.value = false;
  alarma = await obtenerDatosVariableGeneral(
    "8H",
    "registros",
    "individual",
    "totalRangos",
    [40, 42],
    props.maquina,
    routerStore().clienteID
  );
  for (let index = 0; index < totales.length; index++) {
    const element = alarma[index];
    alarmas.value.push({
      id: index,
      nombre: element.nombreCorto + "( min )",
      total: Math.max(0, Math.round(element.registros.total1 / 60)),
    });
  }
  cargado8.value = true;
  cargado.value = true;
});
onUnmounted(() => {
  series.value = [];
  series2.value = [];
  seriesL.value = [];
  seriesL2.value = [];
  seriesL3.value = [];
  seriesL4.value = [];
  consumos.value = [];
  alarmas.value = [];
});
</script>
<style>
.vdpr-datepicker .selectdates {
  border: 1px solid #000;
  padding: 12px;
  width: 300px;
}
</style>
