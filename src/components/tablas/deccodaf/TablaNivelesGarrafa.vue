<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card>
          <v-row>
            <v-col v-if="cargado">
              <v-row>
                <v-col>
                  <v-card-title>Activacion de nivel de garrafas</v-card-title>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="mx-4 mb-4">
                  <v-simple-table dense>
                    <template #default>
                      <thead>
                        <tr>
                          <th class="text-left">Nivel Producto 1</th>
                          <th class="text-left">Nivel Producto 2</th>
                          <th class="text-left">Nivel Producto 3</th>
                          <th class="text-left">Nivel Producto 4</th>
                          <th class="text-left">Nivel Producto 5</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td v-for="item in niveles" :key="item.id">
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
  name: "TablaNivelesGarrafa",
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

let niveles = ref([]);

let cnP1 = [];
let cnP2 = [];
let cnP3 = [];
let cnP4 = [];
let cnP5 = [];

let cargado = ref(false);

onMounted(async () => {
  cargado.value = false;
  cnP1 = await obtenerDatosVariable("8h", "count", "sinfiltro", 20);
  cnP2 = await obtenerDatosVariable("8h", "count", "sinfiltro", 21);
  cnP3 = await obtenerDatosVariable("8h", "count", "sinfiltro", 22);
  cnP4 = await obtenerDatosVariable("8h", "count", "sinfiltro", 23);
  cnP5 = await obtenerDatosVariable("8h", "count", "sinfiltro", 24);

  niveles.value = [
    { id: 0, name: cnP1.registros[0].count },
    { id: 1, name: cnP2.registros[0].count },
    { id: 2, name: cnP3.registros[0].count },
    { id: 3, name: cnP4.registros[0].count },
    { id: 4, name: cnP5.registros[0].count },
  ];
  cargado.value = true;
});
</script>
