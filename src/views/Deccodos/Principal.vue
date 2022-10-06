<template>
  <v-container>
    <v-row justify="center">
      <v-col>
        <CardCliente title="L4" />
      </v-col>
      <v-col><CardCliente title="L5" /> </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "DECCOWASHERPrincipal",
};
</script>
<script setup>
import CardCliente from "../../components/cards/comun/CardCliente.vue";
</script>
