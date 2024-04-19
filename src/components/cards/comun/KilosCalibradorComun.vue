<template>
  <v-row no-gutters>
    <v-col>
      <v-switch v-model="mostrar" color="info">
        <template #label>
          <span style="font-weight: bold">Kilos calibrador</span>
        </template>
      </v-switch>
      <v-card v-if="mostrar">
        <v-row justify="space-between" class="pa-2">
          <v-col sm="12" md="6" lg="8" class="d-flex align-center">
            <v-icon :color="colorAlarma" size="36">mdi-bell</v-icon>
            <v-checkbox
              v-model="mostrarTabla"
              label="Mostrar alarmas"
            ></v-checkbox>
          </v-col>
          <v-col sm="12" md="6" lg="4" class="d-flex align-end">
            <v-row justify="end">
              <v-col sm="12" md="6" lg="4">
                <v-text-field
                  v-model="tolerancia"
                  label="Tolerancia (Kg)"
                  type="number"
                  min="0"
                  max="100"
                  class="mx-1"
                  hide-details
                  @input="limitarTolerancia"
                />
              </v-col>
              <v-col sm="12" md="6" lg="8">
                <v-btn color="primary" large block @click="guardarParametro">
                  Guardar cambios&nbsp;<v-icon>mdi-content-save</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col v-if="cargado">
            <v-chip
              v-if="noData"
              class="ma-2"
              color="pink"
              label
              text-color="white"
            >
              <v-icon left> mdi-alert </v-icon>
              Sin datos
            </v-chip>
            <ApexChart
              v-else
              ref="GraficoKilosCalibrador"
              height="350"
              type="line"
              :options="chartOptions"
              :series="kilos"
              @mounted="graficoMontado"
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
        <v-data-table
          v-if="cargado && mostrarTabla"
          :headers="cabeceras"
          :items="alarmasCalibrador.datos"
          class="elevation-1"
        >
          <template #item="{ item }">
            <tr>
              <td>{{ item.inicio }}</td>
              <td>{{ item.fin ? item.fin : "Activa" }}</td>
              <td>{{ item.duracion ? item.duracion : "---" }}</td>
            </tr>
          </template>
        </v-data-table>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
export default {
  name: "KilosCalibrador",
};
</script>
<script setup>
import {
  obtenerMaquina,
  obtenerDatosVariableGeneral,
  guardarParametrosCalibrador,
  leerParametrosCalibrador,
  // leerAlarmasCalibrador,
} from "../../../helpers/bd";
import { onMounted, onUnmounted, ref, computed, watch } from "vue";
import es from "apexcharts/dist/locales/es.json";
import moment from "moment";
import { routerStore } from "../../../stores/index";

const cargado = ref(false);
const mostrar = ref(true);
const kilos = ref([]);
const maxEjeY = ref(0);
const tolerancia = ref(0);
const teoricoKilos = ref(0);
const parametrosCalibrador = ref([]);
const alarmasCalibrador = ref({});
const mostrarTabla = ref(true);
let interval = null;

const cabeceras = ref([
  { text: "Inicio Alarma", value: "inicio" },
  { text: "Fin Alarma", value: "fin" },
  { text: "Duración Alarma", value: "duracion" },
]);

const props = defineProps({
  variables: { type: Number, default: 1 },
  tipo: { type: Number, default: 1 },
});

const colorAlarma = computed(() => {
  if (alarmasCalibrador.value.datos && alarmasCalibrador.value.datos.length) {
    return alarmasCalibrador.value.datos[
      alarmasCalibrador.value.datos.length - 1
    ].fin
      ? "green"
      : "red";
  }
  return "green";
});

const noData = computed(() => {
  return (
    cargado.value && kilos.value.every((objeto) => objeto.data.length === 0)
  );
});

const GraficoKilosCalibrador = ref(null);

const chartOptions = ref({
  chart: {
    id: "KilosCalibrador",
    type: "xy",
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
      formatter: function (value) {
        return moment.utc(value).format("DD/MM/yyyy HH:mm:ss");
      },
    },
  },
  yaxis: {
    axisTicks: {
      show: true,
    },
    axisBorder: {
      show: true,
    },
    labels: {
      minWidth: 60,
      formatter: function (value) {
        return Math.round(value);
      },
    },
  },
  colors: ["#6699ff", "#EFC60E"],
  stroke: {
    width: [2, 2],
    curve: ["smooth", "smooth"],
  },
});

const actualizarZonaControl = () => {
  if (GraficoKilosCalibrador.value) {
    const chart = GraficoKilosCalibrador.value.chart;
    chart.updateOptions({
      yaxis: {
        min: 0,
        max: parseFloat(maxEjeY.value) * 2,
        labels: {
          minWidth: 60,
          formatter: function (value) {
            return Math.round(value);
          },
        },
      },
    });
  }
};

const limitarTolerancia = () => {
  if (tolerancia.value < 0) tolerancia.value = 0;
  if (tolerancia.value > 100) tolerancia.value = 100;
};

const guardarParametro = async () => {
  await guardarParametrosCalibrador(
    routerStore().clienteID,
    routerStore().lineasID,
    teoricoKilos.value,
    tolerancia.value
  );
};

const graficoMontado = () => {
  actualizarZonaControl();
};

const cargarDatos = async () => {
  parametrosCalibrador.value = (
    await leerParametrosCalibrador(
      routerStore().clienteID,
      routerStore().lineasID
    )
  ).datos;

  tolerancia.value =
    parametrosCalibrador.value[
      parametrosCalibrador.value.length - 1
    ].tolerancia;
  teoricoKilos.value =
    parametrosCalibrador.value[parametrosCalibrador.value.length - 1].kilos;

  let deccodosID = (
    await obtenerMaquina("lineaTipo", routerStore().lineasID, 2)
  )[0].id;
  let kilosM = await obtenerDatosVariableGeneral(
    "24H",
    "registros",
    "individual",
    "unidadTiempo",
    [props.variables],
    deccodosID,
    routerStore().clienteID,
    null,
    null,
    "Kg/min"
  );

  let variable2 = [
    {
      data: [],
      name: "Variable2",
    },
  ];

  let indiceParametro = 0;
  let kilosVisualizar = [{ data: [], name: null }];
  for (let punto = 0; punto < kilosM[0].data.length; punto += 3) {
    kilosVisualizar[0].data.push(kilosM[0].data[punto]);
    if (
      parametrosCalibrador.value[indiceParametro + 1] &&
      parametrosCalibrador.value[indiceParametro + 1].fecha <
        kilosM[0].data[punto].x
    ) {
      indiceParametro++;
    }
    variable2[0].data.push({
      x: kilosM[0].data[punto].x,
      y: 0,
    });
  }
  kilosVisualizar[0].name = kilosM[0].name;

  kilos.value = [...kilosVisualizar, ...variable2];

  maxEjeY.value = kilosVisualizar[0].data.reduce((maximo, punto) => {
    return punto.y > maximo ? punto.y : maximo;
  }, 0);

  // alarmasCalibrador.value = await leerAlarmasCalibrador(
  //   routerStore().clienteID,
  //   routerStore().lineasID
  // );
};

watch(
  () => routerStore().lineasID,
  async () => {
    cargado.value = false;
    await cargarDatos();
    cargado.value = true;
  }
);

onMounted(async () => {
  cargado.value = false;
  await cargarDatos();
  cargado.value = true;
  interval = setInterval(async () => {
    cargarDatos();
  }, 90000);
});

onUnmounted(() => {
  clearInterval(interval);
});
</script>
