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
  name: "TablaTotalProductos",
};
</script>
<script setup>
import axios from "axios";
import { onMounted, ref } from "vue";

async function obtenerDatosVariable(operacion, modo, filtrado, variableID) {
  return (
    await axios.get(
      `${process.env.VUE_APP_RUTA_API}/variable/${operacion}/${modo}/${filtrado}/${variableID}`
    )
  ).data;
}
// async function obtenerDatosVariable(clienteID, modo, variableID) {
//   return (
//     await axios.get(
//       `${process.env.VUE_APP_RUTA_API}/variable/total/${clienteID}/${modo}/${variableID}`
//     )
//   ).data;
// }

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
  // agua = await obtenerDatosVariable(clienteID, 70);
  // totalDesinfectante = await obtenerDatosVariable(clienteID, 71);
  // totalJabon = await obtenerDatosVariable(clienteID, 72);
  agua = await obtenerDatosVariable("8h", "primero", "sinfiltro", 25);
  totalP1 = await obtenerDatosVariable("8h", "primero", "sinfiltro", 26);
  totalP2 = await obtenerDatosVariable("8h", "primero", "sinfiltro", 27);
  totalP3 = await obtenerDatosVariable("8h", "primero", "sinfiltro", 28);
  totalP4 = await obtenerDatosVariable("8h", "primero", "sinfiltro", 29);
  totalP5 = await obtenerDatosVariable("8h", "primero", "sinfiltro", 30);
  aguaU = await obtenerDatosVariable("8h", "ultimo", "sinfiltro", 25);
  totalP1U = await obtenerDatosVariable("8h", "ultimo", "sinfiltro", 26);
  totalP2U = await obtenerDatosVariable("8h", "ultimo", "sinfiltro", 27);
  totalP3U = await obtenerDatosVariable("8h", "ultimo", "sinfiltro", 28);
  totalP4U = await obtenerDatosVariable("8h", "ultimo", "sinfiltro", 29);
  totalP5U = await obtenerDatosVariable("8h", "ultimo", "sinfiltro", 30);

  consumos.value = [
    { id: 0, name: aguaU.registros[0].y - agua.registros[0].y },
    { id: 1, name: totalP1U.registros[0].y - totalP1.registros[0].y },
    { id: 2, name: totalP2U.registros[0].y - totalP2.registros[0].y },
    { id: 3, name: totalP3U.registros[0].y - totalP3.registros[0].y },
    { id: 4, name: totalP4U.registros[0].y - totalP4.registros[0].y },
    { id: 5, name: totalP5U.registros[0].y - totalP5.registros[0].y },
  ];
  cargado.value = true;
});
</script>
