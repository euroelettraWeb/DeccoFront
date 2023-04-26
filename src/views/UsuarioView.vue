<template>
  <v-container fluid class="fill-height">
    <v-row>
      <v-col><CardUsuario /> </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  name: "UsuarioView",
};
</script>
<script setup>
import CardUsuario from "../components/cards/comun/CardUsuario.vue";
</script>
