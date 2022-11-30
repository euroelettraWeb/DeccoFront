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
                          <th class="text-left">Consumo Producto 1</th>
                          <th class="text-left">Consumo Producto 2</th>
                          <th class="text-left">Consumo Producto 3</th>
                          <th class="text-left">Consumo Producto 4</th>
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
  name: "TablaTotalProductos",
};
</script>
<script setup>
import bd from "../../../helpers/bd";
import { computed, onMounted, ref } from "vue";
import { routerStore } from "../../../stores";

let consumos = ref([]);
let totaltB1 = [];
let totaltB2 = [];
let totaltB3 = [];
let totaltB4 = [];
let totaltB5 = [];

let cargado = ref(false);

onMounted(async () => {
  let maquina = await bd.obtenerMaquina("lineaTipo", routerStore().lineasID, 1);
  let t = await bd.obtenerProductos("maquina", maquina[0].id);
  cargado.value = false;
  totaltB1 = await bd.obtenerDatosVariable("8H", "ultimo", "sinfiltro", 51);
  totaltB2 = await bd.obtenerDatosVariable("8H", "ultimo", "sinfiltro", 52);
  totaltB3 = await bd.obtenerDatosVariable("8H", "ultimo", "sinfiltro", 53);
  totaltB4 = await bd.obtenerDatosVariable("8H", "ultimo", "sinfiltro", 54);
  totaltB5 = await bd.obtenerDatosVariable("8H", "ultimo", "sinfiltro", 55);

  consumos.value = [
    { id: 0, name: totaltB1.registros[0].y },
    { id: 1, name: totaltB2.registros[0].y },
    { id: 2, name: totaltB3.registros[0].y },
    { id: 3, name: totaltB4.registros[0].y },
    { id: 4, name: totaltB5.registros[0].y },
  ];
  cargado.value = true;
});
</script>
