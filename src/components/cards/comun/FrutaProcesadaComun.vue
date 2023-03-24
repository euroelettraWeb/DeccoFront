<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title> Fruta procesada </v-card-title>
          <v-card-subtitle> Total Kilos </v-card-subtitle>
          <v-row>
            <v-col v-if="cargado">
              <ApexChart
                ref="chartRef3"
                height="350"
                type="line"
                :options="chartOptions"
                :series="kilos"
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
import {
  obtenerMaquina,
  obtenerDatosVariableGeneral,
} from "../../../helpers/bd";
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
    await obtenerMaquina("lineaTipo", routerStore().lineasID, props.tipo)
  )[0].id;

  tKg = await obtenerDatosVariableGeneral(
    "24H",
    "registros",
    "individual",
    "formatoAcumuladores",
    [props.fruta],
    maquinaID,
    routerStore().clienteID
  );
  kilos.value = tKg;
  socket.on(
    `variable_${maquinaID}_${props.fruta}_actualizada`,
    async (data) => {
      // kilos.value[0].data.push({
      //   x: new Date(moment(data.x).toISOString()).getTime(),
      //   y: data.y,
      // });
      let acc = await obtenerDatosVariableGeneral(
        "24H",
        "registros",
        "individual",
        "formatoAcumuladores",
        [props.fruta],
        maquinaID,
        routerStore().clienteID
      );
      if (chartRef3.value) {
        chartRef3.value.updateSeries(acc);
        // if (lastZoom) chartRef2.value.zoomX(lastZoom[0], lastZoom[1]);
      }
    }
  );
  cargado.value = true;
});
</script>
