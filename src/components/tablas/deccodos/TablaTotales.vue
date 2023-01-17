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
                          <th class="text-left">Consumo Aplicador 2</th>
                          <th class="text-left">Consumo Aplicador 3</th>
                          <th class="text-left">Consumo Bomba 1</th>
                          <th class="text-left">Consumo Bomba 2</th>
                          <th class="text-left">Consumo Bomba 3</th>
                          <th class="text-left">Consumo Bomba 4</th>
                          <th class="text-left">Consumo Bomba 5</th>
                          <th class="text-left">Consumo Cera</th>
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
import bd from "../../../helpers/bd";
import { onMounted, ref } from "vue";

let consumos = ref([]);
let ta2D = [];
let ta3D = [];
let totalP1 = [];
let totalP2 = [];
let totalP3 = [];
let totalP4 = [];
let totalP5 = [];
let cera = [];

let cargado = ref(false);

onMounted(async () => {
  cargado.value = false;

  let ultimos = await obtenerDatosVariableGeneral(
    "8H",
    "ultimo",
    "individual",
    "sinfiltro",
    [49, 50, 51, 52, 53, 54, 55, 56],
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
