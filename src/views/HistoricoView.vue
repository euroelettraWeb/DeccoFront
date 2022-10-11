<template>
  <v-container>
    <v-row>
      <v-col>
        <div><HistoricoCard /></div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  name: "HistoricoView",
};
</script>
<script setup>
import HistoricoCard from "../components/cards/comun/HistoricoCard.vue";
</script>
