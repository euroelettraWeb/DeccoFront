<template>
  <v-card>
    <v-row>
      <v-col v-if="cargado">
        <v-card-title>Motivos de paro</v-card-title>
        <v-row>
          <v-col>
            <v-simple-table dense>
              <template #default>
                <thead>
                  <tr>
                    <th></th>
                    <th>Min</th>
                  </tr>
                </thead>
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
import { onMounted, ref } from "vue";
import { routerStore } from "../../../stores/index";

let consumos = ref([]);
let unidades = ref([]);

let cargado = ref(false);

const props = defineProps({
  variables: { type: Array, default: () => [] },
  marcha: { type: Array, default: () => [] },
  tipo: { type: Number, default: 1 },
});

onMounted(async () => {
  cargado.value = false;
  let maquinaID = (
    await obtenerMaquina("lineaTipo", routerStore().lineasID, props.tipo)
  )[0].id;

  let totalesBD = await obtenerDatosVariableGeneral(
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
  }
  let horasMarcha = await obtenerDatosVariableGeneral(
    "24H",
    "registros",
    "multiple",
    "totalMarcha",
    props.marcha,
    maquinaID,
    routerStore().clienteID
  );
  consumos.value.push({
    id: unidades.value.length,
    nombre: "Marcha",
    name: Math.max(0, Math.round(horasMarcha.total / 60)),
  });
  cargado.value = true;
  setInterval(async () => {
    let totalesBD = await obtenerDatosVariableGeneral(
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
      consumos.value[index] = {
        id: element.nombreCorto + index,
        nombre: element.nombreCorto,
        name: Math.max(0, Math.round(element.registros.total1 / 60)),
      };
    }
    let horasMarcha = await obtenerDatosVariableGeneral(
      "24H",
      "registros",
      "multiple",
      "totalMarcha",
      props.marcha,
      maquinaID,
      routerStore().clienteID
    );
    consumos.value.pop();
    consumos.value.push({
      id: unidades.value.length,
      nombre: "Marcha",
      name: Math.max(0, Math.round(horasMarcha.total / 60)),
    });
  }, 3000);
});
</script>
