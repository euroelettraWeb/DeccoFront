<template>
  <v-container>
    <v-card>
      <v-row>
        <v-col v-if="cargado">
          <v-row>
            <v-col>
              <v-card-title>Consumo en este periodo</v-card-title>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="mx-4 mb-4">
              <v-simple-table dense>
                <template #default>
                  <thead>
                    <tr>
                      <th class="text-left">Consumo agua</th>
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
let agua = [];
let totalP1 = [];
let totalP2 = [];
let totalP3 = [];
let totalP4 = [];
let totalP5 = [];

let aguaU = [];
let totalP1U = [];
let totalP2U = [];
let totalP3U = [];
let totalP4U = [];
let totalP5U = [];

let cargado = ref(false);

onMounted(async () => {
  cargado.value = false;
  let ultimos = await bd.obtenerDatosVariableGeneral(
    "8H",
    "ultimo",
    "individual",
    "sinfiltro",
    [25, 26, 27, 28, 29, 30, 18, 19],
    maquinaID,
    routerStore().clienteID
  );
  let primeros = await bd.obtenerDatosVariableGeneral(
    "8H",
    "primero",
    "individual",
    "sinfiltro",
    [25, 26, 27, 28, 29, 30, 18, 19],
    maquinaID,
    routerStore().clienteID
  );
  for (let index = 0; index < ultimos.length; index++) {
    const ultimo = ultimos[index];
    const primero = primeros[index];
    consumos.value.push({
      id: index,
      name: ultimo.registros[0].y - primero.registros[0].y,
    });
  }
  cargado.value = true;
});
</script>
