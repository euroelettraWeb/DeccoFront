<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card>
          <v-row>
            <v-col v-if="cargado">
              <v-row>
                <v-col>
                  <v-card-title>Estado actual</v-card-title>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="mx-4 mb-4">
                  <v-simple-table dense>
                    <template #default>
                      <thead>
                        <tr>
                          <th class="text-left"></th>
                          <th class="text-left">L4</th>
                          <th class="text-left">L5</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="item in consumos" :key="item.id">
                          <td>
                            {{ item.name }}
                          </td>
                          <td v-for="child in item.lineas" :key="child.idLinea">
                            {{ child.valor }}
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
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  name: "TablaInforme",
};
</script>
<script setup>
import {
  obtenerDatosVariableGeneral,
  obtenerMaquina,
} from "../../../helpers/bd";
import { onMounted, ref } from "vue";

const consumos = ref([]);
const cargado = ref(false);

onMounted(async () => {
  cargado.value = false;
  let maquinaID = (await obtenerMaquina("lineaTipo", 1, 1))[0].id;
  let ultimos = await obtenerDatosVariableGeneral(
    "24H",
    "ultimo",
    "individual",
    "sinfiltro",
    [25, 26, 27, 28, 29, 30, 18, 19],
    maquinaID,
    routerStore().clienteID
  );

  consumos.value = [];
  for (let index = 0; index < ultimos.length; index++) {
    const element = ultimos[index];
    consumos.value.push({
      id: index,
      name: element.nombreCorto,
      lineas: { idLinea: "L4", valor: element.registros[0].y },
    });
  }
  cargado.value = true;
});
</script>
