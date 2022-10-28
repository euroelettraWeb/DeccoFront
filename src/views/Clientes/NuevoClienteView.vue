<template>
  <v-container fluid class="fill-height"> <NuevoClienteForm /> </v-container>
</template>
<script>
export default {
  name: "NuevoCliente",
};
</script>
<script setup>
import NuevoClienteForm from "../../components/formularios/NuevoClienteForm.vue";
</script>
