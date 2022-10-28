<template>
  <v-container>
    <h1>DECCODOS</h1>
    <TotalesDOS />
    <TablaTotalProductos />
  </v-container>
</template>
<script>
export default {
  name: "TotalesView",
};
</script>
<script setup>
import TotalesDOS from "../../components/cards/deccodos/TotalesDOS.vue";
import TablaTotalProductos from "../../components/tablas/deccodos/TablaTotalProductos.vue";
</script>
