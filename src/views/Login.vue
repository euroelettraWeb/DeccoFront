<template>
  <v-container fluid fill-height>
    <v-row align="center" justify="center">
      <v-col
        xs="12"
        sm="8"
        md="6"
        lg="4"
        xl="3"
        class="login-form text-center text-xs-center fill-height"
      >
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
                color="info"
                block="block"
                type="submit"
                @click.prevent="loginSnackbar(datosLogin)"
              >
                Login
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
        <v-snackbar v-model="avisoLoginInvalido" :timeout="5000" color="error">
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
import { userStore } from "../stores/index";
import { reactive, computed } from "vue";
const datosLogin = reactive({
  usuario: "",
  password: "",
});
const avisoLoginInvalido = computed(() =>
  userStore().mensajeError != "" ? true : false
);

const loginSnackbar = (datos) => {
  userStore().login({
    datosLogin: datos,
    evento: {
      variableID: null,
      usuario: datos.usuario,
      descripcion: "Login",
      horaInicio: moment().format("YYYY-MM-DDTHH:mm:ss"),
    },
  });
  setTimeout(() => userStore().vaciarMensaje(), 5000);
};
</script>
