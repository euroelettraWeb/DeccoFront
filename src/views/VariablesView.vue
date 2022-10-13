<template>
  <v-container>
    <v-row>
      <v-col>
        <VariableCard />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  name: "VariablesView",
};
</script>
<script setup>
import VariableCard from "../components/cards/comun/VariableCard.vue";
</script>
