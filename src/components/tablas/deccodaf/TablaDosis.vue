<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card>
          <v-row>
            <v-col v-if="cargado">
              <v-row>
                <v-col>
                  <v-card-title>Total de dosis productos</v-card-title>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="mx-4 mb-4">
                  <v-simple-table dense>
                    <template #default>
                      <thead>
                        <tr>
                          <th class="text-left">Dosis Producto 1</th>
                          <th class="text-left">Dosis Producto 2</th>
                          <th class="text-left">Dosis Producto 3</th>
                          <th class="text-left">Dosis Producto 4</th>
                          <th class="text-left">Dosis Producto 5</th>
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
  name: "TablaDosis",
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
let totalP1 = [];
let totalP2 = [];
let totalP3 = [];
let totalP4 = [];
let totalP5 = [];

let cargado = ref(false);

onMounted(async () => {
  cargado.value = false;
  totalP1 = await obtenerDatosVariable("8h", "total", "sinfiltro", 7);
  totalP2 = await obtenerDatosVariable("8h", "total", "sinfiltro", 8);
  totalP3 = await obtenerDatosVariable("8h", "total", "sinfiltro", 9);
  totalP4 = await obtenerDatosVariable("8h", "total", "sinfiltro", 10);
  totalP5 = await obtenerDatosVariable("8h", "total", "sinfiltro", 11);

  consumos.value = [
    { id: 0, name: totalP1.registros[0].total },
    { id: 1, name: totalP2.registros[0].total },
    { id: 2, name: totalP3.registros[0].total },
    { id: 3, name: totalP4.registros[0].total },
    { id: 4, name: totalP5.registros[0].total },
  ];
  cargado.value = true;
});
</script>
