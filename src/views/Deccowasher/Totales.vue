<template>
  <v-container>
    <h1>DECCOWASHER</h1>
    <TotalesDAF />
    <TablaTotalProductos />
  </v-container>
</template>
<script>
export default {
  name: "TotalesView",
};
</script>
<script setup>
import TotalesDAF from "../../components/cards/deccowasher/TotalesWS.vue";
import TablaTotalProductos from "../../components/tablas/deccowasher/TablaTotalProductos.vue";
</script>
