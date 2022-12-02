<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card
          ><v-row>
            <v-col>
              <v-card-title> {{ props.title }} </v-card-title>
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
                :series="registrosT"
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
  name: "DosisWS",
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
let dosis = {};

const chartRef = ref(null);
let registrosT = ref([]);
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
      // datetimeUTC: false,
      tickAmount: 15,
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
    },
  };
});

const props = defineProps({
  title: { type: String, default: "Dosis" },
  variables: { type: Array, default: new Array() },
  tipo: { type: Number, default: 1 },
});

onMounted(async () => {
  cargado.value = false;
  let maquinaID = (
    await bd.obtenerMaquina("lineaTipo", routerStore().lineasID, props.tipo)
  )[0].id;

  dosis = await bd.obtenerDatosVariables(
    "8H",
    "registros",
    "formatoLinea",
    props.variables,
    maquinaID
  );

  registrosT.value = dosis;
  for (let index = 0; index < props.variables.length; index++) {
    const element = props.variables[index];
    socket.on(`variable_${maquinaID}_${element}_actualizada`, (data) => {
      registrosT.value[index].data.push({
        x: new Date(moment(data.x).toISOString()).getTime(),
        y: data.y,
      });
      if (chartRef.value) {
        chartRef.value.updateSeries(registrosT.value);
        if (lastZoom) chartRef.value.zoomX(lastZoom[0], lastZoom[1]);
      }
    });
  }
  cargado.value = true;
});
</script>
