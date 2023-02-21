<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card class="mb-2"
          ><v-row>
            <v-col>
              <v-card-subtitle>
                Cajas por Ciclo y Peso por Caja
              </v-card-subtitle>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <ApexChart
                v-if="cargado"
                ref="chartRef"
                height="350"
                type="line"
                :options="chartOptions"
                :series="cajas"
              />
            </v-col>
          </v-row>
        </v-card>
        <v-card class="mb-2">
          <v-row>
            <v-col>
              <v-card-subtitle> Cajas/min </v-card-subtitle>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <ApexChart
                v-if="cargado"
                ref="chartRef2"
                height="350"
                type="line"
                :options="chartOptions"
                :series="totalCajas"
              />
            </v-col> </v-row
        ></v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  name: "CajasCard",
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

let cargado = ref(false);
let cajaV = {};
let tCajas = {};

const chartRef = ref(null);
const chartRef2 = ref(null);
let cajas = ref([]);
let totalCajas = ref([]);
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
      tickAmount: 25,
      labels: {
        minHeight: 125,
        rotate: -70,
        rotateAlways: true,
        formatter: function (value, timestamp) {
          return moment.utc(value).format("DD/MM/yyyy HH:mm:ss"); // The formatter function overrides format property
        },
      },
    },
    stroke: {
      width: 1.9,
    },
    legend: {
      showForSingleSeries: false,
    },
  };
});
const props = defineProps({
  caja1: { type: Number, default: 1 },
  caja2: { type: Number, default: 1 },
  total: { type: Number, default: 1 },
  tipo: { type: Number, default: 1 },
});
onMounted(async () => {
  cargado.value = false;
  let maquinaID = (
    await obtenerMaquina("lineaTipo", routerStore().lineasID, props.tipo)
  )[0].id;

  cajaV = await obtenerDatosVariableGeneral(
    "8H",
    "registros",
    "individual",
    "formatoLinea",
    [props.caja1, props.caja2],
    maquinaID,
    routerStore().clienteID
  );
  tCajas = await obtenerDatosVariableGeneral(
    "8H",
    "registros",
    "individual",
    "unidadTiempo",
    [props.total],
    maquinaID,
    routerStore().clienteID
  );
  cajas.value = cajaV;
  totalCajas.value = tCajas;
  socket.on(`variable_${maquinaID}_${props.caja1}_actualizada`, (data) => {
    cajas.value[0].data.push({
      x: new Date(moment(data.x).toISOString()).getTime(),
      y: data.y,
    });
    if (chartRef.value) {
      chartRef.value.updateSeries(cajas.value);
      if (lastZoom) chartRef.value.zoomX(lastZoom[0], lastZoom[1]);
    }
  });
  socket.on(`variable_${maquinaID}_${props.caja2}_actualizada`, (data) => {
    cajas.value[1].data.push({
      x: new Date(moment(data.x).toISOString()).getTime(),
      y: data.y,
    });
    if (chartRef.value) {
      chartRef.value.updateSeries(cajas.value);
      if (lastZoom) chartRef.value.zoomX(lastZoom[0], lastZoom[1]);
    }
  });
  socket.on(
    `variable_${maquinaID}_${props.total}_actualizada`,
    async (data) => {
      let unidadTiempo = await obtenerDatosVariableGeneral(
        "8H",
        "registros",
        "individual",
        "unidadTiempo",
        [props.total],
        maquinaID,
        routerStore().clienteID
      );
      if (chartRef2.value) {
        chartRef2.value.updateSeries(unidadTiempo);
        if (lastZoom) chartRef2.value.zoomX(lastZoom[0], lastZoom[1]);
      }
    }
  );
  cargado.value = true;
});
</script>
