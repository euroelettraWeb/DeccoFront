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
import bd from "../../../helpers/bd";
import { onMounted, ref } from "vue";
import { routerStore } from "../../../stores/index";

let consumos = ref([]);
let unidades = ref([]);

let cargado = ref(false);

const props = defineProps({
  variables: { type: Array, default: new Array() },
  marcha: { type: Array, default: new Array(3) },
  tipo: { type: Number, default: 1 },
});

onMounted(async () => {
  cargado.value = false;
  let clienteID = routerStore().clienteID;
  let maquinaID = (
    await bd.obtenerMaquina("lineaTipo", routerStore().lineasID, props.tipo)
  )[0].id;

  for (let index = 0; index < props.variables.length; index++) {
    const element = props.variables[index];
    let i = await bd.obtenerDatosVariableTotal(
      clienteID,
      "24H",
      element,
      maquinaID
    );
    unidades.value.push({
      id: index,
      nombre: i.nombreCorto + " (" + i.unidadMedida + ")",
    });
    consumos.value.push({
      id: index,
      name: Math.max(0, i.registros[3][0].total),
    });
  }
  unidades.value.push({ id: unidades.value.length, nombre: "Marcha ( min )" });
  let horasMarcha = await bd.obtenerVariablesMarcha(
    clienteID,
    "24H",
    props.marcha,
    "total",
    maquinaID
  );
  consumos.value.push({
    id: unidades.value.length,
    name: Math.max(0, Math.round(horasMarcha.total / 60)),
  });
  cargado.value = true;
});
</script>
