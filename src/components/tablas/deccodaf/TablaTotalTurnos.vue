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
      `${process.env.VUE_APP_RUTA_API}/variable/total/${clienteID}/${modo}/${variableID}/0/0`
    )
  ).data;
}

async function obtenerMarcha(modo, variables, operacion, clienteID) {
  return (
    await axios.post(
      `${process.env.VUE_APP_RUTA_API}/variable/marcha/${modo}/${operacion}`,
      {
        variables,
        clienteID,
      }
    )
  ).data;
}

function negative(val) {
  return;
}
let consumosM = ref([]);
let consumosT = ref([]);
let consumosN = ref([]);
let consumos = ref([]);
let unidades = ref([]);

let agua = [];
let totalP1 = [];
let totalP2 = [];
let totalP3 = [];
let totalP4 = [];
let totalP5 = [];
let totalKilos = [];
let horasMarcha = [];
let cargado = ref(false);

onMounted(async () => {
  cargado.value = false;
  let clienteID = routerStore().clienteID;
  agua = await obtenerDatosVariable(clienteID, "24H", 25);
  totalP1 = await obtenerDatosVariable(clienteID, "24H", 26);
  totalP2 = await obtenerDatosVariable(clienteID, "24H", 27);
  totalP3 = await obtenerDatosVariable(clienteID, "24H", 28);
  totalP4 = await obtenerDatosVariable(clienteID, "24H", 29);
  totalP5 = await obtenerDatosVariable(clienteID, "24H", 30);
  totalKilos = await obtenerDatosVariable(clienteID, "24H", 19);
  horasMarcha = await obtenerMarcha("24H", [1, 12, 14], "total", clienteID);
  unidades.value = [
    { id: 0, nombre: "Agua (" + agua.unidadMedida + ")" },
    { id: 1, nombre: "Producto 1 (" + totalP1.unidadMedida + ")" },
    { id: 2, nombre: "Producto 2 (" + totalP2.unidadMedida + ")" },
    { id: 3, nombre: "Producto 3 (" + totalP3.unidadMedida + ")" },
    { id: 4, nombre: "Producto 4 (" + totalP4.unidadMedida + ")" },
    { id: 5, nombre: "Producto 5 (" + totalP5.unidadMedida + ")" },
    { id: 6, nombre: "Kg Fruta (" + totalKilos.unidadMedida + ")" },
    { id: 7, nombre: "Marcha ( min )" },
  ];
  consumosM.value = [
    { id: 0, name: Math.max(0, agua.registros[0][0].total) },
    { id: 1, name: Math.max(0, totalP1.registros[0][0].total) },
    { id: 2, name: Math.max(0, totalP2.registros[0][0].total) },
    { id: 3, name: Math.max(0, totalP3.registros[0][0].total) },
    { id: 4, name: Math.max(0, totalP4.registros[0][0].total) },
    { id: 5, name: Math.max(0, totalP5.registros[0][0].total) },
    { id: 6, name: Math.max(0, totalKilos.registros[0][0].total) },
    // { id: 7, name: Math.max(0, horasMarcha.total) },
  ];
  consumosT.value = [
    { id: 0, name: Math.max(0, agua.registros[1][0].total) },
    { id: 1, name: Math.max(0, totalP1.registros[1][0].total) },
    { id: 2, name: Math.max(0, totalP2.registros[1][0].total) },
    { id: 3, name: Math.max(0, totalP3.registros[1][0].total) },
    { id: 4, name: Math.max(0, totalP4.registros[1][0].total) },
    { id: 5, name: Math.max(0, totalP5.registros[1][0].total) },
    { id: 6, name: Math.max(0, totalKilos.registros[1][0].total) },
    // { id: 7, name: Math.max(0, horasMarcha.total) },
  ];
  consumosN.value = [
    { id: 0, name: Math.max(0, agua.registros[2][0].total) },
    { id: 1, name: Math.max(0, totalP1.registros[2][0].total) },
    { id: 2, name: Math.max(0, totalP2.registros[2][0].total) },
    { id: 3, name: Math.max(0, totalP3.registros[2][0].total) },
    { id: 4, name: Math.max(0, totalP4.registros[2][0].total) },
    { id: 5, name: Math.max(0, totalP5.registros[2][0].total) },
    { id: 6, name: Math.max(0, totalKilos.registros[2][0].total) },
    // { id: 7, name: Math.max(0, horasMarcha.total) },
  ];
  consumos.value = [
    { id: 0, name: Math.max(0, agua.registros[3][0].total) },
    { id: 1, name: Math.max(0, totalP1.registros[3][0].total) },
    { id: 2, name: Math.max(0, totalP2.registros[3][0].total) },
    { id: 3, name: Math.max(0, totalP3.registros[3][0].total) },
    { id: 4, name: Math.max(0, totalP4.registros[3][0].total) },
    { id: 5, name: Math.max(0, totalP5.registros[3][0].total) },
    { id: 6, name: Math.max(0, totalKilos.registros[3][0].total) },
    { id: 7, name: Math.max(0, Math.round(horasMarcha.total / 60)) },
  ];
  cargado.value = true;
});
</script>
