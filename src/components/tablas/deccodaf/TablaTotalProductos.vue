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
                          <th class="text-left">Consumo Producto 5</th>
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
import {
  obtenerDatosVariableGeneral,
  obtenerMaquina,
  obtenerProductos,
} from "../../../helpers/bd";
import { onMounted, ref } from "vue";
import { routerStore } from "../../../stores";

let consumos = ref([]);

let cargado = ref(false);

onMounted(async () => {
  let maquina = await obtenerMaquina("lineaTipo", routerStore().lineasID, 1);
  let t = await obtenerProductos("maquina", maquina[0].id);
  cargado.value = false;

  let ultimos = await obtenerDatosVariableGeneral(
    "24H",
    "ultimo",
    "individual",
    "sinfiltro",
    [51, 52, 53, 54, 55],
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
