<template>
  <v-container fluid fill-height class="my-0 py-0">
    <v-row style="height: 100%">
      <v-col
        sm="12"
        md="6"
        lg="3"
        class="d-flex flex-column align-center"
        :style="{
          height: 'auto',
          margin: 'auto',
        }"
      >
        <v-col cols="12" class="d-flex flex-column align-center justify-start">
          <v-img src="logo_cliente.png" alt="Logo Decco" />
          <v-btn
            v-if="userStore().rol === 'ADMINISTRADOR'"
            class="mt-2 titulo"
            color="green"
            to="/cliente/nuevo"
            block
            style="height: 50px; font-size: calc(10px + 2vmin)"
          >
            Nuevo Cliente<v-icon x-large>mdi-plus</v-icon>
          </v-btn>
        </v-col>
      </v-col>
      <v-col
        sm="12"
        md="6"
        lg="9"
        :class="
          $vuetify.breakpoint.smAndDown
            ? 'd-flex flex-column justify-center align-center'
            : 'd-flex flex-row justify-center align-center'
        "
      >
        <v-row>
          <v-col
            v-for="item in nombres"
            :key="item.id"
            xs="12"
            lg="3"
            xl="3"
            class="mb-10 pa-2"
            :class="
              $vuetify.breakpoint.smAndDown
                ? 'd-flex flex-column justify-center align-center'
                : 'd-flex flex-row justify-center align-center'
            "
          >
            <CardCliente
              :id="item.id"
              :cliente="item.nombre"
              :src="item.src"
              :usuario-rol="userStore().rol"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "ClienteView",
};
</script>

<script setup>
import { obtenerClientes } from "../helpers/bd";
import CardCliente from "../components/cards/comun/CardCliente.vue";
import { onMounted, ref } from "vue";
import { userStore } from "../stores/index";

let clientes = [];
const nombres = ref([]);
const cargado = ref(false);

onMounted(async () => {
  cargado.value = false;
  clientes = await obtenerClientes();
  let clientesUsuarios = userStore().clienteUsuario;
  let clientesVisualizar = [];
  let lista = [];
  for (const clienteUsuario of clientesUsuarios) {
    for (const cliente of clientes) {
      if (clienteUsuario == null) {
        clientesVisualizar.push(cliente);
      } else if (cliente.id === clienteUsuario) {
        clientesVisualizar.push(cliente);
      }
    }
  }
  for (const iterator of clientesVisualizar) {
    lista.push({ id: iterator.id, nombre: iterator.nombre, src: iterator.img });
  }
  nombres.value = lista;
  cargado.value = true;
});
</script>
