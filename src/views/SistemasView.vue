<template>
  <v-container fluid class="fill-height">
    <v-row justify="center">
      <v-col v-for="item in nombres" :key="item.nombre">
        <CardLineas :id="router.id" :title="item.nombre" :linea="item.linea" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "SistemasView",
};
</script>

<script setup>
import axios from "axios";
import { onMounted, ref, computed } from "vue";
import { routerStore } from "../stores/index";
import CardLineas from "../components/cards/comun/CardLineas.vue";
const router = routerStore();
async function obtenerVariable() {
  return (await axios.get(`${process.env.VUE_APP_RUTA_API}/linea/all`)).data;
}
let linea = [];
let nombres = ref([]);
let cargado = ref(false);

onMounted(async () => {
  cargado.value = false;
  linea = await obtenerVariable(); //TODO pasar cliente
  let lista = [];
  for (const iterator of linea) {
    lista.push({ linea: iterator.id, nombre: iterator.nombre });
  }
  nombres.value = lista;
  cargado.value = true;
});
</script>
