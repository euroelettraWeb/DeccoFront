<template>
  <v-row>
    <v-col>
      <v-switch
        v-model="mostrar"
        color="info"
        label="Cajas por Ciclo y Peso por Caja"
      >
        Cajas por Ciclo y Peso por Caja
      </v-switch>
      <v-card v-if="mostrar" class="mb-2">
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
      <v-switch v-model="mostrar2" color="info" label="Cajas/min">
        Cajas/min
      </v-switch>
      <v-card v-if="mostrar2">
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
let mostrar = ref(true);
let mostrar2 = ref(true);
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
    stroke: {
      width: 1.9,
    },
    legend: {
      showForSingleSeries: true,
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
    "24H",
    "registros",
    "individual",
    "formatoLinea",
    [props.caja1, props.caja2],
    maquinaID,
    routerStore().clienteID
  );
  tCajas = await obtenerDatosVariableGeneral(
    "24H",
    "registros",
    "individual",
    "unidadTiempo",
    [props.total],
    maquinaID,
    routerStore().clienteID,
    null,
    null,
    "Cajas/min"
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
      // if (lastZoom) chartRef.value.zoomX(lastZoom[0], lastZoom[1]);
    }
  });
  socket.on(`variable_${maquinaID}_${props.caja2}_actualizada`, (data) => {
    cajas.value[1].data.push({
      x: new Date(moment(data.x).toISOString()).getTime(),
      y: data.y,
    });
    if (chartRef.value) {
      chartRef.value.updateSeries(cajas.value);
      // if (lastZoom) chartRef.value.zoomX(lastZoom[0], lastZoom[1]);
    }
  });
  socket.on(
    `variable_${maquinaID}_${props.total}_actualizada`,
    async (data) => {
      let unidadTiempo = await obtenerDatosVariableGeneral(
        "24H",
        "registros",
        "individual",
        "unidadTiempo",
        [props.total],
        maquinaID,
        routerStore().clienteID
      );
      if (chartRef2.value) {
        chartRef2.value.updateSeries(unidadTiempo);
        // if (lastZoom) chartRef2.value.zoomX(lastZoom[0], lastZoom[1]);
      }
    }
  );
  cargado.value = true;
});
</script>
