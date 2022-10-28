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
import { routerStore } from "../../../stores/index";

async function obtenerDatosVariable(clienteID, variableID) {
  return (
    await axios.get(
      `${process.env.VUE_APP_RUTA_API}/variable/total/${clienteID}/${variableID}`
    )
  ).data;
}

let consumosM = ref([]);
let consumosT = ref([]);
let consumosN = ref([]);
let consumos = ref([]);
let unidades = ref([]);

let agua = [];
let totalDesinfectante = [];
let totalJabon = [];

let totalKilos = [];
let horasMarcha = [];
let cargado = ref(false);

onMounted(async () => {
  cargado.value = false;
  let clienteID = routerStore().clienteID;
  agua = await obtenerDatosVariable(clienteID, 70);
  totalDesinfectante = await obtenerDatosVariable(clienteID, 71);
  totalJabon = await obtenerDatosVariable(clienteID, 72);

  totalKilos = await obtenerDatosVariable(clienteID, 69);
  horasMarcha = await obtenerDatosVariable(clienteID, 69);
  unidades.value = [
    { id: 0, nombre: "Agua (" + agua.unidadMedida + ")" },
    {
      id: 1,
      nombre: "Desinfectante 1 (" + totalDesinfectante.unidadMedida + ")",
    },
    { id: 2, nombre: "Jabon 2 (" + totalJabon.unidadMedida + ")" },
    { id: 3, nombre: "Kg Fruta (" + totalKilos.unidadMedida + ")" },
    { id: 4, nombre: "H marcha (" + horasMarcha.unidadMedida + ")" },
  ];
  consumosM.value = [
    { id: 0, name: agua.registros[0][0].total },
    { id: 1, name: totalDesinfectante.registros[0][0].total },
    { id: 2, name: totalJabon.registros[0][0].total },
    { id: 3, name: totalKilos.registros[0][0].total },
    { id: 4, name: horasMarcha.registros[0][0].total },
  ];
  consumosT.value = [
    { id: 0, name: agua.registros[1][0].total },
    { id: 1, name: totalDesinfectante.registros[1][0].total },
    { id: 2, name: totalJabon.registros[1][0].total },
    { id: 3, name: totalKilos.registros[1][0].total },
    { id: 4, name: horasMarcha.registros[1][0].total },
  ];
  consumosN.value = [
    { id: 0, name: agua.registros[2][0].total },
    { id: 1, name: totalDesinfectante.registros[2][0].total },
    { id: 2, name: totalJabon.registros[2][0].total },
    { id: 3, name: totalKilos.registros[2][0].total },
    { id: 4, name: horasMarcha.registros[2][0].total },
  ];
  consumos.value = [
    { id: 0, name: agua.registros[3][0].total },
    { id: 1, name: totalDesinfectante.registros[3][0].total },
    { id: 2, name: totalJabon.registros[3][0].total },
    { id: 3, name: totalKilos.registros[3][0].total },
    { id: 4, name: horasMarcha.registros[3][0].total },
  ];
  cargado.value = true;
});
</script>
