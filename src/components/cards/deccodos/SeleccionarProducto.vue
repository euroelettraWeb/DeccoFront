<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card class="mb-2"
          ><v-row>
            <v-col>
              <v-card-title>Aplicadores</v-card-title>
            </v-col>
          </v-row>
          <v-row>
            <v-col
              ><v-card-subtitle>1 - Bomba 1-2-3</v-card-subtitle>
              <v-select
                v-model="bomba1"
                :items="productos"
                item-text="nombre"
                item-value="id"
                return-object
                dense
                solo
              /> </v-col
            ><v-col
              ><v-card-subtitle>2 - Bomba 4-5</v-card-subtitle>
              <v-select
                v-model="bomba2"
                :items="productos"
                item-text="nombre"
                item-value="id"
                return-object
                dense
                solo
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col
              ><v-btn color="info" class="mx-4 mb-4" @click="save">
                <v-icon light> mdi-content-save </v-icon> Guardar
              </v-btn></v-col
            ></v-row
          >
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  name: "SeleccionarProductos",
};
</script>
<script setup>
import axios from "axios";
import bd from "../../../helpers/bd";
import { onMounted, ref } from "vue";
import { routerStore } from "../../../stores/index";

let cargado = ref(false);

let productos = ref(null);

let bomba1 = ref({});
let bomba2 = ref({});

onMounted(async () => {
  cargado.value = false;
  let maquina = await bd.obtenerMaquina("lineaTipo", routerStore().lineasID, 2);
  let t = await bd.obtenerProductos("maquina", maquina[0].id);
  for (let index = 0; index < t.length; index++) {
    if (t[index].activo == 0) {
      bomba1.value = t[index];
    } else if (t[index].activo == 1) {
      bomba2.value = t[index];
    }
  }
  if (bomba2.value == {}) bomba2.value = bomba1.value;
  productos.value = t;
  cargado.value = true;
});
async function save() {
  for (let i = 0; i < productos.value.length; i++) {
    if (productos.value[i].id == bomba1.value.id) {
      productos.value[i].activo = 0;
    } else if (productos.value[i].id == bomba2.value.id) {
      productos.value[i].activo = 1;
    } else {
      productos.value[i].activo = null;
    }
  }
  axios.post(`${process.env.VUE_APP_RUTA_API}/productos/actualizar/multiple`, {
    productos: productos.value,
  });
}
</script>
