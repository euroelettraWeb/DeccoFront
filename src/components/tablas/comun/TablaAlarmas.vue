<template>
  <v-card>
    <v-row>
      <v-col v-if="cargado">
        <v-row>
          <v-col>
            <v-card-title>
              <strong>Motivos de paro (min)</strong>
            </v-card-title>
            <v-simple-table dense>
              <template #default>
                <thead></thead>
                <tbody>
                  <tr v-for="item in consumos" :key="item.id">
                    <td>
                      {{ item.nombre }}
                    </td>
                    <td class="text-right">
                      {{ item.name }}
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
            <v-card-title>Tiempo de funcionamiento (min)</v-card-title>
            <v-simple-table dense>
              <template #default>
                <thead></thead>
                <tbody>
                  <tr v-for="item in totales" :key="item.id">
                    <td>
                      {{ item.nombre }}
                    </td>
                    <td class="text-right">
                      {{ item.name }}
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-col>
        </v-row>
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
</template>
<script>
export default {
  name: "TablaAlarmas",
};
</script>
<script setup>
import {
  obtenerDatosVariableGeneral,
  obtenerMaquina,
} from "../../../helpers/bd";
import { onMounted, ref, onUnmounted, watch } from "vue";
import { routerStore } from "../../../stores/index";

const consumos = ref([]);
const totales = ref([
  {
    id: 0,
    nombre: "Paro",
    name: 0,
  },
  {
    id: 1,
    nombre: "Marcha",
    name: 0,
  },
]);
let interval = null;
const cargado = ref(false);

const props = defineProps({
  variables: { type: Array, default: () => [] },
  marcha: { type: Array, default: () => [] },
  tipo: { type: Number, default: 1 },
});

const cargarDatos = async () => {
  const maquinaID = (
    await obtenerMaquina("lineaTipo", routerStore().lineasID, props.tipo)
  )[0].id;

  const totalesBD = await obtenerDatosVariableGeneral(
    "24H",
    "registros",
    "individual",
    "totalRangos",
    props.variables,
    maquinaID,
    routerStore().clienteID
  );
  consumos.value = [];
  for (let index = 0; index < totalesBD.length; index++) {
    const element = totalesBD[index];
    consumos.value.push({
      id: element.nombreCorto + index,
      nombre: element.nombreCorto,
      name: Math.max(0, Math.round(element.registros.total1 / 60)),
    });
    totales.value[0].name += Math.max(
      0,
      Math.round(element.registros.total1 / 60)
    );
  }
  const horasMarcha = await obtenerDatosVariableGeneral(
    "24H",
    "registros",
    "multiple",
    "totalMarcha",
    props.marcha,
    maquinaID,
    routerStore().clienteID
  );
  totales.value[1].name = Math.max(0, Math.round(horasMarcha.total / 60));
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
  interval = setInterval(() => {
    cargarDatos();
  }, 90000);
});

onUnmounted(() => {
  clearInterval(interval);
  consumos.value = [];
  totales.value = [
    {
      id: 0,
      nombre: "Paro",
      name: 0,
    },
    {
      id: 1,
      nombre: "Marcha",
      name: 0,
    },
  ];
});
</script>
