<template>
  <v-container fluid class="fill-height">
    <v-row justify="center">
      <v-col cols="10">
        <v-card>
          <v-card-title>Editar Cliente</v-card-title>
          <v-form ref="form">
            <v-container>
              <v-row>
                <v-col>
                  <v-text-field
                    v-model="nombre"
                    label="Nombre"
                    required
                  ></v-text-field> </v-col
                ><v-col>
                  <v-text-field v-model="src" label="Imagen"></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col> <TablaLineas /> </v-col
              ></v-row>
              <v-row>
                <v-col> <TablaMaquinas /></v-col>
              </v-row>
              <v-row
                ><v-col>
                  <v-btn color="info" class="mr-4" @click="validate">
                    Guardar
                  </v-btn>
                </v-col>
                <v-col>
                  <v-btn color="error" class="mr-4" @click="reset">
                    Borrar
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  name: "EditarCliente",
};
</script>
<script setup>
import axios from "axios";
import { routerStore } from "../../stores/index";
import { onMounted, ref, computed } from "vue";
import TablaLineas from "../../components/tablas/comun/TablaLineas.vue";
import TablaMaquinas from "../../components/tablas/comun/TablaMaquinas.vue";
let nombre = ref("");
let src = ref("");
let form = ref(null);
let settings = ref(null);

let cliente = [];
onMounted(async () => {
  cliente = await obtenerVariable(routerStore().id);
  nombre.value = cliente[0].nombre;
  src.value = cliente[0].img;
});

function validate() {
  if (form.value.validate()) {
    axios
      .post(`${process.env.VUE_APP_RUTA_API}/clientes/actualizar`, {
        id: 1,
        nombre: nombre.value,
        src: src.value,
      })
      .then((res) => {
        console.log(res);
      });
    // routerStore().cliente();
  }
}
function reset() {
  form.value.reset();
}
async function obtenerVariable(id) {
  return (await axios.get(`${process.env.VUE_APP_RUTA_API}/clientes/${id}`))
    .data;
}
</script>
