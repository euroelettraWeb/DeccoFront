<template>
  <v-container>
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
import TotalesDAF from "../../components/cards/deccodaf/TotalesDAF.vue";
import TablaTotalProductos from "../../components/tablas/deccodaf/TablaTotalProductos.vue";
</script>
