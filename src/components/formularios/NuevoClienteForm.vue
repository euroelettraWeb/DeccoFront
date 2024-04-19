<template>
  <v-container fluid class="fill-height">
    <v-row justify="center">
      <v-col>
        <v-card>
          <v-card-title class="display-1">Nuevo Cliente</v-card-title>
          <v-form ref="form">
            <v-container>
              <v-card-title class="headline">Datos Cliente</v-card-title>
              <v-row>
                <v-col>
                  <v-text-field
                    v-model="nombre"
                    label="Nombre"
                    required
                    outlined
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field
                    v-model="src"
                    label="src"
                    :rules="rules"
                    outlined
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field
                    v-model="usuario"
                    label="Usuario (App)"
                    required
                    outlined
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field
                    v-model="contraseña"
                    label="Contraseña (App)"
                    required
                    outlined
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-card-title class="headline">Datos PLC</v-card-title>
              <v-row>
                <v-col>
                  <v-text-field
                    v-model="ip"
                    label="IP"
                    required
                    outlined
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field
                    v-model="puerto"
                    label="Puerto"
                    required
                    outlined
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field
                    v-model="usuarioPLC"
                    label="UsuarioPLC (PLC)"
                    required
                    outlined
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field
                    v-model="contraseñaPLC"
                    label="ContraseñaPLC (PLC)"
                    required
                    outlined
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field
                    v-model="descripcion"
                    label="Descripcion (PLC)"
                    :rules="rules"
                    outlined
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row justify="space-between">
                <v-col cols="5">
                  <v-btn color="error" class="mr-4" block @click="reset">
                    Limpiar
                  </v-btn>
                </v-col>
                <v-col cols="5">
                  <v-btn color="info" class="mr-4" block @click="validate">
                    <v-icon light> mdi-content-save </v-icon> Guardar
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
import CryptoJS from "crypto-js";
const nombre = ref("");
const src = ref("");
const form = ref(null);
const usuario = ref("");
const contraseña = ref("");
const ip = ref("");
const puerto = ref("");
const usuarioPLC = ref("");
const contraseñaPLC = ref("");
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
      usuario: usuarioPLC.value != "" ? usuarioPLC.value : "NULL",
      password: contraseñaPLC.value != "" ? contraseñaPLC.value : "NULL",
      descripcion: descripcion.value,
      clienteID: dataCliente[0].id,
    });
    await axios.post(`${process.env.VUE_APP_RUTA_API}/usuarios/nuevo`, {
      usuario: usuario.value,
      nombre: nombre.value,
      password: CryptoJS.MD5(contraseña.value).toString(),
      rol: "Cliente",
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
