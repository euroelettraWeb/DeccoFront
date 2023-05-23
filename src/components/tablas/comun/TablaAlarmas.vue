<template>
  <v-card>
    <v-row>
      <v-col v-if="cargado">
        <v-row>
          <v-col
            ><v-card-title>Motivos de paro (min)</v-card-title>
            <v-simple-table dense>
              <template #default>
                <thead></thead>
                <tbody>
                  <tr v-for="item in consumos" :key="item.id">
                    <td>
                      {{ item.nombre }}
                    </td>
                    <td>
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
                    <td>
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
  name: "TablaTotal",
};
</script>
<script setup>
import {
  obtenerDatosVariableGeneral,
  obtenerMaquina,
} from "../../../helpers/bd";
import { onMounted, ref, onUnmounted, reactive } from "vue";
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

onMounted(async () => {
  cargado.value = false;
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
  cargado.value = true;
  interval = setInterval(async () => {
    const totalesBD = await obtenerDatosVariableGeneral(
      "24H",
      "registros",
      "individual",
      "totalRangos",
      props.variables,
      maquinaID,
      routerStore().clienteID
    );
    consumos.value.pop();
    totales.value[0].name = 0;
    for (let index = 0; index < totalesBD.length; index++) {
      const element = totalesBD[index];
      consumos.value[index] = {
        id: element.nombreCorto + index,
        nombre: element.nombreCorto,
        name: Math.max(0, Math.round(element.registros.total1 / 60)),
      };
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
  }, 3000);
});
onUnmounted(() => {
  clearInterval(interval);
});
</script>
