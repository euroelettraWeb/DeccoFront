<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card>
          <v-row>
            <v-col v-if="cargado">
              <v-row>
                <v-col>
                  <v-card-title>Estado actual</v-card-title>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="mx-4 mb-4">
                  <v-simple-table dense>
                    <template #default>
                      <thead>
                        <tr>
                          <th class="text-left"></th>
                          <th class="text-left">L4</th>
                          <th class="text-left">L5</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="item in consumos" :key="item.id">
                          <td>
                            {{ item.name }}
                          </td>
                          <td v-for="child in item.lineas" :key="child.idLinea">
                            {{ child.valor }}
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
  name: "TablaInforme",
};
</script>
<script setup>
import {
  obtenerDatosVariableGeneral,
  obtenerMaquina,
} from "../../../helpers/bd";
import bd from "../../../helpers/bd";
import { onMounted, ref } from "vue";

let consumos = ref([]);
let cargado = ref(false);

onMounted(async () => {
  cargado.value = false;
  let maquinaID = (await obtenerMaquina("lineaTipo", 1, 1))[0].id;
  let ultimos = await obtenerDatosVariableGeneral(
    "24H",
    "ultimo",
    "individual",
    "sinfiltro",
    [25, 26, 27, 28, 29, 30, 18, 19],
    maquinaID,
    routerStore().clienteID
  );

  consumos.value = [];
  for (let index = 0; index < ultimos.length; index++) {
    const element = ultimos[index];
    consumos.value.push({
      id: index,
      name: element.nombreCorto,
      lineas: { idLinea: "L4", valor: element.registros[0].y },
    });
  }
  // consumos.value = [
  //   {
  //     id: 0,
  //     name: "Total agua",
  //     lineas: [
  //       { idLinea: "L4", valor: agua.registros[0].y },
  //       { idLinea: "L5", valor: agua.registros[0].y },
  //     ],
  //   },
  //   {
  //     id: 1,
  //     name: "Total producto 1",
  //     lineas: [
  //       { idLinea: "L4", valor: totalP1.registros[0].y },
  //       { idLinea: "L5", valor: totalP1.registros[0].y },
  //     ],
  //   },
  //   {
  //     id: 2,
  //     name: "Total producto 2",
  //     lineas: [
  //       { idLinea: "L4", valor: totalP2.registros[0].y },
  //       { idLinea: "L5", valor: totalP2.registros[0].y },
  //     ],
  //   },
  //   {
  //     id: 3,
  //     name: "Total producto 3",
  //     lineas: [
  //       { idLinea: "L4", valor: totalP3.registros[0].y },
  //       { idLinea: "L5", valor: totalP3.registros[0].y },
  //     ],
  //   },
  //   {
  //     id: 4,
  //     name: "Total producto 4",
  //     lineas: [
  //       { idLinea: "L4", valor: totalP4.registros[0].y },
  //       { idLinea: "L5", valor: totalP4.registros[0].y },
  //     ],
  //   },
  //   {
  //     id: 5,
  //     name: "Total producto 5",
  //     lineas: [
  //       { idLinea: "L4", valor: totalP5.registros[0].y },
  //       { idLinea: "L5", valor: totalP5.registros[0].y },
  //     ],
  //   },
  //   {
  //     id: 6,
  //     name: "Total kilos",
  //     lineas: [
  //       { idLinea: "L4", valor: tKg.registros[0].y },
  //       { idLinea: "L5", valor: tKg.registros[0].y },
  //     ],
  //   },
  //   {
  //     id: 7,
  //     name: "Total cajas",
  //     lineas: [
  //       { idLinea: "L4", valor: tCajas.registros[0].y },
  //       { idLinea: "L5", valor: tCajas.registros[0].y },
  //     ],
  //   },
  // ];
  cargado.value = true;
});
</script>
