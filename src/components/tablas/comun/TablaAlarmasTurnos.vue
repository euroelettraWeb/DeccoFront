<template>
  <v-container>
    <v-card>
      <v-row>
        <v-col v-if="cargado">
          <v-row>
            <v-col>
              <v-card-title>Alarmas en este periodo</v-card-title>
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
                      <td>T. mañana</td>
                      <td v-for="item in alarmasM" :key="item.id">
                        {{ item.name }}
                      </td>
                    </tr>
                    <tr>
                      <td>T. tarde</td>
                      <td v-for="item in alarmasT" :key="item.id">
                        {{ item.name }}
                      </td>
                    </tr>
                    <tr>
                      <td>T. noche</td>
                      <td v-for="item in alarmasN" :key="item.id">
                        {{ item.name }}
                      </td>
                    </tr>
                    <tr>
                      <td>Total Hoy</td>
                      <td v-for="item in alarmas" :key="item.id">
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
  name: "TablaTotalTurnos",
};
</script>
<script setup>
import {
  obtenerDatosVariableGeneral,
  obtenerMaquina,
} from "../../../helpers/bd";
import { onMounted, ref } from "vue";
import { routerStore } from "../../../stores/index";

const alarmasM = ref([]);
const alarmasT = ref([]);
const alarmasN = ref([]);
const alarmas = ref([]);
const unidades = ref([]);

const cargado = ref(false);

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
  let totales = await obtenerDatosVariableGeneral(
    "24H-Turno",
    "registros",
    "individual",
    "tiempoTurnos",
    props.variables,
    maquinaID,
    routerStore().clienteID
  );
  for (let index = 0; index < totales.length; index++) {
    const element = totales[index];
    unidades.value.push({
      id: index,
      nombre: element.nombreCorto + " (" + element.unidadMedida + ")",
    });
    alarmasM.value.push({
      id: index,
      name: Math.max(0, element.registros[0].total),
    });
    alarmasT.value.push({
      id: index,
      name: Math.max(0, element.registros[1].total),
    });
    alarmasN.value.push({
      id: index,
      name: Math.max(0, element.registros[2].total),
    });
    alarmas.value.push({
      id: index,
      name: Math.max(0, element.registros[3].total),
    });
  }
  unidades.value.push({ id: unidades.value.length, nombre: "Marcha ( min )" });
  let horasMarcha = await obtenerDatosVariableGeneral(
    "24H-Turno",
    "registros",
    "multiple",
    "turnosMarcha",
    props.marcha,
    maquinaID,
    routerStore().clienteID
  );
  alarmasM.value.push({
    id: unidades.value.length,
    name: Math.max(0, Math.round(horasMarcha.total[0] / 60)),
  });
  alarmasT.value.push({
    id: unidades.value.length,
    name: Math.max(0, Math.round(horasMarcha.total[1] / 60)),
  });
  alarmasN.value.push({
    id: unidades.value.length,
    name: Math.max(0, Math.round(horasMarcha.total[2] / 60)),
  });
  alarmas.value.push({
    id: unidades.value.length,
    name: Math.max(0, Math.round(horasMarcha.total[3] / 60)),
  });
  cargado.value = true;
});
</script>
