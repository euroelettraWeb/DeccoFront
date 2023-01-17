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
                      <th class="text-left">Producto 1</th>
                      <th class="text-left">Producto 2</th>
                      <th class="text-left">Producto 3</th>
                      <th class="text-left">Producto 4</th>
                      <th class="text-left">Producto 5</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <v-text-field
                          v-model="producto1"
                          prepend-icon="mdi-bottle-tonic"
                        ></v-text-field>
                      </td>
                      <td>
                        <v-text-field
                          v-model="producto2"
                          prepend-icon="mdi-bottle-tonic"
                        ></v-text-field>
                      </td>
                      <td>
                        <v-text-field
                          v-model="producto3"
                          prepend-icon="mdi-bottle-tonic"
                        ></v-text-field>
                      </td>
                      <td>
                        <v-text-field
                          v-model="producto4"
                          prepend-icon="mdi-bottle-tonic"
                        ></v-text-field>
                        <v-text-field
                          v-model="producto5"
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
  name: "TablaProductos",
};
</script>
<script setup>
import { obtenerMaquina } from "../../../helpers/bd";
import { onMounted, ref } from "vue";
import { routerStore } from "../../../stores";

let cargado = ref(false);
let producto1 = ref(null);

let producto2 = ref(null);

let producto3 = ref(null);

let producto4 = ref(null);

let producto5 = ref(null);

let productos = ref(null);

async function save() {
  let array = [
    producto1.value,
    producto2.value,
    producto3.value,
    producto4.value,
    producto5.value,
  ];
  let maquina = await obtenerMaquina("lineaTipo", routerStore().lineasID, 2);
  if (!productos.value) {
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
    let update = [];
    for (let index = 0; index < array.length; index++) {
      const element = array[index];
      update.push({
        nombre: element,
        id: tanques.value[index].id,
        activo: tanques.value[index].activo,
      });
    }
    axios.post(
      `${process.env.VUE_APP_RUTA_API}/productos/actualizar/multiple`,
      {
        productos: update,
      }
    );
  }
}

onMounted(async () => {
  cargado.value = false;
  let maquina = await obtenerMaquina("lineaTipo", routerStore().lineasID, 1);
  let t = await obtenerProductos("maquina", maquina[0].id);
  if (t.length > 1) {
    producto1.value = t[0].nombre;
    producto2.value = t[1].nombre;
    producto3.value = t[2].nombre;
    producto4.value = t[3].nombre;
    producto5.value = t[4].nombre;
    productos.value = t;
  }
  cargado.value = true;
});
</script>
