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
          <v-row class="pa-8">
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
              <ApexChart
                ref="chartRef"
                type="rangeBar"
                height="300"
                :options="rangeOptions"
                :series="series"
              />
              <ApexChart
                ref="chartRef2"
                type="rangeBar"
                height="300"
                :options="rangeOptions"
                :series="series2"
              />
              <ApexChart
                ref="chartRef3"
                type="rangeBar"
                height="200"
                :options="rangeOptions"
                :series="series3"
              />
              <ApexChart
                ref="chartRef4"
                type="line"
                height="300"
                :options="chartOptions"
                :series="seriesL"
              />
              <ApexChart
                ref="chartRef5"
                type="line"
                height="300"
                :options="chartOptions"
                :series="seriesL2"
              />
              <ApexChart
                ref="chartRef6"
                type="line"
                height="300"
                :options="chartOptions"
                :series="seriesL3"
              />
              <ApexChart
                ref="chartRef7"
                type="line"
                height="300"
                :options="chartOptions"
                :series="seriesL4"
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
  name: "DECCODOSHistoricoCard",
};
</script>
<script setup>
import axios from "axios";
import { onMounted, ref, computed, reactive } from "vue";
import { routerStore } from "../../../stores/index";
import es from "apexcharts/dist/locales/es.json";
import io from "socket.io-client";
import moment from "moment";
import DatePicker from "vue-time-date-range-picker/dist/vdprDatePicker";

const socket = io("http://localhost:3000");

async function obtenerDatosVariable(operacion, modo, filtrado, variableID) {
  return (
    await axios.post(
      `${process.env.VUE_APP_RUTA_API}/variable/${operacion}/${modo}/${filtrado}/${variableID}`
    )
  ).data;
}

async function obtenerDatosHistoricoVariable(
  operacion,
  modo,
  filtrado,
  variables,
  inicio,
  fin
) {
  return (
    await axios.post(
      `${process.env.VUE_APP_RUTA_API}/variable/multiple/${operacion}/${modo}/${filtrado}/`,
      { variables, inicio, fin }
    )
  ).data;
}

async function obtenerMarcha(modo, variables, inicio, fin, operacion) {
  return (
    await axios.post(
      `${process.env.VUE_APP_RUTA_API}/variable/marcha/${modo}/${operacion}`,
      {
        variables,
        inicio,
        fin,
      }
    )
  ).data;
}
function onReset() {
  inicio.value = "";
  fin.value = "";
}
async function dateApplied(date1, date2) {
  // this.events.push(
  //   new Event("date-applied", `${date1.toString()} - ${date2.toString()}`)
  // );
  inicio.value = moment(date1).format("YYYY-MM-DDTHH:mm:ss");
  fin.value = moment(date2).format("YYYY-MM-DDTHH:mm:ss");
  let estado = {};
  let marcha = {};
  let funcMaquina = {};
  let dosis = {};
  let cporu = {};
  let cajas = {};
  let kilos = {};

  cargado.value = false;
  estado = await obtenerDatosHistoricoVariable(
    "historico",
    "registros",
    "formatoRangos",
    [31],
    inicio.value,
    fin.value
  );
  let autoManual = await obtenerDatosHistoricoVariable(
    "historico",
    "registros",
    "formatoRangos",
    [41, 43]
  );
  for (let index = 0; index < autoManual[1].data.length; index++) {
    const element = autoManual[1].data[index];
    estado[1].data.push(element);
  }
  marcha = await obtenerMarcha(
    "historico",
    [31, 41, 43, 40, 42],
    inicio.value,
    fin.value,
    "registros"
  );
  funcMaquina = await obtenerDatosHistoricoVariable(
    "historico",
    "registros",
    "formatoRangos",
    [40, 42],
    inicio.value,
    fin.value
  );
  let cepillos = await obtenerDatosHistoricoVariable(
    "historico",
    "registros",
    "formatoRangos",
    [44],
    inicio.value,
    fin.value
  );
  series3.value = cepillos;
  dosis = await obtenerDatosHistoricoVariable(
    "historico",
    "registros",
    "formatoLinea",
    [34, 35, 36, 37, 38],
    inicio.value,
    fin.value
  );
  kilos = await obtenerDatosHistoricoVariable(
    "historico",
    "registros",
    "formatoLinea",
    [48],
    inicio.value,
    fin.value
  );
  cajas = await obtenerDatosHistoricoVariable(
    "historico",
    "registros",
    "formatoLinea",
    [47],
    inicio.value,
    fin.value
  );
  cporu = await obtenerDatosHistoricoVariable(
    "historico",
    "registros",
    "formatoLinea",
    [45, 46],
    inicio.value,
    fin.value
  );
  totales = await obtenerDatosHistoricoVariable(
    "historico",
    "totales",
    "sinfiltro",
    [51, 52, 53, 54, 54, 56],
    inicio.value,
    fin.value
  );
  series.value = estado;
  for (let index = 0; index < funcMaquina[1].data.length; index++) {
    const element = funcMaquina[1].data[index];
    marcha[1].data.push(element);
  }
  series2.value = marcha;
  seriesL.value = dosis;
  seriesL2.value = cporu;
  seriesL3.value = cajas;
  seriesL4.value = kilos;
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
  cargado.value = true;
}

