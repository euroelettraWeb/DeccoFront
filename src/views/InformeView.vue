<template>
  <v-container>
    <v-row>
      <v-col>
        <Informe />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  name: "InformeView",
};
</script>
<script setup>
import Informe from "../components/cards/comun/Informe.vue";
</script>
