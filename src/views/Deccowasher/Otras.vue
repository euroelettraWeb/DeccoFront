<template>
  <v-container>
    <h1 class="transition-swing text-h2">
      {{ nombreCliente }} - DECCOWASHER - {{ nombreLinea }}
    </h1>
    <v-row>
      <v-col> <EstadoBomba /> <Cajas /> </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "DECCOWASHERPrincipal",
};
</script>
<script setup>
import { routerStore } from "../../stores/index";
import axios from "axios";
import { onMounted, ref } from "vue";
import EstadoBomba from "../../components/cards/deccowasher/EstadoBomba.vue";
import Cajas from "../../components/cards/deccowasher/Cajas.vue";

async function obtenerLinea(id) {
  return (await axios.get(`${process.env.VUE_APP_RUTA_API}/lineas/${id}`)).data;
}
async function obtenerCliente(id) {
  return (await axios.get(`${process.env.VUE_APP_RUTA_API}/clientes/${id}`))
    .data;
}
let nombreLinea = ref("");
let nombreCliente = ref("");
onMounted(async () => {
  nombreLinea.value = (await obtenerLinea(routerStore().lineasID))[0].nombre;
  nombreCliente.value = (
    await obtenerCliente(routerStore().clienteID)
  )[0].nombre;
});
</script>
