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
let agua = [];
let tDes = [];
let tJabon = [];

let cargado = ref(false);

onMounted(async () => {
  cargado.value = false;
  agua = await obtenerDatosVariable("8H", "ultimo", "sinfiltro", 70);
  tDes = await obtenerDatosVariable("8H", "ultimo", "sinfiltro", 71);
  tJabon = await obtenerDatosVariable("8H", "ultimo", "sinfiltro", 72);

  consumos.value = [
    { id: 0, name: agua.registros[0].y },
    { id: 1, name: tDes.registros[0].y },
    { id: 2, name: tJabon.registros[0].y },
  ];
  cargado.value = true;
});
</script>
