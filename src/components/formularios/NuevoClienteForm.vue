<template>
  <v-container fluid class="fill-height">
    <v-row justify="center">
      <v-col>
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
                  <v-text-field
                    v-model="src"
                    label="src"
                    :rules="rules"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field v-model="ip" label="IP" required></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field
                    v-model="puerto"
                    label="Puerto"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field
                    v-model="usuario"
                    label="Usuario"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field
                    v-model="contraseña"
                    label="Contraseña"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field
                    v-model="descripcion"
                    label="Descripcion PLC"
                    :rules="rules"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row
                ><v-col>
                  <v-btn color="info" class="mr-4" @click="validate">
                    <v-icon light> mdi-content-save </v-icon> Guardar
                  </v-btn>
                </v-col>
                <v-col>
                  <v-btn color="error" class="mr-4" @click="reset">
                    Limpiar
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
  name: "NuevoClienteForm",
};
</script>
<script setup>
import axios from "axios";
import { routerStore } from "../../stores/index";
import { ref } from "vue";
const nombre = ref("");
const src = ref("");
const form = ref(null);
const ip = ref("");
const puerto = ref("");
const usuario = ref("");
const contraseña = ref("");
const descripcion = ref("");
let rules = [
  (v) => {
    if (v) return v.length <= 500 || "maximum 500 characters";
    else return true;
  },
];
async function validate() {
  if (form.value.validate()) {
    let dataCliente = (
      await axios.post(`${process.env.VUE_APP_RUTA_API}/clientes/nuevo`, {
        nombre: nombre.value,
        src: src.value,
      })
    ).data;
    await axios.post(`${process.env.VUE_APP_RUTA_API}/plcs/nuevo`, {
      ip: ip.value,
      puerto: puerto.value,
      usuario: usuario.value != "" ? usuario.value : "NULL",
      password: contraseña.value != "" ? contraseña.value : "NULL",
      descripcion: descripcion.value,
      clienteID: dataCliente[0].id,
    });
    routerStore().clienteID = dataCliente[0].id;
    routerStore().clienteNuevoLinea(dataCliente[0].id);
  }
}
function reset() {
  form.value.reset();
}
</script>
