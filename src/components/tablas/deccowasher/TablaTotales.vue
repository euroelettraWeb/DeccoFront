<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card>
          <v-row>
            <v-col v-if="cargado">
              <v-row>
                <v-col>
                  <v-card-title>Total de productos</v-card-title>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="mx-4 mb-4">
                  <v-simple-table dense>
                    <template #default>
                      <thead>
                        <tr>
                          <th class="text-left">Consumo Agua</th>
                          <th class="text-left">Consumo Desinfectante</th>
                          <th class="text-left">Consumo Jabon</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
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
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  name: "TablaTotales",
};
</script>
<script setup>
import {
  obtenerDatosVariableGeneral,
  obtenerMaquina,
} from "../../../helpers/bd";
import { onMounted, ref } from "vue";

let consumos = ref([]);
let agua = [];
let tDes = [];
let tJabon = [];

let cargado = ref(false);

onMounted(async () => {
  cargado.value = false;
  let maquina = await obtenerMaquina("lineaTipo", routerStore().lineasID, 1);

  let ultimos = await obtenerDatosVariableGeneral(
    "8H",
    "ultimo",
    "individual",
    "sinfiltro",
    [70, 71, 72],
    maquina[0].id,
    routerStore().clienteID
  );
  for (let index = 0; index < ultimos.length; index++) {
    const ultimo = ultimos[index];
    consumos.value.push({
      id: index,
      name: ultimo.registros[0].y,
    });
  }
  cargado.value = true;
});
</script>
