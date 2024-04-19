<template>
  <v-row no-gutters>
    <v-col>
      <v-switch v-model="mostrar" color="info" :label="props.title">
        {{ props.title }}
      </v-switch>
      <div v-if="mostrar">
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
              type="line"
              :height="350"
              :options="chartOptions"
              :series="props.serie"
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
      </div>
    </v-col>
  </v-row>
</template>
<script>
export default {
  name: "GraficasEstado",
};
</script>
<script setup>
import { ref, computed } from "vue";
import es from "apexcharts/dist/locales/es.json";
import moment from "moment";

const mostrar = ref(true);

const props = defineProps({
  serie: { type: Array, default: () => [] },
  title: { type: String, default: "" },
  height: { type: Number, default: 300 },
  tooltipy: { type: Boolean, default: true },
  legend: { type: Boolean, default: true },
  cargado: { type: Boolean, default: true },
  rangosFechas: { type: Array, default: () => [] },
});

// Función para definir los meses a partir de los rangos de props.rangosFechas
const mesRango = computed(() => {
  return props.rangosFechas.map((rango) => {
    let partesFecha = rango.fin.split("-");
    return `${partesFecha[1]}/${partesFecha[0]}`;
    // return new Date(partesFecha[0], partesFecha[1] - 1);
  });
});

// Función para manejar el maximo de la escala del eje Y
const escalaMax = computed(() => {
  let maximo = 0;

  props.serie.forEach((serie) => {
    if (serie.type === "column") {
      let maximoLocal = Math.max(...serie.data);
      if (maximoLocal > maximo) {
        maximo = maximoLocal;
      }
    }
  });
  if (maximo == 0) {
    return 1;
  } else {
    return Math.floor(maximo * 1.2);
  }
});

// Función para definir el yaxis en chartOptions
const ejeY = computed(() => {
  let objectEjeY = [];
  let firstColumn = true;

  props.serie.forEach((serie) => {
    if (serie.type === "line") {
      let object = {
        labels: {
          show: true,
          style: {
            colors: "#008FFB",
          },
        },
      };
      objectEjeY.push(object);
    } else if (serie.type === "column") {
      let object = {
        min: 0,
        max: escalaMax.value,
        showForNullSeries: false,
        opposite: firstColumn,
        labels: {
          show: firstColumn,
          style: {
            colors: "#00E396",
          },
        },
      };
      firstColumn = false;
      objectEjeY.push(object);
    }
  });
  return objectEjeY;
});

const chartOptions = {
  chart: {
    height: 350,
    type: "line",
    stacked: false,
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: "10%",
      endingShape: "rounded",
    },
  },
  stroke: {
    width: [1, 1, 4],
  },
  xaxis: {
    tickPlacement: "between",
    categories: mesRango.value,
  },
  dataLabels: {
    enabled: true,
    enabledOnSeries: [0],
  },
  yaxis: ejeY.value,
  tooltip: {
    fixed: {
      enabled: true,
      position: "topLeft", // topRight, topLeft, bottomRight, bottomLeft
      offsetY: 30,
      offsetX: 60,
    },
  },
};

const noData = computed(() => {
  return (
    props.cargado && props.serie.every((objeto) => objeto.data.length === 0)
  );
});
</script>
