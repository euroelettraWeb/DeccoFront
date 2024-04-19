<template>
  <v-container fluid class="fill-height">
    <v-row justify="center">
      <v-col>
        <v-card>
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
                    label="Nueva contraseña (App)"
                    type="password"
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
                    outlined
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field
                    v-model="contraseñaPLC"
                    label="ContraseñaPLC (PLC)"
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
  name: "EditClienteForm",
};
</script>
<script setup>
import {
  obtenerUsuario,
  obtenerCliente,
  obtenerClientePLC,
} from "../../helpers/bd";
import axios from "axios";
import { routerStore } from "../../stores/index";
import { ref, onMounted } from "vue";
import CryptoJS from "crypto-js";
const nombre = ref("");
const src = ref("");
const usuario = ref("");
const contraseña = ref("");
const form = ref(null);
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
const plcId = ref(0);

onMounted(async () => {
  let cliente = await obtenerCliente(routerStore().clienteID);
  let plc = await obtenerClientePLC(routerStore().clienteID);
  let user = await obtenerUsuario(routerStore().clienteID);
  nombre.value = cliente[0].nombre;
  src.value = cliente[0].img;
  usuario.value = user[0] && user[0].usuario ? user[0].usuario : "";
  plcId.value = plc[0].id;
  ip.value = plc[0].ip;
  puerto.value = plc[0].puerto;
  usuarioPLC.value = plc[0].usuario;
  contraseñaPLC.value = plc[0].password;
  descripcion.value = plc[0].descripcion;
});

async function validate() {
  if (form.value.validate()) {
    axios.post(`${process.env.VUE_APP_RUTA_API}/plcs/actualizar`, {
      id: plcId.value,
      ip: ip.value,
      puerto: puerto.value,
      usuario: usuarioPLC.value,
      password: contraseñaPLC.value,
      descripcion: descripcion.value,
    });
    axios.post(`${process.env.VUE_APP_RUTA_API}/usuarios/actualizar`, {
      usuario: usuario.value,
      nombre: nombre.value,
      password: CryptoJS.MD5(contraseña.value).toString(),
      rol: "Cliente",
      clienteID: routerStore().clienteID,
    });
    let dataCliente = (
      await axios.post(`${process.env.VUE_APP_RUTA_API}/clientes/actualizar`, {
        id: routerStore().clienteID,
        nombre: nombre.value,
        src: src.value,
      })
    ).data;
    if (dataCliente[0].id) {
      routerStore().clienteID = dataCliente[0].id;
      routerStore().clienteNuevoLinea(dataCliente[0].id);
    } else {
      form.value.reset();
    }
  }
}

function reset() {
  form.value.reset();
}
</script>