let cargado = ref(false);

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
      // datetimeUTC: false,
      tickAmount: 25,
      labels: {
        rotate: -45,
        minHeight: 125,
        rotateAlways: true,
        formatter: function (value, timestamp) {
          return new Date(value).toLocaleString(); // The formatter function overrides format property
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
        format: "dd MMM yyyy HH:mm:ss",
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
      // datetimeUTC: false,
      tickAmount: 25,
      labels: {
        minHeight: 125,
        rotate: -45,
        rotateAlways: true,
        formatter: function (value, timestamp) {
          return new Date(value).toLocaleString(); // The formatter function overrides format property
        },
      },
    },
    tooltip: {
      x: {
        format: "dd MMM yyyy HH:mm:ss",
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
onMounted(async () => {
  cargado.value = false;
  estado = await obtenerDatosHistoricoVariable(
    "8h",
    "registros",
    "formatoRangos",
    [31]
  );
  let autoManual = await obtenerDatosHistoricoVariable(
    "8h",
    "registros",
    "formatoRangos",
    [41, 43]
  );
  for (let index = 0; index < autoManual[1].data.length; index++) {
    const element = autoManual[1].data[index];
    estado[1].data.push(element);
  }
  marcha = await obtenerMarcha(
    "8h",
    [31, 41, 43, 40, 42],
    null,
    null,
    "registros"
  );
  funcMaquina = await obtenerDatosHistoricoVariable(
    "8h",
    "registros",
    "formatoRangos",
    [40, 42]
  );
  let cepillos = await obtenerDatosHistoricoVariable(
    "8h",
    "registros",
    "formatoRangos",
    [44]
  );
  series3.value = cepillos;
  dosis = await obtenerDatosHistoricoVariable(
    "8h",
    "registros",
    "formatoLinea",
    [34, 35, 36, 37, 38]
  );
  kilos = await obtenerDatosHistoricoVariable(
    "8h",
    "registros",
    "formatoLinea",
    [48]
  );
  cajas = await obtenerDatosHistoricoVariable(
    "8h",
    "registros",
    "formatoLinea",
    [47]
  );
  cporu = await obtenerDatosHistoricoVariable(
    "8h",
    "registros",
    "formatoLinea",
    [45, 46]
  );
  totales = await obtenerDatosHistoricoVariable(
    "8h",
    "totales",
    "sinfiltro",
    [51, 52, 53, 54, 54, 56]
  );
  series.value = estado;
  for (let index = 0; index < funcMaquina[1].data.length; index++) {
    let element = funcMaquina[1].data[index];
    if (element.x == "alarma") {
      element.fillColor = "#fdd835";
    } else {
      element.fillColor = "#3949ab";
    }
    marcha[1].data.push(element);
  }
  console.log(marcha);
  series2.value = marcha;
  // series3.value = funcMaquina;
  seriesL.value = dosis;
  seriesL2.value = cporu;
  seriesL3.value = cajas;
  seriesL4.value = kilos;

  for (let index = 0; index < totales.length; index++) {
    const element = totales[index];
    consumos.value.push({
      id: index,
      nombre: element.nombreCorto + "( " + element.unidadMedida + " )",
      total: Math.max(0, element.registros[0].total),
    });
  }
  cargado.value = true;
});
</script>
<style>
.vdpr-datepicker .selectdates {
  border: 1px solid #000;
  padding: 12px;
  width: 300px;
}
</style>
