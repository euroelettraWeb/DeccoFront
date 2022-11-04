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
                      <th
                        v-for="item in unidades"
                        :key="item.id"
                        class="text-left"
                      >
                        {{ item.nombre }}
                      </th>
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
                      <td>Total Hoy</td>
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
import { routerStore } from "../../../stores/index";

async function obtenerDatosVariable(clienteID, modo, variableID) {
  return (
    await axios.get(
      `${process.env.VUE_APP_RUTA_API}/variable/total/${clienteID}/${modo}/${variableID}`
    )
  ).data;
}

async function obtenerMarcha(modo, variables, operacion) {
  return (
    await axios.post(
      `${process.env.VUE_APP_RUTA_API}/variable/marcha/${modo}/${operacion}`,
      {
        variables,
      }
    )
  ).data;
}

let consumosM = ref([]);
let consumosT = ref([]);
let consumosN = ref([]);
let consumos = ref([]);
let unidades = ref([]);

let totalA2P = [];
let totalA3P = [];
let totalB1 = [];
let totalB2 = [];
let totalB3 = [];
let totalB4 = [];
let totalB5 = [];
let totalKilos = [];
let horasMarcha = [];
let cargado = ref(false);

onMounted(async () => {
  cargado.value = false;
  let clienteID = routerStore().clienteID;
  totalA2P = await obtenerDatosVariable(clienteID, "24H", 49);
  totalA3P = await obtenerDatosVariable(clienteID, "24H", 50);
  totalB1 = await obtenerDatosVariable(clienteID, "24H", 51);
  totalB2 = await obtenerDatosVariable(clienteID, "24H", 52);
  totalB3 = await obtenerDatosVariable(clienteID, "24H", 53);
  totalB4 = await obtenerDatosVariable(clienteID, "24H", 54);
  totalB5 = await obtenerDatosVariable(clienteID, "24H", 55);
  totalKilos = await obtenerDatosVariable(clienteID, "24H", 48);
  horasMarcha = await obtenerMarcha("8h", [31, 41, 43, 40, 42], "total");
  unidades.value = [
    { id: 0, nombre: "Aplicador 2 Discos (" + totalA2P.unidadMedida + ")" },
    { id: 1, nombre: "Aplicador 3 Discos (" + totalA3P.unidadMedida + ")" },
    { id: 2, nombre: "Bomba 1 (" + totalB1.unidadMedida + ")" },
    { id: 3, nombre: "Bomba 2 (" + totalB2.unidadMedida + ")" },
    { id: 4, nombre: "Bomba 3 (" + totalB3.unidadMedida + ")" },
    { id: 5, nombre: "Bomba 4 (" + totalB4.unidadMedida + ")" },
    { id: 6, nombre: "Bomba 5 (" + totalB5.unidadMedida + ")" },
    { id: 7, nombre: "Kg Fruta (" + totalKilos.unidadMedida + ")" },
    { id: 8, nombre: "Marcha ( min )" },
  ];
  consumosM.value = [
    { id: 0, name: Math.max(0, totalA2P.registros[0][0].total) },
    { id: 1, name: Math.max(0, totalA3P.registros[0][0].total) },
    { id: 2, name: Math.max(0, totalB1.registros[0][0].total) },
    { id: 3, name: Math.max(0, totalB2.registros[0][0].total) },
    { id: 4, name: Math.max(0, totalB3.registros[0][0].total) },
    { id: 5, name: Math.max(0, totalB4.registros[0][0].total) },
    { id: 6, name: Math.max(0, totalB5.registros[0][0].total) },
    { id: 7, name: Math.max(0, totalKilos.registros[0][0].total) },
    // { id: 8, name: Math.max(0, horasMarcha.registros[0][0].total) },
  ];
  consumosT.value = [
    { id: 0, name: Math.max(0, totalA2P.registros[1][0].total) },
    { id: 1, name: Math.max(0, totalA3P.registros[1][0].total) },
    { id: 2, name: Math.max(0, totalB1.registros[1][0].total) },
    { id: 3, name: Math.max(0, totalB2.registros[1][0].total) },
    { id: 4, name: Math.max(0, totalB3.registros[1][0].total) },
    { id: 5, name: Math.max(0, totalB4.registros[1][0].total) },
    { id: 6, name: Math.max(0, totalB5.registros[1][0].total) },
    { id: 7, name: Math.max(0, totalKilos.registros[1][0].total) },
    // { id: 8, name: Math.max(0, horasMarcha.registros[1][0].total) },
  ];
  consumosN.value = [
    { id: 0, name: Math.max(0, totalA2P.registros[2][0].total) },
    { id: 1, name: Math.max(0, totalA3P.registros[2][0].total) },
    { id: 2, name: Math.max(0, totalB1.registros[2][0].total) },
    { id: 3, name: Math.max(0, totalB2.registros[2][0].total) },
    { id: 4, name: Math.max(0, totalB3.registros[2][0].total) },
    { id: 5, name: Math.max(0, totalB4.registros[2][0].total) },
    { id: 6, name: Math.max(0, totalB5.registros[2][0].total) },
    { id: 7, name: Math.max(0, totalKilos.registros[2][0].total) },
    // { id: 8, name: Math.max(0, horasMarcha.registros[2][0].total) },
  ];
  consumos.value = [
    { id: 0, name: Math.max(0, totalA2P.registros[3][0].total) },
    { id: 1, name: Math.max(0, totalA3P.registros[3][0].total) },
    { id: 2, name: Math.max(0, totalB1.registros[3][0].total) },
    { id: 3, name: Math.max(0, totalB2.registros[3][0].total) },
    { id: 4, name: Math.max(0, totalB3.registros[3][0].total) },
    { id: 5, name: Math.max(0, totalB4.registros[3][0].total) },
    { id: 6, name: Math.max(0, totalB5.registros[3][0].total) },
    { id: 7, name: Math.max(0, totalKilos.registros[3][0].total) },
    { id: 8, name: Math.max(0, Math.round(horasMarcha.total / 60)) },
  ];
  cargado.value = true;
});
</script>
