<template>
  <v-row no-gutters>
    <v-col>
      <v-card>
        <v-row no-gutters>
          <v-col>
            <v-card-title> DECCOWASHER </v-card-title>
          </v-col>
        </v-row>
        <v-row class="pl-8" no-gutters>
          <v-col
            ><date-picker
              class="selectdates"
              apply-button-label="Use"
              :date-input="dateInput"
              :format="'DD MM YYYY HH:mm'"
              :same-date-format="sameDateFormat"
              @date-applied="dateApplied"
              @on-reset="onReset"
          /></v-col>
        </v-row>
        <v-row no-gutters>
          <v-col>
            <v-row>
              <v-col v-if="cargado8">
                <v-simple-table dense>
                  <template #default>
                    <thead>
                      <tr>
                        <th></th>
                        <th>L</th>
                        <th>Litros/Tonelada</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in consumos" :key="item.id">
                        <td>
                          {{ item.nombre }}
                        </td>
                        <td>
                          {{ item.total }}
                        </td>
                        <td v-if="deccodos">
                          {{ item.totalFruta }}
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
              <v-col v-if="cargado7">
                <v-simple-table dense>
                  <template #default>
                    <thead>
                      <tr>
                        <th class="text-left"></th>
                        <th>Min</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="alarmaItem in alarmas" :key="alarmaItem.id">
                        <td>{{ alarmaItem.nombre }}</td>
                        <td>
                          {{ alarmaItem.name }}
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
                ></v-progress-circular> </v-col
            ></v-row>
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
            <v-col v-if="cargado3">
              <ApexChart
                ref="chartRef4"
                type="line"
                height="300"
                :options="chartOptions('dosis')"
                :series="seriesL"
            /></v-col>
            <v-col v-else class="d-flex justify-center align-center">
              <v-progress-circular
                :size="100"
                :width="7"
                color="purple"
                indeterminate
              ></v-progress-circular> </v-col
            ><v-col v-if="cargado6">
              <ApexChart
                ref="chartRef7"
                type="line"
                height="300"
                :options="chartOptionsKilos"
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
            <v-col v-if="cargado2">
              <ApexChart
                ref="chartRef3"
                type="rangeBar"
                height="300"
                :options="rangeOptions2"
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
            <v-col v-if="cargado4">
              <ApexChart
                ref="chartRef5"
                type="line"
                height="300"
                :options="chartOptions('pcajas')"
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
                :options="chartOptions('tcajas')"
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
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
export default {
  name: "DECCOWSHistorico",
};
</script>
<script setup>
import {
  obtenerDatosVariableGeneral,
  obtenerMaquina,
} from "../../../helpers/bd";
import { onMounted, ref, computed, onUnmounted } from "vue";
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
  estado = await obtenerDatosVariableGeneral(
    "historico",
    "registros",
    "individual",
    "formatoRangos",
    [61, 63],
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
    [[61, 63]],
    props.maquina,
    routerStore().clienteID,
    inicio.value,
    fin.value
  );
  for (let index = 0; index < autoManual[1].data.length; index++) {
    const element = autoManual[1].data[index];
    estado[1].data.push(element);
  }
  marcha = await obtenerDatosVariableGeneral(
    "historico",
    "registros",
    "multiple",
    "marchaFormatoRangos",
    [57, 60, 62],
    props.maquina,
    routerStore().clienteID,
    inicio.value,
    fin.value
  );
  for (let index = 0; index < marcha[0].data.length; index++) {
    const element = marcha[0].data[index];
    estado[0].data.push(element);
  }
  for (let index = 0; index < marcha[1].data.length; index++) {
    const element = marcha[1].data[index];
    estado[1].data.push(element);
  }
  funcMaquina = await obtenerDatosVariableGeneral(
    "historico",
    "registros",
    "individual",
    "formatoRangos",
    [60, 62, 84, 85, 86, 87, 88],
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
    estado[1].data.push(element);
  }
  series.value = estado;
  cargado1.value = true;
  let otros = await obtenerDatosVariableGeneral(
    "24H",
    "registros",
    "individual",
    "formatoRangos",
    [64, 65, 84, 85, 86, 87],
    props.maquina,
    routerStore().clienteID
  );
  series2.value = otros;
  cargado2.value = true;
  dosis = await obtenerDatosVariableGeneral(
    "historico",
    "registros",
    "individual",
    "formatoLinea",
    [58, 59],
    props.maquina,
    routerStore().clienteID,
    inicio.value,
    fin.value
  );
  seriesL.value = dosis;
  cargado3.value = true;
  cajas = await obtenerDatosVariableGeneral(
    "historico",
    "registros",
    "individual",
    "unidadTiempo",
    [68],
    props.maquina,
    routerStore().clienteID,
    inicio.value,
    fin.value,
    "Cajas/Min"
  );
  seriesL3.value = cajas;
  cargado5.value = true;
  cporu = await obtenerDatosVariableGeneral(
    "historico",
    "registros",
    "individual",
    "formatoLinea",
    [67, 66],
    props.maquina,
    routerStore().clienteID,
    inicio.value,
    fin.value
  );
  seriesL2.value = cporu;
  cargado4.value = true;
  cargado6.value = true;
  totales = await obtenerDatosVariableGeneral(
    "historico",
    "totales",
    "individual",
    "sinfiltro",
    [70, 71, 72],
    props.maquina,
    routerStore().clienteID,
    inicio.value,
    fin.value
  );
  series.value = estado;
  let total = [];
  if (deccodos.value) {
    let totalFruta = await obtenerDatosVariableGeneral(
      "historico",
      "totales",
      "individual",
      "sinfiltro",
      [48],
      deccodos.value,
      routerStore().clienteID,
      inicio.value,
      fin.value
    );
    kilos = await obtenerDatosVariableGeneral(
      "historico",
      "registros",
      "individual",
      "formatoAcumuladores",
      [48],
      deccodos.value,
      routerStore().clienteID,
      inicio.value,
      fin.value
    );
    let kilosM = await obtenerDatosVariableGeneral(
      "historico",
      "registros",
      "individual",
      "unidadTiempo",
      [48],
      deccodos.value,
      routerStore().clienteID,
      inicio.value,
      fin.value,
      "Kg/min"
    );
    kilos.push(...kilosM);
    seriesL4.value = kilos;
    consumos.value = [];
    for (let index = 0; index < totales.length; index++) {
      const element = totales[index];
      let n = Math.max(0, element.registros[0].total);
      let d =
        totalFruta[0].registros[0].total > 0
          ? (n / (totalFruta[0].registros[0].total / 1000)).toFixed(3)
          : 0;
      consumos.value.push({
        id: index,
        nombre: element.descripcion,
        total: Math.max(0, element.registros[0].total).toFixed(3),
        totalFruta: d,
      });
    }
    consumos.value.push({
      id: consumos.value.length,
      nombre: totalFruta[0].nombreCorto + "( T )",
      total: Math.max(0, totalFruta[0].registros[0].total / 1000).toFixed(3),
    });
  } else {
    for (let index = 0; index < totales.length; index++) {
      const element = totales[index];
      consumos.value.push({
        id: index,
        nombre: element.descripcion,
        total: Math.max(0, element.registros[0].total).toFixed(3),
      });
    }
  }
  let marchat = await obtenerDatosVariableGeneral(
    "historico",
    "registros",
    "multiple",
    "totalMarcha",
    [57, 60, 62],
    props.maquina,
    routerStore().clienteID,
    inicio.value,
    fin.value
  );
  total.push({
    id: total.length,
    nombre: "Marcha ( min )",
    total: Math.max(0, marchat.total).toFixed(0),
  });
  consumos.value = total;
  cargado7.value = true;
  alarma = await obtenerDatosVariableGeneral(
    "historico",
    "registros",
    "individual",
    "totalRangos",
    [60, 62, 84, 85, 86, 87],
    props.maquina,
    routerStore().clienteID,
    inicio.value,
    fin.value
  );
  let totalA = [];
  for (let index = 0; index < alarma.length; index++) {
    const element = alarma[index];
    totalA.push({
      id: element.nombreCorto + index,
      nombre: element.nombreCorto,
      name: Math.max(0, Math.round(element.registros.total1 / 60)),
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
let cargado8 = ref(false);

const chartRef = ref(null);
const chartRef2 = ref(null);
const chartRef4 = ref(null);
const chartRef5 = ref(null);
const chartRef6 = ref(null);
const chartRef7 = ref(null);
let series = ref([]);
let series2 = ref([]);
let seriesL = ref([]);
let seriesL2 = ref([]);
let seriesL3 = ref([]);
let seriesL4 = ref([]);

let consumos = ref([]);
let alarmas = ref([]);
let deccodos = ref(null);
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
let chartOptions = (id) => {
  return {
    chart: {
      id: id,
      group: "historico",
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
      tickAmount: 25,
      labels: {
        minHeight: 125,
        rotate: -45,
        minHeight: 125,
        rotateAlways: true,
        formatter: function (value) {
          return moment.utc(value).format("DD/MM/yyyy HH:mm:ss"); // The formatter function overrides format property
        },
      },
    },
    yaxis: {
      labels: {
        minWidth: 60,
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
};
let chartOptionsKilos = {
  chart: {
    id: "Kilos",
    group: "historico",
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
    tickAmount: 25,
    labels: {
      minHeight: 125,
      rotate: -45,
      rotateAlways: true,
      formatter: function (value, timestamp) {
        return moment.utc(value).format("DD/MM/yyyy HH:mm:ss");
      },
    },
  },
  yaxis: [
    {
      axisTicks: {
        show: true,
      },
      axisBorder: {
        show: true,
      },

      labels: {
        minWidth: 60,
      },
    },
    {
      opposite: true,
      axisTicks: {
        show: true,
      },
      axisBorder: {
        show: true,
      },
    },
  ],
  stroke: {
    width: 1.9,
  },
  legend: {
    showForSingleSeries: true,
  },
};
let rangeOptions = {
  chart: {
    id: "estado",
    group: "historico",
    type: "rangeBar",
    locales: [es],
    defaultLocale: "es",
    animations: { enabled: false },
    group: "historico",
  },
  colors: [
    function ({ seriesIndex }) {
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
    categories: [
      "Activo",
      "MarchaParo",
      "Remoto",
      "Manual",
      "Falta de consenso",
      "Alarma",
      "Presencia Fruta",
    ],
    labels: {
      minHeight: 125,
      rotate: -45,
      rotateAlways: true,
      formatter: function (value) {
        return moment.utc(value).format("DD/MM/yyyy HH:mm:ss"); // The formatter function overrides format property
      },
    },
  },
  yaxis: {
    labels: {
      minWidth: 60,
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
let rangeOptions2 = {
  chart: {
    id: "otrosEstado",
    group: "historico",
    type: "rangeBar",
    locales: [es],
    defaultLocale: "es",
    animations: { enabled: false },
    group: "historico",
  },
  colors: [
    function ({ seriesIndex }) {
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
      rotate: -45,
      rotateAlways: true,
      formatter: function (value) {
        return moment.utc(value).format("DD/MM/yyyy HH:mm:ss"); // The formatter function overrides format property
      },
    },
  },
  yaxis: {
    labels: {
      minWidth: 60,
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
  let maquina = await obtenerMaquina("lineaTipo", props.linea, 2);
  deccodos.value = maquina[0].id;
  estado = await obtenerDatosVariableGeneral(
    "24H",
    "registros",
    "individual",
    "formatoRangos",
    [57],
    props.maquina,
    routerStore().clienteID
  );
  let autoManual = await obtenerDatosVariableGeneral(
    "24H",
    "registros",
    "individual",
    "formatoRangos",
    [61, 63],
    props.maquina,
    routerStore().clienteID
  );
  for (let index = 0; index < autoManual[1].data.length; index++) {
    const element = autoManual[1].data[index];
    estado[1].data.push(element);
  }
  marcha = await obtenerDatosVariableGeneral(
    "24H",
    "registros",
    "multiple",
    "marchaFormatoRangos",
    [57, 60, 62],
    props.maquina,
    routerStore().clienteID
  );
  for (let index = 0; index < marcha[0].data.length; index++) {
    const element = marcha[0].data[index];
    estado[0].data.push(element);
  }
  for (let index = 0; index < marcha[1].data.length; index++) {
    const element = marcha[1].data[index];
    estado[1].data.push(element);
  }
  funcMaquina = await obtenerDatosVariableGeneral(
    "24H",
    "registros",
    "individual",
    "formatoRangos",
    [60, 62, 88],
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
    estado[1].data.push(element);
  }
  // let bombas = await obtenerDatosVariableGeneral(
  //   "24H",
  //   "registros",
  //   "individual",
  //   "formatoRangos",
  //   [64, 65],
  //   props.maquina,
  //   routerStore().clienteID
  // );
  // series3.value = bombas;
  series.value = estado;
  cargado1.value = true;
  cargado2.value = false;
  let otros = await obtenerDatosVariableGeneral(
    "24H",
    "registros",
    "individual",
    "formatoRangos",
    [64, 65, 84, 85, 86, 87],
    props.maquina,
    routerStore().clienteID
  );
  series2.value = otros;
  cargado2.value = true;
  cargado3.value = false;
  dosis = await obtenerDatosVariableGeneral(
    "24H",
    "registros",
    "individual",
    "formatoLinea",
    [58, 59],
    props.maquina,
    routerStore().clienteID
  );
  seriesL.value = dosis;
  cargado3.value = true;
  cargado5.value = false;
  cajas = await obtenerDatosVariableGeneral(
    "24H",
    "registros",
    "individual",
    "unidadTiempo",
    [68],
    props.maquina,
    routerStore().clienteID,
    null,
    null,
    "Cajas/Min"
  );
  seriesL3.value = cajas;
  cargado5.value = true;
  cargado4.value = false;
  cporu = await obtenerDatosVariableGeneral(
    "24H",
    "registros",
    "individual",
    "formatoLinea",
    [67, 66],
    props.maquina,
    routerStore().clienteID
  );
  seriesL2.value = cporu;
  cargado4.value = true;
  cargado6.value = true;
  cargado7.value = false;
  totales = await obtenerDatosVariableGeneral(
    "24H",
    "totales",
    "individual",
    "sinfiltro",
    [70, 71, 72],
    props.maquina,
    routerStore().clienteID
  );
  if (deccodos.value) {
    let totalFruta = await obtenerDatosVariableGeneral(
      "24H",
      "totales",
      "individual",
      "sinfiltro",
      [48],
      deccodos.value,
      routerStore().clienteID
    );
    kilos = await obtenerDatosVariableGeneral(
      "24H",
      "registros",
      "individual",
      "formatoAcumuladores",
      [48],
      deccodos.value,
      routerStore().clienteID
    );
    let kilosM = await obtenerDatosVariableGeneral(
      "24H",
      "registros",
      "individual",
      "unidadTiempo",
      [48],
      deccodos.value,
      routerStore().clienteID,
      null,
      null,
      "Kg/min"
    );
    kilos.push(...kilosM);
    seriesL4.value = kilos;
    for (let index = 0; index < totales.length; index++) {
      const element = totales[index];
      let n = Math.max(0, element.registros[0].total);
      let d =
        totalFruta[0].registros[0].total > 0
          ? (n / (totalFruta[0].registros[0].total / 1000)).toFixed(3)
          : 0;
      consumos.value.push({
        id: element.descripcion + index,
        nombre: element.descripcion,
        total: Math.max(0, element.registros[0].total).toFixed(3),
        totalFruta: d,
      });
    }
    consumos.value.push({
      id: consumos.value.length,
      nombre: totalFruta[0].nombreCorto,
      total: Math.max(0, totalFruta[0].registros[0].total / 1000).toFixed(3),
    });
  } else {
    for (let index = 0; index < totales.length; index++) {
      const element = totales[index];
      consumos.value.push({
        id: element.descripcion + index,
        nombre: element.descripcion,
        total: Math.max(0, element.registros[0].total).toFixed(3),
      });
    }
  }
  let horasMarcha = await obtenerDatosVariableGeneral(
    "24H",
    "registros",
    "multiple",
    "totalMarcha",
    [57, 60, 62],
    props.maquina,
    routerStore().clienteID
  );
  cargado7.value = true;
  cargado8.value = false;
  alarma = await obtenerDatosVariableGeneral(
    "24H",
    "registros",
    "individual",
    "totalRangos",
    [60, 62, 84, 85, 86, 87],
    props.maquina,
    routerStore().clienteID
  );
  for (let index = 0; index < alarma.length; index++) {
    const element = alarma[index];
    alarmas.value.push({
      id: element.nombreCorto + index,
      nombre: element.nombreCorto,
      name: Math.max(0, Math.round(element.registros.total1 / 60)),
    });
  }
  alarmas.value.push({
    id: consumos.value.length,
    nombre: "Marcha ( min )",
    name: Math.max(0, Math.round(horasMarcha.total / 60)),
  });
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
