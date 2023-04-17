<template>
  <v-container fluid class="fill-height">
    <v-card>
      <v-row>
        <v-col>
          <v-card-title>{{ props.linea.nombre }}</v-card-title>
        </v-col>
        <v-col v-for="item in items" :key="item.title">
          <v-card>
            <v-card-title
              @click="
                if (item.estado)
                  router.menu(
                    item.route,
                    props.linea.clienteID,
                    props.linea.id
                  );
              "
              >{{ item.title }}</v-card-title
            >
            <v-card-text>
              <div v-for="val in item.values" :key="val.id">
                {{ item.label }}{{ item.value }}
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "CardLineas",
};
</script>

<script setup>
import { routerStore } from "../../../stores/index";
import {
  obtenerDatosVariableGeneral,
  obtenerMaquina,
} from "../../../helpers/bd";
import { computed, ref } from "vue";
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
let deccowasher = ref([]);
let deccodos = ref([]);
let deccodaf = ref([]);
onMounted(async () => {
  let deccowasherID = (await obtenerMaquina("lineaTipo", props.linea, 3))[0].id;
  let deccodosID = (await obtenerMaquina("lineaTipo", props.linea, 2))[0].id;
  let deccodafID = (await obtenerMaquina("lineaTipo", props.linea, 1))[0].id;
  let dosisDECCOWASHER = await obtenerDatosVariableGeneral(
    "24H",
    "ultimo",
    "individual",
    "sinfiltro",
    [58, 59],
    deccowasherID,
    routerStore().clienteID
  );
  for (let index = 0; index < dosisDECCOWASHER.length; index++) {
    const element = dosisDECCOWASHER[index];
    deccowasher.value.push({
      label: element.descripcion,
      value: element.registros[0].y,
    });
  }
  let totalesDECCOWASHER = await obtenerDatosVariableGeneral(
    "24H",
    "totales",
    "individual",
    "sinfiltro",
    [70, 71, 72],
    deccowasherID,
    routerStore().clienteID
  );
  for (let index = 0; index < totalesDECCOWASHER.length; index++) {
    const element = totalesDECCOWASHER[index];
    let n = Math.max(0, element.registros[0].total);
    deccowasher.value.push({ label: element.descripcion, value: n });
  }
  let dosisDECCODOS = await obtenerDatosVariableGeneral(
    "24H",
    "ultimo",
    "individual",
    "sinfiltro",
    [32, 33, 34, 35, 36, 37, 38, 39],
    deccodosID,
    routerStore().clienteID
  );
  for (let index = 0; index < dosisDECCODOS.length; index++) {
    const element = dosisDECCODOS[index];
    deccodos.value.push({
      label: element.descripcion,
      value: element.registros[0].y,
    });
  }
  let totalesDECCODOS = await obtenerDatosVariableGeneral(
    "24H",
    "totales",
    "individual",
    "sinfiltro",
    [48],
    deccodosID,
    routerStore().clienteID
  );
  for (let index = 0; index < totalesDECCODOS.length; index++) {
    const element = totalesDECCODOS[index];
    let n = Math.max(0, element.registros[0].total);
    deccodos.value.push({ label: element.descripcion, value: n });
  }
  let dosisDECCODAF = await obtenerDatosVariableGeneral(
    "24H",
    "ultimo",
    "individual",
    "sinfiltro",
    [7, 8, 9, 10, 11],
    deccodafID,
    routerStore().clienteID
  );
  for (let index = 0; index < dosisDECCODAF.length; index++) {
    const element = dosisDECCODAF[index];
    deccodaf.value.push({
      label: element.descripcion,
      value: element.registros[0].y,
    });
  }
  let totalesDECCODAF = await obtenerDatosVariableGeneral(
    "24H",
    "totales",
    "individual",
    "sinfiltro",
    [25, 26, 27, 28, 29, 30],
    deccodafID,
    routerStore().clienteID
  );
  for (let index = 0; index < totalesDECCODAF.length; index++) {
    const element = totalesDECCODAF[index];
    let n = Math.max(0, element.registros[0].total);
    deccodaf.value.push({ label: element.descripcion, value: n });
  }
});

let items = computed(() => [
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
