<template>
  <v-card class="grey">
    <v-row>
      <v-col align-self="center">
        <div class="text-h1">{{ props.linea.nombre }}</div>
      </v-col>
      <v-col v-for="item in items" :key="item.title">
        <v-card class="black" height="375">
          <v-card-title
            @click="
              if (item.estado)
                router.menu(item.route, props.linea.clienteID, props.linea.id);
            "
            >{{ item.title }}</v-card-title
          >
          <v-card-text>
            <v-row v-for="val in item.values" :key="val.id" no-gutters>
              <v-col>{{ val.label }}</v-col>
              <v-col>{{ val.value }}</v-col>
            </v-row>
            <v-card-subtitle class="red--text">Alarmas Activas</v-card-subtitle>
            <v-row v-for="val in item.alarmas" :key="val.id" no-gutters>
              <v-col>{{ val.label }}</v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
export default {
  name: "CardLinea",
};
</script>

<script setup>
import { routerStore } from "../../../stores/index";
import {
  obtenerDatosVariableGeneral,
  obtenerMaquina,
} from "../../../helpers/bd";
import { computed, ref, onMounted, onUnmounted } from "vue";
const router = routerStore();
const props = defineProps({
  id: { type: Number, default: 1 },
  linea: {
    type: Object,
    default() {
      return {
        clienteID: 0,
        id: 0,
        nombre: "",
        deccodafID: null,
        deccodosID: null,
        deccowsID: null,
        deccocontrolID: null,
      };
    },
  },
});
const deccowasher = ref([]);
const deccodos = ref([]);
const deccodaf = ref([]);
const deccowasherAlarmas = ref([]);
const deccodosAlarmas = ref([]);
const deccodafAlarmas = ref([]);
onMounted(async () => {
  values();
});
let interval = setInterval(async () => {
  values();
}, 1000);
async function values() {
  const [deccowasherID, deccodosID, deccodafID] = await Promise.all([
    obtenerMaquina("lineaTipo", props.linea.id, 3).then(
      (machines) => machines[0].id
    ),
    obtenerMaquina("lineaTipo", props.linea.id, 2).then(
      (machines) => machines[0].id
    ),
    obtenerMaquina("lineaTipo", props.linea.id, 1).then(
      (machines) => machines[0].id
    ),
  ]);
  const [dosisDECCOWASHER, totalesDECCOWASHER, alarmaDECCOWS] =
    await Promise.all([
      obtenerDatosVariableGeneral(
        "24H",
        "ultimo",
        "individual",
        "sinfiltro",
        [58, 59],
        deccowasherID,
        routerStore().clienteID
      ),
      obtenerDatosVariableGeneral(
        "24H",
        "totales",
        "individual",
        "sinfiltro",
        [70, 71, 72],
        deccowasherID,
        routerStore().clienteID
      ),
      obtenerDatosVariableGeneral(
        "24H",
        "ultimo",
        "individual",
        "sinfiltro",
        [60, 84, 85, 86, 87],
        deccowasherID,
        routerStore().clienteID
      ),
    ]);
  deccowasher.value = [
    ...dosisDECCOWASHER.map((element) => ({
      label: element.descripcion + " ( " + element.unidadMedida + " )",
      value: element.registros[0]?.y || "",
    })),
    ...totalesDECCOWASHER.map((element) => ({
      label: element.descripcion + " ( " + element.unidadMedida + " )",
      value: Math.max(0, element.registros[0]?.total || 0),
    })),
  ];
  deccowasherAlarmas.value = [
    ...alarmaDECCOWS
      .filter((element) => element.registros[0]?.y === 1)
      .map((element) => ({
        label: element.descripcion,
      })),
  ];
  const [dosisDECCODOS, totalesDECCODOS, alarmaDECCODOS] = await Promise.all([
    obtenerDatosVariableGeneral(
      "24H",
      "ultimo",
      "individual",
      "sinfiltro",
      [32, 33, 34, 35, 36, 37, 38, 39],
      deccodosID,
      routerStore().clienteID
    ),
    obtenerDatosVariableGeneral(
      "24H",
      "totales",
      "individual",
      "sinfiltro",
      [48],
      deccodosID,
      routerStore().clienteID
    ),
    obtenerDatosVariableGeneral(
      "24H",
      "ultimo",
      "individual",
      "sinfiltro",
      [40],
      deccodosID,
      routerStore().clienteID
    ),
  ]);

  deccodos.value = [
    ...dosisDECCODOS.map((element) => ({
      label: `${element.descripcion} ( ${element.unidadMedida} )`,
      value: element.registros[0]?.y,
    })),
    ...totalesDECCODOS.map((element) => ({
      label: `${element.descripcion} ( ${element.unidadMedida} )`,
      value: Math.max(0, element.registros[0]?.total || 0),
    })),
  ];
  deccodosAlarmas.value = [
    ...alarmaDECCODOS
      .filter((element) => element.registros[0]?.y === 1)
      .map((element) => ({
        label: element.descripcion,
      })),
  ];

  const [dosisDECCODAF, totalesDECCODAF, alarmaDECCODAF] = await Promise.all([
    obtenerDatosVariableGeneral(
      "24H",
      "ultimo",
      "individual",
      "sinfiltro",
      [7, 8, 9, 10, 11],
      deccodafID,
      routerStore().clienteID
    ),
    obtenerDatosVariableGeneral(
      "24H",
      "totales",
      "individual",
      "sinfiltro",
      [25, 26, 27, 28, 29, 30],
      deccodafID,
      routerStore().clienteID
    ),
    obtenerDatosVariableGeneral(
      "24H",
      "ultimo",
      "individual",
      "sinfiltro",
      [12, 73, 74, 75],
      deccodafID,
      routerStore().clienteID
    ),
  ]);

  deccodaf.value = [
    ...dosisDECCODAF.map((element) => ({
      label: element.descripcion + " ( " + element.unidadMedida + " )",
      value: element.registros[0]?.y,
    })),
    ...totalesDECCODAF.map((element) => ({
      label: element.descripcion + " ( " + element.unidadMedida + " )",
      value: Math.max(0, element.registros[0]?.total || 0),
    })),
  ];
  deccodafAlarmas.value = [
    ...alarmaDECCODAF
      .filter((element) => element.registros[0]?.y === 1)
      .map((element) => ({
        label: element.descripcion,
      })),
  ];
}
const items = computed(() => [
  {
    action: "mdi-hand-water",
    estado: props.linea.deccowsID ? true : false,
    route: "deccowasher:Principal",
    title: "DECCOWASHER",
    values: deccowasher.value,
    alarmas: deccowasherAlarmas.value,
  },
  {
    action: "mdi-flask",
    estado: props.linea.deccodafID ? true : false,
    route: "deccodaf:Principal",
    title: "DECCODAF",
    values: deccodaf.value,
    alarmas: deccodafAlarmas.value,
  },
  {
    action: "mdi-numeric-2",
    estado: props.linea.deccodosID ? true : false,
    route: "deccodos:Principal",
    title: "DECCODOS",
    values: deccodos.value,
    alarmas: deccodosAlarmas.value,
  },
]);
onUnmounted(() => {
  clearInterval(interval);
});
</script>
<style scoped>
* {
  color: #fff;
}
</style>
