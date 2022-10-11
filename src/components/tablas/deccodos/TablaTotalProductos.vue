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
  ta2D = await obtenerDatosVariable("8h", "ultimo", "sinfiltro", 49);
  ta3D = await obtenerDatosVariable("8h", "ultimo", "sinfiltro", 50);
  totalP1 = await obtenerDatosVariable("8h", "ultimo", "sinfiltro", 51);
  totalP2 = await obtenerDatosVariable("8h", "ultimo", "sinfiltro", 52);
  totalP3 = await obtenerDatosVariable("8h", "ultimo", "sinfiltro", 53);
  totalP4 = await obtenerDatosVariable("8h", "ultimo", "sinfiltro", 54);
  totalP5 = await obtenerDatosVariable("8h", "ultimo", "sinfiltro", 55);
  cera = await obtenerDatosVariable("8h", "ultimo", "sinfiltro", 56);

  consumos.value = [
    { id: 0, name: ta2D.registros[0].y },
    { id: 1, name: ta3D.registros[0].y },
    { id: 2, name: totalP1.registros[0].y },
    { id: 3, name: totalP2.registros[0].y },
    { id: 4, name: totalP3.registros[0].y },
    { id: 5, name: totalP4.registros[0].y },
    { id: 6, name: totalP5.registros[0].y },
    { id: 7, name: cera.registros[0].y },
  ];
  cargado.value = true;
});
</script>
