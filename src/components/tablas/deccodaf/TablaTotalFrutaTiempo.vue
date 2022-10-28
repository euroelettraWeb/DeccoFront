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
                      <th class="text-left"></th>
                      <th class="text-left">Kg Fruta</th>
                      <th class="text-left">H marcha</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>T. mañana</td>
                      <td v-for="item in consumosM" :key="item.id">
                        {{ item.name }}
                      </td>
                    </tr>
                    <tr>
                      <td>T. tarde</td>
                      <td v-for="item in consumosT" :key="item.id">
                        {{ item.name }}
                      </td>
                    </tr>
                    <tr>
                      <td>T. noche</td>
                      <td v-for="item in consumosN" :key="item.id">
                        {{ item.name }}
                      </td>
                    </tr>
                    <tr>
                      <td>Total</td>
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

let consumosM = ref([]);
let consumosT = ref([]);
let consumosN = ref([]);
let consumos = ref([]);

let totalKilos = [];
let horasMarcha = [];

let totalKilosU = [];
let horasMarchaU = [];

let cargado = ref(false);

onMounted(async () => {
  cargado.value = false;
  totalKilos = await obtenerDatosVariable("8h", "primero", "sinfiltro", 19);
  horasMarcha = await obtenerDatosVariable("8h", "primero", "sinfiltro", 26);
  totalKilosU = await obtenerDatosVariable("8h", "ultimo", "sinfiltro", 19);
  horasMarchaU = await obtenerDatosVariable("8h", "ultimo", "sinfiltro", 26);

  consumosM.value = [
    { id: 0, name: totalKilosU.registros[0].y - totalKilos.registros[0].y },
    { id: 1, name: horasMarchaU.registros[0].y - horasMarcha.registros[0].y },
  ];
  consumosT.value = [
    { id: 0, name: totalKilosU.registros[0].y - totalKilos.registros[0].y },
    { id: 1, name: horasMarchaU.registros[0].y - horasMarcha.registros[0].y },
  ];
  consumosN.value = [
    { id: 0, name: totalKilosU.registros[0].y - totalKilos.registros[0].y },
    { id: 1, name: horasMarchaU.registros[0].y - horasMarcha.registros[0].y },
  ];
  consumos.value = [
    { id: 0, name: totalKilosU.registros[0].y - totalKilos.registros[0].y },
    { id: 1, name: horasMarchaU.registros[0].y - horasMarcha.registros[0].y },
  ];
  cargado.value = true;
});
</script>
