<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card>
          <v-row>
            <v-col v-if="cargado">
              <v-row>
                <v-col>
                  <v-card-title>Actividad en niveles de garrafas</v-card-title>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="mx-4 mb-4">
                  <v-simple-table dense>
                    <template #default>
                      <thead>
                        <tr>
                          <th></th>
                          <th class="text-left">Nivel Producto 1 (min)</th>
                          <th class="text-left">Nivel Producto 2 (min)</th>
                          <th class="text-left">Nivel Producto 3 (min)</th>
                          <th class="text-left">Nivel Producto 4 (min)</th>
                          <th class="text-left">Nivel Producto 5 (min)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Lleno</td>
                          <td v-for="item in niveles0" :key="item.id">
                            {{ item.name }}
                          </td>
                        </tr>
                        <tr>
                          <td>Vacio</td>
                          <td v-for="item in niveles1" :key="item.id">
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
import bd from "../../../helpers/bd";
import { onMounted, ref } from "vue";
import { routerStore } from "../../../stores/index";

let niveles0 = ref([]);
let niveles1 = ref([]);
let nivel = [];

let cargado = ref(false);

onMounted(async () => {
  cargado.value = false;
  let maquinaID = (
    await bd.obtenerMaquina("lineaTipo", routerStore().lineasID, 1)
  )[0].id;
  nivel = await bd.obtenerDatosVariableGeneral(
    "8H",
    "registros",
    "individual",
    "totalRangos",
    [20, 21, 22, 23, 24],
    maquinaID,
    routerStore().clienteID
  );

  for (let index = 0; index < nivel.length; index++) {
    let e = nivel[index].registros;
    niveles0.value.push({
      id: index,
      name: Math.max(0, Math.round(e.total0 / 60)),
    });
    niveles1.value.push({
      id: index,
      name: Math.max(0, Math.round(e.total1 / 60)),
    });
  }
  cargado.value = true;
});
</script>
