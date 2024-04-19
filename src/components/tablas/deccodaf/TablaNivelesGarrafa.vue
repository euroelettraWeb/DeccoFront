<template>
  <v-row>
    <v-col>
      <v-switch
        v-model="mostrar"
        color="info"
        label="Actividad en niveles de garrafas"
        >Actividad en niveles de garrafas</v-switch
      >
      <v-card v-if="mostrar">
        <v-row>
          <v-col v-if="cargado">
            <v-row no-gutters>
              <v-col>
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
                        <td>Vacio</td>
                        <td v-for="item in niveles" :key="item.id">
                          {{ item.n0 }}
                        </td>
                      </tr>
                      <tr>
                        <td>Lleno</td>
                        <td v-for="item in niveles" :key="item.id">
                          {{ item.n1 }}
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
</template>
<script>
export default {
  name: "TablaNivelesGarrafa",
};
</script>
<script setup>
import {
  obtenerDatosVariableGeneral,
  obtenerMaquina,
} from "../../../helpers/bd";
import { onMounted, onUnmounted, ref } from "vue";
import { routerStore } from "../../../stores/index";

let interval = null;
let niveles = ref([]);
let cargado = ref(false);
let mostrar = ref(true);

const cargarDatos = async (maquinaID) => {
  let nivel = await obtenerDatosVariableGeneral(
    "24H",
    "registros",
    "individual",
    "totalRangos",
    [20, 21, 22, 23, 24],
    maquinaID,
    routerStore().clienteID
  );

  niveles.value = [];
  for (let index = 0; index < nivel.length; index++) {
    let e = nivel[index].registros;
    niveles.value.push({
      id: index,
      n0: Math.max(0, Math.round(e.total0 / 60)),
      n1: Math.max(0, Math.round(e.total1 / 60)),
    });
  }
};

onMounted(async () => {
  cargado.value = false;
  let maquinaID = (
    await obtenerMaquina("lineaTipo", routerStore().lineasID, 1)
  )[0].id;
  await cargarDatos(maquinaID);
  cargado.value = true;
  interval = setInterval(() => {
    cargarDatos(maquinaID);
  }, 90000);
});

onUnmounted(() => {
  clearInterval(interval);
  niveles.value = [];
});
</script>
