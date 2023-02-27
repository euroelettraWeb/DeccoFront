<template>
  <v-container>
    <v-card>
      <v-row>
        <v-col v-if="cargado">
          <v-row>
            <v-col>
              <v-card-title>Consumo Hoy</v-card-title>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="mx-4 mb-4">
              <v-simple-table dense>
                <template #default>
                  <thead>
                    <tr>
                      <th class="text-left"></th>
                      <th
                        v-for="item in unidades"
                        :key="item.id"
                        class="text-left"
                      >
                        {{ item.nombre }}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Total</td>
                      <td v-for="item in consumos" :key="item.id">
                        {{ item.name }}
                      </td>
                    </tr>
                    <tr>
                      <td>Total l/kg</td>
                      <td v-for="item in consumosFruta" :key="item.id">
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
  </v-container>
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
let consumosFruta = ref([]);
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
    "totales",
    "individual",
    "sinfiltro",
    props.variables,
    maquinaID,
    routerStore().clienteID
  );
  let deccodos = (
    await obtenerMaquina("lineaTipo", routerStore().lineasID, 2)
  )[0].id;
  if (deccodos) {
    let totalesFruta = await obtenerDatosVariableGeneral(
      "24H",
      "totales",
      "individual",
      "sinfiltro",
      [48],
      deccodos,
      routerStore().clienteID
    );
    for (let index = 0; index < totalesBD.length; index++) {
      const element = totalesBD[index];
      let n = Math.max(0, element.registros[0].total);
      let d =
        totalesFruta[0].registros[0].total > 0
          ? (n / totalesFruta[0].registros[0].total).toFixed(2)
          : 0;
      consumosFruta.value.push({
        id: index,
        name: d,
      });
    }
    totalesBD.push(totalesFruta[0]);
  }
  for (let index = 0; index < totalesBD.length; index++) {
    const element = totalesBD[index];
    unidades.value.push({
      id: index,
      nombre: element.nombreCorto + " (" + element.unidadMedida + ")",
    });
    consumos.value.push({
      id: index,
      name: Math.max(0, element.registros[0].total).toFixed(2),
    });
  }
  unidades.value.push({ id: unidades.value.length, nombre: "Marcha ( min )" });
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
    name: Math.max(0, Math.round(horasMarcha.total / 60)),
  });

  cargado.value = true;
});
</script>
