<template>
  <v-container fluid class="fill-height">
    <v-row justify="center">
      <v-col>
        <v-card>
          <v-card-title>Cliente</v-card-title>
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
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row
                ><v-col>
                  <v-btn color="info" class="mr-4" @click="validate">
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
import bd from "../../helpers/bd";
import axios from "axios";
import { routerStore } from "../../stores/index";
import { ref, onMounted } from "vue";
let nombre = ref("");
let src = ref("");
let form = ref(null);
let ip = ref("");
let puerto = ref("");
let usuario = ref("");
let contraseña = ref("");
let descripcion = ref("");
let rules = [
  (v) => {
    if (v) return v.length <= 500 || "maximum 500 characters";
    else return true;
  },
];
let cliente = [];
let plc = [];
let plcId = ref(0);

onMounted(async () => {
  cliente = await bd.obtenerCliente(routerStore().clienteID);
  plc = await bd.obtenerClientePLC(routerStore().clienteID);
  nombre.value = cliente[0].nombre;
  src.value = cliente[0].img;
  ip.value = plc[0].ip;
  puerto.value = plc[0].puerto;
  usuario.value = plc[0].usuario;
  contraseña.value = plc[0].password;
  descripcion.value = plc[0].descripcion;
});

async function validate() {
  if (form.value.validate()) {
    let dataPlc = (
      await axios.post(`${process.env.VUE_APP_RUTA_API}/plcs/actualizar`, {
        id: plcId.value,
        ip: ip.value,
        puerto: puerto.value,
        usuario: usuario.value,
        password: contraseña.value,
        descripcion: descripcion.value,
      })
    ).data;
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
