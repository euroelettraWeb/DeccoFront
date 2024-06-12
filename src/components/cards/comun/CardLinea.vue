<template>
  <v-card class="grey">
    <v-row>
      <v-col
        xs="12"
        sm="6"
        lg="3"
        class="text-center text-h1 align-self-center"
      >
        {{ props.linea.nombre }}
      </v-col>
      <v-col v-for="item in items" :key="item.title" xs="12" sm="6" lg="3">
        <v-card class="primary" height="425">
          <v-card-title>
            <v-btn
              @click="
                if (item.estado)
                  router.menu(
                    item.route,
                    props.linea.clienteID,
                    props.linea.id
                  );
              "
              >{{ item.title }}</v-btn
            >
          </v-card-title>
          <v-card-text>
            <v-row v-for="val in item.values" :key="val.id" no-gutters>
              <v-col cols="9">{{ val.label }}</v-col>
              <v-col cols="3">{{ val.value }}</v-col>
            </v-row>
            <v-row no-gutters>
              <v-col cols="12" class="pt-2 orange--text text-subtitle">
                Alarmas Activas
              </v-col>
              <v-col v-for="val in item.alarmas" :key="val.id" cols="12">{{
                val.label
              }}</v-col>
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

const dosDecimales = function (valor) {
  if (valor === null || valor === undefined) return 0;
  return Math.round(parseFloat(valor) * 100) / 100;
};

onMounted(async () => {
  values();
});
let interval = setInterval(() => {
  values();
}, 45000);
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

  const nombreProductosDECCOWASHER = await obtenerDatosVariableGeneral(
    "24H",
    "ultimo",
    "individual",
    "sinfiltro",
    [135, 136],
    deccowasherID,
    routerStore().clienteID
  );
  const numeroLotesDECCOWASHER = await obtenerDatosVariableGeneral(
    "24H",
    "ultimo",
    "individual",
    "sinfiltro",
    [99, 100],
    deccowasherID,
    routerStore().clienteID
  );

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
    ...dosisDECCOWASHER.map((element, index) => ({
      label:
        element.descripcion +
        " " +
        (nombreProductosDECCOWASHER[index].registros[0]?.y || 0) +
        " (Lote " +
        (numeroLotesDECCOWASHER[index].registros[0]?.y || 0) +
        ")",
      value:
        dosDecimales(element.registros[0]?.y || 0) + " " + element.unidadMedida,
    })),
    ...totalesDECCOWASHER.map((element, index) => ({
      label:
        index < 1
          ? element.descripcion
          : element.descripcion +
            " " +
            (nombreProductosDECCOWASHER[index - 1].registros[0]?.y || 0) +
            " (Lote " +
            (numeroLotesDECCOWASHER[index - 1].registros[0]?.y || 0) +
            ")",
      value:
        dosDecimales(Math.max(0, element.registros[0]?.total || 0)) +
        " " +
        element.unidadMedida,
    })),
  ];
  deccowasherAlarmas.value = [
    ...alarmaDECCOWS
      .filter((element) => element.registros[0]?.y === 1)
      .map((element) => ({
        label: element.descripcion,
      })),
  ];

  const nombreProductosDECCODOS = await obtenerDatosVariableGeneral(
    "24H",
    "ultimo",
    "individual",
    "sinfiltro",
    [82, 83],
    deccodosID,
    routerStore().clienteID
  );
  const numeroLotesDECCODOS = await obtenerDatosVariableGeneral(
    "24H",
    "ultimo",
    "individual",
    "sinfiltro",
    [96, 97],
    deccodosID,
    routerStore().clienteID
  );

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
    ...dosisDECCODOS.map((element, index) => ({
      label:
        index < 2
          ? `${element.descripcion}: ${
              nombreProductosDECCODOS[index].registros[0]?.y || 0
            } (Lote ${numeroLotesDECCODOS[index].registros[0]?.y || 0})`
          : `${element.descripcion}`,
      value: `${dosDecimales(element.registros[0]?.y || 0)} ${
        element.unidadMedida
      }`,
    })),
    ...totalesDECCODOS.map((element) => ({
      label: `${element.descripcion}`,
      value: `${dosDecimales(Math.max(0, element.registros[0]?.total || 0))} ${
        element.unidadMedida
      }`,
    })),
  ];
  deccodosAlarmas.value = [
    ...alarmaDECCODOS
      .filter((element) => element.registros[0]?.y === 1)
      .map((element) => ({
        label: element.descripcion,
      })),
  ];

  const nombreProductosDECCODAF = await obtenerDatosVariableGeneral(
    "24H",
    "ultimo",
    "individual",
    "sinfiltro",
    [101, 102, 103, 104, 105],
    deccodafID,
    routerStore().clienteID
  );
  const numeroLotesDECCODAF = await obtenerDatosVariableGeneral(
    "24H",
    "ultimo",
    "individual",
    "sinfiltro",
    [90, 91, 92, 93, 94],
    deccodafID,
    routerStore().clienteID
  );

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
    ...dosisDECCODAF.map((element, index) => ({
      label:
        element.descripcion +
        ": " +
        (nombreProductosDECCODAF[index].registros[0]?.y || 0) +
        " (Lote " +
        (numeroLotesDECCODAF[index].registros[0]?.y || 0) +
        ")",
      value:
        dosDecimales(element.registros[0]?.y || 0) + " " + element.unidadMedida,
    })),
    ...totalesDECCODAF.map((element, index) => ({
      label:
        index === 0
          ? element.descripcion
          : element.descripcion +
            ": " +
            (nombreProductosDECCODAF[index - 1].registros[0]?.y || 0) +
            " (Lote " +
            (numeroLotesDECCODAF[index - 1].registros[0]?.y || 0) +
            ")",
      value:
        dosDecimales(Math.max(0, element.registros[0]?.total || 0)) +
        " " +
        element.unidadMedida,
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
