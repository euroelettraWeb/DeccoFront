<template>
  <v-row no-gutters>
    <v-col>
      <v-switch v-model="mostrar" color="info" label="Kilos calibrador" />
      <v-card v-if="mostrar">
        <v-row justify="space-between" class="pa-2">
          <v-col cols="2" class="d-flex align-center">
            <v-icon color="primary" size="36">mdi-bell</v-icon>
            <v-checkbox
              v-model="mostrarTabla"
              label="Mostrar alarmas"
            ></v-checkbox>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col v-if="props.cargado">
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
              height="350"
              type="line"
              :options="chartOptions"
              :series="props.serie"
            />
            <v-data-table
              v-if="mostrarTabla"
              :headers="cabeceras"
              :items="props.alarmas.datos"
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
</template>
<script>
export default {
  name: "KilosCalibradorHistorico",
};
</script>
<script setup>
import { ref, computed } from "vue";
import es from "apexcharts/dist/locales/es.json";
import moment from "moment";

const props = defineProps({
  serie: { type: Array, default: () => [] },
  alarmas: { type: Array, default: () => [] },
  title: { type: String, default: "" },
  height: { type: Number, default: 300 },
  colores: { type: Array, default: () => ["#d50000", "#00c853"] },
  categories: { type: Array, default: () => [] },
  tooltipy: { type: Boolean, default: true },
  legend: { type: Boolean, default: true },
  cargado: { type: Boolean, default: true },
});

const cargado = ref(false);
const mostrar = ref(true);
const kilos = ref([]);
const mostrarTabla = ref(true);

const cabeceras = ref([
  { text: "Inicio Alarma", value: "inicio" },
  { text: "Fin Alarma", value: "fin" },
  { text: "Duración Alarma", value: "duracion" },
]);

const noData = computed(() => {
  return (
    cargado.value && kilos.value.every((objeto) => objeto.data.length === 0)
  );
});

const chartOptions = ref({
  chart: {
    id: "KilosCalibradorHistorico",
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
    min: 0,
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
</script>
