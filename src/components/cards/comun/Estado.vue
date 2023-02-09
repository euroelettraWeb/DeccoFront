<template>
  <v-container
    ><v-row>
      <v-col>
        <v-card>
          <v-row
            ><v-col><v-card-title>Estado</v-card-title></v-col>
          </v-row>
          <v-row>
            <v-col v-if="cargado">
              <ApexChart
                ref="chartRef"
                type="rangeBar"
                height="300"
                :options="chartOptions"
                :series="series"
              />
              <ApexChart
                ref="chartRef3"
                type="rangeBar"
                height="300"
                :options="chartOptions"
                :series="series3"
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
  name: "EstadoSistema",
};
</script>
<script setup>
import {
  obtenerMaquina,
  obtenerDatosVariableGeneral,
} from "../../../helpers/bd";
import { onMounted, ref, computed } from "vue";
import es from "apexcharts/dist/locales/es.json";
import io from "socket.io-client";
import moment from "moment";
import { routerStore } from "../../../stores/index";

const socket = io("http://localhost:3000");
const chartRef = ref(null);
const chartRef2 = ref(null);
const chartRef3 = ref(null);
var lastZoom = null;
let cargado = ref(false);
let marcha = [];
let series = ref([]);
let series2 = ref([]);
let series3 = ref([]);
let modoMaquina = [];
let autoManual = [];
let funcMaquina = [];
let chartOptions = computed(() => {
  return {
    chart: {
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
        barHeight: "50%",
      },
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
    xaxis: {
      type: "datetime",
      datetimeUTC: false,
      min: new Date(moment().subtract(8, "hours")).getTime(),
      max: moment(),
      tickAmount: 20,
      labels: {
        minHeight: 125,
        rotate: -70,
        rotateAlways: true,
        formatter: function (value, timestamp) {
          return moment.utc(value).format("DD/MM/yyyy HH:mm:ss");
        },
      },
    },
    tooltip: {
      x: {
        format: "dd/MM/yyyy HH:mm:ss",
      },
    },
    legend: {
      height: 60,
    },
  };
});
const props = defineProps({
  activo: { type: Number, default: 1 },
  autoManual: { type: Array, default: new Array() },
  alarma: { type: Array, default: new Array() },
  fc: { type: Number, default: 1 },
  tipo: { type: Number, default: 1 },
});

onMounted(async () => {
  cargado.value = false;

  let maquinaID = (
    await obtenerMaquina("lineaTipo", routerStore().lineasID, props.tipo)
  )[0].id;

  modoMaquina = await obtenerDatosVariableGeneral(
    "8H",
    "registros",
    "individual",
    "formatoRangos",
    [props.activo],
    maquinaID,
    routerStore().clienteID
  );
  autoManual = await obtenerDatosVariableGeneral(
    "8H",
    "registros",
    "individual",
    "formatoRangos",
    props.autoManual,
    maquinaID,
    routerStore().clienteID
  );
  for (let index = 0; index < autoManual[1].data.length; index++) {
    const element = autoManual[1].data[index];
    modoMaquina[1].data.push(element);
  }

  marcha = await obtenerDatosVariableGeneral(
    "8H",
    "registros",
    "multiple",
    "marchaFormatoRangos",
    props.marcha,
    maquinaID,
    routerStore().clienteID
  );
  funcMaquina = await obtenerDatosVariableGeneral(
    "8H",
    "registros",
    "individual",
    "formatoRangos",
    props.alarmas,
    maquinaID,
    routerStore().clienteID
  );
  series.value = modoMaquina;
  for (let index = 0; index < funcMaquina[1].data.length; index++) {
    let element = funcMaquina[1].data[index];
    if (element.x == "Alarma") {
      element.fillColor = "#fdd835";
    } else {
      element.fillColor = "#3949ab";
    }
    marcha[1].data.push(element);
  }
  series2.value = funcMaquina;
  series3.value = marcha;
  for (let index = 0; index < props.autoManual.length; index++) {
    const element = props.autoManual[index];
    socket.on(`variable_${maquinaID}_${element}_actualizada`, async (data) => {
      let modoMaquina = await obtenerDatosVariableGeneral(
        "8H",
        "registros",
        "individual",
        "formatoRangos",
        [props.activo],
        maquinaID,
        routerStore().clienteID
      );
      let autoManual = await obtenerDatosVariableGeneral(
        "8H",
        "registros",
        "individual",
        "formatoRangos",
        props.autoManual,
        maquinaID,
        routerStore().clienteID
      );
      for (let index = 0; index < autoManual[1].data.length; index++) {
        const element = autoManual[1].data[index];
        modoMaquina[1].data.push(element);
      }
      if (chartRef.value) {
        chartRef.value.updateSeries(modoMaquina);
        if (lastZoom) chartRef.value.zoomX(lastZoom[0], lastZoom[1]);
      }
    });
  }

  for (let index = 0; index < prop.alarma.length; index++) {
    const element = prop.alarma[index];
    socket.on(`variable_${maquinaID}_${element}_actualizada`, async (data) => {
      let marcha = await obtenerDatosVariableGeneral(
        "8H",
        "registros",
        "multiple",
        "marchaFormatoRangos",
        props.marcha,
        maquinaID,
        routerStore().clienteID
      );
      let funcMaquina = await obtenerDatosVariableGeneral(
        "8H",
        "registros",
        "individual",
        "formatoRangos",
        [props.alarma, props.fc],
        maquinaID,
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
      if (chartRef2.value) {
        chartRef2.value.updateSeries(marcha);
        if (lastZoom) chartRef2.value.zoomX(lastZoom[0], lastZoom[1]);
      }
    });
  }

  socket.on(
    `variable_${maquinaID}_${props.activo}_actualizada`,
    async (data) => {
      let modoMaquina = await obtenerDatosVariableGeneral(
        "8H",
        "registros",
        "individual",
        "formatoRangos",
        [props.activo],
        maquinaID,
        routerStore().clienteID
      );
      let autoManual = await obtenerDatosVariableGeneral(
        "8H",
        "registros",
        "individual",
        "formatoRangos",
        props.autoManual,
        maquinaID,
        routerStore().clienteID
      );
      for (let index = 0; index < autoManual[1].data.length; index++) {
        const element = autoManual[1].data[index];
        modoMaquina[1].data.push(element);
      }
      if (chartRef.value) {
        chartRef.value.updateSeries(modoMaquina);
        if (lastZoom) chartRef.value.zoomX(lastZoom[0], lastZoom[1]);
      }

      let marcha = await obtenerDatosVariableGeneral(
        "8H",
        "registros",
        "multiple",
        "marchaFormatoRangos",
        props.marcha,
        maquinaID,
        routerStore().clienteID
      );
      let funcMaquina = await obtenerDatosVariableGeneral(
        "8H",
        "registros",
        "individual",
        "formatoRangos",
        [props.alarma, props.fc],
        maquinaID,
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
      if (chartRef2.value) {
        chartRef2.value.updateSeries(marcha);
        if (lastZoom) chartRef2.value.zoomX(lastZoom[0], lastZoom[1]);
      }
    }
  );
  cargado.value = true;
});
</script>
