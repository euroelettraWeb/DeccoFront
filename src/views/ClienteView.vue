<template>
  <v-container fluid fill-height
    ><v-row>
      <v-col v-for="item in nombres" :key="item.id">
        <CardCliente
          :id="item.id"
          class="pa-2"
          :cliente="item.nombre"
          :src="item.src"
        />
      </v-col>
      <v-col>
        <v-card max-width="250" color="accent">
          <v-btn
            class="pa-2"
            color="accent"
            height="250"
            x-large
            to="/cliente/nuevo"
          >
            Nuevo Cliente<v-icon x-large>mdi-plus</v-icon>
          </v-btn>
        </v-card>
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
import axios from "axios";
import { routerStore } from "../stores/index";
import CardCliente from "../components/cards/comun/CardCliente.vue";
import { onMounted, ref, computed } from "vue";

const router = routerStore();

async function obtenerVariable() {
  return (await axios.get(`${process.env.VUE_APP_RUTA_API}/clientes/all`)).data;
}
let clientes = [];
let nombres = ref([]);
let cargado = ref(false);

onMounted(async () => {
  cargado.value = false;
  clientes = await obtenerVariable(); //TODO pasar cliente
  let lista = [];
  for (const iterator of clientes) {
    lista.push({ id: iterator.id, nombre: iterator.nombre, src: iterator.img });
  }
  nombres.value = lista;
  cargado.value = true;
});
</script>
