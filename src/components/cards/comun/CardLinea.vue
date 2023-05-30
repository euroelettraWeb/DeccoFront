<template>
  <v-card class="back">
    <v-row>
      <v-col align-self="center">
        <v-card-title>{{ props.linea.nombre }}</v-card-title>
      </v-col>
      <v-col v-for="item in items" :key="item.title">
        <v-card class="ele" height="350">
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
import { computed, ref, onMounted } from "vue";
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
onMounted(async () => {
  const deccowasherID = (
    await obtenerMaquina("lineaTipo", props.linea.id, 3)
  )[0].id;
  const deccodosID = (await obtenerMaquina("lineaTipo", props.linea.id, 2))[0]
    .id;
  const deccodafID = (await obtenerMaquina("lineaTipo", props.linea.id, 1))[0]
    .id;

  const [dosisDECCOWASHER, totalesDECCOWASHER] = await Promise.all([
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
  ]);
  deccowasher.value = dosisDECCOWASHER.map((element) => ({
    label: element.descripcion,
    value: element.registros[0]?.y || "",
  }));

  deccowasher.value.push(
    ...totalesDECCOWASHER.map((element) => ({
      label: element.descripcion,
      value: Math.max(0, element.registros[0]?.total || 0),
    }))
  );

  const [dosisDECCODOS, totalesDECCODOS] = await Promise.all([
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
  ]);

  deccodos.value = [
    ...dosisDECCODOS.map((element) => ({
      label: element.descripcion,
      value: element.registros[0]?.y,
    })),
    ...totalesDECCODOS.map((element) => ({
      label: element.descripcion,
      value: Math.max(0, element.registros[0]?.total || 0),
    })),
  ];

  const [dosisDECCODAF, totalesDECCODAF] = await Promise.all([
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
  ]);

  deccodaf.value = [
    ...dosisDECCODAF.map((element) => ({
      label: element.descripcion,
      value: element.registros[0]?.y,
    })),
    ...totalesDECCODAF.map((element) => ({
      label: element.descripcion,
      value: Math.max(0, element.registros[0]?.total || 0),
    })),
  ];
});
const items = computed(() => [
  {
    action: "mdi-hand-water",
    estado: props.linea.deccowsID ? true : false,
    route: "deccowasher:Principal",
    title: "DECCOWASHER",
    values: deccowasher.value,
  },
  {
    action: "mdi-flask",
    estado: props.linea.deccodafID ? true : false,
    route: "deccodaf:Principal",
    title: "DECCODAF",
    values: deccodaf.value,
  },
  {
    action: "mdi-numeric-2",
    estado: props.linea.deccodosID ? true : false,
    route: "deccodos:Principal",
    title: "DECCODOS",
    values: deccodos.value,
  },
]);
</script>
<style scoped>
* {
  color: #fff;
}
.ele {
  background-color: black !important;
}
.back {
  background-color: gray !important;
}
</style>
