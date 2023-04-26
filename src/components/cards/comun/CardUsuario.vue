<template>
  <v-row>
    <v-col>
      <!-- <v-switch v-model="activar" color="info" label="Usuario">
        Usuario
      </v-switch> -->
      <v-card
        ><!-- v-if="activar" -->
        <v-form ref="form">
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
                v-model="usuario"
                label="Usuario"
                required
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
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
  if (form.value.validate()) {
    await axios.post(
      `${process.env.VUE_APP_RUTA_API}/usuarios/nuevoOactualizar`,
      {
        nombre: username.value,
        usuario: usuario.value,
        password: password.value,
        rol: "Cliente",
        clienteID: routerStore().clienteID,
      }
    );
    routerStore().sistemas(routerStore().clienteID);
  }
}
onMounted(() => {});
</script>
