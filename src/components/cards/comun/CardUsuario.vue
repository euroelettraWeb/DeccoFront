<template>
  <v-row justify="center">
    <v-col cols="10">
      <!-- <v-switch v-model="activar" color="info" label="Usuario">
          Usuario
        </v-switch> -->
      <v-card
        ><!-- v-if="activar" -->
        <v-form ref="formUsuario">
          <v-row>
            <v-col class="ma-2">
              <v-text-field
                v-model="nombre"
                label="Nombre"
                required
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="ma-2">
              <v-text-field
                v-model="usuario"
                label="Usuario"
                required
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="ma-2">
              <v-text-field
                v-model="password"
                :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="[rules.required, rules.min]"
                :type="show1 ? 'text' : 'password'"
                name="input-10-1"
                label="Normal with hint text"
                hint="At least 8 characters"
                counter
                @click:append="show1 = !show1"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-form>
      </v-card>
      <v-row
        ><v-col>
          <v-btn color="info" class="mr-4" @click="validate">
            <v-icon light> mdi-content-save </v-icon> Guardar
          </v-btn>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>
<script>
export default {
  name: "CardUsuario",
};
</script>
<script setup>
import axios from "axios";
import { onMounted, ref } from "vue";
import { routerStore } from "../../../stores";
import { obtenerUsuario } from "../../../helpers/bd";
import CryptoJS from "crypto-js";

let formUsuario = ref(null);
let usuario = ref("");
let password = ref("");
let nombre = ref("");
// let activar = ref(false);
let show1 = ref(false);
let rules = ref({
  required: (value) => !!value || "Required.",
  min: (v) => v.length >= 6 || "Min 6 characters",
});
async function validate() {
  if (formUsuario.value.validate()) {
    await axios.post(
      `${process.env.VUE_APP_RUTA_API}/usuarios/nuevoOactualizar`,
      {
        nombre: nombre.value,
        usuario: usuario.value,
        password: CryptoJS.MD5(password.value).toString(),
        rol: "Cliente",
        clienteID: routerStore().clienteID,
      }
    );
    routerStore().sistemas(routerStore().clienteID);
  }
}
onMounted(async () => {
  let user = await obtenerUsuario(routerStore().clienteID);
  nombre.value = user.nombre;
  usuario.value = user.usuario;
});
</script>
