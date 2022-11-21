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
let agua = [];
let desinfectante = [];
let jabon = [];
let totalP4 = [];
let totalP5 = [];

let cargado = ref(false);

onMounted(async () => {
  cargado.value = false;
  agua = await obtenerDatosVariable("8H", "total", "sinfiltro", 70);
  desinfectante = await obtenerDatosVariable("8H", "total", "sinfiltro", 71);
  jabon = await obtenerDatosVariable("8H", "total", "sinfiltro", 72);

  consumos.value = [
    { id: 0, name: agua.registros[0].total },
    { id: 1, name: desinfectante.registros[0].total },
    { id: 2, name: jabon.registros[0].total },
    { id: 3, name: totalP4.registros[0].total },
    { id: 4, name: totalP5.registros[0].total },
  ];
  cargado.value = true;
});
</script>
