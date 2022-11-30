<template>
  <v-container>
    <h1 class="transition-swing text-h2">
      {{ nombreCliente }} - DECCODOS - {{ nombreLinea }}
    </h1>
    <v-row>
      <v-col>
        <EstadoCepillo />
        <CajasComun :caja1="45" :caja2="46" :total="47" />
      </v-col>
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
import bd from "../../helpers/bd";
import { onMounted, ref } from "vue";
import CajasComun from "../../components/cards/comun/CajasComun.vue";
import EstadoCepillo from "../../components/cards/deccodos/EstadoCepillo.vue";

let nombreLinea = ref("");
let nombreCliente = ref("");
onMounted(async () => {
  nombreLinea.value = (await bd.obtenerLinea(routerStore().lineasID))[0].nombre;
  nombreCliente.value = (
    await bd.obtenerCliente(routerStore().clienteID)
  )[0].nombre;
});
</script>
