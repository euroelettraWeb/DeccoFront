<template>
  <v-container fluid fill-height>
    <v-row align="center" justify="center">
      <v-col cols="3" class="login-form text-center text-xs-center fill-height">
        <h2 class="pa-5">Login</h2>
        <v-card color="deep-purple lighten-5" class="mb-1">
          <v-card-text>
            <v-form>
              <v-text-field
                v-model="datosLogin.usuario"
                prepend-icon="mdi-account"
                label="Nombre"
                type="text"
              >
              </v-text-field>
              <v-text-field
                v-model="datosLogin.password"
                prepend-icon="mdi-lock"
                label="Contraseña"
                type="password"
              >
              </v-text-field>
              <v-btn
                color="primary"
                block="block"
                type="submit"
                @click.prevent="loginSnackbar(datosLogin)"
              >
                Login
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
        <v-snackbar
          v-model="avisoLoginInvalido"
          :timeout="5000"
          color="red accent-2"
        >
          {{ userStore().mensajeError }}
          <template #action="{ attrs }">
            <v-btn text v-bind="attrs" @click="userStore().vaciarMensaje()">
              Cerrar
            </v-btn>
          </template>
        </v-snackbar>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "LoginView",
};
</script>
<script setup>
import moment from "moment";
import { storeToRefs } from "pinia";
import { userStore } from "../stores/index";
import { ref, reactive, computed } from "vue";
const datosLogin = reactive({
  usuario: "",
  password: "",
});
let avisoLoginInvalido = computed(() =>
  storeToRefs(userStore()).mensajeError.value != "" ? true : false
);

const evento = (datos) => {
  return {
    variableID: null,
    usuario: datos,
    descripcion: "Login",
    horaInicio: moment().format("YYYY-MM-DDTHH:mm:ss"),
  };
};
const loginSnackbar = (datos) => {
  userStore().login({
    datosLogin: datos /* , evento: evento(datos.usuario)  */,
  });
  setTimeout(() => userStore().vaciarMensaje(), 5000);
};
</script>
