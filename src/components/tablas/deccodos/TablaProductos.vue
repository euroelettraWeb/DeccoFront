<template>
  <v-container>
    <v-card>
      <v-row>
        <v-col v-if="cargado">
          <v-row>
            <v-col>
              <v-card-title>Productos</v-card-title>
            </v-col>
          </v-row>
          <v-row class="mx-2">
            <v-col>
              <v-simple-table dense>
                <template #default>
                  <thead>
                    <tr>
                      <th class="text-left">Tanque 1</th>
                      <th class="text-left">Tanque 2</th>
                      <th class="text-left">Tanque 3</th>
                      <th class="text-left">Tanque 4</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <v-text-field
                          v-model="tanque1"
                          prepend-icon="mdi-bottle-tonic"
                        ></v-text-field>
                      </td>
                      <td>
                        <v-text-field
                          v-model="tanque2"
                          prepend-icon="mdi-bottle-tonic"
                        ></v-text-field>
                      </td>
                      <td>
                        <v-text-field
                          v-model="tanque3"
                          prepend-icon="mdi-bottle-tonic"
                        ></v-text-field>
                      </td>
                      <td>
                        <v-text-field
                          v-model="tanque4"
                          prepend-icon="mdi-bottle-tonic"
                        ></v-text-field>
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-col>
          </v-row>
          <v-row>
            <v-col
              ><v-btn color="info" class="mx-4 mb-4" @click="save">
                <v-icon light> mdi-content-save </v-icon> Guardar
              </v-btn></v-col
            >
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
      </v-row> </v-card
  ></v-container>
</template>
<script>
export default {
  name: "TablaTurnos",
};
</script>
<script setup>
import axios from "axios";
import bd from "../../../helpers/bd";
import { computed, onMounted, ref } from "vue";
import { routerStore } from "../../../stores";

let cargado = ref(false);
let tanque1 = ref(null);

let tanque2 = ref(null);

let tanque3 = ref(null);

let tanque4 = ref(null);

let tanques = ref(null);

async function save() {
  let array = [tanque1.value, tanque2.value, tanque3.value, tanque4.value];
  let maquina = await bd.obtenerMaquina("lineaTipo", routerStore().lineasID, 2);
  if (!tanques.value) {
    for (let index = 0; index < array.length; index++) {
      const element = array[index];
      axios
        .post(`${process.env.VUE_APP_RUTA_API}/productos/nuevo`, {
          nombre: element,
          maquinaID: maquina[0].id,
        })
        .then(() => {});
    }
  } else {
    for (let index = 0; index < array.length; index++) {
      const element = array[index];
      axios
        .post(`${process.env.VUE_APP_RUTA_API}/productos/actualizar`, {
          nombre: element,
          id: tanques.value[index].id,
        })
        .then(() => {});
    }
  }
}

onMounted(async () => {
  cargado.value = false;
  let maquina = await bd.obtenerMaquina("lineaTipo", routerStore().lineasID, 2);
  let t = await bd.obtenerProductos("maquina", maquina[0].id);
  if (t.length > 1) {
    tanque1.value = t[0].nombre;
    tanque2.value = t[1].nombre;
    tanque3.value = t[2].nombre;
    tanque4.value = t[3].nombre;
    tanques.value = t;
  }
  cargado.value = true;
});
</script>
