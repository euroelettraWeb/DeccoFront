<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card>
          <v-row>
            <v-col>
              <v-card-title> Fruta procesada </v-card-title>
              <v-card-subtitle> Total Kilos </v-card-subtitle>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <ApexChart
                v-if="cargado"
                ref="chartRef3"
                height="350"
                type="line"
                :options="chartOptions"
                :series="kilos"
              />
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  name: "FrutaProcesada",
};
</script>
<script setup>
import bd from "../../../helpers/bd";
import { onMounted, ref, computed, reactive } from "vue";
import es from "apexcharts/dist/locales/es.json";
import io from "socket.io-client";
import moment from "moment";
import { routerStore } from "../../../stores/index";

const socket = io("http://localhost:3000");

let cargado = ref(false);
let tKg = {};

const props = defineProps({
  fruta: { type: Number, default: 1 },
  tipo: { type: Number, default: 1 },
});

const chartRef3 = ref(null);
let kilos = ref([]);
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
      tickAmount: 15,
      labels: {
        minHeight: 125,
        rotate: -70,
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
onMounted(async () => {
  cargado.value = false;

  let maquinaID = (
    await bd.obtenerMaquina("lineaTipo", routerStore().lineasID, props.tipo)
  )[0].id;

  tKg = await bd.obtenerDatosVariables(
    "8H",
    "registros",
    "formatoLinea",
    [props.fruta],
    maquinaID
  );
  kilos.value = tKg;
  socket.on(`variable_${maquinaID}_${props.fruta}_actualizada`, (data) => {
    kilos.value[0].data.push({
      x: new Date(moment(data.x).toISOString()).getTime(),
      y: data.y,
    });
    if (chartRef3.value) {
      chartRef3.value.updateSeries(kilos.value);
      if (lastZoom) chartRef3.value.zoomX(lastZoom[0], lastZoom[1]);
    }
  });
  cargado.value = true;
});
</script>
