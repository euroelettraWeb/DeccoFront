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
              ><date-picker
                apply-button-label="Use"
                :date-input="dateInput"
                :format="'DD MM YYYY hh:mm'"
                :same-date-format="sameDateFormat"
                @date-applied="dateApplied"
                @on-reset="onReset"
            /></v-col>
          </v-row>
          <v-row>
            <v-col v-if="cargado">
              <ApexChart
                ref="chartRef"
                type="line"
                height="300"
                :options="chartOptions"
                :series="series"
              />
              <ApexChart
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
  name: "HistoricoCard",
};
</script>
<script setup>
import axios from "axios";
import { onMounted, ref, computed, reactive } from "vue";
import es from "apexcharts/dist/locales/es.json";
import io from "socket.io-client";
import moment from "moment";
import DatePicker from "vue-time-date-range-picker/dist/vdprDatePicker";

const socket = io("http://localhost:3000");

async function obtenerDatosVariable(operacion, modo, filtrado, variableID) {
  return (
    await axios.get(
      `${process.env.VUE_APP_RUTA_API}/variable/${operacion}/${modo}/${filtrado}/${variableID}`
    )
  ).data;
}
async function obtenerDatosHistoricoVariable(
  inicio,
  fin,
  operacion,
  filtrado,
  variableID
) {
  return (
    await axios.get(
      `${process.env.VUE_APP_RUTA_API}/variable/historico/${inicio}/${fin}/${operacion}/${filtrado}/${variableID}`
    )
  ).data;
}

async function obtenerVariable() {
  return (await axios.get(`${process.env.VUE_APP_RUTA_API}/variable/all`)).data;
}
function onReset() {
  inicio.value = "";
  fin.value = "";
}
function dateApplied(date1, date2) {
  this.events.push(
    new Event("date-applied", `${date1.toString()} - ${date2.toString()}`)
  );
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

let sameDateFormat = {
  from: "DD MM YYYY, hh:mm",
  to: "hh:mm",
};
let inicio = ref("");
let fin = ref("");

let dateInput = {
  placeholder: "Select Date",
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
        format: "dd MMM yyyy hh:mm:ss",
      },
    },
  };
});

onMounted(async () => {
  cargado.value = false;
  variables = await obtenerVariable();
  let vara = await obtenerDatosHistoricoVariable(
    inicio,
    fin,
    "registros",
    "formatoLinea",
    25
  );
  series.value = vara.registros;
  let varR = await obtenerDatosHistoricoVariable(
    inicio,
    fin,
    "registros",
    "formatoRangos",
    1
  );
  series2.value = varR.registros;
  cargado.value = true;
});
</script>
