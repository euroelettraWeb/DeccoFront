<template>
  <v-container fluid class="fill-height">
    <v-row justify="center">
      <v-col cols="5">
        <v-card>
          <v-card-title>Nuevo Cliente</v-card-title>
          <v-form ref="form">
            <v-container>
              <v-row>
                <v-col>
                  <v-text-field
                    v-model="nombre"
                    label="Nombre"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field v-model="src" label="Imagen"></v-text-field>
                </v-col>
              </v-row>
              <v-row
                ><v-col>
                  <v-btn color="info" class="mr-4" @click="validate">
                    Nuevo
                  </v-btn>
                </v-col>
                <v-col>
                  <v-btn color="error" class="mr-4" @click="reset">
                    Reset
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
  name: "NuevoCliente",
};
</script>
<script setup>
import axios from "axios";
import { routerStore } from "../../stores/index";
import { onMounted, ref, computed } from "vue";
let nombre = ref("");
let src = ref("");
let form = ref(null);
function validate() {
  if (form.value.validate()) {
    axios
      .post(`${process.env.VUE_APP_RUTA_API}/clientes/nuevo`, {
        nombre: nombre.value,
        src: src.value,
      })
      .then((res) => {
        console.log(res);
      });
    routerStore().cliente();
  }
}
function reset() {
  form.value.reset();
}
</script>
